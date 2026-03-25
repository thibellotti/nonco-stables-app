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
    []
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
        "success"
      );
    },
    [quote, toast]
  );

  const hasActiveQuote = quote !== null || isLoading;

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {hasActiveQuote ? (
        <>
          {/* Active quote — price card is the hero, centered and dominant */}
          <div className="max-w-2xl mx-auto w-full space-y-6">
            <PriceCard
              quote={quote}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onTrade={handleTrade}
            />
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5">
              <div className="text-[11px] uppercase tracking-[.15em] text-[var(--text-4)] mb-3 font-sans">New Quote</div>
              <QuoteForm onQuote={handleQuote} />
            </div>
          </div>

          <SectionLabel>Recent Trades</SectionLabel>
          <RecentTrades extraTrades={sessionTrades} limit={5} />
          <div className="flex justify-center -mt-4">
            <Link
              href="/trades"
              className="text-xs font-sans font-medium text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors duration-200"
            >
              View all trades &rarr;
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Hero prompt — invites the user to get a quote */}
          <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-8">
            {/* Decorative background grid */}
            <div className="absolute inset-0 data-grid-bg opacity-50 pointer-events-none" />
            {/* Decorative glow */}
            <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full bg-[var(--cyan-wash)] blur-[100px] pointer-events-none" />

            <div className="relative">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[var(--text)]">Request for Quote</h2>
                <p className="text-xs text-[var(--text-4)] mt-1">Select an instrument and amount to get real-time pricing</p>
              </div>
              <QuoteForm onQuote={handleQuote} />
            </div>
          </div>

          <SectionLabel>Favorites</SectionLabel>
          <FavoritesGrid onQuote={handleQuote} />

          <SectionLabel>Recent Trades</SectionLabel>
          <RecentTrades extraTrades={sessionTrades} limit={5} />
          <div className="flex justify-center -mt-4">
            <Link
              href="/trades"
              className="text-xs font-sans font-medium text-[var(--text-4)] hover:text-[var(--cyan)] transition-colors duration-200"
            >
              View all trades &rarr;
            </Link>
          </div>
        </>
      )}
    </PageTransition>
  );
}
