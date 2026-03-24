"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { type Transaction, type TransactionType } from "@/lib/mock-data";
import { cn, formatCompact, timeAgo } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Transaction icons
// ---------------------------------------------------------------------------

const iconColors: Record<string, string> = {
  deposit: "var(--cyan)",
  withdrawal: "var(--purple)",
};

const iconBgColors: Record<string, string> = {
  deposit: "rgba(5,224,248,0.1)",
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
// Currency pill colors
// ---------------------------------------------------------------------------

// Currency pill colors derived from shared currency-colors module
const currencyPillColors: Record<string, { bg: string; text: string }> = Object.fromEntries(
  Object.entries(currencyColors).map(([k, v]) => [k, { bg: v.bg, text: v.text }])
);

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
  const pillColor = currencyPillColors[tx.currency] ?? { bg: "rgba(255,255,255,0.04)", text: "var(--text-3)" };

  return (
    <tr className={`group cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.03)] ${index % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""}`}>
      {/* Transaction: icon + name + ref */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <TxIcon type={tx.type} />
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate">{tx.description}</p>
            <p className="text-[10px] text-[var(--text-4)] font-mono mt-0.5 truncate">
              REF-{tx.id.toUpperCase()}
            </p>
          </div>
        </div>
      </td>

      {/* Counterparty */}
      <td className="px-6 py-4 hidden md:table-cell">
        <span className="text-xs text-[var(--text-3)] truncate">
          {tx.counterparty ?? "\u2014"}
        </span>
      </td>

      {/* Asset */}
      <td className="px-6 py-4 hidden sm:table-cell">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider"
          style={{ backgroundColor: pillColor.bg, color: pillColor.text }}
        >
          {tx.currency}
        </span>
      </td>

      {/* Amount */}
      <td className="px-6 py-4 text-right">
        <span
          className={cn(
            "font-mono text-sm font-bold tabular-nums",
            isPositive ? "text-[var(--cyan)]" : "text-white"
          )}
        >
          {isPositive ? "+" : "-"}
          {formatCompact(tx.amount)}
        </span>
      </td>

      {/* Time + Status */}
      <td className="px-6 py-4 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-[var(--text-4)] font-mono tabular-nums">
            {timeAgo(tx.timestamp)}
          </span>
          {tx.status === "pending" && <Badge variant="amber">Pending</Badge>}
          {tx.status === "failed" && <Badge variant="red">Failed</Badge>}
          {tx.status === "completed" && (
            <span className="font-mono text-[10px] font-medium tracking-[.04em] text-[var(--green)]">
              COMPLETED
            </span>
          )}
        </div>
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

  return (
    <>
      {/* Transaction table */}
      {paginated.length === 0 ? (
        <div className="py-16 text-center text-[var(--text-4)] text-sm font-mono">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium hidden md:table-cell">
                  Counterparty
                </th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium hidden sm:table-cell">
                  Asset
                </th>
                <th className="px-6 py-3 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer: pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border)]">
        <span className="text-[11px] font-mono text-[var(--text-4)]">
          Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, transactions.length)} of {transactions.length} Transactions
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded border border-[var(--border)] text-[var(--text-4)] hover:text-white hover:border-[var(--text-4)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "w-8 h-8 text-[10px] font-mono font-bold rounded transition-colors cursor-pointer",
                p === page
                  ? "bg-[var(--cyan)] text-black"
                  : "text-[var(--text-4)] hover:text-white border border-[var(--border)] hover:border-[var(--text-4)]"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded border border-[var(--border)] text-[var(--text-4)] hover:text-white hover:border-[var(--text-4)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
