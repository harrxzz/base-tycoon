import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CoinPop {
  id: number;
  amount: bigint;
}

/**
 * Watches a balance value; when it INCREASES, emits a floating "+N" pop
 * animation that drifts up and fades out. Used after Claim/Finalize.
 */
export function CoinPopOverlay({
  balance,
  className = "",
}: {
  balance: bigint;
  className?: string;
}) {
  const prevRef = useRef<bigint | null>(null);
  const [pops, setPops] = useState<CoinPop[]>([]);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = balance;
    // Skip first render (no prev to diff against)
    if (prev === null) return;
    if (balance > prev) {
      const delta = balance - prev;
      const id = Date.now() + Math.random();
      setPops((p) => [...p, { id, amount: delta }]);
      // Auto-cleanup after animation finishes
      setTimeout(() => {
        setPops((p) => p.filter((pop) => pop.id !== id));
      }, 1800);
    }
  }, [balance]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <AnimatePresence>
        {pops.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0, scale: 0.7 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [-2, -28, -44, -56],
              scale: [0.7, 1.1, 1, 0.9],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.6,
              ease: "easeOut",
              times: [0, 0.15, 0.7, 1],
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[13px] font-semibold text-mac-green drop-shadow-[0_0_8px_rgba(48,209,88,0.4)]"
          >
            +{p.amount.toLocaleString()}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
