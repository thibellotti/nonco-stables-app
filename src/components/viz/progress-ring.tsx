interface ProgressRingProps {
  value: number; // 0-100
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ProgressRing({
  value,
  color,
  size = 56,
  strokeWidth = 5,
  label,
  sublabel,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (value / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className ?? ""}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {/* Track — visible even at 0% */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={-2}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Center percentage */}
        <text
          x={size / 2}
          y={size / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={size * 0.22}
          fontWeight="700"
          fontFamily="var(--font-mono)"
        >
          {value}%
        </text>
      </svg>
      {label && (
        <span className="text-[10px] font-bold text-[var(--text-3)]">{label}</span>
      )}
      {sublabel && (
        <span className="text-[9px] text-[var(--text-4)]">{sublabel}</span>
      )}
    </div>
  );
}
