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
    address internal bob = address(0xB0B);

    function setUp() public {
        vm.startPrank(admin);
        resources = new Resources(admin, "ipfs://res/");
        drops = new RareDrops(admin, "ipfs://drop/");
        game = new FactoryGame(admin, address(resources), address(drops), bytes32("BUILDER_BASETYCOON"));

        resources.grantRole(resources.MINTER_ROLE(), address(game));
        resources.grantRole(resources.BURNER_ROLE(), address(game));
        drops.grantRole(drops.MINTER_ROLE(), address(game));
        vm.stopPrank();
    }

    // ---- helpers ----

    function _tap(address who, uint8 stage, uint8 sub) internal {
        vm.prank(who);
        game.tap(stage, sub);
    }

    function _tapMany(address who, uint8 stage, uint8 sub, uint256 times) internal {
        for (uint256 i = 0; i < times; i++) {
            vm.warp(block.timestamp + GameConstants.TAP_COOLDOWN);
            _tap(who, stage, sub);
        }
    }

    // ---- tests ----

    function test_FirstTapInitsStageOne() public {
        _tap(alice, 1, 0);
        (uint8 highestStage,, uint128 totalTaps, uint128 totalTx) = game.getPlayer(alice);
        assertEq(highestStage, 1);
        assertEq(totalTaps, 1);
        assertEq(totalTx, 1);
        assertEq(game.totalPlayers(), 1);

        // Mine 1/0 should be unlocked + producing
        (bool unlocked,, uint32 autoRate,,) = game.getMine(alice, 1, 0);
        assertTrue(unlocked);
        assertGt(autoRate, 0);
    }

    function test_TapMintsResources() public {
        _tap(alice, 1, 0);
        uint256 id = GameConstants.tokenId(1, 0);
        assertEq(resources.balanceOf(alice, id), 1);
    }

    function test_TapCooldownEnforced() public {
        _tap(alice, 1, 0);
        vm.expectRevert(FactoryGame.TapCooldown.selector);
        _tap(alice, 1, 0);
    }

    function test_LockedStageReverts() public {
        // Stage 2 not unlocked yet — but first tap initializes stage 1, so
        // a tap on stage 2 should revert with StageLocked(2).
        _tap(alice, 1, 0); // init
        vm.expectRevert(abi.encodeWithSelector(FactoryGame.StageLocked.selector, uint8(2)));
        vm.prank(alice);
        game.tap(2, 0);
    }

    function test_ClaimAccruesIdleProduction() public {
        _tap(alice, 1, 0); // init + start clock
        uint256 id = GameConstants.tokenId(1, 0);
        uint256 before = resources.balanceOf(alice, id);

        vm.warp(block.timestamp + 600); // 10 minutes
        uint256 pending = game.pendingProduction(alice, 1, 0);
        assertGt(pending, 0);

        vm.prank(alice);
        game.claim(1, 0);
        assertEq(resources.balanceOf(alice, id), before + pending);
    }

    function test_CombineBurnsAndMints() public {
        // Generate 10 of (1,0) via 10 taps
        _tapMany(alice, 1, 0, 10);
        uint256 fromId = GameConstants.tokenId(1, 0);
        uint256 toId = GameConstants.tokenId(1, 1);
        uint256 fromBefore = resources.balanceOf(alice, fromId);
        assertGe(fromBefore, 10);

        vm.prank(alice);
        game.combine(1, 0);

        assertEq(resources.balanceOf(alice, fromId), fromBefore - 10);
        assertEq(resources.balanceOf(alice, toId), 1);
    }

    function test_UpgradeMineConsumesResources() public {
        _tapMany(alice, 1, 0, 12);
        uint256 id = GameConstants.tokenId(1, 0);
        uint256 balBefore = resources.balanceOf(alice, id);

        vm.prank(alice);
        game.upgradeMine(1, 0);

        uint256 expectedCost = 10; // first upgrade: 10 × level1
        assertEq(resources.balanceOf(alice, id), balBefore - expectedCost);

        (, uint32 level, uint32 autoRate,,) = game.getMine(alice, 1, 0);
        assertEq(level, 2);
        assertGt(autoRate, 6_000);
    }

    function test_RollDropCooldown() public {
        // Need 5 of sub-tier 3. Easiest path: warp lots of idle production
        // on tier 0, combine repeatedly. We'll mint via test cheat instead.
        _tap(alice, 1, 0);
        uint256 id = GameConstants.tokenId(1, 3);
        vm.prank(address(game));
        resources.mint(alice, id, 10);

        vm.prank(alice);
        game.rollDrop();

        vm.expectRevert(FactoryGame.RollCooldown.selector);
        vm.prank(alice);
        game.rollDrop();
    }

    function test_PrestigeRequiresWorldTree() public {
        _tap(alice, 1, 0);
        vm.expectRevert(FactoryGame.PrestigeNotReady.selector);
        vm.prank(alice);
        game.prestige();
    }

    function test_PrestigeResetsAndMintsBadge() public {
        _tap(alice, 1, 0); // init
        // grant a World Tree directly
        uint256 worldTreeId = GameConstants.tokenId(6, 3);
        vm.prank(address(game));
        resources.mint(alice, worldTreeId, 1);

        vm.prank(alice);
        game.prestige();

        (uint8 highestStage, uint64 prestigeCount,,) = game.getPlayer(alice);
        assertEq(highestStage, 1);
        assertEq(prestigeCount, 1);
        assertEq(drops.balanceOf(alice), 1);
    }

    function test_TokenIdEncoding() public pure {
        assertEq(GameConstants.tokenId(1, 0), 10);
        assertEq(GameConstants.tokenId(3, 2), 32);
        assertEq(GameConstants.tokenId(6, 3), 63);
        (uint8 s, uint8 sub) = GameConstants.decode(42);
        assertEq(s, 4);
        assertEq(sub, 2);
    }

    function test_BuilderCodeSet() public {
        assertEq(game.builderCode(), bytes32("BUILDER_BASETYCOON"));
        vm.prank(admin);
        game.setBuilderCode(bytes32("NEW_CODE"));
        assertEq(game.builderCode(), bytes32("NEW_CODE"));
    }

    function test_PauseBlocksActions() public {
        vm.prank(admin);
        game.pause();
        vm.expectRevert();
        _tap(alice, 1, 0);
    }
}
