// Photographic imagery per pillar (hotlinked from Unsplash). Each has a CSS gradient
// fallback so the UI stays premium even offline or if an image fails to load.
const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export interface Hero {
  img: string;
  gradient: string; // fallback / overlay tint
}

export const HEROES: Record<string, Hero> = {
  home: { img: U("1517836357463-d25dfeac3438"), gradient: "linear-gradient(135deg,#0b2a4a,#0a1b3a)" },
  training: { img: U("1571019613454-1cb2f99b2d8b"), gradient: "linear-gradient(135deg,#10243f,#0a1530)" },
  walk: { img: U("1476480862126-209bfaa8edc8"), gradient: "linear-gradient(135deg,#0e2a2e,#0a1b2e)" },
  strength: { img: U("1599058917212-d750089bc07e"), gradient: "linear-gradient(135deg,#1a2440,#0a1228)" },
  mobility: { img: U("1544367567-0f2fcb009e0b"), gradient: "linear-gradient(135deg,#13203f,#0a1530)" },
  nutrition: { img: U("1490645935967-10de6ba17061"), gradient: "linear-gradient(135deg,#1f2a17,#0a1a14)" },
  sleep: { img: U("1541781774459-bb2af2f05b55"), gradient: "linear-gradient(135deg,#1a1840,#0a0f2e)" },
  cessation: { img: U("1506126613408-eca07ce68773"), gradient: "linear-gradient(135deg,#0e2e26,#0a1b2a)" },
  library: { img: U("1481627834876-b7833e8f5570"), gradient: "linear-gradient(135deg,#1a2238,#0a1228)" },
};

export function hero(key: string): Hero {
  return HEROES[key] ?? HEROES.home;
}
