"use client";

import { recentTrades, type RecentTrade } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";

interface RecentTradesProps {
  extraTrades?: RecentTrade[];
  limit?: number;
}

export function RecentTrades({ extraTrades = [], limit }: RecentTradesProps) {
  const merged = [...extraTrades, ...recentTrades];
  const all = limit ? merged.slice(0, limit) : merged;

  if (all.length === 0) {
    return (
      <p className="text-sm text-[var(--text-4)] py-4 font-sans">No recent trades</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-3 sm:px-6 py-3 text-left text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium">
              Pair
            </th>
            <th className="px-3 sm:px-6 py-3 text-left text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium">
              Side
            </th>
            <th className="px-3 sm:px-6 py-3 text-right text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium hidden sm:table-cell">
              Quantity @ Price
            </th>
            <th className="px-3 sm:px-6 py-3 text-center text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium hidden md:table-cell">
              Settlement
            </th>
            <th className="px-3 sm:px-6 py-3 text-right text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] font-medium">
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
              <td className="px-3 sm:px-6 py-3 sm:py-4">
                <span className="text-xs sm:text-sm font-medium text-[var(--text)] tracking-tight">
                  {trade.pair}
                </span>
              </td>

              {/* Side badge */}
              <td className="px-3 sm:px-6 py-3 sm:py-4">
                <span
                  className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    trade.side === "buy"
                      ? "bg-[rgba(255,255,255,0.08)] text-[var(--text)]"
                      : "bg-[var(--purple-dim)] text-[var(--purple)]"
                  }`}
                >
                  {trade.side === "buy" ? "Buy" : "Sell"}
                </span>
              </td>

              {/* Quantity @ Price */}
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-right hidden sm:table-cell">
                <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">
                  {formatMoney(trade.quantity)}
                  <span className="text-[var(--text-4)] mx-1">@</span>
                  {trade.price.toFixed(4)}
                </span>
              </td>

              {/* Settlement */}
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden md:table-cell">
                <span className="text-xs font-mono text-[var(--text-4)]">
                  {trade.settlement}
                </span>
              </td>

              {/* Time */}
              <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums whitespace-nowrap">
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
