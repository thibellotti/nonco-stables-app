"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DeskOffer } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

interface DeskOfferBannerProps {
  offer: DeskOffer;
  onTrade: (offer: DeskOffer) => void;
  onDismiss: (offerId: string) => void;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.max(0, Math.floor(seconds % 60));
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DeskOfferBanner({ offer, onTrade, onDismiss }: DeskOfferBannerProps) {
  // Countdown starts on mount (client-only) so SSR/hydration stays consistent.
  const [remaining, setRemaining] = useState(offer.validForSeconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const expired = remaining <= 0;
  const baseAsset = offer.pair.split("/")[0];
  // Verb mirrors the desk's action exactly per client copy spec (Apr 17/24):
  // "Trading desk offers USDT at 17.42" / "Trading desk buys USDT at 17.42".
  const verb = offer.side === "desk-offers" ? "offers" : "buys";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[var(--bg-elevated,#1e1e1e)] border border-[var(--border-outline)] rounded-lg flex items-center gap-3 pl-4 pr-2 py-2.5"
      >
        {/* Live pulse */}
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--cyan)] opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--cyan)]" />
        </span>

        {/* Message */}
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="text-[13px] font-sans text-[var(--text)]">
            Trading desk {verb}{" "}
            <span className="font-mono text-[var(--text)]">{baseAsset}</span>
            <span className="text-[var(--text-4)]"> at </span>
            <span className="font-mono text-[var(--text)] tabular-nums">
              {offer.price.toFixed(2)}
            </span>
            <span className="text-[var(--text-4)]"> — limited inventory</span>
          </span>
          <span className="text-[11px] font-sans text-[var(--text-4)] flex items-center gap-2">
            <span>
              <span className="font-mono text-[var(--text-3)]">{offer.availableLabel}</span>{" "}
              {baseAsset} available
            </span>
            <span aria-hidden="true" className="text-[var(--text-4)]/60">·</span>
            <span
              className={
                "font-mono tabular-nums " +
                (expired
                  ? "text-[var(--red)]"
                  : remaining <= 30
                    ? "text-[var(--amber)]"
                    : "text-[var(--text-3)]")
              }
              aria-live="polite"
              aria-label={expired ? "Offer expired" : `Offer expires in ${formatCountdown(remaining)}`}
            >
              {expired ? "Expired" : formatCountdown(remaining)}
            </span>
          </span>
        </div>

        {/* CTA */}
        <Button
          variant="cyan"
          size="sm"
          disabled={expired}
          onClick={() => onTrade(offer)}
          className="shrink-0"
        >
          <span className="font-sans text-[11px] uppercase tracking-[.12em]">
            Trade
          </span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h6M6 3l3 3-3 3" />
          </svg>
        </Button>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => onDismiss(offer.id)}
          aria-label="Dismiss offer"
          className="shrink-0 p-1.5 rounded text-[var(--text-4)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
