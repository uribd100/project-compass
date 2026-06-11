import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Profile, WorkoutSession, DayCompletion, CravingLog, SleepLog, GoutFlare } from "@/types/domain";
import { todayISO } from "./utils";

// Count of consecutive days (ending today or yesterday) that satisfy a predicate over DayCompletion.
export function streakFromDays(days: DayCompletion[], pick: (d: DayCompletion) => boolean): number {
  const set = new Map(days.map((d) => [d.date, d]));
  let streak = 0;
  const start = new Date();
  for (let i = 0; i < 400; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() - i);
    const iso = date.toISOString().slice(0, 10);
    const d = set.get(iso);
    if (d && pick(d)) streak++;
    else if (i === 0) continue; // today not done yet is OK — don't break the streak
    else break;
  }
  return streak;
}

// Smoke-free streak: days since quit_date with no "acted_on" cannabis/nicotine craving logged.
export function smokeFreeStreak(profile: Profile | null, cravings: CravingLog[]): number {
  if (!profile?.quit_date) return 0;
  const quit = parseISO(profile.quit_date);
  const today = parseISO(todayISO());
  const totalDays = Math.max(0, differenceInCalendarDays(today, quit) + 1);
  // find the most recent relapse (acted_on) at or after quit date
  let lastRelapse: Date | null = null;
  for (const c of cravings) {
    if (!c.acted_on) continue;
    const d = parseISO(c.ts.slice(0, 10));
    if (d >= quit && (!lastRelapse || d > lastRelapse)) lastRelapse = d;
  }
  if (lastRelapse) return Math.max(0, differenceInCalendarDays(today, lastRelapse));
  return totalDays;
}

export function moneySavedSoFar(profile: Profile | null, cravings: CravingLog[]): number {
  if (!profile?.quit_date) return 0;
  const days = smokeFreeStreak(profile, cravings);
  return days * profile.joints_per_day * profile.cost_per_joint;
}

export function totalMovementMinutes(workouts: WorkoutSession[], sinceDays = 7): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - sinceDays);
  return workouts
    .filter((w) => parseISO(w.date) >= cutoff)
    .reduce((sum, w) => sum + (w.duration_min || 0), 0);
}

export function avgSleepHours(sleep: SleepLog[], sinceDays = 7): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - sinceDays);
  const recent = sleep.filter((s) => parseISO(s.date) >= cutoff);
  if (!recent.length) return 0;
  return recent.reduce((sum, s) => sum + s.duration_min, 0) / recent.length / 60;
}

export function activeFlare(flares: GoutFlare[]): GoutFlare | null {
  return flares.find((f) => !f.end_date) ?? null;
}

// ---- Smart nudge rules engine ----
export interface Nudge {
  id: string;
  tone: "info" | "warn" | "heal" | "cyan";
  title: string;
  body: string;
  cta?: { label: string; to: string };
}

export function computeNudges(args: {
  profile: Profile | null;
  workouts: WorkoutSession[];
  cravings: CravingLog[];
  sleep: SleepLog[];
  hydrationMlToday: number;
  flares: GoutFlare[];
}): Nudge[] {
  const { profile, workouts, sleep, flares } = args;
  const out: Nudge[] = [];
  const today = todayISO();
  const hour = new Date().getHours();

  const flare = activeFlare(flares);
  if (flare) {
    out.push({
      id: "flare",
      tone: "warn",
      title: "מצב התקף גאוט פעיל",
      body: "התאמתי את האימונים שלך למצב עדין יותר. שתה הרבה מים והימנע מעומס על המפרק הכואב.",
      cta: { label: "מה לעשות עכשיו", to: "/mobility" },
    });
  }

  const movedToday = workouts.some((w) => w.date === today);
  if (!movedToday && hour >= 16) {
    out.push({
      id: "no-move",
      tone: "cyan",
      title: "עוד לא זזת היום",
      body: "אפילו 10 דקות הליכה קלה משנות את היום. בוא נתחיל עכשיו, לפני שמתחשק לעשן.",
      cta: { label: "התחל אימון", to: "/training" },
    });
  }

  if (profile && args.hydrationMlToday < profile.weight_kg * 25 && hour >= 12) {
    out.push({
      id: "hydrate",
      tone: "info",
      title: "שתית מעט מים היום",
      body: "באילט ועם הגאוט — הידרציה קריטית. כוס מים עכשיו מפחיתה סיכון להתקף.",
      cta: { label: "תיעוד מים", to: "/nutrition" },
    });
  }

  const last3 = sleep.slice(-3);
  if (last3.length === 3 && last3.every((s) => s.duration_min < 360)) {
    out.push({
      id: "sleep",
      tone: "indigo" as any,
      title: "שלושה לילות של פחות מ-6 שעות",
      body: "שינה היא הדלק של הגמילה והלב. בוא נקדים הלילה את שגרת ההרגעה.",
      cta: { label: "שגרת לילה", to: "/sleep" },
    });
  }

  if (hour >= 6 && hour <= 10) {
    out.push({
      id: "morning-craving",
      tone: "heal",
      title: "הבוקר הוא הטריגר הכי חזק",
      body: "במקום הג'וינט של הבוקר — 3 דקות נשימה ותרגיל קצר. נשבור את ההרגל בשורש.",
      cta: { label: "צ'ק-אין גמילה", to: "/cessation" },
    });
  }

  return out.slice(0, 2);
}
