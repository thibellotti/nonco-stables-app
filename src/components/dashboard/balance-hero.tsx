import { SectionLabel } from "@/components/ui/section-label";
import { balances } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

const totalBalance = balances.reduce(
  (sum, b) => sum + b.available + b.pending,
  0
);

// Hardcoded 24h change for prototype
const change24h = 12_340;
const changePct = ((change24h / (totalBalance - change24h)) * 100).toFixed(2);

// 7-day sparkline path — subtle uptrend for prototype
const sparklinePoints = [42, 38, 45, 40, 48, 44, 52, 50, 55, 53, 58, 56, 62, 60, 65];
const svgW = 200;
const svgH = 24;
const maxY = Math.max(...sparklinePoints);
const minY = Math.min(...sparklinePoints);
const range = maxY - minY || 1;

const pathD = sparklinePoints
  .map((y, i) => {
    const x = (i / (sparklinePoints.length - 1)) * svgW;
    const yNorm = svgH - ((y - minY) / range) * (svgH - 4) - 2;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${yNorm.toFixed(1)}`;
  })
  .join(" ");

// Gradient fill area (path that closes to bottom)
const areaD = `${pathD} L${svgW},${svgH} L0,${svgH} Z`;

export function BalanceHero() {
  return (
    <section className="relative">
      {/* Radial glow behind the number */}
      <div
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(5,224,248,0.06) 0%, transparent 70%)",
        }}
      />

      <SectionLabel className="mb-4">Portfolio</SectionLabel>

      {/* Total balance */}
      <p className="font-mono text-[36px] lg:text-[46px] font-bold tracking-tight leading-none text-[var(--text)] relative">
        ${formatMoney(totalBalance)}
      </p>

      {/* 24h change badge */}
      <div className="flex items-center gap-2.5 mt-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.15)]">
          {/* Green up arrow */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 9.5V2.5M6 2.5L3 5.5M6 2.5l3 3"
              stroke="#22c55e"
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

      {/* 7-day sparkline */}
      <div className="mt-4 opacity-50">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          fill="none"
          className="overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#05E0F8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#05E0F8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <path d={areaD} fill="url(#sparkline-fill)" />
          {/* Line */}
          <path
            d={pathD}
            stroke="#05E0F8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
