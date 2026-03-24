"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeskOfferBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] relative overflow-hidden">
      {/* Cyan left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--cyan)]" />

      {/* Pulsing dot */}
      <div className="relative ml-2">
        <div className="w-2 h-2 rounded-full bg-[var(--cyan)]" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-[var(--cyan)] animate-ping" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          Trading desk has{" "}
          <span className="text-[var(--cyan)] font-mono">USDT at 17.42</span> —
          limited inventory
        </p>
        <p className="text-xs text-[var(--text-4)] mt-0.5">
          5 min remaining · 2M USDT available
        </p>
      </div>

      {/* Actions */}
      <Button variant="cyan" size="sm">
        View
      </Button>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors p-1 cursor-pointer"
        aria-label="Dismiss offer"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M3 3l8 8M11 3l-8 8" />
        </svg>
      </button>
    </div>
  );
}
