"use client";

import { useId } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  showArea?: boolean;
  strokeWidth?: number;
  className?: string;
}

// Fixed internal viewBox
const VB_W = 100;
const VB_H = 40;

export function Sparkline({
  data,
  // Default to the primary text token so the line auto-adapts to light/dark
  // mode. Callers can still override with brand colors.
  color = "var(--text-2)",
  showArea = true,
  strokeWidth = 1.5,
  className,
}: SparklineProps) {
  const id = useId();

  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Map data to viewBox coordinates — straight line segments
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * VB_W;
    const y = VB_H - ((v - min) / range) * (VB_H - 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = points.join(" ");
  const areaPath = `M${points[0]} ${points.slice(1).map((p) => `L${p}`).join(" ")} L${VB_W},${VB_H} L0,${VB_H} Z`;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      {showArea && (
        <defs>
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}

      {showArea && <path d={areaPath} fill={`url(#${id}-area)`} />}

      <polyline
        points={polyline}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
