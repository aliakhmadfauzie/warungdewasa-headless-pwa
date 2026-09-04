import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, StockStatus } from '../lib/types';
import { openRegionalMarketplace } from '../lib/deepLinkResolver';
import { PaymentMethodsShortcutModal } from './PaymentMethodsShortcutModal';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Tag, 
  MessageCircle, 
  Info,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CreditCard
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  products?: Product[];
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  onRequestSpecial?: () => void;
  onOrderDirect?: (product: Product) => void;
  onOpenPaymentMethods?: () => void;
}

const STOCK_BADGES: Record<StockStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  in_stock: {
    label: 'Ready Stock',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
  },
  low_stock: {
    label: 'Stok Terbatas',
    bg: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
  },
  out_of_stock: {
    label: 'Stok Habis',
    bg: 'bg-rose-500/10 border-rose-500/30',
    text: 'text-rose-400',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />
  },
  pre_order: {
    label: 'Pre-Order',
    bg: 'bg-sky-500/10 border-sky-500/30',
    text: 'text-sky-400',
    icon: <Clock className="w-3.5 h-3.5 text-sky-400" />
  }
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0
  })
};

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  products = [],
  onClose,
  onSelectProduct,
  onRequestSpecial,
  onOrderDirect,
  onOpenPaymentMethods
}) => {
  const [slideDirection, setSlideDirection] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Find index of active product in current product list
  const currentIndex = products.findIndex((p) => p.id === product?.id);
  const hasMultipleProducts = products.length > 1;

  const handlePrevProduct = () => {
    if (!hasMultipleProducts || !onSelectProduct) return;
    setSlideDirection(-1);
    const prevIdx = (currentIndex - 1 + products.length) % products.length;
    onSelectProduct(products[prevIdx]);
  };

  const handleNextProduct = () => {
    if (!hasMultipleProducts || !onSelectProduct) return;
    setSlideDirection(1);
    const nextIdx = (currentIndex + 1) % products.length;
    onSelectProduct(products[nextIdx]);
  };

  useEffect(() => {
    if (!product) return;

    // Handle Keyboard keys (Escape, ArrowLeft, ArrowRight)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevProduct();
      } else if (e.key === 'ArrowRight') {
        handleNextProduct();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, currentIndex, products, onClose]);

  if (!product) return null;

  const stockInfo = STOCK_BADGES[product.stock_status] || STOCK_BADGES.in_stock;
  const notes = product.merchant_notes || [];

  const formatRupiah = (val: number) => rupiahFormatter.format(val);

  const shareText = encodeURIComponent(
    `Halo Admin, saya tertarik dengan produk ${product.title} (Harga: ${formatRupiah(product.price)}). Apakah masih tersedia?`
  );
  const waUrl = `https://wa.me/6281234567890?text=${shareText}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      {/* Click backdrop to dismiss with smooth fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Side Chevron Navigation (Desktop & Tablet) */}
      {hasMultipleProducts && (
        <>
          <button
            onClick={handlePrevProduct}
            aria-label="Lihat Produk Sebelumnya (Panah Kiri)"
            className="hidden md:flex fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" />
          </button>

          <button
            onClick={handleNextProduct}
            aria-label="Lihat Produk Selanjutnya (Panah Kanan)"
            className="hidden md:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group"
          >
            <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" />
          </button>
        </>
      )}

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={springTransition}
        className="relative w-full sm:max-w-2xl bg-[#111827] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] z-10"
      >
        {/* Top Handle Indicator (Mobile) */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header with Index Indicator & Quick Next/Prev */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-[#111827] flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 text-xs">
            <span className="text-emerald-400 font-semibold">{product.category}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{currentIndex + 1} dari {products.length} SKU</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Small Top Payment Methods Shortcut Button on Product Detail Screen */}
            <button
              onClick={() => onOpenPaymentMethods ? onOpenPaymentMethods() : setIsPaymentModalOpen(true)}
              title="Informasi Metode Pembayaran & Rekening Resmi"
              aria-label="Metode Pembayaran Resmi"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-emerald-400 border border-slate-700/80 transition-all active:scale-95 cursor-pointer shadow-xs mr-0.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xs:inline text-[11px]">Metode Bayar</span>
            </button>

            {hasMultipleProducts && (
              <div className="flex items-center gap-1 sm:hidden mr-1">
                <button
                  onClick={handlePrevProduct}
                  aria-label="Produk Sebelumnya"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextProduct}
                  aria-label="Produk Selanjutnya"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
            onClick={onClose}
            aria-label="Tutup Detail Produk"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          </div>
        </div>

        {/* Swipeable & Scrollable Content Body */}
        <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
          <motion.div
            key={product.id}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          transition={{ x: { type: 'spring', stiffness: 320, damping: 28 }, opacity: { duration: 0.2 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) {
              handleNextProduct();
            } else if (info.offset.x > 60) {
              handlePrevProduct();
            }
          }}
          className="p-5 sm:p-6 overflow-y-auto space-y-6 touch-pan-y"
        >
          {/* Top Section: Image + Title + Price */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            {/* Image Preview Container with Shared Element */}
            <div className="relative w-full sm:w-64 aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 select-none">
              <motion.img
                transition={springTransition}
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute top-3 left-3">
                <motion.span
                  transition={springTransition}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${stockInfo.bg} ${stockInfo.text}`}
                >
                  {stockInfo.icon}
                  <span>{stockInfo.label}</span>
                </motion.span>
              </div>
            </div>

            {/* Title & Price Information with Shared Element */}
            <div className="flex-1 space-y-3">
              <motion.h2
                transition={springTransition}
                id="modal-product-title"
                className="font-display text-lg sm:text-xl font-bold text-white leading-snug"
              >
                {product.title}
              </motion.h2>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Harga Resmi Distributor
                </span>
                <div className="text-2xl sm:text-3xl font-black font-display text-emerald-400 tracking-tight tabular-nums">
                  {formatRupiah(product.price)}
                </div>
              </div>

              {/* Quality Guarantee Tags */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Produk Original</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <Lock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Privasi Pengiriman Rapi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description Section */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deskripsi Lengkap Produk</span>
            </h4>
            <div className="p-4 rounded-2xl bg-[#0B0F19] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              <p>{product.description}</p>
              <p className="text-slate-400 text-xs">
                Formula resmi terverifikasi dengan standar higienis tinggi. Dikemas dalam kardus polos bersegel rapat tanpa tulisan dewasa untuk menjaga privasi Anda.
              </p>
            </div>
          </div>

          {/* Merchant Tips / Notes if available */}
          {notes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tips &amp; Catatan Rekomendasi Merchant ({notes.length})</span>
              </h4>
              <div className="space-y-2.5">
                {notes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="uppercase">
                      {note.note_type === 'usage_tip' ? '💡 Tips Penggunaan' : note.note_type === 'personal_review' ? '⭐ Review Personal' : '📌 Rekomendasi Merchant'}
                    </span>
                    <span>{new Date(note.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                    <p className="text-slate-200 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Seller & Marketplace Checkout Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-[#0B0F19] border border-slate-700/80 space-y-3.5">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Pilihan Transaksi &amp; Checkout:</span>
              <span className="text-[11px] text-emerald-400 font-semibold">Bisa COD Medan / Online</span>
            </div>

            {/* Direct Order Button (Primary: Dominates in size, weight & emerald color) */}
            {onOrderDirect && (
              <button
                onClick={() => {
                  onClose();
                  onOrderDirect(product);
                }}
                disabled={product.stock_status === 'out_of_stock'}
                className="w-full min-h-[48px] sm:min-h-[52px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-display font-extrabold text-sm transition-all shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-40"
              >
                <Truck className="w-4 h-4" />
                <span>Pesan Cepat (Bisa COD Area Medan)</span>
              </button>
            )}

            {/* Secondary Marketplace Buttons: Subdued quiet rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => openRegionalMarketplace({ platform: 'shopee', webUrl: product.shopee_url })}
                disabled={product.stock_status === 'out_of_stock'}
                className="min-h-[42px] flex items-center justify-center gap-2 px-4 rounded-xl bg-slate-900/70 text-slate-300 border border-white/10 hover:border-[#EE4D2D]/40 hover:text-[#EE4D2D] text-xs font-medium transition-colors disabled:opacity-40"
              >
                <span>Beli di Shopee</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => openRegionalMarketplace({ platform: 'tokopedia', webUrl: product.tokopedia_url })}
                disabled={product.stock_status === 'out_of_stock'}
                className="min-h-[42px] flex items-center justify-center gap-2 px-4 rounded-xl bg-slate-900/70 text-slate-300 border border-white/10 hover:border-[#03AC0E]/40 hover:text-[#03AC0E] text-xs font-medium transition-colors disabled:opacity-40"
              >
                <span>Beli di Tokopedia</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>
        </motion.div>
        </AnimatePresence>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-[#111827] flex items-center justify-between gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Tanya Admin via WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </motion.div>

      {/* Payment Methods Shortcut Quick Reference Modal */}
      <PaymentMethodsShortcutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
};
