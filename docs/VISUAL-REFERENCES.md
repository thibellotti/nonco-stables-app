# Nonco Stables — Visual References & Brand Alignment

## 1. Industry References (ranked by relevance)

### Tier 1 — Direct Competitors (Institutional Stablecoin/FX)
| Product | Why it matters | Key takeaway |
|---------|---------------|--------------|
| **Anchorage Digital** | First federally chartered crypto bank. Uses `#141415` bg — nearly identical to our `#141414` | Validates our dark palette as institutional-grade. Their accent `#5580F6` is generic — our cyan is more distinctive |
| **Circle (USDC)** | The USDC issuer. Clean institutional dashboard | Treasury-focused UI, settlement tracking patterns |
| **Fireblocks** | Institutional crypto infrastructure | Multi-wallet management patterns, approval workflows |
| **Modern Treasury** | Payment operations platform | "Never truncate financial data" principle. Cmd+K command palette. Reconciliation side-by-side layout |

### Tier 2 — Premium Fintech (Design excellence)
| Product | Why it matters | Key takeaway |
|---------|---------------|--------------|
| **Mercury** | Gold standard for fintech dashboard design | Giant balance numbers, thin allocation bars, monochrome with one accent color |
| **Column Bank** | Developer-focused bank, precision engineering aesthetic | SuisseIntl font, 144px section padding, surgical spacing |
| **Stripe Dashboard** | CIELAB-based accessible color system | 5-level gray scale guarantees contrast. Tabbed navigation pattern |
| **Ramp** | Corporate spend management | Card-based transactions, clean expense categorization |

### Tier 3 — Design Systems (Patterns to steal)
| Product | Why it matters | Key takeaway |
|---------|---------------|--------------|
| **Vercel/Geist** | Numbered 1-10 gray scale with explicit roles (1-3 bg, 4-6 borders, 7-8 contrast, 9-10 text) | Most structured color architecture found. Map our tokens to this system |
| **Linear** | Trend toward EVEN MORE restraint in 2025-26. Monochrome black/white | Fewer bold colors. Accent used surgically, not decoratively |
| **Raycast** | Dark mode command palette excellence | Dense but breathable, keyboard-first interaction |
| **Arc Browser** | Radical UI reduction | Proves minimal chrome can feel premium |

---

## 2. Nonco Brand Bible (from nonco.com source code)

### Background: Pure Black (NOT near-black)
```
nonco.com: #000000 (pure black)
Our app:   #131313 (near-black) ← GAP — should align to #000000
```

### Text: Pure White with Opacity (NOT warm-tinted hex)
```
nonco.com: rgba(255,255,255,0.8) for body, rgba(255,255,255,0.5) for labels
Our app:   #e5e2e1 (warm brown tint) ← GAP — should use white+opacity
```

### Product Colors (from nonco.com CSS tokens)
| Product | Color | HSL | Usage |
|---------|-------|-----|-------|
| **Stables** | `#05E0F8` | `186 97% 49%` | THE accent for our app |
| **Markets** | `#DFFF0F` | `68 100% 53%` | NOT for stables app |
| **Institutional** | `#BFBFBF` | `0 0% 75%` | Corporate gray |

### Product Gradients
```css
--gradient-stables: linear-gradient(135deg, hsl(186 97% 49% / 0.15), hsl(186 97% 39% / 0.05));
```

### Typography: Space Grotesk ONLY
- nonco.com uses Space Grotesk for ALL text (headings, body, nav, buttons)
- JetBrains Mono reserved for: prices, timestamps, code, legal footnotes

### Button Style: ALWAYS pill-shaped
```
border-radius: 100px+ (pill)
Primary: white bg / black text (corporate site)
Stables: cyan bg / black text (product differentiation)
Ghost: transparent + border-outline
```

### Official Brand Shapes
Nonco has a geometric illustration system (from `home-shapes/` SVGs):
- Circles (outline, filled, half-filled, accent-stroked)
- Squares and rectangles (outline, filled, dashed)
- Diamonds (outline and filled)
- Lines, arcs, quarter-circles
- Corner accents and bracket marks
- Node-and-spine compositions

These shapes should appear in: login page, empty states, onboarding.

---

## 3. Gaps: Current App vs Brand Standard

| Aspect | nonco.com (correct) | Our app (current) | Fix |
|--------|--------------------|--------------------|-----|
| Page bg | `#000000` pure black | `#131313` near-black | Change `--bg` to `#000000` |
| Text | `rgba(255,255,255,0.8)` | `#e5e2e1` warm tint | Change to `rgba(255,255,255,0.85)` |
| Text secondary | `rgba(255,255,255,0.5)` | `#9caaad` cool tint | Change to `rgba(255,255,255,0.5)` |
| Card bg | `#141414` | `#141414` | Matches |
| Cyan accent | `#05E0F8` | `#05E0F8` | Matches |
| Borders | `#333333` | `#18181b` | Our borders are darker/subtler — acceptable for dense app |
| Brand shapes | Used in hero illustrations | Not used | Add to login, empty states |
| Nav | Glass blur | Sidebar | Different paradigm — acceptable |

---

## 4. Priority Actions (to align with brand)

1. **Change `--bg` to `#000000`** — pure black like nonco.com
2. **Change text colors to white+opacity** — `--text: rgba(255,255,255,0.85)`, `--text-3: rgba(255,255,255,0.5)`
3. **Add stables gradient** — `linear-gradient(135deg, hsl(186 97% 49% / 0.15), hsl(186 97% 39% / 0.05))` on hero cards
4. **Use brand shapes** — add official geometric shapes to login page and empty states
5. **Add Cmd+K command palette** — like Modern Treasury (future)
6. **Formalize gray scale** — adopt Geist-style numbered 1-10 token system

---

## 5. Visual Reference Skill (future)

Create a `/visual-references` skill that:
- Maintains a living document of visual references per project
- Stores screenshots, URLs, color extractions, and pattern notes
- Auto-suggests references when building new UI components
- Tracks which references have been applied vs. are aspirational
- Supports comparison: "current state vs. reference" side-by-side

This would live at `~/.claude/skills/visual-references/SKILL.md` and be invocable as `/visual-references`.
