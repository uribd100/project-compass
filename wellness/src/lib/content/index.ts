import type { LinkResource, Pillar } from "./schema";

// Curated, source-cited resources. Hebrew preferred where an authoritative HE source exists,
// otherwise leading English bodies (AHA, NHS, CDC, ACR, NIDA). This set is the seed;
// it is designed to be expanded by a deep-research pass (see plan).
export const RESOURCES: LinkResource[] = [
  // --- training / cardiac ---
  {
    id: "aha-cardiac-rehab", pillar: "training", type: "article", lang: "en",
    title_he: "מהו שיקום לבבי ולמה הוא מאריך חיים", url: "https://www.heart.org/en/health-topics/cardiac-rehab",
    source: "American Heart Association", source_tier: "authoritative",
    summary_he: "הבסיס לכל תוכנית האימון שלך — למה פעילות מדורגת אחרי התקף לב מצילה חיים.",
    tags: ["post-mi", "foundation"], reviewed_at: "2026-06-11",
  },
  {
    id: "cdc-borg-rpe", pillar: "training", type: "tool", lang: "en",
    title_he: "סולם בורג למדידת מאמץ (RPE)", url: "https://www.cdc.gov/physical-activity-basics/measuring/perceived-exertion-borg-rating-of-perceived-exertion-scale.html",
    source: "CDC", source_tier: "authoritative",
    summary_he: "איך למדוד עצימות לפי תחושה — הכלי הנכון עבורך כי חוסם הבטא מדכא את הדופק.",
    tags: ["rpe", "beta-blocker"], reviewed_at: "2026-06-11",
  },
  {
    id: "nhs-cardiac-rehab", pillar: "training", type: "guideline", lang: "en",
    title_he: "שיקום לבבי — מדריך NHS", url: "https://www.nhs.uk/conditions/cardiac-rehabilitation/",
    source: "NHS", source_tier: "authoritative",
    summary_he: "מה לצפות, אילו תרגילים בטוחים, ומתי לפנות לרופא.",
    tags: ["post-mi"], reviewed_at: "2026-06-11",
  },
  // --- mobility / yoga ---
  {
    id: "yoga-beginners-nhs", pillar: "mobility", type: "article", lang: "en",
    title_he: "מדריך יוגה למתחילים", url: "https://www.nhs.uk/live-well/exercise/guide-to-yoga/",
    source: "NHS", source_tier: "authoritative",
    summary_he: "יוגה עדינה לשיפור גמישות, נשימה והפחתת מתח — בטוחה למתחילים.",
    tags: ["yoga", "beginner"], reviewed_at: "2026-06-11",
  },
  // --- nutrition ---
  {
    id: "aha-mediterranean", pillar: "nutrition", type: "article", lang: "en",
    title_he: "הדיאטה הים-תיכונית לבריאות הלב", url: "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/mediterranean-diet",
    source: "American Heart Association", source_tier: "authoritative",
    summary_he: "התבנית התזונתית המוכחת ביותר להורדת LDL וסיכון לבבי.",
    tags: ["mediterranean", "ldl"], reviewed_at: "2026-06-11",
  },
  {
    id: "arthritis-gout-diet", pillar: "nutrition", type: "article", lang: "en",
    title_he: "תזונה לגאוט — מה לאכול וממה להימנע", url: "https://www.arthritis.org/diseases/gout",
    source: "Arthritis Foundation", source_tier: "authoritative",
    summary_he: "ניהול גאוט דרך תזונה: פיורינים, פרוקטוז, אלכוהול והידרציה.",
    tags: ["gout"], reviewed_at: "2026-06-11",
  },
  {
    id: "moh-nutrition", pillar: "nutrition", type: "guideline", lang: "he",
    title_he: "המלצות תזונה — משרד הבריאות", url: "https://www.gov.il/he/departments/guides/nutrition_recommendations",
    source: "משרד הבריאות", source_tier: "authoritative",
    summary_he: "ההנחיות התזונתיות הרשמיות בישראל, בעברית.",
    tags: ["israel"], reviewed_at: "2026-06-11",
  },
  // --- sleep ---
  {
    id: "cdc-sleep", pillar: "sleep", type: "article", lang: "en",
    title_he: "טיפים להיגיינת שינה", url: "https://www.cdc.gov/sleep/about/index.html",
    source: "CDC", source_tier: "authoritative",
    summary_he: "הרגלים שמשפרים את איכות ומשך השינה — קריטי להחלמה ולגמילה.",
    tags: ["sleep-hygiene"], reviewed_at: "2026-06-11",
  },
  // --- cessation ---
  {
    id: "moh-quit-smoking", pillar: "cessation", type: "guideline", lang: "he",
    title_he: "גמילה מעישון — משרד הבריאות", url: "https://www.gov.il/he/departments/topics/quit_smoking",
    source: "משרד הבריאות", source_tier: "authoritative",
    summary_he: "תוכניות גמילה, קווי סיוע וזכויות בישראל — בעברית.",
    tags: ["nicotine", "israel"], reviewed_at: "2026-06-11",
  },
  {
    id: "nida-cannabis", pillar: "cessation", type: "article", lang: "en",
    title_he: "טיפול בהתמכרות לקנאביס", url: "https://nida.nih.gov/publications/research-reports/marijuana/available-treatments-marijuana-use-disorders",
    source: "NIDA (NIH)", source_tier: "authoritative",
    summary_he: "מה עובד בגמילה מקנאביס — גישות התנהגותיות וניהול גמילה.",
    tags: ["cannabis"], reviewed_at: "2026-06-11",
  },
  {
    id: "nhs-quit", pillar: "cessation", type: "article", lang: "en",
    title_he: "כלים מעשיים להתמודדות עם קרייבינג", url: "https://www.nhs.uk/better-health/quit-smoking/",
    source: "NHS", source_tier: "authoritative",
    summary_he: "טכניקות דחייה, הסחה ונשימה לרגעי החשק.",
    tags: ["craving", "tools"], reviewed_at: "2026-06-11",
  },
];

export function resourcesFor(pillar: Pillar, tags?: string[]): LinkResource[] {
  let r = RESOURCES.filter((x) => x.pillar === pillar);
  if (tags?.length) r = r.filter((x) => x.tags.some((t) => tags.includes(t)));
  return r;
}
