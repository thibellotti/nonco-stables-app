# Audit Report — Nonco Stables App
Date: 2026-04-08

## Score: 5.5/10 (C+)

Comprehensive 6-domain audit (Performance, Security, Code Quality, Accessibility, SEO, Responsive) across 91 source files. The codebase has strong TypeScript discipline (strict mode, zero `any`), clean file structure, and good responsive grid foundations. However, critical gaps in authentication, SEO infrastructure, accessibility, and Three.js performance prevent it from reaching institutional production quality.

**Domain Scores:**
| Domain | Score | Key Gap |
|--------|-------|---------|
| Performance | 5/10 | Two WebGL contexts, no dpr cap, all pages client-side |
| Security | 3/10 | No auth, no headers, no input validation (expected pre-API) |
| Code Quality | 8/10 | Only 1 console.log, strict TS, clean structure |
| Accessibility | 3.5/10 | No skip link, broken form labels, contrast failures |
| SEO & Meta | 3/10 | No sitemap, no robots, no OG image, 9 pages missing metadata |
| Responsive | 7/10 | Good foundations, PWA safe-area gap, some touch targets small |

---

## Critical (12 — fix before launch)

### Security
- [ ] **No authentication** — `login/page.tsx:40` does `router.push("/dashboard")` with zero validation. Login is a UI facade.
- [ ] **No auth middleware** — No `middleware.ts` exists. All routes (`/dashboard`, `/bank`, `/trades`, `/api-keys`, etc.) are publicly accessible.
- [ ] **No security headers** — `next.config.ts` is missing `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`.

### Performance
- [ ] **No `dpr` cap on Canvas** — `particle-globe.tsx:299` has no `dpr` prop. On Retina/3x mobile devices, renders at unbounded native resolution. Add `dpr={[1, 2]}`.
- [ ] **`three` not in `optimizePackageImports`** — `next.config.ts:5` only lists `framer-motion`. Three.js (~600KB) may not be tree-shaken. Also `particle-globe.tsx:5` uses `import * as THREE`.

### SEO & Meta
- [ ] **No `sitemap.ts`** — Search engines cannot discover pages.
- [ ] **No `robots.ts`** — No crawl directives. Authenticated routes may get indexed.
- [ ] **No OG image** — `layout.tsx:21-26` `openGraph` has no `images` property. Social shares have no preview.
- [ ] **No `metadataBase`** — `layout.tsx:9` missing. All relative OG URLs are broken and no canonical URLs generated.

### Accessibility
- [ ] **`--text-4` fails WCAG AA** — `globals.css:34` `rgba(255,255,255,0.3)` on `#000` = ~3.2:1 (needs 4.5:1). On `#141414` cards = ~2.7:1. Used in hundreds of text elements.
- [ ] **No skip-to-content link** — Keyboard users must tab through 13+ sidebar links to reach content.
- [ ] **Form labels not programmatically linked** — `payments/page.tsx`, `bridge/page.tsx`, `rfs-dialog.tsx`: `<label>` elements lack `htmlFor`, inputs lack `id`. Screen readers can't associate them.

### Responsive / PWA
- [ ] **Missing `viewportFit: "cover"`** — `layout.tsx:34-38` Viewport export missing it. PWA safe areas (`env(safe-area-inset-*)`) return 0, making `bottom-tabs.tsx:15` padding ineffective on notched devices.

---

## High (26 — fix soon)

### Performance
- [ ] **Double ParticleGlobe** — `globe-background.tsx:6` and `balance-hero.tsx:9` both dynamically import ParticleGlobe. On dashboard, two WebGL contexts with 3500+ particles each run simultaneously.
- [ ] **No geometry/material disposal** — `particle-globe.tsx` creates BufferGeometry, PointsMaterial, ShaderMaterial, CanvasTexture without `.dispose()` on unmount. GPU memory leaks.
- [ ] **Scroll `useState` triggers re-renders** — `particle-globe.tsx:279-284` uses `setScrollProgress` on every scroll event, re-rendering the entire Canvas tree. Should use `useRef` + `useFrame`.
- [ ] **Fonts via CSS `@font-face`** — `globals.css:3-14` loads fonts without `next/font/local`. No preloading, no `size-adjust` for CLS prevention.
- [ ] **No `next/image`** — Raw `<img>` tags for logos and decorative SVGs. Missing AVIF/WebP, lazy loading, responsive sizing.
- [ ] **9 routes missing `loading.tsx`** — `fx/`, `yield/`, `bridge/`, `payments/`, `onchain/`, `onchain-activity/`, `third-party/`, `reports/`, `api-keys/`.
- [ ] **Zero `<Suspense>` boundaries** — No Suspense anywhere in the codebase.
- [ ] **All 14 pages are `"use client"`** — Pages with minimal interactivity (yield, bridge, onchain, payments) ship full React client runtime. Push `"use client"` to leaf components.

