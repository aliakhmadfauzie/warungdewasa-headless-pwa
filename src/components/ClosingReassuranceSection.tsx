import React from 'react';
import { Package, ShieldCheck, CheckCircle2, MessageCircle, Truck, ArrowRight, Lock } from 'lucide-react';

interface ClosingReassuranceSectionProps {
  onOrderNowClick: () => void;
  onRequestSpecialClick?: () => void;
}

/**
 * Human UI Guide - Prompt 03: Build the Argument (Beat 6: Closing Reassurance Section)
 * One large visual, 3 plain lines describing daily experience, then the final ask.
 */
export const ClosingReassuranceSection: React.FC<ClosingReassuranceSectionProps> = ({
  onOrderNowClick,
  onRequestSpecialClick
}) => {
  const steps = [
    {
      num: '01',
      title: 'Pilih & Klik Tanpa Akun',
      desc: 'Cukup pilih produk yang Anda butuhkan di katalog, tentukan jumlah, dan masukkan alamat titik pengantaran.'
    },
    {
      num: '02',
      title: 'Kurir Medan Berangkat Cepat',
      desc: 'Kurir khusus toko mengemas paket dengan kardus polos tanpa label, lalu mengantar langsung dalam 45–90 menit.'
    },
    {
      num: '03',
      title: 'Bayar Tunai & Privasi Aman',
      desc: 'Periksa paket tertutup rapat di tangan Anda, serahkan uang tunai, dan transaksi selesai tanpa arsip digital.'
    }
  ];

  return (
    <section className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#0E1524] to-[#0A101C] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Subtle radial emerald background bloom */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Showcase Container */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/90 border border-emerald-500/30 p-6 shadow-xl backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 bg-emerald-500/10 rounded-full blur-2xl" />

              {/* Package Visual Mockup Badge */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Package className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Standar Diskrit
                  </span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h4 className="font-display text-lg font-black text-white">
                    Paket Kardus Polos &amp; Rapi
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Setiap pesanan direct COD dikemas dengan standar perlindungan ekstra anti-guncangan dan anti-terawang.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Garansi Tanpa Tanda / Tulisan Dewasa</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Bahkan kurir yang mengantar tidak mengetahui isi spesifik di dalam kotak kemasan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Plain Experience Lines & Final Ask */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="kicker-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Pengalaman Belanja Nyata</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Seperti Apa Rasanya Pesan di Warung Dewasa?
              </h2>
            </div>

            {/* 3 Summary Lines */}
            <div className="space-y-4 pt-1">
              {steps.map((s) => (
                <div key={s.num} className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <span className="font-display text-base font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                    {s.num}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Ask / Primary CTA Row */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onOrderNowClick}
                className="group inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3.5 rounded-2xl btn-gradient-emerald text-white font-display font-bold text-sm shadow-xl transition-all active:scale-95 cursor-pointer will-change-transform"
              >
                <Truck className="w-4 h-4" />
                <span>Pilih Produk &amp; Pesan COD Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {onRequestSpecialClick && (
                <button
                  onClick={onRequestSpecialClick}
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-display font-bold text-sm border border-slate-700/80 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Request Produk Khusus</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
