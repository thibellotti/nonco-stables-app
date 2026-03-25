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

      {/* Pending: table + sidebar */}
      {activeTab === "pending" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* LEFT: existing table */}
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

          {/* RIGHT: Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Card 1: Next Settlement */}
            {(() => {
              const next = pendingSettlements[0];
              const isProcessing = next.status === "processing";
              const baseCurrency = next.pair.split("/")[0];
              const baseColor =
                currencyColors[baseCurrency]?.border ?? "var(--cyan)";
              const progressGradient = isProcessing
                ? "linear-gradient(90deg, rgba(5,224,248,0.6), var(--cyan))"
                : "linear-gradient(90deg, #d97706, var(--amber))";

              return (
                <div className="bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[var(--cyan)] rounded-lg p-5">
                  <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
                    Next Due
                  </span>

                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
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
                    <div>
                      <p className="font-mono text-sm font-bold text-white">
                        {next.pair}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--text-4)] tabular-nums">
                        {next.dueDate}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 font-mono text-xl font-bold text-white tabular-nums">
                    {formatCompact(next.amount)}
                    <span className="text-sm text-[var(--text-4)] ml-1.5">
                      {baseCurrency}
                    </span>
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${next.progress}%` }}
                        transition={{
                          delay: 0.3,
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="h-full rounded-full"
                        style={{ background: progressGradient }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums">
                      {next.progress}%
                    </span>
                  </div>

                  {/* Status */}
                  <div className="mt-3">
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
                  </div>
                </div>
              );
            })()}

            {/* Card 2: Counterparty Exposure */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
              <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
                Exposure
              </span>

              <div className="mt-3 space-y-3">
                {pendingSettlements.map((s) => {
                  const proportion = s.amount / totalPendingAmount;
                  const counterpartyShort =
                    s.counterparty.split(" ")[0];

                  return (
                    <div key={s.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-sans text-[var(--text-3)]">
                          {counterpartyShort}
                        </span>
                        <span className="font-mono text-xs font-bold text-white tabular-nums">
                          {formatCompact(s.amount)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.round(proportion * 100)}%`,
                          }}
                          transition={{
                            delay: 0.3,
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: `rgba(5, 224, 248, ${0.3 + proportion * 0.7})`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[.08em] font-sans font-medium text-[var(--text-4)]">
                  Total
                </span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  ${formatMoney(totalPendingAmount)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Completed settlements */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
