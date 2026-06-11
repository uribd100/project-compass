import { ExternalLink, FileText, Video, BookMarked, Wrench } from "lucide-react";
import type { LinkResource } from "@/lib/content/schema";
import { Badge } from "@/components/ui/badge";

const icon = { article: FileText, video: Video, guideline: BookMarked, tool: Wrench };

export function ResourceList({ items, title = "למד עוד" }: { items: LinkResource[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold text-muted-foreground">{title}</h3>
      <div className="space-y-2">
        {items.map((r) => {
          const Icon = icon[r.type];
          return (
            <a key={r.id} href={r.url} target="_blank" rel="noreferrer"
              className="glass glass-hover flex items-start gap-3 p-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className="truncate">{r.title_he}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{r.summary_he}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge tone={r.lang === "he" ? "heal" : "cyan"}>{r.source}</Badge>
                  <span className="text-[10px] text-muted-foreground">{r.lang === "he" ? "עברית" : "אנגלית"}</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
