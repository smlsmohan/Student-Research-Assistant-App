'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseClient } from '@/lib/supabase-auth';

interface Bookmark {
  id: string;
  user_id: string;
  project_id: number;
  created_at: string;
}

interface BookmarksContextType {
  bookmarks: number[];
  loading: boolean;
  addBookmark: (projectId: number) => Promise<{ error: string | null }>;
  removeBookmark: (projectId: number) => Promise<{ error: string | null }>;
  isBookmarked: (projectId: number) => boolean;
  refreshBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const supabase = createSupabaseClient();

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    return process.env.NEXT_PUBLIC_SUPABASE_URL && 
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
           supabase !== null;
  };

  // Fetch user bookmarks
  const fetchBookmarks = async () => {
    if (!user || !isSupabaseConfigured()) {
      setBookmarks([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('project_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching bookmarks:', error);
      } else {
        setBookmarks(data.map((bookmark: { project_id: number }) => bookmark.project_id));
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add bookmark
  const addBookmark = async (projectId: number) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    if (!isSupabaseConfigured()) {
      return { error: 'Database not configured' };
    }

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          project_id: projectId,
        });

      if (error) {
        return { error: error.message };
      }

      // Update local state
      setBookmarks(prev => [...prev, projectId]);
      return { error: null };
    } catch (error) {
      return { error: 'Failed to add bookmark' };
    }
  };

  // Remove bookmark
  const removeBookmark = async (projectId: number) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    if (!isSupabaseConfigured()) {
      return { error: 'Database not configured' };
    }

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('project_id', projectId);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      setBookmarks(prev => prev.filter(id => id !== projectId));
      return { error: null };
    } catch (error) {
      return { error: 'Failed to remove bookmark' };
    }
  };

  // Check if project is bookmarked
  const isBookmarked = (projectId: number) => {
    return bookmarks.includes(projectId);
  };

  // Refresh bookmarks
  const refreshBookmarks = async () => {
    await fetchBookmarks();
  };

  // Fetch bookmarks when user changes
  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const value = {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refreshBookmarks,
  };

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider');
  }
  return context;
}
