"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionLabel } from "@/components/ui/section-label";
import { transactions } from "@/lib/mock-data";
import { BankKpiCards } from "@/components/bank/kpi-cards";
import { BankFilterBar } from "@/components/bank/filter-bar";
import { BankTransactionTable } from "@/components/bank/transaction-table";

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

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <SectionLabel>Banking & Flows</SectionLabel>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Treasury Operations
        </h1>
      </div>

      {/* KPI Row */}
      <BankKpiCards
        totalDeposits={totalDeposits}
        totalWithdrawals={totalWithdrawals}
        netFlow={netFlow}
        depositCount={bankTransactions.filter((tx) => tx.type === "deposit").length}
        withdrawalCount={bankTransactions.filter((tx) => tx.type === "withdrawal").length}
      />

      {/* Filter + Table */}
      <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
        <BankFilterBar
          filter={filter}
          onFilterChange={(f) => { setFilter(f); }}
          search={search}
          onSearchChange={(s) => { setSearch(s); }}
        />
        <BankTransactionTable transactions={filtered} />
      </div>
    </PageTransition>
  );
}
