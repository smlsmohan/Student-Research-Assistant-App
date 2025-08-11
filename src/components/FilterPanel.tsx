'use client';

import { useState, useEffect } from 'react';
import { SearchFilters } from '@/types/cordis';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="theme-card border theme-border rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Framework Programme */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Programme
          </label>
          <select
            value={localFilters.frameworkProgramme || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, frameworkProgramme: e.target.value || undefined }))}
            className="w-full p-2 border theme-border rounded-md theme-card"
          >
            <option value="">All Programmes</option>
            <option value="HORIZON">HORIZON</option>
            <option value="H2020">H2020</option>
            <option value="FP7">FP7</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Status
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
            className="w-full p-2 border theme-border rounded-md theme-card"
          >
            <option value="">All Statuses</option>
            <option value="SIGNED">Active</option>
            <option value="CLOSED">Completed</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Country/Region
          </label>
          <input
            type="text"
            value={localFilters.country || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, country: e.target.value || undefined }))}
            placeholder="e.g., Germany, Spain"
            className="w-full p-2 border theme-border rounded-md theme-card"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Role Type
          </label>
          <input
            type="text"
            value={localFilters.role || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, role: e.target.value || undefined }))}
            placeholder="e.g., coordinator, partner"
            className="w-full p-2 border theme-border rounded-md theme-card"
          />
        </div>

        {/* Research Domain */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Research Domain
          </label>
          <input
            type="text"
            value={localFilters.domain || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, domain: e.target.value || undefined }))}
            placeholder="e.g., AI, Climate, Health"
            className="w-full p-2 border theme-border rounded-md theme-card"
          />
        </div>
      </div>

      {/* Budget Range and Year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Start Year
          </label>
          <input
            type="number"
            value={localFilters.startYear || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, startYear: e.target.value ? parseInt(e.target.value) : undefined }))}
            placeholder="e.g., 2020"
            min="2000"
            max="2030"
            className="w-full p-2 border theme-border rounded-md theme-card"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Min Budget (€)
          </label>
          <input
            type="number"
            value={localFilters.minBudget || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, minBudget: e.target.value ? parseInt(e.target.value) : undefined }))}
            placeholder="e.g., 100000"
            min="0"
            className="w-full p-2 border theme-border rounded-md theme-card"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Max Budget (€)
          </label>
          <input
            type="number"
            value={localFilters.maxBudget || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, maxBudget: e.target.value ? parseInt(e.target.value) : undefined }))}
            placeholder="e.g., 5000000"
            min="0"
            className="w-full p-2 border theme-border rounded-md theme-card"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 warm:bg-amber-600 warm:hover:bg-amber-700 transition-colors font-medium"
        >
          Find Opportunities
        </button>
        <button
          onClick={handleClearFilters}
          className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 warm:bg-amber-100 warm:text-amber-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 warm:hover:bg-amber-200 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
