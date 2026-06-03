/**
 * BuildingSprite — renders pixel art buildings in the tower.
 *
 * Uses 16×16 pixel grid SVGs defined per-stage.
 * States: locked (grayscale), constructing (scaffold), built, producing (glow).
 */
import type { StageId, Step } from "@/lib/stages";
import { PixelSprite, getSpritePixels } from "./sprites";
import type { SpriteState } from "./sprites";

export type { SpriteState };

interface Props {
  stageId: StageId;
  step: Step;
  state: SpriteState;
  className?: string;
}

export function BuildingSprite({ stageId, step, state, className }: Props) {
  const pixels = getSpritePixels(stageId, step);

  return (
    <PixelSprite
      pixels={pixels}
      state={state}
      className={className}
    />
  );
}
