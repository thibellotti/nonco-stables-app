# Nonco Stables — v0/Stitch Prompt

## Copy this entire prompt into v0.dev

---

Build a complete fintech/payments PWA called "Nonco Stables" — an institutional stablecoin settlement platform for enterprise FX and stablecoin payments. This is NOT a crypto trading app. Think Revolut meets Wise for institutional counterparties. Dark mode only, premium minimal aesthetic.

The visual identity comes from nonco.com — a two-brand ecosystem where **Nonco Markets** = neon green `#c7ff10` and **Nonco Stables** = blue `#05E0F8`. This app is Stables, so **blue is the dominant color** — used for CTAs, active states, data highlights, glows, gradients, and brand moments. Blue should feel ever-present without being overwhelming.

## Brand Identity (from nonco.com design system)

### Fonts
- **Space Grotesk** — all display and body text (variable weight 300–700)
- **JetBrains Mono** — all numbers, prices, amounts, data, timestamps, labels (variable weight 400–700)

### Blue — The Primary Color
```
Primary:  #05E0F8  (HSL 186 97% 49%)  — CTAs, active states, section bars, glows, data highlights
Dark:     #04b0c4  (HSL 186 97% 39%)  — pressed states, darker accents
Light:    #67edfb  (HSL 186 97% 65%)  — hover states, light accents
Dim:      rgba(5, 224, 248, 0.08)     — active backgrounds, subtle fills
Wash:     rgba(5, 224, 248, 0.04)     — hero/card background tints
```

### Surface Hierarchy (HSL-based, from nonco.com)
```
Background:  #000000  (0 0% 0%)    — page base, pure black
Card:        #141414  (0 0% 8%)    — card backgrounds, sidebar
Elevated:    #1f1f1f  (0 0% 12%)   — hover states, muted surfaces
Input:       #242424  (0 0% 14%)   — form inputs, interactive surfaces
Border:      #333333  (0 0% 20%)   — card borders, dividers
Border-dim:  rgba(255,255,255,0.06) — subtle separators
```

### Text Hierarchy
```
Primary:    #ffffff  — headings, balances, key data
Secondary:  #a3a3a3  (0 0% 64%)  — descriptions, secondary info
Tertiary:   #737373  (0 0% 45%)  — timestamps, metadata
Muted:      #525252  (0 0% 32%)  — placeholders, disabled
```

### Accent Colors (from Nonco brand palette)
```
Purple:  #a124f8  — sell side, withdrawals, secondary actions
Yellow:  #f9e220  — warnings, pending states, urgency (timer < 10s)
Green:   #c7ff10  — positive changes, profits (this is Nonco Markets green)
Red:     #ef4444  — errors, failed states, negative changes
```

### Brand Gradient (Stables)
```css
/* Subtle blue tint for hero areas and featured cards */
background: linear-gradient(135deg, rgba(5, 224, 248, 0.08), rgba(4, 176, 196, 0.02));

/* Animated rotating border for processing states */
conic-gradient(from var(--angle), #05e0f8, #38bdf8, #05e0f8)
```

### Component Patterns
- **Buttons:** Pill-shaped (`rounded-full`). Primary = blue `#05E0F8` bg, black text. Ghost = transparent, border. Sell = purple ghost.
- **Cards:** `bg-[#141414]`, `border 1px #333`, `rounded-lg`, no shadow. Hover: border lightens to `rgba(255,255,255,0.1)`. Featured cards get the stables gradient background.
- **Section labels:** 2px tall blue vertical bar + JetBrains Mono uppercase 10px text, `letter-spacing: 0.15em`, `color: #525252`. Pattern: `▎ PORTFOLIO`. This is a signature Nonco visual pattern from the EoM reports.
- **Badges:** Pill-shaped, small. Blue = active/buy. Purple = sell. Yellow = pending. Green = success. All use the brand palette.
- **Numbers:** ALL numbers, amounts, prices, percentages in JetBrains Mono with `font-variant-numeric: tabular-nums slashed-zero`.
- **NO charts, NO graphs, NO order books, NO crypto coin logos, NO candlesticks**

## Currency Color System (consistent across ALL pages)

```
USD   → Blue    #05E0F8  (Stables primary)
EUR   → Sky     #38bdf8
MXN   → Green   #c7ff10  (Nonco Markets green)
USDT  → Purple  #a124f8
USDC  → Indigo  #6366f1
GBP   → Yellow  #f9e220
BRL   → Pink    #ec4899
```

Each currency gets a colored circle indicator and its color is used consistently for progress bars, badges, and card accents throughout the app.

