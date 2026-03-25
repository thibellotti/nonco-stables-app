"use client";

// ---------------------------------------------------------------------------
// MarketWatch — live pair prices with mini sparklines for the dashboard sidebar
// ---------------------------------------------------------------------------

import Link from "next/link";
import { Sparkline } from "@/components/ui/sparkline";

const pairs = [
  {
    pair: "MXN/USDT",
    price: 17.452,
    change: "+0.12%",
    positive: true,
    sparkline: [4, 5, 4.5, 6, 5.5, 7, 6.8, 8],
  },
  {
    pair: "EUR/USDT",
    price: 1.0835,
    change: "-0.04%",
    positive: false,
    sparkline: [8, 7.5, 7, 7.8, 6.5, 6, 6.2, 5.5],
  },
  {
    pair: "BRL/USDC",
    price: 5.1485,
    change: "+0.31%",
    positive: true,
    sparkline: [3, 3.5, 4, 3.8, 5, 5.5, 6, 7],
  },
  {
    pair: "USD/USDT",
    price: 1.0002,
    change: "+0.00%",
    positive: true,
    sparkline: [5, 5.1, 4.9, 5, 5.1, 5, 5.05, 5.1],
  },
  {
    pair: "GBP/USDC",
    price: 1.265,
    change: "-0.08%",
    positive: false,
    sparkline: [9, 8.5, 8.8, 7.5, 7, 7.2, 6.5, 6],
  },
];

// ---------------------------------------------------------------------------
// MarketWatch
// ---------------------------------------------------------------------------

export function MarketWatch() {
  // Find best (highest positive) and worst (lowest negative) performers
  const bestIdx = pairs.reduce(
    (best, p, i) =>
      p.positive && parseFloat(p.change) > parseFloat(pairs[best].change)
        ? i
        : best,
    0
  );
  const worstIdx = pairs.reduce(
    (worst, p, i) =>
      !p.positive && parseFloat(p.change) < parseFloat(pairs[worst].change)
        ? i
        : worst,
    0
  );

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
          Market Watch
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green)]" />
          </span>
          <span className="font-sans text-[11px] text-[var(--green)] uppercase tracking-[.1em]">
            Live
          </span>
        </span>
      </div>

      {/* Pair list */}
      <ul>
        {pairs.map((p, idx) => (
          <li
            key={p.pair}
            className={[
              idx < pairs.length - 1
                ? "border-b border-[var(--border)]"
                : "",
              "border-l-2",
              idx === bestIdx
                ? "border-l-[var(--green)] bg-[rgba(199,255,16,0.03)]"
                : idx === worstIdx
                  ? "border-l-[var(--red)] bg-[rgba(239,68,68,0.03)]"
                  : "border-l-transparent",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Link
              href={`/rfq?pair=${encodeURIComponent(p.pair)}`}
              className="group flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors duration-150 hover:bg-[rgba(255,255,255,0.03)]"
            >
              {/* Pair name */}
              <span className="font-sans text-sm font-bold text-[var(--text)] whitespace-nowrap">
                {p.pair}
              </span>

              {/* Sparkline — fills middle space */}
              <div className="flex-1 h-7">
                <Sparkline
                  data={p.sparkline}
                  color={p.positive ? "var(--cyan)" : "var(--red, #ef4444)"}
                  showArea
                  strokeWidth={1.5}
                />
              </div>

              {/* Price + change */}
              <div className="text-right shrink-0">
                <div
                  className="font-mono text-sm text-white"
                  style={{ fontVariantNumeric: "tabular-nums slashed-zero" }}
                >
                  {p.price.toFixed(4)}
                </div>
                <div
                  className={`font-mono text-[11px] mt-0.5 ${
                    p.positive
                      ? "text-[var(--green)]"
                      : "text-[var(--red)]"
                  }`}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {p.change}
                </div>
              </div>

              {/* "Get Quote" slide-in on hover */}
              <span className="shrink-0 w-0 overflow-hidden opacity-0 group-hover:w-[88px] group-hover:opacity-100 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] text-[11px] font-sans text-[var(--cyan)] uppercase tracking-[.08em] whitespace-nowrap text-right">
                Get Quote &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex justify-center py-3 border-t border-[var(--border)]">
        <button
          type="button"
          className="font-sans text-[11px] text-[var(--cyan)] uppercase tracking-[.1em] hover:opacity-80 transition-opacity cursor-pointer"
        >
          View all pairs
        </button>
      </div>
    </div>
  );
}
