# 🚀 Start Here: Warung Dewasa Local Design Studio

Welcome to your local, code-first design studio. You have complete control over all brand assets, tokens, design guides, and decision records directly inside this project repository.

---

## 🧭 Studio Folder Structure

```
studio/
├── AGENTS.md                  # Operating system & immutable rules for AI
├── START_HERE.md              # This guide & checklist
├── PROJECT_INDEX.md           # Decision log & asset tracking ledger
├── assets/
│   ├── brand/                 # Vector logos, icons, official stamps
│   ├── inspiration/           # Reference screenshots, UI inspirations
│   └── content/               # Product copywriting, merchant notes
├── brand-system/
│   ├── BRAND_GUIDELINES.md    # Voice, tone, typography, packaging guidelines
│   └── tokens.json            # Machine-readable Design Tokens
└── briefs/
    ├── TEMPLATE_BRIEF.md      # Standard brief format for new tasks
    └── BRIEF_STOREFRONT_REDESIGN.md
```

---

## ⚡ 3-Step Creation Workflow

### Step 1: Lock the Brief
Whenever you plan a new landing section, marketing campaign, product card variation, or modal:
1. Copy `studio/briefs/TEMPLATE_BRIEF.md`.
2. Fill out the 5 core decisions:
   - **Goal & Purpose**
   - **Target Audience**
   - **Core Message (After-state)**
   - **Output Format & Dimensions**
   - **Primary Action (CTA)**

### Step 2: Test Visually in Theme Editor
1. Start dev server: `npm run dev`
2. Open Admin Hub $\rightarrow$ Tab **🎨 Studio & Theme Editor**
3. Use the interactive sliders and color pickers to preview typography, corner radius, and emerald accents live against real components.
4. Click **"Terapkan ke Aplikasi Live"** to test changes instantly.
5. Export updated tokens to `studio/brand-system/tokens.json`.

### Step 3: Log in Project Index
Update `studio/PROJECT_INDEX.md` with the new asset path, date, and core rationale so the design history is preserved across all development sessions.
