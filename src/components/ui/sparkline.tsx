"use client";

import { useId } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  showArea?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * Catmull-Rom spline interpolation for smooth SVG paths.
 */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";

  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return d;
}

// Fixed internal viewBox — the container CSS controls the actual size
const VB_W = 100;
const VB_H = 40;

export function Sparkline({
  data,
  color = "var(--cyan)",
  showArea = true,
  strokeWidth = 1.5,
  className,
}: SparklineProps) {
  const id = useId();

  if (data.length < 2) return null;

  const padTop = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * VB_W,
    y: VB_H - ((v - min) / range) * (VB_H - padTop),
  }));

  const linePath = smoothPath(points);
  const areaPath = `${linePath} L${VB_W},${VB_H} L0,${VB_H} Z`;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMaxYMax meet"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        {showArea && (
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="60%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        )}
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>

      {showArea && <path d={areaPath} fill={`url(#${id}-area)`} />}

      <path
        d={linePath}
        stroke={`url(#${id}-line)`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
