import React, { useState } from 'react';
import { Product, NoteType } from '../lib/types';
import { api } from '../lib/supabase';
import { Sparkles, Plus, X } from 'lucide-react';

interface NotesManagerProps {
  product: Product | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const NotesManager: React.FC<NotesManagerProps> = ({ product, onClose, onRefresh }) => {
  const [noteType, setNoteType] = useState<NoteType>('personal_review');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await api.addMerchantNote(product.id, {
        product_id: product.id,
        note_type: noteType,
        content
      });
      setContent('');
      onRefresh();
    } catch {
      alert('Gagal menambahkan catatan merchant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#111827] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white tracking-tight">Kelola Catatan Merchant</h3>
              <p className="text-xs text-slate-400 line-clamp-1">{product.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Tutup"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="p-4 sm:p-5 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold font-display text-white">Tambah Catatan Baru</span>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as NoteType)}
                aria-label="Tipe Catatan"
                className="w-full sm:w-auto min-h-[40px] px-3 py-2 rounded-xl bg-[#111827] border border-slate-700 text-xs text-slate-200 outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                <option value="personal_review">⭐ Ulasan Personal</option>
                <option value="usage_tip">💡 Tips Penggunaan</option>
                <option value="recommendation">👍 Rekomendasi Distribusi</option>
              </select>
            </div>

            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis rekomendasi autentik, tips penggunaan, atau panduan produk..."
              className="w-full p-3 rounded-xl bg-[#111827] border border-slate-700 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition-colors"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Catatan'}</span>
              </button>
            </div>
          </form>

          {/* List Existing Notes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Catatan Aktif</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold">
                {product.merchant_notes?.length || 0}
              </span>
            </h4>

            {(product.merchant_notes || []).length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-[#0B0F19] rounded-xl border border-slate-800">
                Belum ada catatan merchant yang terdaftar.
              </div>
            ) : (
              (product.merchant_notes || []).map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                    <span className="capitalize">{n.note_type.replace('_', ' ')}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(n.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{n.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#111827] flex justify-end">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto min-h-[42px] px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};


