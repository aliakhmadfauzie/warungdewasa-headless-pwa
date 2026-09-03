import React from 'react';
import { Product, NoteType } from '../lib/types';
import { X, Sparkles, Lightbulb, Star, ThumbsUp, ShieldCheck } from 'lucide-react';

interface MerchantNotesModalProps {
  product: Product | null;
  onClose: () => void;
}

const NOTE_TYPE_CONFIG: Record<NoteType, { title: string; icon: React.ReactNode; badge: string }> = {
  usage_tip: {
    title: 'Tips Penggunaan & Penyimpanan',
    icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
    badge: 'border-amber-500/25 bg-amber-500/10 text-amber-300'
  },
  personal_review: {
    title: 'Ulasan Personal Penjual',
    icon: <Star className="w-4 h-4 text-emerald-400" />,
    badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
  },
  recommendation: {
    title: 'Rekomendasi Distribusi',
    icon: <ThumbsUp className="w-4 h-4 text-sky-400" />,
    badge: 'border-sky-500/25 bg-sky-500/10 text-sky-300'
  }
};

export const MerchantNotesModal: React.FC<MerchantNotesModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const notes = product.merchant_notes || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#111827] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                Catatan Resmi Penjual
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">
                {product.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-relaxed">Catatan ini ditulis dan dikurasi langsung oleh distributor resmi SaltDistribute.</span>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs bg-[#0B0F19] rounded-xl border border-slate-800">
              Belum ada catatan khusus untuk produk ini.
            </div>
          ) : (
            notes.map((note) => {
              const config = NOTE_TYPE_CONFIG[note.note_type] || NOTE_TYPE_CONFIG.recommendation;
              return (
                <div key={note.id} className={`p-4 sm:p-5 rounded-xl border ${config.badge} space-y-2`}>
                  <div className="flex items-center gap-2 font-display font-bold text-xs">
                    {config.icon}
                    <span>{config.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200">
                    {note.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#111827] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 hover:text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};


