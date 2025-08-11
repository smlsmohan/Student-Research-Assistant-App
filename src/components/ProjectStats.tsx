'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, TrendingUp, Globe, DollarSign } from 'lucide-react';
import { supabase, CORDIS_TABLE } from '@/lib/supabase';
import { SearchFilters, ProjectStats as ProjectStatsType } from '@/types/cordis';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface ProjectStatsProps {
  filters: SearchFilters;
}

export function ProjectStats({ filters }: ProjectStatsProps) {
  const [stats, setStats] = useState<ProjectStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    
    try {
      let query = supabase.from(CORDIS_TABLE).select('*');

      // Apply same filters as main search
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

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Calculate stats
        const totalProjects = data.length;
        const totalBudget = data.reduce((sum, project) => sum + (project.ecmaxcontribution || 0), 0);
        const averageBudget = totalProjects > 0 ? totalBudget / totalProjects : 0;

        // Framework distribution
        const frameworkDistribution: Record<string, number> = {};
        data.forEach(project => {
          const framework = project.frameworkprogramme || 'Unknown';
          frameworkDistribution[framework] = (frameworkDistribution[framework] || 0) + 1;
        });

        // Status distribution
        const statusDistribution: Record<string, number> = {};
        data.forEach(project => {
          const status = project.status || 'Unknown';
          statusDistribution[status] = (statusDistribution[status] || 0) + 1;
        });

        // Country distribution (simplified - just count unique countries mentioned)
        const countrySet = new Set<string>();
        data.forEach(project => {
          if (project.org_countries) {
            const countries = project.org_countries.split('|').map((c: string) => c.trim());
            countries.forEach((country: string) => {
              if (country) countrySet.add(country);
            });
          }
        });

        const countryDistribution: Record<string, number> = {};
        Array.from(countrySet).forEach((country: string) => {
          countryDistribution[country] = 1; // Simplified count
        });

        setStats({
          totalProjects,
          totalBudget,
          averageBudget,
          frameworkDistribution,
          countryDistribution,
          statusDistribution
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const topFrameworks = Object.entries(stats.frameworkDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topStatuses = Object.entries(stats.statusDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalProjects)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Budget */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.totalBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Average Budget */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Budget</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats.averageBudget)}
            </p>
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Globe className="h-8 w-8 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Countries</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.keys(stats.countryDistribution).length}
            </p>
          </div>
        </div>
      </div>

      {/* Framework Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Top Framework Programmes
        </h3>
        <div className="space-y-2">
          {topFrameworks.map(([framework, count]) => {
            const percentage = stats.totalProjects > 0 ? (count / stats.totalProjects) * 100 : 0;
            return (
              <div key={framework}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{framework}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(count)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Project Status Distribution
        </h3>
        <div className="space-y-2">
          {topStatuses.map(([status, count]) => {
            const percentage = stats.totalProjects > 0 ? (count / stats.totalProjects) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{status}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(count)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status === 'SIGNED' ? 'bg-green-600' :
                      status === 'CLOSED' ? 'bg-gray-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
