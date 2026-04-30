"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FixedOfferDialog } from "@/components/ui/fixed-offer-dialog";

// ---------------------------------------------------------------------------
// Banner: one-sided fixed-price desk offer (NOT an RFS stream).
// The desk publishes a take-it-or-leave-it offer; the client decides how much
// of the available inventory they want to buy. Clicking "Trade" opens the
// FixedOfferDialog with a fixed price and capped quantity.
// ---------------------------------------------------------------------------

interface DeskOfferBannerProps {
  /** Optional callback fired after the user opens the trade dialog (analytics hook). */
  onTradeClick?: () => void;
}

// Fixed offer details — currently hardcoded to match the published banner copy.
// When the desk-offer feed becomes dynamic, lift these into props.
const OFFER = {
  base: "USDT",
  quote: "MXN",
  price: 17.42,
  available: 2_000_000,
  side: "buy" as const, // Desk offers USDT → client buys USDT
  settlement: "Spot",
};

export function DeskOfferBanner({ onTradeClick }: DeskOfferBannerProps = {}) {
  const TOTAL_SECONDS = 272;

  const startTimeRef = useRef<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [countdown, setCountdown] = useState(TOTAL_SECONDS);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  function handleTradeClick() {
    onTradeClick?.();
    setDialogOpen(true);
  }

  return (
    <>
      <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-lg bg-[var(--bg-card)] border overflow-hidden ${
        countdown < 60
          ? "border-[rgba(255,255,255,0.2)] shadow-[0_0_15px_rgba(255,255,255,0.04)]"
          : "border-[var(--border)]"
      }`}>
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 40%, transparent 70%)",
            animation: "banner-shimmer 4s ease-in-out infinite",
          }}
        />

        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white" />

        {/* Pulsing dot — bigger and more visible */}
        <div className="relative ml-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-75" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 relative">
          <p className="text-sm text-[var(--text)]">
            Trading desk offers{" "}
            <span className="font-mono text-[var(--text)]">
              {OFFER.base} at {OFFER.price.toFixed(2)}
            </span>
            <span className="text-[var(--text-4)]"> — limited inventory</span>
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-xs text-[var(--text-4)]">
              <span className="font-mono">2M</span> {OFFER.base} available
            </p>
            <span className="text-[10px] text-[var(--text-4)]">&middot;</span>
            <span className="inline-flex items-center gap-1.5">
              {/* Mini countdown ring */}
              <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill="none" stroke="var(--bg-elevated)" strokeWidth="2" />
                <circle
                  cx="10" cy="10" r="8" fill="none"
                  stroke={countdown < 60 ? "var(--amber)" : "white"}
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
        <Button
          variant="cyan"
          size="sm"
          onClick={handleTradeClick}
          className={`relative shrink-0 ${countdown < 60 ? "animate-pulse" : ""}`}
        >
          Trade &rarr;
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
            aria-hidden="true"
          >
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      {/* Fixed-price offer dialog (replaces the old RFS stream flow) */}
      <FixedOfferDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        side={OFFER.side}
        base={OFFER.base}
        quote={OFFER.quote}
        price={OFFER.price}
        available={OFFER.available}
        settlement={OFFER.settlement}
      />
    </>
  );
}
