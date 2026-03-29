"use client";

import { cn } from "@/lib/utils";

interface DiamondProps {
  size?: number;
  color?: string;
  filled?: boolean;
  className?: string;
}

export function Diamond({ size = 8, color = "var(--cyan)", filled = true, className }: DiamondProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {filled ? (
        <rect x="5" y="0" width="7.07" height="7.07" rx="1" transform="rotate(45 5 5)" fill={color} />
      ) : (
        <rect x="5" y="0" width="7.07" height="7.07" rx="1" transform="rotate(45 5 5)" fill="none" stroke={color} strokeWidth="1.2" />
      )}
    </svg>
  );
}
