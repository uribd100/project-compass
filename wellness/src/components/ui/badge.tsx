import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  cyan: "bg-cyan/15 text-cyan border-cyan/30",
  indigo: "bg-indigo/15 text-indigo border-indigo/30",
  heal: "bg-heal/15 text-heal border-heal/30",
  warn: "bg-warn/15 text-warn border-warn/30",
  coral: "bg-coral/15 text-coral border-coral/30",
  muted: "bg-secondary text-muted-foreground border-border",
};

export function Badge({ tone = "muted", className, children }: { tone?: keyof typeof tones; className?: string; children: React.ReactNode }) {
  return <span className={cn("pill border", tones[tone], className)}>{children}</span>;
}
