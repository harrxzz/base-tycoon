/** Stage 1: Lumber Empire — pixel art data */
import type { Pixel } from "./pixel-sprite";

const B = "#5C3A1E"; // dark brown (wood)
const W = "#8B6914"; // warm wood
const G = "#2D5A1E"; // dark green (leaves)
const L = "#4CAF50"; // light green
const Y = "#FFD54F"; // gold/highlight
const S = "#9E9E9E"; // stone/metal
const D = "#3E2723"; // darkest brown
const R = "#C62828"; // red accent
const O = "#FF8F00"; // orange

// 1. Twig Patch — small bush with twigs
export const TWIG_PATCH: Pixel[] = [
  // Ground
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[4,5,6,7,8,9,10].map(x => [x, 15, D] as Pixel),
  // Bush
  [6,9,G],[7,9,G],[8,9,G],
  [5,10,G],[6,10,L],[7,10,L],[8,10,L],[9,10,G],
  [5,11,G],[6,11,L],[7,11,G],[8,11,L],[9,11,G],
  [6,12,G],[7,12,G],[8,12,G],
  // Twigs
  [4,11,W],[3,10,W],[10,11,W],[11,10,W],
  [7,13,B],[7,12,B],
];

// 2. Sawmill — log + circular blade
export const SAWMILL: Pixel[] = [
  // Building base
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Walls
  [4,8,B],[4,9,B],[4,10,B],[4,11,B],[4,12,B],[4,13,B],
  [10,8,B],[10,9,B],[10,10,B],[10,11,B],[10,12,B],[10,13,B],
  // Roof
  [4,7,W],[5,7,W],[6,7,W],[7,6,W],[8,7,W],[9,7,W],[10,7,W],
  [5,6,W],[6,6,W],[7,5,R],[8,6,W],[9,6,W],
  // Blade (circular saw)
  [7,10,S],[6,9,S],[8,9,S],[7,8,S],[6,11,S],[8,11,S],
  [7,9,S],[7,11,S],
  // Log
  [5,12,W],[6,12,W],[7,12,W],[8,12,W],[9,12,W],
  [5,13,B],[6,13,W],[7,13,W],[8,13,W],[9,13,B],
];

// 3. Plank Yard — stacked planks
export const PLANK_YARD: Pixel[] = [
  // Ground
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Plank stack 1
  [3,13,W],[4,13,W],[5,13,W],[6,13,W],
  [3,12,B],[4,12,B],[5,12,B],[6,12,B],
  [3,11,W],[4,11,W],[5,11,W],[6,11,W],
  [3,10,B],[4,10,B],[5,10,B],[6,10,B],
  // Plank stack 2
  [8,13,W],[9,13,W],[10,13,W],[11,13,W],
  [8,12,B],[9,12,B],[10,12,B],[11,12,B],
  // Support posts
  [2,11,S],[2,12,S],[2,13,S],
  [7,11,S],[7,12,S],[7,13,S],
  [12,12,S],[12,13,S],
];

// 4. Workshop — workbench with hammer
export const WORKSHOP: Pixel[] = [
  // Floor
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 14, D] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 15, D] as Pixel),
  // Walls
  [3,6,B],[3,7,B],[3,8,B],[3,9,B],[3,10,B],[3,11,B],[3,12,B],[3,13,B],
  [11,6,B],[11,7,B],[11,8,B],[11,9,B],[11,10,B],[11,11,B],[11,12,B],[11,13,B],
  // Roof
  [3,5,W],[4,5,W],[5,5,W],[6,5,W],[7,4,R],[8,5,W],[9,5,W],[10,5,W],[11,5,W],
  [4,4,W],[5,4,W],[6,4,W],[8,4,W],[9,4,W],[10,4,W],
  // Workbench
  [5,11,W],[6,11,W],[7,11,W],[8,11,W],[9,11,W],
  [5,12,B],[9,12,B],
  [5,13,B],[9,13,B],
  // Hammer on bench
  [7,10,S],[7,9,S],[6,9,Y],
  // Window
  [5,8,"#4FC3F7"],[6,8,"#4FC3F7"],
  [8,8,"#4FC3F7"],[9,8,"#4FC3F7"],
];

// 5. Joinery — larger workshop with chair frame
export const JOINERY: Pixel[] = [
  // Floor
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Walls
  [2,5,B],[2,6,B],[2,7,B],[2,8,B],[2,9,B],[2,10,B],[2,11,B],[2,12,B],[2,13,B],
  [12,5,B],[12,6,B],[12,7,B],[12,8,B],[12,9,B],[12,10,B],[12,11,B],[12,12,B],[12,13,B],
  // Roof
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 4, W] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 3, W] as Pixel),
  [7,2,R],
  // Chair frame inside
  [6,11,W],[6,12,W],[7,12,W],[8,12,W],[8,11,W],
  [6,9,W],[6,10,W],[8,9,W],[8,10,W],
  [7,11,W],
  // Door
  [7,13,B],[7,12,B],
  // Windows
  [4,7,"#4FC3F7"],[5,7,"#4FC3F7"],
  [9,7,"#4FC3F7"],[10,7,"#4FC3F7"],
];

