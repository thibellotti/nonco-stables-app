import { balances } from "@/lib/mock-data";
import { formatCompact, cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";

// Unique color per currency
const currencyColors: Record<string, { bg: string; text: string; bar: string }> = {
  USD: { bg: "rgba(34,197,94,0.08)", text: "#22c55e", bar: "#22c55e" },
  EUR: { bg: "rgba(96,165,250,0.08)", text: "#60a5fa", bar: "#60a5fa" },
  MXN: { bg: "rgba(251,146,60,0.08)", text: "#fb923c", bar: "#fb923c" },
  USDT: { bg: "rgba(5,224,248,0.08)", text: "#05E0F8", bar: "#05E0F8" },
  USDC: { bg: "rgba(168,85,247,0.08)", text: "#a855f7", bar: "#a855f7" },
};

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
            bar: "#808080",
          };
          const pct = totalAvailable > 0 ? (balance.available / totalAvailable) * 100 : 0;

          return (
            <div
              key={balance.currency}
              className={cn(
                "relative p-4 rounded-lg overflow-hidden",
                "bg-[var(--bg-card)] border border-[var(--border)]",
                "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "hover:border-[var(--border-subtle)] hover:shadow-[0_0_30px_rgba(5,224,248,0.03)]",
                "group cursor-default"
              )}
            >
              {/* Currency icon circle + code */}
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold font-mono shrink-0"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {balance.symbol}
                </div>
                <span className="text-xs font-medium text-[var(--text-3)] uppercase tracking-wider">
                  {balance.currency}
                </span>
              </div>

              {/* Amount */}
              <p className="font-mono text-lg font-bold tracking-tight text-[var(--text)] leading-none">
                {formatCompact(balance.available)}
              </p>

              {/* Subtitle */}
              <p className="text-[10px] text-[var(--text-4)] mt-1 font-mono uppercase tracking-wider">
                Available
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-[2px] w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: colors.bar,
                    opacity: 0.6,
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
