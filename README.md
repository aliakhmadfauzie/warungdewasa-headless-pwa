# 🛍️ Warung Dewasa Abang Dugem — Headless E-Commerce PWA

[![Live Production](https://img.shields.io/badge/Live-warungdewasa.web.app-059669?style=for-the-badge&logo=firebase&logoColor=white)](https://warungdewasa.web.app)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-10B981?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

**Warung Dewasa Abang Dugem** is a modern headless e-commerce Progressive Web App (PWA) built for discreet adult wellness, lifestyle, and novelty retail. It features zero-polling real-time inventory synchronization, Shopee-style product catalogs, Three.js 3D interactive product visualization, 1-tap Cash-on-Delivery (COD) Medan instant courier dispatch with OpenStreetMap geocoding, multi-channel payment verification, and an offline-first mobile merchant dashboard.

---

## 🌟 Key Features

### 🛒 1. Shopee-Style E-Commerce Showcase
- **Category Filter Tabs**: Fast filtering across categories with pill badges and badge counters.
- **Three.js 3D Product Inspector**: Interactive 360-degree product examination powered by Three.js shaders.
- **Flash Sale Counter & Sticky Cart**: High-conversion floating cart with live subtotal calculation and checkout triggers.

### 📍 2. 1-Tap COD Medan Instant Delivery
- **OpenStreetMap & Leaflet Geocoding**: Reverse-geocodes customer coordinates to address text instantly.
- **Discreet Packaging Guarantee**: Automated packaging privacy slips hiding sensitive product identifiers.

### 💳 3. Multi-Channel Payment Verification
- Supports QRIS static/dynamic scanning, BCA/Mandiri virtual accounts, and instant COD courier verification.

### 📱 4. Installable Progressive Web App (PWA)
- Full Service Worker caching, offline catalog browsing, background sync, and instant home screen installation.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS, Lucide React, Framer Motion, GSAP
- **3D Graphics**: Three.js (`@types/three`)
- **Backend / Database**: Supabase (`@supabase/supabase-js`) & Firebase Hosting
- **Maps & Geolocation**: OpenStreetMap / Leaflet

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/aliakhmadfauzie/warungdewasa-headless-pwa.git
cd warungdewasa-headless-pwa

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License
Maintained by **Ali Akhmad Fauzie** ([@aliakhmadfauzie](https://github.com/aliakhmadfauzie)). All rights reserved.
