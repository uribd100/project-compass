import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Play, Flame, ShieldCheck } from "lucide-react";
import { Img } from "@/components/common/Img";
import { hero } from "@/lib/images";
import { useApp } from "@/app/providers/AppData";
import { todayISO } from "@/lib/utils";
import { PageHeader } from "@/app/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResourceList } from "@/components/common/ResourceList";
import { WorkoutFlow } from "@/features/training/WorkoutFlow";
import { SESSIONS, type SessionTemplate } from "@/features/training/program";
import { resourcesFor } from "@/lib/content";
import { GOUT_FLARE_TRAINING } from "@/lib/health/gout";
import { activeFlare } from "@/lib/selectors";

export default function Mobility() {
  const app = useApp();
  const phase = app.profile?.program_phase ?? 1;
  const [active, setActive] = useState<SessionTemplate | null>(null);
  const flare = activeFlare(app.flares);

  const sessions = SESSIONS.filter((s) => (s.type === "mobility" || s.type === "yoga"));

  async function toggleFlare() {
    if (flare) { await app.endFlare(flare.id); toast.success("מצב התקף הסתיים. בהדרגה חוזרים."); }
    else { await app.addFlare({ start_date: todayISO(), end_date: null, joint: "" }); toast.message("מצב התקף גאוט הופעל — האימונים הותאמו."); }
  }

  return (
    <div className="space-y-6">
      <PageHeader tag="05 · מוביליטי ויוגה" title="גוף גמיש, נשימה רגועה" heroKey="mobility">
        מענה לעייפות השרירים, גמישות והרגעת מערכת העצבים.
      </PageHeader>

      <section className="px-5">
        <Card className={`flex items-center gap-3 ${flare ? "border-warn/40 bg-warn/5" : ""}`}>
          <Flame className={`h-6 w-6 ${flare ? "text-warn" : "text-muted-foreground"}`} />
          <div className="flex-1">
            <div className="font-bold">{flare ? "מצב התקף גאוט פעיל" : "מצב התקף גאוט"}</div>
            <p className="text-xs text-muted-foreground">{flare ? GOUT_FLARE_TRAINING : "הפעל כשיש התקף — נעבור לתרגול עדין שלא מעמיס על המפרק."}</p>
          </div>
          <Button size="sm" variant={flare ? "heal" : "outline"} onClick={toggleFlare}>{flare ? "סיום" : "הפעל"}</Button>
        </Card>
      </section>

      <section className="space-y-3 px-5">
        {sessions.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            <Card className="glass-edge flex items-center gap-4 overflow-hidden p-0 transition-all hover:-translate-y-1">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden" style={{ background: hero("mobility").gradient }}>
                <Img src={hero("mobility").img} />
                <div className="absolute inset-0 grid place-items-center bg-black/25 text-2xl">{s.type === "yoga" ? "🕉️" : "🧘"}</div>
              </div>
              <div className="flex-1 py-3">
                <div className="font-bold">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.goalMinutes} דק' · {s.exercises.length} תרגילים</div>
              </div>
              <Button size="sm" className="ml-4" onClick={() => setActive(s)}><Play className="h-4 w-4" /> התחל</Button>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="px-5">
        <p className="flex items-start gap-2 rounded-lg border border-cyan/25 bg-cyan/5 p-3 text-xs text-foreground/75">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
          ביוגה: הימנע משלבים מוקדמים מתנוחות הופכות או החזקת נשימה ממושכת. עדיפות לנשימה רציפה ולתנוחות עדינות.
        </p>
      </section>

      <section className="px-5"><ResourceList items={resourcesFor("mobility")} /></section>

      {active && <WorkoutFlow session={active} phase={phase} open={!!active} onOpenChange={(v) => !v && setActive(null)} />}
    </div>
  );
}
