/**
 * StagePanorama — geometric flat illustration of all 6 industries
 * Editorial GIC-style: limited palette, geometric shapes, no gradients except sky.
 * 6 stages laid out horizontally, each a small "scene" with its industry icon.
 */
export function StagePanorama({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 360"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Sky gradient — barely-there, matches body backdrop */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.18 0.04 252 / 0.45)" />
          <stop offset="100%" stopColor="oklch(0.05 0.003 286 / 0)" />
        </linearGradient>

        {/* Ground hairline */}
        <linearGradient id="horizon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0)" />
          <stop offset="50%" stopColor="oklch(1 0 0 / 0.18)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>
      </defs>

      {/* Sky wash */}
      <rect width="1200" height="360" fill="url(#sky)" />

      {/* Horizon line */}
      <rect x="0" y="280" width="1200" height="1" fill="url(#horizon)" />

      {/* === Stage 1: Lumber (x: 50-200) === */}
      <g transform="translate(50, 100)">
        {/* trees */}
        <polygon points="40,180 60,120 80,180" fill="oklch(0.62 0.13 60 / 0.85)" />
        <polygon points="70,180 90,140 110,180" fill="oklch(0.62 0.13 60 / 0.6)" />
        <polygon points="20,180 35,150 50,180" fill="oklch(0.62 0.13 60 / 0.7)" />
        {/* trunk */}
        <rect x="58" y="170" width="4" height="12" fill="oklch(0.30 0.05 60)" />
        <rect x="88" y="170" width="4" height="12" fill="oklch(0.30 0.05 60)" />
        {/* sawmill roof triangle */}
        <polygon
          points="100,180 130,160 160,180"
          fill="oklch(0.207 0.005 286)"
          stroke="oklch(0.62 0.13 60 / 0.5)"
          strokeWidth="1"
        />
        <rect x="105" y="180" width="50" height="14" fill="oklch(0.207 0.005 286)" stroke="oklch(0.62 0.13 60 / 0.4)" strokeWidth="1" />
        {/* label dot */}
        <circle cx="90" cy="200" r="2" fill="oklch(0.62 0.13 60)" />
      </g>

      {/* === Stage 2: Cocoa/Café (x: 230-380) === */}
      <g transform="translate(230, 100)">
        {/* cocoa tree */}
        <rect x="50" y="140" width="3" height="40" fill="oklch(0.40 0.06 50)" />
        <ellipse cx="51" cy="135" rx="22" ry="20" fill="oklch(0.50 0.08 50 / 0.8)" />
        <ellipse cx="40" cy="140" rx="6" ry="9" fill="oklch(0.50 0.08 50)" />
        <ellipse cx="62" cy="140" rx="6" ry="9" fill="oklch(0.50 0.08 50)" />
        {/* café cup */}
        <rect x="90" y="160" width="36" height="22" rx="2" fill="oklch(0.207 0.005 286)" stroke="oklch(0.50 0.08 50 / 0.6)" strokeWidth="1" />
        <path d="M 126 165 a 6 6 0 0 1 0 12" stroke="oklch(0.50 0.08 50 / 0.6)" strokeWidth="1" fill="none" />
        {/* steam */}
        <path d="M 100 158 q 2 -6 0 -12 q -2 -6 0 -12" stroke="oklch(0.50 0.08 50 / 0.4)" strokeWidth="1" fill="none" />
        <path d="M 110 158 q 2 -6 0 -12" stroke="oklch(0.50 0.08 50 / 0.4)" strokeWidth="1" fill="none" />
        <circle cx="108" cy="200" r="2" fill="oklch(0.50 0.08 50)" />
      </g>

      {/* === Stage 3: Candy (x: 410-560) === */}
      <g transform="translate(410, 100)">
        {/* candy stripe building */}
        <rect x="40" y="130" width="60" height="50" fill="oklch(0.207 0.005 286)" stroke="oklch(0.75 0.16 350 / 0.5)" strokeWidth="1" />
        <rect x="40" y="135" width="60" height="3" fill="oklch(0.75 0.16 350 / 0.7)" />
        <rect x="40" y="145" width="60" height="3" fill="oklch(0.75 0.16 350 / 0.4)" />
        <rect x="40" y="155" width="60" height="3" fill="oklch(0.75 0.16 350 / 0.7)" />
        <rect x="40" y="165" width="60" height="3" fill="oklch(0.75 0.16 350 / 0.4)" />
        {/* lollipop */}
        <circle cx="115" cy="155" r="10" fill="oklch(0.75 0.16 350 / 0.85)" />
        <circle cx="115" cy="155" r="6" fill="none" stroke="oklch(0.207 0.005 286)" strokeWidth="1.5" />
        <rect x="114" y="165" width="2" height="18" fill="oklch(0.75 0.16 350 / 0.6)" />
        <circle cx="80" cy="200" r="2" fill="oklch(0.75 0.16 350)" />
      </g>

      {/* === Stage 4: Quartz/Crystal (x: 590-740) === */}
      <g transform="translate(590, 100)">
        {/* large crystal */}
        <polygon
          points="60,180 75,130 90,180"
          fill="oklch(0.70 0.18 290 / 0.4)"
          stroke="oklch(0.70 0.18 290 / 0.85)"
          strokeWidth="1"
        />
        <polygon
          points="75,130 90,180 78,150"
          fill="oklch(0.70 0.18 290 / 0.6)"
        />
        {/* small crystals */}
        <polygon points="35,180 45,155 55,180" fill="oklch(0.70 0.18 290 / 0.55)" stroke="oklch(0.70 0.18 290 / 0.7)" strokeWidth="1" />
        <polygon points="100,180 110,160 120,180" fill="oklch(0.70 0.18 290 / 0.45)" stroke="oklch(0.70 0.18 290 / 0.7)" strokeWidth="1" />
        <circle cx="78" cy="200" r="2" fill="oklch(0.70 0.18 290)" />
      </g>

      {/* === Stage 5: Mech (x: 770-920) === */}
      <g transform="translate(770, 100)">
        {/* mech head */}
        <rect x="55" y="140" width="40" height="30" rx="2" fill="oklch(0.207 0.005 286)" stroke="oklch(0.68 0.20 40 / 0.7)" strokeWidth="1" />
        {/* eye */}
        <rect x="62" y="150" width="26" height="4" fill="oklch(0.68 0.20 40 / 0.85)" />
        {/* antenna */}
        <line x1="75" y1="140" x2="75" y2="125" stroke="oklch(0.68 0.20 40 / 0.7)" strokeWidth="1" />
        <circle cx="75" cy="123" r="2" fill="oklch(0.68 0.20 40)" />
        {/* body */}
        <rect x="48" y="170" width="54" height="14" fill="oklch(0.207 0.005 286)" stroke="oklch(0.68 0.20 40 / 0.5)" strokeWidth="1" />
        {/* gear */}
        <circle cx="115" cy="172" r="6" fill="none" stroke="oklch(0.68 0.20 40 / 0.6)" strokeWidth="1.5" />
        <circle cx="115" cy="172" r="2" fill="oklch(0.68 0.20 40 / 0.6)" />
        <circle cx="78" cy="200" r="2" fill="oklch(0.68 0.20 40)" />
      </g>

      {/* === Stage 6: Bonsai (x: 950-1150) === */}
      <g transform="translate(950, 100)">
        {/* bonsai pot */}
        <path d="M 50 180 L 55 175 L 105 175 L 110 180 L 105 195 L 55 195 Z" fill="oklch(0.207 0.005 286)" stroke="oklch(0.62 0.13 150 / 0.6)" strokeWidth="1" />
        {/* trunk */}
        <path
          d="M 80 175 Q 75 160 80 145 Q 88 130 78 115"
          stroke="oklch(0.40 0.05 30)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* canopy clusters */}
        <ellipse cx="78" cy="115" rx="14" ry="9" fill="oklch(0.62 0.13 150 / 0.85)" />
        <ellipse cx="62" cy="125" rx="9" ry="6" fill="oklch(0.62 0.13 150 / 0.7)" />
        <ellipse cx="92" cy="130" rx="10" ry="7" fill="oklch(0.62 0.13 150 / 0.75)" />
        {/* zen pebbles */}
        <circle cx="65" cy="190" r="1.5" fill="oklch(0.62 0.13 150 / 0.5)" />
        <circle cx="85" cy="190" r="1.5" fill="oklch(0.62 0.13 150 / 0.5)" />
        <circle cx="80" cy="200" r="2" fill="oklch(0.62 0.13 150)" />
      </g>

      {/* Distant stars / particles for depth */}
      <g opacity="0.5">
        <circle cx="180" cy="50" r="1" fill="oklch(0.985 0 0 / 0.6)" />
        <circle cx="420" cy="40" r="1" fill="oklch(0.985 0 0 / 0.5)" />
        <circle cx="700" cy="60" r="1" fill="oklch(0.985 0 0 / 0.7)" />
        <circle cx="900" cy="35" r="1" fill="oklch(0.985 0 0 / 0.5)" />
        <circle cx="1080" cy="55" r="1" fill="oklch(0.985 0 0 / 0.6)" />
        <circle cx="320" cy="70" r="0.8" fill="oklch(0.985 0 0 / 0.4)" />
        <circle cx="560" cy="30" r="0.8" fill="oklch(0.985 0 0 / 0.4)" />
        <circle cx="820" cy="75" r="0.8" fill="oklch(0.985 0 0 / 0.4)" />
      </g>
    </svg>
  );
}
