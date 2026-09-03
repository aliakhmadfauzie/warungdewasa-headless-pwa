import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 36, 
  className = '',
  showText = false 
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md"
      >
        <defs>
          <linearGradient id="wd-logo-shield" x1="64" y1="32" x2="448" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>

          <linearGradient id="wd-logo-glow" x1="128" y1="48" x2="384" y2="256" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="wd-logo-monogram" x1="160" y1="140" x2="352" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="wd-logo-dark-inner" x1="256" y1="64" x2="256" y2="448" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F172A" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#022C22" stopOpacity="0.96" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Squircle Base */}
        <rect x="24" y="24" width="464" height="464" rx="128" fill="url(#wd-logo-shield)" />

        {/* Inner Dark Surface */}
        <rect x="44" y="44" width="424" height="424" rx="108" fill="url(#wd-logo-dark-inner)" stroke="url(#wd-logo-glow)" strokeWidth="4" />

        {/* Top Glass Sheen */}
        <path d="M44 140 C 44 80, 80 44, 140 44 L 372 44 C 432 44, 468 80, 468 140 C 340 180, 180 180, 44 140 Z" fill="url(#wd-logo-glow)" />

        {/* Stylized "W" and "D" Dynamic Crest Monogram */}
        <g id="monogram-group">
          {/* W Left Stem */}
          <path d="M120 180 L168 350 L208 350 L176 210 L152 210 Z" fill="url(#wd-logo-monogram)" />
          {/* W Center Peak & Right Stem */}
          <path d="M200 350 L256 195 L276 195 L232 350 Z" fill="url(#wd-logo-monogram)" />
          {/* W Right Diagonal */}
          <path d="M246 240 L288 350 L320 350 L300 280 L280 280 Z" fill="url(#wd-logo-monogram)" />

          {/* D Loop (Interlocking with W) */}
          <path d="M272 170 L340 170 C395 170 424 205 424 260 C424 315 395 350 340 350 L284 350 L296 312 L340 312 C372 312 386 292 386 260 C386 228 372 208 340 208 L284 208 Z" fill="url(#wd-logo-monogram)" />

          {/* Center Electric Spark / Official Star */}
          <path d="M256 120 L264 142 L286 150 L264 158 L256 180 L248 158 L226 150 L248 142 Z" fill="#FDE047" />

          {/* Official Badge Ribbon Base */}
          <rect x="156" y="388" width="200" height="36" rx="18" fill="#059669" stroke="#34D399" strokeWidth="2" />
          <text x="256" y="412" fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="17" fill="#FFFFFF" textAnchor="middle" letterSpacing="3">OFFICIAL</text>
        </g>
      </svg>

      {/* Optional Brand Typography block */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-sm sm:text-base tracking-tight dark:text-white text-slate-900 leading-none">
              Warung Dewasa
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 text-[8px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 rounded">
              Official
            </span>
          </div>
          <span className="text-[10px] dark:text-slate-400 text-slate-500 font-medium tracking-wider uppercase">
            Abang Dugem Medan
          </span>
        </div>
      )}
    </div>
  );
};
