"use client";

import { motion } from "framer-motion";
import { formatMoney, formatCompact } from "@/lib/utils";
import { totalPendingAmount, termBreakdowns } from "./settlements-data";

// ---------------------------------------------------------------------------
// Settlements Overview — replaces the old ring-gauge / processing-vs-awaiting
// dashboard per Fernando's feedback (Apr 2026): "I couldn't match the numbers
// in this chart with the rest of the information in this page".
//
// New design:
//   1. Total Exposure headline — single source of truth, ties to totals below.
//   2. One compact pipeline bar split by terms (T+1 / T+2 / T+10) only.
//      No more dual processing/awaiting layer that Fer didn't need.
//   3. Per-term rows: count of settlements + total amount, in plain order.
// ---------------------------------------------------------------------------

const TERM_COLORS: Record<string, string> = {
  "T+1": "rgba(5,224,248,0.85)",
  "T+2": "rgba(5,224,248,0.55)",
  "T+10": "rgba(5,224,248,0.28)",
};

export function SettlementsStats() {
  const totalCount = termBreakdowns.reduce((sum, t) => sum + t.count, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Settlements overview"
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
    >
      {/* ─── Total Exposure headline ─── */}
      <div className="px-5 sm:px-6 py-5 border-b border-[var(--border)]">
        <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-2">
          Total exposure
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span
            className="font-mono text-white tabular-nums leading-none"
            style={{ fontSize: "clamp(1.625rem, 1.2rem + 1vw, 2.25rem)" }}
          >
            ${formatMoney(totalPendingAmount)}
          </span>
          <span className="font-sans text-xs text-[var(--text-4)] tabular-nums">
            <span className="font-mono text-[var(--text-3)]">{totalCount}</span>{" "}
            pending {totalCount === 1 ? "settlement" : "settlements"}
          </span>
        </div>

        {/* ─── Pipeline bar — split by terms only ─── */}
        <div
          role="img"
          aria-label="Settlement pipeline by terms"
          className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]"
        >
          {termBreakdowns.map((t, i) =>
            t.amount > 0 ? (
              <motion.div
                key={t.term}
                initial={{ width: 0 }}
                animate={{ width: `${t.share}%` }}
                transition={{
                  delay: 0.2 + i * 0.08,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full"
                style={{ backgroundColor: TERM_COLORS[t.term] ?? "rgba(255,255,255,0.3)" }}
                title={`${t.term} — ${formatCompact(t.amount)} (${t.share}%)`}
              />
            ) : null,
          )}
        </div>
      </div>

      {/* ─── Per-term rows ─── */}
      <ul className="divide-y divide-[var(--border-row)]">
        {termBreakdowns.map((t) => (
          <li
            key={t.term}
            className="grid grid-cols-[64px_1fr_auto] items-center gap-3 px-5 sm:px-6 py-3"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: TERM_COLORS[t.term] ?? "rgba(255,255,255,0.3)" }}
              />
              <span className="font-mono text-xs text-[var(--text)] tabular-nums">
                {t.term}
              </span>
            </span>

            <span className="font-sans text-xs text-[var(--text-3)]">
              <span className="font-mono text-[var(--text-2)] tabular-nums">{t.count}</span>{" "}
              {t.count === 1 ? "settlement" : "settlements"}
            </span>

            <span className="font-mono text-xs text-[var(--text)] tabular-nums whitespace-nowrap">
              {t.amount > 0 ? formatCompact(t.amount) : "$0"}
            </span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
