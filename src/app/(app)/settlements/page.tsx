"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { transactions } from "@/lib/mock-data";
import { formatMoney, formatCompact } from "@/lib/utils";
import { SettlementCard } from "@/components/settlements/settlement-card";
import { CompletedTable } from "@/components/settlements/completed-table";

// ---------------------------------------------------------------------------
// Pending settlements mock data
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Computed stats
// ---------------------------------------------------------------------------

const totalPendingAmount = pendingSettlements.reduce(
  (sum, s) => sum + s.amount,
  0
);

const dueThisWeek = pendingSettlements.filter(
  (s) => s.dueDate.includes("Mar 25") || s.dueDate.includes("Mar 26")
);
const dueThisWeekAmount = dueThisWeek.reduce((sum, s) => sum + s.amount, 0);
const dueThisWeekCount = dueThisWeek.length;

// Sort by due date for timeline (earliest first)
const timelineSorted = [...pendingSettlements].sort(
  (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
);

// ---------------------------------------------------------------------------
// Settlements page
// ---------------------------------------------------------------------------

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Tab toggle */}
      <div role="tablist" className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-lg p-1 w-fit">
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

      {/* Overview stats — pending tab only */}
      {activeTab === "pending" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total pending */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] border-l-2 border-l-[var(--cyan)] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[rgba(5,224,248,0.08)] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="5" stroke="var(--cyan)" strokeWidth="1.5" />
                  <path d="M7 4.5v3l2 1" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
                Total Pending
              </div>
            </div>
            <p className="text-2xl font-mono font-bold text-[var(--text)] tabular-nums mt-1">
              ${formatMoney(totalPendingAmount)}
            </p>
            <p className="text-[11px] text-[var(--text-4)] mt-1">
              <span className="font-mono">{pendingSettlements.length}</span> active
            </p>
          </div>

          {/* Due this week */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] border-l-2 border-l-[var(--amber)] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--amber-dim)] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 2v5l3 2" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 7a5 5 0 1010 0 5 5 0 00-10 0" stroke="var(--amber)" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
                Due This Week
              </div>
            </div>
            <p className="text-2xl font-mono font-bold text-[var(--amber)] tabular-nums mt-1">
              ${formatMoney(dueThisWeekAmount)}
            </p>
            <p className="text-[11px] text-[var(--text-4)] mt-1">
              <span className="font-mono">{dueThisWeekCount}</span> of <span className="font-mono">{pendingSettlements.length}</span>
            </p>
          </div>

          {/* Counterparty exposure */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] border-l-2 border-l-[var(--purple)] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--purple-dim)] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <circle cx="5" cy="5" r="3" stroke="var(--purple)" strokeWidth="1.5" />
                  <circle cx="9" cy="9" r="3" stroke="var(--purple)" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
                Exposure
              </div>
            </div>
            <div className="space-y-2.5">
              {pendingSettlements.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-3)] truncate">
                    {s.counterparty.split(" ")[0]}
                  </span>
                  <span className="text-xs font-mono text-[var(--text)] tabular-nums">
                    {formatCompact(s.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline strip — pending tab only */}
      {activeTab === "pending" && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
          <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)] mb-6">
            Settlement Timeline
          </div>
          <div className="relative overflow-x-auto">
            <div className="min-w-[500px] py-2">
            {/* Horizontal track line */}
            <div
              className="h-px absolute left-0 right-0"
              style={{
                top: "20px",
                background: "linear-gradient(90deg, var(--cyan), var(--amber))",
                opacity: 0.4,
              }}
            />

            {/* Timeline points */}
            <div className="flex justify-between relative">
              {timelineSorted.map((s) => {
                const isProcessing = s.status === "processing";
                const color = isProcessing ? "var(--cyan)" : "var(--amber)";
                const bgAlpha = isProcessing ? "rgba(5,224,248,0.12)" : "rgba(249,226,32,0.08)";
                const glowAlpha = isProcessing ? "rgba(5,224,248,0.5)" : "rgba(249,226,32,0.4)";

                return (
                  <div key={s.id} className="flex flex-col items-center group">
                    {/* Bigger node with double ring */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                          borderColor: color,
                          backgroundColor: bgAlpha,
                          boxShadow: `0 0 12px ${glowAlpha}`,
                        }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      </div>
                      {isProcessing && (
                        <div className="absolute inset-0 rounded-full border border-[var(--cyan)] opacity-30 animate-ping" />
                      )}
                    </div>

                    {/* Labels */}
                    <span className="text-[11px] font-mono text-[var(--text-3)] mt-3">
                      {s.dueDate.replace(", 2026", "")}
                    </span>
                    <span className="text-sm font-bold text-[var(--text)] mt-0.5">
                      {s.pair}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-4)] mt-0.5">
                      {formatCompact(s.amount)}
                    </span>
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider mt-1"
                      style={{ color }}
                    >
                      {s.status}
                    </span>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending settlement cards */}
      {activeTab === "pending" && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {pendingSettlements.map((s, i) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: { opacity: 0, y: 12, scale: 0.97 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <SettlementCard
                pair={s.pair}
                amount={s.amount}
                status={s.status}
                counterparty={s.counterparty}
                dueDate={s.dueDate}
                settlement={s.settlement}
                progress={s.progress}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Completed settlements */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
