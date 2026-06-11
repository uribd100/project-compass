import { useState } from "react";
import { toast } from "sonner";
import { Wind } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const TRIGGERS = ["בוקר", "אחרי אוכל", "שעמום", "לחץ", "חברתי", "ערב", "קפה"];
const COPING = ["נשימות", "הליכה", "מים", "דחייה 10 דק'", "NRT/מסטיק", "התעסקות"];

export function CravingLogSheet({ children }: { children: React.ReactNode }) {
  const { addCraving, setDayAction } = useApp();
  const [open, setOpen] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [coping, setCoping] = useState<string | null>(null);

  async function log(acted_on: boolean) {
    await addCraving({
      ts: new Date().toISOString(), substance: "both", intensity, trigger,
      acted_on, coping: coping ?? undefined,
    });
    await setDayAction(new Date().toISOString().slice(0, 10), "cessation_checkin", true);
    toast[acted_on ? "message" : "success"](
      acted_on ? "תועד. מעידה היא דאטה, לא כישלון — ממשיכים." : "כל הכבוד שהתגברת! 💪 זה נרשם."
    );
    setOpen(false);
    setIntensity(5); setCoping(null);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent title="תיעוד חשק לעשן">
        <div className="space-y-5">
          <div className="rounded-lg border border-cyan/25 bg-cyan/5 p-3 text-sm">
            <div className="flex items-center gap-2 font-bold text-cyan"><Wind className="h-4 w-4" /> קודם — 3 נשימות עמוקות</div>
            <p className="text-foreground/75">שאיפה 4 שניות, החזקה 4, נשיפה 6. החשק הוא גל — הוא יעלה וירד תוך כ-3–5 דקות.</p>
          </div>

          <div>
            <h4 className="mb-2 font-bold">עוצמת החשק: <span className="text-cyan">{intensity}/10</span></h4>
            <Slider min={1} max={10} step={1} value={[intensity]} onValueChange={(v) => setIntensity(v[0])} />
          </div>

          <div>
            <h4 className="mb-2 font-bold">מה הטריגר?</h4>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => (
                <button key={t} onClick={() => setTrigger(t)}
                  className={`pill border ${trigger === t ? "border-cyan bg-cyan/15 text-cyan" : "border-border bg-secondary/30"}`}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-bold">מה תנסה במקום?</h4>
            <div className="flex flex-wrap gap-2">
              {COPING.map((c) => (
                <button key={c} onClick={() => setCoping(c)}
                  className={`pill border ${coping === c ? "border-heal bg-heal/15 text-heal" : "border-border bg-secondary/30"}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="heal" onClick={() => log(false)}>התגברתי 💪</Button>
            <Button variant="outline" onClick={() => log(true)}>עישנתי</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
