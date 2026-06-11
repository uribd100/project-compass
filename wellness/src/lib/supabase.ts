import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cloud sync is OPTIONAL. The app is fully usable offline (local-first / IndexedDB).
// To enable sync, set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (see supabase/README.md).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseEnabled = Boolean(url && anon);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, anon as string)
  : null;
