"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { transactions, type TransactionType } from "@/lib/mock-data";
import { cn, formatCompact, timeAgo } from "@/lib/utils";

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
// Filter tabs
// ---------------------------------------------------------------------------

const tabs = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdrawal", label: "Withdrawals" },
] as const;

// ---------------------------------------------------------------------------
// Transaction icons (reuse dashboard pattern)
// ---------------------------------------------------------------------------

const iconColors: Record<string, string> = {
  deposit: "var(--cyan)",
  withdrawal: "var(--purple)",
};

const iconBgColors: Record<string, string> = {
  deposit: "rgba(5,224,248,0.1)",
  withdrawal: "rgba(168,85,247,0.1)",
};

function TxIcon({ type }: { type: TransactionType }) {
  const color = iconColors[type] ?? "var(--text-3)";

  if (type === "deposit") {
    return (
      <div
        className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
        style={{ backgroundColor: iconBgColors[type] }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M13 5L5 13M5 13h5.5M5 13V7.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
      style={{ backgroundColor: iconBgColors[type] }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M5 13L13 5M13 5H7.5M13 5v5.5"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transaction row
// ---------------------------------------------------------------------------

function TransactionRow({
  tx,
  isLast,
}: {
  tx: (typeof transactions)[number];
  isLast: boolean;
}) {
  const isPositive = tx.type === "deposit";

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 lg:py-3.5 px-2 -mx-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[var(--bg-elevated)]",
        !isLast && "border-b border-[var(--border-subtle)]"
      )}
    >
      {/* Left: icon + text */}
      <TxIcon type={tx.type} />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text)] truncate">{tx.description}</p>
        {tx.counterparty && (
          <p className="text-xs text-[var(--text-4)] mt-0.5 truncate">
            {tx.counterparty}
          </p>
        )}
      </div>

      {/* Middle: currency badge */}
      <Badge variant="default" className="hidden sm:inline-flex shrink-0">
        {tx.currency}
      </Badge>

      {/* Right: amount + time + status */}
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <span
          className={cn(
            "font-mono text-sm font-medium tabular-nums",
            isPositive ? "text-[var(--cyan)]" : "text-[var(--text)]"
          )}
        >
          {isPositive ? "+" : "-"}
          {formatCompact(tx.amount)}
        </span>

        <div className="flex items-center gap-1.5">
          {tx.status === "pending" && <Badge variant="amber">Pending</Badge>}
          {tx.status === "failed" && <Badge variant="purple">Failed</Badge>}
          {tx.status === "completed" && <Badge variant="green">Completed</Badge>}
          <span className="text-[10px] text-[var(--text-4)] font-mono tabular-nums">
            {timeAgo(tx.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bank page
// ---------------------------------------------------------------------------

export default function BankPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? bankTransactions
      : bankTransactions.filter((tx) => tx.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 lg:p-8 space-y-6 max-w-6xl"
    >
      <SectionLabel>Bank</SectionLabel>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        <Card>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            Total Deposits (30d)
          </span>
          <p className="font-mono text-[22px] lg:text-[24px] font-bold tracking-tight text-[var(--cyan)] mt-1.5">
            +{formatCompact(totalDeposits)}
          </p>
          <p className="text-[var(--text-4)] text-xs mt-1">
            {bankTransactions.filter((tx) => tx.type === "deposit").length} transactions
          </p>
        </Card>

        <Card>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            Total Withdrawals (30d)
          </span>
          <p className="font-mono text-[22px] lg:text-[24px] font-bold tracking-tight text-[var(--text)] mt-1.5">
            -{formatCompact(totalWithdrawals)}
          </p>
          <p className="text-[var(--text-4)] text-xs mt-1">
            {bankTransactions.filter((tx) => tx.type === "withdrawal").length} transactions
          </p>
        </Card>
      </div>

      {/* Filter tabs + transaction list */}
      <div>
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer",
                filter === tab.key
                  ? "bg-[var(--cyan-dim)] text-[var(--cyan)]"
                  : "text-[var(--text-4)] hover:text-[var(--text-3)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-4)] text-sm">
            No transactions
          </div>
        ) : (
          <div className="mt-3">
            {filtered.map((tx, i) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                isLast={i === filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
