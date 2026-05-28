import { useCapabilities } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useMemo } from "react";

/**
 * Detect EIP-5792 wallet capabilities for the active connector on Base Sepolia.
 * Smart wallets (Base Account, Coinbase Smart Wallet) support both atomic batching
 * and paymaster sponsorship. EOAs (MetaMask, Rabby, OKX) support neither.
 *
 * Reference: https://docs.base.org/apps/quickstart/build-app
 */
export function useWalletCapabilities() {
  const { data: capabilities } = useCapabilities();

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[baseSepolia.id]?.atomic;
    return atomic?.status === "ready" || atomic?.status === "supported";
  }, [capabilities]);

  const supportsPaymaster = useMemo(() => {
    return (
      capabilities?.[baseSepolia.id]?.paymasterService?.supported === true
    );
  }, [capabilities]);

  return { supportsBatching, supportsPaymaster, capabilities };
}
