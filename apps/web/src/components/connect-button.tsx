import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function ConnectButton() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Doc-recommended: handle all four useAccount states to avoid UI flashes
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

  // Prefer baseAccount connector over injected
  const baseAcc =
    connectors.find((c) => c.id === "baseAccount") ?? connectors[0];

  const busy = isPending || isConnecting;

  return (
    <Button
      variant="base"
      size="sm"
      onClick={() => baseAcc && connect({ connector: baseAcc })}
      disabled={busy}
    >
      <Wallet />
      {busy ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
