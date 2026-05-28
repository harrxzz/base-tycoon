import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useWalletModal } from "@/lib/wallet-modal-store";

const SEEN_KEY = "base-tycoon:wallet-popup-seen";

/**
 * Auto-open the wallet modal on first visit if user is not connected.
 * Uses localStorage to remember dismissal so repeat visitors aren't annoyed.
 * Waits a tick so wagmi has time to attempt reconnection first.
 */
export function useFirstVisitWalletPrompt() {
  const { isConnected, isReconnecting } = useAccount();
  const open = useWalletModal((s) => s.open);

  useEffect(() => {
    // Wait for wagmi to settle reconnection state
    if (isReconnecting) return;
    if (isConnected) return;

    const seen = localStorage.getItem(SEEN_KEY);
    if (seen) return;

    // Small delay so the page has rendered
    const t = setTimeout(() => {
      open();
      localStorage.setItem(SEEN_KEY, "1");
    }, 800);

    return () => clearTimeout(t);
  }, [isConnected, isReconnecting, open]);
}
