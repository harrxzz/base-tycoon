/** Stage 3: Candy Factory — pixel art data */
import type { Pixel } from "./pixel-sprite";

const P = "#E91E63"; // pink
const M = "#F48FB1"; // light pink
const W = "#FFFFFF"; // white
const R = "#F44336"; // red
const G = "#4CAF50"; // green
const B = "#2196F3"; // blue
const D = "#3E2723"; // dark
const S = "#9E9E9E"; // steel
const C = "#795548"; // chocolate

// 1. Sugar Mill — factory with smokestacks
export const SUGAR_MILL: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Building
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 8, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 9, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 10, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 11, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 12, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 13, S] as Pixel),
  // Smokestacks
  [4,4,S],[4,5,S],[4,6,S],[4,7,S],
  [10,4,S],[10,5,S],[10,6,S],[10,7,S],
  // Smoke
  [4,3,"#BDBDBD"],[4,2,"#E0E0E0"],
  [10,3,"#BDBDBD"],[10,2,"#E0E0E0"],
  // Door
  [7,12,D],[7,13,D],
  // Sugar crystals
  [6,10,W],[8,10,W],[5,11,W],
];

// 2. Boiling Vat — big pot with bubbles
export const BOILING_VAT: Pixel[] = [
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Vat
  [4,8,S],[5,8,P],[6,8,P],[7,8,P],[8,8,P],[9,8,P],[10,8,S],
  [4,9,S],[5,9,P],[6,9,M],[7,9,P],[8,9,M],[9,9,P],[10,9,S],
  [4,10,S],[5,10,P],[6,10,P],[7,10,P],[8,10,P],[9,10,P],[10,10,S],
  [5,11,S],[6,11,S],[7,11,S],[8,11,S],[9,11,S],
  // Legs
  [5,12,S],[5,13,S],[9,12,S],[9,13,S],
  // Bubbles
  [6,7,M],[8,6,M],[7,5,M],
  // Fire
  [6,13,"#FF5722"],[7,13,"#FF9800"],[8,13,"#FF5722"],
];

// 3. Lollipop Line — conveyor with lollipops
export const LOLLIPOP_LINE: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Conveyor
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 12, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 13, "#616161"] as Pixel),
  // Lollipops on conveyor
  [4,11,R],[4,10,R],[4,9,"#795548"],
  [7,11,G],[7,10,G],[7,9,"#795548"],
  [10,11,B],[10,10,B],[10,9,"#795548"],
  // Machine
  [2,7,S],[3,7,S],[2,8,S],[3,8,S],[2,9,S],[3,9,S],[2,10,S],[3,10,S],[2,11,S],[3,11,S],
];

// 4. Choco Tempering — chocolate machine
export const CHOCO_TEMPERING: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Machine body
  [3,6,S],[4,6,S],[5,6,S],[6,6,S],[7,6,S],[8,6,S],[9,6,S],[10,6,S],[11,6,S],
  [3,7,C],[4,7,C],[5,7,C],[6,7,C],[7,7,C],[8,7,C],[9,7,C],[10,7,C],[11,7,C],
  [3,8,C],[4,8,C],[5,8,C],[6,8,C],[7,8,C],[8,8,C],[9,8,C],[10,8,C],[11,8,C],
  [3,9,S],[4,9,S],[5,9,S],[6,9,S],[7,9,S],[8,9,S],[9,9,S],[10,9,S],[11,9,S],
  // Legs
  [4,10,S],[4,11,S],[4,12,S],[4,13,S],
  [10,10,S],[10,11,S],[10,12,S],[10,13,S],
  // Chocolate bars output
  [6,11,C],[7,11,C],[8,11,C],
  [6,12,C],[7,12,C],[8,12,C],
];

