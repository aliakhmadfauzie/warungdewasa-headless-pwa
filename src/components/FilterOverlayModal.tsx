import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, ArrowUpDown } from 'lucide-react';

export type SortOption = 'default' | 'popular' | 'latest' | 'price-asc' | 'price-desc' | 'name-asc';

interface FilterOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStockStatus: string;
  onSelectStockStatus: (status: string) => void;
  sortBy: SortOption;
  onSelectSortBy: (sort: SortOption) => void;
  totalFilteredCount: number;
  totalProductsCount: number;
  onResetFilters: () => void;
  categoryCounts: Record<string, number>;
}

export const FilterOverlayModal: React.FC<FilterOverlayModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedStockStatus,
  onSelectStockStatus,
  sortBy,
  onSelectSortBy,
  totalFilteredCount,
  totalProductsCount,
  onResetFilters,
  categoryCounts
}) => {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasActiveFilters = selectedCategory !== 'Semua' || selectedStockStatus !== 'all' || sortBy !== 'default';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-end justify-center sm:justify-end sm:p-6 bg-black/40 backdrop-blur-[2px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Filter dan Urutkan Produk"
    >
      {/* Click backdrop to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Compact Floating Filter Card */}
      <div className="relative w-full sm:w-[380px] bg-[#111827] border border-slate-700/80 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[60vh] sm:max-h-[500px] z-10 animate-slide-up sm:mb-20">
        {/* Top Mini Drag Handle (Mobile) */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mt-2 sm:hidden" />

        {/* Compact Header */}
        <div className="px-4 py-3 border-b border-slate-800 bg-[#111827] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white leading-none">
                Filter & Urutkan
              </h3>
              <span className="text-[10px] text-slate-400">
                {totalFilteredCount} dari {totalProductsCount} produk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Scrollable Body */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-4 scrollbar-thin">
          {/* 1. Category Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300 uppercase tracking-wider">
                Kategori
              </span>
              <span className="text-slate-400 font-medium">
                {selectedCategory}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : 'bg-[#0B0F19] text-slate-300 hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium ${
                        isSelected
                          ? 'bg-emerald-700/80 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Stock Status Pills */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Ketersediaan Stok
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: 'Semua Stok' },
                { id: 'in_stock', label: '🟢 Ready Stock' },
                { id: 'low_stock', label: '🟡 Stok Terbatas' },
                { id: 'pre_order', label: '🔵 Pre-Order' }
              ].map((st) => {
                const isSelected = selectedStockStatus === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => onSelectStockStatus(st.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500 ring-1 ring-emerald-500/50 font-bold'
                        : 'bg-[#0B0F19] text-slate-300 hover:bg-slate-800 border-slate-700/70'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Sort Options */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              <ArrowUpDown className="w-3 h-3 text-emerald-400" />
              <span>Urutan Produk</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'default', label: 'Terkait / Rekomendasi Default' },
                { id: 'popular', label: '🔥 Terlaris / Rekomendasi Merchant' },
                { id: 'latest', label: '✨ Produk Terbaru' },
                { id: 'price-asc', label: 'Harga: Termurah ke Termahal' },
                { id: 'price-desc', label: 'Harga: Termahal ke Termurah' },
                { id: 'name-asc', label: 'Nama: A ke Z' }
              ].map((s) => {
                const isSelected = sortBy === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectSortBy(s.id as SortOption)}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-emerald-400 border-emerald-500/80 font-bold'
                        : 'bg-[#0B0F19] text-slate-300 hover:bg-slate-800 border-slate-700/70'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-[#111827] flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400">
            <strong>{totalFilteredCount}</strong> hasil cocok
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};
