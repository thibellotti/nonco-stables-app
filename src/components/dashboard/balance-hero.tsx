"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { balances, usdRates } from "@/lib/mock-data";
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

// Per-currency breakdown for expandable detail
const currencyBreakdown = balances.map((b) => {
  const value = (b.available + b.pending) * (usdRates[b.currency] ?? 1);
  return {
    currency: b.currency,
    symbol: b.symbol,
    available: b.available,
    usdValue: value,
    pct: totalBalance > 0 ? (value / totalBalance) * 100 : 0,
  };
});

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
const CHART_H = 100;
const CHART_PAD = 6;

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
// Component
// ---------------------------------------------------------------------------

export function BalanceHero() {
  const [activePeriod, setActivePeriod] = useState<Period>("30D");
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="card-primary relative overflow-hidden bg-[var(--bg-card)] rounded-lg p-5">
      {/* Cyan gradient overlay — brand accent */}
      <div className="absolute inset-0 pointer-events-none rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(5,224,248,0.06), transparent 60%)' }} />

      {/* Content */}
      <div className="relative z-10">

      {/* Header */}
      <div className="mb-3">
        <SectionLabel>Portfolio</SectionLabel>
      </div>

      {/* Balance row — number + change badge + expand toggle */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <div className="flex items-center gap-3">
          <p
            className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter leading-none text-white"
            style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
          >
            <AnimatedNumber
              value={totalBalance}
              prefix={
                <span className="text-[0.65em] font-normal opacity-70">$</span>
              }
            />
          </p>

          {/* Expand/collapse arrow */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] transition-colors cursor-pointer"
            aria-label={expanded ? "Collapse balances" : "Expand balances"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Change badge + period label */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 9.5V2.5M6 2.5L3 5.5M6 2.5l3 3" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[var(--green)] text-sm font-medium font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>
              +{changePct}%
            </span>
          </div>
          <span className="text-[var(--text-4)] text-[11px] font-mono">24h</span>

          {/* Period selector */}
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

      {/* Expandable currency breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-3 border-t border-[rgba(255,255,255,0.06)] mt-2">
              {currencyBreakdown.map((c) => (
                <div
                  key={c.currency}
                  className="bg-[rgba(255,255,255,0.03)] rounded-lg px-3 py-2.5"
                >
                  <div className="text-[10px] uppercase tracking-[.1em] text-[var(--text-4)] font-sans">
                    {c.currency}
                  </div>
                  <div className="font-mono text-sm font-bold text-white tabular-nums mt-0.5">
                    {c.symbol}{formatMoney(c.available)}
                  </div>
                  <div className="font-mono text-[11px] text-[var(--text-4)] tabular-nums">
                    ≈ ${formatMoney(c.usdValue)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact area chart */}
      <div className="relative h-[100px] lg:h-[120px] mt-3">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          fill="none"
          className="absolute inset-0 w-full h-full"
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

          {/* Area fill */}
          <path d={areaPath} fill="url(#hero-area-fill)" />

          {/* Main line */}
          <path d={linePath} stroke="rgba(5,224,248,0.85)" strokeWidth="1.2" fill="none" />
        </svg>

        {/* Endpoint marker */}
        <div
          className="absolute"
          style={{
            left: `${(lastPt.x / CHART_W) * 100}%`,
            top: `${(lastPt.y / CHART_H) * 100}%`,
            width: 5,
            height: 5,
            transform: 'translate(-50%, -50%)',
            background: 'var(--cyan)',
            boxShadow: '0 0 6px rgba(5,224,248,0.6)',
          }}
        />
      </div>

      {/* Stats row — inline below chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 sm:divide-x sm:divide-[var(--border)] border-t border-[var(--border)] mt-4">
        <div className="flex items-center gap-3 px-4 py-3 sm:py-3">
          <div className="flex sm:block items-center justify-between w-full sm:w-auto">
            <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Available</div>
            <div className="font-mono text-sm font-bold text-[var(--text)] sm:mt-0.5 tabular-nums">
              <AnimatedNumber value={totalAvailable} prefix="$" suffix="M" formatter={(n) => (n / 1_000_000).toFixed(2)} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 sm:py-3">
          <div className="flex sm:block items-center justify-between w-full sm:w-auto">
            <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Pending</div>
            <div className="font-mono text-sm font-bold text-[var(--status-pending)] sm:mt-0.5 tabular-nums">
              <AnimatedNumber value={totalPending} prefix="$" suffix="M" formatter={(n) => (n / 1_000_000).toFixed(2)} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 sm:py-3">
          <div className="flex sm:block items-center justify-between w-full sm:w-auto">
            <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Currencies</div>
            <div className="font-mono text-sm font-bold text-[var(--text)] sm:mt-0.5 tabular-nums">
              <AnimatedNumber value={balances.length} formatter={(n) => Math.round(n).toString()} />
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
