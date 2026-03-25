"use client";

import { useState, useCallback } from "react";
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
          {/* Active quote — split layout: price card dominates left, form + favorites right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <PriceCard
              quote={quote}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onTrade={handleTrade}
            />
            <div className="space-y-4">
              <QuoteForm onQuote={handleQuote} />
              <FavoritesGrid onQuote={handleQuote} compact />
            </div>
          </div>

          <SectionLabel>Recent Trades</SectionLabel>
          <RecentTrades extraTrades={sessionTrades} />
        </>
      ) : (
        <>
          {/* Default state — form prominent, favorites + trades below */}
          <QuoteForm onQuote={handleQuote} />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <FavoritesGrid onQuote={handleQuote} />
            <RecentTrades extraTrades={sessionTrades} />
          </div>
        </>
      )}
    </PageTransition>
  );
}
