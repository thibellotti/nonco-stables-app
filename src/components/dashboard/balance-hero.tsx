"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { SectionLabel } from "@/components/ui/section-label";
import { balances, usdRates } from "@/lib/mock-data";

const ParticleGlobe = dynamic(
  () => import("@/components/ui/particle-globe").then((m) => ({ default: m.ParticleGlobe })),
  { ssr: false }
);
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
  (sum, b) => sum + (b.available + b.pending) * (usdRates[b.currency] ?? 1),
  0,
);
const totalAvailable = balances.reduce((sum, b) => sum + b.available * (usdRates[b.currency] ?? 1), 0);
const totalPending = balances.reduce((sum, b) => sum + b.pending * (usdRates[b.currency] ?? 1), 0);

const change24h = 12_340;
const changePct = ((change24h / (totalBalance - change24h)) * 100).toFixed(2);

// ---------------------------------------------------------------------------
// Chart data + horizontal-diagonal path (Nonco geometric style)
// ---------------------------------------------------------------------------

const chartPoints = [
  38, 40, 39, 42, 44, 43, 46, 45, 48, 50, 49, 52, 54, 53, 56, 55, 58, 60,
  59, 63, 65, 64, 68, 70, 69, 73, 75, 74, 78, 82,
];

const maxY = Math.max(...chartPoints);
const minY = Math.min(...chartPoints);
const range = maxY - minY || 1;

const CHART_W = 800;
const CHART_H = 160;
const CHART_PAD = 8;

const chartCoords = chartPoints.map((y, i) => ({
  x: (i / (chartPoints.length - 1)) * CHART_W,
  y: CHART_H - ((y - minY) / range) * (CHART_H - CHART_PAD * 2) - CHART_PAD,
}));

