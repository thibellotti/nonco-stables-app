import { balances } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { Sparkline } from "@/components/ui/sparkline";
import { currencyColors } from "@/lib/currency-colors";

// Hardcoded sparkline data (12 points each, normalized 0–1)
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

// Full currency names for display
const currencyNames: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  MXN: "Mexican Peso",
  USDT: "Tether",
  USDC: "USD Coin",
};

export function CurrencyBreakdown() {
  return (
    <section>
      {/* Header with "View All" action */}
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Stable Assets</SectionLabel>
        <button className="text-[11px] font-sans text-[var(--cyan)] uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Currency cards — full-width horizontal row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {balances.map((balance) => {
          const colors = currencyColors[balance.currency] ?? {
            bg: "rgba(255,255,255,0.04)",
            text: "#808080",
            border: "#808080",
          };
          const variation = variations[balance.currency];

          return (
            <div
              key={balance.currency}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg cursor-default hover:border-[var(--border-outline)] transition-colors relative overflow-hidden"
              style={{ borderTopWidth: 2, borderTopColor: colors.border }}
            >
              <div className="p-4 pb-10 relative z-10">
                {/* Header: dot + code + variation */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: colors.border }}
                    />
                    <span className="text-sm font-bold font-sans text-[var(--text)]">
                      {balance.currency}
                    </span>
                  </div>
                  {variation && (
                    <span
                      className="font-mono text-xs font-bold"
                      style={{
                        color: variation.positive ? "var(--green)" : "var(--red)",
                      }}
                    >
                      {variation.pct}
                    </span>
                  )}
                </div>

                {/* Amount — big and bold */}
                <p className="text-2xl font-mono font-bold text-white tabular-nums tracking-tight leading-none">
                  {formatCompact(balance.available, balance.symbol)}
                </p>
                <p className="text-xs font-sans text-[var(--text-4)] mt-1">
                  {currencyNames[balance.currency]}
                </p>
              </div>

              {/* Sparkline — pinned bottom-right */}
              <div className="absolute bottom-0 right-0 w-[120px] h-[40px] pointer-events-none">
                <Sparkline
                  data={sparklineData[balance.currency] ?? sparklineData.USD}
                  color={colors.border}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
