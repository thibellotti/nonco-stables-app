"use client";

import { useState } from "react";
import { favorites, type Instrument } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";
import { Sparkline } from "@/components/ui/sparkline";
import { Button } from "@/components/ui/button";

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
// Base rates (hardcoded from mock-data to avoid modifying that file)
// ---------------------------------------------------------------------------

const BASE_RATES: Record<string, number> = {
  "MXN/USDT": 17.45,
  "EUR/USDT": 1.0835,
  "BRL/USDC": 5.15,
  "USD/USDT": 1.0002,
  "GBP/USDC": 1.265,
  "EUR/USDC": 1.084,
  "MXN/USDC": 17.42,
  "BRL/USDT": 5.16,
};

// ---------------------------------------------------------------------------
// Mock sparkline data per pair
// ---------------------------------------------------------------------------

const pairSparklines: Record<string, number[]> = {
  "MXN/USDT": [17.3, 17.35, 17.4, 17.38, 17.42, 17.45, 17.44, 17.45],
  "EUR/USDT": [1.08, 1.082, 1.081, 1.084, 1.083, 1.085, 1.083, 1.084],
  "BRL/USDC": [5.1, 5.12, 5.11, 5.14, 5.13, 5.15, 5.14, 5.15],
  "USD/USDT": [1.0, 1.0001, 1.0, 1.0002, 1.0001, 1.0002, 1.0001, 1.0002],
};

// ---------------------------------------------------------------------------
// Favorites Grid
// ---------------------------------------------------------------------------

interface FavoritesGridProps {
  onQuote: (instrument: Instrument, quantity: number) => void;
  compact?: boolean;
}

export function FavoritesGrid({ onQuote, compact = false }: FavoritesGridProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(favorites.map((f) => [f.id, f.defaultQuantity]))
  );

  function handleQuantityChange(id: string, value: string) {
    const num = parseFloat(value.replace(/,/g, ""));
    if (!isNaN(num)) {
      setQuantities((prev) => ({ ...prev, [id]: num }));
    }
  }

  // -------------------------------------------------------------------------
  // Compact mode — single column, minimal cards for sidebar placement
  // -------------------------------------------------------------------------
  if (compact) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {favorites.map((fav) => {
          const [base, quote] = fav.instrument.pair.split("/");
          const baseName = currencyNames[base] ?? base;

          return (
            <div
              key={fav.id}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:border-[var(--border-outline)] hover:bg-[var(--bg-elevated)] transition-all duration-200"
            >
              <div className="flex items-center gap-3 p-4">
                {/* Pair info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[var(--text-3)] font-mono uppercase tracking-wider">
                    {base}/{quote}
                  </p>
                  <p className="text-sm font-bold tracking-tight text-white mt-0.5 truncate">
                    {baseName}
                  </p>
                </div>

                {/* Quantity + quote */}
                <input
                  type="text"
                  inputMode="numeric"
                  aria-label={`Quantity for ${fav.instrument.pair}`}
                  value={formatMoney(quantities[fav.id]).replace(/\.00$/, "")}
                  onChange={(e) => handleQuantityChange(fav.id, e.target.value)}
                  className="w-24 bg-[var(--bg-highest)] rounded px-2 py-1.5 font-mono text-xs text-white placeholder:text-[var(--text-4)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)] focus:ring-opacity-30 transition-colors"
                />
                <Button
                  variant="cyan"
                  size="sm"
                  onClick={() => onQuote(fav.instrument, quantities[fav.id])}
                  className="shrink-0"
                >
                  Quote
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Default mode — full 2x2 / 4-col grid with sparklines and rates
  // -------------------------------------------------------------------------
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {favorites.map((fav) => {
        const [base, quote] = fav.instrument.pair.split("/");
        const baseName = currencyNames[base] ?? base;
        const rate = BASE_RATES[fav.instrument.pair];
        const colors = currencyColors[base] ?? currencyColors["USD"];
        const sparkData = pairSparklines[fav.instrument.pair] ?? [1, 1.01, 1, 1.01];

        return (
          <div
            key={fav.id}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:border-[var(--border-outline)] transition-colors duration-200 flex flex-col"
            style={{
              borderTopWidth: 2,
              borderTopColor: colors.border,
            }}
          >
            {/* Top: pair code + star */}
            <div className="px-4 pt-4 pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-[var(--text-3)]">
                    {base}/{quote}
                  </p>
                  <p className="text-base font-bold text-[var(--text)] mt-0.5">
                    {baseName}
                  </p>
                </div>
                {/* Star icon */}
                <svg
                  className="w-3.5 h-3.5 text-[var(--cyan)] opacity-40 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              {/* Rate + sparkline row */}
              <div className="flex items-center justify-between mt-3">
                <p className="text-lg font-mono text-white tracking-tight">
                  {rate !== undefined ? rate.toFixed(4) : "\u2014"}
                </p>
                <Sparkline
                  data={sparkData}
                  width={64}
                  height={24}
                  color={colors.border}
                  showArea={false}
                  strokeWidth={1.5}
                  className="shrink-0"
                />
              </div>
            </div>

            {/* Bottom: quantity + quote button */}
            <div className="flex gap-2 px-4 pt-3 pb-4">
              <input
                type="text"
                inputMode="numeric"
                aria-label={`Quantity for ${fav.instrument.pair}`}
                value={formatMoney(quantities[fav.id]).replace(/\.00$/, "")}
                onChange={(e) => handleQuantityChange(fav.id, e.target.value)}
                className="flex-1 min-w-0 bg-[var(--bg-highest)] rounded px-3 py-2 font-mono text-sm text-white placeholder:text-[var(--text-4)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)] focus:ring-opacity-30 transition-colors"
              />
              <Button
                variant="cyan"
                size="sm"
                onClick={() => onQuote(fav.instrument, quantities[fav.id])}
                className="shrink-0"
              >
                Quote
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
