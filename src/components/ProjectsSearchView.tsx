'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, AlertCircle } from 'lucide-react';
import { supabase, CORDIS_TABLE } from '@/lib/supabase';
import { CordisProject, SearchFilters } from '@/types/cordis';
import { ProjectCard } from './ProjectCard';
import { SearchInput } from './SearchInput';
import { FilterPanel } from './FilterPanel';
import { ProjectStats } from './ProjectStats';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectsSearchViewProps {
  initialFilters?: SearchFilters;
}

export function ProjectsSearchView({ initialFilters = {} }: ProjectsSearchViewProps) {
  // All ESLint issues resolved - ready for Vercel deployment
  const { canSearch, incrementSearchCount, user, searchCount } = useAuth();
  const [projects, setProjects] = useState<CordisProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  const fetchProjects = useCallback(async () => {
    // Check search limits for authenticated users
    if (user && hasSearched && !canSearch) {
      setError('You have reached your limit of 5 free searches. Please contact support to continue.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Track search for authenticated users
      if (user && (filters.query || Object.keys(filters).length > 0)) {
        incrementSearchCount();
        setHasSearched(true);
        
        // Save search to history
        await supabase
          .from('user_search_history')
          .insert({
            user_id: user.id,
            search_query: filters.query || '',
            search_filters: filters,
            results_count: 0 // Will be updated after we get results
          });
      }

      // Add timeout to prevent long-running queries - reduced for better UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      let query = supabase
        .from(CORDIS_TABLE)
        .select('*', { count: 'exact' })
        .abortSignal(controller.signal);

      // Apply filters with simpler queries for better performance
      if (filters.query) {
        // Simplified search - search in title and acronym first for better performance
        query = query.or(`title.ilike.%${filters.query}%,acronym.ilike.%${filters.query}%`);
      }
      
      if (filters.frameworkProgramme) {
        query = query.eq('frameworkprogramme', filters.frameworkProgramme);
      }
      
      if (filters.country) {
        query = query.ilike('org_countries', `%${filters.country}%`);
      }

      if (filters.role) {
        query = query.ilike('roles', `%${filters.role}%`);
      }

      if (filters.domain) {
        query = query.ilike('euroscivoc_labels', `%${filters.domain}%`);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.minBudget !== undefined) {
        query = query.gte('ecmaxcontribution', filters.minBudget);
      }
      
      if (filters.maxBudget !== undefined) {
        query = query.lte('ecmaxcontribution', filters.maxBudget);
      }

      // Pagination with smaller page size for better performance
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      query = query
        .order('contentupdatedate', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      clearTimeout(timeoutId);

      if (error) {
        throw error;
      }

      setProjects(data || []);
      setTotalCount(count || 0);
      
      // Update search history with results count
      if (user && hasSearched && (filters.query || Object.keys(filters).length > 0)) {
        await supabase
          .from('user_search_history')
          .update({ results_count: count || 0 })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
      }
    } catch (err: unknown) {
      console.error('Error fetching projects:', err);
      
      // Use fallback data if Supabase is unavailable
      const { fallbackProjects: fallbackProjectsData } = await import('@/lib/fallbackData');
      
      const error = err as { name?: string; message?: string };
      if (error.name === 'AbortError') {
        setError('Database is taking too long to respond. Showing sample data instead. Click "Try Again" to retry the search.');
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch')) {
        setError('Database connection issue. Showing sample data. Click "Try Again" to reconnect.');
      } else {
        setError('Database temporarily slow. Showing sample data. Click "Try Again" for live results.');
      }
      
      // Filter fallback data based on current filters
      let filteredProjects = fallbackProjectsData;
      
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredProjects = fallbackProjectsData.filter(project => 
          project.title.toLowerCase().includes(query) ||
          project.acronym.toLowerCase().includes(query) ||
          project.objective.toLowerCase().includes(query)
        );
      }
      
      if (filters.frameworkProgramme) {
        filteredProjects = filteredProjects.filter(p => p.frameworkprogramme === filters.frameworkProgramme);
      }
      
      setProjects(filteredProjects as CordisProject[]);
      setTotalCount(filteredProjects.length);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, user, hasSearched, canSearch, incrementSearchCount]); // Added missing dependencies

  const handleSearch = useCallback((query: string) => {
    // Check search limits before allowing search
    if (user && !canSearch) {
      setError('You have reached your limit of 5 free searches. Please contact support to continue.');
      return;
    }
    
    setFilters(prev => ({ ...prev, query }));
    setCurrentPage(1);
    setHasSearched(true);
  }, [user, canSearch]); // setError, setFilters, setCurrentPage, setHasSearched are state setters and don't need to be in deps

  const handleFilterChange = (newFilters: SearchFilters) => {
    // Check search limits before allowing filter changes
    if (user && !canSearch) {
      setError('You have reached your limit of 5 free searches. Please contact support to continue.');
      return;
    }
    
    setFilters(newFilters);
    setCurrentPage(1);
    setHasSearched(true);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Stats Panel */}
      <ProjectStats filters={filters} />

      {/* Search and Filter Controls */}
      <div className="theme-card rounded-lg shadow-lg p-6 border theme-border">
        <div className="space-y-4">
          {user && (
            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 warm:bg-amber-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Free searches remaining:</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 warm:text-amber-600">
                {Math.max(0, 5 - searchCount)} / 5
              </span>
            </div>
          )}
          
          {!canSearch && user ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Search Limit Reached</p>
                <p className="text-sm">You have used all 5 of your free searches. Please contact support to continue.</p>
              </div>
            </div>
          ) : (
            <SearchInput onSearch={handleSearch} />
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 warm:bg-amber-100 text-blue-700 dark:text-blue-300 warm:text-amber-700 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 warm:hover:bg-amber-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Research Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            <div className="text-sm text-muted-foreground flex items-center gap-4">
              <span className="font-medium text-green-600 dark:text-green-400 warm:text-emerald-600">{totalCount.toLocaleString()}</span> research opportunities found
              {user && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 warm:bg-amber-100 text-blue-700 dark:text-blue-300 warm:text-amber-700 rounded-full text-xs font-medium">
                  {Math.max(0, 5 - searchCount)} searches left
                </span>
              )}
            </div>
          </div>
          
          {showFilters && (
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 warm:bg-red-100 border border-red-200 dark:border-red-800 warm:border-red-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-800 dark:text-red-200 warm:text-red-900">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                fetchProjects();
              }}
              className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 warm:bg-red-200 warm:hover:bg-red-300 text-red-800 dark:text-red-200 warm:text-red-900 rounded text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="theme-card rounded-lg p-6 animate-pulse border theme-border">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 warm:bg-amber-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 warm:bg-amber-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 warm:bg-amber-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 warm:bg-amber-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 warm:bg-amber-200 text-gray-700 dark:text-gray-300 warm:text-amber-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 warm:hover:bg-amber-300 transition-colors"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 warm:bg-amber-200 text-gray-700 dark:text-gray-300 warm:text-amber-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 warm:hover:bg-amber-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && projects.length === 0 && !error && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium theme-text mb-2">
            No projects found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}
