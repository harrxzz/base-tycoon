import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TARGET_CHAIN = baseSepolia;

/**
 * Banner that shows when user is connected to the wrong chain.
 * Calls switchChain() — works on EOAs (MetaMask, Rabby, OKX) AND smart wallets.
 *
 * Returns null when:
 *   - user not connected
 *   - already on the correct chain
 */
export function WrongNetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending, error } = useSwitchChain();

  if (!isConnected) return null;
  if (chainId === TARGET_CHAIN.id) return null;

  const handleSwitch = () => {
    switchChain({ chainId: TARGET_CHAIN.id });
  };

  return (
    <div className="sticky top-12 z-30 border-b border-mac-yellow/30 bg-mac-yellow/10 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[13px]">
          <AlertTriangle className="size-3.5 shrink-0 text-mac-yellow" />
          <span className="text-foreground/90">
            You&apos;re on the wrong network.{" "}
            <span className="text-muted-foreground">
              Base Tycoon runs on{" "}
              <span className="font-medium text-foreground">
                {TARGET_CHAIN.name}
              </span>
              .
            </span>
          </span>
        </div>
        <Button
          size="sm"
          variant="base"
          onClick={handleSwitch}
          disabled={isPending}
          className="h-7 gap-1.5 px-2.5 text-[12px]"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              Switching…
            </>
          ) : (
            <>
              Switch to {TARGET_CHAIN.name}
              <ArrowRight className="size-3" />
            </>
          )}
        </Button>
      </div>
      {error ? (
        <div className="mx-auto max-w-6xl px-4 pb-2 text-[11px] text-mac-red/90">
          {error.message.split(".")[0]}.
        </div>
      ) : null}
    </div>
  );
}
