'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-auth'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  searchCount: number
  canSearch: boolean
  incrementSearchCount: () => void
  resetSearchCount: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchCount, setSearchCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true;
    
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization taking too long, setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return;
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // Load search count for user
        if (session?.user) {
          await loadUserSearchCount(session.user.id)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        if (mounted) {
          clearTimeout(loadingTimeout);
          setLoading(false)
        }
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserSearchCount(session.user.id)
        } else {
          setSearchCount(0)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    }
  }, [supabase]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserSearchCount = async (userId: string) => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Search count query timeout')), 3000)
      );
      
      const queryPromise = supabase
        .from('user_search_counts')
        .select('search_count')
        .eq('user_id', userId)
        .single();

      const result = await Promise.race([queryPromise, timeoutPromise]) as { data?: { search_count?: number } | null, error?: { code?: string } | null };
      const { data, error } = result;

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading search count:', error)
        // Set default value instead of hanging
        setSearchCount(0)
        return
      }

      setSearchCount(data?.search_count || 0)
    } catch (error) {
      console.error('Error loading search count:', error)
      // Set default value on any error
      setSearchCount(0)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      })
      return { error: error as AuthError | null }
    } catch (error) {
      return { error: error as AuthError | null }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error: error as AuthError | null }
    } catch (error) {
      return { error: error as AuthError | null }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSearchCount(0)
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error: error as AuthError | null }
    } catch (error) {
      return { error: error as AuthError | null }
    }
  }

  const incrementSearchCount = async () => {
    if (!user) return

    const newCount = searchCount + 1
    setSearchCount(newCount)

    try {
      const { error } = await supabase
        .from('user_search_counts')
        .upsert(
          { user_id: user.id, search_count: newCount },
          { onConflict: 'user_id' }
        )

      if (error) {
        console.error('Error updating search count:', error)
        // Revert optimistic update on error
        setSearchCount(searchCount)
      }
    } catch (error) {
      console.error('Error updating search count:', error)
      setSearchCount(searchCount)
    }
  }

  const resetSearchCount = () => {
    setSearchCount(0)
  }

  const canSearch = searchCount < 5

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    searchCount,
    canSearch,
    incrementSearchCount,
    resetSearchCount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
