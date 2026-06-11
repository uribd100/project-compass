import type { ReactNode } from "react";
import { Reveal } from "@/components/common/Reveal";

export function PageHeader({ tag, title, children }: { tag?: string; title: string; children?: ReactNode }) {
  return (
    <Reveal>
      <header className="px-5 pt-7">
        {tag && <div className="sec-tag mb-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />{tag}</div>}
        <h1 className="font-display text-2xl font-extrabold md:text-3xl">{title}</h1>
        {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
      </header>
    </Reveal>
  );
}
