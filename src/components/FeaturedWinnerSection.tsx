import React from 'react';
import { Product } from '../lib/types';
import { Sparkles, Trophy, Truck, ShieldCheck, ShoppingBag, Star, Zap, CheckCircle2 } from 'lucide-react';

interface FeaturedWinnerSectionProps {
  product: Product | null;
  onOrderDirect: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

/**
 * Human UI Guide - Prompt 04: Pick the Winner
 * The single most important bestseller is pulled out of the flat grid entirely,
 * giving it dedicated room, dominant weight, and space rather than just being one tile among 100.
 */
export const FeaturedWinnerSection: React.FC<FeaturedWinnerSectionProps> = ({
  product,
  onOrderDirect,
  onViewDetail
}) => {
  if (!product) return null;

  const notesCount = product.merchant_notes?.length || 0;

  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121B2B] via-[#101826] to-[#0A0F19] border border-emerald-500/40 p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/15 text-amber-400 border border-amber-400/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Pilihan Teratas Konsumen Medan
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                Produk Paling Direkomendasikan
              </h2>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready Stock Medan</span>
          </span>
        </div>

        {/* Winner Hero Split Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Big Visual Presentation */}
          <div className="lg:col-span-5 relative">
            <div
              onClick={() => onViewDetail(product)}
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl cursor-pointer group"
            >
              <img
                src={product.image_url}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-emerald-600/90 text-white rounded-xl shadow-md backdrop-blur-md flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>100% Original</span>
                </span>

                <span className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>4.9 / 5.0</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: In-depth Value, Price Dominance & Action */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {product.category}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-white mt-1 leading-snug">
                {product.title}
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Merchant Highlights */}
            {notesCount > 0 && product.merchant_notes && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Catatan Merchant ({notesCount}):</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{product.merchant_notes[0].content}"
                </p>
              </div>
            )}

            {/* Price & Touch-Optimized Primary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <div>
                <span className="text-xs text-slate-400">Harga Spesial Langsung</span>
                <div className="font-display text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                  Rp {product.price.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOrderDirect(product)}
                  className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-xl btn-gradient-emerald text-white font-display font-bold text-sm shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pesan Cepat (COD Medan)</span>
                </button>

                <button
                  onClick={() => onViewDetail(product)}
                  className="inline-flex items-center justify-center min-h-[48px] px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
