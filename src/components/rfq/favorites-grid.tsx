"use client";

import { useState } from "react";
import { favorites, type Instrument } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Currency full names for display
// ---------------------------------------------------------------------------

const currencyNames: Record<string, string> = {
  MXN: "Mexican Peso",
  EUR: "Euro",
  BRL: "Brazilian Real",
  USD: "US Dollar",
  GBP: "British Pound",
  USDT: "Tether",
  USDC: "USD Coin",
};

// ---------------------------------------------------------------------------
// Favorites Grid
// ---------------------------------------------------------------------------

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {favorites.map((fav) => {
        const [base, quote] = fav.instrument.pair.split("/");
        const baseName = currencyNames[base] ?? base;
        return (
          <div
            key={fav.id}
            className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-lg hover:border-[var(--border-outline)] hover:bg-[var(--bg-elevated)] h-44 flex flex-col justify-between group transition-all duration-200"
          >
            {/* Top: pair code + name + star */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-[var(--text-3)] font-mono uppercase tracking-wider">
                    {base}/{quote}
                  </p>
                  <p className="text-lg font-bold tracking-tight text-white mt-1">
                    {baseName}
                  </p>
                </div>
                {/* Star icon */}
                <svg
                  className="w-4 h-4 text-[var(--cyan)] opacity-50 group-hover:opacity-100 transition-opacity duration-200 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            {/* Bottom: quantity + quote button */}
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                aria-label={`Quantity for ${fav.instrument.pair}`}
                value={formatMoney(quantities[fav.id]).replace(/\.00$/, "")}
                onChange={(e) => handleQuantityChange(fav.id, e.target.value)}
                className="flex-1 min-w-0 bg-[var(--bg-highest)] rounded px-3 py-2 font-mono text-sm text-white placeholder:text-[var(--text-4)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)] focus:ring-opacity-30 transition-colors"
              />
              <button
                onClick={() => onQuote(fav.instrument, quantities[fav.id])}
                className="shrink-0 bg-[var(--cyan)] text-black text-[10px] font-bold uppercase tracking-wider rounded-full px-5 py-2 hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Quote
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
