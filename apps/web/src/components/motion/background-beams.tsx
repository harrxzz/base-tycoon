// Aceternity-style: Background Beams. Animated gradient conic beams.

import { cn } from "@/lib/utils";

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute -top-1/4 left-1/2 size-[120%] -translate-x-1/2 animate-beam-rotate bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,oklch(0.55_0.22_258/0.15)_60deg,transparent_120deg,oklch(0.70_0.20_290/0.10)_240deg,transparent_300deg)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_75%)]" />
    </div>
  );
}