// Horizontal-then-diagonal: flat 60%, then angle to next point
function hDiagPath(pts: typeof chartCoords): string {
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const midX = prev.x + (curr.x - prev.x) * 0.6;
    d += ` L${midX.toFixed(1)},${prev.y.toFixed(1)} L${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
  }
  return d;
}

const linePath = hDiagPath(chartCoords);
const lastPt = chartCoords[chartCoords.length - 1];
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
// Stagger animation variants for stat cards
// ---------------------------------------------------------------------------

const statsContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

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
    <section className="card-primary relative overflow-hidden bg-[var(--bg-card)] rounded-lg p-5">
      {/* Particle globe — large background, positioned right */}
      <div className="absolute top-0 bottom-0 pointer-events-none hidden lg:block" style={{ left: '55%', right: '-40%', zIndex: 0 }}>
        <ParticleGlobe opacity={0.4} />
      </div>

      {/* Content — constrained to left on lg so globe has space */}
      <div className="relative z-10 lg:max-w-[78%]">

      {/* Header */}
      <div className="mb-4">
        <SectionLabel>Portfolio</SectionLabel>
      </div>

      {/* Balance row — number + change badge */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <p
          className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-none text-white"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)]">
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
          <span className="text-[var(--text-4)] text-[11px] font-mono">24h</span>

          {/* Period selector — inline with change badge */}
          <div className="flex gap-1 ml-auto">
            {periodOptions.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={activePeriod === p}
                onClick={() => setActivePeriod(p)}
                className={
                  activePeriod === p
                    ? "font-sans text-[11px] uppercase tracking-[.08em] px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-white cursor-default"
                    : "font-sans text-[11px] uppercase tracking-[.08em] px-3 py-1 rounded-full text-[var(--text-4)] cursor-pointer hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full-width area chart — interactive */}
      <div
        className="relative h-[180px] lg:h-[220px] mt-4 cursor-crosshair pl-12"
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
        {/* Y-axis tick labels */}
        {(() => {
          const lastVal = chartPoints[chartPoints.length - 1];
          const midVal = (maxY + minY) / 2;
          const fmt = (v: number) => {
            const dollars = totalBalance * (v / lastVal);
            if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
            return `$${(dollars / 1_000).toFixed(0)}K`;
          };
          // Positions: top (max), middle, bottom (min) — evenly spaced
          return (
            <div className="absolute left-0 top-0 bottom-0 w-11 flex flex-col justify-between py-2 pointer-events-none" aria-hidden="true">
              <span className="text-[11px] font-mono text-[var(--text-3)] tabular-nums leading-none">{fmt(maxY)}</span>
              <span className="text-[11px] font-mono text-[var(--text-3)] tabular-nums leading-none">{fmt(midVal)}</span>
              <span className="text-[11px] font-mono text-[var(--text-3)] tabular-nums leading-none">{fmt(minY)}</span>
            </div>
          );
        })()}

        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          fill="none"
          className="absolute top-0 left-12"
          style={{ width: 'calc(100% - 48px)', height: '100%' }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hero-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(5,224,248,0.06)" />
              <stop offset="100%" stopColor="rgba(5,224,248,0)" />
            </linearGradient>
          </defs>

          {/* Subtle dashed grid */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line key={pct} x1="0" y1={CHART_H * pct} x2={CHART_W} y2={CHART_H * pct} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 6" />
          ))}

          {/* Area fill — subtle */}
          <path d={areaPath} fill="url(#hero-area-fill)" />

          {/* Main line — angular, thin */}
          <path d={linePath} stroke="rgba(5,224,248,0.85)" strokeWidth="1.2" fill="none" />
        </svg>

        {/* Endpoint — square marker */}
        <div className="absolute top-0 bottom-0 left-12 pointer-events-none" style={{ width: 'calc(100% - 48px)' }}>
          <div
            className="absolute"
            style={{
              left: `${(lastPt.x / CHART_W) * 100}%`,
              top: `${(lastPt.y / CHART_H) * 100}%`,
              width: 5,
              height: 5,
              transform: 'translate(-50%, -50%)',
              background: '#05E0F8',
              boxShadow: hoverIdx !== null
                ? 'none'
                : '0 0 6px rgba(5,224,248,0.6)',
              opacity: hoverIdx !== null ? 0.3 : 1,
              transition: 'opacity 0.2s',
            }}
          />
        </div>

        {/* Hover — vertical line + square marker + bracket tooltip */}
        {hoverIdx !== null && (
          <>
            {/* Vertical line — subtle */}
            <div
              className="absolute top-0 bottom-0 w-px pointer-events-none"
              style={{ left: hoverX, background: "rgba(5,224,248,0.1)" }}
            />

            {/* Hover point — square */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: hoverX - 2.5,
                top: `calc(${(chartY(hoverIdx) / CHART_H) * 100}% - 2.5px)`,
                width: 5,
                height: 5,
                background: "#05E0F8",
              }}
            />

            {/* Tooltip — bracket corners */}
            <div
              className="absolute pointer-events-none z-10"
              style={{
                left: hoverX > 160 ? hoverX - 110 : hoverX + 14,
                top: `${(chartY(hoverIdx) / CHART_H) * 100}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div className="relative px-2.5 py-1 bg-[#0a0a0a]">
                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[rgba(5,224,248,0.4)]" />
                <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-[rgba(5,224,248,0.4)]" />
                <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-[rgba(5,224,248,0.4)]" />
                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-[rgba(5,224,248,0.4)]" />
                <div className="text-[10px] font-sans text-[var(--text-4)]">
                  Mar {hoverIdx + 1}
                </div>
                <div className="text-xs font-mono font-semibold text-white tabular-nums">
                  ${formatMoney(totalBalance * (chartPoints[hoverIdx] / chartPoints[chartPoints.length - 1]))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats row — inline below chart, no separate cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 sm:divide-x sm:divide-[var(--border)] border-t border-[var(--border)] mt-6"
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Available */}
        <motion.div
          variants={statCardVariants}
          className="flex items-center gap-3 px-4 py-3 sm:py-4"
        >
          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.06)] items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 2v14M3 9h12" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex sm:block items-center justify-between w-full sm:w-auto">
            <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Available</div>
            <div className="font-mono text-base font-bold text-[var(--text)] sm:mt-0.5 tabular-nums">
              <AnimatedNumber value={totalAvailable} prefix="$" suffix="M" formatter={(n) => (n / 1_000_000).toFixed(2)} />
            </div>
          </div>
        </motion.div>

        {/* Pending */}
        <motion.div
          variants={statCardVariants}
          className="flex items-center gap-3 px-4 py-3 sm:py-4"
        >
          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[var(--status-pending-dim)] items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" stroke="var(--status-pending)" strokeWidth="1.5" />
              <path d="M9 6v3.5l2.5 1.5" stroke="var(--status-pending)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex sm:block items-center justify-between w-full sm:w-auto">
            <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Pending</div>
            <div className="font-mono text-base font-bold text-[var(--status-pending)] sm:mt-0.5 tabular-nums">
              <AnimatedNumber value={totalPending} prefix="$" suffix="M" formatter={(n) => (n / 1_000_000).toFixed(2)} />
            </div>
          </div>
        </motion.div>

        {/* Currencies */}
        <motion.div
          variants={statCardVariants}
          className="flex items-center gap-3 px-4 py-3 sm:py-4"
        >
          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[var(--status-positive-dim)] items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" stroke="var(--status-positive)" strokeWidth="1.5" />
              <circle cx="11" cy="11" r="4.5" stroke="var(--status-positive)" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex sm:block items-center justify-between w-full sm:w-auto">
            <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Currencies</div>
            <div className="font-mono text-base font-bold text-[var(--text)] sm:mt-0.5 tabular-nums">
              <AnimatedNumber value={balances.length} formatter={(n) => Math.round(n).toString()} />
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}
