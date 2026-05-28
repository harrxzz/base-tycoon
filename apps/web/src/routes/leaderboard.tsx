import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp } from "lucide-react";

const MOCK_LEADERS = [
  { rank: 1, addr: "0x1cf6…5004", score: 14820, stage: 6 },
  { rank: 2, addr: "0x9F72…2FF1", score: 12044, stage: 5 },
  { rank: 3, addr: "0x73B6…1023", score: 9876, stage: 5 },
  { rank: 4, addr: "0xACC6…E9A2", score: 7321, stage: 4 },
  { rank: 5, addr: "0x4BD2…77E9", score: 5012, stage: 3 },
];

export default function LeaderboardRoute() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-base-blue/10 text-base-blue">
          <Trophy />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Leaderboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Top tycoons by total weekly transactions on Base.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul>
            {MOCK_LEADERS.map((l, i) => (
              <li
                key={l.rank}
                className={`flex items-center justify-between gap-4 px-6 py-4 ${
                  i !== MOCK_LEADERS.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`grid size-9 place-items-center rounded-md font-mono text-sm ${
                      l.rank === 1
                        ? "bg-amber-500/15 text-amber-400"
                        : l.rank === 2
                          ? "bg-zinc-400/15 text-zinc-300"
                          : l.rank === 3
                            ? "bg-orange-700/15 text-orange-400"
                            : "bg-card text-muted-foreground"
                    }`}
                  >
                    {l.rank}
                  </span>
                  <div>
                    <p className="font-mono text-sm">{l.addr}</p>
                    <p className="text-xs text-muted-foreground">
                      Currently in Stage {l.stage}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-base font-semibold">
                    {l.score.toLocaleString()}
                  </p>
                  <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="size-3" /> tx
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Mock data shown. Live leaderboard powered by Base Builder Codes.
      </p>
    </section>
  );
}
