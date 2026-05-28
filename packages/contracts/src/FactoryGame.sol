// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {Resources} from "./Resources.sol";
import {RareDrops} from "./RareDrops.sol";
import {GameConstants} from "./GameConstants.sol";

/// @title Base Tycoon — Factory Game v2 (Idle Tower)
/// @notice Vertical tower idle game. 6 stages × 8 steps. No clicking — each
///         building passively produces resources over time. Players: build
///         the next step, upgrade existing ones, claim, unlock new stages,
///         and roll for rare NFT drops.
///
/// Onchain actions (every one increments totalTx for leaderboard):
///   - build(stage, step)         : start construction (cost = step-1 resource)
///   - finalize(stage, step)      : complete a finished build (idempotent claim)
///   - claim(stage, step)         : harvest accrued production
///   - upgrade(stage, step)       : pay same-step cost to bump level
///   - unlockStage(nextStage)     : burn step-8 of prev stage
///   - prestige()                 : reset all, +multiplier, mint NFT
///   - rollDrop()                 : RNG NFT, hourly cooldown
contract FactoryGame is Ownable, ReentrancyGuard, Pausable {
    using GameConstants for uint8;

    // ---------- Types ----------

    struct Building {
        bool built;            // true once construction completed
        uint8 level;           // 1..MAX_LEVEL once built
        uint64 buildEndsAt;    // 0 if not under construction
        uint64 lastClaim;      // last harvest timestamp
        uint8 boostSlot;       // bitfield index of an applied boost (0 = none)
    }

    struct StageState {
        bool unlocked;
        // step (1..8) → building
        mapping(uint8 => Building) buildings;
    }

    struct Player {
        uint8 highestStage;       // highest stage unlocked (1..6)
        uint64 prestigeCount;
        uint64 lastRoll;
        uint128 totalTx;          // lifetime onchain actions
        uint128 totalProduced;    // lifetime resources claimed (any tier)
        // stage (1..6) → state
        mapping(uint8 => StageState) stages;
    }

    // ---------- Storage ----------

    Resources public immutable resources;
    RareDrops public immutable drops;
    bytes32 public builderCode;

    mapping(address => Player) private _players;
    uint256 public totalPlayers;
    uint256 public totalActions;

    // ---------- Events ----------

    event BuildStarted(address indexed player, uint8 stage, uint8 step, uint64 endsAt);
    event BuildFinalized(address indexed player, uint8 stage, uint8 step);
    event Claimed(address indexed player, uint8 stage, uint8 step, uint256 amount);
    event Upgraded(address indexed player, uint8 stage, uint8 step, uint8 newLevel);
    event StageUnlocked(address indexed player, uint8 stage);
    event Prestiged(address indexed player, uint64 newPrestigeCount);
    event DropRolled(address indexed player, uint256 indexed nftId, uint8 rarity, uint8 stage);
    event BuilderCodeSet(bytes32 code);

    // ---------- Errors ----------

    error StageLocked(uint8 stage);
    error StepOOB();
    error NotBuilt();
    error AlreadyBuilt();
    error UnderConstruction();
    error PrereqMissing(uint8 stage, uint8 step);
    error InsufficientResource(uint256 tokenId, uint256 have, uint256 need);
    error MaxLevel();
    error AlreadyUnlocked();
    error PrestigeNotReady();
    error RollCooldown();
    error InvalidStage();

    // ---------- Constructor ----------

    constructor(address admin, address resources_, address drops_, bytes32 builderCode_)
        Ownable(admin)
    {
        resources = Resources(resources_);
        drops = RareDrops(drops_);
        builderCode = builderCode_;
    }

    // ---------- Admin ----------

    function setBuilderCode(bytes32 code) external onlyOwner {
        builderCode = code;
        emit BuilderCodeSet(code);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // ---------- Public reads ----------

    function getPlayer(address who)
        external
        view
        returns (
            uint8 highestStage,
            uint64 prestigeCount,
            uint128 totalTx,
            uint128 totalProduced
        )
    {
        Player storage p = _players[who];
        return (p.highestStage, p.prestigeCount, p.totalTx, p.totalProduced);
    }

    function getBuilding(address who, uint8 stage, uint8 step)
        external
        view
        returns (
            bool built,
            uint8 level,
            uint64 buildEndsAt,
            uint64 lastClaim,
            uint8 boostSlot
        )
    {
        Building storage b = _players[who].stages[stage].buildings[step];
        return (b.built, b.level, b.buildEndsAt, b.lastClaim, b.boostSlot);
    }

    function isStageUnlocked(address who, uint8 stage) external view returns (bool) {
        return _players[who].stages[stage].unlocked;
    }

    /// @notice Calculate units pending claim for a built building.
    function pendingProduction(address who, uint8 stage, uint8 step)
        public
        view
        returns (uint256)
    {
        Building storage b = _players[who].stages[stage].buildings[step];
        if (!b.built || b.level == 0 || b.lastClaim == 0) return 0;
        uint64 interval = GameConstants.effectiveInterval(step, b.level);
        if (interval == 0) return 0;
        uint256 elapsed = block.timestamp - b.lastClaim;
        return elapsed / uint256(interval);
    }

    // ---------- Internal helpers ----------

    function _ensureStage(Player storage p, uint8 stage) internal view {
        if (stage < 1 || stage > GameConstants.STAGE_COUNT) revert InvalidStage();
        if (!p.stages[stage].unlocked) revert StageLocked(stage);
    }

    /// @dev Auto-init a new player on their very first action: unlock Stage 1
    ///      with Step 1 already built and producing.
    function _firstActionInit(Player storage p) internal {
        if (p.highestStage == 0) {
            p.highestStage = 1;
            StageState storage s1 = p.stages[1];
            s1.unlocked = true;
            Building storage b1 = s1.buildings[1];
            b1.built = true;
            b1.level = 1;
            b1.lastClaim = uint64(block.timestamp);
            unchecked {
                totalPlayers++;
            }
            emit StageUnlocked(msg.sender, 1);
            emit BuildFinalized(msg.sender, 1, 1);
        }
    }

    function _harvestInternal(Player storage p, uint8 stage, uint8 step)
        internal
        returns (uint256 amount)
    {
        Building storage b = p.stages[stage].buildings[step];
        if (!b.built) return 0;
        uint64 interval = GameConstants.effectiveInterval(step, b.level);
        if (interval == 0) return 0;
        uint256 elapsed = block.timestamp - b.lastClaim;
        amount = elapsed / uint256(interval);
        if (amount > 0) {
            // advance lastClaim by the exact amount harvested (no time loss)
            b.lastClaim += uint64(amount * uint256(interval));
            uint256 id = GameConstants.tokenId(stage, step);
            resources.mint(msg.sender, id, amount);
            unchecked {
                p.totalProduced += uint128(amount);
            }
        }
    }

    // ---------- Actions ----------

    /// @notice Start construction of (stage, step). Costs `buildCost(step)` of
    ///         (stage, step-1) resource. Construction completes after
    ///         `buildTime(step)` seconds — call `finalize` to lock in.
    function build(uint8 stage, uint8 step) external whenNotPaused nonReentrant {
        if (step < 1 || step > GameConstants.STEPS_PER_STAGE) revert StepOOB();
        Player storage p = _players[msg.sender];
        _firstActionInit(p);
        _ensureStage(p, stage);

        Building storage b = p.stages[stage].buildings[step];
        if (b.built) revert AlreadyBuilt();
        if (b.buildEndsAt != 0) revert UnderConstruction();

        // Step 1 of any stage is free; otherwise burn step-1 resource.
        if (step > 1) {
            // require previous step is built (and producing or claimable).
            if (!p.stages[stage].buildings[step - 1].built) {
                revert PrereqMissing(stage, step - 1);
            }
            uint256 cost = GameConstants.buildCost(step);
            uint256 prevId = GameConstants.tokenId(stage, step - 1);
            uint256 bal = resources.balanceOf(msg.sender, prevId);
            if (bal < cost) revert InsufficientResource(prevId, bal, cost);
            resources.burn(msg.sender, prevId, cost);
        }

        uint64 endsAt = uint64(block.timestamp) + GameConstants.buildTime(step);
        b.buildEndsAt = endsAt;

        unchecked {
            p.totalTx++;
            totalActions++;
        }
        emit BuildStarted(msg.sender, stage, step, endsAt);
    }

    /// @notice Mark a finished build as live. After this, the building starts
    ///         passively producing resources at its base interval.
    function finalize(uint8 stage, uint8 step) external whenNotPaused nonReentrant {
        if (step < 1 || step > GameConstants.STEPS_PER_STAGE) revert StepOOB();
        Player storage p = _players[msg.sender];
        _ensureStage(p, stage);

        Building storage b = p.stages[stage].buildings[step];
        if (b.built) revert AlreadyBuilt();
        if (b.buildEndsAt == 0) revert NotBuilt();
        if (block.timestamp < b.buildEndsAt) revert UnderConstruction();

        b.built = true;
        b.level = 1;
        b.lastClaim = uint64(block.timestamp);
        b.buildEndsAt = 0;

        unchecked {
            p.totalTx++;
            totalActions++;
        }
        emit BuildFinalized(msg.sender, stage, step);
    }

    /// @notice Harvest accrued production from a single building.
    function claim(uint8 stage, uint8 step) external whenNotPaused nonReentrant {
        if (step < 1 || step > GameConstants.STEPS_PER_STAGE) revert StepOOB();
        Player storage p = _players[msg.sender];
        _firstActionInit(p);
        _ensureStage(p, stage);

        Building storage b = p.stages[stage].buildings[step];
        if (!b.built) revert NotBuilt();
        uint256 amount = _harvestInternal(p, stage, step);

        unchecked {
            p.totalTx++;
            totalActions++;
        }
        emit Claimed(msg.sender, stage, step, amount);
    }

    /// @notice Upgrade a building. Costs (10 × current_level) same-step units.
    ///         Each level reduces production interval by ~33%.
    function upgrade(uint8 stage, uint8 step) external whenNotPaused nonReentrant {
        if (step < 1 || step > GameConstants.STEPS_PER_STAGE) revert StepOOB();
        Player storage p = _players[msg.sender];
        _ensureStage(p, stage);

        Building storage b = p.stages[stage].buildings[step];
        if (!b.built) revert NotBuilt();
        if (b.level >= GameConstants.MAX_LEVEL) revert MaxLevel();

        // Auto-claim before upgrade so player doesn't lose pending production
        // when interval changes.
        _harvestInternal(p, stage, step);

        uint256 cost = GameConstants.upgradeCost(b.level);
        uint256 id = GameConstants.tokenId(stage, step);
        uint256 bal = resources.balanceOf(msg.sender, id);
        if (bal < cost) revert InsufficientResource(id, bal, cost);
        resources.burn(msg.sender, id, cost);

        unchecked {
            b.level += 1;
            p.totalTx++;
            totalActions++;
        }
        emit Upgraded(msg.sender, stage, step, b.level);
    }

    /// @notice Unlock the next stage by burning UNLOCK_COST of step-8 of prev.
    function unlockStage(uint8 nextStage) external whenNotPaused nonReentrant {
        if (nextStage <= 1 || nextStage > GameConstants.STAGE_COUNT) revert InvalidStage();
        Player storage p = _players[msg.sender];
        uint8 prevStage = nextStage - 1;
        _ensureStage(p, prevStage);
        if (p.stages[nextStage].unlocked) revert AlreadyUnlocked();

        // Require prev stage's final step (8) to be built.
        if (!p.stages[prevStage].buildings[GameConstants.STEPS_PER_STAGE].built) {
            revert PrereqMissing(prevStage, GameConstants.STEPS_PER_STAGE);
        }

        uint256 finalId = GameConstants.tokenId(prevStage, GameConstants.STEPS_PER_STAGE);
        uint256 cost = GameConstants.UNLOCK_COST;
        uint256 bal = resources.balanceOf(msg.sender, finalId);
        if (bal < cost) revert InsufficientResource(finalId, bal, cost);
        resources.burn(msg.sender, finalId, cost);

        StageState storage ns = p.stages[nextStage];
        ns.unlocked = true;
        // Auto-build step 1 of new stage (free starter, just like Stage 1).
        Building storage starter = ns.buildings[1];
        starter.built = true;
        starter.level = 1;
        starter.lastClaim = uint64(block.timestamp);

        if (nextStage > p.highestStage) p.highestStage = nextStage;
        unchecked {
            p.totalTx++;
            totalActions++;
        }
        emit StageUnlocked(msg.sender, nextStage);
        emit BuildFinalized(msg.sender, nextStage, 1);
    }

    /// @notice Prestige. Requires owning at least 1 of stage-6 step-8.
    ///         Resets all stages, mints commemorative NFT, +1 prestigeCount.
    function prestige() external whenNotPaused nonReentrant {
        Player storage p = _players[msg.sender];
        uint256 finalId = GameConstants.tokenId(
            GameConstants.STAGE_COUNT,
            GameConstants.STEPS_PER_STAGE
        );
        if (resources.balanceOf(msg.sender, finalId) == 0) revert PrestigeNotReady();

        // Reset all stages.
        for (uint8 s = 1; s <= GameConstants.STAGE_COUNT; s++) {
            StageState storage st = p.stages[s];
            if (st.unlocked || s == 1) {
                st.unlocked = false;
                for (uint8 k = 1; k <= GameConstants.STEPS_PER_STAGE; k++) {
                    delete st.buildings[k];
                }
            }
        }
        // Re-init Stage 1 fresh.
        StageState storage s1 = p.stages[1];
        s1.unlocked = true;
        Building storage b1 = s1.buildings[1];
        b1.built = true;
        b1.level = 1;
        b1.lastClaim = uint64(block.timestamp);

        p.highestStage = 1;
        unchecked {
            p.prestigeCount += 1;
            p.totalTx++;
            totalActions++;
        }

        drops.mintDrop(msg.sender, RareDrops.Rarity.Prestige, 0);
        emit Prestiged(msg.sender, p.prestigeCount);
    }

    /// @notice Roll for a rare cosmetic NFT. Hourly cooldown. Burns 5 of the
    ///         highest stage's step-8 resource.
    function rollDrop() external whenNotPaused nonReentrant {
        Player storage p = _players[msg.sender];
        if (p.highestStage == 0) revert StageLocked(1);
        if (p.lastRoll != 0 && block.timestamp < p.lastRoll + GameConstants.ROLL_COOLDOWN) {
            revert RollCooldown();
        }
        p.lastRoll = uint64(block.timestamp);

        uint8 stage = p.highestStage;
        uint256 costId = GameConstants.tokenId(stage, GameConstants.STEPS_PER_STAGE);
        uint256 cost = 5;
        uint256 bal = resources.balanceOf(msg.sender, costId);
        if (bal < cost) revert InsufficientResource(costId, bal, cost);
        resources.burn(msg.sender, costId, cost);

        // Pseudo-random rarity.
        uint256 r = uint256(
            keccak256(abi.encodePacked(block.prevrandao, msg.sender, p.totalTx, block.timestamp))
        ) % 1000;
        RareDrops.Rarity rarity;
        if (r < 600) rarity = RareDrops.Rarity.Common;
        else if (r < 850) rarity = RareDrops.Rarity.Uncommon;
        else if (r < 950) rarity = RareDrops.Rarity.Rare;
        else if (r < 990) rarity = RareDrops.Rarity.Epic;
        else rarity = RareDrops.Rarity.Legendary;

        uint256 nftId = drops.mintDrop(msg.sender, rarity, stage);
        unchecked {
            p.totalTx++;
            totalActions++;
        }
        emit DropRolled(msg.sender, nftId, uint8(rarity), stage);
    }
}
