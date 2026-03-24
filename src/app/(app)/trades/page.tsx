"use client";

import { motion } from "framer-motion";
import { recentTrades } from "@/lib/mock-data";
import type { RecentTrade } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";

// Extend with additional trades for a fuller display
const extraTrades: RecentTrade[] = [
  {
    id: "trade-009",
    pair: "EUR/USDC",
    side: "buy",
    quantity: 120_000,
    price: 1.0841,
    settlement: "T+1",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: "trade-010",
    pair: "MXN/USDT",
    side: "sell",
    quantity: 250_000,
    price: 17.438,
    settlement: "Spot",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000),
  },
  {
    id: "trade-011",
    pair: "USD/USDT",
    side: "buy",
    quantity: 750_000,
    price: 1.0001,
    settlement: "Spot",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "trade-012",
    pair: "BRL/USDC",
    side: "sell",
    quantity: 180_000,
    price: 5.152,
    settlement: "T+2",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000),
  },
  {
    id: "trade-013",
    pair: "GBP/USDC",
    side: "buy",
    quantity: 95_000,
    price: 1.2652,
    settlement: "T+1",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
];

const allTrades = [...recentTrades, ...extraTrades];

// KPI calculations
const totalTrades = allTrades.length;
const totalVolume = allTrades.reduce((sum, t) => sum + t.quantity * t.price, 0);
const avgSize = totalVolume / totalTrades;

function formatCompactVolume(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export default function TradesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="px-6 md:px-8 w-full space-y-8"
    >
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-4 bg-[var(--cyan)] rounded-full" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[var(--text-3)]">
              Execution History
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Trades
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-[#141414] rounded-lg px-5 py-3 border border-[rgba(255,255,255,0.05)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-bold tracking-[.1em] text-emerald-400">
            LIVE
          </span>
          <span className="font-mono text-[10px] text-[var(--text-3)]">
            Market Status
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Trades */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141414] rounded-lg p-8 border-t-2 border-[var(--cyan)] shadow-lg"
        >
          <span className="text-[10px] tracking-[.15em] uppercase font-mono text-[var(--text-3)]">
            Total Trades
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-5xl font-mono font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
              {totalTrades}
            </p>
            <span className="flex items-center gap-1 text-xs font-mono text-[var(--cyan)]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 9V3M6 3L3 6M6 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              +12%
            </span>
          </div>
          <p className="text-[var(--text-3)] text-xs mt-2 font-mono">Last 7 days execution count</p>
        </motion.div>

        {/* Total Volume */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141414] rounded-lg p-8 border-t-2 border-[var(--cyan)] shadow-lg"
        >
          <span className="text-[10px] tracking-[.15em] uppercase font-mono text-[var(--text-3)]">
            Total Volume
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-5xl font-mono font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatCompactVolume(totalVolume)}
            </p>
            <span className="flex items-center gap-1 text-xs font-mono text-[var(--cyan)]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 9V3M6 3L3 6M6 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              +8.4%
            </span>
          </div>
          <p className="text-[var(--text-3)] text-xs mt-2 font-mono">Notional value across all pairs</p>
        </motion.div>

        {/* Average Size */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141414] rounded-lg p-8 border-t-2 border-[var(--cyan)] shadow-lg"
        >
          <span className="text-[10px] tracking-[.15em] uppercase font-mono text-[var(--text-3)]">
            Avg Trade Size
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <p className="text-5xl font-mono font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatCompactVolume(avgSize)}
            </p>
            <span className="flex items-center gap-1 text-xs font-mono text-[var(--cyan)]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 9V3M6 3L3 6M6 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              -3.1%
            </span>
          </div>
          <p className="text-[var(--text-3)] text-xs mt-2 font-mono">Per-trade notional average</p>
        </motion.div>
      </div>

      {/* Trade History Table */}
      <div className="bg-[#141414] rounded-lg overflow-hidden shadow-2xl">
        {/* Table Header Bar */}
        <div className="p-8 flex items-center justify-between bg-[var(--bg-elevated)]">
          <div className="flex items-center gap-3">
            <div className="w-[2px] h-4 bg-[var(--cyan)] rounded-full" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[var(--text-3)]">
              Trade History
            </span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] text-[var(--text-3)] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-colors duration-200 cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 1v7M6 8L3.5 5.5M6 8l2.5-2.5M1 10h10" />
            </svg>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[.1em]">Export CSV</span>
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)]">Pair</th>
              <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)]">Side</th>
              <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)] text-right">Quantity</th>
              <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)] text-right">Price</th>
              <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)] hidden sm:table-cell">Settlement</th>
              <th className="px-8 py-5 text-[10px] tracking-[.15em] uppercase font-mono font-medium text-[var(--text-3)] text-right hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {allTrades.map((trade, i) => (
              <motion.tr
                key={trade.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className={`border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150 ${
                  i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
                }`}
              >
                {/* Pair cell with monogram */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[rgba(5,224,248,0.1)] border border-[rgba(5,224,248,0.2)] flex items-center justify-center">
                      <span className="font-mono text-[10px] font-bold text-[var(--cyan)]">
                        {trade.pair.split("/")[0].slice(0, 2)}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">{trade.pair}</span>
                  </div>
                </td>

                {/* Side pill */}
                <td className="px-8 py-6">
                  {trade.side === "buy" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-[.08em] bg-[rgba(5,224,248,0.1)] text-[var(--cyan)]">
                      Buy
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-[.08em] bg-[rgba(161,36,248,0.1)] text-[var(--purple)]">
                      Sell
                    </span>
                  )}
                </td>

                {/* Quantity */}
                <td className="px-8 py-6 text-right">
                  <span className="font-mono text-sm text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatMoney(trade.quantity)}
                  </span>
                </td>

                {/* Price */}
                <td className="px-8 py-6 text-right">
                  <span className="font-mono text-sm text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {trade.price.toFixed(4)}
                  </span>
                </td>

                {/* Settlement */}
                <td className="px-8 py-6 hidden sm:table-cell">
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-[rgba(255,255,255,0.06)] text-[10px] font-mono font-medium text-[var(--text-3)]">
                    {trade.settlement}
                  </span>
                </td>

                {/* Date */}
                <td className="px-8 py-6 text-right hidden sm:table-cell">
                  <span className="font-mono text-sm text-[var(--text-3)]" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {timeAgo(trade.timestamp)}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-center p-8 border-t border-[rgba(255,255,255,0.05)]">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(255,255,255,0.1)] text-[var(--text-3)] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-colors duration-200 cursor-pointer">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[.15em]">View All Transactions</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 6h7M6.5 3L9.5 6l-3 3" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
