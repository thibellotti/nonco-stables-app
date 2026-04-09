"use client";

import { motion } from "framer-motion";
import { formatMoney, formatCompact } from "@/lib/utils";
import { ProgressRing } from "@/components/viz/progress-ring";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import {
  totalPendingAmount,
  processingCount,
  awaitingCount,
  processingAmount,
  awaitingAmount,
  avgProgress,
  sortedTerms,
  maxTermVolume,
  nextDue,
} from "./settlements-data";

// ---------------------------------------------------------------------------
// Settlement Stats — analytics row (Pipeline + Overview)
// ---------------------------------------------------------------------------

export function SettlementsStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Settlement Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[var(--bg-elevated)] rounded-lg p-5"
      >
        <CornerBrackets size={14} color="rgba(255,255,255,0.06)" corners={["tl","tr"]} />
        <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] mb-4">
          Settlement Pipeline
        </div>

        {/* Stacked pipeline bar */}
        <div className="mb-4">
          <div className="h-3 rounded-full bg-[rgba(255,255,255,0.03)] overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(processingAmount / totalPendingAmount) * 100}%`,
              }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full bg-[var(--cyan)]"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(awaitingAmount / totalPendingAmount) * 100}%`,
              }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full"
              style={{ backgroundColor: "rgba(249, 226, 32, 0.7)" }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--cyan)]" />
            <span className="text-[11px] font-sans text-[var(--text-3)]">
              Processing
            </span>
            <span className="text-[11px] font-mono font-bold text-white tabular-nums">
              {formatCompact(processingAmount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: "rgba(249, 226, 32, 0.7)" }}
            />
            <span className="text-[11px] font-sans text-[var(--text-3)]">
              Awaiting
            </span>
            <span className="text-[11px] font-mono font-bold text-white tabular-nums">
              {formatCompact(awaitingAmount)}
            </span>
          </div>
        </div>

        {/* Volume by terms */}
        <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-3">
          By Terms
        </div>
        <div className="space-y-3">
          {sortedTerms.map(([term, volume], index) => {
            const pct = (volume / totalPendingAmount) * 100;
            const barPct = (volume / maxTermVolume) * 100;
            const opacity = [1, 0.8, 0.4][index] ?? 0.2;
            return (
              <div key={term} className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-white w-12 shrink-0">
                  {term}
                </span>
                <div className="flex-1 h-2.5 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, rgba(5,224,248,0.15), rgba(5,224,248,${opacity}))`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-mono text-[var(--text-4)] w-10 text-right tabular-nums">
                  {pct.toFixed(0)}%
                </span>
                <span className="text-[11px] font-mono text-[var(--text-4)] w-14 text-right tabular-nums">
                  {formatCompact(volume)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Right: Overview */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="bg-[var(--bg-elevated)] rounded-lg p-5 space-y-4"
      >
        <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
          Overview
        </div>

        {/* Total exposure — hero number */}
        <div className="pb-4 border-b border-[var(--border)]">
          <p className="text-3xl font-mono font-bold text-white tabular-nums">
            ${formatMoney(totalPendingAmount)}
          </p>
          <p className="text-[11px] text-[var(--text-4)] font-sans mt-0.5">
            total exposure
          </p>
        </div>

        {/* Settlement terms — horizontal strip */}
        <div className="grid grid-cols-3 gap-4 py-3">
          <div className="text-center space-y-2">
            <ProgressRing value={58} color="var(--cyan)" size={72} strokeWidth={5} />
            <div>
              <div className="text-xs font-mono font-bold text-white">T+1</div>
              <div className="text-[10px] font-mono text-[var(--cyan)] tabular-nums">$108K</div>
              <div className="text-[9px] text-[var(--text-4)] mt-0.5">0h left</div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <ProgressRing value={18} color="var(--cyan)" size={72} strokeWidth={5} />
            <div>
              <div className="text-xs font-mono font-bold text-white">T+2</div>
              <div className="text-[10px] font-mono text-[var(--cyan)] tabular-nums">$172K</div>
              <div className="text-[9px] text-[var(--text-4)] mt-0.5">48h left</div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <ProgressRing value={0} color="var(--text-3)" size={72} strokeWidth={5} />
            <div>
              <div className="text-xs font-mono font-bold text-white">T+10</div>
              <div className="text-[10px] font-mono text-[var(--text-4)] tabular-nums">—</div>
              <div className="text-[9px] text-[var(--text-4)] mt-0.5">192h left</div>
            </div>
          </div>
        </div>

        {/* Processing / Awaiting counts */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[var(--border)]">
          <div>
            <p className="text-2xl font-mono font-bold text-white tabular-nums">
              {processingCount}
            </p>
            <p className="text-[11px] text-[var(--text-4)] font-sans">
              processing
            </p>
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-[var(--cyan)] tabular-nums">
              {awaitingCount}
            </p>
            <p className="text-[11px] text-[var(--text-4)] font-sans">
              awaiting
            </p>
          </div>
        </div>

        {/* Average progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--text-4)] font-sans">
              avg completion
            </span>
            <span className="text-[11px] font-mono text-[var(--text-3)] tabular-nums">
              {avgProgress}%
            </span>
          </div>
          <div className="h-2 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${avgProgress}%` }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(5,224,248,0.2), rgba(5,224,248,0.6))",
              }}
            />
          </div>
        </div>

        {/* Next due */}
        <div className="pt-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-4)] font-sans">
              next due
            </span>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
              {nextDue.dueDateShort}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-sans text-[var(--text-4)]">
              {nextDue.pair}
            </span>
            <span className="text-xs font-mono text-[var(--text-3)] tabular-nums">
              {formatCompact(nextDue.amount)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
