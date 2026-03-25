"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { transactions } from "@/lib/mock-data";
import { formatMoney, formatCompact } from "@/lib/utils";
import { CompletedTable } from "@/components/settlements/completed-table";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Pending settlements mock data
// ---------------------------------------------------------------------------

const pendingSettlements = [
  {
    id: "stl-p1",
    pair: "MXN/USDT",
    amount: 500_000,
    dueDate: "Mar 25, 2026",
    dueDateShort: "Mar 25",
    status: "processing" as const,
    counterparty: "Banorte S.A.",
    settlement: "T+1",
    progress: 72,
  },
  {
    id: "stl-p2",
    pair: "EUR/USDT",
    amount: 108_000,
    dueDate: "Mar 26, 2026",
    dueDateShort: "Mar 26",
    status: "awaiting" as const,
    counterparty: "Deutsche Bank AG",
    settlement: "T+2",
    progress: 35,
  },
  {
    id: "stl-p3",
    pair: "BRL/USDC",
    amount: 1_030_000,
    dueDate: "Apr 3, 2026",
    dueDateShort: "Apr 3",
    status: "awaiting" as const,
    counterparty: "Banco Itau S.A.",
    settlement: "T+10",
    progress: 8,
  },
];

const completedSettlements = transactions.filter(
  (t) => t.type === "settlement"
);

type Tab = "pending" | "completed";

// Computed stats
const totalPendingAmount = pendingSettlements.reduce(
  (sum, s) => sum + s.amount,
  0
);
const processingCount = pendingSettlements.filter(
  (s) => s.status === "processing"
).length;
const awaitingCount = pendingSettlements.filter(
  (s) => s.status === "awaiting"
).length;

// ---------------------------------------------------------------------------
// Settlements page
// ---------------------------------------------------------------------------

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-6">
      {/* Header row: tabs + summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tab toggle */}
        <div
          role="tablist"
          className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-lg p-1 w-fit"
        >
          <button
            role="tab"
            aria-selected={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "pending"
                ? "bg-[var(--bg-card)] text-white"
                : "text-[var(--text-4)] hover:text-[var(--text-3)]"
            }`}
          >
            Pending{" "}
            <span className="ml-1 text-[var(--amber)]">
              {pendingSettlements.length}
            </span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-[var(--bg-card)] text-white"
                : "text-[var(--text-4)] hover:text-[var(--text-3)]"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Inline summary — pending tab only */}
        {activeTab === "pending" && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[.12em] text-[var(--text-4)] font-sans">
                Total
              </span>
              <span className="text-sm font-mono font-bold text-white tabular-nums">
                ${formatMoney(totalPendingAmount)}
              </span>
            </div>
            <div className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
              <span className="text-[11px] text-[var(--text-3)] font-sans">
                {processingCount} processing
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
              <span className="text-[11px] text-[var(--text-3)] font-sans">
                {awaitingCount} awaiting
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pending: single table card */}
      {activeTab === "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                  Pair
                </th>
                <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                  Counterparty
                </th>
                <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                  Amount
                </th>
                <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden md:table-cell">
                  Terms
                </th>
                <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden sm:table-cell">
                  Due
                </th>
                <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden lg:table-cell w-48">
                  Progress
                </th>
                <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingSettlements.map((s, i) => {
                const isProcessing = s.status === "processing";
                const baseCurrency = s.pair.split("/")[0];
                const baseColor =
                  currencyColors[baseCurrency]?.border ?? "var(--cyan)";
                const progressGradient = isProcessing
                  ? "linear-gradient(90deg, rgba(5,224,248,0.6), var(--cyan))"
                  : "linear-gradient(90deg, #d97706, var(--amber))";

                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
                  >
                    {/* Pair with monogram */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
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
                        <span className="font-mono text-sm font-bold text-white">
                          {s.pair}
                        </span>
                      </div>
                    </td>

                    {/* Counterparty */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-sans text-[var(--text-3)]">
                        {s.counterparty}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-sm font-bold text-white tabular-nums">
                        {formatCompact(s.amount)}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--text-4)] ml-1">
                        {baseCurrency}
                      </span>
                    </td>

                    {/* Settlement terms */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-[rgba(255,255,255,0.06)] text-[11px] font-mono font-medium text-[var(--text-3)]">
                        {s.settlement}
                      </span>
                    </td>

                    {/* Due date */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="font-mono text-sm text-[var(--text-3)] tabular-nums">
                        {s.dueDate.replace(", 2026", "")}
                      </span>
                    </td>

                    {/* Progress bar — thicker h-2 */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.progress}%` }}
                            transition={{
                              delay: 0.2 + i * 0.1,
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
                    <td className="px-6 py-4">
                      {isProcessing ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.08em] text-[var(--cyan)]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--cyan)]" />
                          </span>
                          Processing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.08em] text-[var(--amber)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
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
          <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-4)] font-sans">
              <span className="font-mono">{pendingSettlements.length}</span>{" "}
              pending settlements
            </span>
            <span className="text-[11px] text-[var(--text-4)] font-sans">
              Total exposure{" "}
              <span className="font-mono font-bold text-white">
                ${formatMoney(totalPendingAmount)}
              </span>
            </span>
          </div>
        </motion.div>
      )}

      {/* Upcoming settlements timeline — pending tab only */}
      {activeTab === "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
              Upcoming Timeline
            </span>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            {pendingSettlements.map((s, i) => {
              const isProcessing = s.status === "processing";
              const baseCurrency = s.pair.split("/")[0];
              const baseColor =
                currencyColors[baseCurrency]?.border ?? "var(--cyan)";

              return (
                <motion.div
                  key={`timeline-${s.id}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150"
                >
                  {/* Date column */}
                  <div className="w-14 shrink-0">
                    <span className="font-mono text-sm text-[var(--text-3)] tabular-nums">
                      {s.dueDateShort}
                    </span>
                  </div>

                  {/* Timeline dot + connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: isProcessing ? "var(--cyan)" : "var(--amber)",
                        boxShadow: isProcessing
                          ? "0 0 8px rgba(5,224,248,0.4)"
                          : "0 0 8px rgba(249,226,32,0.3)",
                      }}
                    />
                  </div>

                  {/* Pair + counterparty */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: baseColor }}
                      >
                        {s.pair}
                      </span>
                      <span className="text-[11px] text-[var(--text-4)] font-sans truncate">
                        {s.counterparty}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="shrink-0 text-right">
                    <span className="font-mono text-sm font-bold text-white tabular-nums">
                      {formatCompact(s.amount)}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="shrink-0 w-24 text-right">
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-sans uppercase tracking-[.08em] text-[var(--cyan)]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--cyan)]" />
                        </span>
                        processing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-sans uppercase tracking-[.08em] text-[var(--amber)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
                        awaiting
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Completed settlements */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
