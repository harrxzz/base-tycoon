export type SpriteState = "locked" | "constructing" | "built" | "producing";

export interface SpriteProps {
  state: SpriteState;
  className?: string;
}

/** 16×16 pixel grid helper — each "pixel" is a 3×3 SVG rect */
export function px(x: number, y: number, fill: string) {
  return `<rect x="${x * 3}" y="${y * 3}" width="3" height="3" fill="${fill}"/>`;
}
