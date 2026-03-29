"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { transactions } from "@/lib/mock-data";
import { formatMoney, formatCompact } from "@/lib/utils";
import { CompletedTable } from "@/components/settlements/completed-table";
import { ProgressRing } from "@/components/viz/progress-ring";
import { currencyColors } from "@/lib/currency-colors";
import { CornerBrackets } from "@/components/ui/corner-brackets";


// ---------------------------------------------------------------------------
// Mock data — expanded for richer display
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
    daysRemaining: 0,
  },
  {
    id: "stl-p2",
    pair: "EUR/USDT",
    amount: 108_000,
    dueDate: "Mar 26, 2026",
    dueDateShort: "Mar 26",
    status: "processing" as const,
    counterparty: "Deutsche Bank AG",
    settlement: "T+2",
    progress: 48,
    daysRemaining: 0,
  },
  {
    id: "stl-p4",
    pair: "GBP/USDC",
    amount: 245_000,
    dueDate: "Mar 28, 2026",
    dueDateShort: "Mar 28",
    status: "processing" as const,
    counterparty: "Barclays PLC",
    settlement: "T+2",
    progress: 58,
    daysRemaining: 2,
  },
  {
    id: "stl-p5",
    pair: "USD/USDT",
    amount: 2_150_000,
    dueDate: "Mar 31, 2026",
    dueDateShort: "Mar 31",
    status: "awaiting" as const,
    counterparty: "JP Morgan Chase",
    settlement: "T+1",
    progress: 12,
    daysRemaining: 5,
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
    daysRemaining: 8,
  },
  {
    id: "stl-p6",
    pair: "MXN/USDT",
    amount: 780_000,
    dueDate: "Apr 7, 2026",
    dueDateShort: "Apr 7",
    status: "awaiting" as const,
    counterparty: "BBVA Mexico",
    settlement: "T+2",
    progress: 5,
    daysRemaining: 12,
  },
];

const completedSettlements = transactions.filter(
  (t) => t.type === "settlement",
);

type Tab = "pending" | "completed";
type TermFilter = "all" | "T+1" | "T+2" | "T+10";

// ---------------------------------------------------------------------------
// Derived analytics
// ---------------------------------------------------------------------------

const totalPendingAmount = pendingSettlements.reduce(
  (sum, s) => sum + s.amount,
  0,
);
const processingCount = pendingSettlements.filter(
  (s) => s.status === "processing",
).length;
const awaitingCount = pendingSettlements.filter(
  (s) => s.status === "awaiting",
).length;
const processingAmount = pendingSettlements
  .filter((s) => s.status === "processing")
  .reduce((sum, s) => sum + s.amount, 0);
const awaitingAmount = pendingSettlements
  .filter((s) => s.status === "awaiting")
  .reduce((sum, s) => sum + s.amount, 0);
const avgProgress = Math.round(
  pendingSettlements.reduce((sum, s) => sum + s.progress, 0) /
    pendingSettlements.length,
);

// Volume by settlement terms
const volumeByTerms = pendingSettlements.reduce(
  (acc, s) => {
    acc[s.settlement] = (acc[s.settlement] || 0) + s.amount;
    return acc;
  },
  {} as Record<string, number>,
);
const sortedTerms = Object.entries(volumeByTerms).sort(
  ([, a], [, b]) => b - a,
);
const maxTermVolume = sortedTerms[0]?.[1] || 1;

// Counterparty exposure
const exposureByCounterparty = pendingSettlements.reduce(
  (acc, s) => {
    const name = s.counterparty.split(" ")[0];
    acc[name] = (acc[name] || 0) + s.amount;
    return acc;
  },
  {} as Record<string, number>,
);
const sortedExposure = Object.entries(exposureByCounterparty).sort(
  ([, a], [, b]) => b - a,
);

const nextDue = pendingSettlements[0];

