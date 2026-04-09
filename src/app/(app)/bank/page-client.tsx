"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { transactions } from "@/lib/mock-data";
import { BankFilterBar } from "@/components/bank/filter-bar";
import { BankTransactionTable } from "@/components/bank/transaction-table";
import { Button } from "@/components/ui/button";
import { formatCompact } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Filter only deposit + withdrawal transactions
// ---------------------------------------------------------------------------

const bankTransactions = transactions.filter(
  (tx) => tx.type === "deposit" || tx.type === "withdrawal"
);

// Calculate 30d totals (all mock data is within 7 days, so it all counts)
const totalDeposits = bankTransactions
  .filter((tx) => tx.type === "deposit" && tx.status !== "failed")
  .reduce((sum, tx) => sum + tx.amount, 0);

const totalWithdrawals = bankTransactions
  .filter((tx) => tx.type === "withdrawal" && tx.status !== "failed")
  .reduce((sum, tx) => sum + tx.amount, 0);

const pendingTxs = bankTransactions.filter((tx) => tx.status === "pending");
const pendingTotal = pendingTxs.reduce((sum, tx) => sum + tx.amount, 0);

// ---------------------------------------------------------------------------
// Bank page client
// ---------------------------------------------------------------------------

export default function BankPageClient() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = (
    filter === "all"
      ? bankTransactions
      : bankTransactions.filter((tx) => tx.type === filter)
  ).filter((tx) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tx.description.toLowerCase().includes(q) ||
      tx.counterparty?.toLowerCase().includes(q) ||
      tx.currency.toLowerCase().includes(q)
    );
  });

  const netFlow = totalDeposits - totalWithdrawals;
  const netPositive = netFlow >= 0;
  const totalFlow = totalDeposits + totalWithdrawals;
  const depositPct = totalFlow > 0 ? Math.round((totalDeposits / totalFlow) * 100) : 0;
  const withdrawalPct = 100 - depositPct;

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Treasury Flow — consolidated single card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
            Treasury Flow
          </span>
          <Button variant="cyan" size="sm">
            New Transfer
          </Button>
        </div>

        <div>
          {/* 3 stat groups */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12">
            {/* Inflows */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M10 4L4 10M4 10h4.5M4 10V5.5" stroke="var(--text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
                  Inflows
                </span>
              </div>
              <p className="text-2xl font-mono font-bold text-white tabular-nums">
                {formatCompact(totalDeposits)}
              </p>
            </div>

            {/* Outflows */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
                  Outflows
                </span>
              </div>
              <p className="text-2xl font-mono font-bold text-[rgba(255,255,255,0.5)] tabular-nums">
                {formatCompact(totalWithdrawals)}
              </p>
            </div>

            {/* Net Flow */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${netPositive ? "bg-[var(--green-dim)]" : "bg-[var(--red-dim)]"}`}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    {netPositive ? (
                      <path d="M7 10V4M7 4L4.5 6.5M7 4l2.5 2.5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M7 4v6M7 10l-2.5-2.5M7 10l2.5-2.5" stroke="var(--red)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </div>
                <span className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)]">
                  Net
                </span>
              </div>
              <p
                className={`text-2xl font-mono font-bold tabular-nums ${
                  netPositive ? "text-[var(--green)]" : "text-[var(--red)]"
                }`}
              >
                {netPositive ? "+" : "-"}
                {formatCompact(Math.abs(netFlow))}
              </p>
            </div>
          </div>

          {/* Flow proportion bar */}
          {totalFlow > 0 && (
            <div className="mt-5">
              <div className="flex h-2 w-full rounded-full overflow-hidden gap-px">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${depositPct}%` }}
                />
                <div
                  className="h-full rounded-full"
                  style={{ width: `${withdrawalPct}%`, background: "rgba(255,255,255,0.2)" }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] font-sans text-[var(--text-4)] tracking-wide">
                  <span className="text-white">Inflows {depositPct}%</span>
                  <span className="mx-1.5">&middot;</span>
                  <span className="text-[rgba(255,255,255,0.5)]">Outflows {withdrawalPct}%</span>
                </p>
                {pendingTxs.length > 0 && (
                  <p className="text-[11px] font-sans text-[var(--amber)]">
                    <span className="font-mono">{pendingTxs.length}</span> pending
                    <span className="mx-1">&middot;</span>
                    <span className="font-mono">{formatCompact(pendingTotal)}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Filter + Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)]"
      >
        <BankFilterBar
          filter={filter}
          onFilterChange={(f) => {
            setFilter(f);
          }}
          search={search}
          onSearchChange={(s) => {
            setSearch(s);
          }}
        />
        <BankTransactionTable transactions={filtered} />
      </motion.div>
    </PageTransition>
  );
}
