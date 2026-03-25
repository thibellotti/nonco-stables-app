"use client";

import { useState } from "react";
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
    <PageTransition className="px-6 md:px-8 w-full space-y-6">
      {/* Header with inline tabs */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settlements
        </h1>
        <div className="flex gap-1 bg-[var(--bg-elevated)] rounded-lg p-1">
          <button
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
      </div>

      {/* Overview stats — pending tab only */}
      {activeTab === "pending" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total pending */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)]">
              Total Pending
            </div>
            <p className="text-2xl font-mono font-bold text-white tabular-nums mt-1">
              ${formatMoney(totalPendingAmount)}
            </p>
            <p className="text-[10px] text-[var(--text-4)] font-mono mt-1">
              {pendingSettlements.length} active
            </p>
          </div>

          {/* Due this week */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)]">
              Due This Week
            </div>
            <p className="text-2xl font-mono font-bold text-[var(--amber)] tabular-nums mt-1">
              ${formatMoney(dueThisWeekAmount)}
            </p>
            <p className="text-[10px] text-[var(--text-4)] font-mono mt-1">
              {dueThisWeekCount} of {pendingSettlements.length}
            </p>
          </div>

          {/* Counterparty exposure */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] mb-3">
              Counterparty Exposure
            </div>
            <div className="space-y-2">
              {pendingSettlements.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-3)] truncate">
                    {s.counterparty.split(" ")[0]}
                  </span>
                  <span className="text-xs font-mono text-white tabular-nums">
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
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
          <div className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] mb-4">
            Settlement Timeline
          </div>
          <div className="relative">
            {/* Horizontal track line */}
            <div className="h-px bg-[var(--border-outline)] absolute top-3 left-0 right-0" />

            {/* Timeline points */}
            <div className="flex justify-between relative">
              {timelineSorted.map((s) => (
                <div key={s.id} className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      s.status === "processing"
                        ? "border-[var(--cyan)] bg-[rgba(5,224,248,0.1)]"
                        : "border-[var(--amber)] bg-[rgba(249,226,32,0.06)]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        s.status === "processing"
                          ? "bg-[var(--cyan)]"
                          : "bg-[var(--amber)]"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-3)] mt-2">
                    {s.dueDate.replace(", 2026", "")}
                  </span>
                  <span className="text-xs font-bold text-white mt-0.5">
                    {s.pair}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-4)]">
                    {formatCompact(s.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending settlement cards */}
      {activeTab === "pending" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSettlements.map((s, i) => (
            <SettlementCard
              key={s.id}
              pair={s.pair}
              amount={s.amount}
              status={s.status}
              counterparty={s.counterparty}
              dueDate={s.dueDate}
              settlement={s.settlement}
              progress={s.progress}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Completed settlements */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
