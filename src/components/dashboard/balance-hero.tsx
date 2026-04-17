"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { balances, usdRates } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

// Three.js globe loads only on the client (WebGL)
const ParticleGlobe = dynamic(
  () => import("@/components/ui/particle-globe").then((m) => ({ default: m.ParticleGlobe })),
  { ssr: false },
);

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
  const finalFormatted = formatter ? formatter(value) : formatMoney(value);

  return (
    <span className={className} style={style}>
      {/* Visible animated value — hidden from screen readers to avoid noisy count-up announcements */}
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
      {/* Screen-reader only — announces the final value once, politely */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {typeof prefix === "string" ? prefix : ""}
        {finalFormatted}
        {suffix}
      </span>
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
// Component
// ---------------------------------------------------------------------------

export function BalanceHero() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="card-primary relative overflow-hidden bg-[var(--bg-card)] rounded-lg min-h-[360px]">
      {/* Cyan gradient overlay — brand accent */}
      <div className="absolute inset-0 pointer-events-none rounded-lg z-0" style={{ background: 'linear-gradient(135deg, rgba(5,224,248,0.06), transparent 60%)' }} />

      {/* ── ParticleGlobe — background layer, right-weighted ── */}
      {/* Canvas covers the full card + 160px right bleed so orbital rings (radius 200) */}
      {/* fit the camera frustum. The dark-to-transparent overlay below covers the text */}
      {/* area, so the globe only becomes visible on the right half of the card. */}
      <div className="hidden lg:block absolute inset-y-0 left-0 right-[-160px] z-0 pointer-events-none">
        <ParticleGlobe opacity={0.85} />
      </div>

      {/* Dark overlay over the data column — solid on the left, fades to transparent */}
      {/* over the globe so there's no hard boundary. */}
      <div
        className="hidden lg:block absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg-card) 0%, var(--bg-card) 42%, transparent 72%)' }}
      />

      {/* Single-column layout: data on the left, globe bleeds in from the right */}
      <div className="relative z-10 flex flex-col h-full min-h-[360px]">

        {/* ── Portfolio data — constrained to left ~55% on lg so globe has space ── */}
        <div className="flex flex-col justify-between h-full min-h-[360px] p-5 lg:max-w-[58%]">

          <div>
            {/* Header */}
            <div className="mb-3">
              <SectionLabel>Portfolio</SectionLabel>
            </div>

            {/* Balance row — number + change badge + expand toggle */}
            <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
              <div className="flex items-center gap-3">
                <p
                  className="font-mono font-bold tracking-tighter leading-none text-white"
                  style={{
                    fontSize: "clamp(1.875rem, 1.25rem + 1.25vw, 2.75rem)",
                    fontVariantNumeric: "tabular-nums slashed-zero",
                  }}
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
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  >
                    <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Change badge */}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-t border-[rgba(255,255,255,0.06)] mt-2">
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
          </div>

          {/* Stats row — available / pending / currencies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 sm:divide-x sm:divide-[var(--border)] border-t border-[var(--border)] mt-4 pt-4">
            <div className="flex items-center gap-3 px-4 py-2 sm:py-0">
              <div className="flex sm:block items-center justify-between w-full sm:w-auto">
                <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Available</div>
                <div className="font-mono text-sm font-bold text-[var(--text)] sm:mt-0.5 tabular-nums">
                  <AnimatedNumber value={totalAvailable} prefix="$" suffix="M" formatter={(n) => (n / 1_000_000).toFixed(2)} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 sm:py-0">
              <div className="flex sm:block items-center justify-between w-full sm:w-auto">
                <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Pending</div>
                <div className="font-mono text-sm font-bold text-[var(--status-pending)] sm:mt-0.5 tabular-nums">
                  <AnimatedNumber value={totalPending} prefix="$" suffix="M" formatter={(n) => (n / 1_000_000).toFixed(2)} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 sm:py-0">
              <div className="flex sm:block items-center justify-between w-full sm:w-auto">
                <div className="text-[11px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">Currencies</div>
                <div className="font-mono text-sm font-bold text-[var(--text)] sm:mt-0.5 tabular-nums">
                  <AnimatedNumber value={balances.length} formatter={(n) => Math.round(n).toString()} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
