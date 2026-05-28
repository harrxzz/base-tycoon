import {
  useReadContract,
  useReadContracts,
  useAccount,
} from "wagmi";
import {
  CONTRACTS,
  FACTORY_GAME_ABI,
  RESOURCES_ABI,
  tokenId,
  STEPS_PER_STAGE,
} from "@/lib/contracts";
import type { StageId, Step } from "@/lib/stages";

export interface PlayerState {
  highestStage: number;
  prestigeCount: bigint;
  totalTx: bigint;
  totalProduced: bigint;
}

export function usePlayer(refresh = 6_000) {
  const { address } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACTS.game,
    abi: FACTORY_GAME_ABI,
    functionName: "getPlayer",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: refresh },
  });

  const player: PlayerState | undefined = data
    ? {
        highestStage: Number(data[0]),
        prestigeCount: data[1],
        totalTx: data[2],
        totalProduced: data[3],
      }
    : undefined;

  return { player, isLoading, refetch };
}

export interface BuildingState {
  built: boolean;
  level: number;
  buildEndsAt: number; // unix seconds
  lastClaim: number;
  boostSlot: number;
}

const STEPS_ARR: Step[] = [1, 2, 3, 4, 5, 6, 7, 8];

/** Read all 8 buildings + balances + pending production for a given stage. */
export function useStageData(stage: StageId, refresh = 4_000) {
  const { address } = useAccount();

  // 8 getBuilding + 8 balanceOf + 8 pendingProduction = 24 calls in 1 multicall
  const { data, refetch } = useReadContracts({
    contracts: [
      ...STEPS_ARR.map((step) => ({
        address: CONTRACTS.game,
        abi: FACTORY_GAME_ABI,
        functionName: "getBuilding" as const,
        args: address ? ([address, stage, step] as const) : undefined,
      })),
      ...STEPS_ARR.map((step) => ({
        address: CONTRACTS.resources,
        abi: RESOURCES_ABI,
        functionName: "balanceOf" as const,
        args: address ? ([address, tokenId(stage, step)] as const) : undefined,
      })),
      ...STEPS_ARR.map((step) => ({
        address: CONTRACTS.game,
        abi: FACTORY_GAME_ABI,
        functionName: "pendingProduction" as const,
        args: address ? ([address, stage, step] as const) : undefined,
      })),
    ],
    query: { enabled: !!address, refetchInterval: refresh },
  });

  const buildings: BuildingState[] = STEPS_ARR.map((_, i) => {
    const r = (data ?? [])[i];
    if (!r || r.status !== "success" || !r.result)
      return { built: false, level: 0, buildEndsAt: 0, lastClaim: 0, boostSlot: 0 };
    const [built, level, buildEndsAt, lastClaim, boostSlot] = r.result as readonly [
      boolean,
      number,
      bigint,
      bigint,
      number,
    ];
    return {
      built,
      level: Number(level),
      buildEndsAt: Number(buildEndsAt),
      lastClaim: Number(lastClaim),
      boostSlot: Number(boostSlot),
    };
  });

  const balances: bigint[] = STEPS_ARR.map((_, i) => {
    const r = (data ?? [])[STEPS_PER_STAGE + i];
    return r && r.status === "success" ? (r.result as bigint) : 0n;
  });

  const pending: bigint[] = STEPS_ARR.map((_, i) => {
    const r = (data ?? [])[STEPS_PER_STAGE * 2 + i];
    return r && r.status === "success" ? (r.result as bigint) : 0n;
  });

  return { buildings, balances, pending, refetch };
}

/** Convenience: which stages does the player have unlocked? */
export function useUnlockedStages(highestStage = 0): Set<StageId> {
  const set = new Set<StageId>();
  if (highestStage > 0) {
    for (let i = 1; i <= highestStage; i++) set.add(i as StageId);
  } else {
    set.add(1); // pre-init: show Stage 1 as available
  }
  return set;
}
