# Orbital Mark — Animated (Nonco Stables)

Looping vector animation of the orbital mark: tilted rings with beads travelling
the curve, a pulsing particle-globe core, and an ambient field of circles + squares.

## Deliverables
- `orbital-mark.json` — Lottie (drop into lottie-web / lottie-react). Primary asset.
- `orbital-mark.gif`  — 512px preview (191 KB).
- `orbital-mark.mp4`  — 512px H.264 preview (27 KB).

## Use in code
```tsx
import { Player } from '@lottiefiles/react-lottie-player';
import anim from './orbital-mark.json';
<Player autoplay loop src={anim} style={{ width: 168, height: 168 }} />
```

## In Figma
Import `orbital-mark.json` via the LottieFiles plugin to preview animated (vector, scalable).

## Rebuild
`node gen.mjs` regenerates the Lottie. `npm i lottie-web playwright && node capture.mjs` re-renders frames (uses system Chrome).
