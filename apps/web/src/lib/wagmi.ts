import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    baseAccount({
      appName: "Base Tycoon",
    }),
    injected(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
  ssr: false,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
