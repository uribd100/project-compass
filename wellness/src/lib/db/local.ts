import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  WorkoutSession, CravingLog, SleepLog, Meal, HydrationLog,
  BodyMetric, GoutFlare, Appointment, Profile, DayCompletion, Settings,
} from "@/types/domain";

interface WellnessDB extends DBSchema {
  kv: { key: string; value: any };
  workouts: { key: string; value: WorkoutSession; indexes: { date: string } };
  cravings: { key: string; value: CravingLog };
  sleep: { key: string; value: SleepLog; indexes: { date: string } };
  meals: { key: string; value: Meal; indexes: { date: string } };
  hydration: { key: string; value: HydrationLog; indexes: { date: string } };
  metrics: { key: string; value: BodyMetric };
  flares: { key: string; value: GoutFlare };
  appointments: { key: string; value: Appointment };
  days: { key: string; value: DayCompletion }; // keyed by date
}

export type Collection = "workouts" | "cravings" | "sleep" | "meals" | "hydration" | "metrics" | "flares" | "appointments";

let _db: Promise<IDBPDatabase<WellnessDB>> | null = null;

function db() {
  if (!_db) {
    _db = openDB<WellnessDB>("mitzpan-briut", 1, {
      upgrade(d) {
        d.createObjectStore("kv");
        const w = d.createObjectStore("workouts", { keyPath: "id" });
        w.createIndex("date", "date");
        d.createObjectStore("cravings", { keyPath: "id" });
        const s = d.createObjectStore("sleep", { keyPath: "id" });
        s.createIndex("date", "date");
        const m = d.createObjectStore("meals", { keyPath: "id" });
        m.createIndex("date", "date");
        const h = d.createObjectStore("hydration", { keyPath: "id" });
        h.createIndex("date", "date");
        d.createObjectStore("metrics", { keyPath: "id" });
        d.createObjectStore("flares", { keyPath: "id" });
        d.createObjectStore("appointments", { keyPath: "id" });
        d.createObjectStore("days", { keyPath: "date" });
      },
    });
  }
  return _db;
}

export async function getProfile(): Promise<Profile | null> {
  return (await (await db()).get("kv", "profile")) ?? null;
}
export async function putProfile(p: Profile) {
  await (await db()).put("kv", p, "profile");
}
export async function getSettings(): Promise<Settings> {
  return (await (await db()).get("kv", "settings")) ?? { reminders_enabled: false, cloud_sync: false };
}
export async function putSettings(s: Settings) {
  await (await db()).put("kv", s, "settings");
}

export async function listAll<T = any>(c: Collection): Promise<T[]> {
  return (await (await db()).getAll(c)) as T[];
}
export async function putItem(c: Collection, item: any) {
  await (await db()).put(c, item);
}
export async function deleteItem(c: Collection, id: string) {
  await (await db()).delete(c, id);
}

export async function getDay(date: string): Promise<DayCompletion | null> {
  return (await (await db()).get("days", date)) ?? null;
}
export async function putDay(d: DayCompletion) {
  await (await db()).put("days", d);
}
export async function listDays(): Promise<DayCompletion[]> {
  return await (await db()).getAll("days");
}
