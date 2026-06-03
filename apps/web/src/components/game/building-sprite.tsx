/**
 * BuildingSprite — CSS-animated mini building illustrations.
 *
 * Each building in the tower gets a unique visual that reflects its name:
 *   - Sawmill → spinning blade
 *   - Quarry → pickaxe swing
 *   - Drone Hangar → hovering drone
 *   etc.
 *
 * States:
 *   "locked"       → grayscale silhouette, no animation
 *   "constructing"  → scaffold + pulsing hammer
 *   "built"         → active production animation
 *   "producing"     → built + glow ring (pending > 0)
 */

import { cn } from "@/lib/utils";
import type { StageId, Step } from "@/lib/stages";

export type SpriteState = "locked" | "constructing" | "built" | "producing";

interface Props {
  stageId: StageId;
  step: Step;
  state: SpriteState;
  className?: string;
}

export function BuildingSprite({ stageId, step, state, className }: Props) {
  const key = `${stageId}-${step}` as const;
  const isActive = state === "built" || state === "producing";
  const isLocked = state === "locked";
  const isConstructing = state === "constructing";

  return (
    <div
      className={cn(
        "relative grid size-11 place-items-center rounded-[10px] overflow-hidden transition-all select-none",
        isActive
          ? "bg-white/[0.05] border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          : "bg-white/[0.02] border border-white/[0.04]",
        isLocked && "grayscale opacity-40",
        state === "producing" && "ring-1 ring-current/30",
        className,
      )}
    >
      {/* Glow underlay for producing state */}
      {state === "producing" && (
        <div className="absolute inset-0 animate-pulse-slow rounded-[10px] bg-current/[0.06]" />
      )}

      {/* Construction scaffold overlay */}
      {isConstructing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 44 44"
            className="absolute inset-0 size-full opacity-20"
          >
            {/* Scaffold lines */}
            <line x1="8" y1="6" x2="8" y2="38" stroke="currentColor" strokeWidth="1.5" />
            <line x1="36" y1="6" x2="36" y2="38" stroke="currentColor" strokeWidth="1.5" />
            <line x1="6" y1="14" x2="38" y2="14" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="1" />
            <line x1="8" y1="6" x2="36" y2="28" stroke="currentColor" strokeWidth="0.5" />
            <line x1="36" y1="6" x2="8" y2="28" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <span className="relative text-lg animate-hammer">🔨</span>
        </div>
      )}

      {/* Building sprite */}
      {!isConstructing && (
        <div className={cn("relative text-center leading-none", isLocked && "opacity-60")}>
          {getSpriteContent(key, isActive)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Sprite content per building
// ─────────────────────────────────────────────────────

function getSpriteContent(key: string, isActive: boolean) {
  const sprites: Record<string, () => React.ReactNode> = {
    // ═══ Stage 1: Lumber Empire ═══
    "1-1": () => (
      <div className="relative">
        <span className="text-xl">🌿</span>
        {isActive && <span className="absolute -top-0.5 -right-1 text-[8px] animate-sway">🍃</span>}
      </div>
    ),
    "1-2": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-saw")}>🪚</span>
      </div>
    ),
    "1-3": () => (
      <div className="relative">
        <span className="text-xl">🪵</span>
        {isActive && <span className="absolute -bottom-0.5 left-0 text-[8px] animate-bounce-soft">🪵</span>}
      </div>
    ),
    "1-4": () => (
      <div className="relative">
        <span className="text-xl">🔨</span>
        {isActive && (
          <span className="absolute -top-1 -right-0.5 text-[7px] animate-sparkle">✨</span>
        )}
      </div>
    ),
    "1-5": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-rotate-slow")}>🛠️</span>
      </div>
    ),
    "1-6": () => (
      <div className="relative">
        <span className="text-xl">🪑</span>
        {isActive && <span className="absolute -top-1 right-0 text-[7px] animate-float-y">✨</span>}
      </div>
    ),
    "1-7": () => (
      <div className="relative">
        <span className="text-xl">🏬</span>
        {isActive && <span className="absolute top-0 left-0 text-[7px] animate-blink">💡</span>}
      </div>
    ),
    "1-8": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-glow-gold")}>👑</span>
      </div>
    ),

    // ═══ Stage 2: Café Empire ═══
    "2-1": () => (
      <div className="relative">
        <span className="text-xl">🌳</span>
        {isActive && <span className="absolute -top-1 left-1 text-[7px] animate-sway">🍃</span>}
      </div>
    ),
    "2-2": () => (
      <div className="relative">
        <span className="text-xl">🫘</span>
        {isActive && (
          <span className="absolute -top-1.5 right-0 text-[8px] animate-steam">♨️</span>
        )}
      </div>
    ),
    "2-3": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-rotate-slow")}>⚙️</span>
      </div>
    ),
    "2-4": () => (
      <div className="relative">
        <span className="text-xl">☕</span>
        {isActive && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] animate-steam">
            ☁️
          </span>
        )}
      </div>
    ),
    "2-5": () => (
      <div className="relative">
        <span className="text-xl">🥛</span>
        {isActive && <span className="absolute -top-1 right-0 text-[7px] animate-pour">💧</span>}
      </div>
    ),
    "2-6": () => (
      <div className="relative">
        <span className="text-xl">🍵</span>
        {isActive && <span className="absolute -top-1.5 left-2 text-[7px] animate-steam">~</span>}
      </div>
    ),
    "2-7": () => (
      <div className="relative">
        <span className="text-xl">🥃</span>
        {isActive && <span className="absolute -top-1 right-0 text-[7px] animate-sparkle">✨</span>}
      </div>
    ),
    "2-8": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-glow-gold")}>🏆</span>
      </div>
    ),

    // ═══ Stage 3: Candy Factory ═══
    "3-1": () => (
      <div className="relative">
        <span className="text-xl">🍬</span>
        {isActive && <span className="absolute -top-1 right-0 text-[7px] animate-sparkle">✦</span>}
      </div>
    ),
    "3-2": () => (
      <div className="relative">
        <span className="text-xl">🫧</span>
        {isActive && (
          <>
            <span className="absolute -top-2 left-1 text-[6px] animate-bubble-1">○</span>
            <span className="absolute -top-1 right-1 text-[5px] animate-bubble-2">○</span>
          </>
        )}
      </div>
    ),
    "3-3": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-spin-slow")}>🍭</span>
      </div>
    ),
    "3-4": () => (
      <div className="relative">
        <span className="text-xl">🍫</span>
        {isActive && <span className="absolute -bottom-0.5 right-0 text-[7px] animate-melt">🤎</span>}
      </div>
    ),
    "3-5": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-squish")}>🐻</span>
      </div>
    ),
    "3-6": () => (
      <div className="relative">
        <span className="text-xl">🐉</span>
        {isActive && <span className="absolute -top-1 left-0 text-[7px] animate-flame">🔥</span>}
      </div>
    ),
    "3-7": () => (
      <div className="relative">
        <span className="text-xl">🍰</span>
        {isActive && <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px] animate-sparkle">✨</span>}
      </div>
    ),
    "3-8": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-glow-pink")}>🎂</span>
        {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] animate-flame">🕯️</span>}
      </div>
    ),

    // ═══ Stage 4: Crystal Sanctum ═══
    "4-1": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-pickaxe")}>⛏️</span>
      </div>
    ),
    "4-2": () => (
      <div className="relative">
        <span className="text-xl">🔹</span>
        {isActive && <span className="absolute -top-0.5 right-0 text-[7px] animate-sparkle">💠</span>}
      </div>
    ),
    "4-3": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-crystal-pulse")}>💜</span>
      </div>
    ),
    "4-4": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-crystal-pulse")}>🔷</span>
      </div>
    ),
    "4-5": () => (
      <div className="relative">
        <span className="text-xl">💚</span>
        {isActive && <span className="absolute -top-1 right-0 text-[6px] animate-sparkle">✧</span>}
      </div>
    ),
    "4-6": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-crystal-glow")}>💎</span>
      </div>
    ),
    "4-7": () => (
      <div className="relative">
        <span className="text-xl">✨</span>
        {isActive && (
          <span className="absolute inset-0 animate-pulse-slow rounded-full bg-purple-500/10" />
        )}
      </div>
    ),
    "4-8": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-float-y animate-crystal-glow")}>🔮</span>
      </div>
    ),

    // ═══ Stage 5: Mech Assembly ═══
    "5-1": () => (
      <div className="relative">
        <span className="text-xl">🔩</span>
        {isActive && <span className="absolute -top-1 right-0 text-[7px] animate-sparkle">⚡</span>}
      </div>
    ),
    "5-2": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-rotate-slow")}>⚙️</span>
      </div>
    ),
    "5-3": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-servo")}>🦾</span>
      </div>
    ),
    "5-4": () => (
      <div className="relative">
        <span className="text-xl">🔋</span>
        {isActive && (
          <span className="absolute top-0 right-0 text-[6px] animate-blink text-mac-green">●</span>
        )}
      </div>
    ),
    "5-5": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-drone")}>🛸</span>
      </div>
    ),
    "5-6": () => (
      <div className="relative">
        <span className="text-xl">🤖</span>
        {isActive && (
          <>
            <span className="absolute top-0.5 left-1 text-[5px] animate-blink text-mac-red">●</span>
            <span className="absolute top-0.5 right-1 text-[5px] animate-blink-delay text-mac-blue">●</span>
          </>
        )}
      </div>
    ),
    "5-7": () => (
      <div className="relative">
        <span className="text-xl">🛗</span>
        {isActive && <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[7px] animate-radar">📡</span>}
      </div>
    ),
    "5-8": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-titan")}>🦿</span>
        {isActive && (
          <span className="absolute -bottom-0.5 left-0 right-0 text-center text-[5px] animate-pulse text-mac-orange">
            ◆◆◆
          </span>
        )}
      </div>
    ),

    // ═══ Stage 6: Bonsai Garden ═══
    "6-1": () => (
      <div className="relative">
        <span className="text-xl">🌱</span>
        {isActive && <span className="absolute -top-1 left-2 text-[6px] animate-sway">🌱</span>}
      </div>
    ),
    "6-2": () => (
      <div className="relative">
        <span className="text-xl">🌿</span>
        {isActive && <span className="absolute -top-0.5 right-0 text-[6px] animate-grow">↑</span>}
      </div>
    ),
    "6-3": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-snip")}>✂️</span>
      </div>
    ),
    "6-4": () => (
      <div className="relative">
        <span className="text-xl">🪴</span>
        {isActive && <span className="absolute -top-1 right-0 text-[7px] animate-sway">🍃</span>}
      </div>
    ),
    "6-5": () => (
      <div className="relative">
        <span className="text-xl">🪨</span>
        {isActive && (
          <span className="absolute -bottom-0.5 left-1 right-1 text-center text-[5px] animate-zen opacity-60">
            ≈≈≈
          </span>
        )}
      </div>
    ),
    "6-6": () => (
      <div className="relative">
        <span className="text-xl">🍵</span>
        {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] animate-steam">~</span>}
      </div>
    ),
    "6-7": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-sway")}>🌳</span>
      </div>
    ),
    "6-8": () => (
      <div className="relative">
        <span className={cn("text-xl", isActive && "animate-float-y animate-glow-green")}>🌍</span>
        {isActive && (
          <>
            <span className="absolute -top-1 left-0 text-[5px] animate-orbit-1">🍃</span>
            <span className="absolute -top-0.5 right-0 text-[5px] animate-orbit-2">🌿</span>
          </>
        )}
      </div>
    ),
  };

  const render = sprites[key];
  if (!render) {
    // Fallback — shouldn't happen
    return <span className="text-xl">❓</span>;
  }
  return render();
}
