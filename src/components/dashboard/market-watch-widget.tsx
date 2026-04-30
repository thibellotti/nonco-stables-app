"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { boardInstruments, boardSections, type BoardInstrument } from "@/lib/mock-data";
import {
  useFavorites,
  useFavoritesActions,
  useIsFavorite,
} from "@/stores/favorites";
import { cn } from "@/lib/utils";

// Default fallback when the user hasn't favorited anything yet — most-traded pairs.
// Sourced from `boardInstruments` order so the cards use real BID/ASK values.
// 8 pairs so the xl: 4-col grid fills two complete rows at FHD+ widths.
const FALLBACK_PAIRS = [
  "USDT/MXN",
  "EUR/USDT",
  "USDT/BRL",
  "GBP/USDC",
  "USDT/COP",
  "USDC/MXN",
  "USDC/BRL",
  "EUR/USDC",
];

const MAX_VISIBLE = 8;

function formatPrice(value: number): string {
  return value > 100 ? value.toFixed(2) : value.toFixed(4);
}

interface MarketWatchWidgetProps {
  /** Opens the streaming RFS dialog pre-filled with the chosen pair. */
  onRequestRfs: (pair: string) => void;
}

// ---------------------------------------------------------------------------
// Star button — toggles favorite state, swallows click so the card doesn't
// open the RFS dialog when the user only meant to (un)favorite.
// ---------------------------------------------------------------------------

function FavoriteStar({ pair }: { pair: string }) {
  const isFav = useIsFavorite(pair);
  const { toggle } = useFavoritesActions();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(pair);
      }}
      aria-label={isFav ? `Remove ${pair} from favorites` : `Add ${pair} to favorites`}
      aria-pressed={isFav}
      className={cn(
        "ml-auto -m-1 p-1 rounded-md transition-colors cursor-pointer shrink-0",
        "text-[var(--text-4)] hover:text-[var(--text)]",
        isFav && "text-[var(--cyan)] hover:text-[var(--cyan)]",
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill={isFav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 1.5l1.7 3.45 3.8.55-2.75 2.68.65 3.78L7 10.18 3.6 11.96l.65-3.78L1.5 5.5l3.8-.55L7 1.5z" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Market Watch — rebuilt per Apr 17 client feedback.
// Each card mirrors the trade-page card: pair + bid/ask + 24h.
// Whole card opens the streaming RFS dialog. Star toggles favorite.
// Source order: favorites (alphabetical) first, then default top pairs to fill.
// ---------------------------------------------------------------------------

export function MarketWatchWidget({ onRequestRfs }: MarketWatchWidgetProps) {
  const favorites = useFavorites();

  const items = useMemo<BoardInstrument[]>(() => {
    // Favorites — match against pair label (the ID in the favorites store).
    const favoriteInstruments = favorites
      .map((pair) => boardInstruments.find((i) => i.pair === pair))
      .filter((x): x is BoardInstrument => x !== undefined)
      .sort((a, b) => a.pair.localeCompare(b.pair));

    // If we already have enough favorites, use those alone.
    if (favoriteInstruments.length >= MAX_VISIBLE) {
      return favoriteInstruments.slice(0, MAX_VISIBLE);
    }

    // Otherwise pad with fallback pairs (skipping anything already in favorites).
    const seen = new Set(favoriteInstruments.map((i) => i.pair));
    const fallbackInstruments = FALLBACK_PAIRS
      .filter((pair) => !seen.has(pair))
      .map((pair) => boardInstruments.find((i) => i.pair === pair))
      .filter((x): x is BoardInstrument => x !== undefined);

    return [...favoriteInstruments, ...fallbackInstruments].slice(0, MAX_VISIBLE);
  }, [favorites]);

  const usingFavorites = favorites.length > 0;

  return (
    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 sm:p-6">
      <header className="flex items-center justify-between gap-3 mb-5">
        <div className="min-w-0">
          <SectionLabel>Market Watch</SectionLabel>
          <p className="text-[11px] font-sans text-[var(--text-4)] mt-1.5">
            {usingFavorites
              ? "Your favorited pairs — tap a card to trade"
              : "Most-traded pairs — star a pair to pin it here"}
          </p>
        </div>
        <Link
          href="/fx"
          className="text-[11px] font-sans text-[var(--text-3)] hover:text-[var(--text)] transition-colors shrink-0"
        >
          Full board &rarr;
        </Link>
      </header>

      {/* Grid scales with viewport: 1 col mobile → 2 sm → 3 lg → 4 xl.
          At FHD+ widths (xl) the 4-col layout uses width better and keeps
          the card's content density readable. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((inst) => {
          const isPositive = inst.change24h >= 0;
          const sectionColor = boardSections[inst.section]?.color ?? "var(--text)";

          return (
            <button
              key={inst.id}
              type="button"
              onClick={() => onRequestRfs(inst.pair)}
              aria-label={`Trade ${inst.pair}`}
              // `min-w-0` lets the card shrink below intrinsic child width inside
              // the parent grid (otherwise long pair labels would push the card
              // wider than its column and visually clip on narrow viewports).
              // Calm hover: bg shift only — no border colour change, no scale.
              className="group relative flex flex-col gap-3 text-left bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-4 min-w-0 hover:bg-[rgba(255,255,255,0.025)] transition-colors duration-200 ease-out cursor-pointer"
            >
              {/* Top row: dot + pair + favorite star. */}
              <div className="flex items-center gap-2 w-full">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: sectionColor }}
                  aria-hidden="true"
                />
                <span className="font-mono text-xs font-medium text-[var(--text)] tracking-tight truncate min-w-0 flex-1">
                  {inst.pair}
                </span>
                <FavoriteStar pair={inst.pair} />
              </div>

              {/* Bid / Ask — labels are quiet (text-4 + smaller), values carry
                  the visual weight (text + font-medium + tabular-nums). */}
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:gap-3 w-full">
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-[.15em] text-[var(--text-4)] font-sans mb-1">
                    Bid
                  </div>
                  <div className="font-mono text-[15px] font-medium text-[var(--text)] tabular-nums tracking-tight truncate">
                    {formatPrice(inst.buy)}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-[.15em] text-[var(--text-4)] font-sans mb-1">
                    Ask
                  </div>
                  <div className="font-mono text-[15px] font-medium text-[var(--text-2)] tabular-nums tracking-tight truncate">
                    {formatPrice(inst.sell)}
                  </div>
                </div>
              </div>

              {/* 24h change footer */}
              <div className="flex items-center justify-between gap-2 pt-1 w-full">
                <span className="text-[10px] uppercase tracking-[.12em] text-[var(--text-4)] font-sans">
                  24h
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px] font-medium tabular-nums inline-flex items-center gap-1 shrink-0",
                    isPositive
                      ? "text-[var(--status-positive)]"
                      : "text-[var(--status-negative)]",
                  )}
                >
                  <span aria-hidden="true">{isPositive ? "▲" : "▼"}</span>
                  {isPositive ? "+" : ""}
                  {inst.change24h.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
