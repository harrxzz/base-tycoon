/** Stage 4: Crystal Sanctum — pixel art data */
import type { Pixel } from "./pixel-sprite";

const V = "#7C4DFF"; // violet
const P = "#CE93D8"; // light purple
const B = "#2196F3"; // blue
const T = "#4FC3F7"; // teal/light blue
const G = "#4CAF50"; // green
const D = "#1A1A2E"; // dark sanctum
const S = "#9E9E9E"; // stone
const Y = "#FFD54F"; // gold
const W = "#FFFFFF"; // white

// 1. Quarry — mine entrance
export const QUARRY: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, "#555"] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, "#444"] as Pixel),
  // Mountain
  [7,3,S],[6,4,S],[7,4,S],[8,4,S],
  [5,5,S],[6,5,S],[7,5,S],[8,5,S],[9,5,S],
  [4,6,S],[5,6,S],[6,6,S],[7,6,S],[8,6,S],[9,6,S],[10,6,S],
  [3,7,S],[4,7,S],[5,7,S],[6,7,S],[7,7,S],[8,7,S],[9,7,S],[10,7,S],[11,7,S],
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 8, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 9, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 10, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 11, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 12, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 13, S] as Pixel),
  // Cave entrance
  [6,11,D],[7,11,D],[8,11,D],
  [6,12,D],[7,12,D],[8,12,D],
  [6,13,D],[7,13,D],[8,13,D],
  // Crystal veins
  [5,8,V],[9,7,V],[4,10,T],[10,9,V],
];

// 2. Cutting Bench — workstation with gem
export const CUTTING_BENCH: Pixel[] = [
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Bench
  ...[4,5,6,7,8,9,10].map(x => [x, 10, S] as Pixel),
  [4,11,"#616161"],[4,12,"#616161"],[4,13,"#616161"],
  [10,11,"#616161"],[10,12,"#616161"],[10,13,"#616161"],
  // Crystal being cut
  [7,8,T],[6,9,T],[7,9,V],[8,9,T],
  // Tools
  [5,9,S],[9,8,S],
  // Sparkles
  [6,7,W],[8,7,W],[7,6,W],
];

// 3. Amethyst Vault — purple crystal room
export const AMETHYST_VAULT: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Vault walls
  [3,4,S],[3,5,S],[3,6,S],[3,7,S],[3,8,S],[3,9,S],[3,10,S],[3,11,S],[3,12,S],[3,13,S],
  [11,4,S],[11,5,S],[11,6,S],[11,7,S],[11,8,S],[11,9,S],[11,10,S],[11,11,S],[11,12,S],[11,13,S],
  // Ceiling
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 3, S] as Pixel),
  // Crystals inside
  [5,11,V],[5,10,V],[5,9,P],
  [7,12,V],[7,11,V],[7,10,V],[7,9,P],
  [9,11,V],[9,10,V],[9,9,P],
  // Glow
  [6,10,P],[8,10,P],
  // Vault door
  [7,13,Y],[7,12,Y],
];

// 4. Sapphire Lab — blue crystal lab
export const SAPPHIRE_LAB: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Lab walls
  [3,4,S],[3,5,S],[3,6,S],[3,7,S],[3,8,S],[3,9,S],[3,10,S],[3,11,S],[3,12,S],[3,13,S],
  [11,4,S],[11,5,S],[11,6,S],[11,7,S],[11,8,S],[11,9,S],[11,10,S],[11,11,S],[11,12,S],[11,13,S],
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 3, S] as Pixel),
  // Blue crystals
  [6,10,B],[7,10,B],[8,10,B],
  [6,11,B],[7,11,T],[8,11,B],
  [7,9,T],
  // Equipment
  [5,8,S],[5,9,S],[9,8,S],[9,9,S],
  [5,7,"#4FC3F7"],[9,7,"#4FC3F7"],
];

// 5. Emerald Forge — green crystal forge
export const EMERALD_FORGE: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Forge structure
  [3,5,S],[4,5,S],[5,5,S],[6,5,S],[7,5,S],[8,5,S],[9,5,S],[10,5,S],[11,5,S],
  [3,6,S],[11,6,S],[3,7,S],[11,7,S],[3,8,S],[11,8,S],[3,9,S],[11,9,S],
  [3,10,S],[4,10,S],[5,10,S],[6,10,S],[7,10,S],[8,10,S],[9,10,S],[10,10,S],[11,10,S],
  [4,11,S],[4,12,S],[4,13,S],[10,11,S],[10,12,S],[10,13,S],
  // Emerald crystals
  [6,7,G],[7,7,"#66BB6A"],[8,7,G],
  [6,8,G],[7,8,"#81C784"],[8,8,G],
  [7,6,"#A5D6A7"],
  // Fire
  [6,9,"#FF5722"],[7,9,"#FF9800"],[8,9,"#FF5722"],
];

// 6. Diamond Press — press machine
export const DIAMOND_PRESS: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Press frame
  [4,3,S],[5,3,S],[6,3,S],[7,3,S],[8,3,S],[9,3,S],[10,3,S],
  [4,4,S],[10,4,S],[4,5,S],[10,5,S],
  // Hydraulic
  [7,4,S],[7,5,S],[7,6,S],
  // Diamond
  [7,8,T],[6,9,T],[7,9,W],[8,9,T],
  [6,10,T],[7,10,T],[8,10,T],
  // Base
  [4,11,S],[5,11,S],[6,11,S],[7,11,S],[8,11,S],[9,11,S],[10,11,S],
  [5,12,S],[5,13,S],[9,12,S],[9,13,S],
  // Sparkle
  [7,7,W],[5,7,W],[9,7,W],
];

// 7. Reliquary — sacred pedestal
export const RELIQUARY: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Arch
  [4,4,S],[4,5,S],[4,6,S],[4,7,S],[4,8,S],[4,9,S],[4,10,S],[4,11,S],[4,12,S],[4,13,S],
  [10,4,S],[10,5,S],[10,6,S],[10,7,S],[10,8,S],[10,9,S],[10,10,S],[10,11,S],[10,12,S],[10,13,S],
  [5,3,S],[6,3,S],[7,3,S],[8,3,S],[9,3,S],
  // Pedestal
  [6,12,S],[7,12,S],[8,12,S],
  [6,13,S],[7,13,S],[8,13,S],
  // Crystal
  [7,8,V],[6,9,P],[7,9,V],[8,9,P],
  [7,10,V],[7,11,V],
  // Glow
  [7,7,W],[6,7,P],[8,7,P],[7,6,W],
];

// 8. Soul Crystal — floating orb
export const SOUL_CRYSTAL: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Pedestal
  [5,13,S],[6,13,S],[7,13,S],[8,13,S],[9,13,S],
  [6,12,S],[7,12,S],[8,12,S],
  [7,11,S],
  // Floating crystal orb
  [6,5,V],[7,5,P],[8,5,V],
  [5,6,V],[6,6,P],[7,6,W],[8,6,P],[9,6,V],
  [5,7,V],[6,7,P],[7,7,P],[8,7,P],[9,7,V],
  [6,8,V],[7,8,P],[8,8,V],
  // Energy beam
  [7,9,P],[7,10,V],
  // Glow aura
  [4,5,P],[10,5,P],[7,3,W],[4,8,P],[10,8,P],
  [3,6,W],[11,6,W],
];

export const STAGE_4 = [
  QUARRY, CUTTING_BENCH, AMETHYST_VAULT, SAPPHIRE_LAB,
  EMERALD_FORGE, DIAMOND_PRESS, RELIQUARY, SOUL_CRYSTAL,
];
