/*
 * Envio HyperIndex client — minimal GraphQL fetch, no extra deps.
 *
 * Endpoint comes from VITE_INDEXER_URL (e.g. https://indexer.<project>.envio.dev/v1/graphql).
 * If unset, useLeaderboard falls back to mock data so the UI still renders.
 */

export const INDEXER_URL = import.meta.env.VITE_INDEXER_URL as
  | string
  | undefined;

export type LeaderboardRow = {
  id: string; // address (lowercased)
  address: string;
  highestStage: number;
  prestigeCount: number;
  totalClaims: number;
  totalClaimedAmount: string; // BigInt as string from GraphQL
  totalUpgrades: number;
  totalBuilds: number;
  rareDrops: number;
  lastActiveAt: number;
};

type Raw = {
  id: string;
  address: string;
  highestStage: string;
  prestigeCount: string;
  totalClaims: string;
  totalClaimedAmount: string;
  totalUpgrades: string;
  totalBuilds: string;
  rareDrops: string;
  lastActiveAt: string;
};

const LEADERBOARD_QUERY = /* GraphQL */ `
  query Leaderboard($limit: Int!) {
    Player(limit: $limit, order_by: [{ totalBuilds: desc }, { lastActiveAt: desc }]) {
      id
      address
      highestStage
      prestigeCount
      totalClaims
      totalClaimedAmount
      totalUpgrades
      totalBuilds
      rareDrops
      lastActiveAt
    }
  }
`;

export async function fetchLeaderboard(limit = 25): Promise<LeaderboardRow[]> {
  if (!INDEXER_URL) {
    throw new Error("VITE_INDEXER_URL not set");
  }

  const res = await fetch(INDEXER_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: LEADERBOARD_QUERY,
      variables: { limit },
    }),
  });

  if (!res.ok) {
    throw new Error(`indexer request failed: ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: { Player?: Raw[] };
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  const rows = json.data?.Player ?? [];
  return rows.map((r) => ({
    id: r.id,
    address: r.address,
    highestStage: Number(r.highestStage),
    prestigeCount: Number(r.prestigeCount),
    totalClaims: Number(r.totalClaims),
    totalClaimedAmount: r.totalClaimedAmount,
    totalUpgrades: Number(r.totalUpgrades),
    totalBuilds: Number(r.totalBuilds),
    rareDrops: Number(r.rareDrops),
    lastActiveAt: Number(r.lastActiveAt),
  }));
}

/** Compose a leaderboard "score" from event counts — purely cosmetic. */
export function computeScore(row: LeaderboardRow): number {
  return (
    row.totalBuilds * 10 +
    row.totalClaims * 8 +
    row.totalUpgrades * 5 +
    row.rareDrops * 50 +
    row.prestigeCount * 200 +
    row.highestStage * 25
  );
}

export function shortAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
