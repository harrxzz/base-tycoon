import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Hammer, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/connect-button";
import { Tower } from "@/components/game/tower";
import { STAGE_LIST, type StageId, type Step } from "@/lib/stages";
import { cn } from "@/lib/utils";
import {
  usePlayer,
  useStageData,
  useUnlockedStages,
} from "@/hooks/use-player";
import { useGameTx } from "@/hooks/use-game-tx";
import { UNLOCK_COST, STEPS_PER_STAGE } from "@/lib/contracts";

function fmt(n: bigint | number) {
  return n.toLocaleString();
}

function StageContent({ stageId }: { stageId: StageId }) {
  const stage = STAGE_LIST.find((s) => s.id === stageId)!;
  const { buildings, balances, pending, refetch } = useStageData(stageId);
  const { refetch: refetchPlayer } = usePlayer();
  const tx = useGameTx();

  const [busy, setBusy] = useState<{ step: Step | null; action: string | null }>({
    step: null,
    action: null,
  });
  const [now, setNow] = useState(Date.now());

  // 1s tick for countdowns
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  // Refetch + clear busy after tx success
  useEffect(() => {
    if (tx.isSuccess) {
      refetch();
      refetchPlayer();
      setBusy({ step: null, action: null });
      tx.reset();
    }
  }, [tx, refetch, refetchPlayer]);

  // Surface tx errors as toasts
  useEffect(() => {
    if (tx.error) {
      const msg = (tx.error as { shortMessage?: string }).shortMessage ?? tx.error.message;
      toast.error(msg);
      setBusy({ step: null, action: null });
      tx.reset();
    }
  }, [tx]);

  async function run(action: string, step: Step, fn: () => Promise<unknown>) {
    setBusy({ step, action });
    try {
      await fn();
    } catch (e) {
      console.error(e);
      setBusy({ step: null, action: null });
    }
  }

  // Unlock-next button state
  const finalStep = STEPS_PER_STAGE as Step;
  const finalOwned = balances[finalStep - 1] ?? 0n;
  const canUnlockNext =
    stage.id < 6 &&
    buildings[finalStep - 1]?.built &&
    finalOwned >= UNLOCK_COST;

  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 px-4">
        <div>
          <p
            className={cn(
              "text-xs uppercase tracking-wider",
              stage.accentClass,
            )}
          >
            Stage {stage.id}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {stage.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{stage.tagline}</p>
        </div>
        {stage.id < 6 && (
          <Button
            variant={canUnlockNext ? "base" : "outline"}
            size="sm"
            disabled={
              !canUnlockNext ||
              tx.isPending ||
              tx.isMining ||
              busy.action !== null
            }
            onClick={() =>
              run("unlockStage", finalStep, () =>
                tx.unlockStage((stage.id + 1) as StageId),
              )
            }
          >
            <ArrowRight />
            Unlock Stage {stage.id + 1}
            <span className="ml-1 font-mono text-xs">
              {fmt(finalOwned)}/{fmt(UNLOCK_COST)}
            </span>
          </Button>
        )}
      </div>

      <Tower
        stage={stage}
        buildings={buildings}
        balances={balances}
        pending={pending}
        now={now}
        busy={busy}
        onBuild={(step) => run("build", step, () => tx.build(stage.id, step))}
        onFinalize={(step) =>
          run("finalize", step, () => tx.finalize(stage.id, step))
        }
        onClaim={(step) => run("claim", step, () => tx.claim(stage.id, step))}
        onUpgrade={(step) =>
          run("upgrade", step, () => tx.upgrade(stage.id, step))
        }
      />
    </motion.div>
  );
}

export default function FactoryRoute() {
  const { isConnected } = useAccount();
  const { player } = usePlayer();
  const [activeStage, setActiveStage] = useState<StageId>(1);
  const unlocked = useUnlockedStages(player?.highestStage ?? 0);

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
          One-tap login with Coinbase Smart Wallet. Tap, claim, build your
          tower step by step.
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
        <div className="mx-auto max-w-md overflow-x-auto px-4">
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
                    "group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-all",
                    isActive && "bg-accent text-accent-foreground",
                    !isActive &&
                      !locked &&
                      "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    locked && "cursor-not-allowed text-muted-foreground/40",
                  )}
                >
                  {locked ? (
                    <Lock className="size-3.5" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                  <span className="font-medium">S{s.id}</span>
                </button>
              );
            })}
            {player && (
              <span className="ml-auto flex gap-3 px-2 font-mono text-xs text-muted-foreground">
                <span>Tx {fmt(player.totalTx)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md py-6">
        <AnimatePresence mode="wait">
          <StageContent stageId={activeStage} />
        </AnimatePresence>
      </div>
    </div>
  );
}
