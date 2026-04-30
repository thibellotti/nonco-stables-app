"use client";

interface CornerBracketsProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
  className?: string;
  corners?: ("tl" | "tr" | "bl" | "br")[];
}

export function CornerBrackets({
  size = 16,
  strokeWidth = 1.2,
  // Default to a token so corners auto-adapt to dark/light theme.
  // Callers can still pass an explicit rgba(...) when needed.
  color = "var(--border-outline)",
  opacity = 1,
  className,
  corners = ["tl", "tr", "bl", "br"],
}: CornerBracketsProps) {
  const arm = size * 0.6; // length of each arm
  const paths: Record<string, { d: string; pos: string }> = {
    tl: { d: `M${arm} 0H0v${arm}`, pos: "top-0 left-0" },
    tr: { d: `M${size - arm} 0H${size}v${arm}`, pos: "top-0 right-0" },
    bl: { d: `M${arm} ${size}H0v-${arm}`, pos: "bottom-0 left-0" },
    br: { d: `M${size - arm} ${size}H${size}v-${arm}`, pos: "bottom-0 right-0" },
  };

  return (
    <>
      {corners.map((corner) => (
        <svg
          key={corner}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`absolute ${paths[corner].pos} pointer-events-none ${className ?? ""}`}
          style={{ opacity }}
          aria-hidden="true"
        >
          <path
            d={paths[corner].d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </>
  );
}
