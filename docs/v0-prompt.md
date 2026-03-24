# Nonco Stables — v0/Stitch Prompt

## Copy this entire prompt into v0.dev

---

Build a complete fintech/payments PWA called "Nonco Stables" — an institutional stablecoin settlement platform. This is NOT a crypto trading app. Think Revolut meets Wise for enterprise FX/stablecoin payments. Dark mode only, premium minimal aesthetic.

## Brand Identity

- **Fonts:** Space Grotesk (display/body), JetBrains Mono (numbers, prices, data)
- **Primary accent:** Cyan `#05E0F8`
- **Background hierarchy:** `#000` (base) → `#0a0a0a` (cards) → `#111` (elevated) → `#161616` (muted)
- **Text hierarchy:** `#fff` (primary) → `#bfbfbf` (secondary) → `#808080` (tertiary) → `#4a4a4a` (muted)
- **Borders:** `#18181b` (card borders), `rgba(255,255,255,0.06)` (subtle)
- **Accent colors:** Purple `#a855f7`, Amber `#f59e0b`, Green `#22c55e`, Red `#ef4444`, Blue `#38bdf8`, Indigo `#6366f1`
- **Buttons:** All pill-shaped (rounded-full). Primary = cyan bg, black text. Ghost = transparent, border.
- **Cards:** `bg-[#0a0a0a]`, `border 1px #18181b`, `rounded-lg`, no shadow. Hover: border lightens to `rgba(255,255,255,0.1)`.
- **Section labels:** 2px tall cyan vertical bar + mono uppercase 10px text with letter-spacing 0.15em (like: `| PORTFOLIO`)
- **NO charts, NO graphs, NO order books, NO crypto coin logos**

## Currency Color System (consistent across all pages)

```
USD  → Cyan #05E0F8
EUR  → Sky Blue #38bdf8
MXN  → Green #22c55e
USDT → Purple #a855f7
USDC → Indigo #6366f1
GBP  → Amber #f59e0b
BRL  → Pink #ec4899
```

## App Shell / Layout

**Desktop (lg+):** Fixed sidebar (220px) on left + main content area + page header at top.
**Mobile (<lg):** No sidebar. Bottom tab bar (5 tabs). Content scrolls.

### Sidebar (desktop only)
- Top: "NONCO" (bold white) "STABLES" (light gray) text logo
- Nav items: Dashboard, RFQ, Bank, Trades, Settlements, Wallet
- Each item: icon + label, rounded-lg padding
- Active state: cyan text + cyan-dim background + 3px cyan left inset shadow
- Hover: subtle bg elevation
- Bottom: user avatar circle (initials "TB") + name "Thiago Bellotti" + settings gear
- Divider gradients (subtle, not hard lines)

### Bottom Tabs (mobile only)
- 5 tabs: Dashboard, RFQ, Trades, Bank, Wallet
- Fixed bottom, safe-area padding for notched devices
- Active: cyan icon + label. Inactive: gray.

### Page Header (desktop only)
- Left: breadcrumb "Nonco / **Page Name** | Description"
- Right: notification bell (with cyan count badge "3") + user avatar circle

---

## PAGE 1: Dashboard (`/dashboard`)

The main overview page. Think Revolut's home screen.

### Desk Offer Banner (dismissible)
- Full width card at top with cyan left accent bar (3px)
- Pulsing cyan dot + "Trading desk has **USDT at 17.42** — limited inventory"
- Subtitle: "2M USDT available · Expires in 4:32" (countdown in amber mono)
- "View" cyan pill button + X dismiss button
- Animated shimmer gradient background

### Balance Hero
- Section label: `| PORTFOLIO`
- Giant balance: `$5,669,000.00` in JetBrains Mono, 46px bold, white
- Change badge: green pill with up arrow + `+$12,340.00` + `0.22%` + "24h"
- Below: subtle sparkline SVG (7-day trend line in cyan, ~24px tall, gradient fill)

### Quick Actions Row
- 4 circle buttons: Send (↗), Receive (↙), Convert (⇄), Deposit (+)
- Each: 48px icon circle, `bg-elevated` border, label below
- Hover: cyan glow + scale

### Currency Breakdown
- Section label: `| BALANCES`
- Grid: 5 cards (responsive: 2 cols mobile, 5 cols desktop)
- Each card: colored currency circle (using currency color system) + symbol + amount in mono bold + "Available" subtitle + thin progress bar showing % of total

### Category Tabs
- Horizontal pills: All, Bank, Trades, Settlements, Wallet
- Active: cyan-dim bg + cyan text. Inactive: text-4.

### Transaction List (grouped by date)
- Date groups: "TODAY", "YESTERDAY", "THIS WEEK" — mono uppercase headers
- Each row: 40px colored icon circle (by type) + description + counterparty + amount (positive=cyan, negative=white) + currency label + timeAgo
- Types with colors: deposit=cyan↙, withdrawal=purple↗, trade=green⇄, settlement=amber◇
- Pending items show amber "Pending" badge, Failed shows red "Failed" badge
- Hover: row gets subtle bg-elevated

---

## PAGE 2: RFQ (`/rfq`) — Request for Quote

The core trading functionality. FX/stablecoin pair quoting with time-limited prices.

### Favorites Grid
- Section label: `| FAVORITES`
- Grid: 4 cards (2 cols mobile, 4+ cols desktop)
- Each card: pair name large ("MXN /USDT"), editable quantity input (mono), cyan "Quote" pill button

