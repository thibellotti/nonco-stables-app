"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      className="p-6 lg:px-10 lg:py-8 space-y-6"
    >
      <SectionLabel>Trades</SectionLabel>

      {/* KPI Summary */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        <Card>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            Total Trades
          </span>
          <p className="font-mono text-[22px] lg:text-[24px] font-bold tracking-tight text-[var(--text)] mt-1.5">
            {totalTrades}
          </p>
          <p className="text-[var(--text-4)] text-xs mt-1">Last 7 days</p>
        </Card>
        <Card>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            Total Volume
          </span>
          <p className="font-mono text-[22px] lg:text-[24px] font-bold tracking-tight text-[var(--text)] mt-1.5">
            {formatCompactVolume(totalVolume)}
          </p>
          <p className="text-[var(--text-4)] text-xs mt-1">Notional value</p>
        </Card>
        <Card>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            Avg Size
          </span>
          <p className="font-mono text-[22px] lg:text-[24px] font-bold tracking-tight text-[var(--text)] mt-1.5">
            {formatCompactVolume(avgSize)}
          </p>
          <p className="text-[var(--text-4)] text-xs mt-1">Per trade</p>
        </Card>
      </div>

      {/* Trade History Table */}
      <Card padding={false}>
        <div className="px-5 py-3 border-b border-[var(--border)]">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
            Trade History
          </span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[1.2fr_0.7fr_1fr_1fr_0.8fr_1fr] gap-4 px-5 py-2.5 text-[var(--text-4)]">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em]">Pair</span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em]">Side</span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-right">Quantity</span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-right">Price</span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em]">Settlement</span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-right">Date</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-[var(--border)]">
          {allTrades.map((trade, i) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="grid grid-cols-[1.2fr_0.7fr_1fr_1fr_0.8fr_1fr] gap-4 px-5 py-3 items-center hover:bg-[var(--bg-elevated)] transition-colors duration-150"
            >
              <span className="font-mono text-sm font-medium text-[var(--text)]">
                {trade.pair}
              </span>
              <span>
                <Badge variant={trade.side === "buy" ? "cyan" : "purple"}>
                  {trade.side === "buy" ? "Buy" : "Sell"}
                </Badge>
              </span>
              <span className="font-mono text-sm text-[var(--text-2)] text-right">
                {formatMoney(trade.quantity)}
              </span>
              <span className="font-mono text-sm text-[var(--text-2)] text-right">
                {trade.price.toFixed(4)}
              </span>
              <span>
                <Badge variant={trade.settlement === "Spot" ? "default" : "amber"}>
                  {trade.settlement}
                </Badge>
              </span>
              <span className="font-mono text-xs text-[var(--text-3)] text-right">
                {timeAgo(trade.timestamp)}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
