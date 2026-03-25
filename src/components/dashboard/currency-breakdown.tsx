import { balances } from "@/lib/mock-data";
import { formatCompact, cn } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
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

// Mini sparkline SVG — purely decorative
function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const width = 100;
  const height = 32;
  const padding = 2;

  const stepX = (width - padding * 2) / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = padding + i * stepX;
      // Invert Y: 0 at top, height at bottom; leave padding for stroke
      const y = height - padding - v * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // Closed polygon for the area fill
  const areaPoints = `${padding.toFixed(1)},${(height - padding).toFixed(1)} ${points} ${(padding + (data.length - 1) * stepX).toFixed(1)},${(height - padding).toFixed(1)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="block"
      aria-hidden="true"
    >
      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill={color}
        fillOpacity={0.08}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeOpacity={0.6}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Tiny arrow icon (6x6)
function ArrowIcon({ positive }: { positive: boolean }) {
  return (
    <svg
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {positive ? (
        <path d="M3 0.5L5.5 3.5H0.5L3 0.5Z" fill="currentColor" />
      ) : (
        <path d="M3 5.5L0.5 2.5H5.5L3 5.5Z" fill="currentColor" />
      )}
    </svg>
  );
}

export function CurrencyBreakdown() {
  return (
    <section>
      {/* Header with "View All" action */}
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Stable Assets</SectionLabel>
        <button className="text-[10px] font-mono text-[var(--cyan)] uppercase tracking-wider hover:text-white transition-colors cursor-pointer">
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

          return (
            <div
              key={balance.currency}
              className={cn(
                "bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-3 sm:p-4",
                "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "cursor-default group hover:border-[var(--border-outline)] hover:scale-[1.02]"
              )}
            >
              {/* Top: colored circle + currency code + variation badge */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-black"
                  style={{ backgroundColor: colors.border }}
                >
                  {balance.currency.slice(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-xs font-medium text-[var(--text)] leading-none">
                    {balance.currency}
                  </span>
                  <span className="font-sans text-[10px] text-[var(--text-4)] leading-tight">
                    {currencyNames[balance.currency] ?? balance.currency}
                  </span>
                </div>

                {/* Variation badge — right-aligned */}
                {variations[balance.currency] && (
                  <span
                    className="ml-auto flex items-center gap-0.5 font-mono text-[10px] font-bold"
                    style={{
                      color: variations[balance.currency].positive
                        ? "var(--green)"
                        : "var(--red)",
                    }}
                  >
                    <ArrowIcon positive={variations[balance.currency].positive} />
                    {variations[balance.currency].pct}
                  </span>
                )}
              </div>

              {/* Amount */}
              <p className="font-mono text-lg font-bold tracking-tight text-white leading-none tabular-nums">
                {formatCompact(balance.available, balance.symbol)}
              </p>

              {/* Sparkline */}
              <div className="mt-3 h-8">
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