// 6. Furniture Co — showroom with chair
export const FURNITURE_CO: Pixel[] = [
  // Floor
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Building - larger
  [2,4,B],[2,5,B],[2,6,B],[2,7,B],[2,8,B],[2,9,B],[2,10,B],[2,11,B],[2,12,B],[2,13,B],
  [12,4,B],[12,5,B],[12,6,B],[12,7,B],[12,8,B],[12,9,B],[12,10,B],[12,11,B],[12,12,B],[12,13,B],
  // Roof
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 3, W] as Pixel),
  ...[3,4,5,6,7,8,9,10,11].map(x => [x, 2, R] as Pixel),
  // Sign
  [5,5,Y],[6,5,Y],[7,5,Y],[8,5,Y],[9,5,Y],
  // Windows (display)
  [4,7,"#4FC3F7"],[5,7,"#4FC3F7"],[6,7,"#4FC3F7"],
  [8,7,"#4FC3F7"],[9,7,"#4FC3F7"],[10,7,"#4FC3F7"],
  // Chair display
  [5,10,W],[5,11,W],[6,11,W],[7,11,W],[7,10,W],
  [9,10,W],[9,11,W],[10,11,W],
  // Door
  [7,12,D],[7,13,D],
];

// 7. Showroom — fancy building
export const SHOWROOM: Pixel[] = [
  // Floor
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 14, D] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 15, D] as Pixel),
  // Walls
  [2,3,W],[2,4,W],[2,5,W],[2,6,W],[2,7,W],[2,8,W],[2,9,W],[2,10,W],[2,11,W],[2,12,W],[2,13,W],
  [12,3,W],[12,4,W],[12,5,W],[12,6,W],[12,7,W],[12,8,W],[12,9,W],[12,10,W],[12,11,W],[12,12,W],[12,13,W],
  // Roof with overhang
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 2, R] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 1, R] as Pixel),
  [7,0,Y], // spire
  // Display windows
  [4,6,"#FFE082"],[5,6,"#FFE082"],[6,6,"#FFE082"],
  [8,6,"#FFE082"],[9,6,"#FFE082"],[10,6,"#FFE082"],
  [4,7,"#FFE082"],[5,7,"#FFE082"],[6,7,"#FFE082"],
  [8,7,"#FFE082"],[9,7,"#FFE082"],[10,7,"#FFE082"],
  // Entrance
  [6,12,Y],[7,12,Y],[8,12,Y],
  [6,13,D],[7,13,D],[8,13,D],
  // Awning
  [5,11,O],[6,11,O],[7,11,O],[8,11,O],[9,11,O],
];

// 8. Throne Hall — castle/palace
export const THRONE_HALL: Pixel[] = [
  // Floor
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 14, D] as Pixel),
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13].map(x => [x, 15, D] as Pixel),
  // Towers
  [2,2,S],[3,2,S],[2,3,S],[3,3,S],[2,4,S],[3,4,S],[2,5,S],[3,5,S],
  [2,6,S],[3,6,S],[2,7,S],[3,7,S],[2,8,S],[3,8,S],
  [11,2,S],[12,2,S],[11,3,S],[12,3,S],[11,4,S],[12,4,S],[11,5,S],[12,5,S],
  [11,6,S],[12,6,S],[11,7,S],[12,7,S],[11,8,S],[12,8,S],
  // Tower tops
  [2,1,Y],[3,1,Y],[11,1,Y],[12,1,Y],
  // Main building
  ...[4,5,6,7,8,9,10].map(x => [x, 5, S] as Pixel),
  ...[4,5,6,7,8,9,10].map(x => [x, 4, S] as Pixel),
  ...[5,6,7,8,9].map(x => [x, 3, S] as Pixel),
  [7,2,Y], // crown
  // Walls down
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 9, S] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 10, S] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 11, S] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 12, S] as Pixel),
  ...[2,3,4,5,6,7,8,9,10,11,12].map(x => [x, 13, S] as Pixel),
  // Windows
  [5,7,"#4FC3F7"],[6,7,"#4FC3F7"],
  [8,7,"#4FC3F7"],[9,7,"#4FC3F7"],
  // Gate
  [6,12,D],[7,12,D],[8,12,D],
  [6,13,D],[7,13,D],[8,13,D],
  // Crown on top
  [6,1,Y],[7,1,Y],[8,1,Y],[7,0,Y],
];

export const STAGE_1 = [
  TWIG_PATCH, SAWMILL, PLANK_YARD, WORKSHOP,
  JOINERY, FURNITURE_CO, SHOWROOM, THRONE_HALL,
];
