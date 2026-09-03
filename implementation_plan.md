# Dark/Light Theme Toggle Implementation Plan

## Goal
Add a UI toggle that switches between dark and light themes across the PWA, using the existing design tokens in `src/theme/tokens.ts`.

## User Review Required
> [!IMPORTANT]
> Confirm where you want the theme toggle placed (e.g., in the top Navbar) and whether the selected theme should be persisted across sessions (e.g., using `localStorage`).

## Open Questions
> [!WARNING]
> - Should the toggle be a simple button/icon in the Navbar, or a dedicated component elsewhere?
> - Do you want the theme preference saved in the browser so it persists after reload?
> - Should the initial theme respect the user's OS prefers‑color‑scheme preference?

## Proposed Changes
---
### Theme Context
- **[NEW] src/theme/ThemeContext.tsx**
  - Create a React context providing `{ mode, toggleMode }`.
  - Initialize mode based on `localStorage` (if present) or `window.matchMedia('(prefers-color-scheme: dark)')`.
  - Export a `ThemeProvider` component that wraps children.
  - Use `getThemeTokens` to compute the token set and expose it via context.

### App Wrapper
- **[MODIFY] src/App.tsx**
  - Import `ThemeProvider` and wrap the entire app JSX with it.
  - Pass the theme tokens to components via a custom hook `useTheme` (from context).

### Navbar UI Toggle
- **[MODIFY] src/components/Navbar.tsx**
  - Import `useTheme` from the new context.
  - Add a button (e.g., moon/sun icons from `lucide-react`) that calls `toggleMode`.
  - Style the button to match the design system (use `bg-emerald-600` when dark, `bg-slate-800` when light, etc.).
  - Ensure the button has appropriate `aria-label` and a minimum touch target (48dp).

### Theme Consumption
- Update any component that references hard‑coded colors (e.g., background classes) to use the context values where appropriate. Most of the app already uses token‑based classes, so no further changes needed.

### Types
- **[NEW] src/theme/types.ts** (optional) to export `ThemeContextValue` for strong typing.

## Verification Plan
### Automated Tests
- Run `npm run test` (if tests exist) to ensure no regressions.

### Manual Verification
- Launch the app (`npm run dev`).
- Verify that clicking the toggle switches the UI between dark and light modes.
- Refresh the page – the previously selected theme should persist (if enabled).
- Check that the Navbar button is accessible (keyboard focus, ARIA label, touch target >=48dp).

---
*Implementation will follow after your confirmation on the open questions.*