// ---------------------------------------------------------------------------
// Settlements page
// ---------------------------------------------------------------------------

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [termFilter, setTermFilter] = useState<TermFilter>("all");

  const filteredSettlements = pendingSettlements.filter((s) => {
    if (termFilter !== "all" && s.settlement !== termFilter) return false;
    return true;
  });

  const filteredTotal = filteredSettlements.reduce(
    (sum, s) => sum + s.amount,
    0,
  );

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* ── Analytics Row ── */}
      {activeTab === "pending" && (
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
      )}

      {/* ── Tab Toggle + Filters ── */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
        {/* Tabs */}
        <div
          role="tablist"
          className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-lg p-1"
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
            <span className="ml-1 text-[var(--cyan)]">
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

        {/* Settlement terms filter — pending only */}
        {activeTab === "pending" && (
          <div className="flex gap-1 bg-[var(--bg-elevated)] rounded-lg p-1">
            {(["all", "T+1", "T+2", "T+10"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTermFilter(value)}
                className={`px-4 py-1.5 rounded-md text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  termFilter === value
                    ? "bg-[var(--bg-card)] text-white font-bold"
                    : "text-[var(--text-4)] hover:text-[var(--text-3)]"
                }`}
              >
                {value === "all" ? "All Terms" : value}
              </button>
            ))}
          </div>
        )}

        {/* Export — pushed right */}
        {activeTab === "pending" && (
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
            <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">
              Export CSV
            </span>
          </Button>
        )}
      </div>

      {/* ── Pending: Table + Sidebar ── */}
      {activeTab === "pending" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
          >
            {filteredSettlements.length === 0 ? (
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
            ) : (
              <>
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
                    {filteredSettlements.map((s, i) => {
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
                          <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                            <div className="flex flex-col">
                              <span className="font-mono text-xs sm:text-sm text-[var(--text-3)] tabular-nums">
                                {s.dueDate.replace(", 2026", "")}
                              </span>
                              {s.daysRemaining === 0 ? (
                                <span className="text-[10px] font-sans text-white">
                                  Due today
                                </span>
                              ) : (
                                <span className="text-[10px] font-sans text-[var(--text-4)]">
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
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            {isProcessing ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-white">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                                </span>
                                Processing
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-[var(--cyan)]">
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
                      {filteredSettlements.length}
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
              </>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="space-y-4"
          >
            {/* Card: Next Settlement Due */}
            {(() => {
              const next = filteredSettlements[0] ?? nextDue;
              const isProcessing = next.status === "processing";
              const baseCurrency = next.pair.split("/")[0];
              const baseColor =
                currencyColors[baseCurrency]?.border ?? "#ffffff";
              const progressGradient = isProcessing
                ? "linear-gradient(90deg, rgba(5,224,248,0.4), rgba(5,224,248,0.8))"
                : "linear-gradient(90deg, #04b0c4, var(--cyan))";

              return (
                <div className="bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[var(--cyan)] rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
                      Next Due
                    </span>
                    {next.daysRemaining === 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[10px] font-sans font-bold text-white uppercase tracking-[.1em]">
                        Due Today
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[10px] font-mono font-bold text-[var(--text-3)]">
                        {next.daysRemaining}d
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
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

                  <div className="mt-3">
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-white">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                        </span>
                        Processing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] text-[var(--cyan)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
                        Awaiting
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Card: Counterparty Exposure */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
              <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
                Counterparty Exposure
              </span>

              <div className="mt-3 space-y-3">
                {sortedExposure.map(([name, amount], index) => {
                  const proportion = amount / totalPendingAmount;
                  const opacity =
                    [1, 0.8, 0.6, 0.4, 0.27, 0.2][index] ?? 0.2;
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-sans text-[var(--text-3)]">
                          {name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums">
                            {(proportion * 100).toFixed(0)}%
                          </span>
                          <span className="font-mono text-xs font-bold text-white tabular-nums">
                            {formatCompact(amount)}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.round(proportion * 100)}%`,
                          }}
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
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[.1em] font-sans font-medium text-[var(--text-4)]">
                  Total
                </span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  ${formatMoney(totalPendingAmount)}
                </span>
              </div>
            </div>

            {/* Card: Upcoming Schedule */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
              <span className="text-[11px] uppercase tracking-[.12em] font-sans font-medium text-[var(--text-4)]">
                Schedule
              </span>

              <div className="mt-3 space-y-0">
                {pendingSettlements.map((s, i) => {
                  const isProcessing = s.status === "processing";
                  const isLast = i === pendingSettlements.length - 1;
                  return (
                    <div key={s.id} className="flex gap-3">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                            isProcessing
                              ? "bg-[var(--cyan)]"
                              : "bg-[var(--bg-bright)]"
                          }`}
                        />
                        {!isLast && (
                          <div className="w-px flex-1 bg-[var(--border)]" />
                        )}
                      </div>
                      {/* Content */}
                      <div
                        className={`flex-1 flex items-center justify-between pb-3 ${
                          !isLast
                            ? "border-b border-[var(--border-row)]"
                            : ""
                        } mb-1`}
                      >
                        <div>
                          <p
                            className={`font-mono text-xs font-bold ${
                              isProcessing
                                ? "text-white"
                                : "text-[var(--text-3)]"
                            }`}
                          >
                            {s.pair}
                          </p>
                          <p className="text-[10px] font-sans text-[var(--text-4)]">
                            {s.counterparty.split(" ")[0]}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xs font-bold text-white tabular-nums">
                            {formatCompact(s.amount)}
                          </p>
                          <p className="text-[10px] font-mono text-[var(--text-4)] tabular-nums">
                            {s.dueDateShort}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Completed ── */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
