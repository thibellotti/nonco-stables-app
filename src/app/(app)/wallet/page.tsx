"use client";

import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import { balances, usdRates } from "@/lib/mock-data";
import { formatMoney, formatCompact } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// ---------------------------------------------------------------------------
// Currency metadata — full names and short IDs
// ---------------------------------------------------------------------------

const currencyMeta: Record<string, { name: string; id: string }> = {
  USD: { name: "US Dollar", id: "USD-NY-01" },
  EUR: { name: "Euro", id: "EUR-FR-01" },
  MXN: { name: "Mexican Peso", id: "MXN-MX-01" },
  USDT: { name: "Tether USD", id: "USDT-ETH-01" },
  USDC: { name: "USD Coin", id: "USDC-ETH-01" },
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

      {/* Holdings cards */}
      <div>
        <div className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)] mb-3">
          Holdings
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {balances.map((b) => {
            const colors = currencyColors[b.currency];
            const meta = currencyMeta[b.currency];
            return (
              <div
                key={b.currency}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:border-[var(--border-outline)] transition-all duration-200 cursor-pointer relative overflow-hidden group"
                style={{ borderTopWidth: 2, borderTopColor: colors?.border }}
              >
                <div className="p-4 pb-14 relative z-10">
                  {/* Header: colored icon + code + variation */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-mono font-bold transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: `${colors?.border}15`,
                          color: colors?.border,
                          border: `1px solid ${colors?.border}30`,
                        }}
                      >
                        {b.currency.slice(0, 2)}
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
                    {variations[b.currency] && (
                      <span className={`text-[11px] font-mono font-bold ${variations[b.currency].positive ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                        {variations[b.currency].pct}
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <p className="text-lg font-mono font-bold text-[var(--text)] tabular-nums">
                    {b.symbol}{formatMoney(b.available)}
                  </p>
                  {b.currency !== "USD" && b.currency !== "USDT" && b.currency !== "USDC" && (
                    <p className="text-xs font-mono text-[var(--text-4)] mt-0.5 tabular-nums">
                      ~${formatCompact((b.available) * (usdRates[b.currency] ?? 1))} USD
                    </p>
                  )}

                  {/* Pending */}
                  {b.pending > 0 && (
                    <p className="text-[11px] text-[var(--amber)] font-mono mt-1.5 tabular-nums">
                      +{b.symbol}{formatMoney(b.pending)} pending
                    </p>
                  )}
                </div>

                {/* Sparkline — pinned to bottom-right corner */}
                <div className="absolute bottom-0 right-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" style={{ width: 120, height: 48 }}>
                  <Sparkline data={sparklineData[b.currency] ?? []} color={colors?.border ?? "var(--cyan)"} width={120} height={48} strokeWidth={2} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
