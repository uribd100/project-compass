import { HeartPulse, PhoneCall, Pill, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/app/providers/AppData";
import { EMERGENCY_NUMBER, RED_FLAGS } from "@/lib/health/cardiac";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function EmergencyFab() {
  const { profile } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="חירום"
          className="fixed bottom-24 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white shadow-lg shadow-coral/40 active:scale-95"
        >
          <span className="absolute inset-0 rounded-full bg-coral/60 animate-pulse-ring" />
          <HeartPulse className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent title="כרטיס חירום">
        <div className="space-y-4">
          <a href={`tel:${EMERGENCY_NUMBER}`}>
            <Button variant="danger" size="lg" className="w-full">
              <PhoneCall className="h-5 w-5" /> חייג {EMERGENCY_NUMBER} — מד״א
            </Button>
          </a>

          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-coral">
              <X className="h-4 w-4" /> סימני אזהרה — אם יש, התקשר 101
            </div>
            <ul className="grid grid-cols-1 gap-1 text-xs text-foreground/80">
              {RED_FLAGS.map((f) => <li key={f.id}>• {f.he}</li>)}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Pill className="h-4 w-4 text-cyan" /> התרופות שלי
            </div>
            <ul className="space-y-1 text-xs text-foreground/80">
              {(profile?.medications ?? []).map((m, i) => (
                <li key={i}>• {m.name} {m.dose && <span className="text-muted-foreground">— {m.dose}</span>}</li>
              ))}
            </ul>
          </div>

          {profile?.post_mi && (
            <p className="text-xs text-muted-foreground">
              רקע: אירוע לב{profile.mi_date ? ` (${profile.mi_date})` : ""}{profile.stents ? `, ${profile.stents} סטנטים` : ""}{profile.lvef ? `, EF ~${profile.lvef}%` : ""}. ייתכן דופק נמוך עקב חוסם בטא.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
