import React, { useState } from 'react';
import { Product } from '../lib/types';
import {
  Palette, Sliders, Download, RotateCcw, Check, Sparkles,
  Layers, ShieldCheck, Truck, ShoppingBag, Lock, Eye, Zap, Save
} from 'lucide-react';

interface ThemeEditorProps {
  products?: Product[];
  onApplyTokens?: (tokens: any) => void;
}

interface ColorState {
  primaryEmerald: string;
  accentMint: string;
  canvasDark: string;
  surfaceCard: string;
  surfaceElevated: string;
  warningAmber: string;
  dangerRose: string;
  infoSky: string;
}

const DEFAULT_THEME: ColorState = {
  primaryEmerald: '#006C4C',
  accentMint: '#2DD4BF',
  canvasDark: '#0A1A14',
  surfaceCard: '#0F261D',
  surfaceElevated: '#143327',
  warningAmber: '#F59E0B',
  dangerRose: '#EF4444',
  infoSky: '#0EA5E9'
};

const PRESETS: Record<string, { label: string; colors: ColorState }> = {
  default: {
    label: 'Material 3 Emerald (Default)',
    colors: DEFAULT_THEME
  },
  deepForest: {
    label: 'Deep Forest Nocturne',
    colors: {
      ...DEFAULT_THEME,
      primaryEmerald: '#006C4C',
      accentMint: '#2DD4BF',
      canvasDark: '#0A1A14',
      surfaceCard: '#0F261D',
      surfaceElevated: '#143327'
    }
  },
  cyberMint: {
    label: 'Cyberpunk Neon Mint',
    colors: {
      ...DEFAULT_THEME,
      primaryEmerald: '#059669',
      accentMint: '#00FFA3',
      canvasDark: '#080C14',
      surfaceCard: '#101726',
      surfaceElevated: '#172238'
    }
  }
};

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ products = [] }) => {
  const [colors, setColors] = useState<ColorState>(DEFAULT_THEME);
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [glassBlur, setGlassBlur] = useState<number>(16);
  const [fontScale, setFontScale] = useState<number>(1.0);
  const [isAppliedLive, setIsAppliedLive] = useState<boolean>(false);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Sample preview product
  const sampleProduct: Product = products[0] || {
    id: 'sample-1',
    title: 'Durex Fetherlite Ultra Thin Premium (3s Pack)',
    category: 'Kondom',
    price: 48000,
    stock_status: 'in_stock',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    description: 'Kondom lateks ultra-tipis dengan pelumas ekstra untuk sensasi alami maksimal.',
    shopee_url: 'https://shopee.co.id',
    tokopedia_url: 'https://tokopedia.com',
    merchant_notes: [
      { id: '1', content: 'Varian terlaris di Medan. Kemasan 100% polos dan bebas bau getah.', created_at: '2026-09-04' }
    ]
  };

  const handleColorChange = (key: keyof ColorState, val: string) => {
    setColors((prev) => ({ ...prev, [key]: val }));
    setIsAppliedLive(false);
  };

  const applyPreset = (presetKey: string) => {
    if (PRESETS[presetKey]) {
      setColors(PRESETS[presetKey].colors);
      setIsAppliedLive(false);
    }
  };

  const resetDefaults = () => {
    setColors(DEFAULT_THEME);
    setBorderRadius(16);
    setGlassBlur(16);
    setFontScale(1.0);
    // Remove inline style overrides
    document.documentElement.style.removeProperty('--bg-main');
    document.documentElement.style.removeProperty('--bg-card');
    document.documentElement.style.removeProperty('--accent-primary');
    setIsAppliedLive(false);
  };

  // Inject CSS Variables dynamically to current page DOM in real time!
  const applyLiveStyles = () => {
    const root = document.documentElement;
    root.style.setProperty('--bg-main', colors.canvasDark);
    root.style.setProperty('--bg-card', colors.surfaceCard);
    root.style.setProperty('--accent-primary', colors.primaryEmerald);
    setIsAppliedLive(true);
    setTimeout(() => setIsAppliedLive(false), 3000);
  };

  // Export JSON file definition
  const downloadTokensJson = () => {
    const exportData = {
      name: 'Warung Dewasa Custom Tokens',
      exportedAt: new Date().toISOString(),
      colors,
      radii: {
        base: `${borderRadius}px`,
        card: `${borderRadius}px`,
        button: `${Math.round(borderRadius * 0.75)}px`
      },
      glass: {
        blur: `${glassBlur}px`
      },
      typography: {
        fontScale
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tokens_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedStatus('File tokens.json berhasil diunduh!');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Studio Banner & Header ────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#101827] to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="kicker-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Local Design Studio (Codex Architecture)</span>
              </span>
            </div>
            <h1 className="font-display text-2xl font-black text-white mt-1">
              Visual Theme &amp; Token Editor
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Tweak semantic colors, typography scale, radii, and glass blur in real time without touching source code directly.
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={applyLiveStyles}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {isAppliedLive ? <Check className="w-4 h-4 text-emerald-100" /> : <Zap className="w-4 h-4" />}
            <span>{isAppliedLive ? 'Tersimpan Live!' : 'Terapkan ke Aplikasi Live'}</span>
          </button>

          <button
            onClick={downloadTokensJson}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-display font-bold text-xs border border-emerald-500/40 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download tokens.json</span>
          </button>
        </div>
      </div>

      {copiedStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{copiedStatus}</span>
        </div>
      )}

      {/* ── Preset Picker Chips ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pr-2">
          Preset Palet:
        </span>
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-white/10 hover:border-emerald-500/40 transition-all active:scale-95 cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* ── 2-Column Split: Controls (Left) & Sandbox Preview (Right) ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left Column: Token Controls ──────────────────────────────────── */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card: Color Tuning */}
          <div className="signature-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Palet Warna Semantic (M3 Tokens)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Emerald */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Primary Emerald</span>
                  <span className="font-mono text-[11px] text-slate-300">{colors.primaryEmerald}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors.primaryEmerald}
                    onChange={(e) => handleColorChange('primaryEmerald', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={colors.primaryEmerald}
                    onChange={(e) => handleColorChange('primaryEmerald', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Accent Mint */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Vibrant Mint Accent</span>
                  <span className="font-mono text-[11px] text-slate-300">{colors.accentMint}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors.accentMint}
                    onChange={(e) => handleColorChange('accentMint', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={colors.accentMint}
                    onChange={(e) => handleColorChange('accentMint', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Canvas Dark */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Canvas Neutral Dark</span>
                  <span className="font-mono text-[11px] text-slate-300">{colors.canvasDark}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors.canvasDark}
                    onChange={(e) => handleColorChange('canvasDark', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={colors.canvasDark}
                    onChange={(e) => handleColorChange('canvasDark', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Surface Card */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Card Container Surface</span>
                  <span className="font-mono text-[11px] text-slate-300">{colors.surfaceCard}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors.surfaceCard}
                    onChange={(e) => handleColorChange('surfaceCard', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={colors.surfaceCard}
                    onChange={(e) => handleColorChange('surfaceCard', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Warning Amber */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Status Amber (Urgent)</span>
                  <span className="font-mono text-[11px] text-slate-300">{colors.warningAmber}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors.warningAmber}
                    onChange={(e) => handleColorChange('warningAmber', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={colors.warningAmber}
                    onChange={(e) => handleColorChange('warningAmber', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Danger Rose */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                  <span>Status Rose (Habis/Error)</span>
                  <span className="font-mono text-[11px] text-slate-300">{colors.dangerRose}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors.dangerRose}
                    onChange={(e) => handleColorChange('dangerRose', e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={colors.dangerRose}
                    onChange={(e) => handleColorChange('dangerRose', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Radii & Typography Sliders */}
          <div className="signature-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                Geometri, Sudut &amp; Glassmorphism
              </h2>
            </div>

            {/* Corner Radius Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Border Radius Card</span>
                <span className="font-mono text-emerald-400 font-bold">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min="6"
                max="32"
                step="2"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Sharp (6px)</span>
                <span>Default (16px)</span>
                <span>Pill (32px)</span>
              </div>
            </div>

            {/* Backdrop Blur Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Glassmorphism Blur</span>
                <span className="font-mono text-emerald-400 font-bold">{glassBlur}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                step="2"
                value={glassBlur}
                onChange={(e) => setGlassBlur(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Subtle (4px)</span>
                <span>M3 Standard (16px)</span>
                <span>Frost (32px)</span>
              </div>
            </div>

            {/* Font Scale Ratio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Font Scale Ratio (Outfit Display)</span>
                <span className="font-mono text-emerald-400 font-bold">{fontScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.3"
                step="0.05"
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ── Right Column: Live Interactive Component Sandbox ─────────────── */}
        <div className="lg:col-span-6 space-y-6">
          <div className="signature-card p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Live Component Sandbox
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Responsive Preview
              </span>
            </div>

            {/* 1. Live Sandbox Product Card */}
            <div
              style={{
                backgroundColor: colors.surfaceCard,
                borderRadius: `${borderRadius}px`,
                borderColor: `${colors.primaryEmerald}33`
              }}
              className="p-4 border transition-all duration-200 shadow-2xl flex flex-col space-y-3"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={sampleProduct.image_url}
                  alt={sampleProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span
                    style={{
                      backgroundColor: `${colors.primaryEmerald}E6`,
                      borderRadius: `${Math.round(borderRadius * 0.5)}px`
                    }}
                    className="px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-sm flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Official Store</span>
                  </span>
                </div>
              </div>

              <div>
                <span
                  style={{ color: colors.accentMint }}
                  className="text-[10px] font-bold uppercase tracking-wider"
                >
                  {sampleProduct.category}
                </span>
                <h3
                  style={{ fontSize: `${14 * fontScale}px` }}
                  className="font-display font-bold text-white line-clamp-1"
                >
                  {sampleProduct.title}
                </h3>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div
                  style={{
                    color: colors.accentMint,
                    fontSize: `${18 * fontScale}px`
                  }}
                  className="font-display font-black tabular-nums"
                >
                  Rp {sampleProduct.price.toLocaleString('id-ID')}
                </div>
                <span
                  style={{ color: colors.warningAmber }}
                  className="text-[11px] font-bold"
                >
                  ⭐ 4.9 (50+ ulasan)
                </span>
              </div>

              {/* Sandbox Primary Button */}
              <button
                style={{
                  backgroundColor: colors.primaryEmerald,
                  borderRadius: `${Math.round(borderRadius * 0.65)}px`,
                  minHeight: '48px'
                }}
                className="w-full text-white font-display font-bold text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pesan Cepat (COD Medan)</span>
              </button>
            </div>

            {/* 2. Live Sandbox Kicker & Courier Badge */}
            <div className="space-y-3 pt-2">
              <div
                style={{
                  backdropFilter: `blur(${glassBlur}px)`,
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: `${colors.surfaceElevated}CC`,
                  borderColor: `${colors.primaryEmerald}40`
                }}
                className="p-4 border shadow-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: colors.accentMint }}
                      className="w-2 h-2 rounded-full animate-pulse"
                    />
                    <span className="text-xs font-bold text-white">Kurir Standby Medan</span>
                  </div>
                  <span
                    style={{
                      color: colors.accentMint,
                      backgroundColor: `${colors.primaryEmerald}20`,
                      borderColor: `${colors.primaryEmerald}40`,
                      borderRadius: '9999px'
                    }}
                    className="px-2 py-0.5 text-[10px] font-bold border"
                  >
                    45–90 Menit Tiba
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Paket kardus polos cokelat tanpa label dewasa. Pembayaran tunai saat barang sampai.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
