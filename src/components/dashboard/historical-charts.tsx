"use client";

import { SectionLabel } from "@/components/ui/section-label";

// ---------------------------------------------------------------------------
// Catmull-Rom spline — same approach as balance-hero.tsx
// ---------------------------------------------------------------------------

function smoothPath(
  pts: number[],
  w: number,
  h: number,
  pad = 8,
): string {
  const minY = Math.min(...pts);
  const maxY = Math.max(...pts);
  const range = maxY - minY || 1;

  const coords = pts.map((y, i) => ({
    x: (i / (pts.length - 1)) * w,
    y: h - ((y - minY) / range) * (h - pad * 2) - pad,
  }));

  let d = `M${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

// ---------------------------------------------------------------------------
// Chart 1 — Total Value 7D (Line chart with area fill)
// ---------------------------------------------------------------------------

const totalValueData = [
  5.12, 5.18, 5.15, 5.22, 5.30, 5.26, 5.34, 5.38, 5.35, 5.42, 5.48, 5.52, 5.58, 5.67,
];
const TV_W = 400;
const TV_H = 120;
const tvDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function TotalValueChart() {
  const linePath = smoothPath(totalValueData, TV_W, TV_H - 16, 6);
  const areaPath = `${linePath} L${TV_W},${TV_H - 16} L0,${TV_H - 16} Z`;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <div className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
        Total Value 7D
      </div>
      <div className="text-xl font-mono font-bold text-white mt-1">
        $5.67M
      </div>
      <div className="mt-4 h-[120px] relative">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${TV_W} ${TV_H}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="tv-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(5,224,248,0.10)" />
              <stop offset="100%" stopColor="rgba(5,224,248,0)" />
            </linearGradient>
            <linearGradient id="tv-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Subtle horizontal guides */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={(TV_H - 16) * pct}
              x2={TV_W}
              y2={(TV_H - 16) * pct}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#tv-area)" />

          {/* Smooth line */}
          <path
            d={linePath}
            stroke="url(#tv-line)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* End dot */}
          <circle
            cx={TV_W}
            cy={(() => {
              const minY = Math.min(...totalValueData);
              const maxY = Math.max(...totalValueData);
              const range = maxY - minY || 1;
              return (TV_H - 16) - ((totalValueData[totalValueData.length - 1] - minY) / range) * (TV_H - 16 - 12) - 6;
            })()}
            r="3"
            fill="var(--cyan)"
          />
        </svg>

        {/* X-axis day labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-0.5">
          {tvDays.map((day) => (
            <span
              key={day}
              className="text-[9px] font-mono text-[var(--text-4)]"
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chart 2 — Asset Allocation 90D (Stacked bar chart)
// ---------------------------------------------------------------------------

const allocationData = [
  { label: "Oct", usd: 42, eur: 22, mxn: 18, stable: 18 },
  { label: "Nov", usd: 38, eur: 25, mxn: 20, stable: 17 },
  { label: "Dec", usd: 45, eur: 20, mxn: 15, stable: 20 },
  { label: "Jan", usd: 40, eur: 24, mxn: 16, stable: 20 },
  { label: "Feb", usd: 36, eur: 26, mxn: 18, stable: 20 },
  { label: "Mar", usd: 35, eur: 28, mxn: 17, stable: 20 },
];

const barColors = [
  "var(--cyan)",   // USD
  "var(--green)",  // EUR
  "var(--purple)", // MXN
  "var(--amber)",  // Stablecoins
];

const AB_W = 400;
const AB_H = 120;
const BAR_AREA_H = AB_H - 18; // Reserve bottom for labels
const BAR_W = 36;
const BAR_GAP = (AB_W - allocationData.length * BAR_W) / (allocationData.length + 1);

function AssetAllocationChart() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <div className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
        Asset Allocation 90D
      </div>
      <div className="text-xl font-mono font-bold text-white mt-1">
        5 assets
      </div>
      <div className="mt-4 h-[120px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${AB_W} ${AB_H}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {/* Subtle horizontal guides */}
          {[0, 0.5, 1].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={BAR_AREA_H * (1 - pct)}
              x2={AB_W}
              y2={BAR_AREA_H * (1 - pct)}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {[
            { label: "100%", y: 4 },
            { label: "50%", y: BAR_AREA_H / 2 },
            { label: "0%", y: BAR_AREA_H - 2 },
          ].map(({ label, y }) => (
            <text
              key={label}
              x="2"
              y={y}
              className="fill-[var(--text-4)]"
              fontSize="8"
              fontFamily="var(--font-mono)"
              dominantBaseline="middle"
            >
              {label}
            </text>
          ))}

          {/* Stacked bars */}
          {allocationData.map((period, i) => {
            const x = BAR_GAP + i * (BAR_W + BAR_GAP) + 16;
            const segments = [period.usd, period.eur, period.mxn, period.stable];
            const total = segments.reduce((a, b) => a + b, 0);
            let yOffset = 0;

            return (
              <g key={period.label}>
                {segments.map((val, si) => {
                  const segH = (val / total) * BAR_AREA_H;
                  const segY = BAR_AREA_H - yOffset - segH;
                  yOffset += segH;
                  const isTop = si === segments.length - 1 ||
                    segments.slice(si + 1).every((v) => v === 0);

                  return (
                    <rect
                      key={si}
                      x={x}
                      y={segY}
                      width={BAR_W}
                      height={Math.max(0, segH - 1)}
                      fill={barColors[si]}
                      opacity="0.75"
                      rx={isTop ? 2 : 0}
                    />
                  );
                })}

                {/* Bar label */}
                <text
                  x={x + BAR_W / 2}
                  y={AB_H - 4}
                  textAnchor="middle"
                  className="fill-[var(--text-4)]"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                >
                  {period.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chart 3 — Volatility Comparison (Multi-line chart)
// ---------------------------------------------------------------------------

// More erratic patterns to represent volatility
const volUSDT = [
  0.08, 0.12, 0.05, 0.15, 0.09, 0.18, 0.07, 0.14, 0.10, 0.20,
  0.06, 0.16, 0.11, 0.22, 0.08, 0.13, 0.19, 0.05, 0.17, 0.10,
];
const volUSDC = [
  0.06, 0.10, 0.14, 0.07, 0.18, 0.04, 0.13, 0.20, 0.08, 0.15,
  0.11, 0.24, 0.06, 0.14, 0.09, 0.21, 0.07, 0.16, 0.12, 0.08,
];
const volEUR = [
  0.22, 0.28, 0.18, 0.35, 0.25, 0.40, 0.20, 0.32, 0.26, 0.38,
  0.19, 0.34, 0.28, 0.42, 0.22, 0.30, 0.36, 0.18, 0.33, 0.25,
];

const VC_W = 400;
const VC_H = 120;
const VC_CHART_H = VC_H - 24; // Reserve space for legend

const volLines = [
  { data: volUSDT, color: "var(--cyan)", label: "USDT" },
  { data: volUSDC, color: "var(--purple)", label: "USDC" },
  { data: volEUR, color: "var(--green)", label: "EUR" },
];

function VolatilityChart() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
      <div className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
        Volatility Comparison
      </div>
      <div className="text-xl font-mono font-bold text-white mt-1">
        Last 90 days
      </div>
      <div className="mt-4 h-[120px] relative">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VC_W} ${VC_H}`}
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          {/* Subtle horizontal guides */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={VC_CHART_H * pct}
              x2={VC_W}
              y2={VC_CHART_H * pct}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          ))}

          {/* Lines */}
          {volLines.map(({ data, color, label }) => (
            <path
              key={label}
              d={smoothPath(data, VC_W, VC_CHART_H, 6)}
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-0 left-0 flex items-center gap-4">
          {volLines.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[9px] font-mono text-[var(--text-4)]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function HistoricalCharts() {
  return (
    <section>
      <SectionLabel className="mb-4">Historical Performance Analysis</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TotalValueChart />
        <AssetAllocationChart />
        <VolatilityChart />
      </div>
    </section>
  );
}
