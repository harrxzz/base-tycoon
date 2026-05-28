import { NavLink, Link } from "react-router";
import { ConnectButton } from "@/components/connect-button";
import { cn } from "@/lib/utils";
import { Hammer } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/factory", label: "Factory" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/prestige", label: "Prestige" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-base-blue text-white">
            <Hammer className="size-4" />
          </span>
          <span className="font-semibold tracking-tight">Base Tycoon</span>
        </Link>

        <nav className="hidden gap-1 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <ConnectButton />
      </div>
    </header>
  );
}
