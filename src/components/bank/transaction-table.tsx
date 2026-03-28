"use client";

import { useState } from "react";
import { type Transaction, type TransactionType } from "@/lib/mock-data";
import { cn, formatCompact, timeAgo } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Date grouping helpers (same pattern as Trades page)
// ---------------------------------------------------------------------------

function getDateGroup(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (txDate.getTime() >= today.getTime()) return "Today";
  if (txDate.getTime() >= yesterday.getTime()) return "Yesterday";
  if (txDate.getTime() >= weekAgo.getTime()) return "This Week";
  return "Earlier";
}

function groupTransactionsByDate(
  txs: Transaction[]
): { label: string; items: Transaction[] }[] {
  const groupOrder = ["Today", "Yesterday", "This Week", "Earlier"];
  const groups: Record<string, Transaction[]> = {};

  for (const tx of txs) {
    const label = getDateGroup(tx.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  }

  return groupOrder
    .filter((label) => groups[label]?.length)
    .map((label) => ({ label, items: groups[label] }));
}

// ---------------------------------------------------------------------------
// Status dot indicators
// ---------------------------------------------------------------------------

function StatusDot({ status }: { status: Transaction["status"] }) {
  if (status === "completed") {
    return (
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--status-positive)]" />
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-pending)] opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--status-pending)]" />
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--status-negative)]" />
      </span>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Status badge (desktop — full badge with dot + text)
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: Transaction["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--status-positive)]">
        <StatusDot status="completed" />
        Completed
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--status-pending)]">
        <StatusDot status="pending" />
        Pending
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--status-negative)]">
        <StatusDot status="failed" />
        Failed
      </span>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Transaction icons
// ---------------------------------------------------------------------------

const iconColors: Record<string, string> = {
  deposit: "var(--text-3)",
  withdrawal: "var(--purple)",
};

const iconBgColors: Record<string, string> = {
  deposit: "rgba(255,255,255,0.06)",
  withdrawal: "var(--purple-dim)",
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
  index,
}: {
  tx: Transaction;
  index: number;
}) {
  const isPositive = tx.type === "deposit";
  const colors = currencyColors[tx.currency] ?? {
    bg: "rgba(255,255,255,0.04)",
    text: "var(--text-3)",
    border: "var(--text-3)",
  };

  return (
    <tr className={`group cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.03)] ${index % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""}`}>
      {/* Transaction: icon + name + ref + mobile status dot */}
      <td className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <TxIcon type={tx.type} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm text-[var(--text)] font-medium truncate">{tx.description}</p>
              {/* Mobile-only status dot — visible when Status column is hidden */}
              <span className="sm:hidden">
                <StatusDot status={tx.status} />
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-4)] font-mono mt-0.5 truncate">
              REF-{tx.id.toUpperCase()}
            </p>
          </div>
        </div>
      </td>

      {/* Counterparty */}
      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
        <span className="text-xs text-[var(--text)] truncate">
          {tx.counterparty ?? "\u2014"}
        </span>
      </td>

      {/* Asset — currency-specific colors from currencyColors */}
      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold font-mono uppercase tracking-wider"
          style={{ backgroundColor: colors.bg, color: colors.border }}
        >
          {tx.currency}
        </span>
      </td>

      {/* Amount */}
      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
        <span
          className={cn(
            "font-mono text-xs sm:text-sm font-bold tabular-nums",
            isPositive ? "text-[var(--status-positive)]" : "text-white"
          )}
        >
          {isPositive ? "+" : "-"}
          {formatCompact(tx.amount)}
        </span>
      </td>

      {/* Status — desktop only, enhanced badges */}
      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
        <StatusBadge status={tx.status} />
      </td>

      {/* Time */}
      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
        <span className="text-[11px] text-[var(--text-4)] font-mono tabular-nums">
          {timeAgo(tx.timestamp)}
        </span>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BankTransactionTableProps {
  transactions: Transaction[];
}

// ---------------------------------------------------------------------------
// Bank Transaction Table
// ---------------------------------------------------------------------------

export function BankTransactionTable({ transactions }: BankTransactionTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paginated = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Group paginated transactions by date
  const groups = groupTransactionsByDate(paginated);

  return (
    <>
      {/* Transaction table */}
      {paginated.length === 0 ? (
        <div className="py-16 text-center text-[var(--text-4)] text-sm font-sans">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium">
                  Transaction
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium hidden md:table-cell">
                  Counterparty
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium hidden sm:table-cell">
                  Asset
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium">
                  Amount
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium hidden sm:table-cell">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => {
                let groupIndex = 0;
                return [
                  <tr key={`group-${group.label}`}>
                    <td
                      colSpan={6}
                      className="text-[10px] uppercase tracking-[.15em] text-[var(--text-4)] bg-[rgba(255,255,255,0.02)] px-6 py-1.5 font-sans font-medium"
                    >
                      {group.label}
                    </td>
                  </tr>,
                  ...group.items.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} index={groupIndex++} />
                  )),
                ];
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer: pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-6 py-3 border-t border-[var(--border)]">
        <span className="text-[11px] text-[var(--text-4)]">
          <span className="font-sans">Showing</span> <span className="font-mono">{(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, transactions.length)}</span> <span className="font-sans">of</span> <span className="font-mono">{transactions.length}</span> <span className="font-sans">Transactions</span>
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-[11px] font-sans font-bold uppercase rounded border border-[var(--border)] text-[var(--text-4)] hover:text-white hover:border-[var(--text-4)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "w-8 h-8 text-[11px] font-mono font-bold rounded transition-colors cursor-pointer",
                p === page
                  ? "bg-white text-black"
                  : "text-[var(--text-4)] hover:text-white border border-[var(--border)] hover:border-[var(--text-4)]"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-[11px] font-sans font-bold uppercase rounded border border-[var(--border)] text-[var(--text-4)] hover:text-white hover:border-[var(--text-4)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
