import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(undefined); // undefined = "not yet known"
  const [dbUser, setDbUser]   = useState(null);
  const [session, setSession] = useState(null);

  // ── Resolve the matching row in our `users` table ────────────────────────
  // Runs in the background; never blocks rendering.
  const resolveDbUser = async (authUser) => {
    if (!authUser?.email) { setDbUser(null); return; }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();

    if (error) { console.warn('resolveDbUser:', error.message); return; }

    if (data) {
      setDbUser(data);
    } else {
      // Auth user exists but has no `users` row — create it automatically
      const { data: newRow } = await supabase
        .from('users')
        .insert({
          email: authUser.email,
          user_name: authUser.user_metadata?.user_name || authUser.email.split('@')[0],
          phone: authUser.user_metadata?.phone || '',
          password_hash: 'supabase_auth',
        })
        .select()
        .maybeSingle();
      setDbUser(newRow || null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Bootstrap from cached session — this is nearly instant (no network)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      // Kick off DB lookup in background — don't block render
      resolveDbUser(session?.user ?? null);
    });

    // 2. Listen for login / logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      resolveDbUser(session?.user ?? null);
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn  = (email, password) => supabase.auth.signInWithPassword({ email, password });

  const signUp  = (email, password, userData) =>
    supabase.auth.signUp({
      email, password,
      options: { data: { user_name: userData.name, phone: userData.phone } },
    });

  // signOut: clear Supabase session, then navigate away
  const signOut = async () => {
    await supabase.auth.signOut();
    // Hard redirect — clears all React state and sends user to login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, session, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
