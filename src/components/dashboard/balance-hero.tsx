"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { balances } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

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
// Component
// ---------------------------------------------------------------------------

export function BalanceHero() {
  const [activePeriod, setActivePeriod] = useState<Period>("30D");

  return (
    <section
      className="relative"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(5,224,248,0.03) 0%, transparent 60%)",
      }}
    >
      {/* Header row — label + period selector */}
      <div className="flex items-center justify-between mb-6">
        <SectionLabel>Portfolio</SectionLabel>

        {/* Period selector */}
        <div className="flex gap-1.5">
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
          className="font-mono text-[56px] lg:text-[72px] font-bold tracking-tighter leading-none text-white"
          style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
        >
          <span className="text-[0.65em] font-normal opacity-70">$</span>{formatMoney(totalBalance)}
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

      {/* Full-width area chart */}
      <div className="relative h-[180px] lg:h-[220px] mt-4">
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
            {/* Vertical area gradient — top: visible, bottom: transparent */}
            <linearGradient id="hero-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="rgba(5,224,248,0.12)"
              />
              <stop
                offset="100%"
                stopColor="rgba(5,224,248,0)"
              />
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
          </defs>

          {/* Subtle grid lines — barely visible */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={CHART_H * pct}
              x2={CHART_W}
              y2={CHART_H * pct}
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#hero-area-fill)" />

          {/* Smooth line */}
          <path
            d={linePath}
            stroke="url(#hero-line-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current dot — outer glow ring */}
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r="12"
            fill="var(--cyan)"
            opacity="0.15"
          />
          {/* Current dot — solid center */}
          <circle cx={lastPt.x} cy={lastPt.y} r="4" fill="var(--cyan)" />
        </svg>
      </div>

      {/* Stats row — below chart */}
      <div className="flex items-start gap-8 mt-6">
        {/* Available */}
        <div>
          <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em]">
            Available
          </div>
          <div
            className="font-mono text-xl font-semibold text-white mt-1"
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            ${(totalAvailable / 1_000_000).toFixed(2)}M
          </div>
        </div>

        <div className="w-px h-10 bg-[var(--border)]" />

        {/* Pending */}
        <div>
          <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em]">
            Pending
          </div>
          <div
            className="font-mono text-xl font-semibold text-[var(--amber)] mt-1"
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            ${(totalPending / 1_000_000).toFixed(2)}M
          </div>
        </div>

        <div className="w-px h-10 bg-[var(--border)]" />

        {/* Currencies */}
        <div>
          <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em]">
            Currencies
          </div>
          <div
            className="font-mono text-xl font-semibold text-white mt-1"
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            {balances.length}
          </div>
        </div>
      </div>
    </section>
  );
}
