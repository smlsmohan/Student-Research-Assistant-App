'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search research opportunities by keywords, topics, or organizations..."
          className="w-full pl-10 pr-20 py-3 border theme-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 warm:focus:ring-amber-500 focus:border-blue-500 dark:focus:border-blue-400 warm:focus:border-amber-500 theme-bg theme-text text-lg"
        />
      </div>
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-green-600 dark:bg-green-500 warm:bg-emerald-600 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 warm:hover:bg-emerald-700 transition-colors font-medium"
      >
        Explore
      </button>
    </form>
  );
}
