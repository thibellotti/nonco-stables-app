"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { reportCorridors, yieldVaults } from "@/lib/mock-data";
import { BarChart } from "@/components/viz/bar-chart";
import { formatMoney, formatCompact } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Metric data
// ---------------------------------------------------------------------------

const metrics = [
  { label: "Total volume", value: 18_400_000, prefix: "$", format: "compact", color: "var(--cyan)" },
  { label: "FX revenue", value: 27_600, prefix: "$", format: "money", color: "var(--green)" },
  { label: "Yield revenue", value: 7_240, prefix: "$", format: "money", color: "var(--purple)" },
  { label: "Total P&L", value: 34_840, prefix: "$", format: "money", color: "var(--cyan)" },
];

// ---------------------------------------------------------------------------
// Reports page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Top row: Period label + Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-[11px] uppercase tracking-[.15em] font-sans font-medium text-[var(--text-4)]">
          Month to date
        </span>

        <Button variant="ghost" size="sm" className="sm:ml-auto">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 1v7M6 8L3.5 5.5M6 8l2.5-2.5M1 10h10" />
          </svg>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">Export CSV</span>
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--bg-elevated)] rounded-lg p-5"
          >
            <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
              {m.label}
            </div>
            <p
              className="text-2xl font-mono font-bold tabular-nums mt-2 tracking-tight"
              style={{ color: m.color }}
            >
              {m.format === "compact"
                ? formatCompact(m.value)
                : `${m.prefix}${formatMoney(m.value)}`}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Full-width: Volume by corridor chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="px-6 py-3 border-b border-[var(--border)]">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
            Volume by Corridor
          </span>
        </div>
        <BarChart
          bars={[
            { label: "MXN", value: 60.9, color: "var(--cyan)" },
            { label: "BRL", value: 20.7, color: "var(--purple)" },
            { label: "EUR", value: 13.0, color: "#38bdf8" },
            { label: "GBP", value: 5.4, color: "var(--amber)" },
          ]}
          height={140}
          className="px-6 py-5"
        />
      </motion.div>

      {/* Two-column: Corridor Details + Yield */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Corridor details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="px-6 py-3 border-b border-[var(--border)]">
            <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
              Corridor Details
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em]">
                    Corridor
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right">
                    Trades
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right hidden sm:table-cell">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right">
                    Share
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right hidden md:table-cell">
                    Avg size
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportCorridors.map((c, i) => (
                  <motion.tr
                    key={c.corridor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-sans font-medium text-[var(--text)]">
                        {c.corridor}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[12px] font-mono text-[var(--text-3)] tabular-nums">
                        {c.trades}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                      <span className="text-[12px] font-mono font-bold text-white tabular-nums">
                        {formatCompact(c.volume)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full bg-[var(--cyan)]"
                            style={{ width: `${c.share}%`, opacity: 1 - i * 0.2 }}
                          />
                        </div>
                        <span className="text-[12px] font-mono text-[var(--text-3)] tabular-nums">
                          {c.share.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <span className="text-[12px] font-mono text-[var(--text-3)] tabular-nums">
                        {formatCompact(c.avgSize)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* RIGHT: Yield breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
              Yield breakdown
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em]">
                    Vault
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right hidden sm:table-cell">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right">
                    APY
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right">
                    Earned MTD
                  </th>
                </tr>
              </thead>
              <tbody>
                {yieldVaults
                  .filter((v) => v.status === "active")
                  .map((v, i) => (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: v.color }}
                          />
                          <span className="text-[12px] font-sans font-medium text-[var(--text)]">
                            {v.flag} {v.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right hidden sm:table-cell">
                        <span className="text-[12px] font-mono text-[var(--text-3)] tabular-nums">
                          {v.balanceLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[12px] font-mono font-bold tabular-nums" style={{ color: v.color }}>
                          {v.apy.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[12px] font-mono font-bold text-white tabular-nums">
                          ${formatMoney(v.earnedMTD)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Yield total */}
          <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-4)] font-sans">Total earned</span>
            <span className="text-sm font-mono font-bold text-[var(--cyan)] tabular-nums">
              ${formatMoney(yieldVaults.filter((v) => v.status === "active").reduce((sum, v) => sum + v.earnedMTD, 0))}
            </span>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
