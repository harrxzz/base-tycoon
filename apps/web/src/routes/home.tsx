import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spotlight } from "@/components/motion/spotlight";
import { Sparkles } from "@/components/motion/sparkles";
import { BackgroundBeams } from "@/components/motion/background-beams";
import { STAGE_LIST } from "@/lib/stages";

export default function HomeRoute() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundBeams />
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="oklch(0.55 0.22 258)"
        />
        <Sparkles count={50} />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Zap className="size-3 text-base-blue" />
            Built on Base · Gas sponsored by Paymaster
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
          >
            From <span className="text-base-blue">Base</span> to{" "}
            <span className="bg-gradient-to-r from-stage-3 via-stage-4 to-stage-5 bg-clip-text text-transparent">
              Tycoon
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            Tap. Craft. Combine. Climb six themed industries — lumber, café,
            candy, crystal, mech, bonsai. Every onchain action sponsored. No
            wallet, no signup, no friction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild variant="base" size="xl">
              <Link to="/factory">
                Enter Factory
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/leaderboard">View Leaderboard</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Six stages preview */}
      <section className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Six industries. One empire.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Master each stage to unlock the next. 24 resources, 4 sub-tiers per
            stage.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAGE_LIST.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card
                className={`group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${s.bgGradient}`}
              >
                <CardContent className="relative p-6 pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`grid size-10 place-items-center rounded-lg bg-card/60 ${s.accentClass}`}
                    >
                      <s.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Stage {s.id}
                      </p>
                      <h3 className="font-semibold">{s.name}</h3>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {s.tagline}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.subTiers.map((t) => (
                      <span
                        key={t.name}
                        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-xs"
                      >
                        <span>{t.emoji}</span>
                        <span className="text-muted-foreground">{t.name}</span>
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative mx-auto max-w-6xl px-4 py-20">
        <Card className="relative overflow-hidden border-base-blue/20 bg-gradient-to-br from-base-blue/10 via-card to-card">
          <Sparkles count={20} color="oklch(0.7 0.18 258)" />
          <CardContent className="relative flex flex-col items-center gap-5 p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to climb the leaderboard?
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Connect a Coinbase Smart Wallet — passkey, no seed phrase, no
              gas. Start tapping in under 10 seconds.
            </p>
            <Button asChild variant="base" size="xl">
              <Link to="/factory">
                Start Building
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
