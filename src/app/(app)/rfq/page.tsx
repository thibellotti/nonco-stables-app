"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionLabel } from "@/components/ui/section-label";
import { FavoritesGrid } from "@/components/rfq/favorites-grid";
import { QuoteForm } from "@/components/rfq/quote-form";
import { PriceCard } from "@/components/rfq/price-card";
import { RecentTrades } from "@/components/rfq/recent-trades";
import { useToast } from "@/components/ui/toast";
import {
  type Instrument,
  type Quote,
  type RecentTrade,
  generateQuote,
} from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

export default function RFQPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);
  const [sessionTrades, setSessionTrades] = useState<RecentTrade[]>([]);
  const { toast } = useToast();

  const handleQuote = useCallback(
    (instrument: Instrument, _quantity: number) => {
      setSelectedInstrument(instrument);
      setIsLoading(true);
      setQuote(null);
      setTimeout(() => {
        const newQuote = generateQuote(instrument);
        setQuote(newQuote);
        setIsLoading(false);
      }, 600);
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    if (selectedInstrument) {
      handleQuote(selectedInstrument, 0);
    }
  }, [selectedInstrument, handleQuote]);

  const handleTrade = useCallback(
    (side: "buy" | "sell", price: number, settlement: string) => {
      if (!quote) return;
      const settlementLabel =
        settlement === "spot"
          ? "Spot"
          : settlement === "t1"
            ? "T+1"
            : settlement === "t2"
              ? "T+2"
              : "T+10";
      const trade: RecentTrade = {
        id: `session-${Date.now()}`,
        pair: quote.instrument.pair,
        side,
        quantity: 100_000,
        price,
        settlement: settlementLabel,
        timestamp: new Date(),
      };
      setSessionTrades((prev) => [trade, ...prev]);

      const sideLabel = side === "buy" ? "Buy" : "Sell";
      toast(
        `Trade executed — ${quote.instrument.pair} ${sideLabel} ${formatMoney(100_000)} @ ${price.toFixed(4)}`,
        "success",
      );
    },
    [quote, toast],
  );

  const hasActiveQuote = quote !== null || isLoading;

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-6">
      {hasActiveQuote ? (
        <>
          {/* Active quote — 2 columns: PriceCard + Favorites */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left: PriceCard + New Quote form */}
            <div className="space-y-6">
              <PriceCard
                quote={quote}
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onTrade={handleTrade}
              />
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
                <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)] mb-3 font-sans">
                  New Quote
                </div>
                <QuoteForm onQuote={handleQuote} />
              </div>
            </div>

            {/* Right: Favorites 2×2 */}
            <div className="flex flex-col">
              <div className="mb-4">
                <SectionLabel>Favorites</SectionLabel>
              </div>
              <FavoritesGrid onQuote={handleQuote} cols={2} />
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <SectionLabel>Recent Trades</SectionLabel>
            </div>
            <RecentTrades extraTrades={sessionTrades} limit={5} />
            <div className="px-6 py-3 border-t border-[var(--border)] flex justify-center">
              <Link
                href="/trades"
                className="text-xs font-sans font-medium text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors duration-200"
              >
                View all trades &rarr;
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ── Hero: RFQ Form + Favorites (2 columns) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left: Request for Quote hero panel */}
            <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 lg:p-8 flex flex-col">
              {/* Decorative background */}
              <div className="absolute inset-0 data-grid-bg opacity-50 pointer-events-none" />
              <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-[var(--cyan-wash)] blur-[100px] pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-[var(--cyan-wash)] blur-[80px] opacity-50 pointer-events-none" />

              <div className="relative flex flex-col flex-1">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Request for Quote
                  </h2>
                  <p className="text-xs text-[var(--text-4)] mt-1 font-sans">
                    Select an instrument and amount to get real-time pricing
                  </p>
                </div>

                {/* Market status */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]" />
                    </span>
                    <span className="text-[11px] uppercase tracking-[.1em] font-sans font-medium text-[var(--text-3)]">
                      Markets Open
                    </span>
                  </div>
                  <div className="w-px h-4 bg-[var(--border)]" />
                  <span className="text-[11px] font-sans text-[var(--text-4)]">
                    <span className="font-mono">8</span> pairs available
                  </span>
                  <div className="w-px h-4 bg-[var(--border)]" />
                  <span className="text-[11px] font-sans text-[var(--text-4)]">
                    Spread{" "}
                    <span className="font-mono text-[var(--text-3)]">
                      ~3bps
                    </span>
                  </span>
                </div>

                {/* Form — pushed to vertical center */}
                <div className="flex-1 flex flex-col justify-center">
                  <QuoteForm onQuote={handleQuote} />
                </div>

                {/* Footer stats */}
                <div className="flex items-center gap-6 mt-8 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <div>
                    <p className="text-[10px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">
                      Avg Fill
                    </p>
                    <p className="text-sm font-mono font-bold text-white tabular-nums mt-0.5">
                      1.2s
                    </p>
                  </div>
                  <div className="w-px h-8 bg-[var(--border)]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">
                      Settlement
                    </p>
                    <p className="text-sm font-mono font-bold text-white mt-0.5">
                      T+0 to T+10
                    </p>
                  </div>
                  <div className="w-px h-8 bg-[var(--border)]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">
                      Min Size
                    </p>
                    <p className="text-sm font-mono font-bold text-white tabular-nums mt-0.5">
                      $10K
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Favorites 2×2 */}
            <div className="flex flex-col">
              <div className="mb-4">
                <SectionLabel>Favorites</SectionLabel>
              </div>
              <FavoritesGrid onQuote={handleQuote} cols={2} />
            </div>
          </div>

          {/* ── Recent Trades ── */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <SectionLabel>Recent Trades</SectionLabel>
            </div>
            <RecentTrades extraTrades={sessionTrades} limit={5} />
            <div className="px-6 py-3 border-t border-[var(--border)] flex justify-center">
              <Link
                href="/trades"
                className="text-xs font-sans font-medium text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors duration-200"
              >
                View all trades &rarr;
              </Link>
            </div>
          </div>
        </>
      )}
    </PageTransition>
  );
}
