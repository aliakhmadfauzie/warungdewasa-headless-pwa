import React, { memo } from 'react';
import { Product, StockStatus } from '../lib/types';
import { openRegionalMarketplace } from '../lib/deepLinkResolver';
import {
  ExternalLink, Sparkles, CheckCircle2, AlertTriangle,
  XCircle, Clock, Star, MapPin, ShieldCheck, ShoppingBag, Zap, Award
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWinner?: boolean;
  onOpenNotes?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  onOrderDirect?: (product: Product) => void;
  onDirectCod?: (product: Product) => void;
  onShopeeRedirect?: (product: Product) => void;
}

// ── Stock badge config — semantic M3 surface container roles ─────────────────
const STOCK_BADGES: Record<StockStatus, {
  label: string;
  containerClass: string;
  textClass: string;
  icon: React.ReactNode;
}> = {
  in_stock: {
    label: 'Ready',
    containerClass: 'bg-emerald-500/20 border-emerald-500/40',
    textClass:      'text-emerald-300',
    icon: <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
  },
  low_stock: {
    label: 'Stok Terbatas',
    containerClass: 'bg-md-amber-badge/20 border-md-amber-badge/40',
    textClass:      'text-amber-300',
    icon: <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
  },
  out_of_stock: {
    label: 'Habis',
    containerClass: 'bg-md-error/20 border-md-error/40',
    textClass:      'text-rose-300',
    icon: <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" />
  },
  pre_order: {
    label: 'Pre-Order',
    containerClass: 'bg-md-tertiary/20 border-md-tertiary/40',
    textClass:      'text-sky-300',
    icon: <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-400" />
  }
};

