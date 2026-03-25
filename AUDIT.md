# Audit Report — Nonco Stables App
Date: 2026-03-25

## Score: 6.5/10 (B-)

The app is functional and well-structured, but systemic inconsistencies in the design system, accessibility violations, and visual polish gaps prevent it from reaching institutional fintech quality. The biggest issue is that the design system exists on paper (CLAUDE.md + globals.css) but isn't enforced — most components bypass it.

---

## Critical (fix before showing to team)

- [ ] **`font-mono` on non-numeric text** — 25+ locations use JetBrains Mono for labels like "Portfolio", "Inflows", "Summary". The SectionLabel component itself propagates this. CLAUDE.md says mono = numbers only.
- [ ] **`text-white` vs `var(--text)`** — 60+ locations use pure white (#fff) instead of the design token warm off-white (#e5e2e1). Creates inconsistent warmth.
- [ ] **`--text-4` (#525252) fails WCAG AA contrast** — 2.6:1 ratio on #141414 backgrounds. Used in 40+ locations for labels, timestamps, metadata. Needs to be at least #737373.
- [ ] **All pages are `"use client"`** — Every page ships full component tree as client JS. Pages should be server components with client boundaries pushed down.
- [ ] **`text-[10px]` used in 55+ locations** — Below WCAG minimum and studio rules (14px body min). Combined with low-contrast --text-4, this text is nearly illegible.

## High (fix soon)

- [ ] **16 distinct text sizes** — Should be 5-7. Consolidate text-[7px]/[8px]/[9px]/[10px]/[11px] into fewer values.
- [ ] **13+ raw buttons** — Login (3), PriceCard (2), ConfirmDialog (2), favorites (2), export (2), error (1) all bypass the Button component.
- [ ] **6 custom tab groups missing ARIA roles** — CategoryTabs, BankFilter, TradesFilter×2, SettlementsTabs, SettlementTabs all lack `role="tablist"` / `aria-selected`.
- [ ] **Font loading via CSS @font-face** — Not using `next/font/local`. No preloading, no size-adjust for CLS.
- [ ] **framer-motion barrel imports** — 6 files import from `"framer-motion"` barrel. Missing `optimizePackageImports` in next.config.ts.
- [ ] **Confirmation dialog has no focus trap** — Tab navigates behind the modal.
- [ ] **Badge colors don't match CSS variables** — Green/purple badge backgrounds use different rgba values than --green/--purple tokens.
- [ ] **Bottom tab touch targets < 44px** — ~40px tap area, below WCAG minimum.
- [ ] **Settlement timeline overflows on mobile** — `flex justify-between` with 3 items + text labels at 375px.

## Medium (improve)

- [ ] **Card padding inconsistency** — 5 values (p-4, p-5, p-6, p-8, responsive). p-5 (20px) is off the 8pt grid.
- [ ] **8pt grid violations** — py-1.5, py-2.5, py-3.5, gap-0.5, gap-1.5, gap-2.5, px-2.5 in 40+ locations.
- [ ] **20+ inline section headers** — Should use SectionLabel component per CLAUDE.md.
- [ ] **smoothPath duplicated in 3 files** — balance-hero, historical-charts, sparkline.tsx.
- [ ] **Dead code: HistoricalCharts** — 370 lines, never imported (removed from dashboard but file remains).
- [ ] **Missing sitemap.ts and robots.ts** — No SEO files for the app.
- [ ] **Login page lacks `<main>` landmark** — No semantic wrapper.
- [ ] **5 form inputs missing labels** — Bank search, RFQ select, RFQ quantity, and others use placeholder only.
- [ ] **`--text-3` (#859396) borderline contrast** — 4.0:1, fails AA for small text (needs 4.5:1).
- [ ] **RFQ price text overflows at 375px** — text-4xl in 2-col grid is too wide.
- [ ] **Wallet holdings grid too dense at 375px** — grid-cols-2 clips long formatted values.
- [ ] **Bank KPI grid lacks mobile fallback** — grid-cols-2 with no grid-cols-1 base.

## Low (nice to have)

- [ ] **Active scale inconsistency** — active:scale-95 vs active:scale-[0.98] across app.
- [ ] **Border radius** — 6 values (full, xl, lg, md, default, sm). Could be 3-4.
- [ ] **MiniSparkline in favorites-grid** — Uses polyline instead of shared Sparkline component.
- [ ] **Dead asset: nonco-logo.svg** — Not referenced anywhere.
- [ ] **No @vercel/analytics or @vercel/speed-insights** — No production monitoring.
- [ ] **No OG image** — Link previews lack visual.
- [ ] **No metadataBase** — OG URLs are relative.
- [ ] **DeskOfferBanner timer runs when tab hidden** — Wastes battery.

---

## Stats
- Files scanned: 67
- Issues found: 44 (C: 5, H: 9, M: 12, L: 8)

## Top 5 Highest-Impact Fixes

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Change SectionLabel + all labels to `font-sans` | Fixes 25+ font violations | 30 min |
| 2 | Replace `text-white` with `text-[var(--text)]` app-wide | Fixes 60+ color inconsistencies | 20 min |
| 3 | Raise `--text-4` to `#737373` in globals.css | Fixes WCAG contrast everywhere | 1 min |
| 4 | Push `"use client"` down from pages to leaf components | Better SSR, smaller bundles | 2 hours |
| 5 | Switch to `next/font/local` | Eliminates font FOUT/CLS | 15 min |
