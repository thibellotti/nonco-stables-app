interface DonutSegment {
  value: number;
  color: string;
  label?: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSub?: string;
  className?: string;
}

export function DonutChart({
  segments,
  size = 120,
  strokeWidth = 10,
  centerLabel,
  centerSub,
  className,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const gap = 4; // gap in degrees between segments

  let accumulated = 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-elevated)"
        strokeWidth={strokeWidth}
      />

      {/* Segments */}
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const gapPct = gap / 360;
        const segLen = Math.max(0, pct - gapPct) * circumference;
        const offset = -(accumulated * circumference) - 2;
        accumulated += pct;

        return (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segLen} ${circumference - segLen}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
      })}

      {/* Center text */}
      {centerLabel && (
        <text
          x={size / 2}
          y={centerSub ? size / 2 - 4 : size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text)"
          fontSize={size * 0.14}
          fontWeight="800"
          fontFamily="var(--font-mono)"
        >
          {centerLabel}
        </text>
      )}
      {centerSub && (
        <text
          x={size / 2}
          y={size / 2 + size * 0.1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text-4)"
          fontSize={size * 0.065}
          fontFamily="var(--font-sans)"
        >
          {centerSub}
        </text>
      )}
    </svg>
  );
}
