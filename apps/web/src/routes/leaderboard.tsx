import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, Loader2 } from "lucide-react";
import { useLeaderboard, HAS_INDEXER } from "@/hooks/use-leaderboard";
import {
  computeScore,
  shortAddress,
  type LeaderboardRow,
} from "@/lib/indexer";

const MOCK_LEADERS: LeaderboardRow[] = [
  {
    id: "0x1cf6f3b62019777e28c4a806f8f899f1f3535004",
    address: "0x1cf6f3B62019777E28c4A806f8F899F1F3535004",
    highestStage: 6,
    prestigeCount: 1,
    totalClaims: 42,
    totalClaimedAmount: "0",
    totalUpgrades: 18,
    totalBuilds: 64,
    rareDrops: 3,
    lastActiveAt: 0,
  },
  {
    id: "0x9f7200000000000000000000000000000000002ff1",
    address: "0x9F72000000000000000000000000000000002FF1",
    highestStage: 5,
    prestigeCount: 0,
    totalClaims: 31,
    totalClaimedAmount: "0",
    totalUpgrades: 12,
    totalBuilds: 47,
    rareDrops: 2,
    lastActiveAt: 0,
  },
  {
    id: "0x73742278c31a76dbb0d2587d03ef92e6e2141023",
    address: "0x73742278c31a76dBb0D2587d03ef92E6E2141023",
    highestStage: 5,
    prestigeCount: 0,
    totalClaims: 24,
    totalClaimedAmount: "0",
    totalUpgrades: 9,
    totalBuilds: 38,
    rareDrops: 1,
    lastActiveAt: 0,
  },
];

export default function LeaderboardRoute() {
  const { data, isLoading, isError, error } = useLeaderboard(25);

  const isMock = !HAS_INDEXER || !data || data.length === 0;
  const rows = isMock ? MOCK_LEADERS : data;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-mac-blue/10 text-mac-blue">
          <Trophy />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Leaderboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Top tycoons by activity on Base Sepolia.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading && HAS_INDEXER ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Fetching live data from indexer…
            </div>
          ) : (
            <ul>
              {rows.map((row, i) => {
                const rank = i + 1;
                const score = computeScore(row);
                return (
                  <li
                    key={row.id}
                    className={`flex items-center justify-between gap-4 px-6 py-4 ${
                      i !== rows.length - 1 ? "border-b border-border/60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`grid size-9 place-items-center rounded-md font-mono text-sm ${
                          rank === 1
                            ? "bg-mac-orange/15 text-mac-orange"
                            : rank === 2
                              ? "bg-zinc-400/15 text-zinc-300"
                              : rank === 3
                                ? "bg-orange-700/15 text-orange-400"
                                : "bg-card text-muted-foreground"
                        }`}
                      >
                        {rank}
                      </span>
                      <div>
                        <p className="font-mono text-sm">
                          {shortAddress(row.address)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stage {row.highestStage}
                          {row.prestigeCount > 0 && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-mac-purple/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-mac-purple">
                              ★ {row.prestigeCount}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-base font-semibold">
                        {score.toLocaleString()}
                      </p>
                      <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="size-3" />
                        {row.totalBuilds} builds · {row.totalClaims} claims
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {isMock
          ? "Mock data — set VITE_INDEXER_URL to wire the live Envio HyperIndex feed."
          : "Live feed via Envio HyperIndex · refreshes every 30s."}
        {isError && (
          <span className="block text-mac-red/80">
            Indexer unreachable: {(error as Error)?.message ?? "unknown error"}
          </span>
        )}
      </p>
    </section>
  );
}
