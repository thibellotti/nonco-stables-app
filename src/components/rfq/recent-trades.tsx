"use client";

import { Badge } from "@/components/ui/badge";
import { recentTrades, type RecentTrade } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";

interface RecentTradesProps {
  extraTrades?: RecentTrade[];
}

export function RecentTrades({ extraTrades = [] }: RecentTradesProps) {
  const all = [...extraTrades, ...recentTrades];

  if (all.length === 0) {
    return (
      <p className="text-sm text-[var(--text-4)] py-4">No recent trades</p>
    );
  }

  return (
    <div className="divide-y divide-[var(--border)]">
      {all.map((trade) => (
        <div
          key={trade.id}
          className="flex items-center justify-between py-3 gap-4 px-2 -mx-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[var(--bg-elevated)]"
        >
          {/* Left: pair + side badge */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-medium text-[var(--text)] whitespace-nowrap">
              {trade.pair}
            </span>
            <Badge variant={trade.side === "buy" ? "cyan" : "purple"}>
              {trade.side === "buy" ? "Buy" : "Sell"}
            </Badge>
          </div>

          {/* Center: quantity + price + settlement */}
          <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-[var(--text-3)]">
            <span className="tabular-nums">{formatMoney(trade.quantity)}</span>
            <span className="text-[var(--text-4)]">@</span>
            <span className="tabular-nums">{trade.price.toFixed(4)}</span>
            <span className="text-[var(--text-4)]">{trade.settlement}</span>
          </div>

          {/* Mobile: compact info */}
          <div className="flex sm:hidden flex-col items-end text-[11px] font-mono text-[var(--text-3)]">
            <span className="tabular-nums">@ {trade.price.toFixed(4)}</span>
            <span className="text-[var(--text-4)]">{trade.settlement}</span>
          </div>

          {/* Right: timestamp */}
          <span className="text-[11px] font-mono text-[var(--text-4)] whitespace-nowrap">
            {timeAgo(trade.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}
