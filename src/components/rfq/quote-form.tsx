"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { instruments, type Instrument } from "@/lib/mock-data";

interface QuoteFormProps {
  onQuote: (instrument: Instrument, quantity: number) => void;
}

export function QuoteForm({ onQuote }: QuoteFormProps) {
  const [selectedPair, setSelectedPair] = useState(instruments[0].pair);
  const [quantity, setQuantity] = useState("100000");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const instrument = instruments.find((i) => i.pair === selectedPair);
    const qty = parseFloat(quantity.replace(/,/g, ""));
    if (instrument && !isNaN(qty) && qty > 0) {
      onQuote(instrument, qty);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      {/* Instrument selector */}
      <div className="flex-1 relative">
        <select
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
          className="w-full appearance-none bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm font-mono text-[var(--text)] focus:border-[var(--cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)]/20 transition-colors cursor-pointer"
        >
          {instruments.map((inst) => (
            <option key={inst.pair} value={inst.pair}>
              {inst.pair}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-4)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Quantity */}
      <div className="flex-1 relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-3 pr-14 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-4)] focus:border-[var(--cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)]/20 transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[var(--text-4)]">
          {instruments.find((i) => i.pair === selectedPair)?.baseCurrency ?? "USD"}
        </span>
      </div>

      <Button type="submit" variant="cyan" size="md">
        Get Quote
      </Button>
    </form>
  );
}