## App Shell / Layout

**Desktop (lg+):** Fixed sidebar (220px) on left + scrollable main content + page header bar at top.
**Mobile (<lg):** No sidebar. Bottom tab bar (5 tabs). Content scrolls. Safe-area padding for notched devices.

### Sidebar (desktop only)
- Background: `#141414`, right border: `1px solid #333`
- Top: "NONCO" (bold white, Space Grotesk 600) "STABLES" (gray `#737373`, 400) — text logo, no image
- Nav items: Dashboard, RFQ, Bank, Trades, Settlements, Wallet — each with a stroke icon + label
- Active state: blue `#05E0F8` text + blue dim background `rgba(5,224,248,0.08)` + 3px blue left inset shadow
- Hover: background elevates to `#1f1f1f`
- Bottom section: user avatar circle (initials "TB", blue border) + name "Thiago Bellotti" + subtle settings gear icon
- Dividers: gradient fade (not hard lines) — `linear-gradient(to right, transparent, #333, transparent)`

### Bottom Tabs (mobile only)
- 5 tabs: Dashboard, RFQ, Trades, Bank, Wallet
- Fixed bottom with `safe-area-inset-bottom` padding
- Active tab: blue `#05E0F8` icon + label. Inactive: `#525252`.
- Background: `#141414` with top border `#333`

### Page Header (desktop only)
- Left: breadcrumb — "Nonco / **Page Name**" (bold) + "| Description" (gray)
- Right: notification bell icon (with blue count dot badge "3") + user avatar circle (initials)
- Height: 64px, bottom border: `rgba(255,255,255,0.06)`

---

## PAGE 1: Dashboard (`/dashboard`)

The main overview page. Think Revolut's home screen but for institutional stablecoin settlement.

### Desk Offer Banner (dismissible, top of page)
- Full width card with 3px blue left accent bar
- Pulsing blue dot (CSS animation) + "Trading desk has **USDT at 17.42** — limited inventory"
- Subtitle: "2M USDT available · Expires in 4:32" (countdown in JetBrains Mono, yellow `#f9e220`)
- "View" blue pill button + X dismiss button (ghost)
- Background: subtle blue gradient wash `rgba(5,224,248,0.04)` + animated shimmer

### Balance Hero
- Section label: `▎ PORTFOLIO`
- Giant balance: `$5,669,000.00` in JetBrains Mono, ~46px, bold, white
- Change indicator: blue pill badge — up arrow + `+$12,340.00` + `0.22%` + "24h"
- Below balance: subtle 7-day sparkline SVG (~24px tall) — blue `#05E0F8` line with gradient fill fading to transparent. Minimal, almost decorative. NOT a full chart.
- The hero area gets the subtle stables gradient background

### Quick Actions Row
- 4 circle buttons in a row: Send (↗), Receive (↙), Convert (⇄), Deposit (+)
- Each: 48px circle, `bg-[#1f1f1f]`, `border 1px #333`, icon inside
- Label below each circle in small text
- Hover: blue glow `box-shadow: 0 0 20px rgba(5,224,248,0.15)` + `scale(1.05)`
- Active: `scale(0.95)` press feedback

### Currency Breakdown
- Section label: `▎ BALANCES`
- 5 cards in a responsive grid (2 cols mobile, 5 cols desktop)
- Each card: colored currency circle (from currency color system) + currency symbol (e.g. "USD") + amount in JetBrains Mono bold + "Available" subtitle in gray + thin progress bar showing % of total portfolio (colored by currency)
- Cards use standard card style: `bg-[#141414]`, border `#333`

### Category Tabs
- Horizontal scrollable pills: All, Bank, Trades, Settlements, Wallet
- Active: blue dim bg `rgba(5,224,248,0.08)` + blue text. Inactive: `#525252`.
- Underline indicator under active tab

### Transaction List (grouped by date)
- Date group headers: "TODAY", "YESTERDAY", "THIS WEEK" in JetBrains Mono uppercase, `#525252`, wide tracking
- Each row: 40px colored icon circle (by transaction type) + description + counterparty name + amount (positive = blue `#05E0F8`, negative = white) + currency label badge + relative time ("2h ago")
- Transaction type colors: deposit = blue ↙, withdrawal = purple ↗, trade = green ⇄, settlement = yellow ◇
- Status badges: "Pending" = yellow pill, "Failed" = red pill, "Settled" = blue pill
- Hover: row background elevates to `#1f1f1f`
- Divider between rows: `rgba(255,255,255,0.06)`

---

## PAGE 2: RFQ (`/rfq`) — Request for Quote

