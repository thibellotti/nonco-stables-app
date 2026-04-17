"use client";

import { motion } from "framer-motion";
import { formatMoney, formatCompact, cn } from "@/lib/utils";
import {
  totalPendingAmount,
  processingCount,
  awaitingCount,
  processingAmount,
  awaitingAmount,
  avgProgress,
  sortedTerms,
  maxTermVolume,
} from "./settlements-data";

// ---------------------------------------------------------------------------
// Settlements Stats — hero Total Exposure + 3 supporting KPIs + By Terms
// ---------------------------------------------------------------------------

export function SettlementsStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--bg-elevated)] rounded-lg overflow-hidden"
    >
      {/* ── Top row: hero Total Exposure (left) + 3 supporting KPIs (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">

        {/* Hero: Total Exposure */}
        <div className="px-6 py-5 flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-2">
            Total Exposure
          </div>
          <div
            className="font-mono font-bold text-white tabular-nums leading-none"
            style={{ fontSize: "clamp(1.875rem, 1.25rem + 1.25vw, 2.75rem)" }}
          >
            ${formatMoney(totalPendingAmount)}
          </div>
          <div className="mt-2 text-[11px] text-[var(--text-4)] font-mono tabular-nums">
            {processingCount + awaitingCount} pending settlements
          </div>
        </div>

        {/* Supporting KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
          <Kpi
            label="Processing"
            value={String(processingCount)}
            caption={formatCompact(processingAmount)}
            accent="text-white"
            dot="bg-white"
          />
          <Kpi
            label="Awaiting"
            value={String(awaitingCount)}
            caption={formatCompact(awaitingAmount)}
            accent="text-[var(--cyan)]"
            dot="bg-[var(--cyan)]"
          />
          <Kpi
            label="Avg Completion"
            value={`${avgProgress}%`}
            caption={
              <div
                role="progressbar"
                aria-valuenow={avgProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Average settlement completion"
                className="h-1.5 w-full max-w-[140px] rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden mt-1"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avgProgress}%` }}
                  transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(5,224,248,0.3), rgba(5,224,248,0.75))",
                  }}
                />
              </div>
            }
          />
        </div>
      </div>

      {/* ── By Terms breakdown ── */}
      <div className="border-t border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
            By Terms
          </span>
          <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums">
            {sortedTerms.length} settlement terms
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2.5">
          {sortedTerms.map(([term, volume], index) => {
            const pct = (volume / totalPendingAmount) * 100;
            const barPct = (volume / maxTermVolume) * 100;
            const opacity = [1, 0.75, 0.45][index] ?? 0.2;
            return (
              <div key={term} className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-white w-10 shrink-0">
                  {term}
                </span>
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(barPct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${term} volume share`}
                  className="flex-1 h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{
                      delay: 0.3 + index * 0.08,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, rgba(5,224,248,0.15), rgba(5,224,248,${opacity}))`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono text-[var(--text-3)] w-9 text-right tabular-nums">
                  {pct.toFixed(0)}%
                </span>
                <span className="text-[11px] font-mono text-[var(--text-4)] w-14 text-right tabular-nums">
                  {formatCompact(volume)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// KPI cell
// ---------------------------------------------------------------------------

function Kpi({
  label,
  value,
  caption,
  accent = "text-white",
  dot,
}: {
  label: string;
  value: string;
  caption: React.ReactNode;
  accent?: string;
  dot?: string;
}) {
  return (
    <div className="px-5 py-5 flex flex-col justify-center">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-2">
        {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />}
        {label}
      </div>
      <div className={cn("font-mono font-bold text-2xl lg:text-[2rem] tabular-nums leading-none", accent)}>
        {value}
      </div>
      <div className="mt-2 text-[11px] text-[var(--text-4)] font-mono tabular-nums">
        {caption}
      </div>
    </div>
  );
}
