import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV } from "./nav";
import { cn } from "@/lib/utils";
import { EmergencyFab } from "@/components/safety/EmergencyFab";

export function AppShell({ children }: { children: ReactNode }) {
  const primary = NAV.filter((n) => n.primary);
  const loc = useLocation();

  return (
    <>
      <div className="aurora-bg" />
      <div className="mx-auto min-h-[100dvh] w-full max-w-6xl md:flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col gap-1 border-l border-border/50 p-4 md:flex">
          <Brand />
          <nav className="mt-5 flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    isActive ? "bg-secondary/70 text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="side-active" className="absolute inset-y-1 right-0 w-1 rounded-full bg-gradient-to-b from-cyan to-primary" />}
                    <n.icon className="h-5 w-5 transition-transform group-hover:scale-110" style={{ color: isActive ? n.color : undefined }} />
                    {n.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto px-3 text-[11px] text-muted-foreground">מצפן בריאות · v0.2</div>
        </aside>

        {/* Main with page transitions */}
        <main className="flex-1 pb-28 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={loc.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <EmergencyFab />

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-card/80 backdrop-blur-2xl md:hidden safe-bottom">
          <div className="mx-auto grid max-w-lg grid-cols-5">
            {primary.map((n) => {
              const active = n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
              return (
                <NavLink key={n.to} to={n.to} end={n.to === "/"} className="relative flex flex-col items-center gap-1 py-2.5">
                  {active && (
                    <motion.span layoutId="tab-active" className="absolute -top-px h-0.5 w-10 rounded-full bg-gradient-to-l from-cyan to-primary"
                      style={{ boxShadow: "0 0 12px hsl(var(--cyan))" }} />
                  )}
                  <motion.div animate={active ? { scale: 1.12, y: -1 } : { scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                    <n.icon className="h-[22px] w-[22px]" style={{ color: active ? n.color : "hsl(var(--muted-foreground))" }} />
                  </motion.div>
                  <span className="text-[10px] font-semibold" style={{ color: active ? n.color : "hsl(var(--muted-foreground))" }}>{n.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2 pt-1">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-primary shadow-lg shadow-primary/30">
        <span className="absolute inset-0 rounded-2xl bg-cyan/40 blur-md -z-10" />
        <svg viewBox="0 0 64 64" className="h-6 w-6">
          <path d="M10 34 h10 l4 -12 l8 22 l5 -16 l4 6 h13" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="font-display text-lg font-extrabold leading-tight">מצפן<span className="gradient-text"> בריאות</span></div>
    </div>
  );
}
