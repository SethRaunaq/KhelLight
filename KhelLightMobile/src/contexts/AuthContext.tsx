import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Force sign out and clear AsyncStorage on app startup
    const clearSession = async () => {
      try {
        await supabase.auth.signOut();
        await AsyncStorage.clear();
        setUser(null);
      } catch (e) {
        // Ignore errors
      }
      // Now check for existing session (should be null)
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });
    };
    clearSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      return data;
    } catch (error: any) {
      console.error('Error signing in:', error.message || error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (error) throw error;
      setUser(data.user);
      return data;
    } catch (error: any) {
      console.error('Error signing up:', error.message || error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        throw error;
      }
      await AsyncStorage.clear(); // Force clear all persisted session data
      setUser(null);
      console.log('Sign-out successful');
    } catch (error: any) {
      console.error('Error during sign-out:', error.message || error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Apple:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, signInWithGoogle, signInWithApple }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}