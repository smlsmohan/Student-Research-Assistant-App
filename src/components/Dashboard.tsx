'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Lightbulb, Award, ArrowRight, TrendingUp, BarChart3, PieChart, Euro } from 'lucide-react';
import { ProjectsSearchView } from './ProjectsSearchView';
import { DashboardStats } from './DashboardStats';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SearchFilters } from '@/types/cordis';
import { supabase, CORDIS_TABLE } from '@/lib/supabase';

// Enhanced Analytics Component
function ProgrammeChart({ data }: { data: Array<{name: string, count: number}> }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate">
            {item.name}
          </div>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm font-medium text-gray-900 dark:text-white">
            {item.count.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function CountryDistribution({ data }: { data: Array<{country: string, count: number}> }) {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-gray-500'
  ];
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {data.slice(0, 10).map((item, index) => (
        <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
            {item.country}
          </span>
          <span className="text-xs font-medium text-gray-900 dark:text-white">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function BudgetDistribution({ data }: { data: Array<{range: string, count: number}> }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{item.range}</span>
          <div className="flex items-center gap-2">
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                style={{ width: `${(item.count / total) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
              {Math.round((item.count / total) * 100)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const [showSearch, setShowSearch] = useState(false);
  const [initialFilters, setInitialFilters] = useState<SearchFilters>({});
  const [analyticsData, setAnalyticsData] = useState({
    programmes: [] as Array<{name: string, count: number}>,
    countries: [] as Array<{country: string, count: number}>,
    budgets: [] as Array<{range: string, count: number}>,
    trends: [] as Array<{year: string, count: number}>
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleQuickAction = (filters: SearchFilters) => {
    setInitialFilters(filters);
    setShowSearch(true);
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoadingAnalytics(true);
      
      // Fetch programme distribution
      const { data: programmes } = await supabase
        .from(CORDIS_TABLE)
        .select('frameworkprogramme')
        .not('frameworkprogramme', 'is', null)
        .limit(1000);
      
      // Fetch country distribution
      const { data: countries } = await supabase
        .from(CORDIS_TABLE)
        .select('org_countries')
        .not('org_countries', 'is', null)
        .limit(1000);
      
      // Fetch budget distribution
      const { data: budgets } = await supabase
        .from(CORDIS_TABLE)
        .select('ecmaxcontribution')
        .not('ecmaxcontribution', 'is', null)
        .gte('ecmaxcontribution', 0)
        .limit(1000);

      // Process programme data
      const programmeMap = new Map<string, number>();
      programmes?.forEach(p => {
        if (p.frameworkprogramme) {
          programmeMap.set(p.frameworkprogramme, (programmeMap.get(p.frameworkprogramme) || 0) + 1);
        }
      });
      const programmeData = Array.from(programmeMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // Process country data
      const countryMap = new Map<string, number>();
      countries?.forEach(c => {
        if (c.org_countries) {
          const countryList = c.org_countries.split('|');
          countryList.forEach((country: string) => {
            const cleanCountry = country.trim();
            if (cleanCountry) {
              countryMap.set(cleanCountry, (countryMap.get(cleanCountry) || 0) + 1);
            }
          });
        }
      });
      const countryData = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Process budget data
      const budgetRanges = [
        { range: '€0 - €100K', min: 0, max: 100000 },
        { range: '€100K - €500K', min: 100000, max: 500000 },
        { range: '€500K - €1M', min: 500000, max: 1000000 },
        { range: '€1M - €5M', min: 1000000, max: 5000000 },
        { range: '€5M+', min: 5000000, max: Infinity }
      ];
      
      const budgetData = budgetRanges.map(range => {
        const count = budgets?.filter(b => 
          b.ecmaxcontribution >= range.min && b.ecmaxcontribution < range.max
        ).length || 0;
        return { range: range.range, count };
      });

      setAnalyticsData({
        programmes: programmeData,
        countries: countryData,
        budgets: budgetData,
        trends: [] // Will implement later
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  if (showSearch) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setShowSearch(false);
              setInitialFilters({});
            }}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Research Explorer Mode
            </div>
            <ThemeSwitcher />
          </div>
        </div>
        <ProjectsSearchView initialFilters={initialFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats Cards */}
      <DashboardStats />

      {/* Main Action Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Research Future?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Explore thousands of European research projects, find funding opportunities, 
            connect with leading researchers, and discover your perfect research match.
          </p>
          <button
            onClick={() => setShowSearch(true)}
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Search className="w-6 h-6" />
            Search Opportunities
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Analytics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research Analytics</h2>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
            Live Data
          </span>
        </div>
        
        {loadingAnalytics ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading analytics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Programme Distribution */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Programmes</h3>
              </div>
              <ProgrammeChart data={analyticsData.programmes} />
            </div>

            {/* Country Distribution */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Countries</h3>
              </div>
              <CountryDistribution data={analyticsData.countries} />
            </div>

            {/* Budget Distribution */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Ranges</h3>
              </div>
              <BudgetDistribution data={analyticsData.budgets} />
            </div>
          </div>
        )}
        
        {/* Interactive Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Analytics Actions:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction({ frameworkProgramme: 'HORIZON EUROPE' })}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm transition-colors"
            >
              Explore Horizon Europe
            </button>
            <button
              onClick={() => handleQuickAction({ minBudget: 1000000 })}
              className="px-3 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm transition-colors"
            >
              €1M+ Projects
            </button>
            <button
              onClick={() => handleQuickAction({ country: 'Germany' })}
              className="px-3 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-lg text-sm transition-colors"
            >
              German Research
            </button>
            <button
              onClick={() => handleQuickAction({ status: 'SIGNED' })}
              className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm transition-colors"
            >
              Active Projects
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Research Discovery</h3>
          </div>            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Find cutting-edge research projects across all scientific domains. Discover what&apos;s being funded and where innovation is happening.
            </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>• Advanced search filters</li>
            <li>• Research domain categories</li>
            <li>• Funding information</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Network Building</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Connect with researchers, institutions, and organizations. Build your academic network and find collaboration opportunities.
          </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>• Organization contacts</li>
            <li>• Role-based filtering</li>
            <li>• Geographic distribution</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Funding Insights</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Understand funding patterns, budget ranges, and successful project structures. Learn from the best-funded research.
          </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>• Budget analysis</li>
            <li>• Programme comparisons</li>
            <li>• Success patterns</li>
          </ul>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Research Analytics</h3>
        
        {loadingAnalytics ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6" />
          </div>
        ) : (
          <>
            {/* Programme Distribution */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                Programme Distribution
              </h4>
              <ProgrammeChart data={analyticsData.programmes} />
            </div>

            {/* Country Distribution */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                Country Distribution
              </h4>
              <CountryDistribution data={analyticsData.countries} />
            </div>

            {/* Budget Distribution */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                Budget Distribution
              </h4>
              <BudgetDistribution data={analyticsData.budgets} />
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction({})}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow text-left"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Browse All Projects</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Explore the complete database</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction({ domain: 'artificial intelligence' })}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow text-left"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">AI & Technology</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Find tech research projects</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction({ domain: 'climate' })}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow text-left"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Climate & Environment</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Discover green research</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction({ domain: 'health' })}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow text-left"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Health & Medicine</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Explore medical research</p>
          </button>
        </div>
      </div>
    </div>
  );
}
