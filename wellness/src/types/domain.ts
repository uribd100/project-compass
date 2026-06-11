// ---- Core domain types (local-first; mirrors the Supabase schema) ----

export type Medication = { name: string; dose?: string; schedule?: string; note?: string };

export interface Profile {
  display_name: string;
  age: number;
  sex: "male" | "female" | "other";
  height_cm: number;
  weight_kg: number;
  city: string;
  // cardiac
  post_mi: boolean;
  mi_date: string | null;
  stents: number;
  lvef: number | null; // %
  cardiologist_clearance: boolean;
  resting_hr: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  medications: Medication[];
  conditions: string[]; // ['gout','familial_hypercholesterolemia']
  ldl: number | null;
  ldl_target: number;
  // intensity policy
  rpe_cap: number; // Borg 6-20 ceiling for current phase
  avoid_valsalva: boolean;
  // lifestyle
  smoking_status: "current" | "reducing" | "quit";
  joints_per_day: number; // cannabis joints (mixed w/ tobacco)
  mixed_with_tobacco: boolean;
  cost_per_joint: number; // ILS, for money-saved calc
  typical_sleep_hours: number;
  bedtime: string; // "00:00"
  caffeine_cups: number;
  meals_per_day: number;
  // goals & context
  goals: string[];
  equipment: string[];
  program_phase: number; // 1..4
  // meta
  disclaimer_ack: boolean;
  onboarding_complete: boolean;
  quit_date: string | null; // chosen smoke-free start
  created_at: string;
  updated_at: string;
}

export type WorkoutType = "walk" | "strength" | "cardio" | "mobility" | "yoga";

export interface WorkoutSession {
  id: string;
  date: string;
  type: WorkoutType;
  program_item_id?: string;
  duration_min: number;
  rpe: number | null;
  avg_hr: number | null;
  pre_check_passed: boolean;
  red_flags: string[];
  felt: "good" | "ok" | "rough" | null;
  notes?: string;
  created_at: string;
}

export interface CravingLog {
  id: string;
  ts: string;
  substance: "nicotine" | "cannabis" | "both";
  intensity: number; // 1-10
  trigger: string;
  acted_on: boolean;
  coping?: string;
  note?: string;
  created_at: string;
}

export interface SleepLog {
  id: string;
  date: string;
  bedtime: string;
  wake_time: string;
  duration_min: number;
  quality: number; // 1-5
  wakeups: number;
  caffeine_after_14: boolean;
  screen_before_bed: boolean;
  created_at: string;
}

export interface Meal {
  id: string;
  date: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  description: string;
  quality: number; // 1-5
  gout_safe: boolean;
  created_at: string;
}

export interface HydrationLog {
  id: string;
  date: string;
  ml: number;
  created_at: string;
}

export interface BodyMetric {
  id: string;
  date: string;
  metric: "weight" | "ldl" | "bp_sys" | "bp_dia" | "resting_hr";
  value: number;
  created_at: string;
}

export interface GoutFlare {
  id: string;
  start_date: string;
  end_date: string | null;
  joint: string;
  trigger?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  kind: "doctor" | "lab" | "medication";
  notes?: string;
  done: boolean;
  created_at: string;
}

export interface DayCompletion {
  // per-date checklist completion for the "today's actions"
  date: string;
  movement: boolean;
  mobility: boolean;
  nutrition: boolean;
  sleep: boolean;
  cessation_checkin: boolean;
}

export interface Settings {
  reminders_enabled: boolean;
  cloud_sync: boolean;
}
