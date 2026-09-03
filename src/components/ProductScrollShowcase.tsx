import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ShieldCheck, Zap, Lock, ArrowRight, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '../lib/types';
import { openRegionalMarketplace } from '../lib/deepLinkResolver';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ProductScrollShowcaseProps {
  featuredProduct?: Product;
  onExploreCatalog?: () => void;
}

export const ProductScrollShowcase: React.FC<ProductScrollShowcaseProps> = ({
  featuredProduct,
  onExploreCatalog
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const visual3DRef = useRef<HTMLDivElement>(null);
  const haloGlowRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const productImg = featuredProduct?.image_url || 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-104-768x768.jpg';
  const productTitle = featuredProduct?.title || 'GOLD RUSH Premium Edition 10ml';
  const productCategory = featuredProduct?.category || 'Poppers & Aroma';

  useEffect(() => {
    // GSAP Context ensures safe cleanup on unmount
    const ctx = gsap.context(() => {
      // Master Scroll-Driven Timeline with Pinning for 2000px
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2000',
          pin: pinContainerRef.current,
          scrub: 1.2,
          anticipatePin: 1
        }
      });

      // Progress bar fill across the 2000px scroll
      tl.to(progressBarRef.current, {
        scaleX: 1,
        ease: 'none'
      }, 0);

      // 3D Model rotation (rotateY: 360deg), scale, and 3D tilting
      tl.fromTo(
        visual3DRef.current,
        {
          rotateY: 0,
          rotateX: 10,
          scale: 0.9,
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))'
        },
        {
          rotateY: 360,
          rotateX: 0,
          scale: 1.15,
          filter: 'drop-shadow(0 35px 50px rgba(0, 108, 76, 0.35))',
          ease: 'power3.out'
        },
        0
      );

      // Reactive Halo Glow breathing effect
      tl.to(
        haloGlowRef.current,
        {
          opacity: 0.9,
          scale: 1.3,
          ease: 'power3.out'
        },
        0.2
      );

      // Step 1: Feature Card In & Out
      tl.fromTo(
        step1Ref.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, ease: 'power3.out', duration: 0.25 },
        0.05
      );
      tl.to(
        step1Ref.current,
        { opacity: 0, y: -40, scale: 0.95, ease: 'power3.in', duration: 0.15 },
        0.28
      );

      // Step 2: Feature Card In & Out
      tl.fromTo(
        step2Ref.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, ease: 'power3.out', duration: 0.25 },
        0.33
      );
      tl.to(
        step2Ref.current,
        { opacity: 0, y: -40, scale: 0.95, ease: 'power3.in', duration: 0.15 },
        0.58
      );

      // Step 3: Feature Card In & Out
      tl.fromTo(
        step3Ref.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, ease: 'power3.out', duration: 0.25 },
        0.63
      );
      tl.to(
        step3Ref.current,
        { opacity: 0, y: -40, scale: 0.95, ease: 'power3.in', duration: 0.15 },
        0.83
      );

      // Step 4: Final Summary Callout
      tl.fromTo(
        step4Ref.current,
        { opacity: 0, y: 40, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, ease: 'power3.out', duration: 0.2 },
        0.86
      );

    }, sectionRef);

    return () => {
      ctx.revert(); // Mandatory GSAP & ScrollTrigger cleanup
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0B0F19] text-white">
      {/* Pinned Viewport Container */}
      <div
        ref={pinContainerRef}
        className="relative h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Top Scroll Indicator & Timeline Progress Bar */}
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center pt-2 sm:pt-4 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Product Showcase</span>
          </div>
          <h2 className="mt-2 text-center font-display text-lg sm:text-2xl font-bold tracking-tight text-white">
            Eksplorasi Detail <span className="text-emerald-400">{productTitle}</span>
          </h2>

          {/* Scroll Scrub Progress Bar */}
          <div className="w-48 sm:w-64 h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full origin-left scale-x-0"
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Scroll perlahan untuk menjelajah
          </span>
        </div>

        {/* Central 3D Visual & Reactive Halo Glow */}
        <div className="relative flex-1 flex items-center justify-center my-auto z-10 [perspective:1200px]">
          {/* Reactive Emerald Glow Halo */}
          <div
            ref={haloGlowRef}
            className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-600/30 via-teal-500/20 to-transparent blur-3xl pointer-events-none opacity-40 transition-all"
          />

          {/* Rotating 3D Product Container */}
          <div
            ref={visual3DRef}
            className="relative w-56 h-56 sm:w-80 sm:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-[#1E293B] to-[#111827] border border-slate-700/80 shadow-2xl [transform-style:preserve-3d] flex items-center justify-center p-3"
          >
            <img
              src={productImg}
              alt={productTitle}
              className="w-full h-full object-cover rounded-2xl select-none pointer-events-none"
            />

            {/* Glossy Translucent Glass Highlight Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none rounded-2xl" />

            {/* Live 3D Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white">
              <span className="text-emerald-400">{productCategory}</span>
              <span className="text-slate-300">360° View</span>
            </div>
          </div>
        </div>

        {/* Dynamic Staggered Feature Cards (Overlayed Position) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4 sm:p-8 z-30">
          {/* Step 1 Feature Card: Authenticity */}
          <div
            ref={step1Ref}
            className="absolute max-w-sm w-full p-5 sm:p-6 rounded-2xl bg-[#111827]/95 border border-slate-700 shadow-2xl backdrop-blur-xl opacity-0 space-y-2 pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Fitur Utama #1</span>
                <h4 className="font-display text-sm sm:text-base font-bold text-white">100% Segel Distributor Asli</h4>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Semua produk melalui quality control ketat dengan stiker segel resmi distributor untuk menjamin integritas formula dan mutu terbaik.
            </p>
          </div>

          {/* Step 2 Feature Card: Formula & Performance */}
          <div
            ref={step2Ref}
            className="absolute max-w-sm w-full p-5 sm:p-6 rounded-2xl bg-[#111827]/95 border border-slate-700 shadow-2xl backdrop-blur-xl opacity-0 space-y-2 pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">Fitur Utama #2</span>
                <h4 className="font-display text-sm sm:text-base font-bold text-white">Kualitas & Efektivitas Teruji</h4>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Formula murni dengan tingkat stabilitas tinggi yang menjadi pilihan terfavorit customer, lengkap dengan panduan penggunaan aman.
            </p>
          </div>

          {/* Step 3 Feature Card: Privacy & Fast Dispatch */}
          <div
            ref={step3Ref}
            className="absolute max-w-sm w-full p-5 sm:p-6 rounded-2xl bg-[#111827]/95 border border-slate-700 shadow-2xl backdrop-blur-xl opacity-0 space-y-2 pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Fitur Utama #3</span>
                <h4 className="font-display text-sm sm:text-base font-bold text-white">Privasi Pengiriman 100% Aman</h4>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Paket dikirim dalam kemasan polos tanpa deskripsi isi produk. Identitas dan kenyamanan pembeli merupakan prioritas utama.
            </p>
          </div>

          {/* Step 4 Final Card: Direct Action CTAs */}
          <div
            ref={step4Ref}
            className="absolute max-w-md w-full p-6 sm:p-7 rounded-3xl bg-[#111827]/95 border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 backdrop-blur-2xl opacity-0 space-y-4 text-center pointer-events-auto"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                Siap Melakukan Pemesanan?
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                Checkout Instan di Marketplace Resmi
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Dapatkan promo ongkir dan jaminan keaslian via Shopee & Tokopedia resmi kami.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              {featuredProduct?.shopee_url && (
                <button
                  onClick={() => openRegionalMarketplace({ platform: 'shopee', webUrl: featuredProduct.shopee_url })}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <span>Beli di Shopee</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {featuredProduct?.tokopedia_url && (
                <button
                  onClick={() => openRegionalMarketplace({ platform: 'tokopedia', webUrl: featuredProduct.tokopedia_url })}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#03AC0E] hover:bg-[#03AC0E]/90 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <span>Beli di Tokopedia</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onExploreCatalog && (
                <button
                  onClick={onExploreCatalog}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lihat Semua Katalog</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="text-center py-2 z-20">
          <span className="text-[11px] text-slate-400 font-medium">
            © SaltStore Headless PWA • GSAP Scroll-Driven Motion
          </span>
        </div>
      </div>
    </section>
  );
};