### New Quote Form + Price Card (side by side on desktop)
Left: Form with instrument dropdown + quantity input + "Get Quote" cyan button
Right: Price card (see below)

### Price Card (the star component)
**States:** Empty → Loading (shimmer) → Active → Expired

**Active state:**
- Header: pair name + circular SVG countdown timer (ring that depletes)
  - Timer: cyan ring when > 10s, amber when ≤ 10s
  - Format: "0:28" in center of ring
- Settlement tabs: `[Spot] [T+1] [T+2] [T+10]` — pill tabs with sliding indicator
  - Each shows different pricing. Forward prices have premium indicator (+0.02%)
- Two-column price display:
  - BUY side: price in large mono bold, cyan "Buy MXN" button (prominent)
  - SELL side: price in large mono bold, ghost "Sell MXN" button (subdued)
- Footer: "Balance: $5,669,000" + "Spread: 0.08%"
- Pulsing glow box-shadow when timer active

**Expired state:** Blurred overlay + "Price expired" + cyan "Refresh Quote" button

### Recent Trades
- Section label: `| RECENT TRADES`
- Compact list: pair, Buy/Sell badge, quantity @ price, settlement type, timeAgo

---

## PAGE 3: Wallet (`/wallet`)

### Total Balance
- Section label: `| WALLET`
- `$5,669,000.00` in mono bold + "5 currencies"

### Currency Cards Grid
- 5 cards (1 col mobile, 5 cols xl)
- Each card has colored 2px top border (matching currency color)
- Content: colored currency circle + name/symbol + available amount (large mono) + pending (amber if > 0) + USD value + Deposit (cyan) / Withdraw (ghost) buttons + truncated wallet address (mono text-4)
- Hover: subtle gradient overlay in currency color

---

## PAGE 4: Trades (`/trades`)

### KPI Row (3 cards)
- Total Trades: "13" + "Last 7 days" + trend arrow
- Total Volume: "$13.92M" + trend
- Avg Size: "$1.07M" + trend
- Grid: 1 col mobile, 3 cols desktop

### Trade History Table
- Columns: Pair, Side (Buy cyan / Sell purple badge), Quantity (mono), Price (mono), Settlement (Spot/T+1/T+2 tags), Date
- Alternating row backgrounds
- "Export CSV" ghost button at top right
- Responsive: hide Settlement + Date on mobile

---

## PAGE 5: Settlements (`/settlements`)

### Tabs: Pending (with count badge) | Completed

### Pending Tab
- Grid of settlement cards (1 col mobile, 3 cols desktop)
- Each card: pair + amount (large mono) + counterparty + due date + status badge
  - "Processing" = cyan badge + animated rotating border (conic gradient)
  - "Awaiting settlement" = amber badge
- Progress bar showing time to settlement (gradient fill)

### Completed Tab
- Table: description, amount, currency, counterparty, date
- Alternating rows, responsive

---

## PAGE 6: Bank (`/bank`)

### KPI Row (3 cards)
- Total Deposits (30d): cyan amount
- Total Withdrawals (30d): purple amount
- Net Flow: green if positive, amber if negative

### Filter Tabs: All | Deposits | Withdrawals

### Transaction List
- Filtered deposit/withdrawal transactions
- Same row pattern as dashboard but with currency badge and status badge

---

## PAGE 7: Login (`/login`)

**Full screen, NO sidebar or app shell.**

- Centered vertically and horizontally on black background
- "NONCO" (bold) "STABLES" (light) text logo at top
- Subtitle: "Institutional stablecoin payments"
- Email input + Password input (dark styled inputs)
- "Sign In" cyan pill button (full width)
- Divider: "or continue with"
- "Continue with Google" white pill button
- "Connect Wallet" ghost pill button
- Footer: "By continuing, you agree to our Terms of Service"

---

## Key Interactions

1. **RFQ Quote Flow:** Click "Quote" → 600ms loading shimmer → price card appears with 30s countdown → settlement tabs switch pricing → Buy/Sell → "Trade Executed!" flash → added to recent trades
2. **Timer:** Circular SVG ring depletes over 30s. Cyan > 10s, amber ≤ 10s. Expires at 0.
3. **Quick Actions:** Hover = cyan glow + scale. Click = scale down feedback.
4. **Cards:** Hover = border brightens + subtle shadow
5. **Transaction rows:** Hover = bg-elevated
6. **Page transitions:** Framer Motion fade-up (opacity 0→1, y 12→0, 400ms ease-out-expo)
7. **Desk offer banner:** Animated shimmer gradient + pulsing dot + dismissible

## Tech Notes

- Next.js App Router with route groups: `(app)/` for shell pages, login outside
- All numbers in JetBrains Mono with tabular-nums
- All labels mono uppercase with wide letter-spacing
- Responsive: mobile-first, sidebar appears at lg breakpoint
- PWA manifest with cyan theme color
- Use Framer Motion for animations
- No external UI library — custom components matching the design system above

## Mock Data

Use realistic institutional amounts ($50K-$500K per trade), real FX rates (MXN/USDT ~17.45, EUR/USDT ~1.08, BRL/USDC ~5.15), and professional counterparty names (Citibank, Deutsche Bank, Banorte, BNP Paribas, Circle, Tether Operations).

## References

- Revolut (card patterns, quick actions, transaction list)
- Wise (FX quoting, transparency, progressive disclosure)
- Mercury (dark dashboard, professional feel)
- Nonco.com website (brand identity, cyan accent, Space Grotesk)
- Nonco EoM Reports (card styles, section labels, stat patterns)
