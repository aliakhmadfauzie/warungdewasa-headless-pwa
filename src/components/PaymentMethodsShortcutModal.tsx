import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Wallet, 
  Building2, 
  QrCode, 
  Banknote, 
  Copy, 
  Check, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  ExternalLink 
} from 'lucide-react';

interface PaymentMethodsShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentChannelInfo {
  id: string;
  category: 'ewallet' | 'bank' | 'qris' | 'cod';
  name: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  badgeBg: string;
  logo: React.ReactNode;
}

const CHANNELS: PaymentChannelInfo[] = [
  {
    id: 'gopay',
    category: 'ewallet',
    name: 'GoPay',
    provider: 'Gojek / GoTo Financial',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#00AA13]/15 text-[#00AA13] border-[#00AA13]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#00AA13] text-white flex items-center justify-center font-black text-xs shadow-xs">
        GP
      </div>
    )
  },
  {
    id: 'shopeepay',
    category: 'ewallet',
    name: 'ShopeePay',
    provider: 'Shopee Official Indonesia',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#EE4D2D]/15 text-[#FF5722] border-[#EE4D2D]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center font-black text-xs shadow-xs">
        SP
      </div>
    )
  },
  {
    id: 'ovo',
    category: 'ewallet',
    name: 'OVO',
    provider: 'OVO Payment System',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#4C3299]/20 text-[#A78BFA] border-[#4C3299]/40',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#4C3299] text-white flex items-center justify-center font-black text-xs shadow-xs">
        OVO
      </div>
    )
  },
  {
    id: 'dana',
    category: 'ewallet',
    name: 'DANA',
    provider: 'DANA Dompet Digital Indonesia',
    accountNumber: '081260889901',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#118EEA]/15 text-[#38BDF8] border-[#118EEA]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#118EEA] text-white flex items-center justify-center font-black text-xs shadow-xs">
        DANA
      </div>
    )
  },
  {
    id: 'bca',
    category: 'bank',
    name: 'BCA (Bank Central Asia)',
    provider: 'Transfer Antar Bank & VA',
    accountNumber: '8280912831',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#005EAA]/15 text-[#60A5FA] border-[#005EAA]/30',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#005EAA] text-white flex items-center justify-center font-black text-xs shadow-xs">
        BCA
      </div>
    )
  },
  {
    id: 'mandiri',
    category: 'bank',
    name: 'Bank Mandiri',
    provider: 'Transfer Livin / Antar Bank',
    accountNumber: '1080019283712',
    accountName: 'SALTDISTRIBUTE OFFICIAL',
    badgeBg: 'bg-[#003D79]/20 text-[#93C5FD] border-[#003D79]/40',
    logo: (
      <div className="w-8 h-8 rounded-lg bg-[#003D79] text-white flex items-center justify-center font-black text-xs shadow-xs">
        MDR
      </div>
    )
  }
];

export const PaymentMethodsShortcutModal: React.FC<PaymentMethodsShortcutModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'ewallet' | 'bank' | 'qris' | 'cod'>('all');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text.replace(/\D/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-shortcut-title"
    >
      {/* Dark blur backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative w-full max-w-xl bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#111827] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 id="payment-shortcut-title" className="font-display text-base font-bold text-white">
                Metode Pembayaran Resmi
              </h3>
              <p className="text-[11px] text-slate-400">
                Pilihan Rekening, E-Wallet Terverifikasi & QRIS Universal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'Semua Metode' },
            { id: 'ewallet', label: 'E-Wallet' },
            { id: 'bank', label: 'Transfer Bank' },
            { id: 'qris', label: 'QRIS' },
            { id: 'cod', label: 'COD Medan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategoryTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategoryTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* COD Notice Card */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'cod') && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4" />
                  <span>COD (Cash On Delivery)</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                  Khusus Area Medan
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bayar tunai di tempat saat kurir same-day tiba di alamat Anda (wilayah Medan Petisah, Medan Barat, Medan Baru, Medan Sunggal, Medan Amplas, dan sekitarnya).
              </p>
            </div>
          )}

          {/* QRIS Universal Display */}
          {(activeCategoryTab === 'all' || activeCategoryTab === 'qris') && (
            <div className="p-4 rounded-2xl bg-[#161F30] border border-slate-700 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-xs">
                    QR
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">QRIS Universal (Semua M-Banking & E-Wallet)</h5>
                    <p className="text-[10px] text-slate-400">Scan via BCA Mobile, Livin, GoPay, OVO, ShopeePay, DANA</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Instan
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white text-slate-900 text-center space-y-1 max-w-[180px] mx-auto shadow-md">
                <QrCode className="w-32 h-32 mx-auto text-slate-950" />
                <span className="text-[10px] font-mono font-bold block uppercase tracking-wider text-slate-700">
                  NMID: ID102438920192
                </span>
              </div>
            </div>
          )}

          {/* Accounts List (E-Wallet & Bank) */}
          <div className="space-y-3">
            {CHANNELS.filter(c => activeCategoryTab === 'all' || c.category === activeCategoryTab).map(channel => (
              <div
                key={channel.id}
                className="p-3.5 rounded-2xl bg-[#161F30] border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {channel.logo}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{channel.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${channel.badgeBg}`}>
                        Official
                      </span>
                    </div>
                    <div className="font-mono text-xs font-extrabold text-emerald-400">
                      {channel.accountNumber}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      a/n <strong className="text-slate-200">{channel.accountName}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(channel.id, channel.accountNumber)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
                >
                  {copiedId === channel.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Guarantee Footer */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Semua transaksi diverifikasi resmi. Jangan transfer ke nomor selain yang tertera di atas.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-[#111827] flex items-center justify-between gap-3">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20Warung%20Dewasa%20Abang%20Dugem,%20saya%20ingin%20konfirmasi%20pembayaran."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Konfirmasi Pembayaran WhatsApp</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};
