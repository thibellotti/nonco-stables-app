"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionLabel } from "@/components/ui/section-label";
import { transactions } from "@/lib/mock-data";
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
// Settlements page
// ---------------------------------------------------------------------------

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <SectionLabel>Institutional Settlements</SectionLabel>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Post-Trade Clearing
        </h1>
      </div>

      {/* Tab Navigation — underline style */}
      <div className="flex gap-8 border-b border-[var(--border)]">
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

      {/* Completed Settlements */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
