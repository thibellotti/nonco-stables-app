# HANDOFF — Nonco Stables App

## Status: Globe positioning BROKEN — needs fix

### The Problem
The Three.js particle globe (Nonco Stables signature from nonco.com/stables) needs to be:
1. **Positioned to the RIGHT side** of the dashboard hero card
2. **Large** — filling most of the hero height
3. **No clipping** — orbital rings should NOT be cut off at any edge
4. **Concentric** — globe and orbital rings must orbit around the same center
5. **No distortion** — perspective must look correct, like nonco.com/stables

### What's been tried (ALL FAILED):
1. CSS `right: -Xpx` with overflow-hidden → clips the left side of orbital rings
2. 3D camera offset → distorts perspective, rings look non-concentric
3. CSS `translateX()` → shifts everything but overflow-hidden clips what extends beyond card
4. CSS `width: 130%, right: 0` → center falls in wrong place
5. `left: 50%, right: -80%` → canvas ends up outside card entirely
6. 3D group position offset → camera follows, globe stays centered in frame
7. Camera orbits LEFT of globe → rings look non-concentric due to perspective

### The CORRECT approach (not yet tried):
The nonco.com/stables site uses `position: fixed; left: 50%; top: 50%; width: 120vw; height: 120vh; transform: translate(-50%, -50%)` — the globe is the ENTIRE VIEWPORT background with content floating over it.

For the dashboard hero card, the approach should be:
- **Remove overflow-hidden** from the hero section
- Use `clip-path: inset(0 0 0 0 round 8px)` to clip at card edges (allows no bleed to other sections)
- Position the canvas at `right: -100px; top: 50%; transform: translateY(-50%); width: 800px; height: 800px`
- Camera stays centered (0,0,dist), looking at (0,0,0) — no 3D offset
- Globe centered in canvas — appears on the right because canvas is right-aligned
- The clip-path clips the right overflow, but the LEFT side of orbital rings stays visible within the card

OR: use `overflow: clip` (modern CSS) instead of `overflow: hidden` — it clips without creating a new stacking context, which might help with the Three.js rendering.

OR: the simplest correct approach — make the hero card TWO COLUMNS:
- Left column (60%): text content (portfolio, balance, chart)
- Right column (40%): the globe canvas (fills this column entirely)
This avoids ALL positioning hacks. The globe fills its column naturally.

### Current file state:
- `src/components/dashboard/balance-hero.tsx` — hero component, globe container is currently `right: 0, width: 700px, height: 700px`
- `src/components/ui/particle-globe.tsx` — Three.js component with Globe, OrbitalRing, AmbientParticles, CameraRig
- Camera: dist 160, FOV 50, fixed position (no orbit)
- Globe: 2000 particles, radius 90, auto-rotate 0.08
- Rings: inner (8 stablecoins, r150, tilt 65/25), outer (16 fiat, r200, tilt 65/-25)

### Other items completed this session:
- Full platform: 14 pages from client HTML MVP
- Design system: monochrome with strategic cyan
- Data-viz: DonutChart, MiniAreaChart, BarChart, ProgressRing, FlowDiagram
- Brand elements: geometric dividers, page marks, corner brackets
- 3 rounds of audit + polish (spacing, typography, colors, hover states)
- Pure black background (#000), white+opacity text (matching nonco.com)
- Globe component with Three.js (matching nonco.com/stables scene)
