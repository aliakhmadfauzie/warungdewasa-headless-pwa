import React, { useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, Truck, ArrowRight, Layers, SlidersHorizontal, Lock } from 'lucide-react';
import { HeroProductSlider } from './HeroProductSlider';

/**
 * PERFORMANCE REWRITE — GSAP completely removed from this component.
 *
 * Root cause of TBT 5,880ms:
 *   - `import gsap from 'gsap'` was a STATIC import → GSAP loaded in the critical bundle
 *   - GSAP's internal ticker fires every requestAnimationFrame, creating long tasks
 *   - GSAP ScrollTrigger fired repeatedly during Lighthouse's measurement window
 *   Total: 17 long tasks × ~300ms = 5,880ms TBT
 *
 * Root cause of LCP not found:
 *   - GSAP's `fromTo({ opacity: 0 })` set inline `opacity: 0` on the <h1> BEFORE
 *     the animation started, making the heading invisible when Lighthouse measured LCP
 *
 * Fix:
 *   - All entrance animations → CSS @keyframes (compositor-threaded, zero main thread cost)
 *   - Magnetic button → vanilla JS (no library, no long tasks)
 *   - <h1> renders VISIBLE immediately → LCP fires on first paint
 *   - Particles → CSS infinite animations (no GSAP ticker)
 *   - GSAP completely removed → no longer in critical modulepreload chain
 */

interface HeroMotionProps {
  totalCatalogCount: number;
  onExploreClick: () => void;
  onRequestSpecialClick: () => void;
  onOpenFilterClick: () => void;
}

/** Minimal vanilla-JS magnetic pull effect — no GSAP needed */
function attachMagnetic(el: HTMLButtonElement | null, pull = 0.32) {
  if (!el) return () => {};
  let rafId: number | null = null;

  const onMove = (e: MouseEvent) => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * pull;
      const dy = (e.clientY - (r.top + r.height / 2)) * pull;
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.04)`;
    });
  };
  const onLeave = () => {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    el.style.transition = 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1)';
    el.style.transform = 'translate(0,0) scale(1)';
    setTimeout(() => { el.style.transition = ''; }, 700);
  };
  const onEnter = () => {
    el.style.transition = 'transform 0.25s ease-out';
  };

  el.addEventListener('mousemove', onMove, { passive: true });
  el.addEventListener('mouseleave', onLeave);
  el.addEventListener('mouseenter', onEnter);
  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
    el.removeEventListener('mouseenter', onEnter);
  };
}

export const HeroMotion: React.FC<HeroMotionProps> = ({
  totalCatalogCount,
  onExploreClick,
  onRequestSpecialClick,
  onOpenFilterClick
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const magBtn1 = useRef<HTMLButtonElement>(null);
  const magBtn2 = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Trigger CSS entrance animations by adding class after mount
    const hero = heroRef.current;
    if (hero) {
      // Small rAF delay ensures the browser has painted the initial (visible) state first
      requestAnimationFrame(() => {
        hero.classList.add('hero-animated');
      });
    }
    const c1 = attachMagnetic(magBtn1.current, 0.32);
    const c2 = attachMagnetic(magBtn2.current, 0.22);
    return () => { c1(); c2(); };
  }, []);

  const line1Words = ['Katalog', 'Produk', 'Resmi'];
  const line2Words = ['&', 'Catatan', 'Merchant'];

  return (
    <div
      ref={heroRef}
      className="hero-container relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0D1524] to-[#0A101D] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl mt-0"
    >
      {/* Auto-Sliding Product Showcase Background */}
      <HeroProductSlider />

      {/* Ambient glow particles — CSS infinite animations, zero JS cost */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-16 -right-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl hero-particle-a" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-teal-600/8 rounded-full blur-3xl hero-particle-b" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/25 via-slate-900/0 to-transparent" />
      </div>

      {/* ── Asymmetric Layout Grid (Prompt 02: Break the Symmetry) ─────────── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

        {/* ── Left Column: Sharpened Message & Direct Conversion CTA (Prompt 01) */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">

          {/* Signature Kicker Tag (Prompt 07) */}
          <div className="hero-badge-el kicker-badge shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Khusus Kota Medan &amp; Sekitarnya</span>
            <span className="text-emerald-500/60">•</span>
            <span className="text-slate-300 font-semibold">{totalCatalogCount}+ SKU Siap Kirim</span>
          </div>

          {/* 
            Sharpen the Message (Prompt 01) & Scale the Type (Prompt 05):
            Main headline makes a clear, plain-spoken promise with ONE key phrase in accent color.
          */}
          <h1 className="hero-heading font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Belanja Produk Dewasa:{' '}
            <span className="text-gradient-emerald inline-block font-black drop-shadow-sm">
              100% Diskrit &amp; Privasi
            </span>
            , Bayar COD di Tempat.
          </h1>

          {/* Specific After-State Subtitle */}
          <p className="hero-desc-el text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
            Kemasan cokelat polos tanpa label produk. Diantar kurir lokal toko dalam <strong className="text-white font-semibold">45–90 menit</strong>, tanpa riwayat transaksi tercatat di aplikasi marketplace Anda.
          </p>

          {/* Action CTAs (Prompt 06: Give Color Meaning - Bright Accent for primary action) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              ref={magBtn1}
              onClick={onExploreClick}
              className="hero-cta-el group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-2xl btn-gradient-emerald text-white font-display font-bold text-sm shadow-xl transition-all active:scale-95 cursor-pointer will-change-transform"
            >
              <Truck className="w-4 h-4 text-emerald-100" />
              <span>Pesan Cepat COD Medan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              ref={magBtn2}
              onClick={onOpenFilterClick}
              className="hero-cta-el hero-cta-delay inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-display font-bold text-sm border border-slate-700/80 backdrop-blur-md shadow-md active:scale-95 transition-colors cursor-pointer will-change-transform"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Filter {totalCatalogCount} SKU</span>
            </button>
          </div>

          {/* Trust Guarantee Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-300">
            {[
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />, label: '100% Produk Original' },
              { icon: <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />, label: 'Kemasan Polos Anti Terawang' },
              { icon: <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />, label: 'Kurir OTW Medan Hari Ini' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="hero-pill-el inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 shadow-xs"
              >
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Interactive Highlight Card Breaking Grid (Prompt 02) ── */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0">
          <div className="relative mx-auto max-w-sm lg:max-w-none rounded-2xl bg-slate-900/90 border border-emerald-500/30 p-5 shadow-2xl backdrop-blur-xl group hover:border-emerald-500/60 transition-all duration-300">
            {/* Header with live status pulse */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-slate-200">Kurir Toko Siap Kirim</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                Medan &amp; Sekitarnya
              </span>
            </div>

            {/* Courier ETA & Live Delivery Simulation */}
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimasi Pengantaran</span>
                <span className="text-emerald-400 font-bold font-display text-sm">45 – 90 Menit</span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-3/4 animate-pulse" />
              </div>

              {/* Discreet Packaging Highlights Box */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Prosedur Privasi Terstandar:</span>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1 pl-5 list-disc marker:text-emerald-400">
                  <li>Kardus tebal polos tanpa label nama produk</li>
                  <li>Resi pengiriman bertuliskan "Aksesoris / Suplemen"</li>
                  <li>Pembayaran tunai langsung ke tangan kurir di lokasi</li>
                </ul>
              </div>
            </div>

            {/* Floating Highlight Out-of-Grid Pill (The single most impressive feature) */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Tanpa rekening bank</span>
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all active:scale-95 cursor-pointer"
              >
                <span>Lihat Produk COD</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
