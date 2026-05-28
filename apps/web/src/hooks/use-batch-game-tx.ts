import {
  useSendCalls,
  useWaitForCallsStatus,
  useAccount,
} from "wagmi";
import { encodeFunctionData } from "viem";
import { baseSepolia } from "wagmi/chains";
import { CONTRACTS, FACTORY_GAME_ABI } from "@/lib/contracts";
import type { StageId, Step } from "@/lib/stages";

export type BatchAction =
  | { fn: "build"; args: [StageId, Step] }
  | { fn: "finalize"; args: [StageId, Step] }
  | { fn: "claim"; args: [StageId, Step] }
  | { fn: "upgrade"; args: [StageId, Step] }
  | { fn: "unlockStage"; args: [StageId] }
  | { fn: "prestige"; args: [] }
  | { fn: "rollDrop"; args: [] };

/**
 * Batched onchain actions via EIP-5792 useSendCalls.
 * Smart wallets execute all calls in a single atomic UserOp (one popup, one tx).
 * Up to ~30 calls per UserOp depending on bundler limits.
 */
export function useBatchGameTx() {
  const { address } = useAccount();
  const {
    sendCalls,
    sendCallsAsync,
    data,
    isPending,
    error,
    reset,
  } = useSendCalls();

  const {
    isLoading: isMining,
    isSuccess,
    status,
  } = useWaitForCallsStatus({
    id: data?.id,
  });

  const sendBatch = (actions: BatchAction[]) => {
    if (!address) throw new Error("No connected account");
    if (actions.length === 0) return;

    const calls = actions.map((a) => ({
      to: CONTRACTS.game,
      data: encodeFunctionData({
        abi: FACTORY_GAME_ABI,
        functionName: a.fn as never,
        args: a.args as never,
      }),
    }));

    sendCalls({
      calls,
      chainId: baseSepolia.id,
    });
  };

  const sendBatchAsync = (actions: BatchAction[]) => {
    if (!address) throw new Error("No connected account");
    if (actions.length === 0) return Promise.resolve(undefined);

    const calls = actions.map((a) => ({
      to: CONTRACTS.game,
      data: encodeFunctionData({
        abi: FACTORY_GAME_ABI,
        functionName: a.fn as never,
        args: a.args as never,
      }),
    }));

    return sendCallsAsync({
      calls,
      chainId: baseSepolia.id,
    });
  };

  return {
    sendBatch,
    sendBatchAsync,
    id: data?.id,
    status,
    isPending,
    isMining,
    isSuccess,
    error,
    reset,
  };
}
