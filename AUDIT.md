# Audit Report — Nonco Stables App
Date: 2026-04-17

## Score: 6.5/10 (C+)

Pre-launch state. Core UX solid but blockers in accessibility, SEO metadata, and responsive layouts will hurt on first client review.

| Domain | Score | Grade |
|---|---|---|
| Performance | 6.0 | C+ |
| Security | 8.0 | A- |
| Code Quality | 7.5 | B+ |
| Accessibility | 5.5 | C |
| SEO & Meta | 6.5 | C+ |
| Responsive | 6.0 | C+ |

---

## Critical (fix before launch)

### Performance
- [ ] **Bare `<img>` tags instead of `next/image`** — `src/components/layout/sidebar.tsx:45`, `src/app/login/page.tsx:82,173`, `src/app/not-found.tsx:23`. Replace with next/image + explicit dims.
- [ ] **Missing `images` config in next.config.ts** — no AVIF/WebP, remotePatterns, deviceSizes. Add images block.

### Accessibility
- [ ] **Progress bars missing `role="progressbar"` + `aria-valuenow`/`aria-valuemax`** — `src/components/settlements/pending-settlements-table.tsx:194-210`, `settlement-card.tsx`. Screen readers can't announce completion.
- [ ] **AnimatedNumber has no `aria-live`** — `src/components/dashboard/balance-hero.tsx:20-70`. Counter animates 0 → final; AT users only hear initial state.
- [ ] **Decorative SVGs inconsistently hidden** — some have `aria-hidden="true"`, others don't. Sweep all `<svg>` and add `aria-hidden` where decorative.

### SEO & Meta
- [ ] **Missing `og:image` in root metadata** — `src/app/layout.tsx`. `opengraph-image.tsx` exists but isn't referenced.
- [ ] **Missing `twitter:image`** — `src/app/layout.tsx`. Twitter cards fall back but explicit is safer.

### Responsive
- [ ] **Fixed decorative `w-[500px]`/`w-[400px]` gradients on login** — `src/app/login/page.tsx:57,68,153`. Wasteful on mobile.

---

## High (fix soon)

### Performance
- [ ] **`next/image` with `fill` but no guaranteed container size** — `src/app/illustration-preview/page.tsx:29-35`. CLS risk.
- [ ] **ParticleGlobe initializes WebGL even when `hidden lg:block`** — `src/components/dashboard/balance-hero.tsx`, `layout/globe-background.tsx`. Gate Canvas on `clientWidth > 0` or use `IntersectionObserver`.
- [ ] **Duplicate Canvas instances** — both balance-hero and globe-background instantiate ParticleGlobe. Consolidate to one.
- [ ] **Suspense `fallback={null}`** — `src/app/(app)/dashboard/page.tsx:114`, `fx/page.tsx`. Add skeleton to prevent layout shift on RfsDialog hydration.

### Security
- [ ] **`innerHTML` for fetched SVG** — `src/components/ui/animated-illustration.tsx:36`. Use `DOMParser` + `appendChild` instead.
- [ ] **`innerHTML` for hardcoded SVG strings** — `src/components/ui/brand-shapes.tsx:102`. Prevents strict CSP. Use DOM methods.

### Code Quality
- [ ] **Hardcoded hex colors** — `src/app/(app)/onchain/page.tsx:18-32` (`#F6851B`, `#3B99FC`, `#0052FF`). CLAUDE.md forbids. Move to CSS vars or config.
- [ ] **Dynamic colors via inline `style={{}}`** — `src/app/(app)/fx/page.tsx:101,110,114,195,477-479`, `trades/page.tsx:354-356`. Scattered palettes; should use CSS vars.
- [ ] **Duplicate StatusDot logic** — `src/components/bank/transaction-table.tsx:39`, `dashboard/transaction-list.tsx:165`. Extract to `src/components/ui/status-dot.tsx`.

### Accessibility
- [ ] **Status animations not announced** — `pending-settlements-table.tsx:217-219`. Pulsing dot has no aria-label beyond visible "Processing" text.
- [ ] **Dialog focus management partial** — `src/components/ui/confirmation-dialog.tsx:173-177`. Focus trap exists but initial focus/`aria-describedby` incomplete.
- [ ] **Icon button in RFS dialog** — `src/components/rfs/rfs-dialog.tsx` refresh button lacks aria-label review.

### SEO & Meta
- [ ] **No canonical URLs** — `alternates.canonical` absent everywhere. Add to root metadata.
- [ ] **Segment layouts missing OG/Twitter** — 10+ `src/app/(app)/**/layout.tsx` only export title+description, no openGraph/twitter blocks.

