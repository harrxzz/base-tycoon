import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles as SparklesIcon } from "lucide-react";
import { Sparkles } from "@/components/motion/sparkles";

export default function PrestigeRoute() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Card className="relative overflow-hidden border-mac-blue/30 bg-gradient-to-br from-mac-blue/10 via-card to-card">
        <Sparkles count={40} color="oklch(0.75 0.18 60)" />
        <CardContent className="relative flex flex-col items-center gap-5 p-12 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-mac-orange/15 text-mac-orange">
            <Crown />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Prestige
          </h1>
          <p className="max-w-md text-muted-foreground">
            Reach Stage 6 and complete your first World Tree to unlock the IPO
            ritual. Reset your empire for permanent multipliers + a rare
            commemorative NFT.
          </p>
          <Button variant="base" size="xl" disabled>
            <SparklesIcon />
            Locked — Reach Stage 6 First
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
