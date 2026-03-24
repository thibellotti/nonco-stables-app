"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";
import { type Quote, balances } from "@/lib/mock-data";
import { cn, formatMoney } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

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
        <circle
          cx={TIMER_SIZE / 2}
          cy={TIMER_SIZE / 2}
          r={TIMER_RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={TIMER_STROKE}
        />
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
  return (
    <div className="flex gap-1 p-1 bg-[var(--bg-highest)] rounded-lg w-fit">
      {SETTLEMENTS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
            active === key
              ? "bg-[var(--cyan)] text-black"
              : "bg-transparent text-[var(--text-3)] hover:text-white"
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
        <div className="w-12 h-12 mx-auto rounded-full bg-[var(--green-dim)] flex items-center justify-center">
          <svg className="w-6 h-6 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white">Trade Executed!</p>
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

  const [base, quoteCcy] = quote.instrument.pair.split("/");
  const { bid, ask } = getPrices(quote, settlement);
  const premium = forwardPremium(quote, settlement);
  const expired = isExpired || timeLeft <= 0;

  const baseColor = currencyColors[base]?.border ?? "var(--cyan)";
  const quoteColor = currencyColors[quoteCcy]?.border ?? "#6366f1";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg transition-all duration-300",
        expired
          ? "bg-[var(--bg-card)] border border-[var(--border)]"
          : "bg-[var(--bg-card)] border border-[rgba(5,224,248,0.3)] shadow-[0_0_40px_rgba(5,224,248,0.06)]"
      )}
    >
      {/* Glow effect */}
      {!expired && !flash && (
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--cyan-wash)] rounded-full blur-[100px] pointer-events-none" />
      )}

      {/* Trade flash overlay */}
      {flash && <TradeFlash side={flash} onDone={clearFlash} />}

      {/* Expired overlay */}
      {expired && !flash && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-[var(--text-3)]">Price expired</p>
            <Button variant="cyan" size="sm" onClick={onRefresh}>
              Refresh Quote
            </Button>
          </div>
        </div>
      )}

      <div className={cn("p-8 space-y-6", expired && !flash && "opacity-30 pointer-events-none")}>
        {/* Header: pair circles + name + timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Overlapping currency circles */}
            <div className="flex -space-x-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-[var(--bg-card)] flex items-center justify-center text-[10px] font-mono font-bold"
                style={{ backgroundColor: `${baseColor}20`, color: baseColor }}
              >
                {base.slice(0, 2)}
              </div>
              <div
                className="w-8 h-8 rounded-full border-2 border-[var(--bg-card)] flex items-center justify-center text-[10px] font-mono font-bold"
                style={{ backgroundColor: `${quoteColor}20`, color: quoteColor }}
              >
                {quoteCcy.slice(0, 2)}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tighter text-white">
                {base}/{quoteCcy}
              </p>
              <p className="text-[10px] text-[var(--text-3)] font-mono uppercase mt-0.5">
                Order #NC-8849-RFQ
              </p>
            </div>
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

        {/* Buy / Sell columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* BUY */}
          <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] p-6 flex flex-col items-center gap-4">
            <span className="text-[10px] font-mono uppercase tracking-[.1em] text-[var(--cyan)] font-bold">
              Buy
            </span>
            <span className="font-mono text-4xl sm:text-5xl font-bold text-white tabular-nums tracking-tight">
              {ask.toFixed(4)}
            </span>
            <button
              onClick={() => handleTrade("buy", ask)}
              disabled={expired}
              className="w-full bg-[var(--cyan)] text-black rounded-full py-3 font-bold font-mono text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy {base}
            </button>
          </div>

          {/* SELL */}
          <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] p-6 flex flex-col items-center gap-4">
            <span className="text-[10px] font-mono uppercase tracking-[.1em] text-[var(--purple)] font-bold">
              Sell
            </span>
            <span className="font-mono text-4xl sm:text-5xl font-bold text-white tabular-nums tracking-tight">
              {bid.toFixed(4)}
            </span>
            <button
              onClick={() => handleTrade("sell", bid)}
              disabled={expired}
              className="w-full border border-[var(--purple)] text-[var(--purple)] rounded-full py-3 font-bold font-mono text-sm uppercase tracking-wider hover:bg-[var(--purple-dim)] active:scale-95 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sell {base}
            </button>
          </div>
        </div>

        {/* Footer: balance + spread */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          <span className="text-[11px] font-mono text-[var(--text-4)]">
            Balance: ${formatMoney(balances.reduce((sum, b) => sum + b.available + b.pending, 0))}
          </span>
          <span className="text-[11px] font-mono text-[var(--text-4)]">
            Spread: {spread(bid, ask)}
          </span>
        </div>
      </div>
    </div>
  );
}
