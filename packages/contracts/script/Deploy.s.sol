// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {Resources} from "../src/Resources.sol";
import {RareDrops} from "../src/RareDrops.sol";
import {FactoryGame} from "../src/FactoryGame.sol";

/// @notice Deploys the Base Tycoon contract suite.
///
/// Usage (Base Sepolia):
///   forge script script/Deploy.s.sol \
///     --rpc-url base_sepolia \
///     --broadcast \
///     --verify \
///     --account <keystore-name>
///
/// Required env vars:
///   - BUILDER_CODE  (bytes32 builder attribution code)
///   - RESOURCES_URI (e.g. "ipfs://CID/{id}.json")
///   - DROPS_URI     (e.g. "ipfs://CID/")
contract DeployScript is Script {
    function run() external {
        bytes32 builderCode = vm.envOr("BUILDER_CODE", bytes32("BASE_TYCOON_V1"));
        string memory resourcesUri = vm.envOr(
            "RESOURCES_URI",
            string("ipfs://placeholder/{id}.json")
        );
        string memory dropsUri = vm.envOr("DROPS_URI", string("ipfs://placeholder/"));

        address deployer = msg.sender;
        console2.log("Deployer:", deployer);
        console2.log("Builder code (bytes32):");
        console2.logBytes32(builderCode);

        vm.startBroadcast();

        Resources resources = new Resources(deployer, resourcesUri);
        console2.log("Resources:", address(resources));

        RareDrops drops = new RareDrops(deployer, dropsUri);
        console2.log("RareDrops:", address(drops));

        FactoryGame game = new FactoryGame(
            deployer,
            address(resources),
            address(drops),
            builderCode
        );
        console2.log("FactoryGame:", address(game));

        // Wire up roles so the game can mint/burn resources and mint NFTs.
        resources.grantRole(resources.MINTER_ROLE(), address(game));
        resources.grantRole(resources.BURNER_ROLE(), address(game));
        drops.grantRole(drops.MINTER_ROLE(), address(game));

        vm.stopBroadcast();

        console2.log("---");
        console2.log("Deployment complete. Add to apps/web/src/lib/contracts.ts:");
        console2.log("  RESOURCES =", address(resources));
        console2.log("  DROPS     =", address(drops));
        console2.log("  GAME      =", address(game));
    }
}
