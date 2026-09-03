import React, { useState } from 'react';
import { api } from '../lib/supabase';
import { X, Send, CheckCircle2, MessageSquarePlus } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#111827] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                Request Produk Khusus
              </h3>
              <p className="text-xs text-slate-400">
                Garam custom, sak 50kg, atau spesifikasi non-katalog
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

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>
            <div>
              <h4 className="font-display text-lg font-bold text-white">Permintaan Berhasil Terkirim!</h4>
              <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Tim sales & logistik kami akan segera menindaklanjuti via WhatsApp / Email Anda.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-display">
                Nama Lengkap / Perusahaan <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Contoh: PT Sumber Rejeki / Ibu Linda"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-display">
                Kontak (WhatsApp / Telepon) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Contoh: 081234567890 / info@perusahaan.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-display">
                Spesifikasi / Detail Kebutuhan <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Jenis garam, estimasi jumlah tonase/sak, kadar NaCl, lokasi pengiriman gudang..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-slate-100 placeholder-slate-500 outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition-colors active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


