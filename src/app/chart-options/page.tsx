"use client";

import { useState } from "react";
import { notFound } from "next/navigation";

// ─── Shared data ───
const points = [
  38, 40, 39, 42, 44, 43, 46, 45, 48, 50, 49, 52, 54, 53, 56, 55, 58, 60,
  59, 63, 65, 64, 68, 70, 69, 73, 75, 74, 78, 82,
];
const W = 800;
const H = 200;
const pad = 16;
const maxY = Math.max(...points);
const minY = Math.min(...points);
const range = maxY - minY || 1;

function toCoord(i: number, v: number) {
  return {
    x: (i / (points.length - 1)) * W,
    y: H - ((v - minY) / range) * (H - pad * 2) - pad,
  };
}

const coords = points.map((v, i) => toCoord(i, v));

// Horizontal-then-diagonal path: flat segment then angle to next point
function hDiagPath(pts: typeof coords): string {
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const midX = prev.x + (curr.x - prev.x) * 0.6;
    // Horizontal from prev to midX, then diagonal to curr
    d += ` L${midX.toFixed(1)},${prev.y.toFixed(1)} L${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
  }
  return d;
}

const diagPath = hDiagPath(coords);
const diagArea = `${diagPath} L${W},${H} L0,${H} Z`;

const CYAN = "#05E0F8";

// Shared hover handler
function useChartHover() {
  const [hover, setHover] = useState<number | null>(null);
  const handlers = {
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      setHover(Math.max(0, Math.min(points.length - 1, Math.round(pct * (points.length - 1)))));
    },
    onMouseLeave: () => setHover(null),
  };
  return { hover, handlers };
}

// ─── C1: Precision Grid — base (current favorite) ───
function ChartC1() {
  const { hover, handlers } = useChartHover();

  return (
    <div className="relative">
      <h3 className="font-sans text-sm text-white/70 mb-3 uppercase tracking-[.15em]">
        C1 — Precision
      </h3>
      <p className="text-[11px] text-white/40 mb-4 font-sans max-w-[500px]">
        Linha angular pura, sem fill, sem grid. Quadradinho no hover + tooltip com brackets. O mais limpo possivel.
      </p>
      <div className="relative h-[240px] bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden cursor-crosshair" {...handlers}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0">
          <path d={diagPath} stroke={CYAN} strokeWidth="1.2" fill="none" strokeOpacity="0.85" />
        </svg>

        {hover !== null && (
          <>
            <div className="absolute top-0 bottom-0 w-px pointer-events-none" style={{ left: `${(coords[hover].x / W) * 100}%`, background: `${CYAN}18` }} />
            <div className="absolute pointer-events-none" style={{ left: `${(coords[hover].x / W) * 100}%`, top: `${(coords[hover].y / H) * 100}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="w-[5px] h-[5px]" style={{ background: CYAN }} />
            </div>
            <div
              className="absolute pointer-events-none"
              style={{
                left: hover > points.length * 0.7 ? `calc(${(coords[hover].x / W) * 100}% - 110px)` : `calc(${(coords[hover].x / W) * 100}% + 14px)`,
                top: `${(coords[hover].y / H) * 100}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <div className="relative px-2.5 py-1 bg-[var(--bg)]">
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute top-0 right-0 w-1 h-1 border-t border-r" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r" style={{ borderColor: `${CYAN}50` }} />
                <div className="text-[10px] font-sans text-white/40">Mar {hover + 1}</div>
                <div className="text-xs font-mono font-semibold text-white tabular-nums">${((points[hover] / points[points.length - 1]) * 1.61).toFixed(2)}M</div>
              </div>
            </div>
          </>
        )}

        <div className="absolute pointer-events-none" style={{ left: `${(coords[coords.length - 1].x / W) * 100}%`, top: `${(coords[coords.length - 1].y / H) * 100}%`, transform: 'translate(-50%, -50%)' }}>
          <div className="w-[5px] h-[5px]" style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}60` }} />
        </div>
      </div>
    </div>
  );
}

