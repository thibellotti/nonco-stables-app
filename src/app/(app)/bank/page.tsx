"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
// Pagination
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Transaction icons
// ---------------------------------------------------------------------------

const iconColors: Record<string, string> = {
  deposit: "var(--cyan)",
  withdrawal: "#e1b6ff",
};

const iconBgColors: Record<string, string> = {
  deposit: "rgba(5,224,248,0.1)",
  withdrawal: "rgba(225,182,255,0.1)",
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

const currencyPillColors: Record<string, { bg: string; text: string }> = {
  USD: { bg: "rgba(5,224,248,0.1)", text: "var(--cyan)" },
  EUR: { bg: "rgba(56,189,248,0.1)", text: "#38bdf8" },
  MXN: { bg: "rgba(199,255,16,0.1)", text: "#c7ff10" },
  USDT: { bg: "rgba(161,36,248,0.1)", text: "#a124f8" },
  USDC: { bg: "rgba(99,102,241,0.1)", text: "#6366f1" },
};

// ---------------------------------------------------------------------------
// Transaction row — table layout
// ---------------------------------------------------------------------------

function TransactionRow({
  tx,
  index,
}: {
  tx: (typeof transactions)[number];
  index: number;
}) {
  const isPositive = tx.type === "deposit";
  const pillColor = currencyPillColors[tx.currency] ?? { bg: "rgba(255,255,255,0.04)", text: "var(--text-3)" };

  return (
    <tr className={`group cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.03)] ${index % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""}`}>
      {/* Transaction: icon + name + ref */}
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <TxIcon type={tx.type} />
          <div className="min-w-0">
            <p className="text-sm text-white font-medium truncate">{tx.description}</p>
            <p className="text-[10px] text-[#525252] font-mono mt-0.5 truncate">
              REF-{tx.id.toUpperCase()}
            </p>
          </div>
        </div>
      </td>

      {/* Counterparty */}
      <td className="px-8 py-6 hidden md:table-cell">
        <span className="text-xs text-[#737373] truncate">
          {tx.counterparty ?? "—"}
        </span>
      </td>

      {/* Asset */}
      <td className="px-8 py-6 hidden sm:table-cell">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider"
          style={{ backgroundColor: pillColor.bg, color: pillColor.text }}
        >
          {tx.currency}
        </span>
      </td>

      {/* Amount */}
      <td className="px-8 py-6 text-right">
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
      <td className="px-8 py-6 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-[#525252] font-mono tabular-nums">
            {timeAgo(tx.timestamp)}
          </span>
          {tx.status === "pending" && <Badge variant="amber">Pending</Badge>}
          {tx.status === "failed" && <Badge variant="purple">Failed</Badge>}
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
// Bank page
// ---------------------------------------------------------------------------

export default function BankPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const netFlow = totalDeposits - totalWithdrawals;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="px-6 md:px-8 w-full space-y-8"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-[2px] h-4 bg-[var(--cyan)] rounded-full" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[#737373]">
            Banking &amp; Flows
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Treasury Operations
        </h1>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deposits */}
        <div className="bg-[#141414] rounded-lg p-8 border-t-2 border-[var(--cyan)] relative overflow-hidden group shadow-lg">
          <span className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)]">
            Total Deposits (30d)
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-5xl font-bold font-mono text-[var(--cyan)] tabular-nums">
              +{formatCompact(totalDeposits)}
            </p>
            <span className="px-2 py-0.5 rounded-full bg-[rgba(5,224,248,0.1)] text-[var(--cyan)] text-[10px] font-bold font-mono">
              +12.4%
            </span>
          </div>
          <p className="text-[var(--text-3)] text-xs mt-2 font-mono">
            {bankTransactions.filter((tx) => tx.type === "deposit").length} transactions
          </p>
          {/* Watermark icon */}
          <svg className="absolute -right-4 -bottom-4 w-16 h-16 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M23 6l-9.5 9.5-5-5L1 18" />
            <path d="M17 6h6v6" />
          </svg>
        </div>

        {/* Withdrawals */}
        <div className="bg-[#141414] rounded-lg p-8 border-t-2 border-[#e1b6ff] relative overflow-hidden group shadow-lg">
          <span className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)]">
            Total Withdrawals (30d)
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-5xl font-bold font-mono text-[#e1b6ff] tabular-nums">
              -{formatCompact(totalWithdrawals)}
            </p>
          </div>
          <p className="text-[var(--text-3)] text-xs mt-2 font-mono">
            {bankTransactions.filter((tx) => tx.type === "withdrawal").length} transactions
          </p>
          {/* Watermark icon */}
          <svg className="absolute -right-4 -bottom-4 w-16 h-16 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="#e1b6ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M23 18l-9.5-9.5-5 5L1 6" />
            <path d="M17 18h6v-6" />
          </svg>
        </div>

        {/* Net Flow */}
        <div className="bg-[#141414] rounded-lg p-8 border-t-2 border-[#c7ff10] relative overflow-hidden group shadow-lg">
          <span className="text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)]">
            Net Flow (30d)
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-5xl font-bold font-mono text-[#c7ff10] tabular-nums">
              {netFlow >= 0 ? "+" : ""}{formatCompact(netFlow)}
            </p>
          </div>
          <p className="text-[var(--text-3)] text-xs mt-2 font-mono">
            This month
          </p>
          {/* Watermark icon */}
          <svg className="absolute -right-4 -bottom-4 w-16 h-16 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-300" viewBox="0 0 24 24" fill="none" stroke="#c7ff10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
          </svg>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-[#141414] rounded-lg border border-[rgba(255,255,255,0.05)]">
        {/* Filter bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[rgba(255,255,255,0.05)]">
          {/* Pill toggle */}
          <div className="flex bg-black rounded-full border border-[#333] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setFilter(tab.key); setPage(1); }}
                className={cn(
                  "shrink-0 rounded-full px-6 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                  filter === tab.key
                    ? "bg-[var(--cyan)] text-black"
                    : "text-[#525252] hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-black rounded-sm pl-10 pr-4 py-2 text-xs font-mono text-white placeholder:text-[#525252] border border-[#333] focus:border-[var(--cyan)] focus:outline-none transition-colors w-64"
            />
          </div>
        </div>

        {/* Transaction table */}
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-[#525252] text-sm font-mono">
            No transactions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  <th className="px-8 py-5 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                    Transaction
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium hidden md:table-cell">
                    Counterparty
                  </th>
                  <th className="px-8 py-5 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium hidden sm:table-cell">
                    Asset
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
                    Amount
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-3)] font-medium">
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
        <div className="flex items-center justify-between px-8 py-4 border-t border-[rgba(255,255,255,0.05)]">
          <span className="text-[11px] font-mono text-[#525252]">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Transactions
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded border border-[#333] text-[#525252] hover:text-white hover:border-[#525252] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
                    : "text-[#525252] hover:text-white border border-[#333] hover:border-[#525252]"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded border border-[#333] text-[#525252] hover:text-white hover:border-[#525252] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
