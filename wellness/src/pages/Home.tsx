import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Footprints, Banknote, Droplets, ChevronLeft, Dumbbell, Cigarette, Apple, Moon, Activity, Check, Sparkles } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { todayISO } from "@/lib/utils";
import { CountUp } from "@/components/common/CountUp";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Img } from "@/components/common/Img";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafetyDisclaimer } from "@/components/safety/SafetyDisclaimer";
import { hero } from "@/lib/images";
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

const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } } };

export default function Home() {
  const app = useApp();
  const { profile } = app;
  const today = todayISO();
  const day = app.getDay(today);
  const h = hero("home");

  const smokeFree = smokeFreeStreak(profile, app.cravings);
  const money = moneySavedSoFar(profile, app.cravings);
  const movedMin = totalMovementMinutes(app.workouts, 7);
  const hydToday = app.hydration.filter((x) => x.date === today).reduce((s, x) => s + x.ml, 0);
  const hydTarget = hydrationTargetMl(profile?.weight_kg ?? 85);
  const doneCount = ACTIONS.filter((a) => (day as any)[a.key]).length;

  const nudges = computeNudges({
    profile, workouts: app.workouts, cravings: app.cravings, sleep: app.sleep,
    hydrationMlToday: hydToday, flares: app.flares,
  });

  return (
    <div className="space-y-7 pb-4">
      {/* ===== Cinematic hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-0" style={{ background: h.gradient }}>
          <div className="absolute inset-0 opacity-40"><Img src={h.img} /></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="relative px-5 pt-10 pb-2">
          <div className="sec-tag mb-2"><Sparkles className="h-3.5 w-3.5 text-cyan" /> {greeting()}</div>
          <h1 className="font-display text-4xl font-black leading-tight">
            {profile?.display_name || "ברוך הבא"}<span className="gradient-text">.</span>
          </h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">בוא נהפוך את היום הזה לעוד צעד קדימה. הנה התמונה שלך עכשיו.</p>
        </motion.div>

        {/* hero stat strip */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="relative grid grid-cols-3 gap-3 px-5 pt-3">
          <Stat v={<CountUp value={smokeFree} />} unit="ימים נקי" icon={<Flame className="h-5 w-5" />} tone="heal" />
          <Stat v={<CountUp value={money} prefix="₪" />} unit="נחסך" icon={<Banknote className="h-5 w-5" />} tone="gold" />
          <Stat v={<CountUp value={movedMin} />} unit="דק' השבוע" icon={<Footprints className="h-5 w-5" />} tone="cyan" />
        </motion.div>
      </section>

      {/* ===== Nudges ===== */}
      {nudges.map((n, i) => (
        <motion.div key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="px-5">
          <Link to={n.cta?.to ?? "#"}>
            <Card className="glass-edge group relative flex items-center gap-3 overflow-hidden">
              <span className="absolute inset-y-0 right-0 w-1.5" style={{ background: toneColor(n.tone) }} />
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${toneColor(n.tone)}22` }}>
                <Sparkles className="h-5 w-5" style={{ color: toneColor(n.tone) }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{n.title}</div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
              </div>
              <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
            </Card>
          </Link>
        </motion.div>
      ))}

      {/* ===== Today's actions ===== */}
      <section className="px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold">הפעולות של היום</h2>
          <Badge tone={doneCount === ACTIONS.length ? "heal" : "muted"}>{doneCount}/{ACTIONS.length}</Badge>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-2.5">
          {ACTIONS.map((a) => {
            const done = (day as any)[a.key] as boolean;
            return (
              <motion.div variants={item} key={a.key}>
                <Card className="flex items-center gap-3 py-3.5 transition-all hover:-translate-y-0.5">
                  <button
                    onClick={() => app.setDayAction(today, a.key as any, !done)}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${done ? "border-heal bg-heal text-white scale-105" : "border-muted hover:border-heal/60"}`}
                    aria-label="סמן כבוצע">
                    {done && <Check className="h-4 w-4" />}
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${a.color}1f` }}>
                    <a.icon className="h-5 w-5" style={{ color: a.color }} />
                  </div>
                  <span className={`flex-1 font-semibold ${done ? "text-muted-foreground line-through" : ""}`}>{a.label}</span>
                  <Link to={a.to} className="text-xs font-bold text-cyan transition-transform hover:-translate-x-0.5">פתח ›</Link>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ===== Hydration ===== */}
      <section className="px-5">
        <Card className="glass-edge flex items-center gap-4">
          <ProgressRing value={hydToday} max={hydTarget} color="hsl(var(--cyan))"
            label={`${(hydToday / 1000).toFixed(1)}ל׳`} sub={`/${(hydTarget / 1000).toFixed(1)}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 font-bold"><Droplets className="h-4 w-4 text-cyan" /> מים היום</div>
            <p className="text-sm text-muted-foreground">יעד גבוה לשמירה על הלב והמפרקים. כל כוס נחשבת.</p>
            <div className="mt-2 flex gap-2">
              {[250, 500].map((ml) => (
                <button key={ml} onClick={() => app.addHydration(ml)}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold transition hover:bg-muted active:scale-95">+{ml} מ״ל</button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <div className="px-5"><SafetyDisclaimer compact /></div>
    </div>
  );
}

function Stat({ v, unit, icon, tone }: { v: React.ReactNode; unit: string; icon: React.ReactNode; tone: string }) {
  const color = { heal: "hsl(var(--heal))", cyan: "hsl(var(--cyan))", gold: "hsl(var(--gold))" }[tone] ?? "hsl(var(--cyan))";
  return (
    <motion.div variants={item}>
      <Card className="glass-edge flex flex-col items-center gap-1 p-3.5 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}1f`, color }}>{icon}</div>
        <div className="font-display text-xl font-black" style={{ color }}>{v}</div>
        <div className="text-[10px] font-medium text-muted-foreground">{unit}</div>
      </Card>
    </motion.div>
  );
}

function toneColor(t: string) {
  return { info: "hsl(var(--cyan))", warn: "hsl(var(--warn))", heal: "hsl(var(--heal))", cyan: "hsl(var(--cyan))", indigo: "hsl(var(--indigo))", gold: "hsl(var(--gold))" }[t] ?? "hsl(var(--cyan))";
}