export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  isWinner = false,
  onOpenNotes,
  onViewDetail,
  onOrderDirect,
  onDirectCod,
  onShopeeRedirect
}) => {
  const stockConfig = STOCK_BADGES[product.stock_status] || STOCK_BADGES.in_stock;
  const isOutOfStock = product.stock_status === 'out_of_stock';
  const notesCount = product.merchant_notes?.length || 0;

  const handleDirectCod = () => {
    if (onOrderDirect) {
      onOrderDirect(product);
    } else if (onDirectCod) {
      onDirectCod(product);
    } else {
      onViewDetail?.(product);
    }
  };

  const handleShopee = () => {
    if (onShopeeRedirect) {
      onShopeeRedirect(product);
    } else {
      openRegionalMarketplace({ platform: 'shopee', webUrl: product.shopee_url });
    }
  };

  const handleTokopedia = () => {
    openRegionalMarketplace({ platform: 'tokopedia', webUrl: product.tokopedia_url });
  };

  // ── Category pill — contextual tonal surface ──────────────────────────────
  const catLower = product.category.toLowerCase();
  const categoryPillClass =
    catLower.includes('popper') || catLower.includes('aroma')
      ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
      : catLower.includes('pelumas') || catLower.includes('lubricant')
      ? 'bg-md-tertiary/20 text-sky-300 border-md-tertiary/40'
      : catLower.includes('kondom')
      ? 'bg-md-primary/15 text-emerald-300 border-md-primary/30'
      : 'bg-md-surface-container text-md-on-surface-variant border-md-outline-variant';

  return (
    <div
      className={`
        group relative flex flex-col justify-between overflow-hidden
        rounded-2xl transition-all duration-300 ease-out
        ${isWinner
          ? 'bg-[#111928] border-2 border-emerald-400 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-400/40'
          : 'bg-md-surface-container border border-md-outline-variant hover:bg-md-surface-container-high hover:border-emerald-500/40 shadow-card hover:shadow-card-hover hover:shadow-emerald-950/20'
        }
      `}
    >
      {/* ── Human UI Prompt 04: Pick the Winner Banner ─────────────────────── */}
      {isWinner && (
        <div className="absolute top-0 inset-x-0 z-20 py-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center shadow-md flex items-center justify-center gap-1.5">
          <Award className="w-3 h-3 text-emerald-100" />
          <span>★ #1 Pilihan Terlaris Medan</span>
        </div>
      )}

      {/* ── 1:1 Aspect Ratio Image Container with Liquid-Glass Badges ──────── */}
      <div
        onClick={() => onViewDetail?.(product)}
        className="relative aspect-square w-full overflow-hidden bg-md-surface-container-highest cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onViewDetail?.(product)}
        aria-label={`Lihat detail ${product.title}`}
      >
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-50' : ''
          }`}
        />

        {/* Top Badges (Offset down if winner banner active) */}
        <div className={`absolute left-2 right-2 flex items-center justify-between pointer-events-none transition-all ${
          isWinner ? 'top-7' : 'top-2'
        }`}>
          {/* Official Store Pill */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B0F19]/80 text-white border border-white/10 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
            <span>Official</span>
          </span>

          {/* Stock Status Badge */}
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-md
              text-[9px] font-bold uppercase tracking-wider
              backdrop-blur-md border shadow-sm
              ${stockConfig.containerClass} ${stockConfig.textClass}
            `}
          >
            {stockConfig.icon}
            <span>{stockConfig.label}</span>
          </span>
        </div>

        {/* Bottom Left Badges: COD Medan & Category */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 flex-wrap pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B0F19]/85 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
            <Zap className="w-2.5 h-2.5 fill-current text-emerald-400" />
            COD Medan
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-sm ${categoryPillClass}`}>
            {product.category}
          </span>
        </div>

        {/* Out of Stock Liquid Glass Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3">
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 border border-rose-500/40 rounded-full shadow-lg">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* ── Product Information Block (Prompt 05: Scale the Type) ───────────── */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* 2-line clamped title: Crisp normal weight */}
          <h3
            onClick={() => onViewDetail?.(product)}
            className="font-sans text-xs sm:text-sm font-normal text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-snug cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Trust chips: Quiet micro kickers */}
          <div className="flex items-center gap-1.5 overflow-hidden text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-extrabold uppercase tracking-wide whitespace-nowrap">
              Diskrit
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-white/5 font-bold uppercase tracking-wide whitespace-nowrap">
              Ori 100%
            </span>
          </div>

          {/* Price + Notes row: Dramatic jump in size & weight */}
          <div className="pt-1.5 flex items-baseline justify-between gap-1">
            <div className="flex items-baseline">
              <span className="text-xs font-bold text-emerald-400/80 mr-0.5">Rp</span>
              <span className="tabular-nums font-display font-black text-base sm:text-xl text-emerald-400 tracking-tight">
                {product.price.toLocaleString('id-ID')}
              </span>
            </div>
            {notesCount > 0 && onOpenNotes && (
              <button
                onClick={() => onOpenNotes(product)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-transform active:scale-95 cursor-pointer"
                title="Lihat Tips Merchant"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>{notesCount} Tips</span>
              </button>
            )}
          </div>

          {/* Social proof row: Quiet secondary text */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/60 border border-white/5 text-[11px] text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-current text-amber-400" />
              <span>4.9</span>
              <span className="text-slate-400 text-[10px] font-normal">• 50+ terjual</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
              <span className="truncate max-w-[75px] sm:max-w-none">Kota Medan</span>
            </div>
          </div>
        </div>

        {/* ── Action Controls (Prompt 04: Pick the Winner & Prompt 06: Give Color Meaning) ── */}
        <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
          {/* Primary Action Button: Dominates in size, weight, and color */}
          <button
            onClick={handleDirectCod}
            disabled={isOutOfStock}
            className="w-full min-h-[46px] sm:min-h-[48px] rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-display font-extrabold text-xs shadow-md shadow-emerald-950/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesan Cepat (COD)</span>
          </button>

          {/* Secondary Marketplace Row: Subdued ghost links to avoid competing with COD */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShopee}
              disabled={isOutOfStock}
              aria-label="Beli di Shopee"
              className="min-h-[38px] px-2 rounded-xl bg-slate-900/60 hover:bg-[#EE4D2D]/15 text-slate-400 hover:text-[#EE4D2D] border border-white/5 hover:border-[#EE4D2D]/30 transition-all active:scale-95 flex items-center justify-center gap-1 font-medium text-[11px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Shopee</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </button>

            <button
              onClick={handleTokopedia}
              disabled={isOutOfStock}
              aria-label="Beli di Tokopedia"
              className="min-h-[38px] px-2 rounded-xl bg-slate-900/60 hover:bg-[#03AC0E]/15 text-slate-400 hover:text-[#03AC0E] border border-white/5 hover:border-[#03AC0E]/30 transition-all active:scale-95 flex items-center justify-center gap-1 font-medium text-[11px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Tokopedia</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
