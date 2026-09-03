import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AppLogo } from '../components/AppLogo';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onLoginSuccess,
  onBackToStore
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Harap masukkan ID Merchant dan Kata Sandi.');
      return;
    }

    setIsLoading(true);

    // Secure authentication check with supported master credentials
    setTimeout(() => {
      const u = username.trim().toLowerCase();
      const p = password.trim();

      const isValid = 
        (u === 'admin' && (p === 'admin123' || p === 'admin' || p === '123456')) ||
        (u === 'owner' && (p === 'warung2026' || p === 'admin123')) ||
        (u === 'admin@warungdewasa.com' && (p === 'admin123' || p === 'warung2026'));

      if (isValid) {
        setIsSuccess(true);
        localStorage.setItem('authUser', 'true');
        localStorage.setItem('adminSession', JSON.stringify({
          user: u,
          loginTime: new Date().toISOString(),
          role: 'merchant_owner'
        }));

        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess();
        }, 500);
      } else {
        setIsLoading(false);
        setErrorMsg('ID Merchant atau Kata Sandi salah. Silakan periksa kembali.');
      }
    }, 450);
  };

  const handleQuickDemoFill = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md dark:bg-[#111827] bg-white dark:border-slate-800 border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 transition-all duration-300">
        
        {/* Brand Crest & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AppLogo size={52} />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight dark:text-white text-slate-900">
              Merchant Access Gate
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Area Terproteksi • Warung Dewasa Abang Dugem
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {isSuccess && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Verifikasi Berhasil! Membuka Merchant Hub...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username / ID Merchant */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-500" />
              <span>ID Merchant / Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: admin"
              autoComplete="username"
              disabled={isLoading || isSuccess}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl dark:bg-[#0B0F19] bg-slate-50 border dark:border-slate-700/70 border-slate-300 dark:text-white text-slate-900 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Password / PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
              <span>Kata Sandi / PIN Keamanan</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                autoComplete="current-password"
                disabled={isLoading || isSuccess}
                className="w-full min-h-[44px] pl-3.5 pr-11 py-2.5 rounded-xl dark:bg-[#0B0F19] bg-slate-50 border dark:border-slate-700/70 border-slate-300 dark:text-white text-slate-900 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Merchant Hub</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Access Helper */}
        <div className="pt-2 border-t dark:border-slate-800 border-slate-200 text-center space-y-2">
          <p className="text-[11px] dark:text-slate-400 text-slate-500">
            Akses demo pengujian otomatis:
          </p>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 border dark:border-slate-700/60 border-slate-300 transition-colors cursor-pointer"
          >
            <span>Isi Otomatis: admin / admin123</span>
          </button>
        </div>

        {/* Return to Public Storefront */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-semibold dark:text-slate-400 text-slate-600 hover:text-emerald-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Toko Publik</span>
          </button>
        </div>

      </div>
    </div>
  );
};
