"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 lg:px-10 lg:py-8 space-y-6"
    >
      <SectionLabel>Settlements</SectionLabel>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-1.5 rounded-md font-mono text-xs font-medium transition-all duration-200 cursor-pointer ${
            activeTab === "pending"
              ? "bg-[var(--bg-elevated)] text-[var(--text)]"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]"
          }`}
        >
          Pending
          <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--cyan-dim)] text-[var(--cyan)] text-[10px] font-bold">
            {pendingSettlements.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-1.5 rounded-md font-mono text-xs font-medium transition-all duration-200 cursor-pointer ${
            activeTab === "completed"
              ? "bg-[var(--bg-elevated)] text-[var(--text)]"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]"
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
          className="grid grid-cols-1 lg:grid-cols-3 gap-3"
        >
          {pendingSettlements.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-semibold text-[var(--text)]">
                        {s.pair}
                      </span>
                      <Badge
                        variant={s.status === "processing" ? "cyan" : "amber"}
                      >
                        {s.status === "processing"
                          ? "Processing"
                          : "Awaiting settlement"}
                      </Badge>
                    </div>
                    <p className="text-[var(--text-3)] text-xs mt-1">
                      {s.counterparty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-base font-semibold text-[var(--text)]">
                      {formatMoney(s.amount)}
                    </p>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)] mt-0.5">
                      {s.pair.split("/")[0]}
                    </p>
                  </div>
                </div>

                {/* Settlement timeline */}
                <div className="flex items-center justify-between text-xs text-[var(--text-4)] mb-2">
                  <span>
                    {s.settlement} — Due{" "}
                    <span className="text-[var(--text-2)]">{s.dueDate}</span>
                  </span>
                  <span className="font-mono">{s.progress}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.progress}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        s.status === "processing"
                          ? "var(--cyan)"
                          : "var(--amber)",
                    }}
                  />
                </div>
              </Card>
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
        >
          <Card padding={false}>
            <div className="px-5 py-3 border-b border-[var(--border)]">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
                Settlement History
              </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 text-[var(--text-4)]">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em]">
                Description
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-right">
                Amount
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em]">
                Currency
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em]">
                Counterparty
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-right">
                Date
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[var(--border)]">
              {completedSettlements.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 items-center hover:bg-[var(--bg-elevated)] transition-colors duration-150"
                >
                  <span className="text-sm text-[var(--text-2)] truncate">
                    {t.description}
                  </span>
                  <span className="font-mono text-sm text-[var(--text)] text-right font-medium">
                    {formatMoney(t.amount)}
                  </span>
                  <span>
                    <Badge variant="default">{t.currency}</Badge>
                  </span>
                  <span className="text-sm text-[var(--text-3)] truncate">
                    {t.counterparty}
                  </span>
                  <span className="font-mono text-xs text-[var(--text-3)] text-right">
                    {timeAgo(t.timestamp)}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
