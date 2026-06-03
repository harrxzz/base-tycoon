// Tower — vertical 2.5D building stack. Top = step 8 (final), bottom = step 1.

import { motion } from "framer-motion";
import { Hammer, Loader2, Zap, ArrowUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinPopOverlay } from "@/components/game/coin-pop-overlay";
import { BuildingSprite, type SpriteState } from "@/components/game/building-sprite";
import { cn } from "@/lib/utils";
import type { StageDef, StageId, Step } from "@/lib/stages";
import type { BuildingState } from "@/hooks/use-player";
import {
  buildCost,
  buildTime,
  upgradeCost,
  effectiveInterval,
  MAX_LEVEL,
  STEPS_PER_STAGE,
} from "@/lib/contracts";

interface TowerProps {
  stage: StageDef;
  buildings: BuildingState[];
  balances: bigint[];
  pending: bigint[];
  /** server-perceived now in ms (driven by a 1s tick in parent) */
  now: number;
  busy: { step: Step | null; action: string | null };
  onBuild: (step: Step) => void;
  onFinalize: (step: Step) => void;
  onClaim: (step: Step) => void;
  onUpgrade: (step: Step) => void;
}

function fmt(n: bigint | number) {
  return n.toLocaleString();
}

function fmtSeconds(s: number) {
  if (s <= 0) return "ready";
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

export function Tower({
  stage,
  buildings,
  balances,
  pending,
  now,
  busy,
  onBuild,
  onFinalize,
  onClaim,
  onUpgrade,
}: TowerProps) {
  // Render step 8 (top) → step 1 (bottom)
  const ordered = [...buildings].map((b, i) => ({ b, step: (i + 1) as Step })).reverse();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col overflow-hidden rounded-[14px] mac-card">
      {ordered.map(({ b, step }, idx) => {
        const stepDef = stage.steps[step - 1];
        const owned = balances[step - 1] ?? 0n;
        const pend = pending[step - 1] ?? 0n;
        const prevOwned = step > 1 ? (balances[step - 2] ?? 0n) : 0n;
        const cost = buildCost(step);
        const buildSecs = buildTime(step);

        const buildEndsAt = b.buildEndsAt;
        const remaining =
          buildEndsAt > 0 ? Math.max(0, buildEndsAt - Math.floor(now / 1000)) : 0;
        const constructing = !b.built && b.buildEndsAt > 0;
        const ready = constructing && remaining === 0;
        const empty = !b.built && b.buildEndsAt === 0;
        const interval = b.built ? effectiveInterval(step, b.level) : 0;
        const upCost = b.built ? upgradeCost(b.level) : 0n;
        const isBusy = busy.step === step;

        const stepIsLast = step === STEPS_PER_STAGE;
        const stepIsFirst = step === 1;

        // Determine sprite state
        const spriteState: SpriteState = empty
          ? "locked"
          : constructing
            ? "constructing"
            : b.built && pend > 0n
              ? "producing"
              : "built";

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="relative"
          >
            <div
              className={cn(
                "relative overflow-hidden transition-all",
                idx > 0 && "border-t border-white/[0.06]",
                empty && "opacity-60",
              )}
            >
              {/* Top accent line for built */}
              {b.built && (
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-[2px] opacity-90",
                    stage.accentClass,
                    "bg-current",
                  )}
                />
              )}

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
                {/* Building sprite */}
                <BuildingSprite
                  stageId={stage.id as StageId}
                  step={step}
                  state={spriteState}
                  className={cn(
                    stage.accentClass,
                  )}
                />

                {/* Center: name + status */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                      Step {step} {stepIsLast && "· Final"}
                    </p>
                    {b.built && (
                      <span
                        className={cn(
                          "rounded-[4px] bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono",
                          b.level >= MAX_LEVEL && "bg-mac-orange/20 text-mac-orange",
                        )}
                      >
                        L{b.level}
                      </span>
                    )}
                  </div>
                  <h3 className="truncate text-[15px] font-semibold tracking-tight">
                    {stepDef.name}
                  </h3>
                  {b.built ? (
                    <p className="text-[11px] text-muted-foreground">
                      <span className="font-mono">+1</span> every{" "}
                      <span className="font-mono">{interval}s</span>
                    </p>
                  ) : constructing ? (
                    <p className="text-[11px] text-muted-foreground">
                      Constructing — {fmtSeconds(remaining)}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      Cost: <span className="font-mono">{fmt(cost)}</span>{" "}
                      {step > 1 ? stage.steps[step - 2].name : "—"}
                    </p>
                  )}
                </div>

                {/* Right: balance + pending */}
                <div className="relative text-right">
                  <CoinPopOverlay balance={owned} />
                  <p className="font-mono text-[15px] font-semibold tracking-tight">
                    {fmt(owned)}
                  </p>
                  {pend > 0n && (
                    <p className="font-mono text-[11px] text-mac-green">
                      +{fmt(pend)}
                    </p>
                  )}
                </div>
              </div>

              {/* Construction progress bar */}
              {constructing && (
                <div className="px-4 pb-2">
                  <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      key={buildEndsAt}
                      className={cn("h-full bg-current", stage.accentClass)}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: buildSecs, ease: "linear" }}
                    />
                  </div>
                </div>
              )}

              {/* Action row */}
              <div className="flex flex-wrap items-center gap-1.5 border-t border-white/[0.04] bg-black/20 px-3 py-2">
                {empty && (
                  <Button
                    size="sm"
                    variant={stepIsFirst ? "ghost" : "base"}
                    disabled={
                      stepIsFirst ||
                      isBusy ||
                      (step > 1 && prevOwned < cost) ||
                      (step > 1 && !buildings[step - 2]?.built)
                    }
                    onClick={() => onBuild(step)}
                    className="flex-1"
                  >
                    {isBusy && busy.action === "build" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Hammer />
                    )}
                    {stepIsFirst ? "Auto-built" : `Build · ${buildSecs}s`}
                  </Button>
                )}

                {constructing && (
                  <Button
                    size="sm"
                    variant={ready ? "base" : "outline"}
                    disabled={!ready || isBusy}
                    onClick={() => onFinalize(step)}
                    className="flex-1"
                  >
                    {isBusy && busy.action === "finalize" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Check />
                    )}
                    {ready ? "Finalize" : `Wait ${fmtSeconds(remaining)}`}
                  </Button>
                )}

                {b.built && (
                  <>
                    <Button
                      size="sm"
                      variant="base"
                      disabled={isBusy || pend === 0n}
                      onClick={() => onClaim(step)}
                      className="flex-1"
                    >
                      {isBusy && busy.action === "claim" ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Zap />
                      )}
                      Claim {pend > 0n ? `+${fmt(pend)}` : ""}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        isBusy || b.level >= MAX_LEVEL || owned < upCost
                      }
                      onClick={() => onUpgrade(step)}
                    >
                      {isBusy && busy.action === "upgrade" ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <ArrowUp />
                      )}
                      L{b.level + 1} · {fmt(upCost)}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
