import { useState } from "react";
import { useAccount, useConnect, type Connector } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletModal } from "@/lib/wallet-modal-store";
import {
  Sparkles,
  Zap,
  Layers,
  Shield,
  ChevronDown,
  ChevronUp,
  Wallet,
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Zero gas fees",
    desc: "Every transaction sponsored by our Paymaster. You play free.",
  },
  {
    icon: Layers,
    title: "Batched actions",
    desc: "Claim 8 steps in one tap. One signature, eight rewards.",
  },
  {
    icon: Shield,
    title: "Passkey login",
    desc: "Face ID or Touch ID. No seed phrase to lose.",
  },
];

function ConnectorRow({
  connector,
  onConnect,
  pending,
}: {
  connector: Connector;
  onConnect: (c: Connector) => void;
  pending: boolean;
}) {
  return (
    <button
      onClick={() => onConnect(connector)}
      disabled={pending}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card/40 px-4 py-3 text-sm transition-all hover:border-base-blue/40 hover:bg-card disabled:opacity-50"
    >
      {connector.icon ? (
        <img
          src={connector.icon}
          alt={connector.name}
          className="size-6 rounded"
        />
      ) : (
        <Wallet className="size-5 text-muted-foreground" />
      )}
      <span className="flex-1 text-left font-medium">{connector.name}</span>
      <span className="text-xs text-muted-foreground">
        {pending ? "…" : "Connect"}
      </span>
    </button>
  );
}

export function WalletModal() {
  const { isOpen, setOpen, close } = useWalletModal();
  const { isConnected } = useAccount();
  const { connectors, connect, isPending, variables } = useConnect();
  const [showOther, setShowOther] = useState(false);

  // Auto-close when connected
  if (isConnected && isOpen) {
    setTimeout(() => close(), 200);
  }

  const baseAcc = connectors.find((c) => c.id === "baseAccount");
  const otherConnectors = connectors.filter((c) => c.id !== "baseAccount");

  const handleConnect = (c: Connector) => {
    connect({ connector: c });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-base-blue/40 bg-base-blue/10 px-2.5 py-1 text-xs font-medium text-base-blue">
            <Sparkles className="size-3" />
            Recommended
          </div>
          <DialogTitle className="text-xl">
            Connect with Base Account
          </DialogTitle>
          <DialogDescription>
            The smart wallet built for Base. No seed phrase, no gas fees, no
            hassle.
          </DialogDescription>
        </DialogHeader>

        {/* Benefits grid */}
        <div className="space-y-2.5 py-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-md bg-base-blue/10 text-base-blue">
                <b.icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{b.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        {baseAcc && (
          <Button
            variant="base"
            size="lg"
            className="w-full"
            onClick={() => handleConnect(baseAcc)}
            disabled={isPending}
          >
            <Sparkles />
            {isPending && variables?.connector === baseAcc
              ? "Opening Base Account…"
              : "Continue with Base Account"}
          </Button>
        )}

        {/* Other wallets — collapsible */}
        {otherConnectors.length > 0 && (
          <div className="border-t border-border/60 pt-4">
            <button
              onClick={() => setShowOther((v) => !v)}
              className="flex w-full items-center justify-between text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>Use another wallet (MetaMask, Rabby, OKX…)</span>
              {showOther ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>

            {showOther && (
              <div className="mt-3 space-y-2">
                {otherConnectors.map((c) => (
                  <ConnectorRow
                    key={c.uid}
                    connector={c}
                    onConnect={handleConnect}
                    pending={isPending && variables?.connector === c}
                  />
                ))}
                <p className="px-1 pt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Heads up — EOA wallets don't support gas sponsorship or batch
                  transactions. You'll pay your own gas and sign every action.
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
