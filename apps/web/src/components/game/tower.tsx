// Tower — vertical 2.5D building stack. Top = step 8 (final), bottom = step 1.

import { motion } from "framer-motion";
import { Hammer, Loader2, Zap, ArrowUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StageDef, Step } from "@/lib/stages";
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
    <div className="mx-auto flex w-full max-w-md flex-col">
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
        const reservedTopCorner = idx === 0; // top of tower

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
                "relative overflow-hidden border border-border/60 bg-card/80 backdrop-blur transition-all",
                reservedTopCorner ? "rounded-t-2xl" : "",
                idx === ordered.length - 1 ? "rounded-b-2xl" : "",
                idx > 0 ? "border-t-0" : "",
                empty && "opacity-50",
              )}
            >
              {/* Top accent line for built */}
              {b.built && (
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-0.5 opacity-80",
                    stage.accentClass,
                    "bg-current",
                  )}
                />
              )}

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
                {/* Emoji square */}
                <div
                  className={cn(
                    "grid size-12 place-items-center rounded-lg text-2xl shadow-inner transition-all",
                    b.built ? "bg-card" : "bg-card/30",
                    b.built && pend > 0n && "animate-pulse",
                  )}
                >
                  <span
                    className={cn(
                      "transition-all",
                      empty && "grayscale opacity-40",
                      constructing && "animate-pulse",
                    )}
                  >
                    {empty ? "🔒" : stepDef.emoji}
                  </span>
                </div>

                {/* Center: name + status */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      Step {step} {stepIsLast && "· Final"}
                    </p>
                    {b.built && (
                      <span
                        className={cn(
                          "rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-mono",
                          b.level >= MAX_LEVEL && "bg-amber-500/20 text-amber-300",
                        )}
                      >
                        L{b.level}
                      </span>
                    )}
                  </div>
                  <h3 className="truncate text-base font-semibold">
                    {stepDef.name}
                  </h3>
                  {b.built ? (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono">
                        +1
                      </span>{" "}
                      every{" "}
                      <span className="font-mono">{interval}s</span>
                    </p>
                  ) : constructing ? (
                    <p className="text-xs text-muted-foreground">
                      Constructing — {fmtSeconds(remaining)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Cost: <span className="font-mono">{fmt(cost)}</span>{" "}
                      {step > 1 ? stage.steps[step - 2].name : "—"}
                    </p>
                  )}
                </div>

                {/* Right: balance + pending */}
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold">{fmt(owned)}</p>
                  {pend > 0n && (
                    <p className="font-mono text-xs text-emerald-400">
                      +{fmt(pend)}
                    </p>
                  )}
                </div>
              </div>

              {/* Construction progress bar */}
              {constructing && (
                <div className="px-4 pb-2">
                  <div className="h-1 overflow-hidden rounded bg-foreground/10">
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
              <div className="flex flex-wrap items-center gap-2 border-t border-border/40 bg-background/30 px-4 py-2">
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
