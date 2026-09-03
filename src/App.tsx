import { useState, useEffect, useMemo, useDeferredValue, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Product, SpecialRequest } from './lib/types';
import { api } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { MerchantNotesModal } from './components/MerchantNotesModal';
import { SpecialRequestModal } from './components/SpecialRequestModal';
import { InstallPromptBanner } from './components/InstallPromptBanner';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FilterOverlayModal, SortOption } from './components/FilterOverlayModal';
import { DirectOrderModal } from './components/DirectOrderModal';
import { PaymentMethodsShortcutModal } from './components/PaymentMethodsShortcutModal';
import { HeroMotion } from './components/HeroMotion';
import { OrchestratedWebGLBackground } from './components/OrchestratedWebGLBackground';
import { Search, Layers, SlidersHorizontal, Flame, TrendingUp, Sparkles, ArrowUpDown } from 'lucide-react';

// PERFORMANCE: AdminDashboard is code-split into its own lazy chunk.
// Admin code (~50KB+) is never downloaded by anonymous store visitors.
const AdminDashboard = lazy(() =>
  import('./admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
import { AdminLoginForm } from './admin/AdminLoginForm';

/** Minimal skeleton shown while AdminDashboard chunk loads */
const AdminLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700" />
    <div className="h-3 w-40 rounded-full bg-slate-800" />
    <div className="h-2 w-24 rounded-full bg-slate-800/60" />
  </div>
);

export function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  // Authentication state persisted via localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('authUser') === 'true');
  const login = () => {
    localStorage.setItem('authUser', 'true');
    setIsAuthenticated(true);
    setCurrentView('admin');
  };
  const logout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    setCurrentView('store');
  };
  // Age verification persisted via localStorage
  const [ageVerified, setAgeVerified] = useState<boolean>(() => localStorage.getItem('ageVerified') === 'true');
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<SpecialRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Modals & Overlay
  const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForNotes, setSelectedProductForNotes] = useState<Product | null>(null);
  const [selectedProductForDirectOrder, setSelectedProductForDirectOrder] = useState<Product | null>(null);
  const [isSpecialRequestOpen, setIsSpecialRequestOpen] = useState(false);
  const [isPaymentShortcutOpen, setIsPaymentShortcutOpen] = useState(false);

  const [showFab, setShowFab] = useState(false);

  // Scroll-aware FAB — only show after scrolling past hero (~300px)
  useEffect(() => {
    const handleFabScroll = () => setShowFab(window.scrollY > 300);
    window.addEventListener('scroll', handleFabScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleFabScroll);
  }, []);

  // Centralized Body Scroll Lock Management:
  // Prevents competing modal lifecycle hooks from permanently locking body overflow
  const isAnyModalOpen = Boolean(
    isFilterOverlayOpen ||
    selectedProductForDetail ||
    selectedProductForNotes ||
    selectedProductForDirectOrder ||
    isSpecialRequestOpen ||
    isPaymentShortcutOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedRequests] = await Promise.all([
        api.getProducts(),
        api.getSpecialRequests()
      ]);
      setProducts(fetchedProducts);
      setRequests(fetchedRequests);
    } catch {
      console.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    return ['Semua', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  // Compute item counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Semua': products.length
    };
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchesStock = selectedStockStatus === 'all' || p.stock_status === selectedStockStatus;
      const query = deferredSearchQuery.toLowerCase().trim();
      const matchesQuery = !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.merchant_notes && p.merchant_notes.some(n => n.content.toLowerCase().includes(query)));
      return matchesCategory && matchesStock && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => {
        if (a.stock_status === 'in_stock' && b.stock_status !== 'in_stock') return -1;
        if (b.stock_status === 'in_stock' && a.stock_status !== 'in_stock') return 1;
        return (b.merchant_notes?.length || 0) - (a.merchant_notes?.length || 0);
      });
    } else if (sortBy === 'latest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, selectedCategory, selectedStockStatus, deferredSearchQuery, sortBy]);

  // PERFORMANCE: Progressive batch rendering.
  // Mounting 120+ complex product cards simultaneously on startup creates ~1500ms of long tasks in React.
  // Rendering 16 cards initially and revealing more upon request drops initial React work by ~85%.
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    setVisibleCount(16);
  }, [selectedCategory, selectedStockStatus, deferredSearchQuery, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMoreProducts = visibleCount < filteredProducts.length;
  const remainingCount = filteredProducts.length - visibleCount;

  const activeFiltersCount = (selectedCategory !== 'Semua' ? 1 : 0) + 
    (selectedStockStatus !== 'all' ? 1 : 0) + 
    (sortBy !== 'default' ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedStockStatus('all');
    setSortBy('default');
    setVisibleCount(16);
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen dark:bg-[#090D16] bg-[#F4F6F9] dark:text-slate-100 text-slate-900 flex flex-col selection:bg-emerald-600 selection:text-white relative">
      {/* 3-Layer Architecture Layer 1: Background WebGL Salt Crystal Mesh & Scroll Bridge */}
      <OrchestratedWebGLBackground />

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onRequestOpen={() => setIsSpecialRequestOpen(true)}
        onOpenPaymentMethods={() => setIsPaymentShortcutOpen(true)}
        requestCount={pendingRequestsCount}
        isAuthenticated={isAuthenticated}
        login={login}
        logout={logout}
      />

      {/* Main Content Area (Offset for Edge-to-Edge Floating Header with FAB clearance) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-32 sm:pb-36">
        {currentView === 'store' ? (
          <div className="space-y-12 animate-fade-in">
            {/* GSAP Split Typography, Floating Particle Parallax & Magnetic CTA Hero */}
            <HeroMotion
              totalCatalogCount={products.length}
              onExploreClick={() => {
                const el = document.getElementById('catalog-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onRequestSpecialClick={() => setIsSpecialRequestOpen(true)}
              onOpenFilterClick={() => setIsFilterOverlayOpen(true)}
            />

            {/* Filter & Search Bar - High Contrast Clean Surfaces */}
            <div id="catalog-grid" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl dark:bg-[#111827] bg-white dark:border-slate-800 border-slate-200 shadow-sm">
              {/* Search Bar with Quick Clear */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk, pelumas, kondom, poppers, atau tips..."
                  className="w-full min-h-[44px] pl-10 pr-10 py-2.5 sm:py-2 rounded-xl dark:bg-slate-900 bg-slate-50 dark:border-slate-700/70 border-slate-300 text-sm sm:text-xs dark:text-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus Pencarian"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold font-mono">✕</span>
                  </button>
                )}
              </div>

              {/* Action Buttons: Filter & Quick Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
                {/* On-Screen Filter Modal Trigger Button */}
                <button
                  onClick={() => setIsFilterOverlayOpen(true)}
                  className={`inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer shrink-0 ${
                    activeFiltersCount > 0
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/50 shadow-xs'
                      : 'dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-200 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:border-slate-700/70 border-slate-300'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>Filter</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Category Filter Chips (Dynamic, no hard truncation, soft emerald active highlight) */}
                {categories.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-[0.97] cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                          : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-200 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-200 dark:hover:text-white hover:text-slate-900 dark:border-slate-700/70 border-slate-300'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected 
                          ? 'bg-emerald-700 text-white' 
                          : 'dark:bg-slate-700/90 bg-slate-200 dark:text-slate-300 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shopee-style Quick Sort & Arrangement Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl dark:bg-[#111827] bg-white dark:border-slate-800 border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-600 font-bold overflow-x-auto scrollbar-none no-scrollbar">
                <span className="hidden sm:inline dark:text-slate-400 text-slate-600 font-semibold uppercase text-[11px] tracking-wider pr-1">
                  Urutkan:
                </span>

                <button
                  onClick={() => setSortBy('default')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                    sortBy === 'default'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
                      : 'dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 border dark:border-slate-700/60 border-slate-300'
                  }`}
                >
                  Terkait
                </button>

                <button
                  onClick={() => setSortBy('popular')}
                  className={`min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                    sortBy === 'popular'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
                      : 'dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 border dark:border-slate-700/60 border-slate-300'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>Terlaris</span>
                </button>

                <button
                  onClick={() => setSortBy('latest')}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                    sortBy === 'latest'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
                      : 'dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 border dark:border-slate-700/60 border-slate-300'
                  }`}
                >
                  Terbaru
                </button>

                <button
                  onClick={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}
                  className={`min-h-[38px] inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                    sortBy === 'price-asc' || sortBy === 'price-desc'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
                      : 'dark:bg-slate-800/80 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 border dark:border-slate-700/60 border-slate-300'
                  }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>{sortBy === 'price-asc' ? 'Harga Terendah' : sortBy === 'price-desc' ? 'Harga Tertinggi' : 'Harga'}</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold dark:text-slate-400 text-slate-600">
                <span>{filteredProducts.length} Produk</span>
              </div>
            </div>

            {/* Active Filters Bar (when filtered) */}
            {(searchQuery || selectedCategory !== 'Semua' || selectedStockStatus !== 'all' || sortBy !== 'default') && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs dark:text-slate-400 text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Menampilkan <strong>{filteredProducts.length}</strong> dari {products.length} produk</span>
                  {selectedCategory !== 'Semua' && (
                    <span className="px-2 py-0.5 rounded-md dark:bg-slate-800 bg-slate-200 text-emerald-700 dark:text-emerald-300 font-medium dark:border-slate-700 border-slate-300">
                      Kategori: {selectedCategory}
                    </span>
                  )}
                  {selectedStockStatus !== 'all' && (
                    <span className="px-2 py-0.5 rounded-md dark:bg-slate-800 bg-slate-200 text-emerald-700 dark:text-emerald-300 font-medium dark:border-slate-700 border-slate-300">
                      Stok: {selectedStockStatus}
                    </span>
                  )}
                  {sortBy !== 'default' && (
                    <span className="px-2 py-0.5 rounded-md dark:bg-slate-800 bg-slate-200 text-emerald-700 dark:text-emerald-300 font-medium dark:border-slate-700 border-slate-300">
                      Urutan: {sortBy}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2 py-0.5 rounded-md dark:bg-slate-800 bg-slate-200 dark:text-slate-200 text-slate-800 font-medium dark:border-slate-700 border-slate-300">
                      Query: &quot;{searchQuery}&quot;
                    </span>
                  )}
                </div>
                <button
                  onClick={resetAllFilters}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}

            {/* Shopee-style Section Header: Daily Discover / Rekomendasi */}
            <div className="flex items-center justify-between pt-2 pb-1 border-b dark:border-slate-800/80 border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-500">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="font-display text-sm sm:text-base font-extrabold tracking-tight dark:text-white text-slate-900 uppercase">
                  Rekomendasi Pilihan
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-md">
                  100% Produk Terverifikasi
                </span>
              </div>
              <div className="text-xs dark:text-slate-400 text-slate-600 font-medium">
                {displayedProducts.length} dari {filteredProducts.length} SKU
              </div>
            </div>

            {/* Product Grid — Shopee 2-Col Mobile & 5-Col Desktop */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div 
                    key={n} 
                    className="aspect-[3/4] rounded-2xl bg-[#161F30] border border-slate-800 animate-pulse" 
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#161F30] border border-slate-800 rounded-3xl space-y-5 shadow-lg max-w-lg mx-auto p-8 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/90 flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                  <Layers className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-bold text-white">Tidak ada produk yang cocok</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Kami tidak menemukan produk untuk kata kunci atau kombinasi filter yang Anda pilih. Anda dapat mereset filter atau mengajukan permintaan khusus ke distributor.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={resetAllFilters}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors active:scale-95 cursor-pointer"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setIsSpecialRequestOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-colors active:scale-95 cursor-pointer"
                  >
                    Request Produk Khusus
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenNotes={(p) => setSelectedProductForNotes(p)}
                      onViewDetail={(p) => setSelectedProductForDetail(p)}
                      onOrderDirect={(p) => setSelectedProductForDirectOrder(p)}
                    />
                  ))}
                </div>

                {/* Progressive Batch Reveal Button */}
                {hasMoreProducts && (
                  <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 16)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#161F30] hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-display font-bold text-xs sm:text-sm border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-950/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Muat Lebih Banyak ({remainingCount > 16 ? 16 : remainingCount} dari {remainingCount} tersisa)</span>
                    </button>
                    <span className="text-[11px] text-slate-500">
                      Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : isAuthenticated ? (
          <div className="animate-fade-in">
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminDashboard
                products={products}
                requests={requests}
                onRefresh={loadData}
                onLogout={logout}
                onBackToStore={() => setCurrentView('store')}
              />
            </Suspense>
          </div>
        ) : (
          <div className="animate-fade-in">
            <AdminLoginForm
              onLoginSuccess={login}
              onBackToStore={() => setCurrentView('store')}
            />
          </div>
        )}
      </main>

      {/* Floating Filter FAB — only visible after scrolling past hero (>300px) */}
      {currentView === 'store' && showFab && (
        <div className="fixed bottom-6 right-6 z-40 md:hidden animate-fade-in">
          <button
            onClick={() => setIsFilterOverlayOpen(true)}
            aria-label="Buka Filter dan Kategori"
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-[#111827]/95 hover:bg-[#111827] text-white border border-slate-700 hover:border-emerald-500/80 shadow-2xl backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {/* Glow background on active filters */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            <div className="relative p-1.5 rounded-full bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col text-left">
              <span className="font-display text-[11px] font-bold tracking-tight text-white leading-tight">
                Filter & Kategori
              </span>
              <span className="text-[9px] text-slate-400">
                {filteredProducts.length} Produk
              </span>
            </div>

            {activeFiltersCount > 0 && (
              <span className="ml-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Footer with Official Branding */}
      <footer className="mt-auto border-t dark:border-slate-800 border-slate-200 dark:bg-[#0B0F19] bg-white py-6 text-center text-xs dark:text-slate-400 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-medium">© {new Date().getFullYear()} Warung Dewasa Abang Dugem. Official Store & Layanan COD Medan.</span>
          </div>
          <div className="flex items-center gap-4 dark:text-slate-400 text-slate-500 font-medium">
            <span>Direct Deep Links: Shopee & Tokopedia</span>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('admin')} 
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold transition-colors cursor-pointer"
            >
              Merchant Panel
            </button>
          </div>
        </div>
      </footer>

      {/* Filter Overlay Modal */}
      <FilterOverlayModal
        isOpen={isFilterOverlayOpen}
        onClose={() => setIsFilterOverlayOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStockStatus={selectedStockStatus}
        onSelectStockStatus={setSelectedStockStatus}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        totalFilteredCount={filteredProducts.length}
        totalProductsCount={products.length}
        onResetFilters={resetAllFilters}
        categoryCounts={categoryCounts}
      />

      {/* Product Detail & Description Modal with Left/Right Slide & Swipe Navigation */}
      <AnimatePresence>
        {selectedProductForDetail && (
          <ProductDetailModal
            product={selectedProductForDetail}
            products={filteredProducts}
            onClose={() => setSelectedProductForDetail(null)}
            onSelectProduct={(p) => setSelectedProductForDetail(p)}
            onRequestSpecial={() => {
              setSelectedProductForDetail(null);
              setIsSpecialRequestOpen(true);
            }}
            onOrderDirect={(p) => {
              setSelectedProductForDetail(null);
              setSelectedProductForDirectOrder(p);
            }}
          />
        )}
      </AnimatePresence>

      {/* Direct with Seller & COD Modal with Free OpenStreetMap Autocomplete */}
      <DirectOrderModal
        product={selectedProductForDirectOrder}
        isOpen={Boolean(selectedProductForDirectOrder)}
        onClose={() => setSelectedProductForDirectOrder(null)}
        onOrderSuccess={loadData}
      />

      {/* Payment Methods & Official Accounts Quick Reference Modal */}
      <PaymentMethodsShortcutModal
        isOpen={isPaymentShortcutOpen}
        onClose={() => setIsPaymentShortcutOpen(false)}
      />

      {/* Modals & Banners */}
      <MerchantNotesModal
        product={selectedProductForNotes}
        onClose={() => setSelectedProductForNotes(null)}
      />

      <SpecialRequestModal
        isOpen={isSpecialRequestOpen}
        onClose={() => setIsSpecialRequestOpen(false)}
        onSuccess={loadData}
      />

      <InstallPromptBanner />
    </div>
  );
}


