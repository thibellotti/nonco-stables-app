# PLAN — Stables App: Apr 27 Feedback Round + Profile Page

> **Source:** `~/Desktop/Stables app feedback (2).pdf` (37 pages, Apr 17 → Apr 27)
> **Scope:** All adjustments in the PDF + new `/profile` page.
> **Status legend:** ☐ todo · ◐ partially done (uncommitted work) · ☑ done

---

## 0. Already in Flight (uncommitted work)

| Item | State | File |
|---|---|---|
| Theme system (dark/light, `data-theme`, localStorage) | ☑ infrastructure | `theme-provider.tsx`, `theme-toggle.tsx` |
| Sidebar "launch mode" — only Dashboard, Trade, Settlements | ☑ behind `NAV_VERSION` flag | `lib/nav-items.tsx` |
| "Pricing" → "Trade" rename | ☑ | `lib/nav-items.tsx` |
| Desk banner copy "Trading desk offers …" | ☑ | `desk-offer-banner.tsx` |
| Favorites primitive | ◐ scattered | `market-watch-widget`, `fx/card-context-menu`, `rfq/favorites-grid` |
| Deposit dialog scaffold | ◐ | `dashboard/deposit-dialog.tsx` |
| Under-construction dialog scaffold | ◐ | `dashboard/under-construction-dialog.tsx` |
| FX widgets vs rows view (`use-widget-selection`) | ◐ | `hooks/use-widget-selection.ts`, `components/fx/` |

---

## 1. Decisions Needed Before I Code (5 open questions)

These shape downstream work — answer these and the plan locks in.

| # | Decision | Default I'd take if you say "you pick" |
|---|---|---|
| Q1 | **Profile page sections** — Account · Preferences (theme, default settlement, density) · Favorites · Notifications · Sign out — what's in for launch? | All five, minimal. Account read-only for now, mock data. |
| Q2 | **Desk-offer banner CTA flow** — clicking "Trade" should: (a) open RFS dialog pre-filled with 17.42 fixed price + qty input, or (b) inline qty input on banner itself? | (a) — reuses existing dialog, less new UI |
| Q3 | **Quick action order on dashboard** — `Convert · Deposit · Send · Earn` or `Convert · Send · Deposit · Earn`? | `Convert · Deposit · Send · Earn` (PDF says "next to Convert") |
| Q4 | **Settlement Overview gauges** — client wrote "I might need to better understand before giving feedback." Keep as-is, redesign, or remove for launch? | Hide for launch — client uncertain, and the table+pipeline already convey it |
| Q5 | **Light mode palette** — full curated light theme (matching nonco.com light look) or quick functional light tokens (white surfaces, dark text, no polish)? | Quick functional for launch, polish post-launch |

---

## 2. Plan — 14 Buckets

### Bucket A · Navigation & Profile
- [ ] **A1.** Add `Profile` link to sidebar bottom (above the user card) — `/profile`
- [ ] **A2.** Build `/profile` page (see Bucket N for details)
- [ ] **A3.** Wire `<ThemeToggle/>` into profile preferences + page header

### Bucket B · Desk Offer Banner (dashboard)
- [ ] **B1.** Change CTA `Get RFS →` → `Trade →` (currently still `Get RFS`)
- [ ] **B2.** Click → open RFS dialog with **fixed price 17.42** (no streaming, no countdown) and qty input limited to ≤ 2M USDT available
- [ ] **B3.** Sync this fixed-price flow with `/trades` page (PDF: "fixed in trades, but not in dashboard")

### Bucket C · Dashboard Hero (`balance-hero.tsx`)
- [ ] **C1.** De-emphasize portfolio graph (smaller, secondary — Convert is the hero per "Previous feedback" slide)
- [ ] **C2.** Make `Convert` the visual primary; ensure 1-click into RFS

### Bucket D · Quick Actions Row
- [ ] **D1.** Reorder to `Convert · Deposit · Send · Earn`
- [ ] **D2.** Rename `Receive` → `Deposit`
- [ ] **D3.** Wire `Deposit` click → existing `deposit-dialog.tsx` (verify content matches Bucket E)
- [ ] **D4.** Wire `Earn` click → `under-construction-dialog.tsx`

### Bucket E · Deposit Dialog (Binance-style)
- [ ] **E1.** Two tabs: `Bank transfer` (fiat — show bank details) · `Crypto wallet` (current)
- [ ] **E2.** Currency search bar at top
- [ ] **E3.** "Most used" / recent currencies pinned at top
- [ ] **E4.** QR code generator for wallet address
- [ ] **E5.** Network selector (BSC, TRX, APT, ETH, …) per coin
- [ ] **E6.** Copy-to-clipboard for address; show min deposit + arrival time per network

### Bucket F · Stable Assets List (dashboard right column)
- [ ] **F1.** Remove sparkline graphs
- [ ] **F2.** Remove bank/issuer line ("Citibank N.A.", "Tether", etc.)
- [ ] **F3.** Remove % change column
- [ ] **F4.** Final row layout: `[icon] [code] ........ [balance]`

### Bucket G · Market Watch Widget (dashboard)
- [ ] **G1.** Show user's most-traded pairs (or favorites — see Bucket I)
- [ ] **G2.** Each card shows: pair · BID · ASK · 24h % · `Trade` button
- [ ] **G3.** `Trade` opens RFS dialog pre-filled with that pair
- [ ] **G4.** Reduce bold weight (per "remove bold" feedback)

### Bucket H · Recent Activity (dashboard)
- [ ] **H1.** Fix `View all` link — currently goes to "weird page"; should land on `/trades` or `/settlements/completed` (confirm in Q-followup)

