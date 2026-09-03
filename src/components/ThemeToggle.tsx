import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark/light mode"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-800/70 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
    >
      {mode === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
      <span>{mode === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
};
