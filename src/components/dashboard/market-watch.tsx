"use client";

// ---------------------------------------------------------------------------
// MarketWatch — single horizontal row of pair cards with RFS action
// ---------------------------------------------------------------------------

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CornerBrackets } from "@/components/ui/corner-brackets";

interface MarketWatchProps {
  onRequestRfs?: (pair: string) => void;
}

const pairs = [
  { pair: "MXN/USDT", price: "17.4520", change: "+0.12%", positive: true },
  { pair: "EUR/USDT", price: "1.0835", change: "-0.04%", positive: false },
  { pair: "BRL/USDC", price: "5.1485", change: "+0.31%", positive: true },
  { pair: "GBP/USDC", price: "1.2650", change: "-0.08%", positive: false },
  { pair: "COP/USDT", price: "4118.00", change: "+0.21%", positive: true },
  { pair: "MXN/USDC", price: "17.4475", change: "+0.11%", positive: true },
];

// ---------------------------------------------------------------------------
// MarketWatch
// ---------------------------------------------------------------------------

export function MarketWatch({ onRequestRfs }: MarketWatchProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
          Market Watch
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cyan)] opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--cyan)]" />
          </span>
          <span className="font-sans text-[11px] text-[var(--text-4)] uppercase tracking-[.1em]">
            Live
          </span>
        </span>
      </div>

      {/* Pair grid — single horizontal row on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 p-4 flex-1 content-start">
        {pairs.map((p) => (
          <button
            key={p.pair}
            type="button"
            onClick={() => onRequestRfs?.(p.pair)}
            className="group relative bg-[var(--bg)] border border-[var(--border)] rounded-lg p-2.5 cursor-pointer hover:border-[var(--border-outline)] transition-all text-left"
          >
            {/* Pair name */}
            <div className="text-xs font-bold font-sans text-[var(--text)]">
              {p.pair}
            </div>

            {/* Rate */}
            <div
              className="text-sm sm:text-base font-mono font-extrabold tabular-nums mt-1 text-white"
            >
              {p.price}
            </div>

            {/* Change + RFS pill */}
            <div className="flex items-center justify-between mt-2">
              <span
                className={cn(
                  "text-[11px] font-mono tabular-nums",
                  p.positive
                    ? "text-[var(--status-positive)]"
                    : "text-[var(--status-negative)]"
                )}
              >
                {p.change}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--cyan)] text-black font-bold font-sans uppercase">
                RFS
              </span>
            </div>

            {/* Hover corner brackets — diagonal accent */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CornerBrackets size={12} color="rgba(5,224,248,0.3)" corners={["tl", "br"]} />
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-center py-3 border-t border-[var(--border)]">
        <Link
          href="/fx"
          className="font-sans text-[11px] text-white uppercase tracking-[.1em] hover:opacity-70 transition-opacity"
        >
          Full board &rarr;
        </Link>
      </div>
    </div>
  );
}
