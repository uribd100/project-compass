// Evidence-anchored cardiac safety constants for a post-MI user with reduced EF,
// on a beta-blocker (bisoprolol). Intensity is governed by RPE (Borg 6-20),
// NOT heart rate — beta-blockers blunt HR response, making HR-zone targets unreliable.
// Sources are curated in lib/content/training.ts (AHA / ESC cardiac-rehab guidance).

export const BORG_RPE = {
  min: 6,
  max: 20,
  // ratings worth surfacing in the UI
  labels: {
    7: "מנוחה מוחלטת",
    9: "קל מאוד",
    11: "קל",
    13: "מעט מאמץ",
    15: "מאמץ (גבול עליון מותר)",
    17: "קשה — לעצור",
  } as Record<number, string>,
};

// Red-flag symptoms — if any is present, STOP and surface the emergency card.
export const RED_FLAGS: { id: string; he: string }[] = [
  { id: "chest_pain", he: "כאב, לחץ או מועקה בחזה" },
  { id: "radiating", he: "כאב המקרין לזרוע, ללסת או לגב" },
  { id: "dyspnea", he: "קוצר נשימה חריג / לא פרופורציונלי למאמץ" },
  { id: "dizzy", he: "סחרחורת, עילפון או טשטוש" },
  { id: "palpitations", he: "דפיקות לב חזקות / לא סדירות" },
  { id: "cold_sweat", he: "זיעה קרה" },
  { id: "nausea", he: "בחילה" },
];

// Phase definitions for the progression engine (RPE caps tuned conservatively for EF ~45%).
export const PHASES = [
  { phase: 1, name: "בסיס", weeks: "שבועות 1–2", rpeCap: 11, summary: "הליכה קלה יומית + מוביליטי. בלי התנגדות." },
  { phase: 2, name: "בנייה", weeks: "שבועות 3–5", rpeCap: 12, summary: "הארכת הליכה + קליסטניקס קל פעמיים בשבוע." },
  { phase: 3, name: "חיזוק", weeks: "שבועות 6–9", rpeCap: 13, summary: "אינטרוולים עדינים + כוח מתקדם + יוגה." },
  { phase: 4, name: "שימור", weeks: "שבוע 10+", rpeCap: 14, summary: "150+ דק' שבועי + 2× כוח + גמישות." },
];

export function phaseInfo(phase: number) {
  return PHASES.find((p) => p.phase === phase) ?? PHASES[0];
}

// "Exhale on exertion, never hold your breath" — the single most important strength cue post-MI.
export const VALSALVA_CUE = "נשוף בזמן המאמץ, לעולם אל תעצור את הנשימה (מנע מנוֹבר ולסלבה).";

// Israeli emergency number (Magen David Adom).
export const EMERGENCY_NUMBER = "101";

// Beta-blocker note shown next to any HR readout.
export const BETA_BLOCKER_NOTE =
  "אם אתה נוטל חוסם בטא — הדופק שלך מדוכא בכוונה. לכן עוצמת המאמץ נמדדת לפי תחושת המאמץ (RPE), לא לפי הדופק.";
