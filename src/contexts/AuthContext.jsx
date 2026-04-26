import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/lib/customSupabaseClient';
import { logAuthDebug } from '@/lib/debugAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  const [error, setError] = useState(null);

  const fetchRole = async (userId, attempt = 1) => {
    if (!supabase) return;

    setIsLoadingRole(true);
    logAuthDebug('Fetching role for user', userId);

    try {
      const { data, error } = await supabase
        .from('app_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      logAuthDebug('Role fetched', data?.role);
      
      const isUserAdmin = data?.role === 'admin';
      setIsAdmin(isUserAdmin);
      logAuthDebug('Is admin', isUserAdmin);
      
      setIsLoadingRole(false);
    } catch (error) {
      logAuthDebug('Error fetching role', error);
      
      if (attempt < 3) {
        logAuthDebug(`Retrying role fetch (Attempt ${attempt}/3)...`, userId);
        setTimeout(() => fetchRole(userId, attempt + 1), 1000 * attempt);
      } else {
        logAuthDebug('Max retry attempts reached. Defaulting to non-admin.');
        setIsAdmin(false);
        setIsLoadingRole(false);
        // Don't set global error here to avoid blocking the UI for non-critical role fetch failures
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!supabase) {
        console.error('Supabase client is not initialized');
        setError('Supabase configuration is missing. Please check environment variables.');
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          logAuthDebug('User authenticated (initial session)', session.user.email);
          setUser(session.user);
          await fetchRole(session.user.id);
        } else {
          logAuthDebug('No active session found');
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        logAuthDebug('Session check error', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logAuthDebug(`Auth state changed: ${event}`);
      
      if (session?.user) {
        // Only fetch role if user changed or if we just signed in
        if (!user || user.id !== session.user.id) {
          logAuthDebug('User authenticated (state change)', session.user.email);
          setUser(session.user);
          await fetchRole(session.user.id);
        }
      } else {
        logAuthDebug('User signed out');
        setUser(null);
        setIsAdmin(false);
        setIsLoadingRole(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!supabase) return { data: null, error: new Error('Supabase not initialized') };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      logAuthDebug('Login error', error);
      return { data: null, error };
    }
  };

  const logout = async () => {
    if (!supabase) return;

    logAuthDebug('Logging out');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      logAuthDebug('Logout error', error);
      // Force local cleanup even if network fails
      setUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, isLoadingRole, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};