import React, { useState } from 'react';
import { Product, StockStatus } from '../lib/types';
import { api } from '../lib/supabase';
import { Plus, Edit3, ExternalLink, Sparkles } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onRefresh: () => void;
  onOpenNotes: (product: Product) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  onRefresh,
  onOpenNotes
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Konsumsi');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('in_stock');
  const [shopeeUrl, setShopeeUrl] = useState('');
  const [tokopediaUrl, setTokopediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setCategory('Konsumsi');
    setPrice(0);
    setDescription('');
    setImageUrl('');
    setStockStatus('in_stock');
    setShopeeUrl('');
    setTokopediaUrl('');
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price);
    setDescription(product.description);
    setImageUrl(product.image_url);
    setStockStatus(product.stock_status);
    setShopeeUrl(product.shopee_url);
    setTokopediaUrl(product.tokopedia_url);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.saveProduct({
        id: editingId || undefined,
        title,
        category,
        price: Number(price),
        description,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=600&q=80',
        stock_status: stockStatus,
        shopee_url: shopeeUrl,
        tokopedia_url: tokopediaUrl
      });
      resetForm();
      onRefresh();
    } catch {
      alert('Gagal menyimpan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStockToggle = async (productId: string, newStatus: StockStatus) => {
    await api.updateStockStatus(productId, newStatus);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-white tracking-tight">Katalog Inventaris & Deep Links</h2>
          <p className="text-xs text-slate-400">Kelola inventaris garam, status stok real-time, dan direct URL Shopee/Tokopedia</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="font-display">Tambah Produk Baru</span>
          </button>
        )}
      </div>

      {/* Product Form Card */}
      {isEditing && (
        <div className="p-6 bg-[#111827] border border-slate-800 rounded-2xl shadow-lg animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{editingId ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}</span>
            </h3>
            <button 
              onClick={resetForm} 
              className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 font-display">Nama Produk *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Garam Halus Beryodium 1kg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 font-display">Kategori *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Konsumsi, Industri, Water Treatment, dll"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 font-display">Harga Jual (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="25000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 font-display">Deskripsi Singkat</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Karakteristik garam, kadar NaCl, standar SNI, jenis kemasan sak/pack..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 font-display">URL Gambar Produk</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 font-display">Status Stok</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="in_stock">🟢 Ready Stock</option>
                <option value="low_stock">🟡 Stok Terbatas</option>
                <option value="out_of_stock">🔴 Habis (Out of Stock)</option>
                <option value="pre_order">🔵 Pre-Order</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#ee4d2d] font-display">Link Toko Shopee</label>
              <input
                type="url"
                value={shopeeUrl}
                onChange={(e) => setShopeeUrl(e.target.value)}
                placeholder="https://shopee.co.id/product/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#ee4d2d]/30 text-xs text-slate-100 outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d]/30 transition-colors"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-[#03ac0e] font-display">Link Toko Tokopedia</label>
              <input
                type="url"
                value={tokopediaUrl}
                onChange={(e) => setTokopediaUrl(e.target.value)}
                placeholder="https://tokopedia.com/product/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-[#03ac0e]/30 text-xs text-slate-100 outline-none focus:border-[#03ac0e] focus:ring-1 focus:ring-[#03ac0e]/30 transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm disabled:opacity-50 transition-colors active:scale-95"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List — Mobile Cards (<md) + Desktop Table (>=md) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        
        {/* ─── MOBILE CARD VIEW (< md) ─── */}
        <div className="md:hidden divide-y divide-slate-800/80 p-3 sm:p-4 space-y-3">
          {products.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-3">
              <p className="text-xs">Belum ada produk yang tersimpan dalam katalog.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
              >
                + Tambah Produk Pertama
              </button>
            </div>
          ) : (
            products.map((prod) => {
              const catLower = prod.category.toLowerCase();
              const categoryBadgeStyle = 
                catLower.includes('popper') || catLower.includes('aroma')
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-700/40'
                  : catLower.includes('pelumas') || catLower.includes('lubricant')
                  ? 'bg-sky-950/60 text-sky-300 border-sky-700/40'
                  : catLower.includes('kondom')
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/40'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/60';

              const statusStyle =
                prod.stock_status === 'in_stock'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : prod.stock_status === 'low_stock'
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : prod.stock_status === 'out_of_stock'
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  : 'bg-sky-950/60 border-sky-500/50 text-sky-300';

              return (
                <div key={prod.id} className="pt-3 first:pt-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.image_url}
                      alt=""
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md border font-semibold text-[10px] uppercase tracking-wider ${categoryBadgeStyle}`}>
                          {prod.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {prod.merchant_notes?.length || 0} Tips
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-white text-sm line-clamp-2 leading-snug">
                        {prod.title}
                      </h4>
                      <div className="font-display font-extrabold text-emerald-400 text-sm">
                        Rp {prod.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Quick Stock & Marketplace Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                    <select
                      value={prod.stock_status}
                      onChange={(e) => handleQuickStockToggle(prod.id, e.target.value as StockStatus)}
                      aria-label="Ubah Status Stok"
                      className={`w-full sm:w-auto min-h-[40px] px-3 py-2 rounded-xl border text-xs font-bold outline-none cursor-pointer ${statusStyle}`}
                    >
                      <option value="in_stock" className="bg-[#111827] text-emerald-300">🟢 Ready Stock</option>
                      <option value="low_stock" className="bg-[#111827] text-amber-300">🟡 Stok Terbatas</option>
                      <option value="out_of_stock" className="bg-[#111827] text-rose-300">🔴 Habis</option>
                      <option value="pre_order" className="bg-[#111827] text-sky-300">🔵 Pre-Order</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      {prod.shopee_url ? (
                        <a
                          href={prod.shopee_url}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EE4D2D]/15 text-[#FF6433] border border-[#EE4D2D]/40 text-xs font-bold transition-all active:scale-95"
                        >
                          <span>Shopee</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <div className="min-h-[38px] flex items-center justify-center text-[10px] text-slate-600 bg-slate-900 rounded-xl border border-slate-800">
                          No Shopee
                        </div>
                      )}

                      {prod.tokopedia_url ? (
                        <a
                          href={prod.tokopedia_url}
                          target="_blank"
                          rel="noreferrer"
                          className="min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#03AC0E]/15 text-[#25D366] border border-[#03AC0E]/40 text-xs font-bold transition-all active:scale-95"
                        >
                          <span>Tokopedia</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <div className="min-h-[38px] flex items-center justify-center text-[10px] text-slate-600 bg-slate-900 rounded-xl border border-slate-800">
                          No Toped
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Card Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenNotes(prod)}
                      className="min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>+ Catatan ({prod.merchant_notes?.length || 0})</span>
                    </button>
                    <button
                      onClick={() => handleEditClick(prod)}
                      className="min-h-[40px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Produk</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ─── DESKTOP TABLE VIEW (>= md) ─── */}
        <div className="hidden md:block overflow-x-auto max-h-[72vh] scrollbar-thin">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800 z-10 shadow-sm">
              <tr>
                <th className="p-4 sm:p-5 min-w-[280px] max-w-[340px]">PRODUK</th>
                <th className="p-4 sm:p-5 min-w-[130px]">KATEGORI</th>
                <th className="p-4 sm:p-5 min-w-[120px]">HARGA</th>
                <th className="p-4 sm:p-5 min-w-[160px]">STATUS STOK</th>
                <th className="p-4 sm:p-5 min-w-[200px]">MARKETPLACE LINKS</th>
                <th className="p-4 sm:p-5 text-right min-w-[120px]">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="space-y-3">
                      <p className="text-xs">Belum ada produk yang tersimpan dalam katalog.</p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
                      >
                        + Tambah Produk Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  // Category badge styling
                  const catLower = prod.category.toLowerCase();
                  const categoryBadgeStyle = 
                    catLower.includes('popper') || catLower.includes('aroma')
                      ? 'bg-indigo-950/60 text-indigo-300 border-indigo-700/40'
                      : catLower.includes('pelumas') || catLower.includes('lubricant')
                      ? 'bg-sky-950/60 text-sky-300 border-sky-700/40'
                      : catLower.includes('kondom')
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/40'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60';

                  // Stock status dropdown style
                  const statusStyle =
                    prod.stock_status === 'in_stock'
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 focus:border-emerald-400'
                      : prod.stock_status === 'low_stock'
                      ? 'bg-amber-950/50 border-amber-500/40 text-amber-300 focus:border-amber-400'
                      : prod.stock_status === 'out_of_stock'
                      ? 'bg-rose-950/50 border-rose-500/40 text-rose-300 focus:border-rose-400'
                      : 'bg-sky-950/50 border-sky-500/40 text-sky-300 focus:border-sky-400';

                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/60">
                      {/* Product Title & Thumbnail (Min width 280px, Line Clamp 2) */}
                      <td className="p-4 sm:p-5 min-w-[280px] max-w-[340px]">
                        <div className="flex items-start gap-3.5">
                          <img
                            src={prod.image_url}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0 mt-0.5"
                          />
                          <div className="space-y-1">
                            <div className="font-display font-bold text-slate-100 text-sm line-clamp-2 leading-snug">
                              {prod.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {prod.merchant_notes?.length || 0} Catatan Merchant
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge with Contextual Tint */}
                      <td className="p-4 sm:p-5">
                        <span className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] whitespace-nowrap ${categoryBadgeStyle}`}>
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 sm:p-5 font-bold font-display text-slate-100 text-sm tracking-tight whitespace-nowrap">
                        Rp {prod.price.toLocaleString('id-ID')}
                      </td>

                      {/* Status Stock Dropdown */}
                      <td className="p-4 sm:p-5">
                        <select
                          value={prod.stock_status}
                          onChange={(e) => handleQuickStockToggle(prod.id, e.target.value as StockStatus)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold outline-none cursor-pointer transition-colors ${statusStyle}`}
                        >
                          <option value="in_stock" className="bg-[#111827] text-emerald-300">🟢 Ready Stock</option>
                          <option value="low_stock" className="bg-[#111827] text-amber-300">🟡 Stok Terbatas</option>
                          <option value="out_of_stock" className="bg-[#111827] text-rose-300">🔴 Habis</option>
                          <option value="pre_order" className="bg-[#111827] text-sky-300">🔵 Pre-Order</option>
                        </select>
                      </td>

                      {/* High Visibility Marketplace Chips */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          {prod.shopee_url ? (
                            <a
                              href={prod.shopee_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EE4D2D]/15 hover:bg-[#EE4D2D]/25 active:bg-[#EE4D2D]/35 text-[#FF6433] border border-[#EE4D2D]/40 transition-colors cursor-pointer shadow-xs"
                            >
                              <span>Shopee</span>
                              <ExternalLink className="w-3 h-3 text-[#FF6433]" />
                            </a>
                          ) : (
                            <span className="text-slate-600 text-[11px] font-mono">—</span>
                          )}

                          {prod.tokopedia_url ? (
                            <a
                              href={prod.tokopedia_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#03AC0E]/15 hover:bg-[#03AC0E]/25 active:bg-[#03AC0E]/35 text-[#25D366] border border-[#03AC0E]/40 transition-colors cursor-pointer shadow-xs"
                            >
                              <span>Tokopedia</span>
                              <ExternalLink className="w-3 h-3 text-[#25D366]" />
                            </a>
                          ) : (
                            <span className="text-slate-600 text-[11px] font-mono">—</span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 sm:p-5 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => onOpenNotes(prod)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors shadow-sm active:scale-95 cursor-pointer"
                        >
                          + Catatan
                        </button>
                        <button
                          onClick={() => handleEditClick(prod)}
                          aria-label="Edit Produk"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors active:scale-95 cursor-pointer inline-flex items-center justify-center"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
