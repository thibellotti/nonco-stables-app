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

export function BarChart({ bars, height = 160, className }: BarChartProps) {
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <div className={className}>
      <div className="flex items-end gap-3" style={{ height }}>
        {bars.map((bar) => {
          const pct = max > 0 ? (bar.value / max) * 100 : 0;
          const barHeight = (pct / 100) * height;
          return (
            <div key={bar.label} className="flex-1 relative" style={{ height }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t"
                style={{
                  height: barHeight,
                  backgroundColor: bar.color,
                  opacity: 0.75,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3">
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
