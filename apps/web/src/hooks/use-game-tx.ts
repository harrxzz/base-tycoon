import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { CONTRACTS, FACTORY_GAME_ABI } from "@/lib/contracts";
import type { StageId, Step } from "@/lib/stages";

/** Single hook for every onchain action. */
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

  const call = (functionName: string, args?: readonly unknown[]) =>
    writeContractAsync({
      address: CONTRACTS.game,
      abi: FACTORY_GAME_ABI,
      functionName: functionName as never,
      args: args as never,
      account: address,
    });

  return {
    build: (stage: StageId, step: Step) => call("build", [stage, step]),
    finalize: (stage: StageId, step: Step) => call("finalize", [stage, step]),
    claim: (stage: StageId, step: Step) => call("claim", [stage, step]),
    upgrade: (stage: StageId, step: Step) => call("upgrade", [stage, step]),
    unlockStage: (nextStage: StageId) => call("unlockStage", [nextStage]),
    prestige: () => call("prestige"),
    rollDrop: () => call("rollDrop"),
    hash,
    isPending,
    isMining,
    isSuccess,
    error,
    reset,
  };
}
