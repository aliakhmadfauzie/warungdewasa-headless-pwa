import React, { useState, useEffect } from 'react';
import { Product, SpecialRequest, DirectOrder } from '../lib/types';
import { ProductManager } from './ProductManager';
import { RequestInbox } from './RequestInbox';
import { NotesManager } from './NotesManager';
import { DirectOrderManager } from './DirectOrderManager';
import { isSupabaseConfigured, api } from '../lib/supabase';
import { Package, AlertCircle, CheckCircle2, Clock, Database, Sparkles, Truck } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  requests: SpecialRequest[];
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  requests,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'direct_orders' | 'requests' | 'settings'>('products');
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
      {/* Metric Cards Grid - Unified Neutral Background with Distinct Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Total Products - Sky Blue Accent */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Total SKU</span>
            <div className="font-display text-xl sm:text-2xl font-black text-white">{totalProducts}</div>
          </div>
        </div>

        {/* Ready Stock - Emerald Accent (#10B981) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-md flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Ready Stock</span>
            <div className="font-display text-xl sm:text-2xl font-black text-emerald-400">{inStock}</div>
          </div>
        </div>

        {/* Direct Orders / COD - Emerald Accent */}
        <div 
          onClick={() => setActiveTab('direct_orders')}
          className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-emerald-500/60 transition-colors shadow-md flex items-center gap-4 cursor-pointer"
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Pesanan COD / Kurir</span>
            <div className="font-display text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-2">
              <span>{directOrders.length}</span>
              {pendingDirectOrders > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-amber-400 text-slate-950 font-black rounded-full shadow-sm">
                  {pendingDirectOrders} Baru
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pending Requests - Soft Indigo Accent (#818CF8) */}
        <div 
          onClick={() => setActiveTab('requests')}
          className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500/60 transition-colors shadow-md flex items-center gap-4 cursor-pointer"
        >
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Inbox Request</span>
            <div className="font-display text-xl sm:text-2xl font-black text-indigo-400">{pendingRequests}</div>
          </div>
        </div>
      </div>

      {/* Interactive Visualization: Inventory & Category Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* SVG Donut Stock Breakdown with Base Track */}
        <div className="p-5 sm:p-6 bg-[#111827] border border-slate-800 rounded-2xl shadow-md flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
              Kesehatan Stok Inventori
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
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
              {/* Perfectly Centered Gauge Content with High Contrast #E2E8F0 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-display text-xl font-black text-white leading-none">{inStock}</span>
                <span className="text-[10px] text-slate-200 font-bold uppercase tracking-wider mt-1">READY</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Ready Stock: <strong>{inStock}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300">Stok Kritis: <strong>{lowStock}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="text-slate-300">Pre-Order: <strong>{products.filter(p => p.stock_status === 'pre_order').length}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Share Distribution Bar Charts */}
        <div className="lg:col-span-2 p-5 sm:p-6 bg-[#111827] border border-slate-800 rounded-2xl shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-300">
              Distribusi SKU per Kategori
            </span>
            <span className="text-[11px] text-slate-400">
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
                      <span className="text-slate-300 font-semibold">{cat}</span>
                      <span className="text-slate-400">{count} SKU ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Touch friendly 44px+ bar with horizontal swipe) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'products'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
              : 'bg-[#111827] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>Katalog Produk</span>
          <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-bold">
            {totalProducts}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('direct_orders');
            loadDirectOrders();
          }}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'direct_orders'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
              : 'bg-[#111827] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>Pesanan COD & Kurir</span>
          {pendingDirectOrders > 0 ? (
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-400 text-slate-950 font-black rounded-full shadow-sm">
              {pendingDirectOrders} Baru
            </span>
          ) : (
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-bold">
              {directOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'requests'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
              : 'bg-[#111827] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Inbox Request</span>
          {pendingRequests > 0 ? (
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-400 text-slate-950 font-black rounded-full shadow-sm">
              {pendingRequests} Baru
            </span>
          ) : (
            <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-full font-bold">
              {requests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer shrink-0 ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-display'
              : 'bg-[#111827] text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Database & Offline</span>
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

      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 bg-[#111827] border border-slate-800 rounded-2xl shadow-md space-y-5">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl border ${isSupabaseConfigured ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-amber-500/10 border-amber-500/25 text-amber-400'}`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                {isSupabaseConfigured ? 'Supabase Database Connected' : 'Running on Instant Local Offline Engine'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSupabaseConfigured 
                  ? 'Real-time PostgreSQL remote database aktif dan tersinkronisasi.' 
                  : 'Aplikasi berjalan dengan full local offline fallback. Tambahkan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di environment untuk remote sync.'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0B0F19] border border-slate-800 text-xs font-mono text-slate-200 space-y-2.5">
            <div className="text-emerald-400 font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PostgreSQL Schema Definition:</span>
            </div>
            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-300">
              supabase/schema.sql
            </div>
            <div className="text-slate-400 text-[11px] pt-1 leading-relaxed">
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


