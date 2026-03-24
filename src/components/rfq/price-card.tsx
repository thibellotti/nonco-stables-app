"use client";

import { useState, useEffect, useCallback } from "react";
import { useCountdown } from "@/hooks/use-countdown";
import { type Quote } from "@/lib/mock-data";
import { PriceCardActive, type Settlement } from "./price-card-active";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PriceCardProps {
  quote: Quote | null;
  isLoading: boolean;
  onRefresh: () => void;
  onTrade?: (side: "buy" | "sell", price: number, settlement: Settlement) => void;
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function PriceSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-8">
      <div className="animate-pulse space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-[var(--bg-highest)] rounded" />
          <div className="h-9 w-9 bg-[var(--bg-highest)] rounded-full" />
        </div>
        <div className="h-8 w-40 bg-[var(--bg-highest)] rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-[var(--bg-highest)] rounded-lg" />
          <div className="h-32 bg-[var(--bg-highest)] rounded-lg" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-32 bg-[var(--bg-highest)] rounded" />
          <div className="h-3 w-20 bg-[var(--bg-highest)] rounded" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Price Card — orchestrator
// ---------------------------------------------------------------------------

export function PriceCard({ quote, isLoading, onRefresh, onTrade }: PriceCardProps) {
  const [settlement, setSettlement] = useState<Settlement>("spot");
  const [flash, setFlash] = useState<"buy" | "sell" | null>(null);
  const { timeLeft, isExpired, isUrgent, formatted, progress, start } = useCountdown(30);

  // Start countdown when a new quote arrives
  useEffect(() => {
    if (quote) {
      setSettlement("spot");
      setFlash(null);
      start(30);
    }
  }, [quote, start]);

  const clearFlash = useCallback(() => setFlash(null), []);
  const triggerFlash = useCallback((side: "buy" | "sell") => setFlash(side), []);

  // ---------- Empty state ----------
  if (!quote && !isLoading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-[var(--text-3)] text-center">
          Request a quote to see pricing
        </p>
      </div>
    );
  }

  // ---------- Loading state ----------
  if (isLoading) {
    return <PriceSkeleton />;
  }

  // ---------- Active / Expired ----------
  if (!quote) return null;

  const expired = isExpired || timeLeft <= 0;

  return (
    <PriceCardActive
      quote={quote}
      expired={expired}
      isUrgent={isUrgent}
      formatted={formatted}
      progress={progress}
      settlement={settlement}
      onSettlementChange={setSettlement}
      onTrade={onTrade}
      onRefresh={onRefresh}
      flash={flash}
      onFlashDone={clearFlash}
      onFlash={triggerFlash}
    />
  );
}
