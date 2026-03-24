"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { FavoritesGrid } from "@/components/rfq/favorites-grid";
import { QuoteForm } from "@/components/rfq/quote-form";
import { PriceCard } from "@/components/rfq/price-card";
import { RecentTrades } from "@/components/rfq/recent-trades";
import {
  type Instrument,
  type Quote,
  type RecentTrade,
  generateQuote,
} from "@/lib/mock-data";

export default function RFQPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInstrument, setSelectedInstrument] =
    useState<Instrument | null>(null);
  const [sessionTrades, setSessionTrades] = useState<RecentTrade[]>([]);

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
      const trade: RecentTrade = {
        id: `session-${Date.now()}`,
        pair: quote.instrument.pair,
        side,
        quantity: 100_000,
        price,
        settlement:
          settlement === "spot"
            ? "Spot"
            : settlement === "t1"
              ? "T+1"
              : settlement === "t2"
                ? "T+2"
                : "T+10",
        timestamp: new Date(),
      };
      setSessionTrades((prev) => [trade, ...prev]);
    },
    [quote]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 lg:px-10 lg:py-8 space-y-6"
    >
      <SectionLabel>Favorites</SectionLabel>
      <FavoritesGrid onQuote={handleQuote} />

      <SectionLabel>New Quote</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <QuoteForm onQuote={handleQuote} />
        </div>
        <PriceCard
          quote={quote}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onTrade={handleTrade}
        />
      </div>

      <SectionLabel>Recent Trades</SectionLabel>
      <RecentTrades extraTrades={sessionTrades} />
    </motion.div>
  );
}
