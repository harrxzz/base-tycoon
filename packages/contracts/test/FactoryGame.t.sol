// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {Resources} from "../src/Resources.sol";
import {RareDrops} from "../src/RareDrops.sol";
import {FactoryGame} from "../src/FactoryGame.sol";
import {GameConstants} from "../src/GameConstants.sol";

contract FactoryGameTest is Test {
    Resources internal resources;
    RareDrops internal drops;
    FactoryGame internal game;

    address internal admin = address(0xA11CE);
    address internal alice = address(0xA11);

    function setUp() public {
        vm.startPrank(admin);
        resources = new Resources(admin, "ipfs://res/");
        drops = new RareDrops(admin, "ipfs://drop/");
        game = new FactoryGame(admin, address(resources), address(drops), bytes32("BASE_TYCOON_V2"));

        resources.grantRole(resources.MINTER_ROLE(), address(game));
        resources.grantRole(resources.BURNER_ROLE(), address(game));
        drops.grantRole(drops.MINTER_ROLE(), address(game));
        vm.stopPrank();

        vm.warp(1_700_000_000);
    }

    // ---- helpers ----

    function _enroll(address who) internal {
        // Calling claim(1,1) auto-inits the player and harvests 0.
        vm.prank(who);
        game.claim(1, 1);
    }

    function _claim(address who, uint8 stage, uint8 step) internal {
        vm.prank(who);
        game.claim(stage, step);
    }

    function _build(address who, uint8 stage, uint8 step) internal {
        vm.prank(who);
        game.build(stage, step);
    }

    function _finalize(address who, uint8 stage, uint8 step) internal {
        vm.prank(who);
        game.finalize(stage, step);
    }

    function _adminMint(address who, uint8 stage, uint8 step, uint256 amt) internal {
        vm.prank(address(game));
        resources.mint(who, GameConstants.tokenId(stage, step), amt);
    }

    // ---- tests ----

    function test_TokenIdEncoding() public pure {
        assertEq(GameConstants.tokenId(1, 1), 101);
        assertEq(GameConstants.tokenId(1, 8), 108);
        assertEq(GameConstants.tokenId(6, 8), 608);
        (uint8 s, uint8 step) = GameConstants.decode(308);
        assertEq(s, 3);
        assertEq(step, 8);
    }

    function test_FirstClaimInitsPlayer() public {
        _enroll(alice);
        (uint8 highestStage,, uint128 totalTx,) = game.getPlayer(alice);
        assertEq(highestStage, 1);
        assertEq(totalTx, 1);
        assertEq(game.totalPlayers(), 1);

        (bool built, uint8 level,, uint64 lastClaim,) = game.getBuilding(alice, 1, 1);
        assertTrue(built);
        assertEq(level, 1);
        assertEq(lastClaim, block.timestamp);
    }

    function test_PendingProductionAccrues() public {
        _enroll(alice);
        // Step 1 base interval = 5s
        vm.warp(block.timestamp + 60);
        assertEq(game.pendingProduction(alice, 1, 1), 12);
    }

    function test_ClaimMintsExactInterval() public {
        _enroll(alice);

        vm.warp(block.timestamp + 11); // 11s / 5s = 2
        _claim(alice, 1, 1);

        uint256 id = GameConstants.tokenId(1, 1);
        assertEq(resources.balanceOf(alice, id), 2);

        // 1s remainder kept; 4s more = 1 unit
        vm.warp(block.timestamp + 4);
        assertEq(game.pendingProduction(alice, 1, 1), 1);
    }

    function test_BuildStep2_BurnsStep1AndStartsTimer() public {
        _enroll(alice);
        // Get 5 of step 1 by waiting 25s (5 intervals)
        vm.warp(block.timestamp + 25);
        _claim(alice, 1, 1);
        uint256 id1 = GameConstants.tokenId(1, 1);
        assertGe(resources.balanceOf(alice, id1), 5);

        uint256 balBefore = resources.balanceOf(alice, id1);
        _build(alice, 1, 2);
        assertEq(resources.balanceOf(alice, id1), balBefore - GameConstants.buildCost(2));

        (bool built,, uint64 endsAt,,) = game.getBuilding(alice, 1, 2);
        assertFalse(built);
        assertEq(endsAt, block.timestamp + GameConstants.buildTime(2));
    }

    function test_FinalizeBeforeReady_Reverts() public {
        _enroll(alice);
        vm.warp(block.timestamp + 25);
        _claim(alice, 1, 1);
        _build(alice, 1, 2);

        vm.expectRevert(FactoryGame.UnderConstruction.selector);
        _finalize(alice, 1, 2);
    }

    function test_FinalizeAfterReady_Succeeds() public {
        _enroll(alice);
        vm.warp(block.timestamp + 25);
        _claim(alice, 1, 1);
        _build(alice, 1, 2);

        vm.warp(block.timestamp + GameConstants.buildTime(2));
        _finalize(alice, 1, 2);

        (bool built, uint8 level,, uint64 lastClaim,) = game.getBuilding(alice, 1, 2);
        assertTrue(built);
        assertEq(level, 1);
        assertEq(lastClaim, block.timestamp);
    }

    function test_UpgradeReducesInterval() public {
        _enroll(alice);
        // Need 10 of step 1 to upgrade (cost = 10 × level1)
        vm.warp(block.timestamp + 50); // 10 units
        _claim(alice, 1, 1);

        uint64 baseInt = GameConstants.baseInterval(1);

        vm.prank(alice);
        game.upgrade(1, 1);

        (, uint8 level,,,) = game.getBuilding(alice, 1, 1);
        assertEq(level, 2);

        uint64 newInt = GameConstants.effectiveInterval(1, 2);
        assertLt(newInt, baseInt);
    }

    function test_UnlockStage2_RequiresFinalStep1() public {
        _enroll(alice);
        // Cheat: mint 10 of (1, 8) directly to alice + ensure step 8 is "built"
        // We can't fake "built" without going through normal flow, but we can
        // grant tokens and try to unlock — should fail PrereqMissing.
        _adminMint(alice, 1, 8, 10);

        vm.expectRevert(abi.encodeWithSelector(FactoryGame.PrereqMissing.selector, uint8(1), uint8(8)));
        vm.prank(alice);
        game.unlockStage(2);
    }

    function test_PrestigeRequiresFinalResource() public {
        _enroll(alice);
        vm.expectRevert(FactoryGame.PrestigeNotReady.selector);
        vm.prank(alice);
        game.prestige();
    }

    function test_PrestigeResetsAndMintsBadge() public {
        _enroll(alice);
        // Cheat: mint a (6, 8) World Tree
        _adminMint(alice, 6, 8, 1);

        vm.prank(alice);
        game.prestige();

        (uint8 highestStage, uint64 prestigeCount,,) = game.getPlayer(alice);
        assertEq(highestStage, 1);
        assertEq(prestigeCount, 1);
        assertEq(drops.balanceOf(alice), 1);
    }

    function test_RollDropCooldown() public {
        _enroll(alice);
        // Need 5 of (1, 8) for roll cost (highestStage = 1)
        _adminMint(alice, 1, 8, 10);

        vm.prank(alice);
        game.rollDrop();
        assertEq(drops.balanceOf(alice), 1);

        vm.expectRevert(FactoryGame.RollCooldown.selector);
        vm.prank(alice);
        game.rollDrop();

        // After 1h, can roll again
        vm.warp(block.timestamp + 1 hours);
        vm.prank(alice);
        game.rollDrop();
        assertEq(drops.balanceOf(alice), 2);
    }

    function test_PauseBlocksActions() public {
        vm.prank(admin);
        game.pause();
        vm.expectRevert();
        _claim(alice, 1, 1);
    }

    function test_BuilderCodeUpdate() public {
        assertEq(game.builderCode(), bytes32("BASE_TYCOON_V2"));
        vm.prank(admin);
        game.setBuilderCode(bytes32("NEW"));
        assertEq(game.builderCode(), bytes32("NEW"));
    }

    function test_TotalActionsTracked() public {
        _enroll(alice);
        assertEq(game.totalActions(), 1);
        vm.warp(block.timestamp + 25);
        _claim(alice, 1, 1);
        assertEq(game.totalActions(), 2);
        _build(alice, 1, 2);
        assertEq(game.totalActions(), 3);
    }
}
