"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Sparkline } from "@/components/ui/sparkline";
import { balances, usdRates } from "@/lib/mock-data";
import { formatMoney, formatCompact } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Currency metadata — full names, symbols for monogram circles
// ---------------------------------------------------------------------------

const currencyMeta: Record<string, { name: string; symbol: string }> = {
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "\u20AC" },
  MXN: { name: "Mexican Peso", symbol: "MX" },
  USDT: { name: "Tether USD", symbol: "\u20AE" },
  USDC: { name: "USD Coin", symbol: "C" },
};

// ---------------------------------------------------------------------------
// Sparkline + variation data (matches dashboard currency-breakdown)
// ---------------------------------------------------------------------------

const sparklineData: Record<string, number[]> = {
  USD: [40, 41, 40.5, 42, 43, 42.5, 44, 45, 44.5, 46, 47, 48],
  EUR: [38, 37, 36.5, 37, 38, 37.5, 36, 37, 38, 37.5, 38, 37],
  MXN: [30, 32, 31, 34, 33, 35, 34, 36, 35, 37, 38, 39],
  USDT: [50, 50.1, 49.9, 50, 50.1, 50, 50.05, 50.1, 49.95, 50, 50.05, 50.1],
  USDC: [45, 45.2, 45.1, 45.3, 45.4, 45.3, 45.5, 45.6, 45.5, 45.7, 45.8, 45.9],
};

const variations: Record<string, { pct: string; positive: boolean }> = {
  USD: { pct: "+0.81%", positive: true },
  EUR: { pct: "-0.32%", positive: false },
  MXN: { pct: "+2.14%", positive: true },
  USDT: { pct: "+0.01%", positive: true },
  USDC: { pct: "-0.05%", positive: false },
};

// ---------------------------------------------------------------------------
// Wallet page — portfolio overview
// ---------------------------------------------------------------------------

import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const totalValue = balances.reduce(
    (sum, b) => sum + (b.available + b.pending) * (usdRates[b.currency] ?? 1),
    0
  );

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Total Value + Allocation — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* LEFT: Total value */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[var(--cyan)] rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
                Total Value
              </div>
              <p className="text-4xl font-mono font-bold text-white tabular-nums mt-2 tracking-tight">
                ${formatMoney(totalValue)}
              </p>
              <p className="text-sm text-[var(--text-4)] mt-2">
                {balances.length} currencies managed
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="cyan" size="sm">
                Deposit
              </Button>
              <Button variant="ghost" size="sm">
                Withdraw
              </Button>
            </div>
          </div>

          {/* Horizontal composition bar */}
          <div className="flex h-3 rounded-full overflow-hidden mt-4 gap-1">
            {balances.map((b) => {
              const usdValue =
                (b.available + b.pending) * (usdRates[b.currency] ?? 1);
              const pct = (usdValue / totalValue) * 100;
              const colors = currencyColors[b.currency];
              const color = colors?.border ?? "var(--cyan)";
              return (
                <div
                  key={b.currency}
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}80, ${color})`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT: Allocation breakdown */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] border-t-2 border-t-[var(--border-outline)] rounded-lg p-6">
          <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-4">
            Allocation
          </div>
          <div className="space-y-3">
            {balances.map((b) => {
              const usdValue =
                (b.available + b.pending) * (usdRates[b.currency] ?? 1);
              const pct = (usdValue / totalValue) * 100;
              const colors = currencyColors[b.currency];
              return (
                <div key={b.currency} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: colors?.border }}
                  />
                  <span className="text-xs font-medium text-[var(--text-3)] w-12">
                    {b.currency}
                  </span>
                  <div className="flex-1 h-2 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${colors?.border}40, ${colors?.border})`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-4)] w-10 text-right tabular-nums">
                    {pct.toFixed(0)}%
                  </span>
                  <span className="text-xs font-mono text-white w-16 text-right tabular-nums">
                    {formatCompact(usdValue)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Holdings table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
            Holdings
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">
                Currency
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                Balance
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] hidden md:table-cell w-20">
                <span className="sr-only">Trend</span>
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden sm:table-cell">
                USD Value
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden lg:table-cell">
                24h Change
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden lg:table-cell">
                Pending
              </th>
              <th className="px-6 py-3 text-[11px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b, i) => {
              const colors = currencyColors[b.currency];
              const meta = currencyMeta[b.currency];
              const variation = variations[b.currency];
              const usdValue = b.available * (usdRates[b.currency] ?? 1);
              const swapStable =
                b.currency === "EUR" || b.currency === "GBP" ? "USDC" : "USDT";

              return (
                <motion.tr
                  key={b.currency}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
                >
                  {/* Currency — colored dot + code + full name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold"
                        style={{
                          backgroundColor: `${colors?.border}15`,
                          color: colors?.border,
                          border: `1px solid ${colors?.border}30`,
                        }}
                      >
                        {meta?.symbol ?? b.currency.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[var(--text)] block leading-none">
                          {b.currency}
                        </span>
                        <span className="text-[10px] text-[var(--text-4)] block mt-0.5">
                          {meta?.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Balance in native currency */}
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-sm font-bold text-white tabular-nums">
                      {b.symbol}
                      {formatMoney(b.available)}
                    </span>
                  </td>

                  {/* Sparkline */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="w-16 h-6">
                      <Sparkline
                        data={sparklineData[b.currency] ?? []}
                        color={colors?.border ?? "var(--cyan)"}
                        strokeWidth={1.5}
                        showArea={false}
                      />
                    </div>
                  </td>

                  {/* USD Value */}
                  <td className="px-6 py-4 text-right hidden sm:table-cell">
                    <span className="font-mono text-sm text-[var(--text-3)] tabular-nums">
                      ${formatMoney(usdValue)}
                    </span>
                  </td>

                  {/* 24h Change */}
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    {variation && (
                      <span
                        className={`font-mono text-sm font-bold tabular-nums inline-flex items-center gap-1 ${
                          variation.positive
                            ? "text-[var(--green)]"
                            : "text-[var(--red)]"
                        }`}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          aria-hidden="true"
                          className={
                            variation.positive ? "" : "rotate-180"
                          }
                        >
                          <path
                            d="M5 2L8 6H2L5 2Z"
                            fill="currentColor"
                          />
                        </svg>
                        {variation.pct}
                      </span>
                    )}
                  </td>

                  {/* Pending */}
                  <td className="px-6 py-4 text-right hidden lg:table-cell">
                    {b.pending > 0 ? (
                      <span className="font-mono text-[11px] text-[var(--amber)] tabular-nums">
                        +{b.symbol}
                        {formatMoney(b.pending)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--text-4)]">
                        &mdash;
                      </span>
                    )}
                  </td>

                  {/* Swap action */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/rfq?pair=${b.currency}/${swapStable}`}
                      className="text-[11px] uppercase tracking-wider font-bold text-[var(--cyan)] hover:text-white transition-colors"
                    >
                      Swap
                    </Link>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-4)] font-sans">
            <span className="font-mono">{balances.length}</span> currencies
          </span>
          <span className="text-[11px] text-[var(--text-4)] font-sans">
            Total{" "}
            <span className="font-mono font-bold text-white">
              ${formatMoney(totalValue)}
            </span>
          </span>
        </div>
      </motion.div>
    </PageTransition>
  );
}