### Responsive
- [ ] **333+ micro-font instances** (`text-[11px]`, `text-[10px]`, `text-[9px]`). Sweep sidebar nav labels, badges. WCAG fails below 14px for primary content.
- [ ] **Fixed grids without responsive variants** — `payments/page.tsx:129`, `fx/page.tsx:119`, `bridge/page.tsx:118`, `rfs-dialog.tsx:663,733`, `confirmation-dialog.tsx:226`. On 375px → 160px columns, crowded.
- [ ] **`grid-cols-3` without mobile variant** — `settlements-stats.tsx:48` — impossible to read under 768px. Add `grid-cols-1 md:grid-cols-3`.

---

## Medium (improve)

### Performance
- [ ] DPR `[1, 2]` hard-cap — consider `Math.min(window.devicePixelRatio, 2)` for 4K/3x displays.
- [ ] Inline GLSL shaders in `particle-globe.tsx:244-259` — extract to `.glsl` files.
- [ ] `texCache` map in particle-globe never cleared between route changes — memory leak if globe remounts.

### Security
- [ ] Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` in `next.config.ts`.
- [ ] Add `Content-Security-Policy` header after innerHTML cleanup.

### Code Quality
- [ ] `rfs-dialog.tsx` at 762 lines — split into sub-components (quote display, settlement select, summary).
- [ ] `animated-illustration.tsx` 391 lines, `price-card-active.tsx` 383 lines — review for extraction.
- [ ] Service stubs return mock data (`src/services/quotes.ts:4`, `balances.ts:4`, `transactions.ts:4`) — flagged as TODO, OK for MVP but track for backend wiring.

### Accessibility
- [ ] `var(--text-4)` = `rgba(255,255,255,0.5)` — passes AA on `#141414` but edges fail on lighter `#1c1b1b`. Audit per-background.
- [ ] No explicit `<h1>` per page — add `<h1 className="sr-only">Dashboard</h1>` etc.
- [ ] Table `<th>` missing `scope="col"` — `pending-settlements-table.tsx:77-101`.

### SEO & Meta
- [ ] Login page layout has title+description but no OG/Twitter.
- [ ] Sitemap only lists 3 routes (`/`, `/dashboard`, `/login`) — missing 12+ app routes. Should mirror `robots.ts` disallow list (as allowed for internal).

### Responsive
- [ ] Avatar button `w-7 h-7` (28px) — below 44×44 touch threshold. Bump to `w-10 h-10` or wrap with padding.
- [ ] No `max-w-*` constraint on main content — on 1920px+ layouts stretch edge-to-edge. Add `max-w-[1400px] mx-auto`.
- [ ] Sidebar nav `text-[12.5px]` hard to read at natural zoom — bump to `text-sm`.

---

## Low (nice to have)

### Performance
- [ ] Add `preload: true` to SpaceGrotesk/JetBrainsMono in `next/font/local`.
- [ ] Run svgo on `public/illustrations/*.svg` during build.

### Security
- [ ] Add `.env.example` with `NEXT_PUBLIC_SUPABASE_URL=` / `NEXT_PUBLIC_SUPABASE_ANON_KEY=` placeholders.
- [ ] Remove dev routes (`/chart-options`, `/illustration-preview`) before shipping, or gate with role.

### Code Quality
- [ ] Silent catch pattern `} catch { /* ignore */ }` for localStorage — fine but document or log in prod.
- [ ] ✅ No `console.log/warn/error` in src/.
- [ ] ✅ No `any` types.
- [ ] ✅ No unused imports in src/.

### Accessibility
- [ ] ✅ Focus-visible styles present and consistent (`button.tsx:15`).
- [ ] ✅ Skip link implemented (`(app)/layout.tsx:9-11`).
- [ ] ✅ `PageTransition` respects `prefers-reduced-motion`.

### Responsive
- [ ] Notification dropdown uses `w-[calc(100vw-2rem)]` — works but older browsers may cause horizontal scroll.
- [ ] ✅ Standard Tailwind breakpoints, no weird customs.
- [ ] ✅ Dashboard hero + login branding panel responsive.

---

## Stats

- **Files scanned:** ~180 TSX/TS files
- **Issues found:** 50
  - Critical: 8
  - High: 17
  - Medium: 16
  - Low: 9

## Recommended Fix Order

1. **Accessibility Critical** (progress bars, AnimatedNumber aria-live, SVG alt sweep) — ~2h
2. **SEO metadata** (og:image, twitter:image, canonical, segment OG blocks) — ~1h
3. **Performance image pipeline** (next.config.ts images block, replace bare `<img>`) — ~1.5h
4. **Responsive grids** (replace `grid-cols-2`/`grid-cols-3` with responsive variants) — ~1h
5. **innerHTML XSS cleanup** (DOMParser migration) — ~1h
6. **Code quality** (extract StatusDot, move hardcoded hex to config) — ~1h
7. **Headers** (HSTS, CSP once innerHTML clean) — ~30min

**Total to ship-ready (A-/B+ grade):** ~8h focused work.
