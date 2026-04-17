"use client";

import { motion } from "framer-motion";
import { formatMoney, formatCompact } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";
import type { PendingSettlement } from "./settlements-data";
import { pendingSettlements } from "./settlements-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PendingSettlementsTableProps {
  settlements: PendingSettlement[];
  filteredTotal: number;
}

// ---------------------------------------------------------------------------
// Pending Settlements Table
// ---------------------------------------------------------------------------

export function PendingSettlementsTable({
  settlements,
  filteredTotal,
}: PendingSettlementsTableProps) {
  if (settlements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 4v6l3 3"
                stroke="var(--text-4)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="10"
                cy="10"
                r="7"
                stroke="var(--text-4)"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-3)] mb-1">
            No settlements match
          </p>
          <p className="text-xs text-[var(--text-4)]">
            Try adjusting the terms filter
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
              Pair
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden md:table-cell">
              Counterparty
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
              Amount
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden sm:table-cell">
              Terms
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden sm:table-cell">
              Due
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden lg:table-cell w-48">
              Progress
            </th>
            <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {settlements.map((s, i) => {
            const isProcessing = s.status === "processing";
            const baseCurrency = s.pair.split("/")[0];
            const baseColor =
              currencyColors[baseCurrency]?.border ?? "rgba(255,255,255,0.5)";
            const progressGradient = isProcessing
              ? "linear-gradient(90deg, rgba(5,224,248,0.3), rgba(5,224,248,0.7))"
              : "linear-gradient(90deg, #04b0c4, var(--cyan))";

            return (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.04,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
              >
                {/* Pair with monogram */}
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${baseColor}15`,
                        borderColor: `${baseColor}30`,
                        borderWidth: 1,
                      }}
                    >
                      <span
                        className="font-mono text-[11px] font-bold"
                        style={{ color: baseColor }}
                      >
                        {baseCurrency.slice(0, 2)}
                      </span>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white">
                      {s.pair}
                    </span>
                  </div>
                </td>

                {/* Counterparty */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                  <span className="text-sm font-sans text-[var(--text-3)]">
                    {s.counterparty}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums">
                    {formatCompact(s.amount)}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-4)] ml-1">
                    {baseCurrency}
                  </span>
                </td>

                {/* Settlement terms */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-[rgba(255,255,255,0.06)] text-[11px] font-mono font-medium text-[var(--text-3)]">
                    {s.settlement}
                  </span>
                </td>

                {/* Due date */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs sm:text-sm text-[var(--text-3)] tabular-nums whitespace-nowrap">
                      {s.dueDate.replace(", 2026", "")}
                    </span>
                    {s.daysRemaining === 0 ? (
                      <span className="text-[10px] font-sans text-white whitespace-nowrap">
                        Due today
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans text-[var(--text-4)] whitespace-nowrap">
                        {s.daysRemaining}d remaining
                      </span>
                    )}
                  </div>
                </td>

                {/* Progress bar */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        transition={{
                          delay: 0.2 + i * 0.08,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full rounded-full"
                        style={{ background: progressGradient }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums w-8 text-right">
                      {s.progress}%
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  {isProcessing ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-white whitespace-nowrap">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      Processing
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-[var(--cyan)] whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
                      Awaiting
                    </span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[11px] text-[var(--text-4)] font-sans tracking-[.1em]">
          Showing{" "}
          <span className="font-mono">
            {settlements.length}
          </span>{" "}
          of{" "}
          <span className="font-mono">
            {pendingSettlements.length}
          </span>{" "}
          pending
        </span>
        <span className="text-[11px] text-[var(--text-4)] font-sans">
          Total{" "}
          <span className="font-mono font-bold text-white">
            ${formatMoney(filteredTotal)}
          </span>
        </span>
      </div>
    </motion.div>
  );
}
