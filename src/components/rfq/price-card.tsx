"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";
import { type Quote } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Settlement = "spot" | "t1" | "t2" | "t10";

interface PriceCardProps {
  quote: Quote | null;
  isLoading: boolean;
  onRefresh: () => void;
  onTrade?: (side: "buy" | "sell", price: number, settlement: Settlement) => void;
}

// ---------------------------------------------------------------------------
// Circular Timer SVG
// ---------------------------------------------------------------------------

const TIMER_SIZE = 36;
const TIMER_STROKE = 3;
const TIMER_RADIUS = (TIMER_SIZE - TIMER_STROKE) / 2;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

function CountdownRing({ progress, isUrgent, formatted }: { progress: number; isUrgent: boolean; formatted: string }) {
  const offset = TIMER_CIRCUMFERENCE * (1 - progress);
  const color = isUrgent ? "var(--amber)" : "var(--cyan)";

  return (
    <div className="flex items-center gap-2">
      <svg
        width={TIMER_SIZE}
        height={TIMER_SIZE}
        viewBox={`0 0 ${TIMER_SIZE} ${TIMER_SIZE}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={TIMER_RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={TIMER_STROKE}
        />
        {/* Progress */}
        <circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={TIMER_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={TIMER_STROKE}
          strokeLinecap="round"
          strokeDasharray={TIMER_CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
        />
      </svg>
      <span
        className="font-mono text-sm font-medium tabular-nums"
        style={{ color }}
      >
        {formatted}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settlement Tabs
// ---------------------------------------------------------------------------

const SETTLEMENTS: { key: Settlement; label: string }[] = [
  { key: "spot", label: "Spot" },
  { key: "t1", label: "T+1" },
  { key: "t2", label: "T+2" },
  { key: "t10", label: "T+10" },
];

function SettlementTabs({ active, onChange }: { active: Settlement; onChange: (s: Settlement) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const activeIdx = SETTLEMENTS.findIndex((s) => s.key === active);
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-tab]');
    const btn = buttons[activeIdx];
    if (btn) {
      setSliderStyle({
        transform: `translateX(${btn.offsetLeft - 4}px)`,
        width: `${btn.offsetWidth}px`,
      });
    }
  }, [active]);

  return (
    <div ref={containerRef} className="relative flex gap-0.5 p-1 bg-[var(--bg-elevated)] rounded-lg w-fit">
      {/* Sliding indicator */}
      <div
        className="absolute top-1 h-[calc(100%-8px)] bg-[var(--cyan-dim)] rounded-md transition-all duration-250"
        style={{ ...sliderStyle, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
      {SETTLEMENTS.map(({ key, label }) => (
        <button
          key={key}
          data-tab={key}
          onClick={() => onChange(key)}
          className={cn(
            "relative z-10 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 cursor-pointer",
            active === key
              ? "text-[var(--cyan)]"
              : "text-[var(--text-4)] hover:text-[var(--text-3)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPrices(quote: Quote, settlement: Settlement) {
  switch (settlement) {
    case "spot":
      return { bid: quote.spotBid, ask: quote.spotAsk };
    case "t1":
      return { bid: quote.t1Bid, ask: quote.t1Ask };
    case "t2":
      return { bid: quote.t2Bid, ask: quote.t2Ask };
    case "t10":
      return { bid: quote.t10Bid, ask: quote.t10Ask };
  }
}

function forwardPremium(quote: Quote, settlement: Settlement): string | null {
  if (settlement === "spot") return null;
  const spotMid = (quote.spotBid + quote.spotAsk) / 2;
  const { bid, ask } = getPrices(quote, settlement);
  const fwdMid = (bid + ask) / 2;
  const pct = ((fwdMid - spotMid) / spotMid) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(3)}%`;
}

function spread(bid: number, ask: number): string {
  const mid = (bid + ask) / 2;
  if (mid === 0) return "0.00%";
  return ((ask - bid) / mid * 100).toFixed(2) + "%";
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function PriceSkeleton() {
  return (
    <Card className="p-6">
      <div className="animate-pulse space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-[var(--bg-elevated)] rounded" />
          <div className="h-9 w-9 bg-[var(--bg-elevated)] rounded-full" />
        </div>
        <div className="h-8 w-40 bg-[var(--bg-elevated)] rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-[var(--bg-elevated)] rounded-lg" />
          <div className="h-28 bg-[var(--bg-elevated)] rounded-lg" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-32 bg-[var(--bg-elevated)] rounded" />
          <div className="h-3 w-20 bg-[var(--bg-elevated)] rounded" />
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Trade Executed Flash
// ---------------------------------------------------------------------------

function TradeFlash({ side, onDone }: { side: "buy" | "sell"; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--bg-card)]/95 backdrop-blur-sm">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--green)]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[var(--text)]">Trade Executed!</p>
        <p className="text-xs text-[var(--text-3)]">
          {side === "buy" ? "Buy" : "Sell"} order confirmed
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Price Card
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

  const handleTrade = useCallback(
    (side: "buy" | "sell", price: number) => {
      if (isExpired || !quote) return;
      setFlash(side);
      onTrade?.(side, price, settlement);
    },
    [isExpired, quote, settlement, onTrade]
  );

  const clearFlash = useCallback(() => setFlash(null), []);

  // ---------- Empty state ----------
  if (!quote && !isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-[var(--text-3)] text-center">
          Request a quote to see pricing
        </p>
      </Card>
    );
  }

  // ---------- Loading state ----------
  if (isLoading) {
    return <PriceSkeleton />;
  }

  // ---------- Active / Expired ----------
  if (!quote) return null;

  const [base, quoteCcy] = quote.instrument.pair.split("/");
  const { bid, ask } = getPrices(quote, settlement);
  const premium = forwardPremium(quote, settlement);
  const expired = isExpired || timeLeft <= 0;

  return (
    <Card padding={false} className={cn("relative overflow-hidden", !expired && !flash && "pulse-glow-active")}>
      {/* Trade flash overlay */}
      {flash && <TradeFlash side={flash} onDone={clearFlash} />}

      {/* Expired overlay */}
      {expired && !flash && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[var(--bg)]/80 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-[var(--text-3)]">Price expired</p>
            <Button variant="cyan" size="sm" onClick={onRefresh}>
              Refresh Quote
            </Button>
          </div>
        </div>
      )}

      <div className={cn("p-6 space-y-5", expired && !flash && "opacity-30 pointer-events-none")}>
        {/* Header: pair + timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold text-[var(--text)]">{base}</span>
            <span className="text-lg font-semibold text-[var(--text-4)]">/ {quoteCcy}</span>
          </div>
          <CountdownRing progress={progress} isUrgent={isUrgent} formatted={formatted} />
        </div>

        {/* Settlement tabs + premium */}
        <div className="flex items-center gap-3 flex-wrap">
          <SettlementTabs active={settlement} onChange={setSettlement} />
          {premium && (
            <span className="text-[11px] font-mono text-[var(--text-4)]">
              {premium} fwd
            </span>
          )}
        </div>

        {/* Buy / Sell cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* BUY — prominent */}
          <div className="bg-[var(--bg-elevated)] rounded-lg p-5 flex flex-col items-center gap-3 border border-[rgba(5,224,248,0.08)]">
            <span className="text-[10px] font-mono uppercase tracking-[.1em] text-[var(--cyan)]">
              Buy
            </span>
            <span className="font-mono text-2xl lg:text-3xl font-bold text-[var(--text)] tabular-nums">
              {ask.toFixed(4)}
            </span>
            <Button
              variant="cyan"
              size="md"
              className="w-full"
              onClick={() => handleTrade("buy", ask)}
              disabled={expired}
            >
              Buy {base}
            </Button>
          </div>

          {/* SELL — subdued */}
          <div className="bg-[var(--bg-elevated)] rounded-lg p-5 flex flex-col items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[.1em] text-[var(--text-4)]">
              Sell
            </span>
            <span className="font-mono text-2xl font-bold text-[var(--text)] tabular-nums">
              {bid.toFixed(4)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => handleTrade("sell", bid)}
              disabled={expired}
            >
              Sell {base}
            </Button>
          </div>
        </div>

        {/* Footer: balance + spread */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-4)]">
            Balance: $1,100,000
          </span>
          <span className="text-[11px] font-mono text-[var(--text-4)]">
            Spread: {spread(bid, ask)}
          </span>
        </div>
      </div>
    </Card>
  );
}
