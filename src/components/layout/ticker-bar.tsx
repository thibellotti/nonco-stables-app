"use client";

import { tickerItems } from "@/lib/mock-data";

export function TickerBar() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] h-8 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap h-full">
        {items.map((item, i) => (
          <div
            key={`${item.pair}-${i}`}
            className="flex items-center gap-2 px-4 h-full shrink-0"
          >
            <span className="text-[10px] font-sans text-[var(--text-4)]">{item.pair}</span>
            <span className="text-[11px] font-mono font-bold text-[var(--text-3)]">{item.rate}</span>
            <span
              className={`text-[10px] font-mono font-bold ${
                item.change > 0
                  ? "text-[var(--status-positive)]"
                  : item.change < 0
                    ? "text-[var(--status-negative)]"
                    : "text-[var(--text-4)]"
              }`}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
