'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { supabase, CORDIS_TABLE } from '@/lib/supabase';
import { CordisProject, SearchFilters } from '@/types/cordis';
import { ProjectCard } from './ProjectCard';
import { SearchInput } from './SearchInput';
import { FilterPanel } from './FilterPanel';
import { ProjectStats } from './ProjectStats';

export function ProjectsSearchView() {
  const [projects, setProjects] = useState<CordisProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from(CORDIS_TABLE)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,objective.ilike.%${filters.query}%,acronym.ilike.%${filters.query}%`);
      }
      
      if (filters.frameworkProgramme) {
        query = query.eq('frameworkprogramme', filters.frameworkProgramme);
      }
      
      if (filters.country) {
        query = query.ilike('org_countries', `%${filters.country}%`);
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

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      query = query
        .order('contentupdatedate', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      setProjects(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Stats Panel */}
      <ProjectStats filters={filters} />

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <SearchInput onSearch={handleSearch} />
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Advanced Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount.toLocaleString()} projects found
            </div>
          </div>
          
          {showFilters && (
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
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
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}
