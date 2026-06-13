'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, themes, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeColors = {
    light: 'bg-white border-gray-300',
    dark: 'bg-gray-900 border-gray-700',
    blue: 'bg-blue-500 border-blue-600',
    green: 'bg-green-500 border-green-600',
    purple: 'bg-purple-500 border-purple-600',
    orange: 'bg-orange-500 border-orange-600',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-sm flex items-center gap-2"
        title="Change Theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Choose Theme
              </h3>
              <div className="space-y-2">
                {Object.entries(themes).map(([key, themeConfig]) => (
                  <button
                    key={key}
                    onClick={() => {
                      changeTheme(key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      theme === key
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${themeColors[key]}`}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {themeConfig.name}
                      </span>
                    </div>
                    {theme === key && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
