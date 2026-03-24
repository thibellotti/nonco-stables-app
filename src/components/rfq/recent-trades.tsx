"use client";

import { recentTrades, type RecentTrade } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";

interface RecentTradesProps {
  extraTrades?: RecentTrade[];
}

export function RecentTrades({ extraTrades = [] }: RecentTradesProps) {
  const all = [...extraTrades, ...recentTrades];

  if (all.length === 0) {
    return (
      <p className="text-sm text-[var(--text-4)] py-4 font-mono">No recent trades</p>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-outline)] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] font-medium">
              Pair
            </th>
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] font-medium">
              Side
            </th>
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] font-medium hidden sm:table-cell">
              Quantity @ Price
            </th>
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] font-medium hidden md:table-cell">
              Settlement
            </th>
            <th className="px-6 py-4 text-right text-[10px] uppercase tracking-[.15em] font-mono text-[var(--text-4)] font-medium">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {all.map((trade) => (
            <tr
              key={trade.id}
              className="hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150 cursor-pointer"
            >
              {/* Pair */}
              <td className="px-6 py-4">
                <span className="text-sm font-bold text-white tracking-tight">
                  {trade.pair}
                </span>
              </td>

              {/* Side badge */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    trade.side === "buy"
                      ? "bg-[var(--cyan-dim)] text-[var(--cyan)]"
                      : "bg-[var(--purple-dim)] text-[var(--purple)]"
                  }`}
                >
                  {trade.side === "buy" ? "Buy" : "Sell"}
                </span>
              </td>

              {/* Quantity @ Price */}
              <td className="px-6 py-4 hidden sm:table-cell">
                <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">
                  {formatMoney(trade.quantity)}
                  <span className="text-[var(--text-4)] mx-1">@</span>
                  {trade.price.toFixed(4)}
                </span>
              </td>

              {/* Settlement */}
              <td className="px-6 py-4 hidden md:table-cell">
                <span className="text-xs font-mono text-[var(--text-4)]">
                  {trade.settlement}
                </span>
              </td>

              {/* Time */}
              <td className="px-6 py-4 text-right">
                <span className="text-[10px] font-mono text-[var(--text-4)] tabular-nums whitespace-nowrap">
                  {timeAgo(trade.timestamp)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
