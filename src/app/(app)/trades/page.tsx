"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { TabGroup } from "@/components/ui/tab-group";
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

function SortArrow({ dir }: { dir: "asc" | "desc" }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="opacity-60" aria-hidden="true">
      {dir === "asc" ? (
        <path d="M5 2L8.5 7H1.5L5 2Z" />
      ) : (
        <path d="M5 8L1.5 3H8.5L5 8Z" />
      )}
    </svg>
  );
}

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

// ---------------------------------------------------------------------------
// Date grouping helpers
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

function groupTradesByDate(
  trades: RecentTrade[]
): { label: string; items: RecentTrade[] }[] {
  const groupOrder = ["Today", "Yesterday", "This Week", "Earlier"];
  const groups: Record<string, RecentTrade[]> = {};

  for (const trade of trades) {
    const label = getDateGroup(trade.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(trade);
  }

  return groupOrder
    .filter((label) => groups[label]?.length)
    .map((label) => ({ label, items: groups[label] }));
}

type SortKey = "pair" | "quantity" | "price" | "timestamp";
type SortDir = "asc" | "desc";

export default function TradesPage() {
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [settlementFilter, setSettlementFilter] = useState<SettlementFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filteredTrades = allTrades
    .filter((trade) => {
      if (sideFilter !== "all" && trade.side !== sideFilter) return false;
      if (settlementFilter !== "all" && trade.settlement !== settlementFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "pair": return dir * a.pair.localeCompare(b.pair);
        case "quantity": return dir * (a.quantity - b.quantity);
        case "price": return dir * (a.price - b.price);
        case "timestamp": return dir * (a.timestamp.getTime() - b.timestamp.getTime());
        default: return 0;
      }
    });

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Analytics: Volume by Pair + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume by Pair */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] mb-4">
            Volume by Pair
          </div>
          <div className="space-y-3">
            {sortedPairs.map(([pair, volume], index) => {
              const pct = (volume / totalVolume) * 100;
              const barPct = (volume / maxVolume) * 100;
              // Cyan at decreasing opacity: 100%, 75%, 50%, 30%, 15%
              const opacityHex = ["ff", "bf", "80", "4d", "26"][index] ?? "26";
              return (
                <div key={pair} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white w-20 shrink-0">{pair}</span>
                  <div className="flex-1 h-3.5 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${barPct}%`,
                        background: `linear-gradient(90deg, #05E0F850, #05E0F8${opacityHex})`,
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
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 space-y-4">
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">Summary</div>

          <div>
            <p className="text-3xl font-mono font-bold text-white tabular-nums">
              {formatCompactVolume(totalVolume)}
            </p>
            <p className="text-xs text-[var(--text-4)] font-sans">total volume</p>
          </div>

          <div>
            <p className="text-lg font-mono font-medium text-[var(--text-3)] tabular-nums">{totalTrades}</p>
            <p className="text-xs text-[var(--text-4)] font-sans">total trades</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${buyPct}%`,
                  background: "linear-gradient(90deg, rgba(34,197,94,0.25), rgba(34,197,94,0.8))",
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
        <TabGroup
          tabs={[
            { value: "all", label: "All" },
            { value: "buy", label: "Buy" },
            { value: "sell", label: "Sell" },
          ]}
          active={sideFilter}
          onChange={setSideFilter}
        />

        {/* Settlement filter */}
        <TabGroup
          tabs={[
            { value: "all", label: "All" },
            { value: "Spot", label: "Spot" },
            { value: "T+1", label: "T+1" },
            { value: "T+2", label: "T+2" },
          ]}
          active={settlementFilter}
          onChange={setSettlementFilter}
        />

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
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden overflow-x-auto table-scroll-mask">
        {filteredTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 7.5h12M16 7.5l-3-3M4 12.5h12M4 12.5l3 3" stroke="var(--text-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--text-3)] mb-1">No trades match filters</p>
            <p className="text-xs text-[var(--text-4)]">Try adjusting the side or settlement filters</p>
          </div>
        ) : (
        <>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th onClick={() => toggleSort("pair")} className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-3)] cursor-pointer hover:text-[var(--text)] transition-colors select-none">
                <span className="inline-flex items-center gap-1">Pair {sortKey === "pair" && <SortArrow dir={sortDir} />}</span>
              </th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-3)]">Side</th>
              <th onClick={() => toggleSort("quantity")} className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-3)] text-right cursor-pointer hover:text-[var(--text)] transition-colors select-none">
                <span className="inline-flex items-center gap-1 justify-end">Quantity {sortKey === "quantity" && <SortArrow dir={sortDir} />}</span>
              </th>
              <th onClick={() => toggleSort("price")} className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-3)] text-right cursor-pointer hover:text-[var(--text)] transition-colors select-none">
                <span className="inline-flex items-center gap-1 justify-end">Price {sortKey === "price" && <SortArrow dir={sortDir} />}</span>
              </th>
              <th className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-3)] hidden sm:table-cell">Settlement</th>
              <th onClick={() => toggleSort("timestamp")} className="px-3 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-3)] text-right hidden sm:table-cell cursor-pointer hover:text-[var(--text)] transition-colors select-none">
                <span className="inline-flex items-center gap-1 justify-end">Date {sortKey === "timestamp" && <SortArrow dir={sortDir} />}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const groups = groupTradesByDate(filteredTrades);
              let globalIndex = 0;

              return groups.map((group) => {
                const rows = group.items.map((trade) => {
                  const idx = globalIndex++;
                  return (
                    <motion.tr
                      key={trade.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
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
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold font-sans uppercase tracking-[.1em] bg-[var(--buy-dim)] text-[var(--buy)]">
                            Buy
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold font-sans uppercase tracking-[.1em] bg-[var(--sell-dim)] text-[var(--sell)]">
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
                    </motion.tr>
                  );
                });

                return [
                  <tr key={`group-${group.label}`}>
                    <td
                      colSpan={6}
                      className="text-[10px] uppercase tracking-[.15em] text-[var(--text-4)] bg-[rgba(255,255,255,0.02)] px-6 py-1.5 font-sans font-medium"
                    >
                      {group.label}
                    </td>
                  </tr>,
                  ...rows,
                ];
              });
            })()}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border)]">
          <span className="text-[11px] text-[var(--text-4)] tracking-[.1em]">
            Showing <span className="font-mono">{filteredTrades.length}</span> of <span className="font-mono">{allTrades.length}</span> trades
          </span>
        </div>
        </>
        )}
      </div>
    </PageTransition>
  );
}
