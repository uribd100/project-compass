import type { Profile } from "@/types/domain";

// Pre-filled defaults for Uri, derived from the Sheba cardiology visit summary (26/05/2026)
// and the lifestyle intake. Editable any time from the Profile page / onboarding.
export function seedProfile(): Profile {
  const now = new Date().toISOString();
  return {
    display_name: "אורי",
    age: 45,
    sex: "male",
    height_cm: 178,
    weight_kg: 85,
    city: "אילת",
    post_mi: true,
    mi_date: "2020-10-20",
    stents: 4,
    lvef: 45,
    cardiologist_clearance: true,
    resting_hr: 72,
    bp_systolic: 110,
    bp_diastolic: 76,
    medications: [
      { name: "אספירין (Godamed)", dose: "100mg", schedule: "פעם ביום" },
      { name: "ביסופרולול (Cardiloc)", dose: "1.25mg", schedule: "פעם ביום", note: "חוסם בטא" },
      { name: "רמיפריל (Tritace)", dose: "2.5mg", schedule: "פעם ביום" },
      { name: "אליroקומאב (Praluent)", dose: "150mg", schedule: "זריקה אחת לשבועיים" },
    ],
    conditions: ["gout", "familial_hypercholesterolemia"],
    ldl: 184,
    ldl_target: 55,
    rpe_cap: 11,
    avoid_valsalva: true,
    smoking_status: "current",
    joints_per_day: 7,
    mixed_with_tobacco: true,
    cost_per_joint: 15,
    typical_sleep_hours: 6,
    bedtime: "00:00",
    caffeine_cups: 4,
    meals_per_day: 2,
    goals: ["quit_smoking", "energy", "longevity"],
    equipment: ["bodyweight"],
    program_phase: 1,
    disclaimer_ack: false,
    onboarding_complete: false,
    quit_date: null,
    created_at: now,
    updated_at: now,
  };
}
