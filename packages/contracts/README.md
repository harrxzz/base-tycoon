# Base Tycoon Contracts

Foundry project for the Base Tycoon onchain game.

## Contracts

- `GameConstants.sol` — encoding helpers and timing constants
- `Resources.sol` — ERC-1155 for 24 resources (6 stages × 4 sub-tiers)
- `RareDrops.sol` — ERC-721 for cosmetic + prestige NFTs
- `FactoryGame.sol` — main game logic (tap, claim, combine, upgrade, unlock, prestige, roll)

## Token ID encoding

```
tokenId = stage * 10 + subTier
```

| Stage | Sub 0 | Sub 1 | Sub 2 | Sub 3 |
| --- | --- | --- | --- | --- |
| 1 Lumber | 10 Twig | 11 Plank | 12 Chair | 13 Throne |
| 2 Cocoa  | 20 Bean | 21 Espresso | 22 Latte | 23 Golden Cup |
| 3 Candy  | 30 Sugar | 31 Lollipop | 32 Gummy Dragon | 33 Diamond Cake |
| 4 Quartz | 40 Shard | 41 Amethyst | 42 Diamond | 43 Soul Crystal |
| 5 Mech   | 50 Bolt | 51 Gear | 52 Drone | 53 Titan Mech |
| 6 Bonsai | 60 Sprout | 61 Sapling | 62 Ancient Tree | 63 World Tree |

## Build & test

```bash
forge build
forge test -vv
```

## Deploy (Base Sepolia)

```bash
# 1. import a deployer key into the foundry keystore
cast wallet import deployer --interactive

# 2. set env vars
export BUILDER_CODE=$(cast format-bytes32-string "BASE_TYCOON_V1")
export RESOURCES_URI="ipfs://<CID>/{id}.json"
export DROPS_URI="ipfs://<CID>/"
export BASESCAN_API_KEY="..."

# 3. broadcast
forge script script/Deploy.s.sol \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  --account deployer
```

Output prints the three deployed addresses — copy them into
`apps/web/src/lib/contracts.ts`.
