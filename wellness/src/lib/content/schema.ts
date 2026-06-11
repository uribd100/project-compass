export type Pillar = "training" | "mobility" | "nutrition" | "sleep" | "cessation" | "safety";

export interface LinkResource {
  id: string;
  pillar: Pillar;
  title_he: string;
  type: "article" | "video" | "guideline" | "tool";
  url: string;
  lang: "he" | "en";
  source: string;
  source_tier: "authoritative" | "reputable";
  summary_he: string;
  tags: string[];
  reviewed_at: string;
}