// 5. Gummy Press — bear-shaped press
export const GUMMY_PRESS: Pixel[] = [
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Press machine top
  [4,5,S],[5,5,S],[6,5,S],[7,5,S],[8,5,S],[9,5,S],[10,5,S],
  [4,6,S],[10,6,S],
  // Hydraulic arms
  [4,7,S],[4,8,S],[10,7,S],[10,8,S],
  // Bear mold
  [6,8,R],[7,7,R],[8,8,R],[7,8,R],
  [6,9,R],[7,9,R],[8,9,R],
  [6,10,R],[8,10,R],
  // Base
  [4,11,S],[5,11,S],[6,11,S],[7,11,S],[8,11,S],[9,11,S],[10,11,S],
  [5,12,S],[5,13,S],[9,12,S],[9,13,S],
];

// 6. Gummy Dragons — dragon mold
export const GUMMY_DRAGONS: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Dragon shape (green gummy)
  [7,5,G],[8,5,G],
  [6,6,G],[7,6,G],[8,6,G],[9,6,G],
  [5,7,G],[6,7,G],[7,7,G],[8,7,G],[9,7,G],[10,7,G],
  [6,8,G],[7,8,G],[8,8,G],
  [5,9,G],[9,9,G], // legs
  // Breath fire
  [10,5,"#FF5722"],[11,5,"#FF9800"],[11,4,"#FFEB3B"],
  // Conveyor
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 11, S] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 12, "#616161"] as Pixel),
];

// 7. Cake Atelier — tiered cake
export const CAKE_ATELIER: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Building
  [2,5,M],[2,6,M],[2,7,M],[2,8,M],[2,9,M],[2,10,M],[2,11,M],[2,12,M],[2,13,M],
  [12,5,M],[12,6,M],[12,7,M],[12,8,M],[12,9,M],[12,10,M],[12,11,M],[12,12,M],[12,13,M],
  // Roof
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 4, P] as Pixel),
  ...[4,5,6,7,8,9,10].map(x => [x, 3, P] as Pixel),
  // Cake display inside
  [7,12,W],[7,11,M],[7,10,W],[6,12,M],[8,12,M],
  [6,11,M],[8,11,M],
  // Cherry on top
  [7,9,R],
  // Windows
  [4,7,"#FFE082"],[5,7,"#FFE082"],
  [9,7,"#FFE082"],[10,7,"#FFE082"],
];

// 8. Diamond Cake — crystal cake
export const DIAMOND_CAKE: Pixel[] = [
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 14, D] as Pixel),
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 15, D] as Pixel),
  // Grand pedestal
  [4,13,S],[5,13,S],[6,13,S],[7,13,S],[8,13,S],[9,13,S],[10,13,S],
  [5,12,S],[6,12,S],[7,12,S],[8,12,S],[9,12,S],
  // Tier 1 (bottom)
  [4,10,P],[5,10,M],[6,10,P],[7,10,M],[8,10,P],[9,10,M],[10,10,P],
  [4,11,P],[5,11,P],[6,11,P],[7,11,P],[8,11,P],[9,11,P],[10,11,P],
  // Tier 2
  [5,8,M],[6,8,P],[7,8,M],[8,8,P],[9,8,M],
  [5,9,P],[6,9,P],[7,9,P],[8,9,P],[9,9,P],
  // Tier 3 (top)
  [6,6,M],[7,6,P],[8,6,M],
  [6,7,P],[7,7,P],[8,7,P],
  // Diamond on top
  [7,4,"#B3E5FC"],[6,5,"#4FC3F7"],[7,5,"#4FC3F7"],[8,5,"#4FC3F7"],
  // Sparkles
  [3,6,"#FFF9C4"],[11,7,"#FFF9C4"],[7,2,"#FFF9C4"],
  [4,4,"#FFF9C4"],[10,3,"#FFF9C4"],
];

export const STAGE_3 = [
  SUGAR_MILL, BOILING_VAT, LOLLIPOP_LINE, CHOCO_TEMPERING,
  GUMMY_PRESS, GUMMY_DRAGONS, CAKE_ATELIER, DIAMOND_CAKE,
];
