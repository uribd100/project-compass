import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Play, Lock, TrendingUp, CheckCircle2 } from "lucide-react";
import { Img } from "@/components/common/Img";
import { hero } from "@/lib/images";
import { useApp } from "@/app/providers/AppData";
import { PageHeader } from "@/app/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SafetyDisclaimer } from "@/components/safety/SafetyDisclaimer";
import { IntensityCapBanner } from "@/components/safety/IntensityCapBanner";
import { ResourceList } from "@/components/common/ResourceList";
import { resourcesFor } from "@/lib/content";
import { PHASES, phaseInfo, BETA_BLOCKER_NOTE } from "@/lib/health/cardiac";
import { SESSIONS, type SessionTemplate } from "@/features/training/program";
import { WorkoutFlow } from "@/features/training/WorkoutFlow";

export default function Training() {
  const { profile, workouts, saveProfile } = useApp();
  const phase = profile?.program_phase ?? 1;
  const info = phaseInfo(phase);
  const [active, setActive] = useState<SessionTemplate | null>(null);

  const phaseSessions = SESSIONS.filter((s) => s.phase === phase);
  // progression criteria: >=4 sessions completed within current phase, no unresolved red flags
  const completedInPhase = workouts.filter((w) => phaseSessions.some((s) => s.id === w.program_item_id)).length;
  const cleanRecord = !workouts.some((w) => w.red_flags.length > 0 && w.felt === "rough");
  const canAdvance = phase < 4 && completedInPhase >= 4 && cleanRecord;

  async function advance() {
    if (!profile) return;
    await saveProfile({ ...profile, program_phase: phase + 1, rpe_cap: phaseInfo(phase + 1).rpeCap });
    toast.success(`התקדמת לשלב ${phase + 1} — ${phaseInfo(phase + 1).name}! 🎉`);
  }

  return (
    <div className="space-y-6">
      <PageHeader tag="01 · אימון בטוח-לב" title="התוכנית שלך" heroKey="training">
        בנויה לפי שיקום לבבי, מתקדמת בקצב שלך.
      </PageHeader>

      {/* phase ladder */}
      <section className="px-5">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">שלב נוכחי</div>
              <div className="font-display text-2xl font-extrabold">שלב {phase} · {info.name}</div>
              <div className="text-sm text-muted-foreground">{info.weeks} — {info.summary}</div>
            </div>
            <Badge tone="cyan">{completedInPhase} אימונים בשלב</Badge>
          </div>
          <div className="flex gap-1.5">
            {PHASES.map((p) => (
              <div key={p.phase} className={`h-2 flex-1 rounded-full ${p.phase < phase ? "bg-heal" : p.phase === phase ? "bg-gradient-to-l from-cyan to-primary" : "bg-secondary"}`} />
            ))}
          </div>

          {canAdvance ? (
            <Button variant="heal" className="w-full" onClick={advance}>
              <TrendingUp className="h-4 w-4" /> אתה מוכן — פתח את שלב {phase + 1}
            </Button>
          ) : phase < 4 ? (
            <div className="flex items-center gap-2 rounded-lg bg-secondary/40 p-2.5 text-xs text-muted-foreground">
              <Lock className="h-4 w-4" /> השלם {Math.max(0, 4 - completedInPhase)} אימונים נוספים בשלב זה (ללא סימני אזהרה) כדי לפתוח את השלב הבא.
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-heal/10 p-2.5 text-xs text-heal">
              <CheckCircle2 className="h-4 w-4" /> הגעת לשלב השימור — כל הכבוד! המשך לתחזק.
            </div>
          )}
        </Card>
      </section>

      <section className="px-5"><IntensityCapBanner phase={phase} /></section>

      {/* today's sessions */}
      <section className="space-y-3 px-5">
        <h2 className="font-display text-xl font-extrabold">אימוני השלב</h2>
        {phaseSessions.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            <Card className="glass-edge flex items-center gap-4 overflow-hidden p-0 transition-all hover:-translate-y-1">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden" style={{ background: hero(s.heroKey).gradient }}>
                <Img src={hero(s.heroKey).img} />
                <div className="absolute inset-0 grid place-items-center bg-black/25 text-2xl">{sessionEmoji(s.type)}</div>
              </div>
              <div className="flex-1 py-3">
                <div className="font-bold">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.goalMinutes} דק' · RPE {s.targetRpe} · {s.exercises.length} תרגילים</div>
              </div>
              <Button size="sm" className="ml-4" onClick={() => setActive(s)}><Play className="h-4 w-4" /> התחל</Button>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="px-5">
        <p className="rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">ℹ️ {BETA_BLOCKER_NOTE}</p>
      </section>

      <section className="px-5"><ResourceList items={resourcesFor("training")} /></section>
      <div className="px-5"><SafetyDisclaimer compact /></div>

      {active && <WorkoutFlow session={active} phase={phase} open={!!active} onOpenChange={(v) => !v && setActive(null)} />}
    </div>
  );
}

function sessionEmoji(type: string) {
  const map: Record<string, string> = { walk: "🚶", strength: "💪", mobility: "🧘", yoga: "🕉️", cardio: "❤️" };
  return map[type] ?? "🏃";
}
