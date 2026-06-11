import { Link } from "react-router-dom";
import { Flame, Footprints, Banknote, Droplets, ChevronLeft, Dumbbell, Cigarette, Apple, Moon, Activity, Check } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { todayISO, shekel } from "@/lib/utils";
import { CountUp } from "@/components/common/CountUp";
import { Reveal } from "@/components/common/Reveal";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafetyDisclaimer } from "@/components/safety/SafetyDisclaimer";
import {
  smokeFreeStreak, moneySavedSoFar, totalMovementMinutes, streakFromDays, computeNudges,
} from "@/lib/selectors";
import { hydrationTargetMl } from "@/lib/health/gout";

const ACTIONS = [
  { key: "movement", label: "תנועה / אימון", icon: Dumbbell, to: "/training", color: "hsl(var(--primary))" },
  { key: "mobility", label: "מוביליטי או יוגה", icon: Activity, to: "/mobility", color: "hsl(var(--cyan))" },
  { key: "nutrition", label: "תזונה ומים", icon: Apple, to: "/nutrition", color: "hsl(var(--warn))" },
  { key: "cessation_checkin", label: "צ'ק-אין גמילה", icon: Cigarette, to: "/cessation", color: "hsl(var(--heal))" },
  { key: "sleep", label: "שגרת שינה", icon: Moon, to: "/sleep", color: "hsl(var(--indigo))" },
] as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "בוקר טוב";
  if (h < 17) return "צהריים טובים";
  if (h < 21) return "ערב טוב";
  return "לילה טוב";
}

export default function Home() {
  const app = useApp();
  const { profile } = app;
  const today = todayISO();
  const day = app.getDay(today);

  const smokeFree = smokeFreeStreak(profile, app.cravings);
  const money = moneySavedSoFar(profile, app.cravings);
  const movedMin = totalMovementMinutes(app.workouts, 7);
  const moveStreak = streakFromDays(app.days, (d) => d.movement);
  const hydToday = app.hydration.filter((h) => h.date === today).reduce((s, h) => s + h.ml, 0);
  const hydTarget = hydrationTargetMl(profile?.weight_kg ?? 85);

  const nudges = computeNudges({
    profile, workouts: app.workouts, cravings: app.cravings, sleep: app.sleep,
    hydrationMlToday: hydToday, flares: app.flares,
  });

  const doneCount = ACTIONS.filter((a) => (day as any)[a.key]).length;

  return (
    <div className="space-y-6">
      <header className="px-5 pt-7">
        <Reveal>
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="font-display text-3xl font-extrabold">{profile?.display_name} 👋</h1>
        </Reveal>
      </header>

      {/* hero stats */}
      <Reveal delay={60}>
        <div className="grid grid-cols-3 gap-3 px-5">
          <Stat icon={<Flame className="h-5 w-5 text-heal" />} value={<CountUp value={smokeFree} />} unit="ימים נקי" tone="heal" />
          <Stat icon={<Banknote className="h-5 w-5 text-cyan" />} value={<CountUp value={money} prefix="₪" />} unit="נחסך" tone="cyan" />
          <Stat icon={<Footprints className="h-5 w-5 text-primary" />} value={<CountUp value={movedMin} />} unit="דק' השבוע" tone="muted" />
        </div>
      </Reveal>

      {/* nudges */}
      {nudges.map((n, i) => (
        <Reveal key={n.id} delay={80 + i * 40}>
          <div className="px-5">
            <Link to={n.cta?.to ?? "#"}>
              <Card className="glass-hover flex items-center gap-3 border-r-4" style={{ borderRightColor: toneColor(n.tone) }}>
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{n.title}</div>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                </div>
                <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Card>
            </Link>
          </div>
        </Reveal>
      ))}

      {/* today's actions */}
      <Reveal delay={120}>
        <section className="px-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold">הפעולות של היום</h2>
            <Badge tone={doneCount === ACTIONS.length ? "heal" : "muted"}>{doneCount}/{ACTIONS.length} הושלמו</Badge>
          </div>
          <div className="space-y-2">
            {ACTIONS.map((a) => {
              const done = (day as any)[a.key] as boolean;
              return (
                <div key={a.key} className="glass flex items-center gap-3 p-3">
                  <button
                    onClick={() => app.setDayAction(today, a.key as any, !done)}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${done ? "border-heal bg-heal text-white" : "border-muted"}`}
                    aria-label="סמן כבוצע"
                  >
                    {done && <Check className="h-4 w-4" />}
                  </button>
                  <a.icon className="h-5 w-5 shrink-0" style={{ color: a.color }} />
                  <span className={`flex-1 font-semibold ${done ? "text-muted-foreground line-through" : ""}`}>{a.label}</span>
                  <Link to={a.to} className="text-xs font-semibold text-cyan">פתח ›</Link>
                </div>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* hydration ring */}
      <Reveal delay={160}>
        <section className="px-5">
          <Card className="flex items-center gap-4">
            <ProgressRing value={hydToday} max={hydTarget} color="hsl(var(--cyan))"
              label={`${(hydToday / 1000).toFixed(1)}ל׳`} sub={`/${(hydTarget / 1000).toFixed(1)}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 font-bold"><Droplets className="h-4 w-4 text-cyan" /> מים היום</div>
              <p className="text-sm text-muted-foreground">יעד גבוה בגלל החום באילת והגאוט. כל כוס מפחיתה סיכון להתקף.</p>
              <div className="mt-2 flex gap-2">
                {[250, 500].map((ml) => (
                  <button key={ml} onClick={() => app.addHydration(ml)}
                    className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-muted">+{ml} מ״ל</button>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </Reveal>

      <div className="px-5"><SafetyDisclaimer compact /></div>
    </div>
  );
}

function Stat({ icon, value, unit, tone }: { icon: React.ReactNode; value: React.ReactNode; unit: string; tone: string }) {
  return (
    <Card className="flex flex-col items-center gap-1 p-3 text-center">
      {icon}
      <div className={`font-display text-xl font-extrabold ${tone === "heal" ? "text-heal" : tone === "cyan" ? "text-cyan" : ""}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground">{unit}</div>
    </Card>
  );
}

function toneColor(t: string) {
  return { info: "hsl(var(--cyan))", warn: "hsl(var(--warn))", heal: "hsl(var(--heal))", cyan: "hsl(var(--cyan))", indigo: "hsl(var(--indigo))" }[t] ?? "hsl(var(--cyan))";
}