// ─── C2: Precision + subtle area fill ───
function ChartC2() {
  const { hover, handlers } = useChartHover();

  return (
    <div className="relative">
      <h3 className="font-sans text-sm text-white/70 mb-3 uppercase tracking-[.15em]">
        C2 — Precision + Fill
      </h3>
      <p className="text-[11px] text-white/40 mb-4 font-sans max-w-[500px]">
        Igual ao C1 mas com area fill muito sutil. Da mais peso visual ao grafico sem adicionar ruido.
      </p>
      <div className="relative h-[240px] bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden cursor-crosshair" {...handlers}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0">
          <defs>
            <linearGradient id="c2-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.06" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={diagArea} fill="url(#c2-fill)" />
          <path d={diagPath} stroke={CYAN} strokeWidth="1.2" fill="none" strokeOpacity="0.85" />
        </svg>

        {hover !== null && (
          <>
            <div className="absolute top-0 bottom-0 w-px pointer-events-none" style={{ left: `${(coords[hover].x / W) * 100}%`, background: `${CYAN}18` }} />
            <div className="absolute pointer-events-none" style={{ left: `${(coords[hover].x / W) * 100}%`, top: `${(coords[hover].y / H) * 100}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="w-[5px] h-[5px]" style={{ background: CYAN }} />
            </div>
            <div
              className="absolute pointer-events-none"
              style={{
                left: hover > points.length * 0.7 ? `calc(${(coords[hover].x / W) * 100}% - 110px)` : `calc(${(coords[hover].x / W) * 100}% + 14px)`,
                top: `${(coords[hover].y / H) * 100}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <div className="relative px-2.5 py-1 bg-[var(--bg)]">
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute top-0 right-0 w-1 h-1 border-t border-r" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r" style={{ borderColor: `${CYAN}50` }} />
                <div className="text-[10px] font-sans text-white/40">Mar {hover + 1}</div>
                <div className="text-xs font-mono font-semibold text-white tabular-nums">${((points[hover] / points[points.length - 1]) * 1.61).toFixed(2)}M</div>
              </div>
            </div>
          </>
        )}

        <div className="absolute pointer-events-none" style={{ left: `${(coords[coords.length - 1].x / W) * 100}%`, top: `${(coords[coords.length - 1].y / H) * 100}%`, transform: 'translate(-50%, -50%)' }}>
          <div className="w-[5px] h-[5px]" style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}60` }} />
        </div>
      </div>
    </div>
  );
}

// ─── C3: Precision + glow line ───
function ChartC3() {
  const { hover, handlers } = useChartHover();

  return (
    <div className="relative">
      <h3 className="font-sans text-sm text-white/70 mb-3 uppercase tracking-[.15em]">
        C3 — Precision + Glow
      </h3>
      <p className="text-[11px] text-white/40 mb-4 font-sans max-w-[500px]">
        Linha angular com glow sutil e fill. Mais atmosferico, combina bem com o globe de fundo. Endpoint com glow.
      </p>
      <div className="relative h-[240px] bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden cursor-crosshair" {...handlers}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0">
          <defs>
            <linearGradient id="c3-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.08" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="c3-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.35" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d={diagArea} fill="url(#c3-fill)" />
          <path d={diagPath} stroke={`${CYAN}15`} strokeWidth="5" fill="none" />
          <path d={diagPath} stroke="url(#c3-line)" strokeWidth="1.2" fill="none" />
        </svg>

        {hover !== null && (
          <>
            <div className="absolute top-0 bottom-0 w-px pointer-events-none" style={{ left: `${(coords[hover].x / W) * 100}%`, background: `${CYAN}18` }} />
            <div className="absolute pointer-events-none" style={{ left: `${(coords[hover].x / W) * 100}%`, top: `${(coords[hover].y / H) * 100}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="w-[5px] h-[5px]" style={{ background: CYAN, boxShadow: `0 0 4px ${CYAN}50` }} />
            </div>
            <div
              className="absolute pointer-events-none"
              style={{
                left: hover > points.length * 0.7 ? `calc(${(coords[hover].x / W) * 100}% - 110px)` : `calc(${(coords[hover].x / W) * 100}% + 14px)`,
                top: `${(coords[hover].y / H) * 100}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <div className="relative px-2.5 py-1 bg-[var(--bg)]">
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute top-0 right-0 w-1 h-1 border-t border-r" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l" style={{ borderColor: `${CYAN}50` }} />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r" style={{ borderColor: `${CYAN}50` }} />
                <div className="text-[10px] font-sans text-white/40">Mar {hover + 1}</div>
                <div className="text-xs font-mono font-semibold text-white tabular-nums">${((points[hover] / points[points.length - 1]) * 1.61).toFixed(2)}M</div>
              </div>
            </div>
          </>
        )}

        <div className="absolute pointer-events-none" style={{ left: `${(coords[coords.length - 1].x / W) * 100}%`, top: `${(coords[coords.length - 1].y / H) * 100}%`, transform: 'translate(-50%, -50%)' }}>
          <div className="w-[5px] h-[5px]" style={{ background: CYAN, boxShadow: `0 0 8px ${CYAN}80, 0 0 16px ${CYAN}30` }} />
        </div>
      </div>
    </div>
  );
}

// ─── Page ───
export default function ChartOptionsPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black p-8 lg:p-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-sans text-2xl font-bold text-white mb-2">Chart Style — Refinando C</h1>
        <p className="text-sm text-white/50 font-sans mb-12 max-w-2xl">
          3 variacoes do estilo C (favorito). Horizontal + diagonal, quadradinhos, tooltip com brackets. Diferenca: nivel de ornamento visual.
        </p>

        <div className="space-y-16">
          <ChartC1 />
          <ChartC2 />
          <ChartC3 />
        </div>
      </div>
    </div>
  );
}
