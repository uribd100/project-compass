// Phased, post-MI, home/calisthenics program tuned for EF ~45%, beta-blocker, RPE-governed.
// Each item is a guided session. Strength items carry the "exhale on effort" cue and avoid Valsalva.

export interface Exercise {
  name: string;
  detail: string;
  durationSec?: number;
  reps?: string;
  cue?: string;
  video?: string; // search query → direct YouTube demonstration
}

export interface SessionTemplate {
  id: string;
  phase: number;
  type: "walk" | "strength" | "mobility" | "yoga";
  title: string;
  goalMinutes: number;
  targetRpe: number;
  heroKey: string;
  exercises: Exercise[];
  contentTags: string[];
}

// Direct link to a YouTube demonstration for an exercise (always resolves).
export function videoUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " exercise demonstration")}`;
}

export const SESSIONS: SessionTemplate[] = [
  // Phase 1
  {
    id: "p1-walk", phase: 1, type: "walk", title: "הליכה קלה", goalMinutes: 12, targetRpe: 10, heroKey: "walk",
    exercises: [
      { name: "חימום בהליכה איטית", detail: "קצב נוח, נשימה דרך האף", durationSec: 120, video: "brisk walking warm up for beginners" },
      { name: "הליכה רציפה", detail: "קצב שמאפשר לדבר בנוחות (RPE 9–11)", durationSec: 480, video: "cardiac rehab walking program beginner" },
      { name: "האטה", detail: "הורד קצב בהדרגה", durationSec: 120, video: "cool down walk stretch" },
    ],
    contentTags: ["post-mi", "rpe"],
  },
  {
    id: "p1-mobility", phase: 1, type: "mobility", title: "מוביליטי בסיסי", goalMinutes: 6, targetRpe: 8, heroKey: "mobility",
    exercises: [
      { name: "סיבובי כתפיים", detail: "10 לכל כיוון", reps: "10×2", video: "shoulder rolls mobility" },
      { name: "מתיחת צוואר עדינה", detail: "החזק 15 שניות לכל צד", durationSec: 60, video: "gentle neck stretch" },
      { name: "סיבוב אגן", detail: "תנועה איטית ומבוקרת", reps: "8×2", video: "hip circles mobility" },
      { name: "מתיחת שוקיים בעמידה", detail: "מול קיר, 20 שניות לרגל", durationSec: 80, video: "standing calf stretch wall" },
    ],
    contentTags: ["beginner"],
  },
  // Phase 2
  {
    id: "p2-walk", phase: 2, type: "walk", title: "הליכה מתמשכת", goalMinutes: 25, targetRpe: 11, heroKey: "walk",
    exercises: [
      { name: "חימום", detail: "הליכה איטית", durationSec: 180, video: "walking warm up" },
      { name: "הליכה רציפה", detail: "קצב מעט יותר נמרץ (RPE 11–12)", durationSec: 1140, video: "moderate pace walking workout" },
      { name: "האטה", detail: "", durationSec: 180, video: "cool down stretch" },
    ],
    contentTags: ["post-mi"],
  },
  {
    id: "p2-strength", phase: 2, type: "strength", title: "כוח קל — משקל גוף", goalMinutes: 15, targetRpe: 12, heroKey: "strength",
    exercises: [
      { name: "קימה מכיסא (Sit-to-stand)", detail: "2 סטים", reps: "10–12", cue: "נשוף בעלייה", video: "sit to stand exercise seniors" },
      { name: "שכיבות סמיכה מול קיר", detail: "2 סטים", reps: "8–10", cue: "נשוף בדחיפה", video: "wall push up" },
      { name: "גשר ישבן (Glute bridge)", detail: "2 סטים", reps: "10", cue: "אל תעצור נשימה", video: "glute bridge" },
      { name: "Bird-dog", detail: "יציבות ליבה, איטי", reps: "8 לכל צד", cue: "נשימה רציפה", video: "bird dog exercise" },
    ],
    contentTags: ["rpe", "beta-blocker"],
  },
  // Phase 3
  {
    id: "p3-intervals", phase: 3, type: "walk", title: "הליכה עם אינטרוולים עדינים", goalMinutes: 30, targetRpe: 13, heroKey: "walk",
    exercises: [
      { name: "חימום", detail: "5 דקות הליכה קלה", durationSec: 300, video: "walking warm up" },
      { name: "אינטרוול", detail: "1 דק' מהיר (RPE 13) / 2 דק' קל — חזור ×5", durationSec: 900, video: "walking interval training beginners" },
      { name: "האטה", detail: "5 דקות", durationSec: 300, video: "cool down walk" },
    ],
    contentTags: ["post-mi"],
  },
  {
    id: "p3-strength", phase: 3, type: "strength", title: "כוח מתקדם", goalMinutes: 20, targetRpe: 13, heroKey: "strength",
    exercises: [
      { name: "סקוואט משקל גוף", detail: "3 סטים", reps: "10–12", cue: "נשוף בעלייה", video: "bodyweight squat form" },
      { name: "שכיבות סמיכה בשיפוע", detail: "3 סטים", reps: "8–10", cue: "נשוף בדחיפה", video: "incline push up" },
      { name: "Step-ups", detail: "מדרגה נמוכה, 3 סטים", reps: "10 לכל רגל", video: "step up exercise" },
      { name: "פלאנק", detail: "החזקה", reps: "20–30 שניות ×3", cue: "נשימה רציפה — בלי לעצור", video: "plank hold proper form" },
    ],
    contentTags: ["rpe"],
  },
  {
    id: "p3-yoga", phase: 3, type: "yoga", title: "יוגה עדינה", goalMinutes: 15, targetRpe: 9, heroKey: "mobility",
    exercises: [
      { name: "נשימת בטן", detail: "5 נשימות עמוקות", durationSec: 90, video: "diaphragmatic breathing" },
      { name: "חתול-פרה", detail: "תנועה עם הנשימה", reps: "8", video: "cat cow stretch" },
      { name: "כלב מביט מטה (מותאם)", detail: "ברכיים מכופפות, בלי להוריד ראש מתחת ללב לאורך זמן", durationSec: 60, video: "modified downward dog beginners" },
      { name: "תנוחת הילד", detail: "מנוחה ונשימה", durationSec: 90, video: "child pose yoga" },
    ],
    contentTags: ["yoga", "beginner"],
  },
];

export function sessionsForPhase(phase: number): SessionTemplate[] {
  return SESSIONS.filter((s) => s.phase <= phase);
}
export function todaySessions(phase: number): SessionTemplate[] {
  const inPhase = SESSIONS.filter((s) => s.phase === phase);
  const walk = inPhase.find((s) => s.type === "walk");
  const other = inPhase.find((s) => s.type !== "walk");
  return [walk, other].filter(Boolean) as SessionTemplate[];
}
