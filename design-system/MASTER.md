# Design System — Nonco Stables

Flat, minimal, solid-color institutional UI. Numbers drive hierarchy. Restraint over ornament.

All tokens live in `src/app/globals.css`. This file documents intent and patterns.

## Typography

- **Display / body**: `Space Grotesk` — every label, heading, paragraph
- **Mono**: `JetBrains Mono` — every number, price, timestamp, ID, code
- **Rule**: `font-mono` is reserved for data; never decorative

### Sizes used in product surfaces

| Token | Px | Where |
|---|---|---|
| `text-[9px]` / `text-[10px]` | 9–10 | micro-labels (BID/ASK, 24H, section tags) — `uppercase tracking-[.12em]` |
| `text-[11px]` | 11 | meta info (status pill text, footer) |
| `text-xs` (12) | 12 | dense table body, card pair code |
| `text-sm` (14) | 14 | default body |
| `text-lg` (18) | 18 | card primary price |
| `text-2xl` (24) | 24 | hero numbers (portfolio, desk offer) |
| `text-3xl` (30) | 30 | landing/marketing only |

**Weights**: default `font-normal` (400). `font-medium` (500) for nav/CTAs. Avoid `font-bold` (700) — it clutters dense FX grids. Reserve `font-semibold` (600) only for balance hero.

**Tabular-nums everywhere a number lives** so columns align.

## Colors

All hex values live in `globals.css` — never hardcode.

- **Primary (Nonco cyan)**: `--cyan #05E0F8` — one accent, one brand mark. Used sparingly: CTAs, favorites, active states, positive price flash.
- **Purple**: `--purple #a124f8` — sell side only
- **Surfaces**: `--bg #000` → `--bg-card #141414` → `--bg-elevated #1c1b1b` → `--bg-muted #201f1f` → `--bg-highest #2a2a2a`
- **Text**: white at opacity — `--text 88%` → `--text-2 65%` → `--text-3 45%` → `--text-4 50%` (intentional overlap for subtle layer)
- **Borders**: `--border #1a1a1a` (default, nearly invisible), `--border-outline #3b494c` (hover/focus)
- **Semantic**: `--status-positive #22C55E`, `--red #ef4444`

**Rule**: a screen is 90% neutral. Color only where it resolves a question: which side of the trade? up or down? is this selected?

## Spacing

8pt grid: 1 (4), 2 (8), 3 (12), 4 (16), 5 (20), 6 (24), 8 (32), 12 (48), 16 (64).

- Card inner padding: `p-4` (16) default, `p-5` (20) for feature cards
- Grid gap between cards: `gap-2` (8) for dense FX, `gap-3` (12) for regular lists, `gap-4` (16) for hero sections
- Section padding: `px-4 sm:px-6 md:px-8` horizontal, `space-y-4` vertical rhythm inside a PageTransition
- Table cells: `px-4 sm:px-6 py-3`

## Radii

- **4px** (`rounded`): micro pills, badges
- **6px** (`rounded-md`): inputs, inline buttons
- **8px** (`rounded-lg`): cards, tables, modals, banners
- **9999px** (`rounded-full`): status dots, avatars, section accent dots

## Shadows

Flat aesthetic — shadows are rare. Only on floating layers:

- **Modal**: `shadow-[0_20px_60px_rgba(0,0,0,0.6)]`
- **Dropdown menu**: same as modal
- **Hover cards**: prefer border-color change over shadow

## Motion

- **Micro** (150ms): color, opacity, transform:scale on hover/press
- **Standard** (200–300ms): dialog enter/exit, dropdown, backdrop blur
- **Emphasis** (350–500ms): view switches, page transitions
- **Easing**: `[0.16, 1, 0.3, 1]` (cubic-bezier out-expo) — the house curve. Linear only for progress bars.
- **Rule**: every motion serves feedback or spatial continuity. No "because we can" animations.

## Component patterns

### MarketCard (Trade page)
- Flat surface `bg-[var(--bg-card)]`, border `var(--border)`
- Hover: border → `var(--border-outline)`, `translateY(-1px)`, cyan glow (0 0 20px at 12% opacity)
- No gradient accents. No bold. Pair code in `font-mono text-xs text-white` (not medium, not bold).
- Primary number (bid): `font-mono text-lg` with tabular-nums
- Secondary number (ask): same size, lower opacity (`text-[var(--text-3)]`)
- Change24h: `text-[11px]` colored by sign
- Dots-menu (`⋯`) appears on hover, top-right

### RowView (Trade page)
- Zebra disabled — borders only between rows
- `py-4` body cells (not `py-3`) — looser than before
- Pair column: pair code `text-xs` + section dot; no subtitle "X → Y · Spot" (ruído)
- Numbers: `text-sm font-mono` for prices, `text-xs text-[var(--text-3)]` for quantities
- Remove bold from all cells

### DeskOfferBanner
- Elevated surface `var(--bg-elevated)`, outline border
- Content order: live-pulse → message → countdown → Trade CTA → dismiss
- CTA always cyan, dismiss always ghost

### ViewToggle
- Keep two tabs but simplify: solid background on active, transparent on idle, no inner pill wrapper
- Labels: `text-[10px] uppercase tracking-[.12em] font-medium`

## Rules for consistency
- Never introduce a new color without adding it to `globals.css`
- Numbers = mono, labels = sans. Mixing breaks the institutional feel.
- If a visual element can be removed and the user can still trade, remove it.
