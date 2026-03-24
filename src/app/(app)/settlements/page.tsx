"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { transactions } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";

// Pending settlements mock data
const pendingSettlements = [
  {
    id: "stl-p1",
    pair: "MXN/USDT",
    amount: 500_000,
    dueDate: "Mar 25, 2026",
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
    status: "awaiting" as const,
    counterparty: "Banco Itau S.A.",
    settlement: "T+10",
    progress: 8,
  },
];

// Completed settlements from transaction data
const completedSettlements = transactions.filter(
  (t) => t.type === "settlement"
);

type Tab = "pending" | "completed";

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-[2px] h-4 bg-[var(--cyan)] rounded-full" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[var(--text-3)]">
            Institutional Settlements
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Post-Trade Clearing
        </h1>
      </div>

      {/* Tab Navigation — underline style */}
      <div className="flex gap-8 border-b border-[rgba(255,255,255,0.05)]">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-4 font-mono text-sm transition-colors duration-200 cursor-pointer ${
            activeTab === "pending"
              ? "text-[var(--cyan)] border-b-2 border-[var(--cyan)] font-bold"
              : "text-[var(--text-3)] hover:text-white border-b-2 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2">
            Pending
            <span className="bg-[var(--amber-dim)] text-[var(--amber)] text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-sm">
              {pendingSettlements.length}
            </span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-4 font-mono text-sm transition-colors duration-200 cursor-pointer ${
            activeTab === "completed"
              ? "text-[var(--cyan)] border-b-2 border-[var(--cyan)] font-bold"
              : "text-[var(--text-3)] hover:text-white border-b-2 border-transparent"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Pending Settlements */}
      {activeTab === "pending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pendingSettlements.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              {s.status === "processing" ? (
                /* Processing card — animated conic-gradient border */
                <div className="processing-border rounded-lg">
                  <div className="bg-[var(--bg-card)] rounded-[7px] p-6 flex flex-col justify-between min-h-64">
                    {/* Top: pair + status */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] uppercase tracking-[.15em] text-[var(--text-3)]">
                            {s.settlement}
                          </span>
                          <p className="text-xl font-bold text-white mt-0.5">{s.pair}</p>
                        </div>
                        <span className="flex items-center gap-1.5 bg-[rgba(5,224,248,0.1)] text-[var(--cyan)] text-[10px] font-bold font-mono px-2 py-1 rounded-sm">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--cyan)]" />
                          </span>
                          PROCESSING
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold font-mono text-white tabular-nums">
                          {formatMoney(s.amount)}
                        </span>
                        <span className="text-sm font-mono font-bold text-[var(--cyan)]">
                          {s.pair.split("/")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: counterparty, due, progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--text-3)]">{s.counterparty}</span>
                        <span className="text-[10px] font-mono text-[var(--text-3)]">Due {s.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-[var(--text-3)]">Progress</span>
                        <span className="text-[10px] font-mono font-bold text-white">{s.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.progress}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{
                            background: "linear-gradient(90deg, var(--cyan-dark, #0a8a9e), var(--cyan))",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Awaiting cards */
                <div className="bg-[var(--bg-card)] rounded-lg border border-transparent hover:border-[rgba(255,255,255,0.05)] transition-colors duration-200 p-6 flex flex-col justify-between min-h-64">
                  {/* Top: pair + status */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.15em] text-[var(--text-3)]">
                          {s.settlement}
                        </span>
                        <p className="text-xl font-bold text-white mt-0.5">{s.pair}</p>
                      </div>
                      <span className="flex items-center gap-1.5 bg-[rgba(249,226,32,0.1)] text-[var(--amber)] text-[10px] font-bold font-mono px-2 py-1 rounded-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[var(--amber)]" />
                        </span>
                        AWAITING
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-bold font-mono text-white tabular-nums">
                        {formatMoney(s.amount)}
                      </span>
                      <span className="text-sm font-mono font-bold text-[var(--cyan)]">
                        {s.pair.split("/")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: counterparty, due, progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--text-3)]">{s.counterparty}</span>
                      <span className="text-[10px] font-mono text-[var(--text-3)]">Due {s.dueDate}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[var(--text-3)]">Progress</span>
                      <span className="text-[10px] font-mono font-bold text-white">{s.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: "linear-gradient(90deg, #d97706, var(--amber))",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Completed Settlements */}
      {activeTab === "completed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Settlement History Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-4 bg-[var(--cyan)] rounded-full" />
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[var(--text-3)]">
                Settlement History
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] text-[var(--text-3)] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-colors duration-200 cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 1v7M6 8L3.5 5.5M6 8l2.5-2.5M1 10h10" />
              </svg>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.1em]">Export CSV</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-[var(--bg-card)] rounded-lg border border-[rgba(255,255,255,0.05)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)]">Description</th>
                  <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)] text-right">Amount</th>
                  <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)]">Currency</th>
                  <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)] hidden sm:table-cell">Counterparty</th>
                  <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)] text-right hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {completedSettlements.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className={`border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150 ${
                      i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                    }`}
                  >
                    <td className="px-8 py-6">
                      <span className="text-sm text-[var(--text-2)]">{t.description}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="font-mono text-sm font-bold text-white tabular-nums">
                        {formatMoney(t.amount)}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                        t.currency === "USDT"
                          ? "bg-[rgba(5,224,248,0.1)] text-[var(--cyan)]"
                          : t.currency === "USDC"
                          ? "bg-[rgba(38,117,255,0.1)] text-blue-400"
                          : "bg-[rgba(255,255,255,0.06)] text-[var(--text-2)]"
                      }`}>
                        {t.currency}
                      </span>
                    </td>
                    <td className="px-8 py-6 hidden sm:table-cell">
                      <span className="font-mono text-sm text-[var(--text-3)]">{t.counterparty}</span>
                    </td>
                    <td className="px-8 py-6 text-right hidden sm:table-cell">
                      <span className="font-mono text-sm text-[var(--text-3)] tabular-nums">
                        {timeAgo(t.timestamp)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </PageTransition>
  );
}
