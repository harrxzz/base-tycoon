// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

import {Resources} from "./Resources.sol";
import {RareDrops} from "./RareDrops.sol";
import {GameConstants} from "./GameConstants.sol";

/// @title Base Tycoon — Factory Game
/// @notice Core idle/factory game. All onchain actions live here so every
///         player tx attributes to a single contract address (good for
///         Base Builder Code attribution).
///
/// Tx-generating actions (each is one onchain tx, sponsored by Paymaster):
///   - tap(stage, subTier)        : mint 1 of (stage, subTier)
///   - claim(stage, subTier)      : harvest accumulated idle production
///   - upgradeMine(stage, subTier): boost autoRate, costs same-tier resources
///   - combine(stage, fromSub)    : 10× sub N → 1× sub N+1
///   - unlockStage(nextStage)     : burn 100× prev-stage final to unlock
///   - prestige()                 : reset state, +permanent multiplier
///   - rollDrop()                 : RNG NFT mint, hourly cooldown
contract FactoryGame is Ownable, ReentrancyGuard, Pausable {
    using GameConstants for uint8;

    // ---------- Types ----------

    struct MineState {
        uint32 level; // upgrade level (starts at 1 once stage unlocked)
        uint32 autoRate; // resources accrued per minute (× 1e3 for precision)
        uint64 lastClaim; // timestamp of last claim
        uint64 lastTap; // timestamp of last manual tap (cooldown gate)
    }

    struct StageState {
        bool unlocked;
        // subTier (0..3) → mine
        mapping(uint8 => MineState) mines;
    }

    struct Player {
        uint8 highestStage; // highest stage unlocked (0 if none)
        uint64 prestigeCount; // number of times prestiged
        uint64 lastRoll; // last rollDrop timestamp
        uint128 totalTaps; // lifetime taps (achievement)
        uint128 totalTx; // lifetime onchain actions (leaderboard signal)
        // stage (1..6) → state
        mapping(uint8 => StageState) stages;
    }

    // ---------- Storage ----------

    Resources public immutable resources;
    RareDrops public immutable drops;

    /// @notice Builder code attribution sink (CDP requires the smart wallet
    ///         UserOp to include a builder code; this contract emits it
    ///         per-action for indexers as a fallback).
    bytes32 public builderCode;

    mapping(address => Player) private _players;
    uint256 public totalPlayers;

    // ---------- Events ----------

    event Tapped(address indexed player, uint8 stage, uint8 subTier, uint256 amount);
    event Claimed(address indexed player, uint8 stage, uint8 subTier, uint256 amount);
    event MineUpgraded(address indexed player, uint8 stage, uint8 subTier, uint32 newLevel);
    event Combined(address indexed player, uint8 stage, uint8 fromSub, uint256 outputAmount);
    event StageUnlocked(address indexed player, uint8 stage);
    event Prestiged(address indexed player, uint64 newPrestigeCount);
    event DropRolled(address indexed player, uint256 indexed nftId, uint8 rarity, uint8 stage);
    event BuilderCodeSet(bytes32 code);

    // ---------- Errors ----------

    error StageLocked(uint8 stage);
    error TapCooldown();
    error RollCooldown();
    error InsufficientResource(uint256 tokenId, uint256 have, uint256 need);
    error InvalidSubTier();
    error AlreadyUnlocked();
    error PrestigeNotReady();

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
        returns (uint8 highestStage, uint64 prestigeCount, uint128 totalTaps, uint128 totalTx)
    {
        Player storage p = _players[who];
        return (p.highestStage, p.prestigeCount, p.totalTaps, p.totalTx);
    }

    function getMine(address who, uint8 stage, uint8 subTier)
        external
        view
        returns (bool unlocked, uint32 level, uint32 autoRate, uint64 lastClaim, uint64 lastTap)
    {
        Player storage p = _players[who];
        StageState storage s = p.stages[stage];
        MineState storage m = s.mines[subTier];
        return (s.unlocked, m.level, m.autoRate, m.lastClaim, m.lastTap);
    }

    /// @notice Calculate pending idle production for a (stage, subTier).
    function pendingProduction(address who, uint8 stage, uint8 subTier)
        public
        view
        returns (uint256)
    {
        Player storage p = _players[who];
        StageState storage s = p.stages[stage];
        if (!s.unlocked) return 0;
        MineState storage m = s.mines[subTier];
        if (m.autoRate == 0 || m.lastClaim == 0) return 0;
        uint256 elapsed = block.timestamp - m.lastClaim;
        // autoRate is per-minute × 1e3 precision
        return (elapsed * m.autoRate) / (60 * 1e3);
    }

    // ---------- Internal helpers ----------

    function _ensureUnlocked(Player storage p, uint8 stage) internal view {
        if (!p.stages[stage].unlocked) revert StageLocked(stage);
    }

    function _firstActionInit(Player storage p) internal {
        if (p.highestStage == 0) {
            p.highestStage = 1;
            // unlock Stage 1 with all 4 sub-tier mines at level 1
            StageState storage s1 = p.stages[1];
            s1.unlocked = true;
            for (uint8 i = 0; i < GameConstants.SUB_TIERS; i++) {
                s1.mines[i].level = 1;
                s1.mines[i].lastClaim = uint64(block.timestamp);
                // Tier 0 starts producing slowly to give players a free idle drip.
                if (i == 0) s1.mines[i].autoRate = 6_000; // 6 / min
            }
            unchecked {
                totalPlayers++;
            }
            emit StageUnlocked(msg.sender, 1);
        }
    }

    // ---------- Actions ----------

    /// @notice Manually tap a mine to mint 1 resource. Cooldown-gated.
    function tap(uint8 stage, uint8 subTier) external whenNotPaused nonReentrant {
        if (subTier >= GameConstants.SUB_TIERS) revert InvalidSubTier();
        Player storage p = _players[msg.sender];
        _firstActionInit(p);
        _ensureUnlocked(p, stage);

        MineState storage m = p.stages[stage].mines[subTier];
        if (m.lastTap != 0 && block.timestamp < m.lastTap + GameConstants.TAP_COOLDOWN) {
            revert TapCooldown();
        }
        m.lastTap = uint64(block.timestamp);

        uint256 amount = 1 + (m.level / 5); // small scaling with mine level
        uint256 id = GameConstants.tokenId(stage, subTier);
        resources.mint(msg.sender, id, amount);

        unchecked {
            p.totalTaps++;
            p.totalTx++;
        }
        emit Tapped(msg.sender, stage, subTier, amount);
    }

    /// @notice Claim accumulated idle production from a single mine.
    function claim(uint8 stage, uint8 subTier) external whenNotPaused nonReentrant {
        if (subTier >= GameConstants.SUB_TIERS) revert InvalidSubTier();
        Player storage p = _players[msg.sender];
        _ensureUnlocked(p, stage);

        uint256 amount = pendingProduction(msg.sender, stage, subTier);
        MineState storage m = p.stages[stage].mines[subTier];
        m.lastClaim = uint64(block.timestamp);

        if (amount > 0) {
            uint256 id = GameConstants.tokenId(stage, subTier);
            resources.mint(msg.sender, id, amount);
        }

        unchecked {
            p.totalTx++;
        }
        emit Claimed(msg.sender, stage, subTier, amount);
    }

    /// @notice Upgrade a mine's autoRate. Costs same-tier resources.
    /// @dev Cost = 10 × current_level same-tier units. Auto-rate scales linearly.
    function upgradeMine(uint8 stage, uint8 subTier) external whenNotPaused nonReentrant {
        if (subTier >= GameConstants.SUB_TIERS) revert InvalidSubTier();
        Player storage p = _players[msg.sender];
        _ensureUnlocked(p, stage);

        MineState storage m = p.stages[stage].mines[subTier];
        uint256 id = GameConstants.tokenId(stage, subTier);
        uint256 cost = 10 * uint256(m.level == 0 ? 1 : m.level);

        uint256 bal = resources.balanceOf(msg.sender, id);
        if (bal < cost) revert InsufficientResource(id, bal, cost);
        resources.burn(msg.sender, id, cost);

        unchecked {
            m.level += 1;
            // autoRate (× 1e3) increase: +500 per level for sub-tier 0,
            // scaled down for higher sub-tiers (they're rarer).
            uint32 baseGain = 500;
            if (subTier == 1) baseGain = 200;
            else if (subTier == 2) baseGain = 80;
            else if (subTier == 3) baseGain = 30;
            m.autoRate += baseGain;
            p.totalTx++;
        }
        emit MineUpgraded(msg.sender, stage, subTier, m.level);
    }

    /// @notice Combine 10 of (stage, fromSub) into 1 of (stage, fromSub+1).
    function combine(uint8 stage, uint8 fromSub) external whenNotPaused nonReentrant {
        if (fromSub >= GameConstants.SUB_TIERS - 1) revert InvalidSubTier();
        Player storage p = _players[msg.sender];
        _ensureUnlocked(p, stage);

        uint256 fromId = GameConstants.tokenId(stage, fromSub);
        uint256 toId = GameConstants.tokenId(stage, fromSub + 1);
        uint256 cost = GameConstants.COMBINE_RATIO;

        uint256 bal = resources.balanceOf(msg.sender, fromId);
        if (bal < cost) revert InsufficientResource(fromId, bal, cost);

        resources.burn(msg.sender, fromId, cost);
        resources.mint(msg.sender, toId, 1);

        unchecked {
            p.totalTx++;
        }
        emit Combined(msg.sender, stage, fromSub, 1);
    }

    /// @notice Unlock the next stage by burning 100× final-tier of prev stage.
    function unlockStage(uint8 nextStage) external whenNotPaused nonReentrant {
        Player storage p = _players[msg.sender];
        if (nextStage <= 1 || nextStage > GameConstants.STAGE_COUNT) revert InvalidSubTier();
        uint8 prevStage = nextStage - 1;
        _ensureUnlocked(p, prevStage);
        if (p.stages[nextStage].unlocked) revert AlreadyUnlocked();

        uint256 finalId = GameConstants.tokenId(prevStage, GameConstants.SUB_TIERS - 1);
        uint256 cost = GameConstants.UNLOCK_COST;
        uint256 bal = resources.balanceOf(msg.sender, finalId);
        if (bal < cost) revert InsufficientResource(finalId, bal, cost);
        resources.burn(msg.sender, finalId, cost);

        StageState storage ns = p.stages[nextStage];
        ns.unlocked = true;
        for (uint8 i = 0; i < GameConstants.SUB_TIERS; i++) {
            ns.mines[i].level = 1;
            ns.mines[i].lastClaim = uint64(block.timestamp);
        }
        // small starter rate on tier 0 of new stage
        ns.mines[0].autoRate = 3_000;

        if (nextStage > p.highestStage) p.highestStage = nextStage;
        unchecked {
            p.totalTx++;
        }
        emit StageUnlocked(msg.sender, nextStage);
    }

    /// @notice Prestige: reset all mines, +1 prestigeCount, mint a Prestige NFT.
    /// @dev Requires owning at least 1 World Tree (Stage 6 sub-tier 3).
    function prestige() external whenNotPaused nonReentrant {
        Player storage p = _players[msg.sender];
        uint256 worldTreeId = GameConstants.tokenId(GameConstants.STAGE_COUNT, GameConstants.SUB_TIERS - 1);
        if (resources.balanceOf(msg.sender, worldTreeId) == 0) revert PrestigeNotReady();

        // Reset all stage state except Stage 1.
        for (uint8 s = 2; s <= GameConstants.STAGE_COUNT; s++) {
            StageState storage st = p.stages[s];
            if (st.unlocked) {
                st.unlocked = false;
                for (uint8 i = 0; i < GameConstants.SUB_TIERS; i++) {
                    delete st.mines[i];
                }
            }
        }
        // Reset Stage 1 mines (keep unlocked).
        StageState storage s1 = p.stages[1];
        for (uint8 i = 0; i < GameConstants.SUB_TIERS; i++) {
            s1.mines[i].level = 1;
            s1.mines[i].autoRate = i == 0 ? 6_000 : 0;
            s1.mines[i].lastClaim = uint64(block.timestamp);
            s1.mines[i].lastTap = 0;
        }

        p.highestStage = 1;
        unchecked {
            p.prestigeCount += 1;
            p.totalTx++;
        }

        // Mint commemorative Prestige NFT (stage = 0 = prestige badge).
        drops.mintDrop(msg.sender, RareDrops.Rarity.Prestige, 0);

        emit Prestiged(msg.sender, p.prestigeCount);
    }

    /// @notice Roll for a rare NFT drop. Hourly cooldown. Burns 5 sub-tier-3
    ///         items of the player's highest stage as the cost.
    function rollDrop() external whenNotPaused nonReentrant {
        Player storage p = _players[msg.sender];
        if (p.highestStage == 0) revert StageLocked(1);
        if (p.lastRoll != 0 && block.timestamp < p.lastRoll + GameConstants.ROLL_COOLDOWN) {
            revert RollCooldown();
        }
        p.lastRoll = uint64(block.timestamp);

        uint8 stage = p.highestStage;
        uint256 costId = GameConstants.tokenId(stage, GameConstants.SUB_TIERS - 1);
        uint256 cost = 5;
        uint256 bal = resources.balanceOf(msg.sender, costId);
        if (bal < cost) revert InsufficientResource(costId, bal, cost);
        resources.burn(msg.sender, costId, cost);

        // Pseudo-random rarity. NOT secure RNG — fine for cosmetic drops.
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
        }
        emit DropRolled(msg.sender, nftId, uint8(rarity), stage);
    }
}
