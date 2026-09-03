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
      className="hero-container relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-10 lg:p-12 shadow-2xl mt-0"
    >
      {/* Auto-Sliding Product Showcase Background */}
      <HeroProductSlider />

      {/* Ambient glow particles — CSS infinite animations, zero JS cost */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl hero-particle-a" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-teal-600/6 rounded-full blur-3xl hero-particle-b" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/15 via-slate-900/0 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl space-y-6">

        {/* Badge — CSS fade-down entrance */}
        <div className="hero-badge-el inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-gradient-emerald text-xs font-bold shadow-xs backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Headless E-Commerce PWA • {totalCatalogCount}+ Verified SKU Catalog</span>
        </div>

        {/*
          LCP CRITICAL: <h1> is rendered FULLY VISIBLE on first paint (no opacity:0, no transform).
          CSS animation uses fill-mode:forwards (not backwards) so text is visible before animation.
          This ensures Lighthouse detects the heading as LCP on first paint.
        */}
        <h1 className="hero-heading font-display text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1">
            {line1Words.map((word, idx) => (
              <span
                key={idx}
                className="hero-word-el inline-block text-gradient-silver"
                style={{ animationDelay: `${0.05 + idx * 0.05}s` }}
              >
                {word}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 mt-0.5">
            {line2Words.map((word, idx) => (
              <span
                key={idx}
                className="hero-word-el inline-block text-gradient-emerald font-black"
                style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
              >
                {word}
              </span>
            ))}
          </div>
        </h1>

        {/* Subtitle — CSS fade-up */}
        <p className="hero-desc-el text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
          Koleksi kondom ultra-thin, pelumas premium, dan varian aroma resmi. Review autentik, kemasan privasi aman, checkout via Shopee &amp; Tokopedia resmi.
        </p>

        {/* CTA Buttons — CSS scale-in */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            ref={magBtn1}
            onClick={onExploreClick}
            className="hero-cta-el group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-2xl btn-gradient-emerald text-white font-display font-bold text-sm shadow-xl transition-all active:scale-95 cursor-pointer will-change-transform"
          >
            <Layers className="w-4 h-4 text-emerald-100" />
            <span>Jelajahi Katalog {totalCatalogCount} SKU</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            ref={magBtn2}
            onClick={onOpenFilterClick}
            className="hero-cta-el hero-cta-delay inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-display font-bold text-sm border border-slate-700/80 backdrop-blur-md shadow-md active:scale-95 transition-colors cursor-pointer will-change-transform"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Filter Cepat</span>
          </button>
        </div>

        {/* Trust Badges — CSS stagger */}
        <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-300">
          {[
            { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />, label: '100% Produk Original', delay: '0.55s' },
            { icon: <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />, label: 'Kemasan Polos & Privasi', delay: '0.63s' },
            { icon: <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />, label: 'Pengiriman Cepat (COD Medan)', delay: '0.71s' },
          ].map(({ icon, label, delay }) => (
            <div
              key={label}
              className="hero-pill-el inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 shadow-xs"
              style={{ animationDelay: delay }}
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
