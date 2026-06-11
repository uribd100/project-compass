import { useState } from "react";
import { toast } from "sonner";
import { Moon, Plus, Coffee, Smartphone } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { todayISO } from "@/lib/utils";
import { PageHeader } from "@/app/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { CountUp } from "@/components/common/CountUp";
import { ResourceList } from "@/components/common/ResourceList";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { resourcesFor } from "@/lib/content";
import { avgSleepHours } from "@/lib/selectors";

const WINDDOWN = [
  "להפסיק קפאין אחרי 14:00",
  "לכבות מסכים 30 דק' לפני השינה",
  "חדר חשוך וקריר",
  "שעת שינה קבועה (יעד: לפני חצות)",
  "נשימות / מתיחה קלה",
];

export default function Sleep() {
  const app = useApp();
  const avg = avgSleepHours(app.sleep, 7);
  const last7 = [...app.sleep].slice(-7);
  const maxH = Math.max(8, ...last7.map((s) => s.duration_min / 60));

  return (
    <div className="space-y-6">
      <PageHeader tag="04 · שינה" title="שינה שמשקמת">
        הדלק של הלב ושל הגמילה. יעד: 7–8 שעות רצופות.
      </PageHeader>

      <section className="px-5">
        <Card className="flex items-center gap-4">
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-indigo/15">
            <Moon className="h-6 w-6 text-indigo" />
            <span className="font-display text-xl font-extrabold text-indigo"><CountUp value={avg} decimals={1} /></span>
          </div>
          <div className="flex-1">
            <div className="font-bold">ממוצע 7 ימים: {avg.toFixed(1)} שעות</div>
            <p className="text-sm text-muted-foreground">{avg < 6.5 ? "מתחת ליעד — בוא נשפר את העקביות הלילה." : "יפה! שמור על העקביות."}</p>
            <SleepSheet><Button size="sm" className="mt-2"><Plus className="h-4 w-4" /> תיעוד לילה</Button></SleepSheet>
          </div>
        </Card>
      </section>

      {last7.length > 0 && (
        <section className="px-5">
          <Card>
            <h3 className="mb-3 font-bold">השבוע האחרון</h3>
            <div className="flex items-end gap-1.5" style={{ height: 100 }}>
              {last7.map((s) => (
                <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-gradient-to-t from-indigo to-primary" style={{ height: `${(s.duration_min / 60 / maxH) * 80}px` }} />
                  <span className="text-[10px] text-muted-foreground">{(s.duration_min / 60).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      <section className="px-5">
        <Card>
          <h3 className="mb-2 font-bold">שגרת הרגעה (Wind-down)</h3>
          <ul className="space-y-1.5 text-sm text-foreground/80">
            {WINDDOWN.map((w, i) => <li key={i} className="flex items-center gap-2"><span className="text-indigo">•</span>{w}</li>)}
          </ul>
        </Card>
      </section>

      <section className="px-5">
        <Card className="border-indigo/30 bg-indigo/5">
          <h3 className="mb-1 font-bold text-indigo">קנאביס ושינה — חשוב לדעת</h3>
          <p className="text-sm text-foreground/80">
            הקנאביס עוזר להירדם אך מדכא שנת REM (חלומות). כשתיגמל, ייתכן שהשינה תורע זמנית ותחווה חלומות חיים — זה <b>סימן להחלמה</b> ולא נסיגה. זה חולף תוך כשבועיים. החזק מעמד.
          </p>
        </Card>
      </section>

      <section className="px-5"><ResourceList items={resourcesFor("sleep")} /></section>
    </div>
  );
}

function SleepSheet({ children }: { children: React.ReactNode }) {
  const { addSleep, setDayAction } = useApp();
  const [open, setOpen] = useState(false);
  const [bedtime, setBedtime] = useState("00:00");
  const [wake, setWake] = useState("07:00");
  const [quality, setQuality] = useState(3);
  const [wakeups, setWakeups] = useState(1);
  const [caffeine, setCaffeine] = useState(true);
  const [screen, setScreen] = useState(true);

  function durationMin() {
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = wake.split(":").map(Number);
    let d = wh * 60 + wm - (bh * 60 + bm);
    if (d <= 0) d += 24 * 60;
    return d;
  }

  async function save() {
    await addSleep({ date: todayISO(), bedtime, wake_time: wake, duration_min: durationMin(), quality, wakeups, caffeine_after_14: caffeine, screen_before_bed: screen });
    await setDayAction(todayISO(), "sleep", true);
    toast.success("הלילה תועד 🌙");
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent title="תיעוד שינה">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="שעת שינה"><Input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} /></Field>
            <Field label="שעת יקיצה"><Input type="time" value={wake} onChange={(e) => setWake(e.target.value)} /></Field>
          </div>
          <div className="rounded-lg bg-secondary/30 p-2 text-center text-sm">משך: <b>{(durationMin() / 60).toFixed(1)} שעות</b></div>
          <div><h4 className="mb-2 font-bold">איכות: <span className="text-indigo">{quality}/5</span></h4><Slider min={1} max={5} step={1} value={[quality]} onValueChange={(v) => setQuality(v[0])} /></div>
          <div><h4 className="mb-2 font-bold">התעוררויות: <span className="text-indigo">{wakeups}</span></h4><Slider min={0} max={6} step={1} value={[wakeups]} onValueChange={(v) => setWakeups(v[0])} /></div>
          <div className="space-y-2">
            <Toggle on={caffeine} set={setCaffeine} icon={<Coffee className="h-4 w-4" />} label="קפאין אחרי 14:00?" />
            <Toggle on={screen} set={setScreen} icon={<Smartphone className="h-4 w-4" />} label="מסך לפני השינה?" />
          </div>
          <Button className="w-full" size="lg" onClick={save}>שמור</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Toggle({ on, set, icon, label }: { on: boolean; set: (v: boolean) => void; icon: React.ReactNode; label: string }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-secondary/30 p-3 text-sm">
      <span className="flex items-center gap-2">{icon}{label}</span>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="h-5 w-5 accent-[hsl(var(--indigo))]" />
    </label>
  );
}
