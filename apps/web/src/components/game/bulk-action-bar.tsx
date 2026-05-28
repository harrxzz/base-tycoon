import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Sparkles, Hammer, Coins } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBatchGameTx, type BatchAction } from "@/hooks/use-batch-game-tx";
import { useWalletCapabilities } from "@/hooks/use-wallet-capabilities";
import type { StageId, Step } from "@/lib/stages";
import type { BuildingState } from "@/hooks/use-player";

interface BulkActionBarProps {
  stageId: StageId;
  buildings: BuildingState[];
  pending: bigint[];
  now: number;
  onSuccess: () => void;
}

/**
 * Renders only when wallet supports EIP-5792 batching.
 * Surfaces "Claim All" + "Finalize All" so a player can resolve every ready
 * step in one popup. Major UX + leaderboard win on smart wallets.
 */
export function BulkActionBar({
  stageId,
  buildings,
  pending,
  now,
  onSuccess,
}: BulkActionBarProps) {
  const { supportsBatching, supportsPaymaster } = useWalletCapabilities();
  const batch = useBatchGameTx();
  const [activeKind, setActiveKind] = useState<"claim" | "finalize" | null>(
    null,
  );

  // Compute which steps have pending production worth claiming
  const claimable = useMemo<Step[]>(() => {
    const out: Step[] = [];
    for (let i = 0; i < buildings.length; i++) {
      if (buildings[i].built && pending[i] > 0n) {
        out.push((i + 1) as Step);
      }
    }
    return out;
  }, [buildings, pending]);

  // Compute which steps finished construction and need finalize
  const finalizable = useMemo<Step[]>(() => {
    const nowSec = Math.floor(now / 1000);
    const out: Step[] = [];
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (!b.built && b.buildEndsAt > 0 && b.buildEndsAt <= nowSec) {
        out.push((i + 1) as Step);
      }
    }
    return out;
  }, [buildings, now]);

  // Refetch + reset on success
  useEffect(() => {
    if (batch.isSuccess) {
      const label =
        activeKind === "claim"
          ? `Claimed ${claimable.length} steps`
          : `Finalized ${finalizable.length} builds`;
      toast.success(label);
      onSuccess();
      setActiveKind(null);
      batch.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch.isSuccess]);

  // Surface batch errors
  useEffect(() => {
    if (batch.error) {
      const msg =
        (batch.error as { shortMessage?: string }).shortMessage ??
        batch.error.message;
      toast.error(msg);
      setActiveKind(null);
      batch.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch.error]);

  if (!supportsBatching) return null;

  const hasAny = claimable.length > 0 || finalizable.length > 0;
  if (!hasAny && !batch.isPending && !batch.isMining) return null;

  const busy = batch.isPending || batch.isMining;

  function runClaimAll() {
    if (claimable.length === 0) return;
    setActiveKind("claim");
    const actions: BatchAction[] = claimable.map((step) => ({
      fn: "claim",
      args: [stageId, step],
    }));
    batch.sendBatch(actions);
  }

  function runFinalizeAll() {
    if (finalizable.length === 0) return;
    setActiveKind("finalize");
    const actions: BatchAction[] = finalizable.map((step) => ({
      fn: "finalize",
      args: [stageId, step],
    }));
    batch.sendBatch(actions);
  }

  return (
    <AnimatePresence>
      <motion.div
        key="bulk-bar"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="mx-4 mb-4 rounded-xl border border-base-blue/30 bg-gradient-to-r from-base-blue/10 via-card/40 to-card/40 p-3 backdrop-blur"
      >
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-base-blue">
          <Layers className="size-3.5" />
          <span>Smart Wallet Batch</span>
          {supportsPaymaster && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              <Sparkles className="size-2.5" />
              Gas Free
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="base"
            size="sm"
            disabled={claimable.length === 0 || busy}
            onClick={runClaimAll}
            className="flex-1"
          >
            {busy && activeKind === "claim" ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Claiming…
              </>
            ) : (
              <>
                <Coins />
                Claim All
                {claimable.length > 0 && (
                  <span className="ml-1 rounded-full bg-background/30 px-1.5 py-0.5 font-mono text-[10px]">
                    {claimable.length}
                  </span>
                )}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={finalizable.length === 0 || busy}
            onClick={runFinalizeAll}
            className="flex-1"
          >
            {busy && activeKind === "finalize" ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Finalizing…
              </>
            ) : (
              <>
                <Hammer />
                Finalize All
                {finalizable.length > 0 && (
                  <span className="ml-1 rounded-full bg-background/30 px-1.5 py-0.5 font-mono text-[10px]">
                    {finalizable.length}
                  </span>
                )}
              </>
            )}
          </Button>
        </div>

        <p className="mt-2 px-0.5 text-[10px] leading-relaxed text-muted-foreground">
          One signature, multiple actions. Powered by EIP-5792.
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
