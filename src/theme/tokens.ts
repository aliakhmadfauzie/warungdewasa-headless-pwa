/**
 * Material 3 Emerald Design System Tokens
 * Supports both Deep Forest Dark Mode (#0A1A14 / #0B0F19) and Ceramic Slate Light Mode (#F8FAF9).
 * Grounded in Material 3 Emerald (#006C4C), Mint (#34D399), and Multi-Layered Glassmorphic elevations.
 */

export const primitives = {
  colors: {
    emerald: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      200: '#A7F3D0',
      300: '#6EE7B7',
      400: '#34D399', // Mint Accent
      500: '#10B981',
      600: '#006C4C', // Material 3 Emerald Primary Brand
      700: '#00523A',
      800: '#003B2A',
      900: '#00261B',
      950: '#0A1A14'  // Deep Forest Signature Dark
    },
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9', // Ceramic Slate Light Surface
      200: '#E2E8F0',
      300: '#CBD5E1', // High Contrast Text on Dark
      400: '#94A3B8', // Muted Secondary Text
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#111827', // Slate 900 Card Surface
      950: '#0B0F19'  // Slate 950 Neutral Canvas
    },
    semantic: {
      amber: {
        bg: '#F59E0B',
        light: '#FEF3C7',
        dark: '#78350F'
      },
      rose: {
        bg: '#EF4444',
        light: '#FEE2E2',
        dark: '#7F1D1D'
      },
      sky: {
        bg: '#0EA5E9',
        light: '#E0F2FE',
        dark: '#0C4A6E'
      },
      shopee: {
        primary: '#EE4D2D',
        text: '#FF5722',
        surface: 'rgba(238, 77, 45, 0.15)'
      },
      tokopedia: {
        primary: '#03AC0E',
        text: '#00AA5B',
        surface: 'rgba(3, 172, 14, 0.15)'
      }
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48
  },
  radii: {
    none: '0px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px'
  },
  typography: {
    fontFamilies: {
      display: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      body: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    fontSizes: {
      '2xs': '10px',
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px'
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900'
    },
    letterSpacing: {
      tighter: '-0.03em',
      tight: '-0.015em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  touchTarget: {
    minHeight: 48,
    minWidth: 48
  }
} as const;

export const darkTheme = {
  mode: 'dark' as const,
  palette: 'Deep Forest Nocturne',
  colors: {
    canvas: '#0A1A14',                          // Deep Forest Dark Canvas
    canvasForest: '#0A1A14',
    canvasSlate: primitives.colors.slate[950],  // #0B0F19 Neutral fallback
    surface: '#0F261D',                         // Deep Forest Card Surface
    surfaceVariant: '#143327',                  // Elevated Product Container
    surfaceHover: '#1C4435',
    surfaceOverlay: 'rgba(10, 26, 20, 0.90)',
    
    // Primary Brand Accents
    primary: '#006C4C',                         // Rich Material 3 Emerald
    primaryHover: '#059669',
    primaryContainer: 'rgba(0, 108, 76, 0.20)',
    accentMint: '#2DD4BF',                      // Teal Mint Accent
    
    // High Contrast Typography
    textPrimary: '#FFFFFF',
    textSecondary: '#E2E8F0',                   // High Contrast Text
    textMuted: '#94A3B8',
    textInverse: '#0A1A14',
    
    // Borders & Dividers
    border: 'rgba(45, 212, 191, 0.15)',
    borderSubtle: 'rgba(45, 212, 191, 0.08)',
    borderFocus: '#2DD4BF',
    
    // Semantic States
    success: '#2DD4BF',
    warning: primitives.colors.semantic.amber.bg,
    danger: primitives.colors.semantic.rose.bg,
    info: primitives.colors.semantic.sky.bg,
    
    // Marketplace Direct Links
    shopee: primitives.colors.semantic.shopee,
    tokopedia: primitives.colors.semantic.tokopedia
  },
  glass: {
    level1: {
      background: 'rgba(15, 38, 29, 0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(45, 212, 191, 0.12)',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
    },
    level2: {
      background: 'rgba(20, 51, 39, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(45, 212, 191, 0.20)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 108, 76, 0.15)'
    },
    modal: {
      background: 'rgba(15, 38, 29, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(45, 212, 191, 0.20)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
    }
  },
  elevation: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    floating: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    glowEmerald: '0 0 24px rgba(0, 108, 76, 0.25)'
  }
};

export const lightTheme = {
  mode: 'light' as const,
  colors: {
    canvas: '#F8FAF9',                         // Ceramic Slate Light Canvas
    canvasForest: primitives.colors.emerald[50],
    surface: '#FFFFFF',                        // Pure White Surface
    surfaceVariant: primitives.colors.slate[100], // #F1F5F9 Elevated Container
    surfaceHover: '#E2E8F0',
    surfaceOverlay: 'rgba(248, 250, 249, 0.9)',
    
    // Primary Brand Accents
    primary: primitives.colors.emerald[600],    // #006C4C Material 3 Emerald
    primaryHover: primitives.colors.emerald[700],
    primaryContainer: primitives.colors.emerald[100],
    accentMint: primitives.colors.emerald[600],
    
    // Typography
    textPrimary: primitives.colors.slate[950],  // #0B0F19
    textSecondary: primitives.colors.slate[700],// #334155
    textMuted: primitives.colors.slate[500],    // #64748B
    textInverse: '#FFFFFF',
    
    // Borders & Dividers
    border: 'rgba(0, 0, 0, 0.08)',
    borderSubtle: 'rgba(0, 0, 0, 0.04)',
    borderFocus: primitives.colors.emerald[600],
    
    // Semantic States
    success: primitives.colors.emerald[600],
    warning: '#D97706',
    danger: '#DC2626',
    info: '#0284C7',
    
    // Marketplace Direct Links
    shopee: primitives.colors.semantic.shopee,
    tokopedia: primitives.colors.semantic.tokopedia
  },
  glass: {
    level1: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
    },
    level2: {
      background: 'rgba(248, 250, 249, 0.9)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 0 15px rgba(0, 108, 76, 0.05)'
    },
    modal: {
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
    }
  },
  elevation: {
    card: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
    floating: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    glowEmerald: '0 0 20px rgba(0, 108, 76, 0.12)'
  }
};

export type ThemeTokens = typeof darkTheme;
export type ThemeMode = 'dark' | 'light';

export function getThemeTokens(mode: ThemeMode = 'dark'): ThemeTokens {
  return mode === 'light' ? (lightTheme as unknown as ThemeTokens) : darkTheme;
}
