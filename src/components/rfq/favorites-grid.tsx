"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {favorites.map((fav) => {
        const [base, quote] = fav.instrument.pair.split("/");
        const baseName = currencyNames[base] ?? base;
        const rate = BASE_RATES[fav.instrument.pair];
        const colors = currencyColors[base] ?? currencyColors["USD"];
        const sparkData = pairSparklines[fav.instrument.pair] ?? [1, 1.01, 1, 1.01];

        return (
          <FavoriteCard
            key={fav.id}
            fav={fav}
            base={base}
            quote={quote}
            baseName={baseName}
            rate={rate}
            colors={colors}
            sparkData={sparkData}
            quantity={quantities[fav.id]}
            onQuantityChange={(value) => handleQuantityChange(fav.id, value)}
            onQuote={() => onQuote(fav.instrument, quantities[fav.id])}
          />
        );
      })}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// FavoriteCard — extracted to manage hover state for glow + star
// ---------------------------------------------------------------------------

interface FavoriteCardProps {
  fav: (typeof favorites)[number];
  base: string;
  quote: string;
  baseName: string;
  rate: number | undefined;
  colors: { border: string; bg: string; text: string };
  sparkData: number[];
  quantity: number;
  onQuantityChange: (value: string) => void;
  onQuote: () => void;
}

function FavoriteCard({
  fav,
  base,
  quote,
  baseName,
  rate,
  colors,
  sparkData,
  quantity,
  onQuantityChange,
  onQuote,
}: FavoriteCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:border-[var(--border-outline)] transition-all duration-200 flex flex-col relative overflow-hidden"
      style={{
        borderTopWidth: 2,
        borderTopColor: hovered ? colors.text : colors.border,
        boxShadow: hovered ? `0 0 24px ${colors.border}25` : "none",
        filter: hovered ? "brightness(1.05)" : "none",
        transition: "box-shadow 0.3s ease, filter 0.3s ease, border-color 0.2s ease",
      }}
    >
      {/* Top: pair code + rate */}
      <div className="px-3 pt-3 pb-10 relative z-10">
        <p className="text-[11px] font-mono text-[var(--text-3)] uppercase tracking-wider">
          {base}/{quote}
        </p>
        <p className="text-sm font-bold text-[var(--text)] mt-0.5">
          {baseName}
        </p>
        <p className="text-lg font-mono font-bold text-white tracking-tight mt-1">
          {rate !== undefined ? rate.toFixed(4) : "\u2014"}
        </p>
      </div>

      {/* Sparkline — pinned bottom-right, above the input row */}
      <div className="absolute bottom-14 right-0 w-1/2 h-10 pointer-events-none opacity-70">
        <Sparkline
          data={sparkData}
          color={colors.border}
          showArea={false}
          strokeWidth={1.5}
        />
      </div>

      {/* Bottom: quantity + quote button */}
      <div className="flex gap-2 px-3 pt-2 pb-3 relative z-10 mt-auto">
        <input
          type="text"
          inputMode="numeric"
          aria-label={`Quantity for ${fav.instrument.pair}`}
          value={formatMoney(quantity).replace(/\.00$/, "")}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="flex-1 min-w-0 bg-[var(--bg-highest)] rounded px-3 py-2 font-mono text-sm text-white placeholder:text-[var(--text-4)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)] focus:ring-opacity-30 transition-colors"
        />
        <Button
          variant="cyan"
          size="sm"
          onClick={onQuote}
          className="shrink-0"
        >
          Quote
        </Button>
      </div>
    </motion.div>
  );
}