### Security
- [ ] **No input validation on financial forms** — `payments/page.tsx:134` amount accepts negatives; `bridge/page.tsx:134` same; `onchain/page.tsx:132` wallet address has no format validation.
- [ ] **Hardcoded user identity** — `sidebar.tsx:108-112` "Fernando M." / "Admin" / "Treasury 01" hardcoded. Must come from session when auth is added.
- [ ] **PWA `start_url` bypasses login** — `manifest.ts:9` set to `/dashboard`, opens directly past login in standalone mode.

### SEO & Meta
- [ ] **9 pages missing metadata** — `fx/`, `payments/`, `bridge/`, `yield/`, `onchain/`, `onchain-activity/`, `reports/`, `api-keys/`, `third-party/` all render as generic "Nonco Stables" in browser tabs.
- [ ] **Apple Touch Icon is SVG** — `layout.tsx:16-19` `icons.apple` points to `/icon.svg`. Safari ignores SVG apple-touch-icons — needs 180x180 PNG.

### Accessibility
- [ ] **No `<h1>` on authenticated pages** — `page-header.tsx:41` renders title as `<span>`, not heading. Screen readers have no page landmark.
- [ ] **Interactive `<div>`s not keyboard accessible** — `sidebar.tsx:54` account selector, `transaction-list.tsx:231` cards, `transaction-table.tsx:189` rows, `recent-trades.tsx:47` rows — all have `cursor-pointer` but can't be focused or activated via keyboard.
- [ ] **Search inputs missing `aria-label`** — `fx/page.tsx:195`, `payments/page.tsx:231`, `third-party/page.tsx:87`.
- [ ] **Filter selects missing `aria-label`** — `third-party/page.tsx:93,104`, `payments/page.tsx:238`.
- [ ] **Form inputs use barely-visible focus** — `focus:border-white/30` across payments, third-party pages. Fails WCAG 2.4.7.
- [ ] **Framer Motion ignores `prefers-reduced-motion`** — Only `PageTransition` checks `useReducedMotion()`. All other motion.div/motion.tr elements animate regardless of user preference.
- [ ] **Notification dropdown missing role** — `notification-center.tsx:158-241` panel has no `role` or `aria-label`.

### Code Quality
- [ ] **Console.log in production** — `rfs-dialog.tsx:596` logs trade execution data.
- [ ] **SkeletonPulse duplicated 5x** — Identical component in `dashboard/loading.tsx`, `rfq/loading.tsx`, `trades/loading.tsx`, `bank/loading.tsx`, `settlements/loading.tsx`. Extract to `skeleton.tsx`.
- [ ] **6 hardcoded hex colors** — `notification-center.tsx:159` `#141414`, `bridge/page.tsx:42` `#05E0F8`, `balance-hero.tsx:304` `#05E0F8`, `settlement-card.tsx:56` `#d97706`, `settlements/page.tsx:568,737` `#04b0c4`. Should use CSS variables.
- [ ] **`getDateGroup`/`groupByDate` duplicated 3x** — `transaction-list.tsx`, `transaction-table.tsx`, `trades/page.tsx`. Extract to `utils.ts`.

### Responsive
- [ ] **`min-w-[600px]` on recent trades table** — `recent-trades.tsx:23` forces horizontal scroll on narrow screens. Already hides columns responsively, so min-width is redundant.
- [ ] **RFS dialog SummaryGrid too tight** — `rfs-dialog.tsx:388` `grid-cols-4` on iPhone SE (320px) = ~72px per cell. Needs `grid-cols-2 sm:grid-cols-4`.

---

## Medium (30 — improve)

### Performance
- [ ] All 14 pages import Framer Motion — runtime in every route chunk
- [ ] Viz components (`bar-chart`, `donut-chart`, `flow-diagram`, `mini-area-chart`, `progress-ring`, `sparkline`) are `"use client"` but have zero hooks — could be Server Components
- [ ] No dynamic imports for heavy dialogs (RfsDialog 756 lines, ConfirmationDialog)
- [ ] `FX Board` re-renders all MarketCards every 700ms tick — `MarketCard` not wrapped in `React.memo`
- [ ] 24 cached textures (512x512 each, ~6MB GPU) persist entire session in module-level Map
- [ ] No mobile particle count reduction — 3500 particles fixed regardless of device capability

### Security
- [ ] Error boundary shows `error.message` to users — `(app)/error.tsx:68-105` could expose stack traces in production
- [ ] Dev pages publicly accessible — `/chart-options`, `/illustration-preview` outside `(app)` group
- [ ] `innerHTML` for SVG injection — `brand-shapes.tsx:75` using `node.innerHTML = SHAPES[cfg.index]`. Constants-only today but fragile pattern.

### SEO & Meta
- [ ] `manifest.ts:11` `theme_color: "#ffffff"` vs `layout.tsx:35` `themeColor: "#05E0F8"` — mismatch
- [ ] `twitter.card` is `"summary"` — should be `"summary_large_image"` for better visual impact
- [ ] No JSON-LD structured data — `Organization`, `WebApplication`, `FinancialProduct` schemas would help
- [ ] `@vercel/analytics` and `@vercel/speed-insights` commented out in `layout.tsx:1-4`
- [ ] Root-level `error.tsx` missing — errors outside `(app)` group show default Next.js page
- [ ] No `loading.tsx` at root or `(app)` level — no skeleton during layout-level navigation

