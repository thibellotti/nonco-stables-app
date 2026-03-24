"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { favorites, type Instrument } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

interface FavoritesGridProps {
  onQuote: (instrument: Instrument, quantity: number) => void;
}

export function FavoritesGrid({ onQuote }: FavoritesGridProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(favorites.map((f) => [f.id, f.defaultQuantity]))
  );

  function handleQuantityChange(id: string, value: string) {
    const num = parseFloat(value.replace(/,/g, ""));
    if (!isNaN(num)) {
      setQuantities((prev) => ({ ...prev, [id]: num }));
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {favorites.map((fav) => {
        const [base, quote] = fav.instrument.pair.split("/");
        return (
          <Card key={fav.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-semibold text-[var(--text)]">
                {base}
              </span>
              <span className="text-base font-semibold text-[var(--text-4)]">
                /{quote}
              </span>
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={formatMoney(quantities[fav.id]).replace(/\.00$/, "")}
              onChange={(e) => handleQuantityChange(fav.id, e.target.value)}
              className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-4)] focus:border-[var(--cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)]/20 transition-colors"
            />

            <Button
              variant="cyan"
              size="sm"
              className="w-full"
              onClick={() => onQuote(fav.instrument, quantities[fav.id])}
            >
              Quote
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
