import { useState } from "react";
import { PageHeader } from "@/app/layout/PageHeader";
import { ResourceList } from "@/components/common/ResourceList";
import { RESOURCES } from "@/lib/content";
import type { Pillar } from "@/lib/content/schema";

const FILTERS: { id: Pillar | "all"; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "training", label: "אימון" },
  { id: "cessation", label: "גמילה" },
  { id: "nutrition", label: "תזונה" },
  { id: "sleep", label: "שינה" },
  { id: "mobility", label: "מוביליטי" },
];

export default function Library() {
  const [filter, setFilter] = useState<Pillar | "all">("all");
  const items = filter === "all" ? RESOURCES : RESOURCES.filter((r) => r.pillar === filter);

  return (
    <div className="space-y-6">
      <PageHeader tag="07 · ספרייה" title="ידע מהמקורות הטובים בעולם">
        מאמרים, מדריכים וכלים — מ-AHA, NHS, CDC, משרד הבריאות ועוד.
      </PageHeader>

      <section className="px-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`pill border whitespace-nowrap ${filter === f.id ? "border-cyan bg-cyan/15 text-cyan" : "border-border bg-secondary/30"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-5"><ResourceList items={items} title={`${items.length} מקורות`} /></section>
    </div>
  );
}
