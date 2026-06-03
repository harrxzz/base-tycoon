/**
 * PixelSprite — renders a 16×16 pixel art grid as SVG.
 * Each pixel is defined as [x, y, color].
 * Grid renders at 48×48px (3px per pixel).
 */
import { cn } from "@/lib/utils";
import type { SpriteState } from "./types";

export type Pixel = [number, number, string];

interface Props {
  pixels: Pixel[];
  state: SpriteState;
  className?: string;
}

export function PixelSprite({ pixels, state, className }: Props) {
  const isLocked = state === "locked";
  const isConstructing = state === "constructing";
  const isProducing = state === "producing";

  return (
    <div
      className={cn(
        "relative grid size-11 place-items-center rounded-[10px] overflow-hidden transition-all select-none",
        !isLocked && "bg-white/[0.05] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
        isLocked && "bg-white/[0.02] border border-white/[0.04] grayscale opacity-40",
        isProducing && "ring-1 ring-current/30",
        className,
      )}
    >
      {isProducing && (
        <div className="absolute inset-0 animate-pulse-slow rounded-[10px] bg-current/[0.06]" />
      )}
      {isConstructing ? (
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 48 48" width="36" height="36" className="opacity-25">
            {/* Scaffold */}
            <rect x="6" y="4" width="2" height="40" fill="currentColor" />
            <rect x="40" y="4" width="2" height="40" fill="currentColor" />
            <rect x="6" y="16" width="36" height="2" fill="currentColor" />
            <rect x="6" y="30" width="36" height="2" fill="currentColor" />
          </svg>
          <span className="absolute text-lg animate-hammer">🔨</span>
        </div>
      ) : (
        <svg
          viewBox="0 0 48 48"
          width="36"
          height="36"
          className={cn(
            "relative",
            isLocked && "opacity-60",
          )}
          shapeRendering="crispEdges"
        >
          {pixels.map(([x, y, c], i) => (
            <rect key={i} x={x * 3} y={y * 3} width="3" height="3" fill={c} />
          ))}
        </svg>
      )}
    </div>
  );
}
