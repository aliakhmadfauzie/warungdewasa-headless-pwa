import React, { memo } from 'react';
import { Product, StockStatus } from '../lib/types';
import { openRegionalMarketplace } from '../lib/deepLinkResolver';
import { ExternalLink, Sparkles, CheckCircle2, AlertTriangle, XCircle, Clock, Truck, Star, MapPin, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenNotes: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  onOrderDirect?: (product: Product) => void;
}

const STOCK_BADGES: Record<StockStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  in_stock: {
    label: 'Ready',
    bg: 'bg-emerald-500/20 border-emerald-500/40',
    text: 'text-emerald-300',
    icon: <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
  },
  low_stock: {
    label: 'Stok Terbatas',
    bg: 'bg-amber-500/20 border-amber-500/40',
    text: 'text-amber-300',
    icon: <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
  },
  out_of_stock: {
    label: 'Habis',
    bg: 'bg-rose-500/20 border-rose-500/40',
    text: 'text-rose-300',
    icon: <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" />
  },
  pre_order: {
    label: 'Pre-Order',
    bg: 'bg-sky-500/20 border-sky-500/40',
    text: 'text-sky-300',
    icon: <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-400" />
  }
};

/**
 * PERFORMANCE: Module-level singleton — created once, never re-instantiated per render.
 */
const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export const ProductCard: React.FC<ProductCardProps> = memo(({ product, onOpenNotes, onViewDetail, onOrderDirect }) => {
  const stockInfo = STOCK_BADGES[product.stock_status] || STOCK_BADGES.in_stock;
  const notesCount = product.merchant_notes?.length || 0;

  // Contextual category pill gradient
  const catLower = product.category.toLowerCase();
  const categoryPillStyle =
    catLower.includes('popper') || catLower.includes('aroma')
      ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
      : catLower.includes('pelumas') || catLower.includes('lubricant')
      ? 'bg-sky-950/80 text-sky-300 border-sky-500/40'
      : catLower.includes('kondom')
      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
      : 'bg-slate-900/90 text-slate-300 border-slate-700/80';

  return (
    <div className="product-card-contain group relative card-gradient-surface rounded-2xl border border-slate-800/90 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl hover:shadow-emerald-950/20">

      {/* ─── Shopee Style 1:1 Aspect Ratio Thumbnail ─── */}
      <div
        onClick={() => onViewDetail && onViewDetail(product)}
        className="relative aspect-square w-full overflow-hidden bg-slate-900 cursor-pointer select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onViewDetail?.(product)}
        aria-label={`Lihat detail ${product.title}`}
      >
        <img
          src={product.image_url}
          alt={product.title}
          width={320}
          height={320}
          decoding="async"
          loading="lazy"
          fetchPriority="low"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1524]/90 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Shopee Mall / Official Shop Ribbon (Top-Left) */}
        <div className="absolute top-0 left-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black uppercase tracking-wider rounded-br-xl shadow-md">
            <ShieldCheck className="w-3 h-3 text-emerald-200" />
            <span>Official</span>
          </span>
        </div>

        {/* Stock Status Badge (Top-Right) */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md shadow-xs ${stockInfo.bg} ${stockInfo.text}`}
          >
            {stockInfo.icon}
            <span>{stockInfo.label}</span>
          </span>
        </div>

        {/* Shopee COD / Category Overlay Ribbon (Bottom-Left) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EE4D2D] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
            COD
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-xs ${categoryPillStyle}`}>
            {product.category}
          </span>
        </div>
      </div>

      {/* ─── Shopee Style Product Information Block ─── */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* 2-Line Product Title */}
          <h3
            onClick={() => onViewDetail && onViewDetail(product)}
            className="font-display text-xs sm:text-[13px] font-bold dark:text-slate-100 text-slate-900 group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Shopee Trust / Benefit Chips */}
          <div className="flex items-center gap-1.5 overflow-hidden text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold whitespace-nowrap">
              Privasi Aman
            </span>
            <span className="px-1.5 py-0.5 rounded dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 dark:border-slate-700/60 border-slate-300 font-semibold whitespace-nowrap">
              Ori 100%
            </span>
          </div>

          {/* Shopee Price Display */}
          <div className="pt-1 flex items-baseline justify-between gap-1">
            <div className="font-display font-black text-sm sm:text-base text-emerald-600 dark:text-emerald-400 tracking-tight">
              {rupiahFormatter.format(product.price)}
            </div>
            {notesCount > 0 && (
              <button
                onClick={() => onOpenNotes(product)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                title="Lihat Tips Merchant"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400" />
                <span>{notesCount} Tips</span>
              </button>
            )}
          </div>

          {/* Shopee Social Proof: Rating, Sold Count & Location Tag */}
          <div className="flex items-center justify-between text-[10px] dark:text-slate-400 text-slate-500 pt-0.5">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold dark:text-slate-200 text-slate-800">4.9</span>
              <span className="dark:text-slate-500 text-slate-400">• Terjual 50+</span>
            </div>
            <div className="flex items-center gap-1 dark:text-slate-400 text-slate-500 font-medium">
              <MapPin className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
              <span className="truncate max-w-[75px] sm:max-w-none">Kota Medan</span>
            </div>
          </div>
        </div>

        {/* ─── Shopee Style Action Buttons ─── */}
        <div className="pt-2.5 border-t dark:border-slate-800/80 border-slate-200 flex flex-col gap-2">
          {onOrderDirect && (
            <button
              onClick={() => onOrderDirect(product)}
              disabled={product.stock_status === 'out_of_stock'}
              className="w-full min-h-[38px] sm:min-h-[40px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl btn-gradient-emerald text-white font-bold text-xs shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Truck className="w-3.5 h-3.5 shrink-0 text-emerald-100" />
              <span className="truncate">Pesan Langsung / COD</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => openRegionalMarketplace({ platform: 'shopee', webUrl: product.shopee_url })}
              disabled={product.stock_status === 'out_of_stock'}
              className="min-h-[34px] sm:min-h-[36px] flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#EE4D2D]/15 hover:bg-[#EE4D2D]/25 active:bg-[#EE4D2D]/35 text-[#FF5722] border border-[#EE4D2D]/40 font-bold text-[11px] sm:text-xs transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs group/shopee cursor-pointer"
            >
              <span className="font-display">Shopee</span>
              <ExternalLink className="w-3 h-3 text-[#FF5722] group-hover/shopee:translate-x-0.5 group-hover/shopee:-translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => openRegionalMarketplace({ platform: 'tokopedia', webUrl: product.tokopedia_url })}
              disabled={product.stock_status === 'out_of_stock'}
              className="min-h-[34px] sm:min-h-[36px] flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#03AC0E]/15 hover:bg-[#03AC0E]/25 active:bg-[#03AC0E]/35 text-[#00AA5B] border border-[#00AA5B]/40 font-bold text-[11px] sm:text-xs transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs group/tokopedia cursor-pointer"
            >
              <span className="font-display">Tokopedia</span>
              <ExternalLink className="w-3 h-3 text-[#00AA5B] group-hover/tokopedia:translate-x-0.5 group-hover/tokopedia:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
