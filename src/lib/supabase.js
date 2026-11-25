import { createClient } from "@supabase/supabase-js";

// Set these in .env (see .env.example). The fallbacks are this game's own project:
// a publishable key is public by design, and row-level security guards the data.
const url = import.meta.env.VITE_SUPABASE_URL || "https://gxzzhbqqqmaakwspdpat.supabase.co";
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_NrQ-IGrX5CDTYIKVHGKavg_QPeveDJ1";

export const supabaseConfigured = Boolean(url && key);

let client = null;

// The browser-only Supabase client. Created on first use so the server render
// never touches browser storage. Returns null when the env vars are missing.
export function getSupabase() {
  if (typeof window === "undefined" || !supabaseConfigured) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
