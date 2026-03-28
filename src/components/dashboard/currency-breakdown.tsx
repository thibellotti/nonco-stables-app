import Link from "next/link";
import { cn, formatCompact, formatMoney } from "@/lib/utils";
import { balances, usdRates } from "@/lib/mock-data";
import { SectionLabel } from "@/components/ui/section-label";
import { Sparkline } from "@/components/ui/sparkline";

// Hardcoded sparkline data (12 points each, normalized 0-1)
const sparklineData: Record<string, number[]> = {
  USD:  [0.30, 0.32, 0.35, 0.38, 0.42, 0.48, 0.52, 0.58, 0.62, 0.70, 0.78, 0.85],
  EUR:  [0.65, 0.58, 0.50, 0.42, 0.38, 0.35, 0.38, 0.44, 0.52, 0.58, 0.62, 0.60],
  MXN:  [0.25, 0.40, 0.32, 0.55, 0.45, 0.60, 0.50, 0.72, 0.58, 0.80, 0.68, 0.88],
  USDT: [0.50, 0.51, 0.50, 0.51, 0.50, 0.50, 0.51, 0.50, 0.51, 0.50, 0.51, 0.51],
  USDC: [0.40, 0.42, 0.43, 0.44, 0.46, 0.47, 0.49, 0.50, 0.52, 0.53, 0.55, 0.56],
};

// Hardcoded variation percentages per currency
const variations: Record<string, { pct: string; positive: boolean }> = {
  USD:  { pct: "+0.81%", positive: true },
  EUR:  { pct: "-0.32%", positive: false },
  MXN:  { pct: "+2.14%", positive: true },
  USDT: { pct: "+0.01%", positive: true },
  USDC: { pct: "-0.05%", positive: false },
};

// USD values for display (approximate)
const usdValues: Record<string, number> = {
  USD: 425_000,
  EUR: 196_560,
  MXN: 200_100,
  USDT: 310_000,
  USDC: 280_000,
};

// White opacity tiers for monochrome palette
const whiteTiers: Record<string, { dot: string; sparkline: string }> = {
  USD:  { dot: "rgba(255,255,255,1)",    sparkline: "rgba(255,255,255,0.4)"  },
  EUR:  { dot: "rgba(255,255,255,0.7)",  sparkline: "rgba(255,255,255,0.3)" },
  MXN:  { dot: "rgba(255,255,255,0.5)",  sparkline: "rgba(255,255,255,0.25)" },
  USDT: { dot: "rgba(255,255,255,0.35)", sparkline: "rgba(255,255,255,0.2)"  },
  USDC: { dot: "rgba(255,255,255,0.25)", sparkline: "rgba(255,255,255,0.15)"  },
};

export function CurrencyBreakdown() {
  return (
    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)]">
        <SectionLabel>Stable Assets</SectionLabel>
        <Link
          href="/wallet"
          className="font-sans text-[11px] text-white uppercase tracking-[.1em] hover:opacity-70 transition-opacity"
        >
          View wallet &rarr;
        </Link>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[1fr_140px_140px_100px_96px] gap-4 px-6 py-3 text-[11px] font-sans uppercase tracking-[.12em] text-[var(--text-4)] border-b border-[var(--border)]">
        <span>Currency</span>
        <span className="text-right">Balance</span>
        <span className="text-right">USD Value</span>
        <span className="text-right">24h</span>
        <span className="text-right">Trend</span>
      </div>

      {/* Table rows */}
      <div>
        {balances.map((balance, idx) => {
          const tier = whiteTiers[balance.currency] ?? whiteTiers.USD;
          const variation = variations[balance.currency];
          const usdVal = usdValues[balance.currency] ?? balance.available;

          return (
            <div
              key={balance.currency}
              className={cn(
                "grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_140px_140px_100px_96px] gap-4 items-center px-6 py-4 cursor-default",
                "hover:bg-[rgba(255,255,255,0.02)] transition-colors",
                idx < balances.length - 1 && "border-b border-[var(--border)]"
              )}
            >
              {/* Currency name + dot */}
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: tier.dot }}
                />
                <div>
                  <span className="text-sm font-semibold font-sans text-[var(--text)]">
                    {balance.currency}
                  </span>
                </div>
              </div>

              {/* Balance */}
              <span className="font-mono text-sm text-[var(--text)] text-right tabular-nums hidden sm:block">
                {formatCompact(balance.available, balance.symbol)}
              </span>

              {/* USD Value */}
              <span className="font-mono text-sm text-[var(--text-3)] text-right tabular-nums hidden sm:block">
                ${formatMoney(usdVal)}
              </span>

              {/* 24h Change */}
              {variation && (
                <div className="items-center justify-end gap-1 hidden sm:flex">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                    className={variation.positive ? "" : "rotate-180"}
                  >
                    <path
                      d="M5 8V2M5 2L2.5 4.5M5 2l2.5 2.5"
                      stroke={variation.positive ? "var(--status-positive)" : "var(--status-negative)"}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="font-mono text-xs tabular-nums"
                    style={{
                      color: variation.positive ? "var(--status-positive)" : "var(--status-negative)",
                    }}
                  >
                    {variation.pct}
                  </span>
                </div>
              )}

              {/* Sparkline — compact */}
              <div className="h-8 w-20 ml-auto hidden sm:block">
                <Sparkline
                  data={sparklineData[balance.currency] ?? sparklineData.USD}
                  color={tier.sparkline}
                  showArea={false}
                  strokeWidth={1.2}
                />
              </div>

              {/* Mobile: variation badge */}
              {variation && (
                <span
                  className="font-mono text-xs tabular-nums sm:hidden text-right"
                  style={{
                    color: variation.positive ? "var(--status-positive)" : "var(--status-negative)",
                  }}
                >
                  {variation.pct}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
