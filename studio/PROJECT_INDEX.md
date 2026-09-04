# 📜 Studio Project Index & Decision Trail

> **LIVING ASSET LEDGER & DESIGN DECISION LOG**  
> Tracks all design system updates, major components, and campaign deliverables.

---

## 🗂️ Active Assets & System Components

| Asset ID | Category | Name / Target | Source Path | Status | Last Updated |
|---|---|---|---|---|---|
| `DS-TOKENS-01` | System | Material 3 Emerald Tokens | `studio/brand-system/tokens.json` & `src/theme/tokens.ts` | Approved | 2026-09-04 |
| `DS-GUIDE-01` | System | Brand Guidelines | `studio/brand-system/BRAND_GUIDELINES.md` | Approved | 2026-09-04 |
| `DOC-THEME-01` | Architecture | Extracted Theme Specs & Kotlin Theme | `docs/current_ui_theme.md` | Active | 2026-09-04 |
| `DOC-LAYOUT-01` | Architecture | Dashboard Layouts & XML Specs | `docs/dashboard_layout.md` | Active | 2026-09-04 |
| `UI-HERO-01` | Component | Asymmetric Hero & Courier Simulator | `src/components/HeroMotion.tsx` | Active | 2026-09-04 |
| `UI-QUALIFIER-01`| Component | Audience Qualifier Strip | `src/components/AudienceQualifierStrip.tsx` | Active | 2026-09-04 |
| `UI-ARGUMENT-01` | Component | Why Warung Dewasa Comparison | `src/components/WhyWarungDewasaSection.tsx` | Active | 2026-09-04 |
| `UI-WINNER-01` | Component | Top Recommended Spotlight | `src/components/FeaturedWinnerSection.tsx` | Active | 2026-09-04 |
| `UI-REASSURE-01` | Component | Closing Reassurance & CTA | `src/components/ClosingReassuranceSection.tsx` | Active | 2026-09-04 |
| `UI-STUDIO-01` | Tooling | Interactive Visual Theme Editor | `src/admin/ThemeEditor.tsx` | Active | 2026-09-04 |

---

## 📝 Decision Trail History

### [2026-09-04] — Human UI 7-Step Sequence Overhaul
- **Brief**: `studio/briefs/BRIEF_STOREFRONT_REDESIGN.md`
- **Key Decisions**:
  - Replaced generic headline copy with a clear, specific promise tailored to Medan buyers seeking 100% discretion and relief from public order histories.
  - Replaced centered hero with an asymmetric 12-column grid featuring a live courier readiness highlight card.
  - Added dedicated narrative beats: Qualifier Strip $\rightarrow$ Why It's Different $\rightarrow$ Winner Spotlight $\rightarrow$ Reassurance.
  - Locked touch targets to a minimum of 48px with active tap feedback.
  - Enforced strict color discipline: Emerald accent reserved strictly for primary conversions.

### [2026-09-04] — Local Design Studio Scaffolding (Codex Design)
- **Key Decisions**:
  - Initialized local folder studio architecture (`studio/`) to break reliance on cloud design caps.
  - Built an in-browser Visual Theme Editor with real-time CSS variable injection and `tokens.json` export.

### [2026-09-04] — Human UI Component Standardization & Winner/Type Scaling
- **Key Decisions**:
  - Implemented `isWinner` prop on `ProductCard.tsx` with exclusive `#1 Pilihan Terlaris Medan` ribbon, ring highlight, and ambient glow in catalog grid.
  - Re-scaled typography hierarchy inside `ProductCard` (jump to `text-base sm:text-xl font-black` for price, crisp regular weight for titles, micro uppercase tracking for kickers).
  - Subdued secondary marketplace buttons (Shopee & Tokopedia) into quiet ghost outline links so the primary `Pesan Cepat (COD)` CTA dominates unequivocally.
  - Standardized `ProductDetailModal.tsx` and `SpecialRequestModal.tsx` to align with Warung Dewasa brand voice, privacy guarantees, and 48px touch targets.
