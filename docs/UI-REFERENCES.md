# Nonco Stables — UI/UX Reference Research

> Compiled 2026-03-27. Deep research across 30+ products and design systems.
> Goal: Inform the visual direction of the Nonco Stables institutional stablecoin platform.

---

## Table of Contents

1. [Category 1: Institutional Fintech](#1-institutional-fintech)
2. [Category 2: Crypto/Trading Platforms](#2-cryptotrading-platforms-premium-tier)
3. [Category 3: Award-Winning Financial UI](#3-award-winning-financial-ui--design-tools)
4. [Category 4: Design Systems & Patterns](#4-design-systems--patterns)
5. [Synthesis: What to Adapt for Nonco Stables](#5-synthesis-what-to-adapt-for-nonco-stables)

---

## 1. Institutional Fintech

### 1.1 Mercury

**URL:** https://mercury.com
**What it is:** Banking platform for startups. 367 UI screens documented, 112 components.

**What makes it visually distinctive:**
- Token-based semantic color system grouped by usage ("Background/Primary", "Surface/Secondary") — every shade maps to a role, not a raw hex. This is exactly how Nonco Stables should think about color.
- Soft gradients and muted color palettes on all surfaces. The card design favors numberless simplicity — no visual noise.
- Dark mode uses a light-gray-to-dark spectrum (not pure black). The overall vibe is "secure but friendly".
- Morphing card animations on the marketing site — levitating metallic card with shimmer.

**Color palette approach:**
- Muted, cool-toned palette. No aggressive accent colors. Purple-blue family for brand, with semantic green/red for states.
- Dark mode follows semantic tokens, not mechanical inversion.

**Typography:**
- Uses Lato (body, weights 100-900) and Montserrat (headings, weights 100-900) in marketing. Product interface uses a custom type system with clear weight hierarchy.
- Generous line height, tight letter-spacing on headings.

**Card/component patterns:**
- Card-based layout with metrics and charts at the top level.
- Payment flows follow a strict linear journey: recipient selection > payment method (ACH/Check/Wire/International) > confirmation > summary.
- Balance display + recent transactions + action menu ("pay", "add funds", "request payment", "transfer").

**Data visualization:**
- Straightforward numerical presentation — balance displays, transaction lists. Not chart-heavy for the primary dashboard.
- Treasury dashboard shows balances, reconciliation, and cash position in a clean grid.

**What we could adapt:**
- Semantic token system approach (we already do this, but Mercury's grouping by usage is more mature).
- Linear payment flow patterns for our trade execution.
- The "no visual noise" principle — every element earns its place.

---

### 1.2 Stripe

**URL:** https://stripe.com (Dashboard: https://dashboard.stripe.com)
**What it is:** The gold standard for developer-facing financial platforms.

**What makes it visually distinctive:**
- Stripe does NOT have native dark mode in its dashboard (as of 2026). This is surprising — third-party extensions fill the gap. This tells us: dark mode is NOT universal even at the highest tier.
- The visual identity is light, airy, with extreme precision. Every pixel is measured.
- Color coding is semantic: green for success, red for issues. Key metrics front and center.

**Color palette approach:**
- Built an accessible color system using **CIELAB (Lab) color space** instead of HSL/RGB, because CIELAB is perceptually uniform. Colors at the same lightness LOOK equally light.
- Rule: "Any two colors guaranteed sufficient contrast if at least 5 levels apart (small text) or 4 levels apart (large text/icons)."
- Minimum 4.5:1 contrast for small text, 3.0:1 for large text (WCAG 2.0).
- They built custom internal tooling to visualize color in Lab space.

**Typography:**
- Custom font system through their UI toolkit. Weight and size controlled through tokens, not arbitrary CSS.
- Developers can't choose arbitrary fonts in the Stripe Apps SDK — consistency is enforced.

**Component patterns:**
- Modular UI components with strict platform consistency.
- Same design language across all surfaces: white space, clean typography, logical layout.
- Dashboard shows business charts at a glance, links to Payments/Payouts/Disputes/Customers/Balance.

**What we could adapt:**
- The CIELAB-based accessible color system approach. Our `--cyan` at #05E0F8 should be validated against this.
- The "5 levels apart" contrast rule for our text hierarchy.
- Strict component consistency — if a pattern appears once, it should be the same everywhere.

---

### 1.3 Column

**URL:** https://column.com
**What it is:** Nationally chartered bank built for developers. API-first banking infrastructure.

**What makes it visually distinctive:**
- The most design-forward bank website in the industry. Minimal, confident, with a Suisse International typeface that signals European precision.
- Deep navy CTAs against clean white surfaces. Not dark mode, but demonstrates that restraint = premium.

**Color palette (exact values from source):**
- Primary CTA: `--color-blue-800: rgb(17,26,74)` — deep navy
- Accent: seafoam (`--color-seafoam-700`), cyan
- Inverted sections: `--color-gray-900` background with white text
- Card shadows: `0 0 0 1px rgba(0,0,0,0.025), 0 16px 32px rgba(0,0,0,0.05)`

**Typography (exact values):**
- **Font:** SuisseIntl (Regular 300, Book 400, Medium 500, SemiBold 600)
- **Mono:** SuisseIntlMono
- Headings: 24-60px responsive, letter-spacing: -0.01em to -0.03em
- Body: 14-16px, line-height 1.1
- Subtext: 12px at 0.5-0.6 opacity
- Weight strategy: 500-600 for emphasis, 300 for supporting copy

**Spacing (exact values):**
- 12-column responsive grid
- Gaps: 20px mobile, up to 72px desktop
- Container padding: 1.25rem mobile, 1.5rem desktop
- Section padding: 72px vertical mobile, 144px desktop
- Gap variables: 8px-48px increments (consistent 8pt grid)

**Component patterns:**
- Buttons: Blue-800 bg + white text, shadow `0 2px 4px rgba(0,0,0,0.25)`, height 36px, padding 0-16px, border-radius 8px
- Secondary buttons: `rgba(255,255,255,0.5)` bg with 0.2px blur backdrop
- Cards: border-radius 6-8px
- Transitions: 0.2-0.3s cubic-bezier easing

**What we could adapt:**
- The SuisseIntl approach — our Space Grotesk + JetBrains Mono is actually a strong parallel. Same "precision engineering" vibe.
- The exact shadow values for elevated cards (their shadow is extremely subtle).
- 144px section padding on desktop — generous, premium breathing room.
- Their subtext opacity (0.5-0.6) is a smart way to create hierarchy. We use `--text-4: #737373` which is similar.

---

### 1.4 Modern Treasury

**URL:** https://www.moderntreasury.com
**What it is:** Payment operations platform for enterprise. Direct competitor in terms of what Nonco Stables does (moving money).

**What makes it visually distinctive:**
- Workflow-centric design — every screen serves a "job to be done", not a feature showcase.
- **Data is never truncated or rounded.** "The dashboard doesn't round down or truncate data — information is shown as explicitly and granularly as possible." This is CRITICAL for financial platforms.
- Command palette (Cmd+K) for rapid navigation — a Linear/Vercel pattern applied to finance.

**Component patterns:**
- Dashboard widgets: Balances (real-time), Bank Accounts (consolidated), Reconciliation Stats, Payment Alerts, Cash Flow viz, ACH return rates.
- Side navigation expanded for job-based workflows.
- Approval flags in top-left corner — immediate visibility.
- Reconciliation: side-by-side layout for transactions vs expected payments.
- Rules displayed in "human language" not JSON.
- 95% automated matching engine.

**What we could adapt:**
- The "never truncate financial data" principle. Our mono-nums should show full precision.
- Cmd+K command palette is a must-have for power users.
- Approval flags / notification badges in sidebar.
- Reconciliation side-by-side pattern for our settlement matching.

---

### 1.5 Ramp

**URL:** https://ramp.com
**What it is:** Corporate card and expense management. Valued at $8.1B. #1 most innovative company (Fast Company).

**What makes it visually distinctive:**
- The "Bento Box" design system — a flexible grid that adapts to both low-density (abstract images) and high-density (currency animations) visual compositions.
- Dark mode built-in as a core feature, not an afterthought.
- Bridges brand and product — the marketing site and the product UI share the same visual DNA.

**Design system details:**
- Custom color palette (specific hex not public)
- Defined type scales for various sizes
- Formal motion expression system
- The Bento Box grid handles everything from empty states to data-dense analytics

**What we could adapt:**
- The Bento Box approach for our dashboard cards — a flexible grid that works for both the overview KPIs and the dense FX board.
- Motion expression system — we have flash animations, but could formalize this.

---

### 1.6 Brex

**URL:** https://brex.com
**What it is:** Business spend platform for growing companies.

**What makes it visually distinctive:**
- Blazing-fast UI with 100+ improvements shipped in a single update (Summer 2024).
- AI-powered accounting with "continuous close" — the UI adapts to reduce manual work.
- Card control center manages cards at scale.

**What we could adapt:**
- Speed as a design principle — perceived performance matters for trading platforms.
- AI-assisted accounting UI patterns.

---

### 1.7 Increase

**URL:** https://increase.com
**What it is:** Enterprise-grade Banking APIs. Direct competitor to Column.

**What makes it visually distinctive:**
- Developer-first with prominent code samples integrated into the marketing design.
- Grayscale partner logos (Gusto, Stripe, Ramp) suggest neutral, professional aesthetic.
- Full-width hero with centered content, generous whitespace.
- Multi-column layouts for products and use cases.

**What we could adapt:**
- The "developer credibility through code" approach — our API documentation and settlement flow could show code snippets.
- Grayscale treatment for partner/chain logos in our network section.

---

## 2. Crypto/Trading Platforms (Premium Tier)

### 2.1 Coinbase Prime

**URL:** https://prime.coinbase.com
**What it is:** Institutional crypto prime brokerage. The dominant institutional crypto platform.

**What makes it visually distinctive:**
- Single unified interface for trading, custody, financing, and risk management.
- New trading UI launched 2025-2026 with unified cross-margin across spot, derivatives, perps.
- Single portfolio view with capital moving fluidly across strategies.

**Key UI patterns:**
- Trading UI + FIX API + REST API access from one platform
- Admin integration, audit trails, consensus workflows
- Smart Order Router visualization (TWAP, VWAP, basis, adaptive algorithms)
- 24/7 trading with brief weekly maintenance windows
- Multi-market exposure through single portfolio view

**What we could adapt:**
- Unified portfolio view pattern for our settlement dashboard.
- The "single interface for everything" approach — trade, settle, report.
- Audit trail visibility inline with transactions.

---

### 2.2 Fireblocks

**URL:** https://www.fireblocks.com
**What it is:** Digital asset and stablecoin infrastructure. THE institutional crypto custody platform. Nonco's own infrastructure partner.

**What makes it visually distinctive (exact values):**
- **Primary text:** Dark navy `#212647`
- **Interactive elements:** Periwinkle/blue `#4568F3`, `#4F83FF`, `#415080`
- **Backgrounds:** Neutral grays `#F4F5F7`, `#E7E9EF`, `#D9D9D9`
- **Borders:** `#E5E7EB`, 1px
- Avoids crypto's typical neon or chaotic visual language.

**Typography (exact values):**
- **Headings:** Ufficio Fireblocks (custom), weight 600, letter-spacing -0.035rem
- **Body:** Figtree, responsive sizing clamp(16-18px), line-height 1.3
- Weight strategy: Bold for confidence, regular for readability

**Component patterns:**
- Constrained grids: max 1440px content, 3-column grids
- Consistent spacing: multiples of 1rem
- Buttons: 12px border-radius, solid periwinkle backgrounds
- Cards: subtle 1px borders, light backgrounds with rgba transparency

**Dashboard features:**
- Operations dashboard for token management
- Staking dashboard: stake, monitor positions, manage rewards in real-time
- Configurable admin quorum for transfer approvals
- SOC II Type 2, three ISO certifications

**What we could adapt:**
- Since Nonco literally USES Fireblocks, visual coherence with their platform creates trust.
- The restrained periwinkle-navy palette is an interesting contrast to our cyan. We stay on brand with cyan but could learn from their restraint.
- 12px border-radius for buttons (we use `rounded-lg` which is 8px — worth evaluating).
- The admin quorum approval flow UI for our settlement approvals.

---

### 2.3 Anchorage Digital

**URL:** https://www.anchorage.com
**What it is:** First federally chartered crypto bank. Institutional custody, trading, staking.

**What makes it visually distinctive (exact values):**
- **Background:** Deep charcoal `#141415`, `#252526` — EXTREMELY close to our `--bg: #131313` and `--bg-card: #141414`
- **Accent blue:** `#5580F6` — bright, credibility-signaling blue
- **Text:** Light gray `#CACBCE`, `#E4E5E7`
- **Borders:** Light `#E4E5E7`, Dark `#4E5055`
- Font features: `ss04` OpenType stylistic set enabled throughout

**Component patterns:**
- Floating label inputs with pointer-event optimization
- Swiper-based testimonial carousels with custom pagination (8px dots, `#5580F6` active)
- Clipped sections with diagonal `clip-path: polygon()` angles
- Centered containers with auto margins
- Responsive: 3 columns desktop, 2 tablet, 1 mobile

**Layout aesthetics:**
- Hover effects with opacity transitions (not scale)
- Micro-animations for form interactions (label floating)
- Abundant whitespace reinforcing professional positioning

**What we could adapt:**
- Their dark background values are nearly IDENTICAL to ours. This validates our `--bg: #131313` and `--bg-card: #141414` choices.
- Their text color `#CACBCE` is close to our `--text-2: #bac9cc` — validating our hierarchy.
- The `#5580F6` blue accent is interesting — it's in the same "trustworthy blue" family as our `--cyan` but warmer and less saturated. Our cyan is more distinctive.
- Floating label inputs for our trade forms.

---

### 2.4 Circle (USDC)

**URL:** https://www.circle.com/circle-mint
**What it is:** Issuer of USDC. Circle Mint is the institutional minting/redemption platform.

**What makes it visually distinctive:**
- **Custom color tokens:** "Jelly" series for CTAs (`--colors--jelly--400`, `--colors--jelly--300`) — purple-blue accent
- **Neutrals:** "Licorice" variants for text hierarchy (licorice-700, -500, -200)
- **Gradients:** "Gumdrop Frosting" — white opacity blending with purple-blue
- Enterprise formality meets contemporary design

**Component patterns:**
- Study cards with hover animations (link underlines expand to 100%)
- Feature cards with transparent backgrounds and gradient overlays
- Staggered grid with CSS `translate3d` transforms
- Rounded rectangle buttons with state variations (hover darkens jelly colors)
- Inputs: 24px checkboxes with gradient fill on selection, 1px licorice borders
- Microinteractions: icon translations, scale transforms

**Platform capabilities:**
- Web console + API for minting/redemption
- Multi-entity treasury operations
- Near-instant settlement
- SSO/Passkey authentication, user-level permissions

**What we could adapt:**
- Named color token approach (Jelly, Licorice, Gumdrop) — we could name our token families for clarity.
- The "enterprise formality meets contemporary" balance is exactly our target.
- Multi-entity treasury operations UI patterns.

---

### 2.5 Paxos

**URL:** https://www.paxos.com
**What it is:** Regulated blockchain infrastructure. Issues USDP, powers PayPal's PYUSD.

**Dashboard features:**
- SSO/Passkey authentication
- Granular reporting and balance information across assets
- User-level permissions (developer, manager, approver roles)
- Multi-entity support for enterprises
- 24/7 stablecoin transactions
- Multi-asset support (PAXG, BTC, ETH, SOL, LTC, etc.)

**What we could adapt:**
- Role-based permission UI (developer vs manager vs approver views).
- Multi-entity management patterns.

---

### 2.6 B2C2

**URL:** https://www.b2c2.com
**What it is:** Institutional crypto liquidity provider. OTC spot, derivatives, loans.

**What makes it visually distinctive (exact values):**
- **Primary accent:** Deep purple-magenta `#8A195D`, `#4C0E50`
- **Text:** Dark charcoal `rgb(48,48,48)`
- **Typography:** Lato (body) + Rubik (headers, weights 300-700). Rubik Mono One for distinctive headlines.
- White/gray backgrounds, not dark mode.

**Component patterns:**
- Glass-morphism elements with semi-transparent overlays
- Carousel components (Flickity) for featured content
- Modular card-based press/insights grid
- Sticky header for brand presence during scroll

**Trading UI (Marea platform):**
- Options Chain: streaming prices, visual interface for point-and-click OTC options
- Trade blotter with aggregated positions
- Post-trade reporting
- ISDA margin functionality

**What we could adapt:**
- Options Chain pattern for our FX board — streaming prices in a grid.
- Trade blotter with aggregated positions for settlement tracking.
- The Rubik Mono One approach for distinctive numerical displays.

---

### 2.7 Cumberland (DRW)

**URL:** https://www.cumberland.io
**What it is:** Subsidiary of DRW. Leading crypto liquidity provider since 2014.

**Key UI (Marea platform):**
- Single-dealer platform with streaming, real-time, two-way pricing
- Access via voice, chat, API, or web platform
- No pre-funding required
- 24/7 relationship manager access

**What we could adapt:**
- Two-way pricing display (bid/ask) — we already have this in our FX board.
- Multi-access pattern (web + API + chat) for our platform.

---

## 3. Award-Winning Financial UI & Design Tools

### 3.1 Dark Mode Dashboard Principles (Cross-Industry Research)

**Background colors — the definitive approach:**
- NEVER use pure black `#000000`. Use very dark gray: `#121212` or `#1E1E1E`
- Our `--bg: #131313` falls RIGHT in this sweet spot.
- Surface elevation: darker base > lighter cards > lightest interactive elements

**Text colors:**
- Primary: light gray or off-white (NOT pure `#FFFFFF`)
- Our `--text: #E5E2E1` is correct — warm off-white
- WCAG minimum: 4.5:1 for body text, 7:1 for critical financial data

**Accent color rules:**
- Use vibrant colors (blue, green, orange) for interactive elements
- AVOID overuse — excessive brights create chaos in financial interfaces
- Our `--cyan: #05E0F8` is strong but should be used surgically

**Do's:**
- High contrast text against dark backgrounds
- Test across different lighting environments
- Maintain brand color visibility in accents/buttons
- Ensure WCAG compliance for colorblind users

**Don'ts:**
- Pure black backgrounds
- Heavy animations, excessive gradients, or too many shadows
- Drop shadows/gradients reducing legibility of financial data
- Reducing legibility for style

---

### 3.2 Fintech Dashboard Component Patterns (Industry Standard)

**KPI Card architecture:**
1. **Summary cards:** Large number + short label + delta indicator (+2.3% WoW) + sparkline
2. **Segmented summary:** Tab-based switching (Accounts/Cards/Wallets)
3. **Actionable cards:** Primary CTAs ("Verify KYC", "Complete transfer")
4. **Risk alerts:** Severity indicators, time windows, detail links

**Data table standards:**
- Frozen headers with horizontal scrolling for wide data
- Dense mode toggle: 12-14px typography, zebra-striped rows
- Minimum 44px row height for touch interfaces
- Column utilities: sort, filter chips, saved views, visibility toggles, CSV export
- Right-aligned inline actions ("Refund", "Hold", "Details")
- Batch operations for multi-select
- Our table standard (`px-6 py-3` headers, `px-6 py-4` body) aligns well

**Spacing scale (industry consensus):**
- 4/8/12/16/24px increments — matches our 8pt grid

**Chart theming:**
- 6-8 categorical colors with light/dark contrast validation
- Green = profit/increase, Red = loss/decrease (universal convention)
- Our green `#22C55E` and red `#EF4444` follow this correctly

**Information architecture:**
- Domain separation: Overview, Accounts, Cards, Payments, Risk
- Global search supporting entity shortcuts (txn:, user:, card:)
- Related indicators grouped visually
- Real-time updates
- Consistent hierarchy (size/color emphasis)

---

### 3.3 Fintech Trust Patterns (From 15 Real App Analysis)

**Key learnings from top fintech apps:**

| Pattern | Example | Relevance |
|---------|---------|-----------|
| Transparent pricing upfront | Wise | Our RFQ flow |
| Monochrome palette + dark accents in sidebar | Invyzia | Our sidebar approach |
| Card-based layout guiding attention | Revolut | Our dashboard grid |
| Green success / Red issue color coding | Stripe | Our status colors |
| Progressive disclosure | Wise, Chime | Our trade flow |
| Familiar patterns + consistent element placement | Monarch Money | Platform navigation |
| Subtle motion, not decorative | Uniswap | Our Framer Motion use |
| Deep green + gold accents | Alture Funds | Alternative to our cyan |
| Bold typography with narrative-rich graphics | Altruist | Our section headers |

---

## 4. Design Systems & Patterns

### 4.1 Linear (The Benchmark)

**URL:** https://linear.app
**Why it matters:** Linear defined the modern dark SaaS aesthetic. "Linear-style" is now an industry term.

**Color system:**
- Migrated from HSL to **LCH color space** — perceptually uniform (same approach as Stripe's CIELAB but newer)
- Theme defined by only **3 variables: base color, accent color, contrast (30-100)**
- All other palette values generated automatically
- Reduced chrome (blue) usage for "more neutral and timeless appearance"
- 2024: dull monochrome blue with few bold colors
- 2025: monochrome black/white with EVEN FEWER bold colors — maximum restraint

**Typography:**
- **Headings:** Inter Display — adds expression while maintaining readability
- **Body:** Inter — the workhorse
- Dark gray text on black background (not pure white on pure black)

**Key design decisions:**
- Reduced visual noise in sidebar, tabs, headers, panels
- Improved vertical and horizontal alignment of labels, icons, buttons
- Changes felt "after a few minutes" rather than immediately — subtlety over shock
- Custom theme generator for users who want unique look
- Contrast variable: 30-100, enabling "super high-contrast themes for accessibility"

**Gradient approach:**
- Angular gradients (not linear): `#08AEEA > #2AF598 > #B5FFFC > #FF5ACD > #FFFFFF`
- Layer blur applied to gradient shapes for soft diffusion
- Multiple color stops with varying opacity percentages

**What we could adapt:**
- LCH color space for generating our palette systematically.
- The "3 variables define the theme" approach: base (#131313), accent (#05E0F8), contrast level.
- The restraint trend — 2025 is even MORE minimal than 2024.
- Inter Display for headings alongside Inter body — but we have Space Grotesk which is more distinctive.

---

### 4.2 Vercel / Geist Design System

**URL:** https://vercel.com/geist
**Why it matters:** The most influential developer-facing design system. Dark mode reference standard.

**Color system (10 scales):**
- Backgrounds, Gray, Gray Alpha, Blue, Red, Amber, Green, Teal, Purple, Pink
- P3 colors on supported browsers/displays
- Two background levels:
  - `--ds-background-100`: Default element background
  - `--ds-background-200`: Secondary background for subtle differentiation

**Gray scale architecture (1-10):**
| Range | Role | Token |
|-------|------|-------|
| 1-3 | Component backgrounds (default, hover, active) | `--ds-gray-100` to `--ds-gray-300` |
| 4-6 | Borders (default, hover, active) | `--ds-gray-400` to `--ds-gray-600` |
| 7-8 | High contrast backgrounds | `--ds-gray-700`, `--ds-gray-800` |
| 9-10 | Text & icons (secondary, primary) | `--ds-gray-900`, `--ds-gray-1000` |

This architecture is BRILLIANT. Each number range has a specific role. No ambiguity.

**Typography system:**
| Class | Use | Size Range |
|-------|-----|------------|
| `text-heading-72` to `text-heading-14` | Page/section headers | 72px down to 14px |
| `text-button-16/14/12` | Buttons only | 16px, 14px, 12px |
| `text-label-20` to `text-label-12` | Single-line text | 20px to 12px |
| `text-label-XX-mono` | Monospace variants | Paired with labels |
| `text-copy-24` to `text-copy-13` | Multi-line body text | 24px to 13px |

**Font family:**
- Geist Sans: based on Swiss typography principles
- Geist Mono: for code, diagrams, terminals
- Geist Pixel: display font in 5 stylistic variants

**Modifiers:** `<strong>` with "Subtle" or "Strong" for emphasis variation.

**Brand core colors:** #000000, #FFFFFF, #171717

**What we could adapt:**
- The 1-10 gray scale with role-based ranges. We should map our surface hierarchy to this:
  - bg/bg-card/bg-elevated = Geist backgrounds 1-3
  - borders = Geist 4-6
  - bg-bright/bg-highest = Geist 7-8
  - text-4/text-3/text-2/text = Geist 9-10
- The label/copy/heading/button typography separation.
- Mono variants paired with each label size.
- The new dashboard (Feb 26, 2026) prioritizes speed over sparkle.

---

### 4.3 Arc Browser

**URL:** https://arc.net
**Why it matters:** Redefined browser UI with a designer's lens.

**Design philosophy:**
- Minimalistic, muted bright colors with serif font combinations
- Clean lines, ample negative space, content first
- Soft rounded corners, subtle animations, smooth transitions
- Creates "mental calm" — essential for information-dense interfaces
- Figure-ground principle: minimize visual clutter by prioritizing content

**Typography system:**
- Small number of base styles in general hierarchy
- Consistent relationships without rigidity in dense content areas
- Goal: manage CSS complexity while providing clear designer direction

**What we could adapt:**
- "Mental calm" as a design goal for our trading platform — financial decisions need clarity, not stimulation.
- The figure-ground principle: our data tables and price boards should be the "figure", everything else is "ground".
- Consistent but not rigid type system for varying content density.

---

### 4.4 Raycast

**URL:** https://raycast.com
**Why it matters:** Premium dark mode reference. Command-palette-first UX.

**Design approach:**
- Dynamic color system: adjusts automatically for high contrast with active theme
- Supports HEX, RGBA, RGBA Percentage, HSL color formats
- Custom themes (Pro feature) with full control
- Dark mode is the DEFAULT, light mode is the option

**What we could adapt:**
- Command palette (Cmd+K) as primary navigation — Modern Treasury does this too.
- Dynamic color adjustment for accessibility.
- Dark-first design philosophy (we're already here).

---

## 5. Synthesis: What to Adapt for Nonco Stables

### 5.1 Our Current Design Validates Well

After researching 30+ products, our existing Nonco Stables design tokens align with industry best practices:

| Our Token | Value | Industry Validation |
|-----------|-------|-------------------|
| `--bg` | `#131313` | Anchorage uses `#141415`. Industry says `#121212`-`#1E1E1E`. We're perfect. |
| `--bg-card` | `#141414` | Anchorage uses `#141415`. Exact match. |
| `--text` | `#E5E2E1` | Warm off-white. Better than pure `#FFF`. Correct approach. |
| `--text-4` | `#737373` | Good muted level. Column uses 0.5-0.6 opacity for similar effect. |
| `--cyan` | `#05E0F8` | More distinctive than Anchorage's `#5580F6` or Fireblocks' `#4568F3`. Unique brand asset. |
| `--border` | `#18181B` | Subtle. Industry standard. |
| Space Grotesk | sans-serif | More distinctive than Inter/Geist. Geometric, quirky — differentiator. |
| JetBrains Mono | numbers | Industry best practice. Tabular nums + slashed zero. |

### 5.2 What We Should Steal

**From Vercel/Geist:**
- Formalize our gray scale into numbered tiers (100-1000) with explicit roles.
- Add mono variants for each label size tier.
- Separate typography into heading/label/copy/button categories.

**From Linear:**
- Increase restraint. Our cyan should appear in fewer places, not more.
- Consider LCH color space for palette generation.
- "Changes felt after a few minutes" — polish is about subtlety.

**From Modern Treasury:**
- Never truncate financial data. Full precision always.
- Cmd+K command palette for power users.
- Approval flags in sidebar navigation.
- Reconciliation side-by-side layout.

**From Column:**
- Section padding: 72px mobile, 144px desktop. Premium breathing room.
- Subtext at 0.5-0.6 opacity (we use `--text-4` at ~45% brightness — slightly darker, could go lighter).
- Card shadows: `0 0 0 1px rgba(0,0,0,0.025), 0 16px 32px rgba(0,0,0,0.05)` — extremely subtle elevation.

**From Stripe:**
- CIELAB/LCH-based accessible color validation.
- "5 levels apart" contrast guarantee rule.
- Semantic green/red as the ONLY color coding in data.

**From Coinbase Prime:**
- Single portfolio view pattern.
- Audit trail inline with transactions.
- Algorithm visualization (TWAP/VWAP) for advanced users.

**From Fireblocks:**
- Admin quorum approval flow.
- Since Nonco uses Fireblocks, subtle visual coherence creates user trust.

**From Anchorage:**
- Validates our entire dark palette is institutional-grade.
- Floating label inputs for forms.
- `ss04` OpenType features for refined typography.

**From Circle:**
- Named color token families (Jelly, Licorice) for team communication.
- Multi-entity treasury operations UI.

**From Ramp:**
- Bento Box flexible grid for varying content density.
- Formal motion expression system.

### 5.3 What to AVOID

- Stripe's light-only approach — dark mode is essential for trading platforms.
- Fireblocks' periwinkle — too corporate, not distinctive enough.
- B2C2's purple-magenta — clashes with crypto credibility.
- Generic "SaaS blue" that every other fintech uses (#5580F6, #4568F3, etc.).
- Overusing glassmorphism — one glass panel is interesting, ten is gimmicky.
- Rounded corners over 12px on cards — institutional means sharp, not playful.
- Chart-heavy dashboards without clear hierarchy — data should be scannable.

### 5.4 Priority Actions

1. **Formalize token architecture** — Map our existing tokens to Geist's 1-10 numbered system with explicit roles.
2. **Add Cmd+K** — Command palette for navigation, trade search, counterparty lookup.
3. **Validate contrast** — Run our full palette through CIELAB-based contrast checking.
4. **Increase section spacing** — Move toward 96-128px desktop section padding.
5. **Never truncate** — Audit all number displays for full financial precision.
6. **Restrain cyan** — Use `--cyan` only for primary CTAs and active states. Not decorative.
7. **Add floating labels** — For trade entry forms, settlement details.
8. **Side-by-side layout** — For settlement reconciliation views.

---

## Sources

### Institutional Fintech
- [Mercury — NicelyDone](https://nicelydone.club/apps/mercury)
- [Mercury — SaaSFrame](https://www.saasframe.io/saas/mercury)
- [Stripe Accessible Color Systems](https://stripe.com/blog/accessible-color-systems)
- [Column Bank](https://column.com/)
- [Modern Treasury — Designing Our New UI](https://www.moderntreasury.com/journal/behind-the-scenes-designing-our-new-ui)
- [Ramp — Bakken & Baeck Case](https://bakkenbaeck.com/case/ramp)
- [Brex — Founder Mode](https://www.brex.com/journal/brex-in-founder-mode)
- [Increase](https://increase.com/)

### Crypto/Trading Platforms
- [Coinbase Prime](https://www.coinbase.com/prime)
- [Fireblocks](https://www.fireblocks.com/)
- [Anchorage Digital](https://www.anchorage.com)
- [Circle Mint](https://www.circle.com/circle-mint)
- [Paxos](https://www.paxos.com/)
- [B2C2](https://www.b2c2.com/)
- [Cumberland DRW](https://www.cumberland.io/)
- [Nonco + Fireblocks Case Study](https://www.fireblocks.com/customers/nonco)

### Design Systems & Patterns
- [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design Trend — LogRocket](https://blog.logrocket.com/ux-design/linear-design/)
- [Linear Style Design — Medium](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646)
- [Vercel Geist Colors](https://vercel.com/geist/colors)
- [Vercel Geist Typography](https://vercel.com/geist/typography)
- [Vercel New Dashboard](https://vercel.com/try/new-dashboard)
- [Raycast API Colors](https://developers.raycast.com/api-reference/user-interface/colors)
- [Arc Browser — UX Analysis](https://medium.com/design-bootcamp/arc-browser-rethinking-the-web-through-a-designers-lens-f3922ef2133e)

### Dark Mode & Dashboard Patterns
- [Dark Mode in Fintech — JPN Fintech](https://www.jpnfintech.com/designing-for-dark-mode-in-fintech-dos-and-donts/)
- [Dark Dashboard UI — Wendy Zhou](https://www.wendyzhou.se/blog/dark-dashboard-ui-design-inspiration/)
- [Fintech UI Trust Patterns — Eleken](https://www.eleken.co/blog-posts/trusted-fintech-ui-examples)
- [Fintech Dashboard KPIs & Tables — UiSea](https://uisea.net/fintech-dashboard-ui-kpis-card-patterns-tables-figma-guide/)
- [Fintech Dashboard Design — Merge Rocks](https://merge.rocks/blog/fintech-dashboard-design-or-how-to-make-data-look-pretty)
- [Financial Dashboard Color Palettes](https://www.phoenixstrategy.group/blog/best-color-palettes-for-financial-dashboards)
- [Fintech Design Guide 2026 — Eleken](https://www.eleken.co/blog-posts/modern-fintech-design-guide)

### Figma Resources
- [Geist Design System — Figma Community](https://www.figma.com/community/file/1330020847221146106/geist-design-system-vercel)
- [Dark Mode Banking Dashboard — Figma](https://www.figma.com/community/file/1248239794652183029/dark-mode-dashboard-for-banking-sevices)
- [Fintech Dashboard UI Kit — Figma](https://www.figma.com/community/file/1370009967514055200/fintech-dashboard-ui-kit)
- [Arc Browser Interface — Figma](https://www.figma.com/community/file/1228728710215940920/arc-browser-interface)
- [Linear Design System — Figma](https://www.figma.com/community/file/1222872653732371433/linear-design-system)
