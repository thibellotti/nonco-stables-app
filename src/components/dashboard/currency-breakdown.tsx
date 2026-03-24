import { balances } from "@/lib/mock-data";
import { formatCompact, cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { currencyColors } from "@/lib/currency-colors";

const totalAvailable = balances.reduce((sum, b) => sum + b.available, 0);

// Donut chart constants
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~439.82
const GAP = 2; // 2px visual gap between segments

function DonutChart() {
  let offset = 0;

  return (
    <div className="hidden lg:flex flex-col items-center justify-center">
      <svg viewBox="0 0 160 160" width="160" height="160" className="shrink-0">
        {balances.map((balance) => {
          const colors = currencyColors[balance.currency] ?? {
            bg: "rgba(255,255,255,0.04)",
            text: "#808080",
            border: "#808080",
          };
          const pct = totalAvailable > 0 ? balance.available / totalAvailable : 0;
          const dashLength = Math.max(0, CIRCUMFERENCE * pct - GAP);
          const dashOffset = -offset;
          offset += CIRCUMFERENCE * pct;

          return (
            <circle
              key={balance.currency}
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke={colors.border}
              strokeWidth="12"
              strokeDasharray={`${dashLength} ${CIRCUMFERENCE - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          );
        })}

        {/* Center total */}
        <text
          x="80"
          y="76"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white font-mono text-[14px] font-bold"
        >
          {formatCompact(totalAvailable, "$")}
        </text>
        <text
          x="80"
          y="94"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-[var(--text-4)] text-[10px] uppercase tracking-[0.08em]"
        >
          TOTAL
        </text>
      </svg>
    </div>
  );
}

export function CurrencyBreakdown() {
  return (
    <section>
      <SectionLabel className="mb-4">Balances</SectionLabel>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 items-start">
        {/* Donut — hidden on mobile */}
        <DonutChart />

        {/* Currency cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {balances.map((balance) => {
            const colors = currencyColors[balance.currency] ?? {
              bg: "rgba(255,255,255,0.04)",
              text: "#808080",
              border: "#808080",
            };
            const pct = totalAvailable > 0 ? (balance.available / totalAvailable) * 100 : 0;

            return (
              <div
                key={balance.currency}
                className={cn(
                  "bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5",
                  "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "cursor-default group hover:border-[var(--border-outline)] hover:scale-[1.02]"
                )}
              >
                {/* Top: colored dot + currency symbol */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: colors.border }}
                  />
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--text-3)]">
                    {balance.currency}
                  </span>
                </div>

                {/* Middle: amount */}
                <p className="font-mono text-lg font-bold tracking-tight text-white leading-none tabular-nums">
                  {formatCompact(balance.available, balance.symbol)}
                </p>

                {/* Bottom: thin progress bar */}
                <div className="mt-4 h-1 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colors.border,
                      opacity: 0.5,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
