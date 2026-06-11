// Gout dietary guardrails (ACR guidance). Surfaced in nutrition pillar + flare mode.

export const GOUT_AVOID = [
  "בשר אדום ואיברים פנימיים (כבד, כליות)",
  "פירות ים וסרדינים/אנשובי",
  "בירה ואלכוהול (במיוחד בירה)",
  "משקאות ומאכלים עתירי פרוקטוז (סודה, מיצים ממותקים)",
];

export const GOUT_FAVOR = [
  "מים בשפע (יעד גבוה — במיוחד בחום)",
  "דובדבנים / מיץ דובדבנים (הוכח כמפחית התקפים)",
  "מוצרי חלב דלי שומן",
  "ירקות, דגנים מלאים וקטניות",
  "קפה (במתינות — מותר ואף מועיל לגאוט)",
  "ויטמין C",
];

// Hydration target (ml) — elevated for gout + Eilat heat.
export function hydrationTargetMl(weightKg: number): number {
  return Math.round(weightKg * 40); // ~40 ml/kg (higher than the usual 30-35 baseline)
}

export const GOUT_FLARE_TRAINING =
  "במצב התקף גאוט: הימנע מעומס על המפרק הכואב. עבור לתרגול נשימה, מתיחות עדינות לפלג גוף עליון, והליכה קצרה רק אם אין כאב. שתה הרבה. אל תתחיל דיאטת ירידה אגרסיבית בזמן התקף.";
