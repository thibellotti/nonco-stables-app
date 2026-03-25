"use client";

import { useState, useMemo } from "react";
import { favorites, type Instrument } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

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
// Mini sparkline — decorative SVG with upward-trending random points
// ---------------------------------------------------------------------------

function generateSparklinePoints(seed: number): string {
  const points: [number, number][] = [];
  const width = 80;
  const height = 24;
  const count = 12;
  const step = width / (count - 1);

  // Seeded pseudo-random for deterministic rendering per card
  let s = seed;
  const rand = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s & 0x7fffffff) / 0x7fffffff;
  };

  for (let i = 0; i < count; i++) {
    // Gentle upward trend: base goes from 70% to 30% of height
    const trend = height * (0.7 - (i / (count - 1)) * 0.4);
    const noise = (rand() - 0.5) * height * 0.4;
    const y = Math.max(2, Math.min(height - 2, trend + noise));
    points.push([i * step, y]);
  }

  return points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

function MiniSparkline({ color, seed }: { color: string; seed: number }) {
  const points = useMemo(() => generateSparklinePoints(seed), [seed]);

  return (
    <svg
      width={80}
      height={24}
      viewBox="0 0 80 24"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={points}
        stroke={color}
        strokeOpacity={0.4}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

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
                  <p className="text-[10px] text-[var(--text-3)] font-mono uppercase tracking-wider">
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
                <button
                  onClick={() => onQuote(fav.instrument, quantities[fav.id])}
                  className="shrink-0 bg-[var(--cyan)] text-black text-[10px] font-bold uppercase tracking-wider rounded-full px-4 py-1.5 hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
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

  // -------------------------------------------------------------------------
  // Default mode — full 2x2 / 4-col grid with sparklines and rates
  // -------------------------------------------------------------------------
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {favorites.map((fav, index) => {
        const [base, quote] = fav.instrument.pair.split("/");
        const baseName = currencyNames[base] ?? base;
        const rate = BASE_RATES[fav.instrument.pair];
        const colors = currencyColors[base] ?? currencyColors["USD"];

        return (
          <div
            key={fav.id}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:border-[var(--border-outline)] hover:bg-[var(--bg-elevated)] min-h-[200px] flex flex-col justify-between group transition-all duration-300"
            style={{
              borderLeftWidth: 2,
              borderLeftColor: colors.border,
            }}
          >
            {/* Top: pair code + name + sparkline + rate */}
            <div className="p-6 pb-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-[var(--text-3)] font-mono uppercase tracking-wider">
                    {base}/{quote}
                  </p>
                  <p className="text-base lg:text-lg font-bold tracking-tight text-white mt-1">
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

              {/* Rate + sparkline row */}
              <div className="flex items-center justify-between mt-3">
                <p className="font-mono text-lg text-white tracking-tight">
                  {rate !== undefined ? rate.toFixed(4) : "—"}
                </p>
                <MiniSparkline color={colors.border} seed={index * 7919 + 42} />
              </div>
            </div>

            {/* Bottom: quantity + quote button */}
            <div className="flex gap-2 p-6 pt-4">
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
