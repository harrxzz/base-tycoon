/** Stage 2: Café Empire — pixel art data */
import type { Pixel } from "./pixel-sprite";

const B = "#5C3A1E"; // brown
const W = "#8B6914"; // warm wood
const D = "#3E2723"; // dark
const G = "#2D5A1E"; // green
const L = "#4CAF50"; // leaf
const S = "#9E9E9E"; // steel
const Y = "#FFD54F"; // gold
const C = "#795548"; // cocoa
const CR = "#EFEBE9";// cream
const R = "#C62828"; // red

// 1. Cocoa Farm — tree with pods
export const COCOA_FARM: Pixel[] = [
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[4,5,6,7,8,9,10].map(x => [x, 15, D] as Pixel),
  // Trunk
  [7,10,B],[7,11,B],[7,12,B],[7,13,B],
  // Canopy
  [5,6,G],[6,6,G],[7,6,G],[8,6,G],[9,6,G],
  [4,7,G],[5,7,L],[6,7,L],[7,7,L],[8,7,L],[9,7,L],[10,7,G],
  [4,8,G],[5,8,L],[6,8,G],[7,8,L],[8,8,G],[9,8,L],[10,8,G],
  [5,9,G],[6,9,G],[7,9,G],[8,9,G],[9,9,G],
  // Pods
  [5,9,C],[9,9,C],[6,10,C],[8,10,C],
];

// 2. Bean Roaster — barrel with fire
export const BEAN_ROASTER: Pixel[] = [
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Roaster barrel
  [5,8,S],[6,8,S],[7,8,S],[8,8,S],[9,8,S],
  [5,9,C],[6,9,C],[7,9,C],[8,9,C],[9,9,C],
  [5,10,C],[6,10,C],[7,10,C],[8,10,C],[9,10,C],
  [5,11,S],[6,11,S],[7,11,S],[8,11,S],[9,11,S],
  // Legs
  [5,12,S],[5,13,S],[9,12,S],[9,13,S],
  // Handle
  [10,9,S],[11,9,S],[11,10,S],[10,10,S],
  // Fire below
  [6,13,"#FF5722"],[7,13,"#FF9800"],[8,13,"#FF5722"],
  [7,12,"#FFEB3B"],
  // Chimney smoke
  [7,7,S],[7,6,"#757575"],[7,5,"#9E9E9E"],
];

// 3. Grinder — gear machine
export const GRINDER: Pixel[] = [
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Machine body
  [5,7,S],[6,7,S],[7,7,S],[8,7,S],[9,7,S],
  [5,8,S],[6,8,"#616161"],[7,8,"#616161"],[8,8,"#616161"],[9,8,S],
  [5,9,S],[6,9,"#616161"],[7,9,S],[8,9,"#616161"],[9,9,S],
  [5,10,S],[6,10,"#616161"],[7,10,"#616161"],[8,10,"#616161"],[9,10,S],
  [5,11,S],[6,11,S],[7,11,S],[8,11,S],[9,11,S],
  // Hopper top
  [6,5,S],[7,5,S],[8,5,S],
  [6,6,S],[7,6,C],[8,6,S],
  // Legs
  [5,12,S],[5,13,S],[9,12,S],[9,13,S],
  // Output spout
  [7,12,C],[7,13,C],
];

// 4. Espresso Bar — coffee machine + cup
export const ESPRESSO_BAR: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Counter
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 10, W] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 11, B] as Pixel),
  [3,12,B],[3,13,B],[11,12,B],[11,13,B],
  // Machine
  [4,6,S],[5,6,S],[6,6,S],[7,6,S],
  [4,7,S],[5,7,"#616161"],[6,7,"#616161"],[7,7,S],
  [4,8,S],[5,8,S],[6,8,S],[7,8,S],
  [4,9,S],[5,9,S],[6,9,S],[7,9,S],
  // Cup
  [9,8,CR],[10,8,CR],[9,9,CR],[10,9,CR],[11,9,C],
  // Steam
  [9,6,"#BDBDBD"],[10,7,"#BDBDBD"],
];

