// Base Tycoon — Stage & Step definitions
// 6 stages × 8 steps each = 48 unique resources

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
export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StepDef {
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
  accentClass: string;
  bgGradient: string;
  /** index 0..7 = step 1..8 */
  steps: [
    StepDef,
    StepDef,
    StepDef,
    StepDef,
    StepDef,
    StepDef,
    StepDef,
    StepDef,
  ];
}

export const STAGES: Record<StageId, StageDef> = {
  1: {
    id: 1,
    slug: "lumber",
    name: "Lumber Empire",
    tagline: "Twigs to Throne — every great empire starts in the woods.",
    icon: Trees,
    accentClass: "text-stage-1",
    bgGradient:
      "bg-gradient-to-br from-amber-950/40 via-amber-900/20 to-background",
    steps: [
      { name: "Twig Patch",   emoji: "🌿", description: "Forage broken twigs from the forest floor." },
      { name: "Sawmill",      emoji: "🪚", description: "Saw twigs into rough planks." },
      { name: "Plank Yard",   emoji: "🪵", description: "Stack and cure planks." },
      { name: "Workshop",     emoji: "🔨", description: "Carve planks into joinery." },
      { name: "Joinery",      emoji: "🛠️", description: "Assemble joined chair frames." },
      { name: "Furniture Co", emoji: "🪑", description: "Polish chairs into showroom pieces." },
      { name: "Showroom",     emoji: "🏬", description: "Curate the finest into thrones." },
      { name: "Throne Hall",  emoji: "👑", description: "Coronation pieces, fit for empire." },
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
    steps: [
      { name: "Cocoa Farm",   emoji: "🌳", description: "Harvest sun-dried cocoa pods." },
      { name: "Bean Roaster", emoji: "🫘", description: "Roast raw beans to perfection." },
      { name: "Grinder",      emoji: "⚙️", description: "Grind to espresso-fine powder." },
      { name: "Espresso Bar", emoji: "☕", description: "Pull espresso shots." },
      { name: "Latte Lab",    emoji: "🥛", description: "Steam microfoam, pour latte art." },
      { name: "House Blend",  emoji: "🍵", description: "Sign the house signature." },
      { name: "Specialty",    emoji: "🥃", description: "Single-origin reserves." },
      { name: "Golden Cup",   emoji: "🏆", description: "The platonic ideal of brew." },
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
    steps: [
      { name: "Sugar Mill",      emoji: "🍬", description: "Refine raw sugar crystals." },
      { name: "Boiling Vat",     emoji: "🫧", description: "Cook hard candy syrup." },
      { name: "Lollipop Line",   emoji: "🍭", description: "Spin spirals of joy." },
      { name: "Choco Tempering", emoji: "🍫", description: "Temper bittersweet bars." },
      { name: "Gummy Press",     emoji: "🐻", description: "Press chewy bears." },
      { name: "Gummy Dragons",   emoji: "🐉", description: "Limited-edition mythical beasts." },
      { name: "Cake Atelier",    emoji: "🍰", description: "Tier-stack gourmet cakes." },
      { name: "Diamond Cake",    emoji: "🎂", description: "Edible reward of legend." },
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
    steps: [
      { name: "Quarry",         emoji: "⛏️", description: "Mine raw silicate shards." },
      { name: "Cutting Bench",  emoji: "🔹", description: "Cleave shards into facets." },
      { name: "Amethyst Vault", emoji: "💜", description: "Polish amethysts to violet brilliance." },
      { name: "Sapphire Lab",   emoji: "🔷", description: "Coax sapphire blue from quartz." },
      { name: "Emerald Forge",  emoji: "💚", description: "Catalyze emerald lattice." },
      { name: "Diamond Press",  emoji: "💎", description: "Compress carbon to clarity." },
      { name: "Reliquary",      emoji: "✨", description: "Charge crystals with intent." },
      { name: "Soul Crystal",   emoji: "🔮", description: "Resonates with the player's will." },
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
    steps: [
      { name: "Bolt Forge",      emoji: "🔩", description: "Forge tempered fasteners." },
      { name: "Gear Cutter",     emoji: "⚙️", description: "Mill precision transmissions." },
      { name: "Servo Bench",     emoji: "🦾", description: "Wind precision actuators." },
      { name: "Power Core",      emoji: "🔋", description: "Cell pack assembly line." },
      { name: "Drone Hangar",    emoji: "🛸", description: "Deploy autonomous units." },
      { name: "Mech Frame",      emoji: "🤖", description: "Weld pilot-grade chassis." },
      { name: "Pilot Tower",     emoji: "🛗", description: "Fit cockpits and avionics." },
      { name: "Titan Mech",      emoji: "🦿", description: "World-class walking colossus." },
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
    steps: [
      { name: "Seedbed",       emoji: "🌱", description: "Sprout tender shoots." },
      { name: "Sapling Yard",  emoji: "🌿", description: "Train young trunks." },
      { name: "Pruning Studio",emoji: "✂️", description: "Shape branches with intent." },
      { name: "Bonsai Pavilion",emoji: "🪴", description: "Curate aged miniatures." },
      { name: "Stone Garden",  emoji: "🪨", description: "Compose gravel meditation." },
      { name: "Tea House",     emoji: "🍵", description: "Brew leaves of the master tree." },
      { name: "Ancient Grove", emoji: "🌳", description: "Centuries-old root masters." },
      { name: "World Tree",    emoji: "🌍", description: "Branches hold the sky." },
    ],
  },
};

export const STAGE_LIST = (Object.values(STAGES) as StageDef[]).sort(
  (a, b) => a.id - b.id,
);
