import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * PERFORMANCE: Hero slides are inlined as a static constant here.
 * This removes the 148KB catalogData.ts import from the critical bundle path.
 * The full catalog still loads asynchronously via api.getProducts() in App.tsx.
 */
interface HeroSlide {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-104-768x768.jpg',
    title: '002 Ultra Thin—Natural Latex Condom (10 PCS)',
    category: 'Kondom',
    price: 75000,
  },
  {
    id: 'hero-2',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-84-768x768.jpg',
    title: 'AI Luewei Fire & Ice Series – Spiral / Spike',
    category: 'Kondom',
    price: 75000,
  },
  {
    id: 'hero-3',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-68-768x768.jpg',
    title: 'Anime Lubricant Gel 65ml',
    category: 'Pelumas',
    price: 85000,
  },
  {
    id: 'hero-4',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-104-768x768.jpg',
    title: 'AONIWEI Ultra Thin Condom (Black Edition)',
    category: 'Kondom',
    price: 65000,
  },
  {
    id: 'hero-5',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-68-768x768.jpg',
    title: 'Premium Water-Based Lubricant 100ml',
    category: 'Pelumas',
    price: 120000,
  },
  {
    id: 'hero-6',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-84-768x768.jpg',
    title: 'Sensitive Ultra Thin Series – 12 PCS',
    category: 'Kondom',
    price: 85000,
  },
  {
    id: 'hero-7',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-104-768x768.jpg',
    title: 'Aroma Series Strawberry & Vanilla (10 PCS)',
    category: 'Kondom',
    price: 78000,
  },
  {
    id: 'hero-8',
    image: 'https://poppers.id/wp-content/uploads/2025/11/POPPERS.ID-PRODUK-SEXTOYS-68-768x768.jpg',
    title: 'Silicone-Based Premium Lubricant 50ml',
    category: 'Pelumas',
    price: 145000,
  },
];

const SLIDE_INTERVAL = 2800; // ms per slide

export const HeroProductSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(prev => {
        const c = (prev + 1) % HERO_SLIDES.length;
        setNext((c + 1) % HERO_SLIDES.length);
        return c;
      });
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slide = HERO_SLIDES[current];
  const nextSlide = HERO_SLIDES[next];

  if (!slide) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
      {/* Left-to-right gradient — keeps hero text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/30 z-10" />
      {/* Top/bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40 z-10" />

      {/* Full-bleed product image background */}
      <div className="absolute inset-0">
        {/* Current slide */}
        <img
          key={`curr-${slide.id}`}
          src={slide.image}
          alt={slide.title}
          width={768}
          height={768}
          decoding="async"
          fetchPriority="high"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ filter: 'brightness(0.42) saturate(1.15)' }}
        />
        {/* Next slide preloaded */}
        <img
          key={`next-${nextSlide.id}`}
          src={nextSlide.image}
          alt={nextSlide.title}
          width={768}
          height={768}
          decoding="async"
          fetchPriority="low"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ filter: 'brightness(0.42) saturate(1.15)' }}
        />
      </div>

      {/* Floating product card — bottom-right (hidden on small screens to prevent layout overlap) */}
      <div className="hidden md:block absolute bottom-5 right-5 z-20 w-44 pointer-events-auto">
        <div
          className={`rounded-2xl overflow-hidden bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-2xl transition-all duration-500 ${
            isTransitioning
              ? 'opacity-0 scale-95 translate-y-2'
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <div className="relative aspect-square overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              width={176}
              height={176}
              decoding="async"
              fetchPriority="low"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.92)' }}
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[9px] font-bold uppercase tracking-wide shadow-sm">
              {slide.category}
            </span>
            <span className="absolute bottom-2 right-2 p-1 rounded-full bg-emerald-950/80 border border-emerald-500/40">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
            </span>
          </div>
          <div className="px-2.5 py-2">
            <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">{slide.title}</p>
            <p className="text-emerald-400 text-[11px] font-bold mt-1">
              Rp {slide.price.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>

      {/* Dot indicators (clickable) */}
      <div className="absolute bottom-5 left-6 z-20 flex gap-1.5 pointer-events-auto">
        {HERO_SLIDES.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (intervalRef.current) clearInterval(intervalRef.current);
              setCurrent(i);
              setNext((i + 1) % HERO_SLIDES.length);
              intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
            }}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-1.5 bg-emerald-400'
                : 'w-1.5 h-1.5 bg-slate-500 hover:bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
