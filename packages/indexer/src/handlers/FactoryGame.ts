/*
 * Base Tycoon Indexer — handlers
 *
 * Strategy: each event upserts the canonical `Player` aggregate (used for
 * leaderboard) AND records the raw event for history/drill-down queries.
 *
 * Player.id is the lower-cased player address.
 */
import { indexer } from "envio";
import type {
  Player,
  FactoryGame_BuildFinalized,
  FactoryGame_BuildStarted,
  FactoryGame_BuilderCodeSet,
  FactoryGame_Claimed,
  FactoryGame_DropRolled,
  FactoryGame_OwnershipTransferred,
  FactoryGame_Paused,
  FactoryGame_Prestiged,
  FactoryGame_StageUnlocked,
  FactoryGame_Unpaused,
  FactoryGame_Upgraded,
} from "envio";

// ---------- Player upsert helper ---------- //

type PlayerCtx = { Player: { get: (id: string) => Promise<Player | undefined>; set: (p: Player) => void } };

async function getOrInitPlayer(
  context: PlayerCtx,
  rawAddr: string,
  blockTs: bigint,
): Promise<Player> {
  const id = rawAddr.toLowerCase();
  const existing = await context.Player.get(id);
  if (existing) return existing;
  return {
    id,
    address: id,
    highestStage: 0n,
    prestigeCount: 0n,
    totalClaims: 0n,
    totalClaimedAmount: 0n,
    totalUpgrades: 0n,
    totalBuilds: 0n,
    rareDrops: 0n,
    firstSeenAt: blockTs,
    lastActiveAt: blockTs,
  };
}

// ---------- Event handlers ---------- //

indexer.onEvent({ contract: "FactoryGame", event: "BuildStarted" }, async ({ event, context }) => {
  const ts = BigInt(event.block.timestamp);
  const player = await getOrInitPlayer(context as unknown as PlayerCtx, event.params.player, ts);
  context.Player.set({
    ...player,
    totalBuilds: player.totalBuilds + 1n,
    lastActiveAt: ts,
  });

  const entity: FactoryGame_BuildStarted = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    player: event.params.player,
    stage: event.params.stage,
    step: event.params.step,
    endsAt: event.params.endsAt,
  };
  context.FactoryGame_BuildStarted.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "BuildFinalized" }, async ({ event, context }) => {
  const ts = BigInt(event.block.timestamp);
  const player = await getOrInitPlayer(context as unknown as PlayerCtx, event.params.player, ts);
  context.Player.set({
    ...player,
    lastActiveAt: ts,
  });

  const entity: FactoryGame_BuildFinalized = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    player: event.params.player,
    stage: event.params.stage,
    step: event.params.step,
  };
  context.FactoryGame_BuildFinalized.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "Claimed" }, async ({ event, context }) => {
  const ts = BigInt(event.block.timestamp);
  const player = await getOrInitPlayer(context as unknown as PlayerCtx, event.params.player, ts);
  context.Player.set({
    ...player,
    totalClaims: player.totalClaims + 1n,
    totalClaimedAmount: player.totalClaimedAmount + event.params.amount,
    lastActiveAt: ts,
  });

  const entity: FactoryGame_Claimed = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    player: event.params.player,
    stage: event.params.stage,
    step: event.params.step,
    amount: event.params.amount,
  };
  context.FactoryGame_Claimed.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "Upgraded" }, async ({ event, context }) => {
  const ts = BigInt(event.block.timestamp);
  const player = await getOrInitPlayer(context as unknown as PlayerCtx, event.params.player, ts);
  context.Player.set({
    ...player,
    totalUpgrades: player.totalUpgrades + 1n,
    lastActiveAt: ts,
  });

  const entity: FactoryGame_Upgraded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    player: event.params.player,
    stage: event.params.stage,
    step: event.params.step,
    newLevel: event.params.newLevel,
  };
  context.FactoryGame_Upgraded.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "StageUnlocked" }, async ({ event, context }) => {
  const ts = BigInt(event.block.timestamp);
  const player = await getOrInitPlayer(context as unknown as PlayerCtx, event.params.player, ts);
  const newStage = event.params.stage;
  context.Player.set({
    ...player,
    highestStage: newStage > player.highestStage ? newStage : player.highestStage,
    lastActiveAt: ts,
  });

  const entity: FactoryGame_StageUnlocked = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    player: event.params.player,
    stage: event.params.stage,
  };
  context.FactoryGame_StageUnlocked.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "Prestiged" }, async ({ event, context }) => {
  const ts = BigInt(event.block.timestamp);
  const player = await getOrInitPlayer(context as unknown as PlayerCtx, event.params.player, ts);
  context.Player.set({
    ...player,
    prestigeCount: event.params.newPrestigeCount,
    lastActiveAt: ts,
  });

  const entity: FactoryGame_Prestiged = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    player: event.params.player,
    newPrestigeCount: event.params.newPrestigeCount,
  };
  context.FactoryGame_Prestiged.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "DropRolled" }, async ({ event, context }) => {
  const ts = BigInt(event.block.timestamp);
  const player = await getOrInitPlayer(context as unknown as PlayerCtx, event.params.player, ts);
  context.Player.set({
    ...player,
    rareDrops: player.rareDrops + 1n,
    lastActiveAt: ts,
  });

  const entity: FactoryGame_DropRolled = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    player: event.params.player,
    nftId: event.params.nftId,
    rarity: event.params.rarity,
    stage: event.params.stage,
  };
  context.FactoryGame_DropRolled.set(entity);
});

// Admin / pause events — kept as raw entities, not aggregated.
indexer.onEvent({ contract: "FactoryGame", event: "BuilderCodeSet" }, async ({ event, context }) => {
  const entity: FactoryGame_BuilderCodeSet = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    code: event.params.code,
  };
  context.FactoryGame_BuilderCodeSet.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "OwnershipTransferred" }, async ({ event, context }) => {
  const entity: FactoryGame_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };
  context.FactoryGame_OwnershipTransferred.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "Paused" }, async ({ event, context }) => {
  const entity: FactoryGame_Paused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
  };
  context.FactoryGame_Paused.set(entity);
});

indexer.onEvent({ contract: "FactoryGame", event: "Unpaused" }, async ({ event, context }) => {
  const entity: FactoryGame_Unpaused = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    account: event.params.account,
  };
  context.FactoryGame_Unpaused.set(entity);
});
