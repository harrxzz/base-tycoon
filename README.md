# Base Tycoon

Idle factory tycoon game on Base. Tap, craft, combine, climb six themed industries
— lumber, café, candy, crystal, mech, bonsai — with every onchain action sponsored
via Paymaster.

## Stack

- **Frontend:** Vite + React 19 + TypeScript, Tailwind v4, shadcn/ui style + Aceternity-style motion
- **Web3:** wagmi v3 + viem, Coinbase Smart Wallet
- **Contracts:** Foundry, Solidity 0.8.24, OpenZeppelin v5
- **Chain:** Base (Sepolia testnet → Base mainnet at launch)

## Monorepo

```
apps/web/                Vite React app
packages/contracts/      Foundry contracts (Resources, RareDrops, FactoryGame)
```

## Deployed Contracts (Base Sepolia · 84532)

| Contract | Address |
| --- | --- |
| Resources (ERC-1155) | `0xF8CdE874383c97CACAC993dE344103336dF10477` |
| RareDrops (ERC-721)  | `0x4a27Be07308CE89aa347dc3e9cbbF21f832f3073` |
| FactoryGame          | `0x116aB9E41d88468C4feBE3C03341EC4FE7b636b4` |

## Develop

```bash
pnpm install
pnpm --filter web dev
```

## Build

```bash
pnpm --filter web build
```

## Contracts

```bash
cd packages/contracts
forge build
forge test -vv
```

See `packages/contracts/README.md` for the full deploy guide.
