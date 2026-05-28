import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { CONTRACTS, FACTORY_GAME_ABI } from "@/lib/contracts";
import type { StageId, SubTier } from "@/lib/stages";

/** Generic write-then-wait wrapper for any FactoryGame action. */
export function useGameTx() {
  const { address } = useAccount();
  const {
    writeContractAsync,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const tap = (stage: StageId, subTier: SubTier) =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "tap",
      args: [stage, subTier],
      account: address,
    });

  const claim = (stage: StageId, subTier: SubTier) =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "claim",
      args: [stage, subTier],
      account: address,
    });

  const upgrade = (stage: StageId, subTier: SubTier) =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "upgradeMine",
      args: [stage, subTier],
      account: address,
    });

  const combine = (stage: StageId, fromSub: SubTier) =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "combine",
      args: [stage, fromSub],
      account: address,
    });

  const unlockStage = (nextStage: StageId) =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "unlockStage",
      args: [nextStage],
      account: address,
    });

  const prestige = () =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "prestige",
      account: address,
    });

  const rollDrop = () =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: "rollDrop",
      account: address,
    });

  return {
    tap,
    claim,
    upgrade,
    combine,
    unlockStage,
    prestige,
    rollDrop,
    hash,
    isPending,
    isMining,
    isSuccess,
    error,
    reset,
  };
}
