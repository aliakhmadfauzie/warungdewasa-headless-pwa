# 🎨 Warung Dewasa - UI Theme & Design System Documentation

This document contains the extracted theme configuration, color tokens, CSS styles, typography, glassmorphism specs, and Tailwind configuration for the **Warung Dewasa Headless E-Commerce PWA**.

---

## 📑 Table of Contents
1. [Design Token System (`src/theme/tokens.ts`)](#1-design-token-system-srcthemetokensts)
2. [Tailwind CSS Configuration (`tailwind.config.js`)](#2-tailwind-css-configuration-tailwindconfigjs)
3. [Global CSS & Light/Dark Theme Styles (`src/index.css`)](#3-global-css--lightdark-theme-styles-srcindexcss)
4. [Color Palette & Token Reference Table](#4-color-palette--token-reference-table)
5. [Typography & Elevation Tokens](#5-typography--elevation-tokens)

---

## 1. Design Token System (`src/theme/tokens.ts`)

```typescript
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
  colors: {
    canvas: primitives.colors.slate[950],       // #0B0F19 Neutral Dark Canvas
    canvasForest: primitives.colors.emerald[950], // #0A1A14 Deep Forest Dark
    surface: primitives.colors.slate[900],      // #111827 Neutral Card Surface
    surfaceVariant: '#161F30',                  // Elevated Product Container
    surfaceHover: '#1E293B',
    surfaceOverlay: 'rgba(11, 15, 25, 0.85)',
    
    // Primary Brand Accents
    primary: primitives.colors.emerald[600],    // #006C4C Material 3 Emerald
    primaryHover: primitives.colors.emerald[500],
    primaryContainer: 'rgba(0, 108, 76, 0.15)',
    accentMint: primitives.colors.emerald[400], // #34D399 Vibrant Mint
    
    // High Contrast Typography
    textPrimary: '#FFFFFF',
    textSecondary: primitives.colors.slate[300],// #CBD5E1 AA Contrast
    textMuted: primitives.colors.slate[400],    // #94A3B8
    textInverse: primitives.colors.slate[950],
    
    // Borders & Dividers
    border: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderFocus: primitives.colors.emerald[500],
    
    // Semantic States
    success: primitives.colors.emerald[400],
    warning: primitives.colors.semantic.amber.bg,
    danger: primitives.colors.semantic.rose.bg,
    info: primitives.colors.semantic.sky.bg,
    
    // Marketplace Direct Links
    shopee: primitives.colors.semantic.shopee,
    tokopedia: primitives.colors.semantic.tokopedia
  },
  glass: {
    level1: {
      background: 'rgba(17, 24, 39, 0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
    },
    level2: {
      background: 'rgba(22, 31, 48, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 108, 76, 0.1)'
    },
    modal: {
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
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
```

---

## 2. Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
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
```

---

## 3. Global CSS & Light/Dark Theme Styles (`src/index.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-main: #0B0F19;
    --bg-card: #111827;
    --border-subtle: rgba(255, 255, 255, 0.08);
    --accent-primary: #10B981;
    --text-primary: #F9FAFB;
    --text-secondary: #E2E8F0;
    --text-muted: #94A3B8;
  }

  html.dark,
  body.dark {
    --bg-main: #0B0F19;
    --bg-card: #111827;
    --border-subtle: rgba(255, 255, 255, 0.08);
    --accent-primary: #10B981;
    --text-primary: #F9FAFB;
    --text-secondary: #E2E8F0;
    --text-muted: #94A3B8;
    color-scheme: dark;
  }

  html:not(.dark),
  body:not(.dark) {
    --bg-main: #F4F6F9;
    --bg-card: #FFFFFF;
    --border-subtle: #E2E8F0;
    --accent-primary: #059669;
    --text-primary: #0F172A;
    --text-secondary: #334155;
    --text-muted: #64748B;
    color-scheme: light;
  }

  body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    min-height: 100vh;
    transition: background-color 0.25s ease, color 0.25s ease;
  }
}

@layer components {
  /* Clean Neutral & Gradient Card Surfaces */
  .surface-card {
    background-color: var(--bg-card);
    border: 1px solid var(--border-subtle);
  }

  .card-gradient-surface {
    background: linear-gradient(180deg, #151D2F 0%, #0E1524 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }

  html:not(.dark) .card-gradient-surface {
    background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
    border: 1px solid #E2E8F0;
    box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.06);
  }

  .surface-elevated {
    background: linear-gradient(180deg, #1E293B 0%, #151E2E 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  html:not(.dark) .surface-elevated {
    background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
    border: 1px solid #E2E8F0;
  }

  .surface-modal {
    background-color: #111827;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  }

  html:not(.dark) .surface-modal {
    background-color: #FFFFFF;
    border: 1px solid #E2E8F0;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }

  /* Sophisticated Text & Button Gradients */
  .text-gradient-emerald {
    background: linear-gradient(135deg, #34D399 0%, #2DD4BF 50%, #38BDF8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .text-gradient-silver {
    background: linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 60%, #94A3B8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .btn-gradient-emerald {
    background: linear-gradient(135deg, #059669 0%, #10B981 50%, #0D9488 100%);
    border: 1px solid rgba(52, 211, 153, 0.3);
    box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.35);
  }

  .badge-gradient-emerald {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 148, 136, 0.1) 100%);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: #6EE7B7;
  }
}
```

---

## 4. Color Palette & Token Reference Table

| Category | Token Name | Dark Value | Light Value | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas** | `canvas` | `#0B0F19` | `#F8FAF9` | Primary page background |
| **Canvas Alt** | `canvasForest` | `#0A1A14` | `#ECFDF5` | Signature brand dark/light tint |
| **Surface 1** | `surface` | `#111827` | `#FFFFFF` | Standard card and modal containers |
| **Surface 2** | `surfaceVariant` | `#161F30` | `#F1F5F9` | Elevated product containers |
| **Primary** | `primary` | `#006C4C` | `#006C4C` | Material 3 Emerald brand core |
| **Mint Accent**| `accentMint` | `#34D399` | `#006C4C` | Vibrant badges, active highlights |
| **Shopee** | `shopee.primary` | `#EE4D2D` | `#EE4D2D` | Shopee direct deep link button |
| **Tokopedia** | `tokopedia.primary`| `#03AC0E` | `#03AC0E` | Tokopedia direct deep link button |
| **Text Main** | `textPrimary` | `#FFFFFF` | `#0B0F19` | High contrast body & titles |
| **Text Muted** | `textMuted` | `#94A3B8` | `#64748B` | Subtitles and meta labels |

---

## 5. Typography & Elevation Tokens

- **Display Font**: `Outfit` (Headings, price tags, metric numbers)
- **Body Font**: `Plus Jakarta Sans` (Body copy, form inputs, buttons)
- **Glassmorphism Levels**:
  - **Level 1**: `backdrop-filter: blur(12px)`, `rgba(17, 24, 39, 0.75)`
  - **Level 2**: `backdrop-filter: blur(16px)`, `rgba(22, 31, 48, 0.85)`
  - **Modal**: `backdrop-filter: blur(20px)`, `rgba(17, 24, 39, 0.95)`
- **Minimum Touch Target**: 48px × 48px accessibility standard.

---

## 6. Jetpack Compose Theme (`Theme.kt` & M3 Color Schemes)

```kotlin
package com.warungdewasa.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val ShopeeOrange = Color(0xFFEE4D2D)
val TokopediaGreen = Color(0xFF03AC0E)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF006C4C),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFD1FAE5),
    onPrimaryContainer = Color(0xFF00261B),
    secondary = Color(0xFF00523A),
    secondaryContainer = Color(0xFFECFDF5),
    onSecondaryContainer = Color(0xFF003B2A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF0B0F19),
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = Color(0xFF64748B),
    outline = Color(0xFFE2E8F0)
)

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF34D399),
    onPrimary = Color(0xFF003B2A),
    primaryContainer = Color(0xFF00523A),
    onPrimaryContainer = Color(0xFFA7F3D0),
    secondary = Color(0xFF6EE7B7),
    secondaryContainer = Color(0xFF161F30),
    onSecondaryContainer = Color(0xFFCBD5E1),
    surface = Color(0xFF0B0F19),
    onSurface = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFF111827),
    onSurfaceVariant = Color(0xFF94A3B8),
    outline = Color(0x14FFFFFF) // 8% White border
)

@Composable
fun WarungDewasaTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}
```

