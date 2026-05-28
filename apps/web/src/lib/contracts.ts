// Auto-update this file after each deploy. Source of truth for contract
// addresses + ABIs in the frontend.

import type { Address } from "viem";
import { baseSepolia } from "viem/chains";

export const ACTIVE_CHAIN = baseSepolia;
export const ACTIVE_CHAIN_ID = baseSepolia.id; // 84532

// Base Tycoon v2 — vertical tower idle game. Deployed 2026-05-28.
export const CONTRACTS = {
  resources: "0x9407425515E2F7644b0bb7B5B64F20057e33c155" as Address,
  drops: "0x2bb211838F3333b8F3DB6DC96AA9898A843f231b" as Address,
  game: "0x1D993B8826a902eaB9CC6AB4B0E1EA2DaF462d9B" as Address,
} as const;

// ---------- ABIs ----------

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
      { name: "totalTx", type: "uint128" },
      { name: "totalProduced", type: "uint128" },
    ],
  },
  {
    type: "function",
    name: "getBuilding",
    stateMutability: "view",
    inputs: [
      { name: "who", type: "address" },
      { name: "stage", type: "uint8" },
      { name: "step", type: "uint8" },
    ],
    outputs: [
      { name: "built", type: "bool" },
      { name: "level", type: "uint8" },
      { name: "buildEndsAt", type: "uint64" },
      { name: "lastClaim", type: "uint64" },
      { name: "boostSlot", type: "uint8" },
    ],
  },
  {
    type: "function",
    name: "isStageUnlocked",
    stateMutability: "view",
    inputs: [
      { name: "who", type: "address" },
      { name: "stage", type: "uint8" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "pendingProduction",
    stateMutability: "view",
    inputs: [
      { name: "who", type: "address" },
      { name: "stage", type: "uint8" },
      { name: "step", type: "uint8" },
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
    name: "totalActions",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // writes
  {
    type: "function",
    name: "build",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "step", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "finalize",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "step", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "step", type: "uint8" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "upgrade",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stage", type: "uint8" },
      { name: "step", type: "uint8" },
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
    name: "BuildStarted",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
      { name: "step", type: "uint8", indexed: false },
      { name: "endsAt", type: "uint64", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BuildFinalized",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
      { name: "step", type: "uint8", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Claimed",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
      { name: "step", type: "uint8", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "stage", type: "uint8", indexed: false },
      { name: "step", type: "uint8", indexed: false },
      { name: "newLevel", type: "uint8", indexed: false },
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
] as const;

export const DROPS_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/** Encode (stage, step) into ERC-1155 token id. Mirrors GameConstants.sol. */
export function tokenId(stage: number, step: number): bigint {
  return BigInt(stage * 100 + step);
}

// ---------- Game balance (mirrors GameConstants.sol) ----------

export const STEPS_PER_STAGE = 8;
export const STAGE_COUNT = 6;
export const MAX_LEVEL = 10;
export const UNLOCK_COST = 10n;

const BUILD_TIME_TABLE = [0, 10, 30, 60, 180, 600, 1800, 3600, 7200];
const BASE_INTERVAL_TABLE = [0, 5, 15, 30, 60, 180, 600, 1800, 3600];
const BUILD_COST_TABLE = [0n, 0n, 5n, 8n, 10n, 12n, 15n, 20n, 25n];

export function buildTime(step: number): number {
  return BUILD_TIME_TABLE[step] ?? 0;
}
export function baseInterval(step: number): number {
  return BASE_INTERVAL_TABLE[step] ?? 0;
}
export function buildCost(step: number): bigint {
  return BUILD_COST_TABLE[step] ?? 0n;
}
export function upgradeCost(currentLevel: number): bigint {
  return BigInt(currentLevel * 10);
}
export function effectiveInterval(step: number, level: number): number {
  if (level === 0) return 0;
  let it = baseInterval(step);
  for (let i = 1; i < level; i++) {
    it = Math.floor((it * 2) / 3);
    if (it < 1) it = 1;
  }
  return it;
}
