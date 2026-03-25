"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { transactions } from "@/lib/mock-data";
import { BankKpiCards } from "@/components/bank/kpi-cards";
import { BankFilterBar } from "@/components/bank/filter-bar";
import { BankTransactionTable } from "@/components/bank/transaction-table";
import { Button } from "@/components/ui/button";

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

// ---------------------------------------------------------------------------
// Bank page
// ---------------------------------------------------------------------------

export default function BankPage() {
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
  const pendingCount = bankTransactions.filter(
    (tx) => tx.status === "pending"
  ).length;

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Flow visualization + action */}
      <div className="flex items-center justify-end">
        <Button variant="cyan" size="sm">New Transfer</Button>
      </div>

      <BankKpiCards
        totalDeposits={totalDeposits}
        totalWithdrawals={totalWithdrawals}
        netFlow={netFlow}
        depositCount={
          bankTransactions.filter((tx) => tx.type === "deposit").length
        }
        withdrawalCount={
          bankTransactions.filter((tx) => tx.type === "withdrawal").length
        }
      />

      {/* Pending actions callout */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[rgba(249,226,32,0.3)] bg-[rgba(249,226,32,0.05)]">
          <span className="text-[var(--amber)] text-sm font-medium">
            {pendingCount} pending{" "}
            {pendingCount === 1 ? "transaction" : "transactions"} awaiting
            confirmation
          </span>
        </div>
      )}

      {/* Filter + Table */}
      <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
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
      </div>
    </PageTransition>
  );
}
