import { motion } from "framer-motion";
import { type Transaction } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CompletedTableProps {
  settlements: Transaction[];
}

// ---------------------------------------------------------------------------
// Completed Settlements Table
// ---------------------------------------------------------------------------

export function CompletedTable({ settlements }: CompletedTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Settlement History Header */}
      <div className="flex items-center justify-between">
        <SectionLabel>Settlement History</SectionLabel>
        <Button variant="ghost" size="sm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 1v7M6 8L3.5 5.5M6 8l2.5-2.5M1 10h10" />
          </svg>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">Export CSV</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)]">Description</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)] text-right">Amount</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)]">Currency</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)] hidden sm:table-cell">Counterparty</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)] text-right hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={`border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150 ${
                  i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                }`}
              >
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <span className="text-xs sm:text-sm text-[var(--text)]">{t.description}</span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white tabular-nums">
                    {formatMoney(t.amount)}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-mono font-bold"
                    style={{
                      backgroundColor: currencyColors[t.currency]?.bg ?? "rgba(255,255,255,0.06)",
                      color: currencyColors[t.currency]?.text ?? "var(--text-2)",
                    }}
                  >
                    {t.currency}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                  <span className="font-mono text-xs sm:text-sm text-[var(--text-3)]">{t.counterparty}</span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right hidden sm:table-cell">
                  <span className="font-mono text-xs sm:text-sm text-[var(--text-3)] tabular-nums">
                    {timeAgo(t.timestamp)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
