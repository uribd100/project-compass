import type { Profile } from "@/types/domain";

// Neutral defaults only — NO personal/identifying medical data is stored in source
// (the app is deployed publicly). Each user enters their own details in onboarding;
// that data is persisted locally on their device (IndexedDB) and never in the codebase.
export function seedProfile(): Profile {
  const now = new Date().toISOString();
  return {
    display_name: "",
    age: 45,
    sex: "male",
    height_cm: 175,
    weight_kg: 80,
    city: "",
    post_mi: false,
    mi_date: null,
    stents: 0,
    lvef: null,
    cardiologist_clearance: false,
    resting_hr: null,
    bp_systolic: null,
    bp_diastolic: null,
    medications: [],
    conditions: [],
    ldl: null,
    ldl_target: 55,
    rpe_cap: 11,
    avoid_valsalva: true,
    smoking_status: "current",
    joints_per_day: 0,
    mixed_with_tobacco: false,
    cost_per_joint: 15,
    typical_sleep_hours: 7,
    bedtime: "23:30",
    caffeine_cups: 2,
    meals_per_day: 3,
    goals: [],
    equipment: ["bodyweight"],
    program_phase: 1,
    disclaimer_ack: false,
    onboarding_complete: false,
    quit_date: null,
    created_at: now,
    updated_at: now,
  };
}
