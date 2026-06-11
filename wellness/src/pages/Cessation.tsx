import { toast } from "sonner";
import { Flame, Banknote, Cigarette, Plus, Calendar, Layers } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { todayISO } from "@/lib/utils";
import { PageHeader } from "@/app/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/common/CountUp";
import { ProgressRing } from "@/components/common/ProgressRing";
import { ResourceList } from "@/components/common/ResourceList";
import { CravingLogSheet } from "@/features/cessation/CravingLogSheet";
import { resourcesFor } from "@/lib/content";
import { smokeFreeStreak, moneySavedSoFar } from "@/lib/selectors";

export default function Cessation() {
  const app = useApp();
  const { profile } = app;
  const streak = smokeFreeStreak(profile, app.cravings);
  const money = moneySavedSoFar(profile, app.cravings);
  const jointsAvoided = streak * (profile?.joints_per_day ?? 0);

  // craving trigger map by hour buckets
  const buckets = ["בוקר", "צהריים", "ערב", "לילה"];
  const counts = [0, 0, 0, 0];
  app.cravings.forEach((c) => {
    const h = new Date(c.ts).getHours();
    counts[h < 11 ? 0 : h < 17 ? 1 : h < 22 ? 2 : 3]++;
  });
  const maxCount = Math.max(1, ...counts);

  async function startQuit() {
    if (!profile) return;
    await app.saveProfile({ ...profile, quit_date: todayISO(), smoking_status: "reducing" });
    toast.success("יום 1 מתחיל עכשיו. אנחנו איתך. 🚭");
  }

  return (
    <div className="space-y-6">
      <PageHeader tag="02 · גמילה — המטרה מספר 1" title="להשתחרר מהעישון">
        ניקוטין + קנאביס. שלב אחרי שלב, בלי שיפוטיות.
      </PageHeader>

      {/* hero */}
      <section className="px-5">
        <Card className="flex items-center gap-4">
          <ProgressRing value={streak} max={Math.max(7, streak)} color="hsl(var(--heal))" label={`${streak}`} sub="ימים" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2"><Flame className="h-5 w-5 text-heal" /><span className="font-display text-xl font-extrabold text-heal"><CountUp value={streak} /> ימים נקי</span></div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-secondary/40 p-2 text-center">
                <div className="font-display text-lg font-extrabold text-cyan"><CountUp value={money} prefix="₪" /></div>
                <div className="text-[11px] text-muted-foreground">נחסך</div>
              </div>
              <div className="rounded-lg bg-secondary/40 p-2 text-center">
                <div className="font-display text-lg font-extrabold"><CountUp value={jointsAvoided} /></div>
                <div className="text-[11px] text-muted-foreground">ג'וינטים נמנעו</div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* primary action */}
      <section className="px-5">
        <CravingLogSheet>
          <Button size="lg" className="w-full"><Plus className="h-5 w-5" /> חשק לעשן? לחץ כאן עכשיו</Button>
        </CravingLogSheet>
        {!profile?.quit_date && (
          <Button variant="heal" className="mt-2 w-full" onClick={startQuit}><Calendar className="h-4 w-4" /> קבע את יום 1 — היום</Button>
        )}
      </section>

      {/* quit strategy */}
      <section className="px-5">
        <Card className="space-y-3">
          <h2 className="font-display text-xl font-extrabold">האסטרטגיה שלך</h2>
          <Step icon={<Layers className="h-5 w-5 text-cyan" />} title="שלב 1 — הפרד את הטבק מהקנאביס"
            body="הסיכון הלבבי והממכר ביותר הוא הטבק. נסה קודם להפסיק לערבב — קנאביס בלבד (וייפורייזר/אכיל) מנתק את התלות הניקוטינית." />
          <Step icon={<Cigarette className="h-5 w-5 text-heal" />} title="שלב 2 — הפחתה מדורגת"
            body={`מ-${profile?.joints_per_day ?? 7} ליום, נוריד אחד בכל 3–4 ימים. כל ירידה נספרת ונחגגת.`} />
          <Step icon={<Calendar className="h-5 w-5 text-indigo" />} title="שלב 3 — יום גמילה"
            body="כשמגיעים ל-1–2 ליום, קובעים יום נקי ומחזיקים אותו עם הכלים מהאפליקציה." />
        </Card>
      </section>

      {/* trigger map */}
      <section className="px-5">
        <Card>
          <h2 className="mb-3 font-display text-xl font-extrabold">מפת הטריגרים שלך</h2>
          {app.cravings.length === 0 ? (
            <p className="text-sm text-muted-foreground">תעד כמה חשקים וכאן תיבנה מפה שתראה מתי אתה הכי פגיע — כדי שנקדים אותם.</p>
          ) : (
            <div className="space-y-2">
              {buckets.map((b, i) => (
                <div key={b} className="flex items-center gap-3">
                  <span className="w-14 text-sm text-muted-foreground">{b}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-l from-coral to-warn" style={{ width: `${(counts[i] / maxCount) * 100}%` }} />
                  </div>
                  <span className="w-6 text-sm font-semibold">{counts[i]}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <section className="px-5"><ResourceList items={resourcesFor("cessation")} /></section>
    </div>
  );
}

function Step({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div><div className="font-bold">{title}</div><p className="text-sm text-muted-foreground">{body}</p></div>
    </div>
  );
}
