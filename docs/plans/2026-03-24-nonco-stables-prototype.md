# Nonco Stables Platform — Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional Next.js prototype of the Nonco Stables payments platform with Dashboard and RFQ screens, deployed as a PWA to Vercel for team review by Mar 28.

**Architecture:** Next.js 16 App Router with sidebar navigation (desktop) / bottom tabs (mobile). All data mocked via JSON fixtures. Dark mode default with Nonco brand identity (Space Grotesk, JetBrains Mono, cyan #05E0F8). PWA manifest for mobile install.

**Tech Stack:** Next.js 16, TypeScript, TailwindCSS v4, Framer Motion, next-pwa

**CRITICAL CONSTRAINTS (from client):**
- This is a FINTECH/PAYMENTS app, NOT a trading platform
- NO graphs, NO charts, NO order books, NO crypto visuals
- Only RFQ — request for quote pricing
- Forward pricing: Spot + T+1 + T+2 + T+10 as settlement options
- Counterparty sees ONLY their available pairs (personalized view)
- Push notification banners for desk inventory offers
- Mau's Excalidraw wireframes = source of truth for feature set
- Visual inspiration: Revolut, Rain, neobank UIs

**Design references:**
- Nonco brand: `~/Projects/Nonco/nonco-site/` (colors, fonts, patterns)
- EoM reports: `~/Desktop/Projects-Local/Nonco/Nonco-EOM-Report/` (card/stat patterns)
- Mau's wireframes: Dashboard (balance + pending + transactions) + RFQ (favorites + quote + timer)

---

## File Structure

```
nonco-stables-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout, fonts, providers, sidebar/tabs
│   │   ├── page.tsx             # Redirect to /dashboard
│   │   ├── globals.css          # Tailwind v4 imports, theme vars, base styles
│   │   ├── manifest.ts          # PWA manifest
│   │   ├── icon.png             # App icon
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard screen
│   │   ├── rfq/
│   │   │   └── page.tsx         # RFQ trading screen
│   │   ├── bank/
│   │   │   └── page.tsx         # Stub
│   │   ├── trades/
│   │   │   └── page.tsx         # Stub
│   │   ├── settlements/
│   │   │   └── page.tsx         # Stub
│   │   ├── wallet/
│   │   │   └── page.tsx         # Stub
│   │   └── login/
│   │       └── page.tsx         # Login screen (static)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx      # Desktop sidebar nav
│   │   │   ├── bottom-tabs.tsx  # Mobile bottom navigation
│   │   │   └── page-header.tsx  # Page title + user avatar
│   │   ├── dashboard/
│   │   │   ├── balance-hero.tsx # Big balance display
│   │   │   ├── kpi-cards.tsx    # Available + Pending cards
│   │   │   ├── transaction-list.tsx  # Transaction feed
│   │   │   └── category-tabs.tsx     # Filter tabs
│   │   ├── rfq/
│   │   │   ├── favorites-grid.tsx    # Pre-set instrument cards
│   │   │   ├── quote-form.tsx        # Instrument + Quantity input
│   │   │   ├── price-card.tsx        # Timer + Buy/Sell prices
│   │   │   └── recent-trades.tsx     # Last executed trades
│   │   └── ui/
│   │       ├── section-label.tsx     # Cyan bar + mono label
│   │       ├── card.tsx              # Nonco-style card wrapper
│   │       └── badge.tsx             # Status badges
│   ├── lib/
│   │   ├── mock-data.ts         # All mock data (transactions, instruments, prices)
│   │   └── utils.ts             # cn(), formatCurrency(), formatTime()
│   └── hooks/
│       └── use-countdown.ts     # 30s countdown timer hook
├── public/
│   └── fonts/
│       ├── SpaceGrotesk-Variable.woff2
│       └── JetBrainsMono-Variable.woff2
├── next.config.ts
├── tailwind.config.ts (or CSS-only v4)
├── tsconfig.json
├── package.json
└── docs/plans/
    └── 2026-03-24-nonco-stables-prototype.md  # This file
```

---

## Task 1: Project Scaffold + Fonts + Theme

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/lib/utils.ts`
- Copy: font files to `public/fonts/`

- [ ] **Step 1: Init Next.js project**

```bash
cd ~/Desktop/Projects-Local/Nonco/nonco-stables-app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

- [ ] **Step 2: Copy fonts from Nonco site**

```bash
cp ~/Projects/Nonco/nonco-site/public/fonts/SpaceGrotesk-Variable-latin.woff2 public/fonts/SpaceGrotesk-Variable.woff2
cp ~/Projects/Nonco/nonco-site/public/fonts/JetBrainsMono-Variable-latin.woff2 public/fonts/JetBrainsMono-Variable.woff2
```

- [ ] **Step 3: Set up globals.css with Nonco theme**

CSS variables matching Nonco identity:
```css
@import "tailwindcss";

@font-face {
  font-family: 'Space Grotesk';
  font-weight: 300 700;
  font-display: swap;
  src: url('/fonts/SpaceGrotesk-Variable.woff2') format('woff2');
}
@font-face {
  font-family: 'JetBrains Mono';
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/JetBrainsMono-Variable.woff2') format('woff2');
}

:root {
  --bg: #000; --bg-card: #0a0a0a; --bg-elevated: #111; --bg-muted: #161616;
  --text: #fff; --text-2: #bfbfbf; --text-3: #808080; --text-4: #4a4a4a;
  --cyan: #05E0F8; --cyan-dark: #04b0c4; --cyan-dim: rgba(5,224,248,0.08);
  --purple: #a855f7; --amber: #f59e0b; --green: #22c55e;
  --border: #18181b; --border-subtle: rgba(255,255,255,0.06);
  --font-sans: 'Space Grotesk', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

body { font-family: var(--font-sans); background: var(--bg); color: var(--text); }
```

- [ ] **Step 4: Set up root layout with font loading**

Root layout with html lang, body class, metadata for PWA.

- [ ] **Step 5: Create utils.ts**

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}
export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}
```

- [ ] **Step 6: Install dependencies**

```bash
npm install clsx tailwind-merge framer-motion
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

