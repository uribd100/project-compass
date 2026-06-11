import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Play, Pause, SkipForward, Timer, Smile, Meh, Frown, Youtube } from "lucide-react";
import type { SessionTemplate } from "./program";
import { videoUrl } from "./program";
import { useApp } from "@/app/providers/AppData";
import { todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { RedFlagChecker } from "@/components/safety/RedFlagChecker";
import { IntensityCapBanner } from "@/components/safety/IntensityCapBanner";
import { BORG_RPE } from "@/lib/health/cardiac";

type Stage = "precheck" | "active" | "log" | "postcheck";

export function WorkoutFlow({ session, phase, open, onOpenChange }: {
  session: SessionTemplate; phase: number; open: boolean; onOpenChange: (v: boolean) => void;
}) {
  const { addWorkout, setDayAction } = useApp();
  const [stage, setStage] = useState<Stage>("precheck");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [rpe, setRpe] = useState(session.targetRpe);
  const [felt, setFelt] = useState<"good" | "ok" | "rough">("good");
  const timer = useRef<number>();

  useEffect(() => {
    if (open) { setStage("precheck"); setElapsed(0); setRunning(false); setRpe(session.targetRpe); setFelt("good"); }
  }, [open, session.targetRpe]);

  useEffect(() => {
    if (running) {
      timer.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
      return () => clearInterval(timer.current);
    }
  }, [running]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  async function save(redFlags: string[]) {
    await addWorkout({
      date: todayISO(), type: session.type, program_item_id: session.id,
      duration_min: Math.max(1, Math.round(elapsed / 60)) || session.goalMinutes,
      rpe, avg_hr: null, pre_check_passed: true, red_flags: redFlags, felt,
    });
    await setDayAction(todayISO(), session.type === "mobility" || session.type === "yoga" ? "mobility" : "movement", true);
    toast.success("האימון תועד! כל הכבוד 💪");
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={session.title}>
        {stage === "precheck" && (
          <div className="space-y-4">
            <IntensityCapBanner phase={phase} />
            <RedFlagChecker phase="pre" onPass={() => setStage("active")} onStop={(f) => save(f)} />
          </div>
        )}

        {stage === "active" && (
          <div className="space-y-4">
            <div className="glass flex flex-col items-center gap-2 p-5">
              <div className="flex items-center gap-2 text-muted-foreground"><Timer className="h-4 w-4" /> זמן אימון</div>
              <div className="font-display text-5xl font-extrabold tabular-nums">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</div>
              <Badge tone="cyan">יעד: {session.goalMinutes} דק' · RPE {session.targetRpe}</Badge>
              <div className="mt-2 flex gap-2">
                <Button onClick={() => setRunning((r) => !r)} variant={running ? "soft" : "default"}>
                  {running ? <><Pause className="h-4 w-4" /> השהה</> : <><Play className="h-4 w-4" /> {elapsed ? "המשך" : "התחל"}</>}
                </Button>
                <Button variant="outline" onClick={() => { setRunning(false); setStage("log"); }}>
                  <SkipForward className="h-4 w-4" /> סיימתי
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-muted-foreground">התרגילים</h4>
              {session.exercises.map((ex, i) => (
                <div key={i} className="glass glass-edge p-3.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span>{ex.name}</span>
                    {(ex.reps || ex.durationSec) && (
                      <span className="rounded-md bg-cyan/10 px-2 py-0.5 text-sm text-cyan">{ex.reps ?? `${ex.durationSec! >= 60 ? Math.round(ex.durationSec! / 60) + " דק'" : ex.durationSec + " שנ'"}`}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{ex.detail}</p>
                  {ex.cue && <p className="mt-1 text-xs font-semibold text-cyan">💨 {ex.cue}</p>}
                  {ex.video && (
                    <a href={videoUrl(ex.video)} target="_blank" rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-coral/15 px-2.5 py-1.5 text-xs font-bold text-coral transition hover:bg-coral/25 active:scale-95">
                      <Youtube className="h-4 w-4" /> צפה בהדגמה
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "log" && (
          <div className="space-y-5">
            <div>
              <h4 className="font-bold">כמה מאמץ הרגשת? (RPE)</h4>
              <p className="text-sm text-muted-foreground">סולם בורג 6–20. הקשב לגוף ואל תחרוג מהתקרה לשלב.</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="font-display text-3xl font-extrabold text-cyan">{rpe}</span>
                <Slider min={6} max={20} step={1} value={[rpe]} onValueChange={(v) => setRpe(v[0])} className="flex-1" />
              </div>
              <p className="text-center text-sm text-muted-foreground">{BORG_RPE.labels[rpe] ?? "מאמץ מתון"}</p>
            </div>

            <div>
              <h4 className="font-bold">איך הרגשת?</h4>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {([["good", Smile, "טוב"], ["ok", Meh, "סביר"], ["rough", Frown, "קשה"]] as const).map(([v, Icon, label]) => (
                  <button key={v} onClick={() => setFelt(v)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-3 ${felt === v ? "border-cyan bg-cyan/15 text-cyan" : "border-border bg-secondary/30"}`}>
                    <Icon className="h-6 w-6" /> <span className="text-xs font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={() => setStage("postcheck")}>המשך לבדיקה אחרונה</Button>
          </div>
        )}

        {stage === "postcheck" && (
          <RedFlagChecker phase="post" onPass={() => save([])} onStop={(f) => save(f)} />
        )}
      </SheetContent>
    </Sheet>
  );
}
