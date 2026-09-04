import React from 'react';
import { ShieldCheck, EyeOff, Clock, PackageCheck, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

interface WhyWarungDewasaSectionProps {
  onLearnMoreCod?: () => void;
}

/**
 * Human UI Guide - Prompt 03: Build the Argument (Beat 3: Why It's Different)
 * Sets headings on the left with supporting paragraph to the right.
 * Clear contrast between ordinary e-commerce vs Warung Dewasa direct local service.
 */
export const WhyWarungDewasaSection: React.FC<WhyWarungDewasaSectionProps> = ({ onLearnMoreCod }) => {
  const comparisons = [
    {
      title: 'Kemasan & Kerahasiaan Isi',
      icon: <EyeOff className="w-5 h-5 text-emerald-400" />,
      marketplace: 'Sering memakai plastik resi ekspedisi dengan barcode deskripsi barang rentan terbaca kurir umum.',
      warungDewasa: 'Kardus cokelat tebal berlapis bubble wrap tanpa stiker nama produk, tertutup rapat dan anti-terawang.',
      highlight: '100% Bebas Malu'
    },
    {
      title: 'Riwayat & Privasi Akun',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      marketplace: 'Riwayat produk tersimpan di akun marketplace dan memicu rekomendasi iklan dewasa di beranda Anda.',
      warungDewasa: 'Pesan langsung tanpa perlu login. Riwayat tidak terikat profil sosial media, bayar tunai (COD) saat barang tiba.',
      highlight: 'Nol Jejak Digital'
    },
    {
      title: 'Kecepatan Sampai di Medan',
      icon: <Clock className="w-5 h-5 text-emerald-400" />,
      marketplace: 'Menunggu pengiriman dari luar kota 2 hingga 4 hari kerja lewat jalur sortir logistik umum.',
      warungDewasa: 'Kurir internal toko langsung berangkat dari hub Medan. Estimasi tiba 45 hingga 90 menit langsung ke titik Anda.',
      highlight: 'Tiba Hari Ini'
    }
  ];

  return (
    <section className="w-full space-y-6 sm:space-y-8">
      {/* ── Human UI Rhythm: Kicker above heading, Left Heading + Right Paragraph ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/5">
        <div className="space-y-2 max-w-xl">
          <div className="kicker-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Kenapa Pilih Warung Dewasa</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Perbedaan Nyata Belanja Langsung vs Marketplace Biasa
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
          Kami memangkas rantai perantara agar kenyamanan, kecepatan, dan kehormatan privasi Anda tetap terlindungi tanpa kompromi.
        </p>
      </div>

      {/* ── 3 Comparison Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {comparisons.map((item, idx) => (
          <div
            key={idx}
            className="signature-card p-5 sm:p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {item.highlight}
                </span>
              </div>

              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {item.title}
              </h3>

              {/* Direct Contrast */}
              <div className="space-y-2.5 pt-1 text-xs">
                {/* Warung Dewasa Approach (Green highlight) */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Warung Dewasa Medan</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                    {item.warungDewasa}
                  </p>
                </div>

                {/* Marketplace Ordinary Approach (Muted/Grey) */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-slate-400">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-400 mb-1 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span>Marketplace Umum</span>
                  </div>
                  <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                    {item.marketplace}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Keamanan terjamin</span>
              <span className="text-emerald-400 font-semibold">Prosedur Aktif</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
