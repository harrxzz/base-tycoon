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
 * Paymaster capabilities — sponsors gas via Coinbase CDP.
 * Only applied when VITE_PAYMASTER_URL is set; smart wallets that don't
 * support `paymasterService` capability will silently ignore it.
 *
 * Set VITE_PAYMASTER_URL to your CDP Paymaster RPC endpoint:
 *   https://api.developer.coinbase.com/rpc/v1/base-sepolia/<API_KEY>
 */
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL as string | undefined;

const paymasterCapabilities = PAYMASTER_URL
  ? {
      paymasterService: {
        url: PAYMASTER_URL,
      },
    }
  : undefined;

/**
 * Batched onchain actions via EIP-5792 useSendCalls.
 * Smart wallets execute all calls in a single atomic UserOp (one popup, one tx).
 * Up to ~30 calls per UserOp depending on bundler limits.
 *
 * Gas is sponsored by CDP Paymaster when VITE_PAYMASTER_URL is configured.
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
      capabilities: paymasterCapabilities,
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
      capabilities: paymasterCapabilities,
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
    /** True when paymaster is configured (gas sponsored). */
    sponsored: Boolean(PAYMASTER_URL),
  };
}
