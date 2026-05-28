import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Sparkles,
  Layers,
  Shield,
  Fingerprint,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spotlight } from "@/components/motion/spotlight";
import { Sparkles as SparkleParticles } from "@/components/motion/sparkles";
import { BackgroundBeams } from "@/components/motion/background-beams";
import { STAGE_LIST } from "@/lib/stages";
import { useWalletModal } from "@/lib/wallet-modal-store";
import { useFirstVisitWalletPrompt } from "@/hooks/use-first-visit-wallet-prompt";

const smartWalletBenefits = [
  {
    icon: Zap,
    title: "Zero gas fees",
    desc: "Every onchain action sponsored by our Paymaster. You play, we pay.",
    accent: "text-mac-yellow",
    bg: "bg-mac-yellow/10",
  },
  {
    icon: Layers,
    title: "Batch everything",
    desc: "Claim 8 steps in a single signature. One tap, eight rewards.",
    accent: "text-mac-blue",
    bg: "bg-mac-blue/10",
  },
  {
    icon: Fingerprint,
    title: "Passkey login",
    desc: "Face ID or Touch ID. No 12-word seed phrase to lose.",
    accent: "text-mac-green",
    bg: "bg-mac-green/10",
  },
  {
    icon: Shield,
    title: "ERC-4337 security",
    desc: "Account abstraction with rotation, recovery, and spend limits.",
    accent: "text-mac-purple",
    bg: "bg-mac-purple/10",
  },
];

export default function HomeRoute() {
  const openWalletModal = useWalletModal((s) => s.open);
  useFirstVisitWalletPrompt();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <BackgroundBeams />
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="oklch(0.55 0.22 258)"
        />
        <SparkleParticles count={50} />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Zap className="size-3 text-mac-blue" />
            Built on Base · Gas sponsored by Paymaster
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
          >
            From <span className="text-mac-blue">Base</span> to{" "}
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
            Build idle factories across six themed industries — lumber, café,
            candy, crystal, mech, bonsai. Every onchain action sponsored. No
            seed phrase, no signup, no friction.
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

      {/* Smart Wallet education */}
      <section className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-mac-blue/30 bg-mac-blue/10 px-3 py-1 text-[11px] font-medium text-mac-blue">
            <Sparkles className="size-3" />
            Why Base Account
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Smart wallets, smarter gameplay.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] text-muted-foreground">
            Base Tycoon runs best on Base Account — a smart contract wallet
            that unlocks features regular EOAs can't touch. Here's why it
            matters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {smartWalletBenefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-white/[0.12]">
                <CardContent className="flex gap-4 p-5">
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-[10px] ${b.bg} ${b.accent}`}
                  >
                    <b.icon className="size-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {b.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 grid grid-cols-1 gap-2 rounded-[12px] mac-card p-3 sm:grid-cols-3"
        >
          <div className="flex items-center justify-center gap-2 rounded-[8px] bg-mac-blue/10 px-3 py-2 text-[13px]">
            <Sparkles className="size-3.5 text-mac-blue" />
            <span className="font-medium text-mac-blue">Base Account</span>
            <span className="text-[11px] text-muted-foreground">
              recommended
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 px-3 py-2 text-[13px] text-muted-foreground">
            <span>vs</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-[8px] bg-white/[0.04] px-3 py-2 text-[13px]">
            <Wallet className="size-3.5 text-muted-foreground" />
            <span className="font-medium">MetaMask · Rabby · OKX</span>
            <span className="text-[11px] text-muted-foreground">supported</span>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <Button variant="base" size="lg" onClick={openWalletModal}>
            <Wallet />
            Connect Wallet
          </Button>
        </div>
      </section>

      {/* Six stages preview */}
      <section className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Six industries. One empire.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Master each stage to unlock the next. 48 resources, 8 steps per
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
                    {s.steps.slice(0, 4).map((t) => (
                      <span
                        key={t.name}
                        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-xs"
                      >
                        <span>{t.emoji}</span>
                        <span className="text-muted-foreground">{t.name}</span>
                      </span>
                    ))}
                    <span className="inline-flex items-center rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-xs text-muted-foreground">
                      +4 more
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative mx-auto max-w-6xl px-4 py-20">
        <Card className="relative overflow-hidden border-mac-blue/20 bg-gradient-to-br from-mac-blue/10 via-card to-card">
          <SparkleParticles count={20} color="oklch(0.7 0.18 258)" />
          <CardContent className="relative flex flex-col items-center gap-5 p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to climb the leaderboard?
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Connect Base Account — passkey login, no seed phrase, gas
              sponsored. You're factory-running in under 10 seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="base" size="xl" onClick={openWalletModal}>
                <Wallet />
                Connect Wallet
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/factory">
                  Enter Factory
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
