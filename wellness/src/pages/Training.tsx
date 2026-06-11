import { useState } from "react";
import { toast } from "sonner";
import { Play, Lock, TrendingUp, CheckCircle2 } from "lucide-react";
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
      <PageHeader tag="01 · אימון בטוח-לב" title="התוכנית שלך">
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
        {phaseSessions.map((s) => (
          <Card key={s.id} className="glass-hover flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-cyan">
              <SessionIcon type={s.type} />
            </div>
            <div className="flex-1">
              <div className="font-bold">{s.title}</div>
              <div className="text-sm text-muted-foreground">{s.goalMinutes} דק' · יעד RPE {s.targetRpe} · {s.exercises.length} תרגילים</div>
            </div>
            <Button size="sm" onClick={() => setActive(s)}><Play className="h-4 w-4" /> התחל</Button>
          </Card>
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

function SessionIcon({ type }: { type: string }) {
  const map: Record<string, string> = { walk: "🚶", strength: "💪", mobility: "🧘", yoga: "🕉️", cardio: "❤️" };
  return <span className="text-xl">{map[type] ?? "🏃"}</span>;
}
