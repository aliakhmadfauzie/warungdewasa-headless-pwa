import React from 'react';
import { MapPin, ShieldCheck, Zap, Lock, Truck } from 'lucide-react';

interface AudienceQualifierStripProps {
  onDirectCodClick?: () => void;
}

/**
 * Human UI Guide - Prompt 03: Build the Argument (Beat 1: Audience Qualifier Strip)
 * A thin, high-clarity qualifying strip directly beneath the hero that qualifies
 * the visitor immediately so the right user knows this is built for them.
 */
export const AudienceQualifierStrip: React.FC<AudienceQualifierStripProps> = ({ onDirectCodClick }) => {
  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-emerald-500/20 p-4 sm:p-5 backdrop-blur-md shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Qualifier Info */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5 sm:mt-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Target Layanan Khusus
                </span>
                <span className="text-xs text-slate-400 font-medium">Kota Medan, Deli Serdang, Binjai</span>
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                Layanan ini khusus bagi Anda yang ingin belanja produk dewasa tanpa cemas privasi bocor ke keluarga atau terekam di akun belanja publik.
              </p>
            </div>
          </div>

          {/* Right Highlights & Action */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <div className="hidden lg:flex items-center gap-3 text-xs text-slate-300 pr-3 border-r border-white/10">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tanpa Nama Produk</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Bayar Tunai</span>
              </span>
            </div>

            <button
              onClick={onDirectCodClick}
              className="inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Cara Pesan COD</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
