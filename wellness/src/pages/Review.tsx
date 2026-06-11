import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Trophy, Target } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { PageHeader } from "@/app/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/common/CountUp";
import { smokeFreeStreak, avgSleepHours, totalMovementMinutes } from "@/lib/selectors";

export default function Review() {
  const app = useApp();
  const { profile } = app;

  const movedMin = totalMovementMinutes(app.workouts, 7);
  const avgSleep = avgSleepHours(app.sleep, 7);
  const smokeFree = smokeFreeStreak(profile, app.cravings);

  const last7days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const adherence = Math.round(
    (app.days.filter((d) => last7days.includes(d.date))
      .reduce((s, d) => s + [d.movement, d.mobility, d.nutrition, d.sleep, d.cessation_checkin].filter(Boolean).length, 0) /
      (7 * 5)) * 100
  );

  const rpeData = app.workouts.slice(-10).map((w, i) => ({ name: `#${i + 1}`, rpe: w.rpe ?? 0 }));

  const win = smokeFree > 0 ? `${smokeFree} ימים נקי מעישון` : movedMin > 0 ? `${movedMin} דקות תנועה השבוע` : "התחלת — וזה הכי קשה";
  const focus = avgSleep > 0 && avgSleep < 6.5 ? "להוסיף 30 דקות שינה בלילה" : adherence < 60 ? "להשלים יותר פעולות יומיות" : "להתקדם בעקביות לשלב הבא";

  return (
    <div className="space-y-6">
      <PageHeader tag="06 · סקירה" title="התמונה השבועית">
        המספרים שלך, במבט אחד.
      </PageHeader>

      <section className="grid grid-cols-2 gap-3 px-5">
        <Metric label="היענות שבועית" value={<CountUp value={adherence} suffix="%" />} tone="cyan" />
        <Metric label="ימים נקי" value={<CountUp value={smokeFree} />} tone="heal" />
        <Metric label="דקות תנועה" value={<CountUp value={movedMin} />} tone="primary" />
        <Metric label="ממוצע שינה" value={<CountUp value={avgSleep} decimals={1} suffix=" ש'" />} tone="indigo" />
      </section>

      {rpeData.length > 1 && (
        <section className="px-5">
          <Card>
            <h3 className="mb-3 font-bold">מגמת מאמץ (RPE) באימונים</h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rpeData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis domain={[6, 20]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="rpe" stroke="hsl(var(--cyan))" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      )}

      <section className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2">
        <Card className="border-heal/30 bg-heal/5">
          <h3 className="mb-1 flex items-center gap-2 font-bold text-heal"><Trophy className="h-4 w-4" /> הניצחון של השבוע</h3>
          <p className="text-sm text-foreground/80">{win}</p>
        </Card>
        <Card className="border-cyan/30 bg-cyan/5">
          <h3 className="mb-1 flex items-center gap-2 font-bold text-cyan"><Target className="h-4 w-4" /> הפוקוס לשבוע הבא</h3>
          <p className="text-sm text-foreground/80">{focus}</p>
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: React.ReactNode; tone: string }) {
  const color = { cyan: "text-cyan", heal: "text-heal", primary: "text-primary", indigo: "text-indigo" }[tone] ?? "";
  return (
    <Card className="text-center">
      <div className={`font-display text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Card>
  );
}