The core product. FX/stablecoin pair quoting with time-limited two-way pricing.

### Favorites Grid
- Section label: `▎ FAVORITES`
- 4 cards (2 cols mobile, 4 cols desktop), equal width
- Each card: pair name large bold ("MXN / USDT"), editable quantity input (JetBrains Mono, `bg-[#1f1f1f]`), blue "Quote" pill button
- Cards have the standard card style

### New Quote Form + Price Card (side by side on desktop, stacked on mobile)
**Left — Quote Form:**
- Instrument dropdown (searchable, autocomplete) with currency color indicator
- Quantity input (JetBrains Mono, number, with currency suffix label)
- "Get Quote" blue pill button (full width)

**Right — Price Card (the star component):**

**States:** Empty → Loading (shimmer skeleton) → Active → Expired

**Active state:**
- Card gets special treatment: blue gradient background `linear-gradient(135deg, rgba(5,224,248,0.06), rgba(4,176,196,0.02))` + pulsing blue glow `box-shadow` while timer is active
- Header: pair name (e.g. "MXN / USDT") left + circular SVG countdown timer right
  - Timer: blue `#05E0F8` ring when > 10s, yellow `#f9e220` when ≤ 10s
  - Ring depletes clockwise as time passes
  - Time format: "0:28" in JetBrains Mono center of ring
- Settlement tabs row: `[Spot] [T+1] [T+2] [T+10]` — pill tabs, blue active, with smooth sliding indicator
  - Each tab shows different pricing. Forward tabs show premium indicator "+0.02%"
- Two-column price display:
  - BUY side: "Buy" label, price in large JetBrains Mono bold (e.g. "17.4523"), blue "Buy MXN" pill button (prominent, full color)
  - SELL side: "Sell" label, price in large JetBrains Mono bold, purple ghost "Sell MXN" button (subdued)
- Footer: "Balance: $5,669,000" (mono) + "Spread: 0.08%" divider between

**Expired state:** Semi-transparent dark overlay + blurred content + "Price expired" text + blue "Refresh Quote" pill button centered

### Recent Trades
- Section label: `▎ RECENT TRADES`
- Compact list: pair, Buy (blue) / Sell (purple) badge, quantity @ price in mono, settlement type (Spot/T+1), relative time
- Max 5 items shown

---

## PAGE 3: Wallet (`/wallet`)

### Total Balance
- Section label: `▎ WALLET`
- `$5,669,000.00` in JetBrains Mono bold ~36px + "5 currencies" subtitle in gray

### Currency Cards Grid
- 5 cards (1 col mobile, 2 cols tablet, 5 cols xl)
- Each card has colored 2px top border (matching currency color from system)
- Content: colored currency circle + full name + symbol + available amount (large JetBrains Mono bold) + pending amount (yellow if > 0) + USD equivalent value + "Deposit" (blue pill) / "Withdraw" (ghost pill) buttons + truncated wallet address (`0x1a2b...f8e9` in mono, gray `#525252`)
- Hover: subtle gradient overlay tinted with the currency's color at ~4% opacity

---

## PAGE 4: Trades (`/trades`)

### KPI Row (3 cards)
- Total Trades: "13" (large mono bold) + "Last 7 days" + blue trend arrow
- Total Volume: "$13.92M" + trend
- Avg Trade Size: "$1.07M" + trend
- Grid: 1 col mobile, 3 cols desktop
- Each KPI card has a thin 2px blue top border

### Trade History Table
- Columns: Pair, Side (Buy = blue badge / Sell = purple badge), Quantity (mono), Price (mono), Settlement (Spot/T+1/T+2 tag), Date
- Alternating row backgrounds: transparent → `rgba(255,255,255,0.02)`
- "Export CSV" ghost pill button at top right of section
- Responsive: stack or hide Settlement + Date columns on mobile

---

## PAGE 5: Settlements (`/settlements`)

### Tab Navigation: Pending (with yellow count badge "3") | Completed

### Pending Tab
- Grid of settlement cards (1 col mobile, 3 cols desktop)
- Each card: pair name + amount (large JetBrains Mono bold) + counterparty + due date + status badge
  - "Processing" = blue badge + animated rotating conic-gradient border on the card (the signature Nonco animated border pattern)
  - "Awaiting" = yellow badge
- Progress bar showing time to settlement: blue gradient fill `linear-gradient(to right, #05E0F8, #04b0c4)`

### Completed Tab
- Table: description, amount, currency, counterparty, settled date
- All amounts in JetBrains Mono
- Alternating rows, responsive

---

## PAGE 6: Bank (`/bank`)

