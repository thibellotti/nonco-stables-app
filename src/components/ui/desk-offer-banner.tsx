"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export function DeskOfferBanner() {
  const TOTAL_SECONDS = 272;

  const startTimeRef = useRef<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [countdown, setCountdown] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (dismissed) return;
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    const start = startTimeRef.current;
    // Sync countdown immediately based on elapsed time
    const elapsed = Math.floor((Date.now() - start) / 1000);
    setCountdown(Math.max(0, TOTAL_SECONDS - elapsed));

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setCountdown(Math.max(0, TOTAL_SECONDS - elapsed));
    }, 1000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="relative flex items-center gap-3 px-4 py-3.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,224,248,0.06) 0%, rgba(5,224,248,0.02) 40%, transparent 70%)",
          animation: "banner-shimmer 4s ease-in-out infinite",
        }}
      />

      {/* Cyan left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--cyan)]" />

      {/* Pulsing dot — bigger and more visible */}
      <div className="relative ml-2 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--cyan)]" />
        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[var(--cyan)] animate-ping opacity-75" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 relative">
        <p className="text-sm font-medium">
          Trading desk has{" "}
          <span className="text-[var(--cyan)] font-mono font-bold">USDT at 17.42</span> —
          limited inventory
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-xs text-[var(--text-4)]">
            2M USDT available
          </p>
          <span className="text-[10px] text-[var(--text-4)]">&middot;</span>
          <span className="inline-flex items-center gap-1.5">
            {/* Mini countdown ring */}
            <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
              <circle cx="10" cy="10" r="8" fill="none" stroke="var(--bg-elevated)" strokeWidth="2" />
              <circle
                cx="10" cy="10" r="8" fill="none"
                stroke={countdown < 60 ? "var(--amber)" : "var(--cyan)"}
                strokeWidth="2"
                strokeDasharray={50.27}
                strokeDashoffset={50.27 * (1 - countdown / 272)}
                strokeLinecap="round"
                transform="rotate(-90 10 10)"
              />
            </svg>
            <span className="text-xs font-mono tabular-nums text-[var(--amber)]">
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <Button variant="cyan" size="sm" className="relative shrink-0">
        View
      </Button>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        className="relative text-[var(--text-4)] hover:text-[var(--text-3)] transition-colors p-1 cursor-pointer shrink-0"
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
