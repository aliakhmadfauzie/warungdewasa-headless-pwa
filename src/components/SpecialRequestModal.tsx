import React, { useState } from 'react';
import { api } from '../lib/supabase';
import { X, Send, CheckCircle2, MessageSquarePlus, ShieldCheck, Lock } from 'lucide-react';

interface SpecialRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SpecialRequestModal: React.FC<SpecialRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !contactInfo.trim() || !itemDescription.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitSpecialRequest({
        customer_name: customerName,
        contact_info: contactInfo,
        item_description: itemDescription
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setCustomerName('');
        setContactInfo('');
        setItemDescription('');
        onSuccess();
        onClose();
      }, 1500);
    } catch {
      alert('Gagal mengirim request. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header (Prompt 01: Sharpen the Message) */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#111827] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <Lock className="w-2.5 h-2.5" />
                <span>Layanan Khusus &amp; Rahasia</span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Request Produk Non-Katalog
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Butuh varian tertentu atau suplemen impor? Kami carikan secara privat.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-white">Permintaan Berhasil Terkirim!</h4>
              <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Tim admin kami akan segera menghubungi via WhatsApp secara rahasia tanpa menyebut nama produk.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-display">
                Nama / Inisial Pemesan <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: Bro Alex / Inisial A (Boleh samaran)"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-display">
                Nomor WhatsApp Aktif <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Contoh: 0812-xxxx-xxxx"
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-display">
                Nama Produk &amp; Spesifikasi yang Dicari <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Contoh: Popper Amsterdam 30ml tutup emas, varian lubricant silicone, atau suplemen..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Semua data permintaan dienkripsi &amp; dihapus setelah transaksi selesai.</span>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[46px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-display font-extrabold text-white shadow-md shadow-emerald-950/40 transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Request Rahasia'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