### KPI Row (3 cards)
- Total Deposits (30d): blue `#05E0F8` amount
- Total Withdrawals (30d): purple `#a124f8` amount
- Net Flow: green `#c7ff10` if positive, yellow `#f9e220` if negative
- Same 2px blue top border on each KPI card

### Filter Tabs: All | Deposits | Withdrawals
- Same pill tab pattern as dashboard, blue active state

### Transaction List
- Filtered deposit/withdrawal transactions
- Same row pattern as dashboard: icon circle + description + counterparty + amount + currency badge + time
- Deposit amounts in blue, withdrawal amounts in white
- Status badges for pending/completed

---

## PAGE 7: Login (`/login`)

**Full screen. NO sidebar, NO bottom tabs, NO app shell.**

- Pure black background
- Content centered vertically and horizontally
- "NONCO" (bold white) "STABLES" (gray `#737373`) text logo — large
- Blue horizontal line divider (2px, 48px wide, `#05E0F8`) below logo
- Subtitle: "Institutional stablecoin payments" in `#737373`
- Email input (dark input style: `bg-[#141414]`, border `#333`, blue focus ring)
- Password input (same style, with show/hide toggle)
- "Sign In" blue pill button (full width, `#05E0F8` bg, black text)
- Divider: thin line with "or continue with" text centered
- "Continue with Google" white pill button (white bg, black text, Google icon)
- "Connect Wallet" ghost pill button (transparent, border `#333`, wallet icon)
- Footer: "By continuing, you agree to our Terms of Service" in `#525252`

---

## Key Interactions

1. **RFQ Quote Flow:** Click "Quote" on favorite or form → 600ms shimmer loading → price card appears with 30s countdown ring → settlement tabs switch pricing instantly → Buy/Sell → brief blue flash confirmation "Trade Executed!" → added to recent trades list
2. **Countdown Timer:** Circular SVG ring that depletes clockwise. Blue `#05E0F8` ring > 10s, yellow `#f9e220` ≤ 10s. Pulsing glow on card intensifies as time runs out. Stops at 0 → expired overlay.
3. **Quick Actions:** Hover = blue glow + `scale(1.05)` (cubic-bezier(0.16, 1, 0.3, 1)). Active = `scale(0.95)`.
4. **Cards:** Hover = border brightens to `rgba(255,255,255,0.1)`. Featured cards get subtle blue glow on hover.
5. **Transaction rows:** Hover = background `#1f1f1f`. Subtle left-slide-in animation on mount.
6. **Page transitions:** Fade-up on mount (opacity 0→1, translateY 12→0, 400ms, ease `cubic-bezier(0.16, 1, 0.3, 1)`)
7. **Desk offer banner:** Animated shimmer gradient (blue-tinted) + pulsing blue dot + smooth dismiss with height collapse
8. **Processing settlements:** Rotating conic-gradient border animation on card (the Nonco animated border pattern: `conic-gradient(from var(--angle), #05e0f8, #38bdf8, #05e0f8)`)

## Tech Notes

- Next.js App Router with route groups: `(app)/` for shell pages, `/login` outside shell
- ALL numbers in JetBrains Mono with `font-variant-numeric: tabular-nums slashed-zero`
- ALL labels/section headers in JetBrains Mono uppercase with `letter-spacing: 0.15em`
- Responsive: mobile-first, sidebar appears at lg breakpoint (1024px)
- PWA manifest: `theme_color: "#05E0F8"`, `background_color: "#000000"`
- Use Framer Motion for page transitions, list staggers, and card entrance animations
- No external UI library (no shadcn, no MUI) — custom components matching the design system
- Easing curves: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for all transitions

## Mock Data

Use realistic institutional amounts ($50K–$500K per transaction), real FX rates (MXN/USDT ~17.45, EUR/USDT ~1.08, BRL/USDC ~5.15, GBP/USDC ~0.79), and professional counterparty names: Citibank, Deutsche Bank, Banorte, BNP Paribas, Circle, Tether Operations, Coinbase Prime, Galaxy Digital.

## References

- **Revolut** — card grid patterns, quick actions circles, transaction list grouping
- **Wise** — FX quoting flow, price transparency, progressive disclosure
- **Mercury** — dark dashboard aesthetic, professional minimal feel
- **Rain.co** — stablecoin payments UX, clean fintech feel
- **nonco.com** — brand identity, Space Grotesk + JetBrains Mono, blue `#05E0F8` accent, dark surfaces
- **Nonco EoM Reports** — section label pattern (blue bar + mono label), card layouts, stat patterns, brand colors