// 5. Latte Lab — fancy cups + foam art
export const LATTE_LAB: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Counter
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 10, W] as Pixel),
  [3,11,B],[3,12,B],[3,13,B],[11,11,B],[11,12,B],[11,13,B],
  // Steamer
  [4,7,S],[5,7,S],[4,8,S],[5,8,S],[4,9,S],[5,9,S],
  [4,6,"#BDBDBD"],[5,5,"#9E9E9E"],
  // Cups
  [7,8,CR],[8,8,CR],[7,9,CR],[8,9,CR],
  [10,8,CR],[10,9,CR],
  // Heart latte art
  [7,7,"#F48FB1"],[8,7,"#F48FB1"],
];

// 6. House Blend — cozy shop
export const HOUSE_BLEND: Pixel[] = [
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Building
  [2,5,W],[2,6,W],[2,7,W],[2,8,W],[2,9,W],[2,10,W],[2,11,W],[2,12,W],[2,13,W],
  [12,5,W],[12,6,W],[12,7,W],[12,8,W],[12,9,W],[12,10,W],[12,11,W],[12,12,W],[12,13,W],
  // Roof
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 4, R] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 3, R] as Pixel),
  // Sign
  [5,6,Y],[6,6,Y],[7,6,Y],[8,6,Y],[9,6,Y],
  // Window
  [4,8,"#FFE082"],[5,8,"#FFE082"],[9,8,"#FFE082"],[10,8,"#FFE082"],
  // Door
  [7,12,D],[7,13,D],
  // Awning
  [5,10,C],[6,10,C],[7,10,C],[8,10,C],[9,10,C],
];

// 7. Specialty — premium shop with sign
export const SPECIALTY: Pixel[] = [
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Building
  [2,4,C],[2,5,C],[2,6,C],[2,7,C],[2,8,C],[2,9,C],[2,10,C],[2,11,C],[2,12,C],[2,13,C],
  [12,4,C],[12,5,C],[12,6,C],[12,7,C],[12,8,C],[12,9,C],[12,10,C],[12,11,C],[12,12,C],[12,13,C],
  // Roof
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 3, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 2, D] as Pixel),
  // Gold sign
  [4,5,Y],[5,5,Y],[6,5,Y],[7,5,Y],[8,5,Y],[9,5,Y],[10,5,Y],
  // Big windows
  [4,8,"#FFE082"],[5,8,"#FFE082"],[6,8,"#FFE082"],
  [8,8,"#FFE082"],[9,8,"#FFE082"],[10,8,"#FFE082"],
  // Door
  [6,12,D],[7,12,D],[8,12,D],[6,13,D],[7,13,D],[8,13,D],
];

// 8. Golden Cup — trophy building
export const GOLDEN_CUP: Pixel[] = [
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 14, D] as Pixel),
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 15, D] as Pixel),
  // Pedestal
  [5,13,S],[6,13,S],[7,13,S],[8,13,S],[9,13,S],
  [6,12,S],[7,12,S],[8,12,S],
  // Cup body
  [5,8,Y],[6,8,Y],[7,8,Y],[8,8,Y],[9,8,Y],
  [5,9,Y],[6,9,Y],[7,9,Y],[8,9,Y],[9,9,Y],
  [5,10,Y],[6,10,Y],[7,10,Y],[8,10,Y],[9,10,Y],
  [6,11,Y],[7,11,Y],[8,11,Y],
  // Handles
  [4,8,Y],[4,9,Y],[10,8,Y],[10,9,Y],
  // Steam
  [6,6,"#BDBDBD"],[7,5,"#9E9E9E"],[8,6,"#BDBDBD"],
  // Sparkle
  [3,6,"#FFF9C4"],[11,5,"#FFF9C4"],[7,3,"#FFF9C4"],
];

export const STAGE_2 = [
  COCOA_FARM, BEAN_ROASTER, GRINDER, ESPRESSO_BAR,
  LATTE_LAB, HOUSE_BLEND, SPECIALTY, GOLDEN_CUP,
];
