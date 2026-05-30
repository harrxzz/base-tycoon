import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard, INDEXER_URL, type LeaderboardRow } from "@/lib/indexer";

/**
 * Live leaderboard backed by Envio HyperIndex.
 *
 * Source: VITE_INDEXER_URL — when unset, the query is disabled and the route
 * falls back to mock data so the UI still renders during local dev.
 */
export function useLeaderboard(limit = 25) {
  return useQuery<LeaderboardRow[]>({
    queryKey: ["leaderboard", limit],
    queryFn: () => fetchLeaderboard(limit),
    enabled: Boolean(INDEXER_URL),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

export const HAS_INDEXER = Boolean(INDEXER_URL);
