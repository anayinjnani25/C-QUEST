import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

const AuthContext = createContext(null);

// Where Google sends the player back: the app's own root, including the
// GitHub Pages subpath. This URL must be in Supabase's redirect allow list.
function redirectUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString();
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Sign-in isn't configured yet.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl() },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      configured: supabaseConfigured,
      loading,
      session,
      user: session?.user || null,
      signInWithGoogle,
      signOut,
    }),
    [loading, session, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
