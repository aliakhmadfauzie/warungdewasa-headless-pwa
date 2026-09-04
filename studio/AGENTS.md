# 🤖 Codex / Antigravity Agent Operating Instructions

> **DURABLE OPERATING SYSTEM FOR WARUNG DEWASA LOCAL DESIGN STUDIO**  
> *Always read this file before generating, modifying, or exporting any design, copy, or frontend code.*

---

## 🎯 1. Core Mission & Philosophy
Warung Dewasa is a headless e-commerce PWA and native Android app offering discreet adult wellness products with instant direct COD delivery in Kota Medan.
Every generated UI, layout, and copy element must embody intentional human decisions:
- **Clarity and relief beat generic speed.**
- **Make important things stand out with size, weight, and space before reaching for color.**
- **Equal weight across elements reads as zero weight.**

---

## 🛡️ 2. Source-of-Truth Protections (Immutable Rules)
1. **Never Silently Overwrite Brand Tokens:**
   - Always read `studio/brand-system/tokens.json` and `src/theme/tokens.ts`.
   - Modifying tokens requires an explicit, confirmed studio task.
2. **Never Flatten Output Formats:**
   - Prefer editable React components (`.tsx`), clean SVG vectors, and structured Markdown over flat raster mockups.
3. **Strict Touch Target Ergonomics:**
   - Every interactive button, input, or trigger MUST maintain at least **48px × 48px** (or minimum 44px on compact mobile toolbars) with `active:scale-95` tap feedback.
4. **Color Discipline (Prompt 06):**
   - **Emerald (`#006C4C` / `#10B981`)** is strictly reserved for Primary Conversion actions (`Pesan Cepat COD`, `Ready Stock`).
   - **Amber (`#F59E0B`)** is strictly reserved for Urgency/Pending alerts (`Perlu Dikirim`, `Stok Terbatas`).
   - **Shopee Orange (`#EE4D2D`) & Tokopedia Green (`#03AC0E`)** are solely for marketplace redirect chips.
   - All cards, panels, and backgrounds remain calm neutral dark slate (`#0B0F19`, `#111827`, `#1E293B`).

---

## 📐 3. Human UI 7-Step Sequence Checklist
Before finalizing any UI screen or feature:
- [ ] **01. Sharpen the Message:** One clear headline promise, only one key phrase highlighted in accent color.
- [ ] **02. Break the Symmetry:** Asymmetric grid with an interactive highlight card pulling attention.
- [ ] **03. Build the Argument:** Structured narrative flow ($\text{Qualifier} \rightarrow \text{Hero} \rightarrow \text{Why It's Different} \rightarrow \text{Winner} \rightarrow \text{Catalog} \rightarrow \text{Reassurance}$).
- [ ] **04. Pick the Winner:** Dedicated dominant space for top-performing SKU and primary CTA button.
- [ ] **05. Scale the Type:** Clear, dramatic typographic jumps (Display Outfit $\gg$ Section Header $\gg$ Body $\gg$ Quiet Kicker).
- [ ] **06. Give Color Meaning:** Bright accent applied strictly to the #1 desired action.
- [ ] **07. Add a Signature:** Consistent `.kicker-badge` with pulsing green dot and `.signature-card` border styling.

---

## 🗂️ 4. Asset Creation Workflow
1. Start with a saved brief in `studio/briefs/`.
2. Propose direction and wait for checkpoint approval.
3. Inspect visually in the **Theme Editor** or browser dev server.
4. Log all additions in `studio/PROJECT_INDEX.md`.
