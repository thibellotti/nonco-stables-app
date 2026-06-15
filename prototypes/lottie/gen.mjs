// Orbital Mark → Particle Globe — Lottie generator (Nonco Stables).
// A rotating sphere of particles (fibonacci distribution) spinning on the Y axis,
// with depth cueing (front = larger/brighter, back = smaller/dimmer), a dense glowing
// core, and a mix of dots + squares. No orbit rings — reads as a data globe, not an atom.
import { writeFileSync } from 'node:fs';

const W = 256, H = 256, C = 128, FR = 60, OP = 540; // 9s loop @60fps — slow
const R = 98, N = 28, SAMP = 24, TILT = 16 * Math.PI / 180;
const CYAN = [0.0196, 0.878, 0.973];
const WHITE = [1, 1, 1];

function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(7);
const lin = { i: { x: [1], y: [1] }, o: { x: [0], y: [0] } };

// fibonacci sphere, X-tilted once so the globe sits slightly tilted
const GA = Math.PI * (3 - Math.sqrt(5));
const pts = [];
for (let i = 0; i < N; i++) {
  const yy = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - yy * yy), th = i * GA;
  let x = Math.cos(th) * rad * R, y = yy * R, z = Math.sin(th) * rad * R;
  const y2 = y * Math.cos(TILT) - z * Math.sin(TILT), z2 = y * Math.sin(TILT) + z * Math.cos(TILT);
  pts.push({ x, y: y2, z: z2 });
}

let ind = 0;
const layers = [];
const baseKs = (p) => ({ o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [...p, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } });

function particle({ shape = 'el', size, color, pos, posKeys, opacity = 100, opKeys, scaleKeys, glow }) {
  const ks = baseKs(pos || [C, C]);
  if (posKeys) ks.p = { a: 1, k: posKeys };
  if (opKeys) ks.o = { a: 1, k: opKeys }; else ks.o = { a: 0, k: opacity };
  if (scaleKeys) ks.s = { a: 1, k: scaleKeys };
  const geom = shape === 'rc'
    ? { ty: 'rc', d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0.4 } }
    : { ty: 'el', d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [0, 0] } };
  const grp = { ty: 'gr', it: [geom, { ty: 'fl', c: { a: 0, k: color }, o: { a: 0, k: 100 }, r: 1 },
    { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] };
  const L = { ddd: 0, ind: ++ind, ty: 4, nm: shape === 'rc' ? 'sq' : 'dot', sr: 1, ao: 0, ks, shapes: [grp], ip: 0, op: OP, st: 0, bm: 0 };
  if (glow) L.shapes.unshift({ ty: 'gr', it: [{ ty: 'el', d: 1, s: { a: 0, k: [size * 3.2, size * 3.2] }, p: { a: 0, k: [0, 0] } }, { ty: 'fl', c: { a: 0, k: color }, o: { a: 0, k: 22 }, r: 1 }, { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] });
  layers.push(L);
}

// ── core glow (dense centre of the globe) ──
particle({ size: 12, color: CYAN, pos: [C, C], glow: true, scaleKeys: [
  { ...lin, t: 0, s: [100, 100, 100] }, { ...lin, t: 270, s: [116, 116, 100] }, { t: OP, s: [100, 100, 100] }] });

// ── rotating particle sphere ──
for (let i = 0; i < N; i++) {
  const P = pts[i];
  const big = rnd() < 0.4;
  const isSq = rnd() < 0.34, isAcc = rnd() < 0.42;
  const sz = big ? (4.5 + rnd() * 3.5) : (2.2 + rnd() * 2);
  const baseOp = isAcc ? 92 : 58;
  const pos = [], sca = [], opa = [];
  for (let s = 0; s <= SAMP; s++) {
    const phi = (s / SAMP) * Math.PI * 2;
    const xr = P.x * Math.cos(phi) + P.z * Math.sin(phi);
    const zr = -P.x * Math.sin(phi) + P.z * Math.cos(phi);
    const t = Math.round((s / SAMP) * OP);
    const d = (zr + R) / (2 * R);                 // 0 back … 1 front
    const sc = 100 * (0.5 + 0.7 * d);
    const op = baseOp * (0.3 + 0.7 * d);
    const last = s === SAMP;
    pos.push(last ? { t, s: [C + xr, C - P.y, 0] } : { ...lin, t, s: [C + xr, C - P.y, 0] });
    sca.push(last ? { t, s: [sc, sc, 100] } : { ...lin, t, s: [sc, sc, 100] });
    opa.push(last ? { t, s: [op] } : { ...lin, t, s: [op] });
  }
  particle({ shape: isSq ? 'rc' : 'el', size: sz, color: isAcc ? CYAN : WHITE, posKeys: pos, scaleKeys: sca, opKeys: opa, glow: isAcc && big });
}

const anim = { v: '5.9.0', fr: FR, ip: 0, op: OP, w: W, h: H, nm: 'Particle Globe', ddd: 0, assets: [], layers };
writeFileSync(new URL('./orbital-mark.json', import.meta.url), JSON.stringify(anim));
console.log('wrote orbital-mark.json · layers:', layers.length, '· loop', (OP / FR) + 's');
