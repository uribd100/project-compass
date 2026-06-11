import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, ChevronLeft, Check, Sparkles } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { seedProfile } from "@/lib/seed";
import { todayISO } from "@/lib/utils";
import type { Profile } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SafetyDisclaimer } from "@/components/safety/SafetyDisclaimer";

const GOALS: { id: string; label: string }[] = [
  { id: "quit_smoking", label: "להפסיק לעשן" },
  { id: "energy", label: "יותר אנרגיה" },
  { id: "longevity", label: "אריכות ימים ובריאות לב" },
  { id: "weight", label: "לרדת במשקל" },
  { id: "strength", label: "כוח וכושר" },
  { id: "sleep", label: "שינה טובה יותר" },
];

const CONDITIONS: { id: string; label: string }[] = [
  { id: "gout", label: "גאוט (שיגדון)" },
  { id: "familial_hypercholesterolemia", label: "כולסטרול גבוה / משפחתי" },
  { id: "diabetes", label: "סוכרת" },
  { id: "hypertension", label: "יתר לחץ דם" },
];

export default function Onboarding() {
  const { saveProfile } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(seedProfile());
  const [medText, setMedText] = useState("");
  const set = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));

  const steps = ["ברוך הבא", "עליך", "הסיפור הרפואי", "אורח החיים", "מטרות", "מתחילים"];
  const last = steps.length - 1;

  async function finish() {
    const medications = medText.split("\n").map((s) => s.trim()).filter(Boolean).map((name) => ({ name }));
    await saveProfile({
      ...p,
      medications: medications.length ? medications : p.medications,
      rpe_cap: p.post_mi ? 11 : 13,
      onboarding_complete: true,
      quit_date: p.quit_date ?? (p.joints_per_day > 0 ? todayISO() : null),
    });
    nav("/", { replace: true });
  }

  function toggleCond(id: string) {
    set({ conditions: p.conditions.includes(id) ? p.conditions.filter((x) => x !== id) : [...p.conditions, id] });
  }

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-lg px-5 py-8">
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
          <h1 className="font-display text-3xl font-extrabold">ברוך הבא ל<span className="gradient-text">מצפן בריאות</span></h1>
          <p className="text-muted-foreground">
            מערכת אחת שמרכזת אימון, מוביליטי, תזונה, שינה וגמילה — ומכוונת אותך לפעולה בכל יום, בבטחה.
            נתחיל בכמה שאלות קצרות כדי להתאים הכול אליך אישית. הנתונים נשמרים רק במכשיר שלך.
          </p>
          <SafetyDisclaimer />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-display text-2xl font-extrabold">קצת עליך</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="שם"><Input value={p.display_name} onChange={(e) => set({ display_name: e.target.value })} placeholder="השם שלך" /></Field>
            <Field label="עיר"><Input value={p.city} onChange={(e) => set({ city: e.target.value })} placeholder="למשל אילת" /></Field>
            <Field label="גיל"><Input type="number" value={p.age} onChange={(e) => set({ age: +e.target.value })} /></Field>
            <Field label="גובה (ס״מ)"><Input type="number" value={p.height_cm} onChange={(e) => set({ height_cm: +e.target.value })} /></Field>
            <Field label="משקל (ק״ג)"><Input type="number" value={p.weight_kg} onChange={(e) => set({ weight_kg: +e.target.value })} /></Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-display text-2xl font-extrabold">הסיפור הרפואי שלך</h2>
          <p className="text-sm text-muted-foreground">המידע הזה מאפשר לבנות תוכנית בטוחה. נשמר רק אצלך במכשיר.</p>

          <Toggle label="עברת אירוע לב (התקף/צנתור)?" on={p.post_mi} set={(v) => set({ post_mi: v })} />
          {p.post_mi && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="שנת האירוע"><Input value={p.mi_date ?? ""} onChange={(e) => set({ mi_date: e.target.value })} placeholder="למשל 2020" /></Field>
              <Field label="מספר סטנטים"><Input type="number" value={p.stents} onChange={(e) => set({ stents: +e.target.value })} /></Field>
              <Field label="תפקוד חדר שמאל EF (%)" hint="אם ידוע"><Input type="number" value={p.lvef ?? ""} onChange={(e) => set({ lvef: e.target.value ? +e.target.value : null })} /></Field>
            </div>
          )}

          <Toggle label="יש אישור קרדיולוג לפעילות גופנית?" on={p.cardiologist_clearance} set={(v) => set({ cardiologist_clearance: v })} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="דופק מנוחה" hint="אם ידוע"><Input type="number" value={p.resting_hr ?? ""} onChange={(e) => set({ resting_hr: e.target.value ? +e.target.value : null })} /></Field>
            <Field label="LDL נוכחי" hint="אם ידוע"><Input type="number" value={p.ldl ?? ""} onChange={(e) => set({ ldl: e.target.value ? +e.target.value : null })} /></Field>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold">מצבים רפואיים:</div>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button key={c.id} onClick={() => toggleCond(c.id)}
                  className={`pill border ${p.conditions.includes(c.id) ? "border-cyan bg-cyan/15 text-cyan" : "border-border bg-secondary/30"}`}>{c.label}</button>
              ))}
            </div>
          </div>

          <Field label="תרופות קבועות" hint="תרופה בכל שורה — אופציונלי">
            <textarea value={medText} onChange={(e) => setMedText(e.target.value)} placeholder="אספירין&#10;חוסם בטא&#10;סטטין"
              className="min-h-[80px] w-full rounded-lg border border-input bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-ring" />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-display text-2xl font-extrabold">אורח החיים שלך</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="ג'וינטים/סיגריות ביום" hint="0 אם אינך מעשן"><Input type="number" value={p.joints_per_day} onChange={(e) => set({ joints_per_day: +e.target.value })} /></Field>
            <Field label="עלות ליחידה (₪)" hint="לחישוב חיסכון"><Input type="number" value={p.cost_per_joint} onChange={(e) => set({ cost_per_joint: +e.target.value })} /></Field>
            <Field label="שעות שינה בלילה"><Input type="number" value={p.typical_sleep_hours} onChange={(e) => set({ typical_sleep_hours: +e.target.value })} /></Field>
            <Field label="כוסות קפאין ביום"><Input type="number" value={p.caffeine_cups} onChange={(e) => set({ caffeine_cups: +e.target.value })} /></Field>
            <Field label="ארוחות ביום"><Input type="number" value={p.meals_per_day} onChange={(e) => set({ meals_per_day: +e.target.value })} /></Field>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-display text-2xl font-extrabold">מה הכי חשוב לך עכשיו?</h2>
          <p className="text-sm text-muted-foreground">בחר עד 3.</p>
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

      {step === 5 && (
        <div className="space-y-5 animate-slide-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-heal/20">
            <Sparkles className="h-8 w-8 text-heal" />
          </div>
          <h2 className="font-display text-2xl font-extrabold">הכל מוכן{p.display_name ? `, ${p.display_name}` : ""}.</h2>
          <p className="text-muted-foreground">
            התוכנית מתחילה בשלב 1 (בסיס): הליכות קצרות ומוביליטי בתקרת מאמץ בטוחה. נתקדם בהדרגה לפי ההרגשה שלך.
          </p>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={p.disclaimer_ack} onChange={(e) => set({ disclaimer_ack: e.target.checked })} className="mt-1 h-4 w-4 accent-[hsl(var(--cyan))]" />
            <span>הבנתי שהמערכת היא כלי מלווה ואינה תחליף לייעוץ רפואי, ואפעל בהתאם{p.post_mi ? " ובאישור הקרדיולוג שלי" : ""}.</span>
          </label>
        </div>
      )}

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

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-secondary/30 p-3 text-sm">
      <span className="font-semibold">{label}</span>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="h-5 w-5 accent-[hsl(var(--cyan))]" />
    </label>
  );
}
