import React, { useState, useEffect } from 'react';
import { Product, SpecialRequest, DirectOrder } from '../lib/types';
import { ProductManager } from './ProductManager';
import { RequestInbox } from './RequestInbox';
import { NotesManager } from './NotesManager';
import { DirectOrderManager } from './DirectOrderManager';
import { ThemeEditor } from './ThemeEditor';
import { isSupabaseConfigured, api } from '../lib/supabase';
import { Package, AlertCircle, CheckCircle2, Clock, Database, Sparkles, Truck, LogOut, ShieldCheck, Store, Palette } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  requests: SpecialRequest[];
  onRefresh: () => void;
  onLogout?: () => void;
  onBackToStore?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  requests,
  onRefresh,
  onLogout,
  onBackToStore
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'direct_orders' | 'requests' | 'settings' | 'studio'>('products');
  const [selectedProductForNotes, setSelectedProductForNotes] = useState<Product | null>(null);
  const [directOrders, setDirectOrders] = useState<DirectOrder[]>([]);

  const loadDirectOrders = async () => {
    try {
      const data = await api.getDirectOrders();
      setDirectOrders(data);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    loadDirectOrders();
  }, []);

  const totalProducts = products.length;
  const inStock = products.filter(p => p.stock_status === 'in_stock').length;
  const lowStock = products.filter(p => p.stock_status === 'low_stock').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const pendingDirectOrders = directOrders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Admin Header — surfaceContainerHigh panel, md-* semantic tokens */}
      <div className="p-4 sm:p-5 rounded-m3-lg bg-md-surface-container-high border border-md-outline-variant shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-m3-md bg-md-primary/10 border border-md-primary/30 text-md-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-base sm:text-lg font-extrabold text-md-on-surface tracking-tight">
                Warung Dewasa Merchant Hub
              </h1>
              {/* Admin Aktif badge — primaryContainer tonal chip */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase bg-md-primary-container text-md-on-primary-container border border-md-primary/20 rounded-m3-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-md-primary animate-pulse" />
                Admin Aktif
              </span>
            </div>
            <p className="text-xs text-md-on-surface-variant">
              Pengelolaan Katalog, Pesanan COD Medan & Request Khusus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onBackToStore && (
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-m3-md bg-md-surface-container-highest hover:bg-md-surface-container text-md-on-surface-variant hover:text-md-on-surface border border-md-outline-variant text-xs font-bold transition-colors ease-m3-expressive-fast duration-m3-fast active:scale-95 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-md-primary" />
              <span>Lihat Toko</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-m3-md bg-md-error/10 hover:bg-md-error/20 text-md-error border border-md-error/30 text-xs font-bold transition-colors ease-m3-expressive-fast duration-m3-fast active:scale-95 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
      {/* ── Enhanced Bento-Box KPI Layout ────────────────────────────────────
           Asymmetric priority layout:
           - Large hero tile (col-span-1 sm:col-span-2): Urgent operational action (COD orders)
             with subtle gradient glow, icon frame, and micro-pulsing badge
           - Supporting metrics with distinct semantic accent containers
      ────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Urgent Action Bento: Direct Orders (Spans 2 cols on mobile/tablet if pending orders exist) */}
        <div
          onClick={() => setActiveTab('direct_orders')}
          className="col-span-1 sm:col-span-2 relative p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#161F30] border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 shadow-card cursor-pointer group flex flex-col justify-between overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Truck className="w-6 h-6" />
            </div>
            {pendingDirectOrders > 0 ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-amber-400 text-slate-950 font-black rounded-full shadow-md animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                {pendingDirectOrders} Perlu Dikirim
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Semua Terkirim
              </span>
            )}
          </div>

          <div className="mt-4">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Pesanan COD & Kurir Medan
            </span>
            <div className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5 flex items-baseline gap-2">
              <span className="tabular-nums">{directOrders.length}</span>
              <span className="text-xs text-emerald-400/90 font-medium">pesanan aktif</span>
            </div>
          </div>
        </div>

        {/* Ready Stock */}
        <div className="p-5 rounded-2xl bg-surface-1 border border-white/5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-teal-400/80 font-bold px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
              {totalProducts > 0 ? Math.round((inStock / totalProducts) * 100) : 0}% Siap Kirim
            </span>
          </div>
          <div className="mt-4">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Ready Stock
            </span>
            <div className="font-display text-2xl sm:text-3xl font-black text-teal-400 mt-0.5 flex items-baseline gap-1.5">
              <span className="tabular-nums">{inStock}</span>
              <span className="text-xs text-slate-400 font-normal">/ {totalProducts} SKU</span>
            </div>
          </div>
        </div>

        {/* Inbox Requests */}
        <div
          onClick={() => setActiveTab('requests')}
          className="p-5 rounded-2xl bg-surface-1 border border-white/5 hover:border-indigo-500/40 transition-all shadow-card cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-6 h-6" />
            </div>
            {pendingRequests > 0 ? (
              <span className="px-2 py-0.5 text-[11px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40 rounded-full">
                {pendingRequests} Unread
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-medium">Kotak Masuk</span>
            )}
          </div>
          <div className="mt-4">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Inbox Request
            </span>
            <div className="font-display text-2xl sm:text-3xl font-black text-indigo-400 mt-0.5 flex items-baseline gap-1.5">
              <span className="tabular-nums">{pendingRequests}</span>
              <span className="text-xs text-slate-400 font-normal">permintaan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics — surfaceContainer panels, no drop-shadow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="p-5 sm:p-6 bg-md-surface-container border border-md-outline-variant rounded-m3-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-display uppercase tracking-wider text-md-on-surface-variant">
              Kesehatan Stok Inventori
            </span>
            <span className="text-[11px] text-md-primary font-semibold">
              {totalProducts > 0 ? Math.round((inStock / totalProducts) * 100) : 0}% Sehat
            </span>
          </div>

          <div className="flex items-center justify-around py-2">
            {/* SVG Circular Progress Chart with Base Gray Track */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Complete Empty Track Ring (#1E293B) */}
                <path
                  className="text-slate-800/90"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Ready Stock Segment (#10B981 Emerald) */}
                <path
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${totalProducts > 0 ? Math.round((inStock / totalProducts) * 100) : 0}, 100`}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="tabular-nums font-display text-xl font-black text-md-on-surface leading-none">{inStock}</span>
                <span className="text-[10px] text-md-on-surface-variant font-bold uppercase tracking-wider mt-1">READY</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-md-primary" />
                <span className="text-md-on-surface-variant">Ready: <strong className="text-md-on-surface">{inStock}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-md-amber-badge" />
                <span className="text-md-on-surface-variant">Kritis: <strong className="text-md-on-surface">{lowStock}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-md-tertiary" />
                <span className="text-md-on-surface-variant">Pre-Order: <strong className="text-md-on-surface">{products.filter(p => p.stock_status === 'pre_order').length}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 p-5 sm:p-6 bg-md-surface-container border border-md-outline-variant rounded-m3-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-display uppercase tracking-wider text-md-on-surface-variant">
              Distribusi SKU per Kategori
            </span>
            <span className="text-[11px] text-md-on-surface-variant">
              {Object.keys(products.reduce((acc, p) => ({ ...acc, [p.category]: true }), {})).length} Kategori Aktif
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {Object.entries(
              products.reduce<Record<string, number>>((acc, p) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([cat, count]) => {
                const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-md-on-surface font-semibold">{cat}</span>
                      <span className="tabular-nums text-md-on-surface-variant">{count} SKU ({pct}%)</span>
                    </div>
                    {/* Progress bar: surfaceContainerHighest track, md-primary fill */}
                    <div className="w-full h-2 bg-md-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-md-primary rounded-full transition-all duration-500 ease-m3-expressive-spatial"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Nav Tabs — M3 segmented tab bar, 44px touch targets, outline-variant border */}
      <div className="flex items-center gap-1.5 border-b border-md-outline-variant pb-3 overflow-x-auto scrollbar-none no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-m3-sm text-xs font-bold transition-colors ease-m3-expressive-fast duration-m3-fast whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'products'
              ? 'bg-md-primary text-md-on-primary'
              : 'bg-md-surface-container text-md-on-surface-variant hover:text-md-on-surface border border-md-outline-variant'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Katalog Produk</span>
          <span className="tabular-nums px-1.5 py-0.5 text-[10px] bg-md-surface-container-highest text-md-on-surface-variant rounded-m3-full font-bold">
            {totalProducts}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('direct_orders'); loadDirectOrders(); }}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-m3-sm text-xs font-bold transition-colors ease-m3-expressive-fast duration-m3-fast whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'direct_orders'
              ? 'bg-md-primary text-md-on-primary'
              : 'bg-md-surface-container text-md-on-surface-variant hover:text-md-on-surface border border-md-outline-variant'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Pesanan COD & Kurir</span>
          {pendingDirectOrders > 0 ? (
            <span className="tabular-nums px-1.5 py-0.5 text-[10px] bg-md-amber-badge text-md-on-amber-badge font-black rounded-m3-full shadow-sm">
              {pendingDirectOrders} Baru
            </span>
          ) : (
            <span className="tabular-nums px-1.5 py-0.5 text-[10px] bg-md-surface-container-highest text-md-on-surface-variant rounded-m3-full font-bold">
              {directOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-m3-sm text-xs font-bold transition-colors ease-m3-expressive-fast duration-m3-fast whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'requests'
              ? 'bg-md-primary text-md-on-primary'
              : 'bg-md-surface-container text-md-on-surface-variant hover:text-md-on-surface border border-md-outline-variant'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Inbox Request</span>
          {pendingRequests > 0 ? (
            <span className="tabular-nums px-1.5 py-0.5 text-[10px] bg-md-amber-badge text-md-on-amber-badge font-black rounded-m3-full shadow-sm">
              {pendingRequests} Baru
            </span>
          ) : (
            <span className="tabular-nums px-1.5 py-0.5 text-[10px] bg-md-surface-container-highest text-md-on-surface-variant rounded-m3-full font-bold">
              {requests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-m3-sm text-xs font-bold transition-colors ease-m3-expressive-fast duration-m3-fast whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'settings'
              ? 'bg-md-primary text-md-on-primary'
              : 'bg-md-surface-container text-md-on-surface-variant hover:text-md-on-surface border border-md-outline-variant'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database & Offline</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-m3-sm text-xs font-bold transition-colors ease-m3-expressive-fast duration-m3-fast whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'studio'
              ? 'bg-md-primary text-md-on-primary shadow-md'
              : 'bg-md-surface-container text-md-on-surface-variant hover:text-md-on-surface border border-md-outline-variant'
          }`}
        >
          <Palette className="w-4 h-4 text-emerald-400" />
          <span>Studio &amp; Theme Editor</span>
          <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold rounded-full border border-emerald-500/30">
            PRO
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'products' && (
        <ProductManager
          products={products}
          onRefresh={onRefresh}
          onOpenNotes={(p) => setSelectedProductForNotes(p)}
        />
      )}

      {activeTab === 'direct_orders' && (
        <DirectOrderManager
          onRefresh={() => {
            loadDirectOrders();
            onRefresh();
          }}
        />
      )}

      {activeTab === 'requests' && (
        <RequestInbox requests={requests} onRefresh={onRefresh} />
      )}

      {activeTab === 'studio' && (
        <ThemeEditor products={products} />
      )}

      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 bg-md-surface-container border border-md-outline-variant rounded-m3-lg space-y-5">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-m3-md border ${
              isSupabaseConfigured
                ? 'bg-md-primary/10 border-md-primary/25 text-md-primary'
                : 'bg-md-amber-badge/10 border-md-amber-badge/25 text-md-amber-badge'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-md-on-surface">
                {isSupabaseConfigured ? 'Supabase Database Connected' : 'Running on Instant Local Offline Engine'}
              </h3>
              <p className="text-xs text-md-on-surface-variant mt-0.5">
                {isSupabaseConfigured
                  ? 'Real-time PostgreSQL remote database aktif dan tersinkronisasi.'
                  : 'Aplikasi berjalan dengan full local offline fallback. Tambahkan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di environment untuk remote sync.'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-m3-md bg-md-surface-container-lowest border border-md-outline-variant text-xs font-mono text-md-on-surface space-y-2.5">
            <div className="text-md-primary font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PostgreSQL Schema Definition:</span>
            </div>
            <div className="bg-md-surface-container px-3 py-1.5 rounded-m3-sm border border-md-outline-variant text-md-primary">
              supabase/schema.sql
            </div>
            <div className="text-md-on-surface-variant text-[11px] pt-1 leading-relaxed">
              Schema telah teroptimasi dengan tabel `products`, `merchant_notes`, `special_requests`, ENUM status, dan Row Level Security (RLS) policies.
            </div>
          </div>
        </div>
      )}

      {/* Notes Manager Modal */}
      {selectedProductForNotes && (
        <NotesManager
          product={selectedProductForNotes}
          onClose={() => setSelectedProductForNotes(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};


