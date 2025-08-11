'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ProjectCard } from '@/components/ProjectCard';
import { SearchInput } from '@/components/SearchInput';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import UserMenu from '@/components/auth/UserMenu';
import { CordisProject } from '@/types/cordis';
import { createSupabaseClient } from '@/lib/supabase-auth';
import { Bookmark, Search, Filter } from 'lucide-react';

export default function BookmarksPage() {
  const { user } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const [projects, setProjects] = useState<CordisProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<CordisProject[]>([]);

  const supabase = createSupabaseClient();

  // Fetch bookmarked projects
  useEffect(() => {
    const fetchBookmarkedProjects = async () => {
      if (!user || bookmarks.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('cordis_projects')
          .select('*')
          .in('id', bookmarks)
          .order('startdate', { ascending: false });

        if (error) {
          console.error('Error fetching bookmarked projects:', error);
        } else {
          setProjects(data || []);
        }
      } catch (error) {
        console.error('Error fetching bookmarked projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!bookmarksLoading) {
      fetchBookmarkedProjects();
    }
  }, [user, bookmarks, bookmarksLoading, supabase]);

  // Filter projects based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project => {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.title?.toLowerCase().includes(searchLower) ||
        project.acronym?.toLowerCase().includes(searchLower) ||
        project.objective?.toLowerCase().includes(searchLower) ||
        project.org_names?.toLowerCase().includes(searchLower) ||
        project.topics_desc?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  if (loading || bookmarksLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your bookmarks...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Bookmark className="h-8 w-8 text-yellow-600 dark:text-yellow-400 warm:text-amber-600" />
                My Bookmarks
              </h1>
              <p className="text-muted-foreground mt-2">
                {projects.length} saved research project{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <UserMenu />
            </div>
          </div>

          {/* Search */}
          {projects.length > 0 && (
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search your bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              {searchTerm && (
                <p className="text-sm text-muted-foreground mt-2">
                  Found {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''} for "{searchTerm}"
                </p>
              )}
            </div>
          )}

          {/* Content */}
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No bookmarks yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring research projects and bookmark the ones that interest you. 
                Your saved projects will appear here.
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Explore Projects
              </a>
            </div>
          ) : filteredProjects.length === 0 && searchTerm ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
              <p className="text-muted-foreground">
                No bookmarked projects match your search for "{searchTerm}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
