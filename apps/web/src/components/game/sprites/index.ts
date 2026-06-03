/** Sprite data index — all 48 building pixel art sprites */
export { STAGE_1 } from "./stage-1";
export { STAGE_2 } from "./stage-2";
export { STAGE_3 } from "./stage-3";
export { STAGE_4 } from "./stage-4";
export { STAGE_5 } from "./stage-5";
export { STAGE_6 } from "./stage-6";
export { PixelSprite } from "./pixel-sprite";
export type { Pixel } from "./pixel-sprite";
export type { SpriteState } from "./types";

import type { StageId, Step } from "@/lib/stages";
import type { Pixel } from "./pixel-sprite";
import { STAGE_1 } from "./stage-1";
import { STAGE_2 } from "./stage-2";
import { STAGE_3 } from "./stage-3";
import { STAGE_4 } from "./stage-4";
import { STAGE_5 } from "./stage-5";
import { STAGE_6 } from "./stage-6";

const ALL_STAGES: Record<number, Pixel[][]> = {
  1: STAGE_1,
  2: STAGE_2,
  3: STAGE_3,
  4: STAGE_4,
  5: STAGE_5,
  6: STAGE_6,
};

/** Get pixel data for a specific building */
export function getSpritePixels(stageId: StageId, step: Step): Pixel[] {
  const stage = ALL_STAGES[stageId];
  if (!stage) return [];
  return stage[step - 1] ?? [];
}
