import React from 'react';

interface AuthButtonsProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isAuthenticated, login, logout }) => (
  <div className="flex items-center gap-2">
    {isAuthenticated ? (
      <button
        onClick={logout}
        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
        aria-label="Logout"
      >
        Logout
      </button>
    ) : (
      <button
        onClick={login}
        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
        aria-label="Login"
      >
        Login
      </button>
    )}
  </div>
);
