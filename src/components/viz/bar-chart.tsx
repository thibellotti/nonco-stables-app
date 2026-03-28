"use client";

interface Bar {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  bars: Bar[];
  height?: number;
  className?: string;
}

export function BarChart({ bars, height = 100, className }: BarChartProps) {
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <div className={className}>
      <div className="flex items-end gap-2" style={{ height }}>
        {bars.map((bar) => {
          const pct = (bar.value / max) * 100;
          return (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${pct}%`,
                  background: `linear-gradient(to top, color-mix(in srgb, ${bar.color} 35%, transparent), color-mix(in srgb, ${bar.color} 10%, transparent))`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 text-center">
            <div className="text-[9px] font-bold" style={{ color: bar.color }}>
              {bar.label}
            </div>
            <div className="text-[10px] font-mono text-[var(--text-4)] mt-0.5">
              {bar.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
