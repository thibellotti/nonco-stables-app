import { balances } from "@/lib/mock-data";
import { formatCompact, cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { currencyColors } from "@/lib/currency-colors";

const totalAvailable = balances.reduce((sum, b) => sum + b.available, 0);

export function CurrencyBreakdown() {
  return (
    <section>
      <SectionLabel className="mb-4">Balances</SectionLabel>

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
                {formatCompact(balance.available)}
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
    </section>
  );
}
