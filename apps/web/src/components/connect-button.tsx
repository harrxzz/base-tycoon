import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

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

  const cb = connectors.find((c) => c.id === "coinbaseWalletSDK") ?? connectors[0];

  return (
    <Button
      variant="base"
      size="sm"
      onClick={() => cb && connect({ connector: cb })}
      disabled={isPending}
    >
      <Wallet />
      {isPending ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
