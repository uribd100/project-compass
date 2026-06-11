import { useState } from "react";
import { AlertTriangle, CheckCircle2, PhoneCall } from "lucide-react";
import { RED_FLAGS, EMERGENCY_NUMBER } from "@/lib/health/cardiac";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Gate shown before/after a workout. Calls onPass([]) when clear, or onStop(flags) when symptoms present.
export function RedFlagChecker({
  phase,
  onPass,
  onStop,
}: {
  phase: "pre" | "post";
  onPass: (flags: string[]) => void;
  onStop: (flags: string[]) => void;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const flags = Object.keys(checked).filter((k) => checked[k]);
  const hasFlag = flags.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold">
          {phase === "pre" ? "בדיקת בטיחות לפני האימון" : "איך אתה מרגיש אחרי האימון?"}
        </h3>
        <p className="text-sm text-muted-foreground">סמן אם אתה חווה כעת אחד מהבאים:</p>
      </div>

      <div className="space-y-2">
        {RED_FLAGS.map((f) => (
          <button
            key={f.id}
            onClick={() => setChecked((c) => ({ ...c, [f.id]: !c[f.id] }))}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-right text-sm transition",
              checked[f.id] ? "border-coral bg-coral/15 text-coral" : "border-border bg-secondary/30 hover:border-coral/40"
            )}
          >
            <span className={cn("flex h-5 w-5 items-center justify-center rounded border", checked[f.id] ? "border-coral bg-coral text-white" : "border-muted")}>
              {checked[f.id] && <AlertTriangle className="h-3 w-3" />}
            </span>
            {f.he}
          </button>
        ))}
      </div>

      {hasFlag ? (
        <div className="space-y-3 rounded-lg border border-coral/40 bg-coral/10 p-4">
          <p className="font-bold text-coral">עצור. אל תתאמן עכשיו.</p>
          <p className="text-sm text-foreground/80">
            הסימן שסימנת מחייב תשומת לב. אם הוא חמור או לא חולף — התקשר מיד למד"א.
          </p>
          <div className="flex gap-2">
            <a href={`tel:${EMERGENCY_NUMBER}`} className="flex-1">
              <Button variant="danger" className="w-full">
                <PhoneCall className="h-4 w-4" /> חייג {EMERGENCY_NUMBER}
              </Button>
            </a>
            <Button variant="outline" onClick={() => onStop(flags)}>תיעוד ועצירה</Button>
          </div>
        </div>
      ) : (
        <Button className="w-full" size="lg" onClick={() => onPass([])}>
          <CheckCircle2 className="h-5 w-5" /> {phase === "pre" ? "הכל תקין — בוא נתחיל" : "סיימתי, אני מרגיש טוב"}
        </Button>
      )}
    </div>
  );
}
