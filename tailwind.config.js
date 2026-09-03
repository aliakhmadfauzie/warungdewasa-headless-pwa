/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        surface: {
          0: '#0B0F19', // Main page background (deep neutral slate)
          1: '#111827', // Card & panel background (neutral gray-900)
          2: '#1E293B', // Elevated surfaces / hover states (slate-800)
          3: '#334155', // Subtle controls / border highlights
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          muted: '#1F2937',
          active: '#374151',
        },
        accent: {
          primary: '#10B981',   // Emerald 500
          hover: '#059669',     // Emerald 600
          deep: '#064E3B',      // Dark emerald badge tint
          light: '#6EE7B7',     // Mint / Light emerald text
        },
        shopee: {
          DEFAULT: '#ee4d2d',
          dark: '#c43a1e',
        },
        tokopedia: {
          DEFAULT: '#03ac0e',
          dark: '#02850b',
        }
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'accent-sm': '0 2px 8px -1px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}


