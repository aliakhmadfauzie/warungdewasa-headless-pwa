import React, { useState, useEffect } from 'react';
import { ShoppingBag, PlusCircle, LayoutDashboard, Store, CreditCard, Sun, Moon, LogIn, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  currentView: 'store' | 'admin';
  setCurrentView: (view: 'store' | 'admin') => void;
  onRequestOpen: () => void;
  onOpenPaymentMethods: () => void;
  requestCount: number;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onRequestOpen,
  onOpenPaymentMethods,
  requestCount,
  isAuthenticated,
  login,
  logout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? 'dark:bg-[#0B0F19]/85 bg-white/90 backdrop-blur-xl border-b dark:border-slate-800 border-slate-200 shadow-lg dark:shadow-black/40 shadow-slate-200/50 py-2 sm:py-2.5'
          : 'bg-transparent border-b border-transparent shadow-none py-3 sm:py-3.5'
      }`}
    >
      {/* Top frosted highlight line */}
      <div
        className={`absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent transition-opacity duration-300 pointer-events-none ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 sm:h-12 gap-2">

          {/* ─── Brand with Official App Logo ─── */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0 shrink"
            onClick={() => setCurrentView('store')}
          >
            <AppLogo size={36} className="sm:hidden" />
            <AppLogo size={38} className="hidden sm:inline-flex" />

            <div className="min-w-0">
              {/* Mobile: short name only */}
              <span className="block sm:hidden font-display text-sm font-extrabold tracking-tight dark:text-white text-slate-900 group-hover:text-emerald-500 transition-colors truncate">
                Warung Dewasa
              </span>
              {/* Desktop: full name + [Official] badge */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="font-display text-base lg:text-[17px] font-extrabold tracking-tight dark:text-white text-slate-900 group-hover:text-emerald-500 transition-colors whitespace-nowrap">
                  Warung Dewasa Abang Dugem
                </span>
                <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 rounded-md shrink-0">
                  Official Store
                </span>
              </div>
              <span className="hidden sm:block text-[9px] dark:text-slate-400 text-slate-500 font-medium tracking-wider uppercase">
                Headless E-Commerce PWA • COD Medan
              </span>
            </div>
          </div>

          {/* ─── Right-side actions ─── */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Payment shortcut — generous touch target on mobile */}
            <button
              onClick={onOpenPaymentMethods}
              title="Informasi Metode Pembayaran & Rekening Resmi"
              aria-label="Metode Pembayaran Resmi"
              className="inline-flex items-center justify-center gap-1.5 min-h-[42px] min-w-[42px] sm:min-w-0 px-2.5 sm:px-3.5 py-2 rounded-xl dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold dark:text-slate-200 text-slate-700 dark:hover:text-white hover:text-slate-900 border dark:border-slate-700/80 border-slate-300 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <CreditCard className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Metode Bayar</span>
            </button>

            {/* Theme toggle — 42px touch target */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className="inline-flex items-center justify-center min-h-[42px] min-w-[42px] p-2 sm:px-2.5 rounded-xl dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-200 text-slate-700 dark:hover:text-white hover:text-slate-900 border dark:border-slate-700/70 border-slate-300 transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              {mode === 'dark'
                ? <Sun className="w-4 h-4 text-emerald-400" />
                : <Moon className="w-4 h-4 text-emerald-600" />
              }
            </button>

            {/* Auth — generous touch target */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                aria-label="Logout"
                className="inline-flex items-center justify-center gap-1.5 min-h-[42px] min-w-[42px] sm:min-w-0 px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-300 hover:text-white text-xs font-bold border border-emerald-600/40 hover:border-emerald-500 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                onClick={login}
                aria-label="Login"
                className="inline-flex items-center justify-center gap-1.5 min-h-[42px] min-w-[42px] sm:min-w-0 px-2.5 sm:px-3.5 py-2 rounded-xl dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-200 text-slate-700 dark:hover:text-white hover:text-slate-900 text-xs font-bold border dark:border-slate-700/80 border-slate-300 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* View switch — Merchant Panel or Back to Store */}
            {currentView === 'store' ? (
              <>
                <button
                  onClick={onRequestOpen}
                  className="hidden md:inline-flex items-center gap-2 min-h-[42px] px-3.5 py-2 rounded-xl dark:bg-slate-800/70 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 border dark:border-slate-700/80 border-slate-300 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                  <span>Request Khusus</span>
                </button>

                <button
                  onClick={() => setCurrentView('admin')}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-950/30 transition-all active:scale-95 cursor-pointer"
                  title="Masuk ke Merchant Panel"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline font-display">Merchant</span>
                  {requestCount > 0 && (
                    <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center">
                      {requestCount}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentView('store')}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] px-3 sm:px-4 py-2 rounded-xl dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold dark:text-slate-200 text-slate-800 dark:hover:text-white border dark:border-slate-700 border-slate-300 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Store className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span className="font-display">Kembali ke Toko</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};