- [ ] **Step 8: Commit**

```bash
git init && git add -A && git commit -m "feat: project scaffold with Nonco theme and fonts"
```

---

## Task 2: Mock Data

**Files:**
- Create: `src/lib/mock-data.ts`

- [ ] **Step 1: Create comprehensive mock data file**

All mock data in one file — transactions, instruments, balances, favorites, recent trades. Types + data.

Key types:
```typescript
type Transaction = { id, type: 'deposit'|'withdrawal'|'trade'|'settlement', description, amount, currency, timestamp, status }
type Instrument = { pair: string, baseCurrency: string, quoteCurrency: string }
type Favorite = { instrument: Instrument, defaultQuantity: number }
type Quote = { bid: number, ask: number, expiresAt: number }
type Balance = { currency: string, available: number, pending: number }
```

Mock data: 20 transactions, 6 favorites, 5 balances, 10 recent trades.

- [ ] **Step 2: Commit**

```bash
git add src/lib/mock-data.ts && git commit -m "feat: add mock data fixtures"
```

---

## Task 3: UI Primitives

**Files:**
- Create: `src/components/ui/section-label.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`

- [ ] **Step 1: Create section-label component**

EoM report style — 2px cyan bar + mono uppercase text with wide letter-spacing.

```tsx
export function SectionLabel({ children, color = 'var(--cyan)' }: { children: React.ReactNode, color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-[2px] h-3 rounded-sm" style={{ background: color }} />
      <span className="font-mono text-[10px] font-medium uppercase tracking-[.15em]" style={{ color: 'var(--text-4)' }}>
        {children}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Create card component**

Nonco EoM report card — `#0a0a0a` bg, `#18181b` border, `rounded-lg`, no shadow.

- [ ] **Step 3: Create badge component**

Pill badges with color variants (cyan, amber, green, purple).

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ && git commit -m "feat: add UI primitives (section-label, card, badge)"
```

---

## Task 4: Layout (Sidebar + Bottom Tabs)

**Files:**
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/bottom-tabs.tsx`
- Create: `src/components/layout/page-header.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create sidebar component**

Desktop sidebar (hidden on mobile): NONCO STABLES logo at top, nav links with icons (Dashboard, RFQ, Bank, Trades, Settlements, Wallet), active state with cyan accent, user avatar at bottom.

Width: 220px. Background: `#0a0a0a`. Border-right: 1px `#18181b`.

