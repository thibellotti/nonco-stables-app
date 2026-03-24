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
      <p className="text-sm text-[#525252] py-4 font-mono">No recent trades</p>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#333] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[rgba(255,255,255,0.05)]">
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.2em] font-mono text-[#525252] font-medium">
              Pair
            </th>
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.2em] font-mono text-[#525252] font-medium">
              Side
            </th>
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.2em] font-mono text-[#525252] font-medium hidden sm:table-cell">
              Quantity @ Price
            </th>
            <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[.2em] font-mono text-[#525252] font-medium hidden md:table-cell">
              Settlement
            </th>
            <th className="px-6 py-4 text-right text-[10px] uppercase tracking-[.2em] font-mono text-[#525252] font-medium">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
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
                      ? "bg-[rgba(5,224,248,0.1)] text-[var(--cyan)]"
                      : "bg-[rgba(225,182,255,0.1)] text-[#e1b6ff]"
                  }`}
                >
                  {trade.side === "buy" ? "Buy" : "Sell"}
                </span>
              </td>

              {/* Quantity @ Price */}
              <td className="px-6 py-4 hidden sm:table-cell">
                <span className="font-mono text-xs text-[#737373] tabular-nums">
                  {formatMoney(trade.quantity)}
                  <span className="text-[#525252] mx-1">@</span>
                  {trade.price.toFixed(4)}
                </span>
              </td>

              {/* Settlement */}
              <td className="px-6 py-4 hidden md:table-cell">
                <span className="text-xs font-mono text-[#525252]">
                  {trade.settlement}
                </span>
              </td>

              {/* Time */}
              <td className="px-6 py-4 text-right">
                <span className="text-[10px] font-mono text-[#525252] tabular-nums whitespace-nowrap">
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
