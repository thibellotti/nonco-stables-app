import { SectionLabel } from "@/components/ui/section-label";
import { balances } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

const totalBalance = balances.reduce(
  (sum, b) => sum + b.available + b.pending,
  0
);
const totalAvailable = balances.reduce((sum, b) => sum + b.available, 0);
const totalPending = balances.reduce((sum, b) => sum + b.pending, 0);

const change24h = 12_340;
const changePct = ((change24h / (totalBalance - change24h)) * 100).toFixed(2);

// 30-day area chart data — smooth uptrend
const chartPoints = [
  32, 35, 33, 38, 36, 42, 40, 45, 43, 48, 46, 50, 47, 52, 50,
  54, 52, 56, 53, 58, 55, 60, 57, 62, 59, 64, 61, 66, 63, 68,
];
const chartW = 600;
const chartH = 100;
const maxY = Math.max(...chartPoints);
const minY = Math.min(...chartPoints);
const range = maxY - minY || 1;

const linePath = chartPoints
  .map((y, i) => {
    const x = (i / (chartPoints.length - 1)) * chartW;
    const yN = chartH - ((y - minY) / range) * (chartH - 8) - 4;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${yN.toFixed(1)}`;
  })
  .join(" ");

const areaPath = `${linePath} L${chartW},${chartH} L0,${chartH} Z`;

export function BalanceHero() {
  return (
    <section className="relative">
      {/* Background radial glow */}
      <div
        className="absolute -top-20 left-1/4 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,224,248,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Main grid: Balance left, Chart right */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-end">
        {/* Left: Balance info */}
        <div>
          <SectionLabel className="mb-4">Portfolio</SectionLabel>

          {/* Total balance */}
          <p className="font-mono text-[36px] lg:text-[52px] font-bold tracking-tight leading-none text-[var(--text)]">
            ${formatMoney(totalBalance)}
          </p>

          {/* 24h change badge */}
          <div className="flex items-center gap-2.5 mt-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.12)]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 9.5V2.5M6 2.5L3 5.5M6 2.5l3 3"
                  stroke="var(--green)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[var(--green)] text-sm font-medium font-mono tabular-nums">
                +${formatMoney(change24h)}
              </span>
              <span className="text-[var(--green)] text-xs font-mono opacity-60">
                {changePct}%
              </span>
            </div>
            <span className="text-[var(--text-4)] text-xs font-mono">24h</span>
          </div>

          {/* Available / Pending mini stats */}
          <div className="flex gap-6 mt-5">
            <div>
              <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em] mb-1">
                Available
              </div>
              <div className="font-mono text-lg font-semibold text-[var(--text)]">
                ${(totalAvailable / 1_000_000).toFixed(2)}M
              </div>
            </div>
            <div className="w-px bg-[var(--border)]" />
            <div>
              <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em] mb-1">
                Pending
              </div>
              <div className="font-mono text-lg font-semibold text-[var(--amber)]">
                ${(totalPending / 1_000_000).toFixed(2)}M
              </div>
            </div>
            <div className="w-px bg-[var(--border)]" />
            <div>
              <div className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.15em] mb-1">
                Currencies
              </div>
              <div className="font-mono text-lg font-semibold text-[var(--text)]">
                {balances.length}
              </div>
            </div>
          </div>
        </div>

        {/* Right: 30-day area chart */}
        <div className="relative h-[120px] lg:h-[140px]">
          {/* Period label */}
          <div className="absolute top-0 right-0 flex gap-2">
            <span className="font-mono text-[9px] text-[var(--text-4)] uppercase tracking-[.1em] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.03)]">
              7D
            </span>
            <span className="font-mono text-[9px] text-[var(--cyan)] uppercase tracking-[.1em] px-2 py-0.5 rounded-full bg-[var(--cyan-dim)]">
              30D
            </span>
            <span className="font-mono text-[9px] text-[var(--text-4)] uppercase tracking-[.1em] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.03)]">
              90D
            </span>
          </div>

          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${chartW} ${chartH}`}
            preserveAspectRatio="none"
            fill="none"
            className="absolute inset-0"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="area-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--cyan)"
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor="var(--cyan)"
                  stopOpacity="0"
                />
              </linearGradient>
              <linearGradient
                id="line-gradient"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="var(--cyan)"
                  stopOpacity="0.3"
                />
                <stop
                  offset="100%"
                  stopColor="var(--cyan)"
                  stopOpacity="1"
                />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((pct) => (
              <line
                key={pct}
                x1="0"
                y1={chartH * pct}
                x2={chartW}
                y2={chartH * pct}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            ))}

            {/* Area fill */}
            <path d={areaPath} fill="url(#area-fill)" />

            {/* Line */}
            <path
              d={linePath}
              stroke="url(#line-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Current price dot */}
            <circle
              cx={chartW}
              cy={chartH - ((chartPoints[chartPoints.length - 1] - minY) / range) * (chartH - 8) - 4}
              r="4"
              fill="var(--cyan)"
            />
            <circle
              cx={chartW}
              cy={chartH - ((chartPoints[chartPoints.length - 1] - minY) / range) * (chartH - 8) - 4}
              r="8"
              fill="var(--cyan)"
              opacity="0.15"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
