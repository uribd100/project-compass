import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Img } from "@/components/common/Img";
import { hero } from "@/lib/images";

export function PageHeader({
  tag, title, children, heroKey,
}: { tag?: string; title: string; children?: ReactNode; heroKey?: string }) {
  const h = heroKey ? hero(heroKey) : null;

  return (
    <header className="relative">
      {h && (
        <div className="absolute inset-x-0 top-0 -z-0 h-56 overflow-hidden" style={{ background: h.gradient }}>
          <div className="absolute inset-0 opacity-50"><Img src={h.img} /></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        className={`relative px-5 ${h ? "pt-24" : "pt-8"}`}
      >
        {tag && (
          <div className="sec-tag mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" style={{ boxShadow: "0 0 12px hsl(var(--cyan))" }} />
            {tag}
          </div>
        )}
        <h1 className="font-display text-3xl font-extrabold md:text-4xl">{title}</h1>
        {children && <div className="mt-1.5 max-w-md text-sm text-muted-foreground">{children}</div>}
      </motion.div>
    </header>
  );
}