- [ ] **Step 2: Create bottom-tabs component**

Mobile bottom nav (hidden on desktop): 4 tabs — Home, RFQ, Bank, Wallet. Icons + labels. Active state cyan.

- [ ] **Step 3: Create page-header component**

Simple: page title (left) + user name/avatar (right). Only visible on desktop.

- [ ] **Step 4: Wire into root layout**

Layout structure:
```tsx
<div className="flex h-dvh">
  <Sidebar />           {/* hidden below lg */}
  <main className="flex-1 flex flex-col overflow-hidden">
    <PageHeader />
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
      {children}
    </div>
  </main>
  <BottomTabs />         {/* hidden above lg */}
</div>
```

- [ ] **Step 5: Verify responsive layout**

Test at 1440px (desktop with sidebar) and 390px (mobile with bottom tabs).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add responsive layout with sidebar and bottom tabs"
```

---

## Task 5: Dashboard Screen

**Files:**
- Create: `src/components/dashboard/balance-hero.tsx`
- Create: `src/components/dashboard/kpi-cards.tsx`
- Create: `src/components/dashboard/transaction-list.tsx`
- Create: `src/components/dashboard/category-tabs.tsx`
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create balance-hero**

Large balance display: $1,247,000.00 in 36px mono bold. +$12,340 in cyan below. Currency selector pill (USD/EUR/BRL).

- [ ] **Step 2: Create kpi-cards**

Two cards side-by-side: Available Balance ($1,100,000 / 3 currencies) and Pending Settlements ($147,000 / 2 settlements). Use Card component.

- [ ] **Step 3: Create transaction-list**

List of transactions from mock data. Each row: icon (by type, colored), description, amount (+ green / - white), timestamp. Dividers between items.

Icons: ↗ (trade/sell), ↙ (deposit/receive), ↔ (settlement), ← (withdrawal).

- [ ] **Step 4: Create category-tabs**

Horizontal scrollable tabs: All, Bank, Trades, Settlements, Wallet. Active tab has cyan bottom border. Filters transaction list.

- [ ] **Step 5: Compose dashboard page**

```tsx
export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <BalanceHero />
      <KPICards />
      <CategoryTabs />
      <TransactionList />
    </div>
  )
}
```

- [ ] **Step 6: Verify on desktop and mobile**

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add dashboard with balance, KPIs, and transactions"
```

---

## Task 6: Countdown Timer Hook

**Files:**
- Create: `src/hooks/use-countdown.ts`

- [ ] **Step 1: Create useCountdown hook**

```typescript
export function useCountdown(seconds: number) {
  // Returns { timeLeft, isExpired, isUrgent (< 10s), reset, formatted }
  // Counts down from `seconds`, auto-stops at 0
  // isUrgent triggers visual change (cyan → amber)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/ && git commit -m "feat: add countdown timer hook"
```

---

## Task 7: RFQ Screen

**Files:**
- Create: `src/components/rfq/favorites-grid.tsx`
- Create: `src/components/rfq/quote-form.tsx`
- Create: `src/components/rfq/price-card.tsx`
- Create: `src/components/rfq/recent-trades.tsx`
- Create: `src/app/rfq/page.tsx`

- [ ] **Step 1: Create favorites-grid**

Grid of 3-4 cards. Each: instrument pair name (MXN/USDT), default quantity (editable), cyan "Quote" pill button. Cards use Nonco card style.

- [ ] **Step 2: Create quote-form**

Two inputs: Instrument (dropdown/autocomplete with available pairs) + Quantity (number input with currency suffix). "Get Quote" button (cyan pill). Clean form with Nonco styling.

- [ ] **Step 3: Create price-card**

The core component. States:
1. **Empty** — "Request a quote to see pricing"
2. **Loading** — skeleton/shimmer
3. **Active** — Settlement tabs (Spot / T+1 / T+2 / T+10) at top, circular countdown timer (30s), BID price (Buy button), ASK price (Sell button), balance display
4. **Expired** — Grayed out, "Price expired" message, "Refresh" button

