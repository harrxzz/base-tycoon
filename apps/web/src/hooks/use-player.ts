import { useReadContract, useReadContracts, useAccount } from "wagmi";
import { CONTRACTS, FACTORY_GAME_ABI, RESOURCES_ABI, tokenId } from "@/lib/contracts";
import { STAGE_LIST, type StageId, type SubTier } from "@/lib/stages";

export interface PlayerState {
  highestStage: number;
  prestigeCount: bigint;
  totalTaps: bigint;
  totalTx: bigint;
}

export function usePlayer() {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.game,
    abi: FACTORY_GAME_ABI,
    functionName: "getPlayer",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 8_000 },
  });

  const player: PlayerState | undefined = data
    ? {
        highestStage: Number(data[0]),
        prestigeCount: data[1],
        totalTaps: data[2],
        totalTx: data[3],
      }
    : undefined;

  return { player, isLoading, refetch };
}

export interface MineState {
  unlocked: boolean;
  level: number;
  autoRate: number;
  lastClaim: bigint;
  lastTap: bigint;
}

/** Read all 4 mines for a given stage at once. */
export function useStageMines(stage: StageId) {
  const { address } = useAccount();
  const { data, refetch } = useReadContracts({
    contracts: ([0, 1, 2, 3] as SubTier[]).map((sub) => ({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "getMine" as const,
      args: address ? [address, stage, sub] : undefined,
    })),
    query: { enabled: !!address, refetchInterval: 8_000 },
  });

  const mines: (MineState | undefined)[] = (data ?? []).map((r) => {
    if (r.status !== "success" || !r.result) return undefined;
    const [unlocked, level, autoRate, lastClaim, lastTap] = r.result as readonly [
      boolean,
      number,
      number,
      bigint,
      bigint,
    ];
    return {
      unlocked,
      level: Number(level),
      autoRate: Number(autoRate),
      lastClaim,
      lastTap,
    };
  });

  return { mines, refetch };
}

/** Read all 4 sub-tier balances for a given stage. */
export function useStageBalances(stage: StageId) {
  const { address } = useAccount();
  const { data, refetch } = useReadContracts({
    contracts: ([0, 1, 2, 3] as SubTier[]).map((sub) => ({
      address: CONTRACTS.resources,
      abi: RESOURCES_ABI,
      functionName: "balanceOf" as const,
      args: address ? [address, tokenId(stage, sub)] : undefined,
    })),
    query: { enabled: !!address, refetchInterval: 8_000 },
  });

  const balances: bigint[] = (data ?? []).map((r) =>
    r.status === "success" ? (r.result as bigint) : 0n,
  );
  return { balances, refetch };
}

/** Convenience: which stages does the player have unlocked? Stage 1 is auto. */
export function useUnlockedStages() {
  const { player } = usePlayer();
  const unlocked = new Set<StageId>();
  if (player && player.highestStage > 0) {
    for (let i = 1; i <= player.highestStage; i++) unlocked.add(i as StageId);
  } else {
    // Pre-init: show Stage 1 as available (first tap will init it).
    unlocked.add(1);
  }
  return unlocked;
}

export const ALL_STAGES = STAGE_LIST;
