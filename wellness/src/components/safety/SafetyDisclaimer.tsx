import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function SafetyDisclaimer({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <p className={cn("flex items-center gap-1.5 text-[11px] text-muted-foreground", className)}>
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-warn" />
        מידע חינוכי בלבד — אינו תחליף לייעוץ הקרדיולוג שלך.
      </p>
    );
  }
  return (
    <div className={cn("rounded-lg border border-warn/30 bg-warn/10 p-3 text-sm", className)}>
      <div className="mb-1 flex items-center gap-2 font-bold text-warn">
        <ShieldAlert className="h-4 w-4" /> חשוב לבטיחותך
      </div>
      <p className="text-foreground/80">
        עברת התקף לב, ולכן כל פעילות נבנתה לפי עקרונות שיקום לבבי ובהתאם לאישור הקרדיולוג שלך.
        המערכת מלווה אותך אך אינה מחליפה רופא. הקשב לגוף, התקדם בהדרגה, ועצור מיד אם משהו לא תקין.
      </p>
    </div>
  );
}
