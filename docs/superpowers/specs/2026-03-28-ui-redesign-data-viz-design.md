# Nonco Stables — UI Redesign: Integrated Data-Viz

**Date:** 2026-03-28
**Status:** Approved direction, pending implementation

## Goal

Eliminate visual monotony. Each page gets a unique identity through embedded data visualizations — area charts, donut charts, sparklines, progress rings, bar charts, flow diagrams. Clean/breathable layout (wealth management premium). Subtle geometric patterns (dot-grid, line-grid) as background texture.

## Design Principles

1. **Data IS the grafismo** — every visualization communicates real data, nothing is purely decorative
2. **One hero viz per page** — each page has ONE signature visualization that identifies it
3. **Clean density** — generous whitespace, but information-rich where it matters
4. **Monospace for data** — all numbers, prices, percentages in JetBrains Mono with tabular-nums
5. **Consistent surfaces** — bg-card (#141414), 1px borders (#18181b), 12px border-radius

## Page-by-Page Spec

### 1. Dashboard (`/dashboard`)
- **Hero viz:** Interactive area chart (30-day portfolio) — already exists, keep
- **New:** Donut chart for currency allocation (replaces horizontal bar)
- **New:** Sparklines inline in stable assets table (per currency)
- **Background:** dot-grid pattern (radial-gradient dots, opacity 0.03)
- **Layout:** Hero chart (2/3) + Quick actions (1/3) → Currency breakdown with sparklines → Market watch grid + Activity

### 2. Wallet (`/wallet`)
- **Hero viz:** Donut chart SVG showing currency allocation with total in center
- **Layout:** Full-width hero card with donut left + balance/change/action pills right
- **Action pills:** 5 icons (Receive, Send, Convert→/fx, Earn→/yield, Deposit)
- **Table:** Holdings with sparklines per currency (reuse Sparkline component)
- **Background:** Subtle radial glow (cyan, top-right corner of hero)

### 3. FX Board (`/fx`)
- **Hero viz:** Live price flash animations on sell/buy cells (already exists)
- **Polish:** Cyan-tinted row hover, section color dots, gradient separator lines
- **Keep:** Terminal-style dense grid — this page SHOULD feel denser than others
- **RFS Dialog:** Already built, no changes needed

### 4. Yield Vaults (`/yield`)
- **Hero viz:** Mini area charts inside each vault card showing yield accrual over time
- **Layout:** Metrics strip (horizontal, gap-1px, rounded) → Vault cards grid with embedded charts
- **Each vault card:** Flag, name, APY (large mono), mini area chart (vault-colored), balance/earned rows
- **Accent:** Gradient top bar per vault (vault color → transparent)

### 5. Payments (`/payments`)
- **Hero viz:** Flow diagram showing conversion: Source box → arrow → Destination box with rate inline
- **Layout:** Keep 2-column (form left, history right), add flow diagram above the quote summary
- **Quote summary:** Styled as a mini flow visualization, not just text rows

### 6. Reports (`/reports`)
- **Hero viz:** Gradient bar chart for corridor volume breakdown
- **Layout:** Metrics strip → Bar chart card (left) + Yield table (right)
- **Bar chart:** Vertical bars with gradient fills (corridor-colored), percentage labels below
- **Each bar:** Linear gradient from color/0.3 at bottom to color/0.08 at top

### 7. Settlements (`/settlements`)
- **Hero viz:** Progress rings per settlement term (T+1, T+2, T+10)
- **Layout:** Keep pipeline visualization, add progress rings to the overview section
- **Each ring:** SVG circle with stroke-dasharray showing % complete, term label below

### 8. Bridge & Onchain (`/bridge`, `/onchain`)
- **Background:** dot-grid pattern (already added via data-grid-bg class)
- **No new viz** — these are connect-wallet flows, keep centered and minimal

### 9. Trades (`/trades`)
- **Hero viz:** Horizontal bar chart showing volume by pair (top 5)
- **Already exists** — just ensure bars use gradient fills matching corridor colors

### 10. Third Party, API Keys
- **No new viz** — these are CRUD tables, keep clean and functional
- **Polish:** Consistent badge colors, table spacing

## Shared Components to Build

1. **DonutChart** — SVG donut with configurable segments and center label
2. **MiniAreaChart** — Small area chart for vault cards (colored gradient fill + stroke)
3. **FlowDiagram** — Source → Arrow → Destination boxes for payment preview
4. **BarChart** — Vertical gradient bars for corridor volume
5. **ProgressRing** — SVG circle for settlement term progress

All are pure SVG components — no charting library dependency.

## Background Patterns

- **dot-grid:** `radial-gradient(circle, var(--cyan) 1px, transparent 1px)` at 24px spacing, opacity 0.03
- **line-grid:** Already exists as `.data-grid-bg` class in globals.css
- Apply per-page: Dashboard and Wallet get dot-grid, Bridge/Onchain get line-grid

## Implementation Order

1. Shared viz components (DonutChart, MiniAreaChart, FlowDiagram, BarChart, ProgressRing)
2. Wallet redesign (donut hero + sparklines)
3. Dashboard (donut allocation + dot-grid)
4. Yield (mini area charts in vault cards)
5. Reports (gradient bar chart)
6. Settlements (progress rings)
7. Payments (flow diagram)
8. Polish pass (backgrounds, hover states, consistent spacing)
