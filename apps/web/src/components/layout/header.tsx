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
    <header className="sticky top-0 z-40 border-b border-white/[0.06] vibrancy">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-[6px] mac-btn-blue text-white">
            <Hammer className="size-3.5" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Base Tycoon</span>
        </Link>

        <nav className="hidden gap-0.5 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-[6px] px-2.5 py-1 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
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
