// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Base Tycoon — Game Constants
/// @notice Shared constants and helpers for stage / sub-tier encoding.
library GameConstants {
    /// @notice Number of progression stages (1..STAGE_COUNT).
    uint8 internal constant STAGE_COUNT = 6;

    /// @notice Sub-tiers per stage (0..SUB_TIERS-1).
    uint8 internal constant SUB_TIERS = 4;

    /// @notice Items required to combine into the next sub-tier.
    uint256 internal constant COMBINE_RATIO = 10;

    /// @notice Items of the final sub-tier required to unlock the next stage.
    uint256 internal constant UNLOCK_COST = 100;

    /// @notice Cooldown between manual taps on a single (stage, subTier).
    uint64 internal constant TAP_COOLDOWN = 2 seconds;

    /// @notice Cooldown for rolling rare NFT drops.
    uint64 internal constant ROLL_COOLDOWN = 1 hours;

    /// @notice Encode (stage, subTier) into a single ERC-1155 token id.
    /// @dev tokenId layout: stage * 10 + subTier, where stage in [1..6], subTier in [0..3].
    function tokenId(uint8 stage, uint8 subTier) internal pure returns (uint256) {
        require(stage >= 1 && stage <= STAGE_COUNT, "stage oob");
        require(subTier < SUB_TIERS, "subTier oob");
        return uint256(stage) * 10 + uint256(subTier);
    }

    /// @notice Decode a token id back into (stage, subTier).
    function decode(uint256 id) internal pure returns (uint8 stage, uint8 subTier) {
        stage = uint8(id / 10);
        subTier = uint8(id % 10);
    }
}
