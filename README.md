# 🛍️ Warung Dewasa Abang Dugem - Headless E-Commerce PWA

[![Live Production](https://img.shields.io/badge/Live-warungdewasa.web.app-059669?style=for-the-badge&logo=firebase&logoColor=white)](https://warungdewasa.web.app)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-10B981?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

Official Headless E-Commerce Progressive Web App (PWA) for **Warung Dewasa Abang Dugem**, featuring zero-polling real-time inventory synchronization, Shopee-style product showcase, 1-tap COD Medan instant delivery with OpenStreetMap address geocoding, multi-channel payment verification, and dedicated mobile-optimized merchant management hub.

---

## 🌟 Key Features

### 🛒 1. Shopee-Style E-Commerce Showcase
- **1:1 Aspect Ratio Catalog Grid**: High-density 2-column mobile feed and 5-column desktop responsive grid.
- **Shopee Arrangement & Sort Bar**: Quick filter by *Terkait*, *Terlaris*, *Terbaru*, *Harga Termurah / Tertinggi*.
- **Trust Ribbons & Benefit Chips**: Official Shop ribbon, COD Medan badge, Privacy Guarantee, and 100% Original verification tags.
- **Social Proof & Rating**: Live star ratings, verified sold counters, and regional location tag (*📍 Kota Medan*).
- **Direct Marketplace Deep Linking**: 1-tap checkout to official **Shopee** & **Tokopedia** product pages.

### 🚚 2. Direct Order & COD Medan Workflow
- **Free OpenStreetMap Address Autocomplete**: Instant location suggestions with Nominatim API and reverse geocoding pin drops.
- **Multi-Category Payment Hub**: COD (Cash on Delivery), QRIS, Bank Transfer (BCA, Mandiri, BRI, BNI), and E-Wallets (GoPay, ShopeePay, OVO, DANA).
- **Direct Transfer Receipt Upload**: Instant client-side receipt attachment preview with secure Cloud Storage caching.
- **Automated WhatsApp Follow-ups**: Pre-filled customer and merchant notifications.

### 🌓 3. Full-Page Theme System
- **Dynamic Dark / Light Mode Switcher**: Instant switching between Obsidian Glassmorphic Dark Mode (`#0B0F19`) and Crisp Emerald Light Mode (`#F4F6F9`) with full WCAG AAA color contrast safety.

### 💼 4. Mobile-Optimized Merchant Dashboard
- **Responsive Mobile Tab Bar**: Swipeable navigation between Product Manager, Direct Orders, Request Inbox, and Notes Manager.
- **Inline Stock & Status Management**: Quick toggles for Ready Stock, Low Stock, Pre-Order, and Out of Stock.
- **Direct Order Processing Pipeline**: Status stepper (`Menunggu Konfirmasi` → `Diproses` → `Dikirim / Kurir OTW` → `Selesai`).

### ⚡ 5. Web Performance & PWA Architecture
- **Compositor-Threaded CSS Animations**: Zero main-thread blocking during critical LCP window.
- **Deferred Three.js WebGL Engine**: Non-blocking ambient 3D crystal particle background initialized on `requestIdleCallback`.
- **Progressive Batch Rendering**: High-performance batch card reveals with sub-50ms React task duration.
- **Service Worker Offline Engine**: Automatic shell caching and offline catalog accessibility.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/gradiuzz2009/warungdewasa-headless-pwa.git

# Navigate to project directory
cd warungdewasa-headless-pwa

# Install dependencies
npm install
```

### Local Development
```bash
npm run dev
```

### Production Build & Type Check
```bash
# Type check with zero implicit any
npx tsc --noEmit

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Firebase Hosting Deployment
```bash
npx firebase deploy --only hosting --project saltdistribute-2026
```

---

## 🏛️ Architecture & Tech Stack

```
src/
├── admin/                     # Merchant Dashboard & Management Screens
│   ├── AdminDashboard.tsx     # KPI Overview & Tab Navigation
│   ├── DirectOrderManager.tsx # COD & Direct Orders Pipeline
│   ├── ProductManager.tsx     # SKU Catalog & Stock Controller
│   ├── RequestInbox.tsx       # Custom Customer Requests
│   └── NotesManager.tsx       # Merchant Tips & Product Knowledge
├── components/                # Reusable UI Primitives & Modals
│   ├── AppLogo.tsx            # Custom WD Vector Brand Emblem
│   ├── DirectOrderModal.tsx   # Direct Checkout & OpenStreetMap Modal
│   ├── FilterOverlayModal.tsx # Filter & Sorting Sheet
│   ├── HeroMotion.tsx         # Composite Hero Section
│   ├── Navbar.tsx             # Floating Glass Header & Brand
│   ├── PaymentMethodsShortcutModal.tsx # Payment Hub Modal
│   ├── ProductCard.tsx        # Shopee 1:1 Product Card Anatomy
│   └── ProductDetailModal.tsx # Full Product Specs & Swiper Modal
├── context/                   # Global State & Theme
│   └── ThemeContext.tsx       # Dark / Light Theme Sync
├── lib/                       # API Services & Supabase / Firestore Engine
└── index.css                  # Design Tokens & Light/Dark Palette
```

---

## 📄 License
Private & Proprietary © Warung Dewasa Abang Dugem. All rights reserved.