Settlement tabs: Each tab shows different pricing for that settlement date. Spot = immediate. T+1/T+2/T+10 = forward pricing with premium/discount shown.

Timer: cyan circle that depletes, turns amber at < 10s. Mono font for prices. Buy/Sell buttons large and prominent.

- [ ] **Step 4: Create recent-trades**

Simple list: pair, quantity, price, timestamp. From mock data.

- [ ] **Step 5: Compose RFQ page**

```tsx
export default function RFQPage() {
  const [quote, setQuote] = useState(null)
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <SectionLabel>Favorites</SectionLabel>
      <FavoritesGrid onQuote={setQuote} />
      <SectionLabel>New Quote</SectionLabel>
      <QuoteForm onQuote={setQuote} />
      {quote && <PriceCard quote={quote} />}
      <SectionLabel>Recent Trades</SectionLabel>
      <RecentTrades />
    </div>
  )
}
```

- [ ] **Step 6: Wire up quote flow interaction**

Click "Get Quote" or favorite "Quote" → 500ms fake loading → show price card with 30s timer → click Buy/Sell → confirmation toast → add to recent trades.

- [ ] **Step 7: Verify timer countdown and expiration**

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add RFQ screen with favorites, quote form, and price timer"
```

---

## Task 8: Stub Pages

**Files:**
- Create: `src/app/bank/page.tsx`
- Create: `src/app/trades/page.tsx`
- Create: `src/app/settlements/page.tsx`
- Create: `src/app/wallet/page.tsx`
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create all stub pages**

Each stub: SectionLabel + "Coming soon" message + relevant icon. Consistent layout.

Login page: NONCO STABLES logo centered, "Google Login" button (white pill), "WalletConnect" button (ghost pill). Static, no auth logic.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add stub pages (bank, trades, settlements, wallet, login)"
```

---

## Task 9: PWA Manifest + Deploy

**Files:**
- Create: `src/app/manifest.ts`
- Create: `public/icon-192.png`, `public/icon-512.png`

- [ ] **Step 1: Create PWA manifest**

```typescript
export default function manifest() {
  return {
    name: 'Nonco Stables',
    short_name: 'Stables',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#05E0F8',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
```

- [ ] **Step 2: Create app icons**

Simple: black square with NONCO text in white or cyan "S" lettermark.

- [ ] **Step 3: Create GitHub repo**

```bash
cd ~/Desktop/Projects-Local/Nonco/nonco-stables-app
gh repo create thibellotti/nonco-stables-app --private --source=. --push
```

- [ ] **Step 4: Deploy to Vercel**

```bash
vercel link
vercel deploy
```

Share preview URL with team via WhatsApp.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add PWA manifest and deploy to Vercel"
```

---

## Task 10: Polish + Responsive Tweaks

- [ ] **Step 1: Mobile responsive pass**

Test all screens at 390px width. Fix any overflow, spacing, font size issues. Ensure bottom tabs don't overlap content.

- [ ] **Step 2: Framer Motion transitions**

Add page transitions (fade-up on mount), list item stagger on transactions, price card entrance animation.

- [ ] **Step 3: Desk offer notification banner**

Static banner at top of dashboard: "Trading desk has USDT at 17.42 — 5 min remaining" with dismiss X and "View" button. Cyan left border accent.

- [ ] **Step 4: Final commit + production deploy**

```bash
git add -A && git commit -m "feat: responsive polish, transitions, desk offer banner"
vercel deploy --prod
```

---

## Completion Criteria

- [ ] Dashboard shows balance hero, KPI cards, filterable transaction list (no charts/graphs)
- [ ] RFQ has favorites grid, quote form, 30s countdown price card with settlement tabs (Spot/T+1/T+2/T+10), buy/sell flow
- [ ] Sidebar nav on desktop, bottom tabs on mobile
- [ ] All pages reachable via navigation
- [ ] PWA installable on mobile
- [ ] Deployed to Vercel with shareable URL
- [ ] Nonco brand identity (dark mode, Space Grotesk, JetBrains Mono, cyan accent)
- [ ] No crypto visuals (no charts, order books, coin logos)
