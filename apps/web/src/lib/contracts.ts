// Auto-update this file after each deploy. Source of truth for contract
// addresses + ABIs in the frontend.

import type { Address } from "viem";
import { baseSepolia } from "viem/chains";

export const ACTIVE_CHAIN = baseSepolia;
export const ACTIVE_CHAIN_ID = baseSepolia.id; // 84532

export const CONTRACTS = {
  resources: "0xF8CdE874383c97CACAC993dE344103336dF10477" as Address,
  drops: "0x4a27Be07308CE89aa347dc3e9cbbF21f832f3073" as Address,
  game: "0x116aB9E41d88468C4feBE3C03341EC4FE7b636b4" as Address,
} as const;

// ---------- ABIs ----------
// Hand-curated minimal ABIs for the calls the UI needs. Generated from the
// Foundry artifacts; trim to keep bundle small.

export const FACTORY_GAME_ABI = [
  // reads
  {
    type: "function",
    name: "getPlayer",
    stateMutability: "view",
    inputs: [{ name: "who", type: "address" }],
    outputs: [
      { name: "highestStage", type: "uint8" },
      { name: "prestigeCount", type: "uint64" },
      { name: "totalTaps", type: "uint128" },
      { name: "totalTx", type: "uint128" },
    ],
  },
  {
    type: "function",
    name: "getMine",
    stateMutability: "view",
    inputs: [
      { name: "who", type: "address" },
      { name: "stage", type: "uint8" },
      { name: "subTier", type: "uint8" },
    ],
    outputs: [
      { name: "unlocked", type: "bool" },
      { name: "level", type: "uint32" },
      { name: "autoRate", type: "uint32" },
      { name: "lastClaim", type: "uint64" },
      { name: "lastTap", type: "uint64" },
    ],
  },
  {
    type: "function",
    name: "pendingProduction",
    stateMutability: "view",
    inputs: [
      { name: "who", type: "address" },
      { name: "stage", type: "uint8" },
      { name: "subTier", type: "uint8" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalPlayers",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "builderCode",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
  },
  // writes
  {
    type: "function",
    name: "tap",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "subTier", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "subTier", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "upgradeMine",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "subTier", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "combine",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "fromSub", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "unlockStage",
    stateMutability: "nonpayable",
    inputs: [{ name: "nextStage", type: "uint8" }],
    outputs: [],
  },
  {
    type: "function",
    name: "prestige",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "rollDrop",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  // events
  {
    type: "event",
    name: "Tapped",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
      { name: "subTier", type: "uint8", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Claimed",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
      { name: "subTier", type: "uint8", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "MineUpgraded",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
      { name: "subTier", type: "uint8", indexed: false },
      { name: "newLevel", type: "uint32", indexed: false },
    ],
  },
  {
    type: "event",
    name: "StageUnlocked",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
    ],
  },
] as const;

export const RESOURCES_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOfBatch",
    stateMutability: "view",
    inputs: [
      { name: "accounts", type: "address[]" },
      { name: "ids", type: "uint256[]" },
    ],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const DROPS_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "tokenOfOwnerByIndex",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "meta",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      { name: "rarity", type: "uint8" },
      { name: "stage", type: "uint8" },
      { name: "mintedAt", type: "uint64" },
    ],
  },
] as const;

/** Encode (stage, subTier) into ERC-1155 token id. Mirrors GameConstants.sol. */
export function tokenId(stage: number, subTier: number): bigint {
  return BigInt(stage * 10 + subTier);
}
