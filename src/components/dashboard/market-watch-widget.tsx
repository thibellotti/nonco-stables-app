"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { boardInstruments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// Pairs the user trades most — drives Market Watch ordering.
// In production this comes from real usage telemetry per user.
const WATCHED_PAIRS = [
  "MXN/USDT",
  "EUR/USDT",
  "BRL/USDT",
  "GBP/USDC",
  "COP/USDT",
  "MXN/USDC",
];

function formatPrice(value: number): string {
  return value > 100 ? value.toFixed(2) : value.toFixed(4);
}

interface MarketWatchWidgetProps {
  onRequestRfs: (pair: string) => void;
}

export function MarketWatchWidget({ onRequestRfs }: MarketWatchWidgetProps) {
  const items = useMemo(
    () =>
      WATCHED_PAIRS.map((pair) => boardInstruments.find((i) => i.pair === pair)).filter(
        (x): x is NonNullable<typeof x> => x !== undefined
      ),
    []
  );

  return (
    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <header className="flex items-center justify-between mb-4">
        <div>
          <SectionLabel>Market Watch</SectionLabel>
          <p className="text-[10px] font-sans text-[var(--text-4)] mt-1">
            Personalised — your most-traded pairs
          </p>
        </div>
        <Link
          href="/fx"
          className="text-[11px] font-sans text-white hover:opacity-70 transition-colors"
        >
          Full board &rarr;
        </Link>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((inst) => {
          const isPositive = inst.change24h >= 0;
          const mid = (inst.buy + inst.sell) / 2;

          return (
            <div
              key={inst.id}
              className="group relative bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md p-3 hover:border-[var(--border-outline)] transition-colors"
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="font-mono text-[11px] font-medium text-white">{inst.pair}</span>
                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",
                    isPositive ? "text-[var(--status-positive)]" : "text-[var(--red)]"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {inst.change24h.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="font-mono text-base text-white tabular-nums">
                  {formatPrice(mid)}
                </span>
                <button
                  type="button"
                  onClick={() => onRequestRfs(inst.pair)}
                  className="px-2 py-0.5 rounded text-[9px] font-sans font-medium uppercase tracking-[.1em] bg-[var(--cyan-dim)] text-[var(--cyan)] hover:bg-[rgba(5,224,248,0.2)] transition-colors cursor-pointer"
                >
                  RFS
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
