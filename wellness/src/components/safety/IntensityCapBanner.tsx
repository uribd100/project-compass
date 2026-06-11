import { Gauge, Wind } from "lucide-react";
import { BORG_RPE, VALSALVA_CUE, phaseInfo } from "@/lib/health/cardiac";

export function IntensityCapBanner({ phase }: { phase: number }) {
  const info = phaseInfo(phase);
  return (
    <div className="rounded-lg border border-cyan/25 bg-cyan/5 p-3 text-sm">
      <div className="flex items-center gap-2 font-bold text-cyan">
        <Gauge className="h-4 w-4" /> תקרת מאמץ נוכחית: RPE {info.rpeCap} ({BORG_RPE.labels[info.rpeCap] ?? "מתון"})
      </div>
      <p className="mt-1 flex items-start gap-1.5 text-foreground/75">
        <Wind className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" /> {VALSALVA_CUE}
      </p>
    </div>
  );
}