### Bucket I · Favorites System (cross-page)
- [ ] **I1.** Promote favorites from scattered components into shared store (`stores/favorites.ts` Zustand)
- [ ] **I2.** Star icon on every pair card (Trade page widgets + rows + RFQ grid)
- [ ] **I3.** "Show favorites only" toggle on Trade page
- [ ] **I4.** Dashboard Market Watch reads from favorites store
- [ ] **I5.** Profile → Favorites section lists all + lets user remove

### Bucket J · Trade Page (`/fx`)
- [ ] **J1.** Verify view toggle (widgets ↔ rows) works smoothly with the new favorites
- [ ] **J2.** Reduce bold across widget cards (especially BID/ASK numbers)
- [ ] **J3.** Reduce bold in rows view headers + values
- [ ] **J4.** Order squares by user's usage frequency (most-used first; favorites pinned above)

### Bucket K · RFS Dialog (`rfs-dialog.tsx`)
- [ ] **K1.** Title subtitle should reflect selected settlement: e.g. `MXN/USDC — Tomorrow (TOM)` instead of static `Spot (T+2)`
- [ ] **K2.** Settlement label in summary footer must update (was showing `Spot (T+2)` even when `TOD` selected — should be `T+0`)
- [ ] **K3.** `EST. RECEIVE` field truncating ("17,465,3…") — widen column or use full-width on bottom row

### Bucket L · Settlements — Overview Strip
- [ ] **L1.** Remove `Next Due` card (per PDF Apr 24 + Apr 27)
- [ ] **L2.** Remove `Counterparty Exposure` card
- [ ] **L3.** Settlement Pipeline bar — pick one of `Processing` / `Awaiting` (Fer's mock had only one) — see Q-followup
- [ ] **L4.** Overview gauges card — hide for launch (per Q4)

### Bucket M · Settlements — Tables
- [ ] **M1.** **Pending table:**
  - Make table wider (full content width)
  - Remove bold from amounts
  - Remove `Counterparty` column
  - Remove `Progress` column
  - Add search bar (filter by pair, e.g., "MXN")
- [ ] **M2.** **Completed table:**
  - Add date range filter (top-right alongside Export CSV)
  - Add `Hash` column (txid for crypto, `—` for fiat)
  - Add `Wallet` column (address for crypto, `—` for fiat)

### Bucket N · `/profile` Page (NEW)
File layout:
```
src/app/(app)/profile/page.tsx
src/components/profile/
  account-card.tsx           # avatar, name, role, email, org
  preferences-card.tsx       # theme toggle, default settlement, density
  favorites-card.tsx         # list + remove (reads favorites store)
  notifications-card.tsx     # email/push toggles
  sign-out-button.tsx
```
- [ ] **N1.** Page shell with `<PageHeader>` matching other pages
- [ ] **N2.** Account card — read-only mock (Fernando M., Admin, Treasury 01)
- [ ] **N3.** Preferences card — theme · default settlement (Spot/T+0/T+1/T+2) · table density
- [ ] **N4.** Favorites card — pulls from store (Bucket I), remove inline
- [ ] **N5.** Notifications card — UI only (toggles bound to local state)
- [ ] **N6.** Sign-out button (mock; just clears any session-shaped state)

### Bucket O · RFQ Favorites Grid
- [ ] **O1.** Remove bold from pair labels (`favorites-grid.tsx`)

### Bucket P · Light Mode (Q5 dependent)
- [ ] **P1.** Audit `globals.css` — every hex/oklch token gets a `[data-theme="light"]` override
- [ ] **P2.** Sweep components for hardcoded `text-white`, `bg-black` — replace with tokens
- [ ] **P3.** Test: dashboard, trade, settlements, profile all readable in light
- [ ] **P4.** Three.js globe: confirm visible against light bg (or hide in light mode)

---

## 3. Sequencing (4 sessions)

**Session 1 — Foundation (Buckets I, A, N)**
Favorites store → Profile page → Sidebar `/profile` link.
*Why first:* Profile + favorites unblock dashboard market watch + trade page.

**Session 2 — Dashboard (Buckets B, C, D, E, F, G, H)**
Banner fix → quick actions reorder → deposit dialog → stable assets → market watch → activity link.
*Why next:* Highest-traffic page, biggest visible change.

**Session 3 — Trade + RFS (Buckets J, K, O)**
Trade page polish → RFS dialog T+0 + truncation fixes → RFQ bold removal.

**Session 4 — Settlements + Light Mode (Buckets L, M, P)**
Strip cleanup → pending table → completed table + new columns → light mode sweep.

---

## 4. Risks & Notes

- **Uncommitted churn:** ~20 modified files + 3 new components are uncommitted. Recommend committing the in-flight work as a checkpoint before starting Session 1, so we have a clean revert point.
- **RFS dialog reuse:** Buckets B, G, J all funnel into `rfs-dialog.tsx`. Make sure the API for "open with pre-filled pair / fixed price / settlement" is unified.
- **Settlement Pipeline (L3) + Gauges (L4):** Both flagged by client as confusing. Worth a 5-min call to confirm the kill list before implementing.
- **Light mode:** Three.js particle globe is a known dark-mode-only element. Either swap to white particles in light, or hide the globe entirely.

---

## 5. Out of Scope (for this round)

- Real backend integration (everything still uses `mock-data.ts`)
- Bridge / Yield / On-chain pages (hidden in launch sidebar)
- Mobile-specific layouts beyond what already exists
- Globe re-positioning (HANDOFF.md issue — defer)
