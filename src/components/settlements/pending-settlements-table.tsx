"use client";

import { motion } from "framer-motion";
import { formatMoney, formatCompact } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";
import { StatusDot } from "@/components/ui/status-dot";
import type { PendingSettlement } from "./settlements-data";
import { pendingSettlements } from "./settlements-data";

interface PendingSettlementsTableProps {
  settlements: PendingSettlement[];
  filteredTotal: number;
}

// Pending settlements table — full width per client feedback.
// Removed: Counterparty + Progress columns, all bold weights.

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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 4v6l3 3" stroke="var(--text-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="10" r="7" stroke="var(--text-4)" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-sm text-[var(--text-3)] mb-1">No settlements match</p>
          <p className="text-xs text-[var(--text-4)]">Try adjusting filters or search</p>
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
            <th scope="col" className="px-5 sm:px-[var(--table-cell-px)] py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)]">
              Pair
            </th>
            <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] text-right">
              Amount
            </th>
            <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] hidden sm:table-cell">
              Terms
            </th>
            <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] hidden sm:table-cell">
              Due
            </th>
            <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)]">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {settlements.map((s, i) => {
            const baseCurrency = s.pair.split("/")[0];
            const baseColor =
              currencyColors[baseCurrency]?.border ?? "rgba(255,255,255,0.5)";

            return (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150"
              >
                {/* Pair with monogram */}
                <td className="px-5 sm:px-[var(--table-cell-px)] py-[var(--table-cell-py)]">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${baseColor}12`,
                        borderColor: `${baseColor}24`,
                        borderWidth: 1,
                      }}
                    >
                      <span className="font-mono text-[10px]" style={{ color: baseColor }}>
                        {baseCurrency.slice(0, 2)}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-[var(--text)]">
                      {s.pair}
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-4 py-[var(--table-cell-py)] text-right whitespace-nowrap">
                  <span className="font-mono text-xs text-[var(--text)] tabular-nums">
                    {formatCompact(s.amount)}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-4)] ml-1">
                    {baseCurrency}
                  </span>
                </td>

                {/* Terms */}
                <td className="px-4 py-[var(--table-cell-py)] hidden sm:table-cell">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-[10px] font-mono text-[var(--text-3)]">
                    {s.settlement}
                  </span>
                </td>

                {/* Due date */}
                <td className="px-4 py-[var(--table-cell-py)] hidden sm:table-cell whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">
                      {s.dueDate.replace(", 2026", "")}
                    </span>
                    {s.daysRemaining === 0 ? (
                      <span className="text-[10px] font-sans text-[var(--text-2)]">
                        Due today
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans text-[var(--text-4)]">
                        {s.daysRemaining}d remaining
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-[var(--table-cell-py)] whitespace-nowrap">
                  <span aria-label={`${s.status === "processing" ? "Processing" : "Awaiting"}`}>
                    <StatusDot status={s.status} />
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div className="px-5 sm:px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-4)] font-sans">
          <span className="font-mono">{settlements.length}</span> of{" "}
          <span className="font-mono">{pendingSettlements.length}</span> pending
        </span>
        <span className="text-[10px] text-[var(--text-4)] font-sans">
          Total{" "}
          <span className="font-mono text-[var(--text)]">
            ${formatMoney(filteredTotal)}
          </span>
        </span>
      </div>
    </motion.div>
  );
}
