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
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 warm:text-amber-600 hover:text-blue-800 dark:hover:text-blue-300 warm:hover:text-amber-800 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
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
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Research Dashboard</h1>
          <p className="text-muted-foreground">Discover European research opportunities</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <DashboardStats />

      {/* Quick Actions - Moved to Top */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 warm:from-amber-50 warm:to-orange-100 rounded-xl p-6 theme-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 warm:text-amber-900">Quick Start Actions</h3>
          <span className="px-2 py-1 bg-emerald-200 dark:bg-emerald-800 warm:bg-amber-200 text-emerald-700 dark:text-emerald-300 warm:text-amber-700 text-xs font-medium rounded-full">
            Get Started Fast
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction({})}
            className="p-4 theme-card rounded-lg shadow-md theme-border hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 warm:text-amber-600" />
              <h4 className="font-semibold theme-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 warm:group-hover:text-amber-600 transition-colors">Browse All Projects</h4>
            </div>
            <p className="text-sm text-muted-foreground">Explore the complete database</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction({ domain: 'artificial intelligence' })}
            className="p-4 theme-card rounded-lg shadow-md theme-border hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 warm:text-amber-600" />
              <h4 className="font-semibold theme-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 warm:group-hover:text-amber-600 transition-colors">AI & Technology</h4>
            </div>
            <p className="text-sm text-muted-foreground">Find tech research projects</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction({ domain: 'climate' })}
            className="p-4 theme-card rounded-lg shadow-md theme-border hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 warm:text-amber-600" />
              <h4 className="font-semibold theme-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 warm:group-hover:text-amber-600 transition-colors">Climate & Environment</h4>
            </div>
            <p className="text-sm text-muted-foreground">Discover green research</p>
          </button>
          
          <button 
            onClick={() => handleQuickAction({ domain: 'health' })}
            className="p-4 theme-card rounded-lg shadow-md theme-border hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400 warm:text-amber-600" />
              <h4 className="font-semibold theme-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 warm:group-hover:text-amber-600 transition-colors">Health & Medicine</h4>
            </div>
            <p className="text-sm text-muted-foreground">Explore medical research</p>
          </button>
        </div>
      </div>

      {/* Main Action Card with New Theme */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
        <div className="relative max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Research Future?</h2>
          <p className="text-xl mb-6 text-orange-100">
            Explore thousands of European research projects, find funding opportunities, 
            connect with leading researchers, and discover your perfect research match.
          </p>
          <button
            onClick={() => setShowSearch(true)}
            className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            <Search className="w-6 h-6" />
            Search Opportunities
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Analytics Section - New Theme */}
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 rounded-xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-600 to-gray-700 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-gray-700 dark:from-slate-100 dark:to-gray-300 bg-clip-text text-transparent">Research Analytics</h2>
          <span className="px-3 py-1 bg-gradient-to-r from-slate-200 to-gray-200 dark:from-slate-800 dark:to-gray-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-300 dark:border-slate-600">
            Live Data
          </span>
        </div>
        
        {loadingAnalytics ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
            <span className="ml-3 text-slate-600 dark:text-slate-400 font-medium">Loading analytics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Programme Distribution */}
            <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Programmes</h3>
              </div>
              <ProgrammeChart data={analyticsData.programmes} />
            </div>

            {/* Country Distribution */}
            <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Countries</h3>
              </div>
              <CountryDistribution data={analyticsData.countries} />
            </div>

            {/* Budget Distribution */}
            <div className="space-y-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Budget Ranges</h3>
              </div>
              <BudgetDistribution data={analyticsData.budgets} />
            </div>
          </div>
        )}
        
        {/* Interactive Quick Actions for Analytics */}
        <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-600">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Analytics Quick Filters:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickAction({ frameworkProgramme: 'HORIZON EUROPE' })}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              🇪🇺 Horizon Europe
            </button>
            <button
              onClick={() => handleQuickAction({ minBudget: 1000000 })}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              💰 €1M+ Projects
            </button>
            <button
              onClick={() => handleQuickAction({ country: 'Germany' })}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              🇩🇪 German Research
            </button>
            <button
              onClick={() => handleQuickAction({ status: 'SIGNED' })}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              ✅ Active Projects
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Research Discovery</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Find cutting-edge research projects across all scientific domains. Discover what&apos;s being funded and where innovation is happening.
          </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <li>• Advanced search filters</li>
            <li>• Research domain categories</li>
            <li>• Funding information</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
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

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
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
    </div>
  );
}
