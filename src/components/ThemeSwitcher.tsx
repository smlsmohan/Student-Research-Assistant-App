'use client';

import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { 
      id: 'normal' as const, 
      name: 'Light', 
      icon: Sun, 
      description: 'Clean light theme',
      colors: 'bg-white border-gray-200 text-gray-900'
    },
    { 
      id: 'dark' as const, 
      name: 'Dark', 
      icon: Moon, 
      description: 'Easy on the eyes',
      colors: 'bg-gray-800 border-gray-600 text-white'
    },
    { 
      id: 'warm' as const, 
      name: 'Warm', 
      icon: Palette, 
      description: 'Warm and cozy',
      colors: 'bg-amber-50 border-amber-200 text-amber-900'
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 warm:bg-amber-100 rounded-lg">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.id;
          
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-white dark:bg-gray-600 warm:bg-amber-200 text-blue-600 dark:text-blue-400 warm:text-amber-800 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 warm:text-amber-700 hover:bg-white/50 dark:hover:bg-gray-600/50 warm:hover:bg-amber-200/50'
                }
              `}
              title={`Switch to ${themeOption.name} theme - ${themeOption.description}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{themeOption.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
