import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import {
  Hammer,
  Lock,
  ArrowUp,
  Sparkles as SparklesIcon,
  Loader2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectButton } from "@/components/connect-button";
import { Sparkles } from "@/components/motion/sparkles";
import { STAGE_LIST, type StageId, type SubTier } from "@/lib/stages";
import { cn } from "@/lib/utils";
import {
  usePlayer,
  useStageMines,
  useStageBalances,
  useUnlockedStages,
} from "@/hooks/use-player";
import { useGameTx } from "@/hooks/use-game-tx";

function fmt(n: bigint | number) {
  return n.toLocaleString();
}

function StageContent({ stageId }: { stageId: StageId }) {
  const stage = STAGE_LIST.find((s) => s.id === stageId)!;
  const { mines, refetch: refetchMines } = useStageMines(stageId);
  const { balances, refetch: refetchBalances } = useStageBalances(stageId);
  const { refetch: refetchPlayer } = usePlayer();
  const tx = useGameTx();
  const [busySub, setBusySub] = useState<SubTier | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  // Refetch after every successful tx.
  useEffect(() => {
    if (tx.isSuccess) {
      refetchMines();
      refetchBalances();
      refetchPlayer();
      setBusySub(null);
      setBusyAction(null);
      tx.reset();
    }
  }, [tx, refetchMines, refetchBalances, refetchPlayer]);

  async function run(
    action: "tap" | "claim" | "upgrade" | "combine",
    sub: SubTier,
  ) {
    setBusySub(sub);
    setBusyAction(action);
    try {
      if (action === "tap") await tx.tap(stageId, sub);
      else if (action === "claim") await tx.claim(stageId, sub);
      else if (action === "upgrade") await tx.upgrade(stageId, sub);
      else if (action === "combine") await tx.combine(stageId, sub);
    } catch (err) {
      console.error(err);
      setBusySub(null);
      setBusyAction(null);
    }
  }

  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={cn("text-xs uppercase tracking-wider", stage.accentClass)}>
            Stage {stage.id}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {stage.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{stage.tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {stage.subTiers.map((t, idx) => {
          const sub = idx as SubTier;
          const m = mines[idx];
          const owned = balances[idx] ?? 0n;
          const busy = busySub === sub;
          const isLocked = m && !m.unlocked;
          return (
            <Card
              key={t.name}
              className={cn(
                "group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md",
                isLocked && "opacity-60",
              )}
            >
              <Sparkles count={10} />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-12 place-items-center rounded-lg bg-card/80 text-2xl shadow-inner">
                      <span className="animate-float-y">{t.emoji}</span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Sub-tier {idx} · Token #{stageId * 10 + idx}
                      </p>
                      <h3 className="text-lg font-semibold">{t.name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Owned</p>
                    <p className="font-mono text-lg font-semibold">
                      {fmt(owned)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  {t.description}
                </p>

                {m && (
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>
                      Lvl <span className="font-mono text-foreground">{m.level}</span>
                    </span>
                    <span>
                      Auto{" "}
                      <span className="font-mono text-foreground">
                        {(m.autoRate / 1000).toFixed(2)}/min
                      </span>
                    </span>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="base"
                    onClick={() => run("tap", sub)}
                    disabled={busy || tx.isPending || tx.isMining}
                  >
                    {busy && busyAction === "tap" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Hammer />
                    )}
                    Tap
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => run("claim", sub)}
                    disabled={busy || tx.isPending || tx.isMining || !m?.autoRate}
                  >
                    {busy && busyAction === "claim" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Zap />
                    )}
                    Claim
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => run("combine", sub)}
                    disabled={
                      idx === 3 ||
                      busy ||
                      tx.isPending ||
                      tx.isMining ||
                      owned < 10n
                    }
                  >
                    {busy && busyAction === "combine" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <SparklesIcon />
                    )}
                    Combine ×10
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => run("upgrade", sub)}
                    disabled={busy || tx.isPending || tx.isMining || owned < 10n}
                  >
                    {busy && busyAction === "upgrade" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ArrowUp />
                    )}
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function FactoryRoute() {
  const { isConnected } = useAccount();
  const [activeStage, setActiveStage] = useState<StageId>(1);
  const unlocked = useUnlockedStages();
  const { player } = usePlayer();

  if (!isConnected) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-base-blue/10 text-base-blue">
          <Hammer />
        </div>
        <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
          Connect to enter the factory
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          One-tap login with Coinbase Smart Wallet. Gas is sponsored — you
          never pay to play.
        </p>
        <div className="mt-6">
          <ConnectButton />
        </div>
      </section>
    );
  }

  const stage = STAGE_LIST.find((s) => s.id === activeStage)!;

  return (
    <div className={cn("relative", stage.bgGradient)}>
      {/* Stage tab strip */}
      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4">
          <div className="flex min-w-max items-center gap-1 py-2">
            {STAGE_LIST.map((s) => {
              const Icon = s.icon;
              const locked = !unlocked.has(s.id);
              const isActive = s.id === activeStage;
              return (
                <button
                  key={s.id}
                  onClick={() => !locked && setActiveStage(s.id)}
                  disabled={locked}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-all",
                    isActive && "bg-accent text-accent-foreground",
                    !isActive &&
                      !locked &&
                      "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    locked && "cursor-not-allowed text-muted-foreground/40",
                  )}
                >
                  {locked ? <Lock className="size-3.5" /> : <Icon className="size-3.5" />}
                  <span className="font-medium">S{s.id}</span>
                  <span className="hidden md:inline">{s.name}</span>
                </button>
              );
            })}
            {player && (
              <span className="ml-auto hidden gap-3 px-2 font-mono text-xs text-muted-foreground sm:flex">
                <span>Taps: {fmt(player.totalTaps)}</span>
                <span>Tx: {fmt(player.totalTx)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <AnimatePresence mode="wait">
          <StageContent stageId={activeStage} />
        </AnimatePresence>
      </div>
    </div>
  );
}
