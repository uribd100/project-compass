import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type {
  Profile, WorkoutSession, CravingLog, SleepLog, Meal, HydrationLog,
  BodyMetric, GoutFlare, Appointment, DayCompletion, Settings,
} from "@/types/domain";
import * as db from "@/lib/db/local";
import { uid, todayISO } from "@/lib/utils";

type ActionKey = keyof Omit<DayCompletion, "date">;

interface AppDataValue {
  ready: boolean;
  profile: Profile | null;
  settings: Settings;
  workouts: WorkoutSession[];
  cravings: CravingLog[];
  sleep: SleepLog[];
  meals: Meal[];
  hydration: HydrationLog[];
  metrics: BodyMetric[];
  flares: GoutFlare[];
  appointments: Appointment[];
  days: DayCompletion[];
  saveProfile: (p: Profile) => Promise<void>;
  saveSettings: (s: Settings) => Promise<void>;
  addWorkout: (w: Omit<WorkoutSession, "id" | "created_at">) => Promise<void>;
  addCraving: (c: Omit<CravingLog, "id" | "created_at">) => Promise<void>;
  addSleep: (s: Omit<SleepLog, "id" | "created_at">) => Promise<void>;
  addMeal: (m: Omit<Meal, "id" | "created_at">) => Promise<void>;
  addHydration: (ml: number, date?: string) => Promise<void>;
  addMetric: (m: Omit<BodyMetric, "id" | "created_at">) => Promise<void>;
  addFlare: (f: Omit<GoutFlare, "id" | "created_at">) => Promise<void>;
  endFlare: (id: string) => Promise<void>;
  toggleAppointment: (id: string) => Promise<void>;
  setDayAction: (date: string, key: ActionKey, val: boolean) => Promise<void>;
  getDay: (date: string) => DayCompletion;
}

const Ctx = createContext<AppDataValue | null>(null);
export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppDataProvider");
  return v;
};

const EMPTY_DAY = (date: string): DayCompletion => ({
  date, movement: false, mobility: false, nutrition: false, sleep: false, cessation_checkin: false,
});

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings>({ reminders_enabled: false, cloud_sync: false });
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [cravings, setCravings] = useState<CravingLog[]>([]);
  const [sleep, setSleep] = useState<SleepLog[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [hydration, setHydration] = useState<HydrationLog[]>([]);
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [flares, setFlares] = useState<GoutFlare[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [days, setDays] = useState<DayCompletion[]>([]);

  useEffect(() => {
    (async () => {
      const [p, s, w, c, sl, m, h, mt, fl, ap, dy] = await Promise.all([
        db.getProfile(), db.getSettings(),
        db.listAll<WorkoutSession>("workouts"), db.listAll<CravingLog>("cravings"),
        db.listAll<SleepLog>("sleep"), db.listAll<Meal>("meals"),
        db.listAll<HydrationLog>("hydration"), db.listAll<BodyMetric>("metrics"),
        db.listAll<GoutFlare>("flares"), db.listAll<Appointment>("appointments"),
        db.listDays(),
      ]);
      setProfile(p); setSettings(s); setWorkouts(w); setCravings(c); setSleep(sl);
      setMeals(m); setHydration(h); setMetrics(mt); setFlares(fl); setAppointments(ap); setDays(dy);
      setReady(true);
    })();
  }, []);

  const saveProfile = useCallback(async (p: Profile) => {
    const next = { ...p, updated_at: new Date().toISOString() };
    await db.putProfile(next);
    setProfile(next);
  }, []);

  const saveSettings = useCallback(async (s: Settings) => {
    await db.putSettings(s);
    setSettings(s);
  }, []);

  const addWorkout = useCallback(async (w: Omit<WorkoutSession, "id" | "created_at">) => {
    const item: WorkoutSession = { ...w, id: uid(), created_at: new Date().toISOString() };
    await db.putItem("workouts", item);
    setWorkouts((p) => [...p, item]);
  }, []);

  const addCraving = useCallback(async (c: Omit<CravingLog, "id" | "created_at">) => {
    const item: CravingLog = { ...c, id: uid(), created_at: new Date().toISOString() };
    await db.putItem("cravings", item);
    setCravings((p) => [...p, item]);
  }, []);

  const addSleep = useCallback(async (s: Omit<SleepLog, "id" | "created_at">) => {
    const item: SleepLog = { ...s, id: uid(), created_at: new Date().toISOString() };
    await db.putItem("sleep", item);
    setSleep((p) => [...p, item]);
  }, []);

  const addMeal = useCallback(async (m: Omit<Meal, "id" | "created_at">) => {
    const item: Meal = { ...m, id: uid(), created_at: new Date().toISOString() };
    await db.putItem("meals", item);
    setMeals((p) => [...p, item]);
  }, []);

  const addHydration = useCallback(async (ml: number, date = todayISO()) => {
    const item: HydrationLog = { id: uid(), date, ml, created_at: new Date().toISOString() };
    await db.putItem("hydration", item);
    setHydration((p) => [...p, item]);
  }, []);

  const addMetric = useCallback(async (m: Omit<BodyMetric, "id" | "created_at">) => {
    const item: BodyMetric = { ...m, id: uid(), created_at: new Date().toISOString() };
    await db.putItem("metrics", item);
    setMetrics((p) => [...p, item]);
  }, []);

  const addFlare = useCallback(async (f: Omit<GoutFlare, "id" | "created_at">) => {
    const item: GoutFlare = { ...f, id: uid(), created_at: new Date().toISOString() };
    await db.putItem("flares", item);
    setFlares((p) => [...p, item]);
  }, []);

  const endFlare = useCallback(async (id: string) => {
    setFlares((p) => {
      const next = p.map((f) => (f.id === id ? { ...f, end_date: todayISO() } : f));
      const changed = next.find((f) => f.id === id);
      if (changed) db.putItem("flares", changed);
      return next;
    });
  }, []);

  const toggleAppointment = useCallback(async (id: string) => {
    setAppointments((p) => {
      const next = p.map((a) => (a.id === id ? { ...a, done: !a.done } : a));
      const changed = next.find((a) => a.id === id);
      if (changed) db.putItem("appointments", changed);
      return next;
    });
  }, []);

  const setDayAction = useCallback(async (date: string, key: ActionKey, val: boolean) => {
    setDays((prev) => {
      const existing = prev.find((d) => d.date === date) ?? EMPTY_DAY(date);
      const updated = { ...existing, [key]: val };
      db.putDay(updated);
      const rest = prev.filter((d) => d.date !== date);
      return [...rest, updated];
    });
  }, []);

  const getDay = useCallback((date: string) => days.find((d) => d.date === date) ?? EMPTY_DAY(date), [days]);

  const value: AppDataValue = {
    ready, profile, settings, workouts, cravings, sleep, meals, hydration, metrics, flares, appointments, days,
    saveProfile, saveSettings, addWorkout, addCraving, addSleep, addMeal, addHydration, addMetric,
    addFlare, endFlare, toggleAppointment, setDayAction, getDay,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
