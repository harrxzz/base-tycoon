// Base Tycoon — Stage & Sub-Tier definitions
// 6 stages × 4 sub-tiers each = 24 unique resources

import {
  Trees,
  Coffee,
  Candy,
  Gem,
  Cog,
  Sprout,
  type LucideIcon,
} from "lucide-react";

export type StageId = 1 | 2 | 3 | 4 | 5 | 6;
export type SubTier = 0 | 1 | 2 | 3;

export interface SubTierDef {
  name: string;
  emoji: string;
  description: string;
}

export interface StageDef {
  id: StageId;
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** Tailwind utility colors (oklch via @theme) */
  accentClass: string;
  bgGradient: string;
  subTiers: [SubTierDef, SubTierDef, SubTierDef, SubTierDef];
}

export const STAGES: Record<StageId, StageDef> = {
  1: {
    id: 1,
    slug: "lumber",
    name: "Lumber Workshop",
    tagline: "Whittle twigs into thrones.",
    icon: Trees,
    accentClass: "text-stage-1",
    bgGradient:
      "bg-gradient-to-br from-amber-950/40 via-amber-900/20 to-background",
    subTiers: [
      { name: "Twig", emoji: "🌿", description: "Snapped from the forest floor." },
      { name: "Plank", emoji: "🪵", description: "Sawn, planed, ready to build." },
      { name: "Chair", emoji: "🪑", description: "Hand-joined cottage chair." },
      { name: "Throne", emoji: "👑", description: "A seat fit for an industrialist." },
    ],
  },
  2: {
    id: 2,
    slug: "cocoa",
    name: "Café Empire",
    tagline: "Bean to Golden Cup.",
    icon: Coffee,
    accentClass: "text-stage-2",
    bgGradient:
      "bg-gradient-to-br from-stone-900/60 via-amber-950/30 to-background",
    subTiers: [
      { name: "Bean", emoji: "🫘", description: "Sun-dried cocoa beans." },
      { name: "Espresso", emoji: "☕", description: "Pulled to perfection." },
      { name: "Latte", emoji: "🥛", description: "House signature, microfoam." },
      { name: "Golden Cup", emoji: "🏆", description: "The platonic ideal of brew." },
    ],
  },
  3: {
    id: 3,
    slug: "candy",
    name: "Candy Factory",
    tagline: "Sugar dreams on a conveyor.",
    icon: Candy,
    accentClass: "text-stage-3",
    bgGradient:
      "bg-gradient-to-br from-pink-950/50 via-fuchsia-900/30 to-background",
    subTiers: [
      { name: "Sugar Crystal", emoji: "🍬", description: "Pure crystalline rush." },
      { name: "Lollipop", emoji: "🍭", description: "Spiral of joy." },
      { name: "Gummy Dragon", emoji: "🐉", description: "Chewy mythical beast." },
      { name: "Diamond Cake", emoji: "🎂", description: "Edible reward of legend." },
    ],
  },
  4: {
    id: 4,
    slug: "quartz",
    name: "Crystal Sanctum",
    tagline: "Refract light into wealth.",
    icon: Gem,
    accentClass: "text-stage-4",
    bgGradient:
      "bg-gradient-to-br from-violet-950/50 via-purple-900/30 to-background",
    subTiers: [
      { name: "Quartz Shard", emoji: "🔹", description: "Unrefined silicate." },
      { name: "Amethyst", emoji: "💜", description: "Deep violet facets." },
      { name: "Diamond", emoji: "💎", description: "Hardest known clarity." },
      { name: "Soul Crystal", emoji: "✨", description: "Resonates with intent." },
    ],
  },
  5: {
    id: 5,
    slug: "mech",
    name: "Mech Assembly",
    tagline: "Bolts, gears, world-bending Titans.",
    icon: Cog,
    accentClass: "text-stage-5",
    bgGradient:
      "bg-gradient-to-br from-orange-950/50 via-zinc-900/40 to-background",
    subTiers: [
      { name: "Bolt", emoji: "🔩", description: "Forged steel fastener." },
      { name: "Gear", emoji: "⚙️", description: "Precision-cut transmission." },
      { name: "Drone", emoji: "🛸", description: "Autonomous unit, online." },
      { name: "Titan Mech", emoji: "🤖", description: "Pilot-grade walking colossus." },
    ],
  },
  6: {
    id: 6,
    slug: "bonsai",
    name: "Bonsai Garden",
    tagline: "Patience cultivates eternity.",
    icon: Sprout,
    accentClass: "text-stage-6",
    bgGradient:
      "bg-gradient-to-br from-emerald-950/50 via-green-900/30 to-background",
    subTiers: [
      { name: "Sprout", emoji: "🌱", description: "First green of intent." },
      { name: "Sapling", emoji: "🌿", description: "Young trunk, supple bark." },
      { name: "Ancient Tree", emoji: "🌳", description: "Centuries-tested roots." },
      { name: "World Tree", emoji: "🌍", description: "Branches hold the sky." },
    ],
  },
};

export const STAGE_LIST = (Object.values(STAGES) as StageDef[]).sort(
  (a, b) => a.id - b.id,
);

/** Convert (stage, subTier) → ERC-1155 token id. */
export function tokenId(stage: StageId, sub: SubTier): number {
  return stage * 10 + sub;
}
