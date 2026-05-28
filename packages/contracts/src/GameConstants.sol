// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Base Tycoon — Game Constants (v2)
/// @notice Idle factory tycoon. 6 stages × 8 steps = 48 resources.
///         No clicking grind — buildings produce passively over time.
///         Token id encoding: stage * 100 + step (step in [1..8]).
library GameConstants {
    uint8 internal constant STAGE_COUNT = 6;
    uint8 internal constant STEPS_PER_STAGE = 8;

    /// @notice Items of step 8 required to unlock the next stage.
    uint256 internal constant UNLOCK_COST = 10;

    /// @notice Cooldown for rolling rare NFT drops.
    uint64 internal constant ROLL_COOLDOWN = 1 hours;

    /// @notice Max upgrade level per building.
    uint32 internal constant MAX_LEVEL = 10;

    /// @notice Encode (stage, step) into a single ERC-1155 token id.
    /// @dev tokenId = stage * 100 + step, where stage in [1..6], step in [1..8].
    function tokenId(uint8 stage, uint8 step) internal pure returns (uint256) {
        require(stage >= 1 && stage <= STAGE_COUNT, "stage oob");
        require(step >= 1 && step <= STEPS_PER_STAGE, "step oob");
        return uint256(stage) * 100 + uint256(step);
    }

    function decode(uint256 id) internal pure returns (uint8 stage, uint8 step) {
        stage = uint8(id / 100);
        step = uint8(id % 100);
    }

    /// @notice Construction time in seconds for a given step (level 1 build).
    /// @dev Steps escalate: 10s → 30s → 1m → 3m → 10m → 30m → 1h → 2h.
    function buildTime(uint8 step) internal pure returns (uint64) {
        if (step == 1) return 10;
        if (step == 2) return 30;
        if (step == 3) return 60;
        if (step == 4) return 180;
        if (step == 5) return 600;
        if (step == 6) return 1800;
        if (step == 7) return 3600;
        if (step == 8) return 7200;
        revert("step oob");
    }

    /// @notice Base production interval (seconds per 1 unit at level 1).
    /// @dev Higher steps produce slower but their products are more valuable.
    function baseInterval(uint8 step) internal pure returns (uint64) {
        if (step == 1) return 5;     // 12 / min
        if (step == 2) return 15;    // 4 / min
        if (step == 3) return 30;    // 2 / min
        if (step == 4) return 60;    // 1 / min
        if (step == 5) return 180;   // 1 / 3min
        if (step == 6) return 600;   // 1 / 10min
        if (step == 7) return 1800;  // 1 / 30min
        if (step == 8) return 3600;  // 1 / hour
        revert("step oob");
    }

    /// @notice Build cost (units of step-1 resource). Step 1 is free.
    function buildCost(uint8 step) internal pure returns (uint256) {
        if (step == 1) return 0;
        if (step == 2) return 5;
        if (step == 3) return 8;
        if (step == 4) return 10;
        if (step == 5) return 12;
        if (step == 6) return 15;
        if (step == 7) return 20;
        if (step == 8) return 25;
        revert("step oob");
    }

    /// @notice Upgrade cost in same-step resource. Cost = 10 × current level.
    function upgradeCost(uint32 currentLevel) internal pure returns (uint256) {
        return uint256(currentLevel) * 10;
    }

    /// @notice Effective production interval for a given level.
    /// @dev Each level: rate × 1.5 → interval × 2/3. Floor at 1 second.
    function effectiveInterval(uint8 step, uint32 level) internal pure returns (uint64) {
        if (level == 0) return 0;
        uint256 it = uint256(baseInterval(step));
        for (uint32 i = 1; i < level; i++) {
            it = (it * 2) / 3;
            if (it < 1) it = 1;
        }
        return uint64(it);
    }
}
