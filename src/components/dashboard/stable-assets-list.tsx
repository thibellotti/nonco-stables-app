"use client";

import Link from "next/link";
import { Sparkline } from "@/components/ui/sparkline";
import { SectionLabel } from "@/components/ui/section-label";
import { balances, usdRates } from "@/lib/mock-data";
import { formatMoney, cn } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// Per-asset metadata: full name + 24h change + sparkline
const ASSET_META: Record<string, { name: string; issuer: string; change24h: number; trend: number[] }> = {
  USDC: {
    name: "USD Coin",
    issuer: "Ethereum",
    change24h: 0.0,
    trend: [99.98, 99.99, 100.0, 100.01, 100.0, 99.99, 100.0, 100.0],
  },
  USDT: {
    name: "Tether",
    issuer: "Tron",
    change24h: 0.01,
    trend: [99.99, 100.0, 99.99, 100.0, 100.01, 100.0, 100.0, 100.01],
  },
  EUR: {
    name: "Deutsche Bank",
    issuer: "Euro · DB",
    change24h: -0.32,
    trend: [1.085, 1.084, 1.083, 1.0825, 1.0835, 1.0832, 1.0828, 1.0825],
  },
  MXN: {
    name: "Peso · BBVA",
    issuer: "MXN",
    change24h: 3.16,
    trend: [16.9, 17.0, 17.1, 17.15, 17.3, 17.42, 17.45, 17.45],
  },
  USD: {
    name: "Citibank N.A.",
    issuer: "Fiat · USD",
    change24h: 0.01,
    trend: [1.0, 1.0, 1.0, 1.0, 1.0001, 1.0001, 1.0, 1.0001],
  },
};

export function StableAssetsList() {
  return (
    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <header className="flex items-center justify-between px-5 pt-4 pb-2.5">
        <SectionLabel>Stable Assets</SectionLabel>
        <Link
          href="/fx"
          className="text-[11px] font-sans text-[var(--text-3)] hover:text-white transition-colors"
        >
          View wallet &rarr;
        </Link>
      </header>

      <ul className="divide-y divide-[var(--border-row)]">
        {balances.map((b) => {
          const meta = ASSET_META[b.currency];
          if (!meta) return null;
          const usdValue = (b.available + b.pending) * (usdRates[b.currency] ?? 1);
          const accent = currencyColors[b.currency]?.border ?? "rgba(255,255,255,0.5)";
          const isPositive = meta.change24h >= 0;

          return (
            <li key={b.currency}>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left cursor-pointer"
              >
                {/* Currency badge */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}30` }}
                >
                  <span className="font-mono text-[10px] font-medium" style={{ color: accent }}>
                    {b.currency.slice(0, 2)}
                  </span>
                </div>

                {/* Code + issuer */}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-medium text-white">{b.currency}</div>
                  <div className="text-[10px] font-sans text-[var(--text-4)] truncate">{meta.name}</div>
                </div>

                {/* Sparkline */}
                <div className="hidden sm:block w-16 h-7 shrink-0 opacity-60">
                  <Sparkline
                    data={meta.trend}
                    color={isPositive ? "var(--status-positive)" : "var(--red)"}
                    strokeWidth={1.2}
                    showArea={false}
                  />
                </div>

                {/* Value + change */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-mono text-xs text-white tabular-nums">
                    ${formatMoney(usdValue)}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums",
                      isPositive ? "text-[var(--status-positive)]" : "text-[var(--red)]"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {meta.change24h.toFixed(2)}%
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
