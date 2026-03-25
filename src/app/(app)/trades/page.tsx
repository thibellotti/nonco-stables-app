"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { recentTrades } from "@/lib/mock-data";
import type { RecentTrade } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Filter types
// ---------------------------------------------------------------------------

type SideFilter = "all" | "buy" | "sell";
type SettlementFilter = "all" | "Spot" | "T+1" | "T+2";

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

// ---------------------------------------------------------------------------
// Derived analytics
// ---------------------------------------------------------------------------

const totalTrades = allTrades.length;
const totalVolume = allTrades.reduce((sum, t) => sum + t.quantity * t.price, 0);
const avgSize = totalVolume / totalTrades;
const buyCount = allTrades.filter((t) => t.side === "buy").length;
const buyPct = (buyCount / totalTrades) * 100;

const volumeByPair = allTrades.reduce(
  (acc, t) => {
    const vol = t.quantity * t.price;
    acc[t.pair] = (acc[t.pair] || 0) + vol;
    return acc;
  },
  {} as Record<string, number>,
);

const sortedPairs = Object.entries(volumeByPair)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5);

const maxVolume = sortedPairs[0]?.[1] || 1;

function formatCompactVolume(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export default function TradesPage() {
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [settlementFilter, setSettlementFilter] = useState<SettlementFilter>("all");

  const filteredTrades = allTrades.filter((trade) => {
    if (sideFilter !== "all" && trade.side !== sideFilter) return false;
    if (settlementFilter !== "all" && trade.settlement !== settlementFilter) return false;
    return true;
  });

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Analytics: Volume by Pair + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Volume by Pair */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] mb-4">
            Volume by Pair
          </div>
          <div className="space-y-3">
            {sortedPairs.map(([pair, volume]) => {
              const pct = (volume / totalVolume) * 100;
              const barPct = (volume / maxVolume) * 100;
              const baseCurrency = pair.split("/")[0];
              const barColor = currencyColors[baseCurrency]?.border ?? "#05E0F8";
              return (
                <div key={pair} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white w-20 shrink-0">{pair}</span>
                  <div className="flex-1 h-2.5 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barPct}%`,
                        background: `linear-gradient(90deg, ${barColor}40, ${barColor}cc)`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-4)] w-10 text-right tabular-nums">
                    {pct.toFixed(0)}%
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-4)] w-12 text-right tabular-nums">
                    {formatCompactVolume(volume)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[var(--cyan)] rounded-lg p-5 space-y-4">
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">Summary</div>

          <div>
            <p className="text-3xl font-mono font-bold text-white tabular-nums">{totalTrades}</p>
            <p className="text-xs text-[var(--text-4)] font-sans">total trades</p>
          </div>

          <div>
            <p className="text-lg font-mono font-bold text-white tabular-nums">
              {formatCompactVolume(totalVolume)}
            </p>
            <p className="text-xs text-[var(--text-4)] font-sans">total volume</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${buyPct}%`,
                  background: "linear-gradient(90deg, rgba(5,224,248,0.25), rgba(5,224,248,0.8))",
                }}
              />
            </div>
            <span className="text-[11px] text-[var(--text-4)]">
              <span className="font-mono">{buyPct.toFixed(0)}%</span> <span className="font-sans">buy</span>
            </span>
          </div>

          <div>
            <p className="text-sm font-mono text-[var(--text-3)] tabular-nums">
              {formatCompactVolume(avgSize)}
            </p>
            <p className="text-xs text-[var(--text-4)] font-sans">avg trade size</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
        {/* Side filter */}
        <div className="flex gap-1 bg-[var(--bg-elevated)] rounded-lg p-1">
          {(["all", "buy", "sell"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSideFilter(value)}
              className={`px-4 py-1.5 rounded-md text-xs uppercase tracking-wider transition-all cursor-pointer ${
                sideFilter === value
                  ? "bg-[var(--bg-card)] text-white font-bold"
                  : "text-[var(--text-4)] hover:text-[var(--text-3)]"
              }`}
            >
              {value === "all" ? "All" : value === "buy" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>

        {/* Settlement filter */}
        <div className="flex gap-1 bg-[var(--bg-elevated)] rounded-lg p-1">
          {(["all", "Spot", "T+1", "T+2"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSettlementFilter(value)}
              className={`px-4 py-1.5 rounded-md text-xs uppercase tracking-wider transition-all cursor-pointer ${
                settlementFilter === value
                  ? "bg-[var(--bg-card)] text-white font-bold"
                  : "text-[var(--text-4)] hover:text-[var(--text-3)]"
              }`}
            >
              {value === "all" ? "All" : value}
            </button>
          ))}
        </div>

        {/* Export CSV — pushed right */}
        <Button variant="ghost" size="sm" className="sm:ml-auto">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 1v7M6 8L3.5 5.5M6 8l2.5-2.5M1 10h10" />
          </svg>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">Export CSV</span>
        </Button>
      </div>

      {/* Trade Table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)]">Pair</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)]">Side</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)] text-right">Quantity</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)] text-right">Price</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)] hidden sm:table-cell">Settlement</th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-3)] text-right hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
              >
                {/* Pair cell with monogram */}
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  {(() => {
                    const baseCurrency = trade.pair.split("/")[0];
                    const baseColor = currencyColors[baseCurrency]?.border ?? "var(--cyan)";
                    return (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${baseColor}15`, borderColor: `${baseColor}30`, borderWidth: 1 }}
                        >
                          <span className="font-mono text-[11px] font-bold" style={{ color: baseColor }}>
                            {baseCurrency.slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-mono text-xs sm:text-sm font-bold text-white">{trade.pair}</span>
                      </div>
                    );
                  })()}
                </td>

                {/* Side pill */}
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  {trade.side === "buy" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold font-sans uppercase tracking-[.08em] bg-[rgba(5,224,248,0.1)] text-[var(--cyan)]">
                      Buy
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold font-sans uppercase tracking-[.08em] bg-[rgba(161,36,248,0.1)] text-[var(--purple)]">
                      Sell
                    </span>
                  )}
                </td>

                {/* Quantity */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                  <span className="font-mono text-xs sm:text-sm text-white tabular-nums">
                    {formatMoney(trade.quantity)}
                  </span>
                </td>

                {/* Price */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                  <span className="font-mono text-xs sm:text-sm text-white tabular-nums">
                    {trade.price.toFixed(4)}
                  </span>
                </td>

                {/* Settlement */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                  <span className="inline-flex items-center px-2.5 py-1 rounded bg-[rgba(255,255,255,0.06)] text-[11px] font-mono font-medium text-[var(--text-3)]">
                    {trade.settlement}
                  </span>
                </td>

                {/* Date */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right hidden sm:table-cell">
                  <span className="font-mono text-xs sm:text-sm text-[var(--text-3)] tabular-nums">
                    {timeAgo(trade.timestamp)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-[var(--border)]">
          <span className="text-[11px] text-[var(--text-4)] tracking-[.08em]">
            <span className="font-sans">Showing</span> <span className="font-mono">{filteredTrades.length}</span> <span className="font-sans">of</span> <span className="font-mono">{allTrades.length}</span> <span className="font-sans">trades</span>
          </span>
        </div>
      </div>
    </PageTransition>
  );
}
