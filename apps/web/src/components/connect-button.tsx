import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useWalletModal } from "@/lib/wallet-modal-store";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function ConnectButton() {
  const { address, isConnected, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const openModal = useWalletModal((s) => s.open);

  if (isReconnecting) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Wallet />
        Reconnecting…
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-mono text-muted-foreground">
          {shortAddr(address)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => disconnect()}
          aria-label="Disconnect"
        >
          <LogOut />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="base" size="sm" onClick={openModal}>
      <Wallet />
      Connect Wallet
    </Button>
  );
}
