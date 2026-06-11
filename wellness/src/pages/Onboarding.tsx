import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, ChevronLeft, Check, Sparkles } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { seedProfile } from "@/lib/seed";
import { todayISO } from "@/lib/utils";
import type { Profile } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { SafetyDisclaimer } from "@/components/safety/SafetyDisclaimer";
import * as db from "@/lib/db/local";
import { uid } from "@/lib/utils";

const GOALS: { id: string; label: string }[] = [
  { id: "quit_smoking", label: "להפסיק לעשן" },
  { id: "energy", label: "יותר אנרגיה" },
  { id: "longevity", label: "אריכות ימים ובריאות לב" },
  { id: "weight", label: "לרדת במשקל" },
  { id: "strength", label: "כוח וכושר" },
  { id: "sleep", label: "שינה טובה יותר" },
];

export default function Onboarding() {
  const { saveProfile } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(seedProfile());
  const set = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));

  const steps = ["ברוך הבא", "הסיפור הרפואי שלך", "אורח החיים", "המטרות שלך", "מתחילים"];
  const last = steps.length - 1;

  async function finish() {
    // seed appointments + medication reminder from the medical record
    const now = new Date().toISOString();
    await db.putItem("appointments", { id: uid(), title: "מרפאת ליפידים — שיבא", date: "2026-06-16", kind: "doctor", done: false, created_at: now });
    await db.putItem("appointments", { id: uid(), title: "ביקורת קרדיולוג — שיבא", date: "2027-02-01", kind: "doctor", done: false, created_at: now });
    await db.putItem("appointments", { id: uid(), title: "זריקת פרלואנט (אחת לשבועיים)", date: todayISO(), kind: "medication", notes: "Alirocumab 150mg", done: false, created_at: now });
    await saveProfile({ ...p, onboarding_complete: true, quit_date: p.quit_date ?? todayISO() });
    nav("/", { replace: true });
  }

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-lg px-5 py-8">
      {/* progress */}
      <div className="mb-6 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-gradient-to-l from-cyan to-primary" : "bg-secondary"}`} />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5 animate-slide-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan to-primary">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-extrabold">שלום אורי 👋<br />בנינו לך <span className="gradient-text">מצפן בריאות</span></h1>
          <p className="text-muted-foreground">
            מערכת אחת שמרכזת את האימון, המוביליטי, התזונה, השינה והגמילה שלך — ומכוונת אותך לפעולה בכל יום.
            הכל נבנה סביב הלב שלך, בבטחה.
          </p>
          <SafetyDisclaimer />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-display text-2xl font-extrabold">מה שאנחנו יודעים עליך</h2>
          <p className="text-sm text-muted-foreground">מהסיכום הקרדיולוגי (שיבא, 26/05/2026). אפשר לערוך הכל בכל זמן.</p>
          <div className="glass space-y-2 p-4 text-sm">
            <Row k="אוטם שריר הלב" v="אוקטובר 2020 · 4 סטנטים" />
            <Row k="תפקוד חדר שמאל (EF)" v="~45%" />
            <Row k="אישור קרדיולוג לפעילות" v="✓ קיים" />
            <Row k="דופק מנוחה / ל״ד" v="72 · 110/76" />
            <Row k="LDL נוכחי / יעד" v="184 → יעד מתחת ל-55" warn />
            <Row k="גאוט" v="✓ מנוהל בתזונה" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="שם"><Input value={p.display_name} onChange={(e) => set({ display_name: e.target.value })} /></Field>
            <Field label="משקל (ק״ג)"><Input type="number" value={p.weight_kg} onChange={(e) => set({ weight_kg: +e.target.value })} /></Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-display text-2xl font-extrabold">אורח החיים שלך</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ג'וינטים ביום" hint="מעורבב בטבק"><Input type="number" value={p.joints_per_day} onChange={(e) => set({ joints_per_day: +e.target.value })} /></Field>
            <Field label="עלות לג'וינט (₪)" hint="לחישוב חיסכון"><Input type="number" value={p.cost_per_joint} onChange={(e) => set({ cost_per_joint: +e.target.value })} /></Field>
            <Field label="שעות שינה בלילה"><Input type="number" value={p.typical_sleep_hours} onChange={(e) => set({ typical_sleep_hours: +e.target.value })} /></Field>
            <Field label="כוסות קפאין ביום"><Input type="number" value={p.caffeine_cups} onChange={(e) => set({ caffeine_cups: +e.target.value })} /></Field>
            <Field label="ארוחות ביום"><Input type="number" value={p.meals_per_day} onChange={(e) => set({ meals_per_day: +e.target.value })} /></Field>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-display text-2xl font-extrabold">מה הכי חשוב לך עכשיו?</h2>
          <p className="text-sm text-muted-foreground">בחר עד 3. המלצנו לך על <b className="text-heal">גמילה מעישון</b> — ההשפעה הגדולה ביותר על הלב.</p>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => {
              const on = p.goals.includes(g.id);
              return (
                <button key={g.id}
                  onClick={() => set({ goals: on ? p.goals.filter((x) => x !== g.id) : [...p.goals, g.id].slice(0, 3) })}
                  className={`rounded-lg border p-3 text-sm font-semibold transition ${on ? "border-cyan bg-cyan/15 text-cyan" : "border-border bg-secondary/30"}`}>
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5 animate-slide-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-heal/20">
            <Sparkles className="h-8 w-8 text-heal" />
          </div>
          <h2 className="font-display text-2xl font-extrabold">הכל מוכן.</h2>
          <p className="text-muted-foreground">
            התוכנית שלך מתחילה בשלב 1 (בסיס): הליכות קצרות ומוביליטי, בתקרת מאמץ בטוחה. נתקדם בהדרגה לפי ההרגשה שלך.
          </p>
          <div className="glass p-4 text-sm">
            <div className="mb-2 font-bold">היום הראשון שלך כולל:</div>
            <ul className="space-y-1 text-foreground/80">
              <li>• הליכה קלה של 12 דקות 🚶</li>
              <li>• מוביליטי בסיסי 6 דקות 🧘</li>
              <li>• צ'ק-אין גמילה ראשון 🚭</li>
              <li>• 3 ליטר מים (חום + גאוט) 💧</li>
            </ul>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={p.disclaimer_ack} onChange={(e) => set({ disclaimer_ack: e.target.checked })} className="mt-1 h-4 w-4 accent-[hsl(var(--cyan))]" />
            <span>הבנתי שהמערכת היא כלי מלווה ואינה תחליף לייעוץ הקרדיולוג שלי, ואפעל בהתאם.</span>
          </label>
        </div>
      )}

      {/* nav buttons */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}><ChevronLeft className="h-4 w-4" /> חזרה</Button>
        ) : <span />}
        {step < last ? (
          <Button onClick={() => setStep((s) => s + 1)}>המשך</Button>
        ) : (
          <Button variant="heal" disabled={!p.disclaimer_ack} onClick={finish}><Check className="h-4 w-4" /> בוא נתחיל</Button>
        )}
      </div>
    </div>
  );
}

function Row({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={`font-semibold ${warn ? "text-coral" : ""}`}>{v}</span>
    </div>
  );
}
