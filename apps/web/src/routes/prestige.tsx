import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import {
  Crown,
  Sparkles as SparklesIcon,
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "@/components/motion/sparkles";

import { usePlayer } from "@/hooks/use-player";
import { useGameTx } from "@/hooks/use-game-tx";
import { useWalletModal } from "@/lib/wallet-modal-store";
import {
  CONTRACTS,
  RESOURCES_ABI,
  STAGE_COUNT,
  STEPS_PER_STAGE,
  tokenId,
} from "@/lib/contracts";

const FINAL_TOKEN_ID = tokenId(STAGE_COUNT, STEPS_PER_STAGE); // 608 — Throne Hall

export default function PrestigeRoute() {
  const { address, isConnected } = useAccount();
  const { player, refetch: refetchPlayer } = usePlayer();
  const tx = useGameTx();
  const openWalletModal = useWalletModal((s) => s.open);

  // Read balance of stage-6 step-8 (the prestige gate).
  const { data: finalBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.resources,
    abi: RESOURCES_ABI,
    functionName: "balanceOf",
    args: address ? [address, FINAL_TOKEN_ID] : undefined,
    query: { enabled: !!address, refetchInterval: 6_000 },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);

  const highestStage = player?.highestStage ?? 0;
  const prestigeCount = Number(player?.prestigeCount ?? 0n);
  const finalBal = finalBalance ?? 0n;
  const eligible = isConnected && finalBal > 0n;

  // Toast on prestige success.
  useEffect(() => {
    if (tx.isSuccess) {
      const explorerHref = tx.hash
        ? `https://sepolia.basescan.org/tx/${tx.hash}`
        : null;
      toast.success("Prestige complete", {
        description:
          "Your empire reset. Commemorative NFT minted to your wallet.",
        action: explorerHref
          ? {
              label: "View tx",
              onClick: () => window.open(explorerHref, "_blank", "noopener"),
            }
          : undefined,
      });
      setConfirmOpen(false);
      refetchPlayer();
      refetchBalance();
      tx.reset();
    }
  }, [tx, tx.isSuccess, tx.hash, refetchPlayer, refetchBalance]);

  // Toast on error.
  useEffect(() => {
    if (tx.error) {
      toast.error("Prestige failed", {
        description:
          (tx.error as Error)?.message?.slice(0, 140) ?? "Unknown error",
      });
    }
  }, [tx.error]);

  const busy = tx.isPending || tx.isMining;

  const onConfirm = async () => {
    try {
      await tx.prestige();
    } catch (e) {
      // Already surfaced via tx.error.
      console.error(e);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Card className="relative overflow-hidden border-mac-blue/30 bg-gradient-to-br from-mac-blue/10 via-card to-card">
        <Sparkles count={40} color="oklch(0.75 0.18 60)" />
        <CardContent className="relative flex flex-col items-center gap-5 p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="grid size-14 place-items-center rounded-2xl bg-mac-orange/15 text-mac-orange"
          >
            <Crown />
          </motion.div>

          <div className="eyebrow inline-flex items-center gap-2">
            <SparklesIcon className="size-3 text-mac-orange" />
            The IPO Ritual
          </div>

          <h1 className="font-serif text-4xl leading-[1.05] sm:text-5xl">
            Prestige
          </h1>
          <div className="editorial-rule w-16" />

          <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Reach Stage 6 and craft a{" "}
            <span className="font-serif-italic text-foreground/90">
              Throne Hall
            </span>{" "}
            to unlock the IPO ritual. Reset your empire for a permanent badge of
            honor and a commemorative rare NFT.
          </p>

          {/* Stat strip */}
          {isConnected && (
            <div className="mt-2 grid w-full max-w-md grid-cols-3 gap-2 rounded-[12px] mac-card p-3 text-left">
              <Stat
                label="Highest stage"
                value={`${highestStage} / ${STAGE_COUNT}`}
                accent={
                  highestStage >= STAGE_COUNT
                    ? "text-mac-green"
                    : "text-foreground"
                }
              />
              <Stat
                label="Throne Halls"
                value={finalBal.toString()}
                accent={finalBal > 0n ? "text-mac-orange" : "text-foreground"}
              />
              <Stat
                label="Prestige count"
                value={`★ ${prestigeCount}`}
                accent="text-mac-purple"
              />
            </div>
          )}

          {/* CTA */}
          <div className="mt-2">
            {!isConnected ? (
              <Button
                variant="base"
                size="xl"
                onClick={() => openWalletModal()}
              >
                <Wallet />
                Connect Wallet
              </Button>
            ) : eligible ? (
              <Button
                variant="base"
                size="xl"
                disabled={busy}
                onClick={() => setConfirmOpen(true)}
              >
                {busy ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <SparklesIcon />
                )}
                {busy ? "Prestiging…" : "Prestige Now"}
              </Button>
            ) : (
              <Button variant="base" size="xl" disabled>
                <Lock />
                {highestStage < STAGE_COUNT
                  ? `Locked — Reach Stage ${STAGE_COUNT} First`
                  : "Locked — Craft a Throne Hall"}
              </Button>
            )}
          </div>

          {/* Eligibility hint */}
          {isConnected && !eligible && (
            <p className="text-xs text-muted-foreground">
              {highestStage < STAGE_COUNT
                ? `Climb through ${
                    STAGE_COUNT - highestStage
                  } more stage${STAGE_COUNT - highestStage === 1 ? "" : "s"} to begin the ritual.`
                : "Build, finalize, and claim your first Throne Hall to unlock prestige."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reward + cost breakdown */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2 text-mac-green">
              <CheckCircle2 className="size-4" />
              <h3 className="text-sm font-semibold tracking-tight">
                You gain
              </h3>
            </div>
            <ul className="space-y-2 text-[13px] text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-mac-orange">★</span>
                <span>
                  <span className="text-foreground">+1 prestige count</span> on
                  the leaderboard, forever.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-mac-purple">◆</span>
                <span>
                  A{" "}
                  <span className="text-foreground">commemorative rare NFT</span>{" "}
                  minted to your wallet.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-mac-blue">∞</span>
                <span>
                  A clean slate — Stage 1 fresh, ready to climb again.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2 text-mac-yellow">
              <AlertTriangle className="size-4" />
              <h3 className="text-sm font-semibold tracking-tight">
                You reset
              </h3>
            </div>
            <ul className="space-y-2 text-[13px] text-muted-foreground">
              <li className="flex gap-2">
                <RefreshCcw className="mt-0.5 size-3 shrink-0 text-mac-yellow" />
                <span>All 6 stages — buildings, levels, in-flight builds.</span>
              </li>
              <li className="flex gap-2">
                <RefreshCcw className="mt-0.5 size-3 shrink-0 text-mac-yellow" />
                <span>
                  Stage 1 step 1 is auto-rebuilt at level 1, mining fresh.
                </span>
              </li>
              <li className="flex gap-2">
                <RefreshCcw className="mt-0.5 size-3 shrink-0 text-mac-yellow" />
                <span>
                  Resources & rare drops in your wallet are{" "}
                  <span className="text-foreground">untouched</span>.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="size-4 text-mac-orange" />
              Confirm Prestige
            </DialogTitle>
            <DialogDescription>
              This action is irreversible. Your factories will reset to Stage 1.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-[10px] border border-mac-yellow/30 bg-mac-yellow/5 p-3 text-[13px] leading-relaxed text-muted-foreground">
            <span className="text-foreground">After prestige</span>: Stage 1 step
            1 starts fresh at level 1. All other buildings clear. You receive a
            rare NFT and your prestige count goes from{" "}
            <span className="font-mono text-foreground">{prestigeCount}</span>{" "}
            to{" "}
            <span className="font-mono text-mac-purple">
              {prestigeCount + 1}
            </span>
            .
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button variant="base" onClick={onConfirm} disabled={busy}>
              {busy ? (
                <Loader2 className="animate-spin" />
              ) : (
                <SparklesIcon />
              )}
              {busy ? "Prestiging…" : "Prestige"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-[8px] bg-white/[0.02] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-0.5 font-mono text-base font-semibold ${accent ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
