// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title Base Tycoon — Rare Drops
/// @notice ERC-721 NFTs awarded from rolls + prestige milestones.
/// @dev Each NFT carries (rarity, stage) metadata so the frontend can render
///      the correct skin per drop.
contract RareDrops is ERC721Enumerable, AccessControl {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    enum Rarity {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary,
        Prestige
    }

    struct DropMeta {
        Rarity rarity;
        uint8 stage; // 0 = prestige badge, otherwise 1..6
        uint64 mintedAt;
    }

    mapping(uint256 => DropMeta) public meta;
    uint256 public nextId = 1;
    string private _baseTokenURI;

    event Minted(address indexed to, uint256 indexed id, Rarity rarity, uint8 stage);

    constructor(address admin, string memory baseUri_) ERC721("Base Tycoon Drops", "BTDRP") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _baseTokenURI = baseUri_;
    }

    function mintDrop(address to, Rarity rarity, uint8 stage)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256 id)
    {
        id = nextId++;
        meta[id] = DropMeta({rarity: rarity, stage: stage, mintedAt: uint64(block.timestamp)});
        _safeMint(to, id);
        emit Minted(to, id, rarity, stage);
    }

    function setBaseURI(string memory baseUri_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = baseUri_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