### Accessibility
- [ ] Form labels in `bridge/page.tsx`, `rfs-dialog.tsx` exist visually but lack `htmlFor`/`id`
- [ ] `quote-form.tsx:28-48` has zero labels for instrument select and quantity input
- [ ] RFQ page `<h2>` without preceding `<h1>` — broken heading hierarchy
- [ ] Status dots in sidebar convey state via color only — no text alternative
- [ ] Only 1 instance of `sr-only` in entire codebase (`third-party/page.tsx:141`)

### Code Quality
- [ ] `CardTitle` uses `font-mono` for section titles — `card.tsx:33` should be `font-sans`
- [ ] `extraTrades` array duplicated between `trades/page.tsx` and `fx/page.tsx`
- [ ] `BASE_RATES` duplicated in `favorites-grid.tsx:29-38` and `mock-data.ts:149-158`
- [ ] No root-level `error.tsx` — pages outside `(app)` have no error boundary
- [ ] Login `handleLogin` has no error handling — no try/catch, no loading state

### Responsive
- [ ] Notification bell touch target ~18px — `notification-center.tsx:126`
- [ ] Avatar touch target 28px — `page-header.tsx:77`
- [ ] Account selector touch target ~36px — `sidebar.tsx:54`
- [ ] Page header missing `safe-area-inset-top` — `page-header.tsx:34`
- [ ] Yield History table missing `overflow-x-auto` wrapper — `yield/page.tsx:368`
- [ ] `text-[9px]` in ~15 places, `text-[10px]` in ~80+ places — below 14px threshold

---

## Low (26 — nice to have)

### Performance
- [ ] `antialias: true` on particle-only scene — minimal benefit, GPU overhead
- [ ] `motion.div` for simple fade-ins where CSS `@starting-style` would suffice
- [ ] `motion.tr` in yield/payments tables can cause layout thrashing
- [ ] `PageTransition` has no `AnimatePresence` — enter animation is pure overhead

### Security
- [ ] `brace-expansion <1.1.13` moderate vulnerability — fixable via `npm audit fix`
- [ ] No rate limiting infrastructure for future API endpoints

### SEO & Meta
- [ ] Manifest missing `orientation`, `categories`, `scope` properties
- [ ] No maskable icon for Android adaptive icons
- [ ] `(app)/layout.tsx` has no shared metadata for authenticated pages

### Accessibility
- [ ] `page-header.tsx:77` avatar has no `aria-label`
- [ ] `SectionLabel` renders as `<span>`, not heading — no structure for screen readers

### Code Quality
- [ ] 8 unused components: `market-watch.tsx`, `quick-actions.tsx`, `currency-breakdown.tsx`, `category-tabs.tsx`, `kpi-cards.tsx`, `ticker-bar.tsx`, skeleton presets
- [ ] `services/transactions.ts:1` imports unused `TransactionType`
- [ ] `particle-globe.tsx:267` dead `offset` prop never used by `CameraRig`
- [ ] `fx/page.tsx:262` uses `<a>` instead of `<Link>` — bypasses client-side navigation
- [ ] `rfs/` vs `rfq/` folder naming potentially confusing

### Responsive
- [ ] Pagination buttons below 44px — `transaction-table.tsx:336`
- [ ] Settlement tab buttons below 44px — `settlements/page.tsx:417`
- [ ] Bottom tab labels at 9px — `bottom-tabs.tsx:41`
- [ ] Manifest `theme_color` mismatch (white vs cyan)
- [ ] No `display-mode: standalone` CSS media query handling

---

## Stats
- Files scanned: 91
- Issues found: 94 (C: 12, H: 26, M: 30, L: 26)
- Domains: Performance, Security, Code Quality, Accessibility, SEO & Meta, Responsive

## Top 10 Highest-Impact Fixes

| # | Fix | Domain | Impact | Effort |
|---|-----|--------|--------|--------|
| 1 | Add `dpr={[1, 2]}` + deduplicate ParticleGlobe | Perf | Halves GPU load | 15 min |
| 2 | Add `three` to `optimizePackageImports` + named imports | Perf | ~300KB bundle reduction | 20 min |
| 3 | Create `robots.ts` + `sitemap.ts` + set `metadataBase` | SEO | Enables search indexing | 30 min |
| 4 | Raise `--text-4` to `rgba(255,255,255,0.5)` | A11y | Fixes contrast app-wide | 1 min |
| 5 | Add skip-to-content link in app layout | A11y | Keyboard nav usable | 10 min |
| 6 | Link form labels with `htmlFor`/`id` | A11y | Screen readers work | 30 min |
| 7 | Switch to `next/font/local` | Perf | Eliminates font FOUT/CLS | 15 min |
| 8 | Add security headers in `next.config.ts` | Security | Blocks clickjacking, MIME sniff | 20 min |
| 9 | Replace scroll `useState` with `useRef` in globe | Perf | Eliminates scroll re-renders | 10 min |
| 10 | Add `viewportFit: "cover"` to viewport export | PWA | Safe areas work on notch devices | 1 min |
