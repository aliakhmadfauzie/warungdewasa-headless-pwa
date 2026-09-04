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
        sans:    ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },

      // ── M3 Semantic Color Tokens ──────────────────────────────────────────
      // All values sourced from CSS variables in src/styles/tokens.css.
      // No hardcoded hex values — theme changes via CSS var reassignment only.
      colors: {
        // Primary role (Emerald brand / dynamic wallpaper in dark)
        md: {
          primary:              'var(--md-sys-color-primary)',
          'on-primary':         'var(--md-sys-color-on-primary)',
          'primary-container':  'var(--md-sys-color-primary-container)',
          'on-primary-container': 'var(--md-sys-color-on-primary-container)',

          secondary:              'var(--md-sys-color-secondary)',
          'on-secondary':         'var(--md-sys-color-on-secondary)',
          'secondary-container':  'var(--md-sys-color-secondary-container)',
          'on-secondary-container': 'var(--md-sys-color-on-secondary-container)',

          tertiary:              'var(--md-sys-color-tertiary)',
          'on-tertiary':         'var(--md-sys-color-on-tertiary)',
          'tertiary-container':  'var(--md-sys-color-tertiary-container)',
          'on-tertiary-container': 'var(--md-sys-color-on-tertiary-container)',

          error:              'var(--md-sys-color-error)',
          'on-error':         'var(--md-sys-color-on-error)',
          'error-container':  'var(--md-sys-color-error-container)',
          'on-error-container': 'var(--md-sys-color-on-error-container)',

          // Surface tonal elevation ladder
          // Replaces: bg-[#0B0F19], bg-[#111827], bg-slate-900 raw hex classes
          surface:                    'var(--md-sys-color-surface)',
          'on-surface':               'var(--md-sys-color-on-surface)',
          'surface-variant':          'var(--md-sys-color-surface-variant)',
          'on-surface-variant':       'var(--md-sys-color-on-surface-variant)',
          'surface-container-lowest': 'var(--md-sys-color-surface-container-lowest)',
          'surface-container-low':    'var(--md-sys-color-surface-container-low)',
          'surface-container':        'var(--md-sys-color-surface-container)',
          'surface-container-high':   'var(--md-sys-color-surface-container-high)',
          'surface-container-highest':'var(--md-sys-color-surface-container-highest)',

          // Outline — semantic border roles
          outline:         'var(--md-sys-color-outline)',
          'outline-variant': 'var(--md-sys-color-outline-variant)',

          // Marketplace brand extension tokens (exempt from dynamic theming)
          shopee:       'var(--md-custom-color-shopee)',
          'on-shopee':  'var(--md-custom-color-on-shopee)',
          tokopedia:    'var(--md-custom-color-tokopedia)',
          'on-tokopedia': 'var(--md-custom-color-on-tokopedia)',
          'amber-badge':    'var(--md-custom-color-amber-badge)',
          'on-amber-badge': 'var(--md-custom-color-on-amber-badge)',
        },

        // Legacy surface tokens — kept for backward compatibility during migration.
        // TODO: Replace all usages with md.surface-container-* equivalents, then remove.
        surface: {
          0: '#0B0F19',
          1: '#111827',
          2: '#1E293B',
          3: '#334155',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          muted:  '#1F2937',
          active: '#374151',
        },
        accent: {
          primary: '#10B981',
          hover:   '#059669',
          deep:    '#064E3B',
          light:   '#6EE7B7',
        },
        // Legacy marketplace colors — kept for existing components not yet migrated
        shopee:    { DEFAULT: '#ee4d2d', dark: '#c43a1e' },
        tokopedia: { DEFAULT: '#03ac0e', dark: '#02850b' },
      },

      // ── M3 Shape Scale ────────────────────────────────────────────────────
      // Matches the 5-step Compose shape system (extraSmall → extraLarge)
      borderRadius: {
        'm3-xs':   '4px',     // Dense chips, inner metadata badges
        'm3-sm':   '8px',     // FilterChip, category pills
        'm3-md':   '12px',    // Input fields, icon containers
        'm3-lg':   '16px',    // Product cards, order cards
        'm3-xl':   '28px',    // Bottom sheets, dialogs, FABs
        'm3-full': '9999px',  // Pill CTA buttons (Shopee, Direct COD)
      },

      // ── M3 Spring Motion Curves ───────────────────────────────────────────
      // Replaces: `ease-out`, `ease-in-out`, raw `cubic-bezier(...)` strings
      transitionTimingFunction: {
        'm3-expressive-fast':    'var(--md-sys-motion-easing-expressive-fast)',
        'm3-expressive-spatial': 'var(--md-sys-motion-easing-expressive-spatial)',
      },
      transitionDuration: {
        'm3-fast':    'var(--md-sys-motion-duration-expressive-fast)',    // 150ms
        'm3-spatial': 'var(--md-sys-motion-duration-expressive-spatial)', // 500ms
      },

      // Existing shadow tokens — retained for components not yet migrated
      boxShadow: {
        'card':       '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'accent-sm':  '0 2px 8px -1px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
};
