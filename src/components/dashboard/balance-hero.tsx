"use client";

import { useState, useEffect, useRef } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { balances } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

// ---------------------------------------------------------------------------
// AnimatedNumber — count-up with easeOutExpo, animates only on first mount
// ---------------------------------------------------------------------------

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  formatter,
  className,
  style,
}: {
  value: number;
  prefix?: React.ReactNode;
  suffix?: string;
  formatter?: (n: number) => string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1000;
    const start = performance.now();
    const easeOutExpo = (t: number) =>
      t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(value * easeOutExpo(progress));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); };
  }, [value]);

  const formatted = formatter ? formatter(display) : formatMoney(display);

  return (
    <span className={className} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Derived data
// ---------------------------------------------------------------------------

const totalBalance = balances.reduce(
  (sum, b) => sum + b.available + b.pending,
  0,
);
const totalAvailable = balances.reduce((sum, b) => sum + b.available, 0);
const totalPending = balances.reduce((sum, b) => sum + b.pending, 0);

const change24h = 12_340;
const changePct = ((change24h / (totalBalance - change24h)) * 100).toFixed(2);

// ---------------------------------------------------------------------------
// Smooth chart — Catmull-Rom spline interpolation
// ---------------------------------------------------------------------------

const chartPoints = [
  38, 40, 39, 42, 44, 43, 46, 45, 48, 50, 49, 52, 54, 53, 56, 55, 58, 60,
  59, 63, 65, 64, 68, 70, 69, 73, 75, 74, 78, 82,
];

const maxY = Math.max(...chartPoints);
const minY = Math.min(...chartPoints);
const range = maxY - minY || 1;

function smoothPath(pts: number[], w: number, h: number, pad = 8): string {
  const coords = pts.map((y, i) => ({
    x: (i / (pts.length - 1)) * w,
    y: h - ((y - minY) / range) * (h - pad * 2) - pad,
  }));
  let d = `M${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

const CHART_W = 800;
const CHART_H = 160;

const linePath = smoothPath(chartPoints, CHART_W, CHART_H);
const lastPt = {
  x: CHART_W,
  y:
    CHART_H -
    ((chartPoints[chartPoints.length - 1] - minY) / range) *
      (CHART_H - 16) -
    8,
};
const areaPath = `${linePath} L${CHART_W},${CHART_H} L0,${CHART_H} Z`;

// ---------------------------------------------------------------------------
// Period pills data
// ---------------------------------------------------------------------------

type Period = "7D" | "30D" | "90D";
const periodOptions: Period[] = ["7D", "30D", "90D"];

// ---------------------------------------------------------------------------
// Chart coord helper — maps data index to SVG Y, matching smoothPath logic
// ---------------------------------------------------------------------------

function chartY(idx: number): number {
  const pad = 8;
  return (
    CHART_H -
    ((chartPoints[idx] - minY) / range) * (CHART_H - pad * 2) -
    pad
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BalanceHero() {
  const [activePeriod, setActivePeriod] = useState<Period>("30D");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const idx = Math.round(pct * (chartPoints.length - 1));
    const clamped = Math.max(0, Math.min(chartPoints.length - 1, idx));
    setHoverIdx(clamped);
    setHoverX(x);
  };

  const handleMouseLeave = () => {
    setHoverIdx(null);
  };

  return (
    <section className="relative">
      {/* Header row — label + period selector */}
      <div className="flex items-center justify-between mb-6">
        <SectionLabel>Portfolio</SectionLabel>

        {/* Period selector */}
        <div className="flex flex-wrap gap-1">
          {periodOptions.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={activePeriod === p}
              onClick={() => setActivePeriod(p)}
              className={
                activePeriod === p
                  ? "font-mono text-[10px] uppercase tracking-[.1em] px-3 py-1 rounded-full bg-[var(--cyan-dim)] text-[var(--cyan)] border border-[rgba(5,224,248,0.2)] cursor-default"
                  : "font-mono text-[10px] uppercase tracking-[.1em] px-3 py-1 rounded-full bg-[rgba(255,255,255,0.03)] text-[var(--text-4)] cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors"
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Balance row — number + change badge */}
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-2">
        <p
          className="font-mono text-[28px] sm:text-[46px] lg:text-[56px] font-bold tracking-tighter leading-none text-white"
          style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
        >
          <AnimatedNumber
            value={totalBalance}
            prefix={
              <span className="text-[0.65em] font-normal opacity-70">$</span>
            }
          />
        </p>

        {/* Change badge + period label */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(199,255,16,0.08)] border border-[rgba(199,255,16,0.15)]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9.5V2.5M6 2.5L3 5.5M6 2.5l3 3"
                stroke="var(--green)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-[var(--green)] text-sm font-medium font-mono"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              +{changePct}%
            </span>
          </div>
          <span className="text-[var(--text-4)] text-xs font-mono">24h</span>
        </div>
      </div>

      {/* Full-width area chart — interactive */}
      <div
        className="relative h-[180px] lg:h-[220px] mt-4 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const pct = x / rect.width;
            const idx = Math.round(pct * (chartPoints.length - 1));
            setHoverIdx(Math.max(0, Math.min(chartPoints.length - 1, idx)));
            setHoverX(x);
          }
        }}
        onTouchEnd={() => { setHoverIdx(null); }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          fill="none"
          className="absolute inset-0"
          aria-hidden="true"
        >
          <defs>
            {/* Vertical area gradient — multi-stop for depth */}
            <linearGradient id="hero-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(5,224,248,0.15)" />
              <stop offset="40%" stopColor="rgba(5,224,248,0.06)" />
              <stop offset="100%" stopColor="rgba(5,224,248,0)" />
            </linearGradient>

            {/* Horizontal line gradient — left: faded, right: full */}
            <linearGradient
              id="hero-line-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="var(--cyan)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="var(--cyan)"
                stopOpacity="1"
              />
            </linearGradient>

            {/* Glow filter for line bloom + endpoint */}
            <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
            </filter>
          </defs>

          {/* Subtle grid lines — dashed for texture */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={CHART_H * pct}
              x2={CHART_W}
              y2={CHART_H * pct}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#hero-area-fill)" />

          {/* Line glow — blurred wider stroke behind main line */}
          <path
            d={linePath}
            stroke="var(--cyan)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#line-glow)"
            opacity="0.15"
          />

          {/* Main line — slightly thicker */}
          <path
            d={linePath}
            stroke="url(#hero-line-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Baseline — grounds the chart */}
          <line
            x1="0"
            y1={CHART_H - 1}
            x2={CHART_W}
            y2={CHART_H - 1}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Endpoint — outermost glow (blurred) */}
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r="16"
            fill="var(--cyan)"
            opacity={hoverIdx !== null ? "0.02" : "0.06"}
            filter="url(#line-glow)"
          />
          {/* Endpoint — animated pulse ring */}
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r="8"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth="1"
            opacity={hoverIdx !== null ? "0.05" : "0.3"}
          >
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values={hoverIdx !== null ? "0.05;0.02;0.05" : "0.3;0.1;0.3"} dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Endpoint — solid center */}
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r="3.5"
            fill="var(--cyan)"
            opacity={hoverIdx !== null ? "0.2" : "1"}
          />
          {/* Endpoint — white highlight for "lit" feel */}
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r="1.5"
            fill="white"
            opacity={hoverIdx !== null ? "0.1" : "0.6"}
          />
        </svg>

        {/* Hover tooltip, vertical line + dot */}
        {hoverIdx !== null && (
          <>
            {/* Vertical line */}
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none"
              style={{
                left: hoverX,
                background:
                  "linear-gradient(to bottom, transparent, var(--cyan), transparent)",
                opacity: 0.25,
              }}
            />

            {/* Hover dot — positioned via percentage, with glow */}
            <div
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{
                left: hoverX - 4,
                top: `${(chartY(hoverIdx) / CHART_H) * 100}%`,
                background: "var(--cyan)",
                boxShadow: "0 0 12px rgba(5,224,248,0.6)",
              }}
            />

            {/* Tooltip card — polished with cyan accent border */}
            <div
              className="absolute pointer-events-none z-10 bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[rgba(5,224,248,0.5)] rounded px-2.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              style={{
                left:
                  hoverX > 160
                    ? hoverX - 120
                    : hoverX + 12,
                top: `${(chartY(hoverIdx) / CHART_H) * 100}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div className="text-[10px] font-mono text-[var(--text-4)] mb-0.5">
                Mar {hoverIdx + 1}
              </div>
              <div
                className="text-xs font-mono font-semibold text-white"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                $
                {formatMoney(
                  totalBalance *
                    (chartPoints[hoverIdx] / chartPoints[chartPoints.length - 1]),
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats row — below chart */}
      <div className="flex flex-wrap items-start gap-x-4 sm:gap-x-6 gap-y-4 mt-6">
        {/* Available */}
        <div>
          <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em]">
            Available
          </div>
          <div
            className="font-mono text-base sm:text-xl font-semibold text-white mt-1"
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            <AnimatedNumber
              value={totalAvailable}
              prefix="$"
              suffix="M"
              formatter={(n) => (n / 1_000_000).toFixed(2)}
            />
          </div>
        </div>

        <div className="w-px h-10 bg-[var(--border)]" />

        {/* Pending */}
        <div>
          <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em]">
            Pending
          </div>
          <div
            className="font-mono text-base sm:text-xl font-semibold text-[var(--amber)] mt-1"
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            <AnimatedNumber
              value={totalPending}
              prefix="$"
              suffix="M"
              formatter={(n) => (n / 1_000_000).toFixed(2)}
            />
          </div>
        </div>

        <div className="w-px h-10 bg-[var(--border)]" />

        {/* Currencies */}
        <div>
          <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em]">
            Currencies
          </div>
          <div
            className="font-mono text-base sm:text-xl font-semibold text-white mt-1"
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            <AnimatedNumber
              value={balances.length}
              formatter={(n) => Math.round(n).toString()}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
