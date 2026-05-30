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
| Resources (ERC-1155) | `0x9407425515E2F7644b0bb7B5B64F20057e33c155` |
| RareDrops (ERC-721)  | `0x2bb211838F3333b8F3DB6DC96AA9898A843f231b` |
| FactoryGame          | `0x1D993B8826a902eaB9CC6AB4B0E1EA2DaF462d9B` |

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
