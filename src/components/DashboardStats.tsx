'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Euro, Globe, Users } from 'lucide-react';
import { supabase, CORDIS_TABLE } from '@/lib/supabase';

interface DashboardStatsData {
  totalProjects: number;
  totalFunding: number;
  uniqueCountries: number;
  uniqueOrganizations: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalProjects: 0,
    totalFunding: 0,
    uniqueCountries: 0,
    uniqueOrganizations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total projects count
      const { count: totalProjects } = await supabase
        .from(CORDIS_TABLE)
        .select('*', { count: 'exact', head: true });

      // Get total funding (sum of ecmaxcontribution)
      const { data: fundingData } = await supabase
        .from(CORDIS_TABLE)
        .select('ecmaxcontribution')
        .not('ecmaxcontribution', 'is', null);

      const totalFunding = fundingData?.reduce((sum, project) => {
        return sum + (project.ecmaxcontribution || 0);
      }, 0) || 0;

      // Get unique countries (using org_countries)
      const { data: countryData } = await supabase
        .from(CORDIS_TABLE)
        .select('org_countries')
        .not('org_countries', 'is', null);

      const uniqueCountries = new Set();
      countryData?.forEach(project => {
        if (project.org_countries) {
          const countries = project.org_countries.split('|').filter((c: string) => c.trim());
          countries.forEach((country: string) => uniqueCountries.add(country.trim()));
        }
      });

      // Get unique organizations
      const { data: orgData } = await supabase
        .from(CORDIS_TABLE)
        .select('org_names')
        .not('org_names', 'is', null);

      const uniqueOrganizations = new Set();
      orgData?.forEach(project => {
        if (project.org_names) {
          const orgs = project.org_names.split('|').filter((o: string) => o.trim());
          orgs.forEach((org: string) => uniqueOrganizations.add(org.trim()));
        }
      });

      setStats({
        totalProjects: totalProjects || 0,
        totalFunding,
        uniqueCountries: uniqueCountries.size,
        uniqueOrganizations: uniqueOrganizations.size,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFunding = (amount: number) => {
    if (amount >= 1000000000) {
      return `€${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else {
      return `€${amount.toLocaleString()}`;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Projects</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalProjects.toLocaleString()}
            </p>
          </div>
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 border border-green-200 dark:border-green-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Funding</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatFunding(stats.totalFunding)}
            </p>
          </div>
          <Euro className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Countries</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {stats.uniqueCountries}
            </p>
          </div>
          <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Organizations</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {stats.uniqueOrganizations.toLocaleString()}
            </p>
          </div>
          <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
      </div>
    </div>
  );
}
