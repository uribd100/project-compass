import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { NAV } from "./nav";
import { cn } from "@/lib/utils";
import { EmergencyFab } from "@/components/safety/EmergencyFab";

export function AppShell({ children }: { children: ReactNode }) {
  const primary = NAV.filter((n) => n.primary);
  const loc = useLocation();

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-6xl md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col gap-1 border-l border-border/60 p-4 md:flex">
        <Brand />
        <nav className="mt-4 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
                )
              }
            >
              <n.icon className="h-5 w-5" style={{ color: n.color }} />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 pb-28 md:pb-8">{children}</main>

      <EmergencyFab />

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/90 backdrop-blur-xl md:hidden safe-bottom">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {primary.map((n) => {
            const active = n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
            return (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold">
                <n.icon className="h-5 w-5" style={{ color: active ? n.color : "hsl(var(--muted-foreground))" }} />
                <span style={{ color: active ? n.color : "hsl(var(--muted-foreground))" }}>{n.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-primary">
        <svg viewBox="0 0 64 64" className="h-6 w-6">
          <path d="M10 34 h10 l4 -12 l8 22 l5 -16 l4 6 h13" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="font-display text-lg font-extrabold leading-tight">מצפן<span className="gradient-text"> בריאות</span></div>
    </div>
  );
}
