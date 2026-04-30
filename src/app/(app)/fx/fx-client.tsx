"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo, Suspense } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  activeDeskOffers,
  boardInstruments,
  boardSections,
  recentTrades,
  type BoardInstrument,
  type DeskOffer,
  type RecentTrade,
} from "@/lib/mock-data";

import dynamic from "next/dynamic";
import { useWidgetSelection } from "@/hooks/use-widget-selection";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { CardContextMenu, type CardAction } from "@/components/fx/card-context-menu";
import { WidgetPickerDialog } from "@/components/fx/widget-picker-dialog";
import { DeskOfferBanner } from "@/components/fx/desk-offer-banner";
import { DeskOfferDialog } from "@/components/fx/desk-offer-dialog";
import { FavoritesFilterToggle } from "@/components/fx/favorites-filter-toggle";
import { useToast } from "@/components/ui/toast";

const RfsDialog = dynamic(
  () => import("@/components/rfs/rfs-dialog").then((mod) => ({ default: mod.RfsDialog })),
  { ssr: false }
);

// Inline trade panel — desktop-only. Loaded client-only because it owns
// timers, animation and the shared RFS form (same reasons as RfsDialog).
const TradePanel = dynamic(
  () => import("@/components/fx/trade-panel").then((mod) => ({ default: mod.TradePanel })),
  { ssr: false }
);
import { formatMoney, timeAgo } from "@/lib/utils";
import { currencyColors, displayCurrency } from "@/lib/currency-colors";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LiveInstrument extends BoardInstrument {
  flashSell: boolean;
  flashBuy: boolean;
}

type ViewMode = "widgets" | "rows";

// User pair-usage rank — drives ordering (most-used first).
// Mock for now; in production this comes from the user's trading history.
const USAGE_RANK: Record<string, number> = {
  "USDT/MXN": 100,
  "USDC/MXN": 92,
  "USDT/BRL": 81,
  "USDC/BRL": 74,
  "EUR/USDT": 65,
  "EUR/USDC": 58,
  "GBP/USDC": 42,
  "GBP/USDT": 38,
  "USD/MXN": 30,
  "USD1/MXN": 22,
  "AUSD/MXN": 18,
  "USDT/COP": 14,
  "USDT/CLP": 9,
};

const VIEW_STORAGE_KEY = "nonco-stables-fx-view";
const FAVORITES_ONLY_STORAGE_KEY = "nonco-stables-fx-favorites-only";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(value: number): string {
  return value > 100 ? value.toFixed(2) : value.toFixed(4);
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-positive)] opacity-50" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--status-positive)]" />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Extra trades for display
// ---------------------------------------------------------------------------

// SSR-safe NOW: a fixed module-scope constant so server and client render the
// same trade timestamps. Using `Date.now()` here would differ between the
// server's module-init time and the client's, causing React error #418 and
// orphan DOM nodes leaking to <body>. Same pattern as mock-data.ts NOW_MS.
const FX_NOW_MS = 1777564800000; // 2026-04-30 12:00 UTC — frozen reference

const extraTrades: RecentTrade[] = [
  { id: "trade-009", pair: "EUR/USDC", side: "buy", quantity: 120_000, price: 1.0841, settlement: "T+1", timestamp: new Date(FX_NOW_MS - 6 * 86400000) },
  { id: "trade-010", pair: "USDT/MXN", side: "sell", quantity: 250_000, price: 17.438, settlement: "Spot", timestamp: new Date(FX_NOW_MS - 6 * 86400000 - 5 * 3600000) },
  { id: "trade-011", pair: "USD/USDT", side: "buy", quantity: 750_000, price: 1.0001, settlement: "Spot", timestamp: new Date(FX_NOW_MS - 7 * 86400000) },
];

const allTrades = [...recentTrades, ...extraTrades];

// ---------------------------------------------------------------------------
// Market Card
// ---------------------------------------------------------------------------

const MarketCard = memo(function MarketCard({
  instrument,
  isFavorite,
  isActive = false,
  onClick,
  onOpenMenu,
  onToggleFavorite,
}: {
  instrument: LiveInstrument;
  isFavorite: boolean;
  isActive?: boolean;
  onClick: () => void;
  onOpenMenu: (anchor: { x: number; y: number }) => void;
  onToggleFavorite: () => void;
}) {
  const isPositive = instrument.change24h >= 0;
  const sectionColor = boardSections[instrument.section]?.color ?? "#fff";

  const handleMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      onOpenMenu({ x: rect.right - 4, y: rect.bottom + 4 });
    },
    [onOpenMenu],
  );

  const handleCardContext = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onOpenMenu({ x: e.clientX, y: e.clientY });
    },
    [onOpenMenu],
  );

  const handleStar = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite();
    },
    [onToggleFavorite],
  );

  return (
    <button
      onClick={onClick}
      onContextMenu={handleCardContext}
      type="button"
      aria-pressed={isActive}
      className={cn(
        "group relative rounded-lg p-5 text-left transition-[transform,border-color,box-shadow,background-color] duration-200 ease-out cursor-pointer",
        isActive
          ? // Active state — pair currently shown in the trade panel.
            // Cyan border + subtle inner wash + cyan glow so the card reads
            // as the "selected" one without competing with the panel itself.
            "bg-[var(--cyan-wash)] border border-[var(--cyan)] shadow-[0_0_0_1px_var(--cyan-dim),0_8px_24px_rgba(5,224,248,0.08)]"
          : "bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-outline)] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(5,224,248,0.04)]"
      )}
    >
      {/* Header: section dot + pair + (spacer) + star + menu */}
      <div className="flex items-center gap-2">
        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: sectionColor }} aria-hidden="true" />
        {/* De-bolded: pair code uses font-medium, not bold — keeps the
            visual hierarchy quiet, lets prominent prices below carry the weight. */}
        <span className="font-mono text-xs font-medium text-[var(--text)] tracking-tight">
          {instrument.pair}
        </span>

        <span className="ml-auto inline-flex items-center gap-1">
          {/* Favorite star — clickable toggle. Yellow filled when favorited,
              outlined gray otherwise. Always visible (unlike the menu trigger,
              which only shows on hover) so users can see their selections at a glance. */}
          <button
            type="button"
            aria-label={isFavorite ? `Unfavorite ${instrument.pair}` : `Favorite ${instrument.pair}`}
            aria-pressed={isFavorite}
            onClick={handleStar}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleStar(e);
            }}
            className={cn(
              "p-1 rounded transition-[color,transform] duration-150 cursor-pointer hover:scale-110",
              isFavorite
                ? "text-yellow-400"
                : "text-[var(--text-3)] hover:text-[var(--text-2)]",
            )}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.9 2 .7-4.3-3.1-3 4.3-.6z" />
            </svg>
          </button>

          <span
            role="button"
            tabIndex={0}
            aria-label={`Card actions for ${instrument.pair}`}
            onClick={handleMenu}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                onOpenMenu({ x: rect.right - 4, y: rect.bottom + 4 });
              }
            }}
            className="-mr-1 p-1 rounded text-[var(--text-4)] opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-[var(--text)] transition-opacity duration-150 cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <circle cx="3" cy="8" r="1.3" />
              <circle cx="8" cy="8" r="1.3" />
              <circle cx="13" cy="8" r="1.3" />
            </svg>
          </span>
        </span>
      </div>

      {/* Prices — bid/ask. Numerics keep semibold (institutional convention:
          headline rates carry weight); micro-labels stay font-medium and small. */}
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[9px] uppercase tracking-[.15em] text-[var(--text-4)] font-sans font-medium mb-1">Bid</div>
          <div
            className={cn(
              "font-mono text-lg font-semibold tabular-nums transition-colors duration-200",
              instrument.flashBuy ? "text-[var(--status-positive)]" : "text-[var(--text)]",
            )}
          >
            {formatPrice(instrument.buy)}
          </div>
        </div>
        <div className="min-w-0 text-right">
          <div className="text-[9px] uppercase tracking-[.15em] text-[var(--text-4)] font-sans font-medium mb-1">Ask</div>
          <div
            className={cn(
              "font-mono text-lg font-semibold tabular-nums transition-colors duration-200",
              instrument.flashSell ? "text-[var(--purple)]" : "text-[var(--text-3)]",
            )}
          >
            {formatPrice(instrument.sell)}
          </div>
        </div>
      </div>

      {/* 24h row — separated by hairline. Label and value both font-medium
          (was unweighted) — readable but not loud. */}
      <div className="mt-5 pt-3 border-t border-[var(--border-row)] flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[.15em] text-[var(--text-4)] font-sans font-medium">24h</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-[11px] font-medium tabular-nums",
            isPositive ? "text-[var(--status-positive)]" : "text-[var(--red)]",
          )}
        >
          <svg width="7" height="7" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className={cn(!isPositive && "rotate-180")}>
            <path d="M5 2L8.5 7H1.5L5 2Z" />
          </svg>
          {Math.abs(instrument.change24h).toFixed(2)}%
        </span>
      </div>
    </button>
  );
});

// ---------------------------------------------------------------------------
// Add Card Slot — empty tile that opens the picker
// ---------------------------------------------------------------------------

function AddCardSlot({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add card"
      className="group bg-transparent border border-dashed border-[var(--border-outline)]/50 rounded-lg p-5 min-h-[150px] flex flex-col items-center justify-center gap-2.5 text-[var(--text-4)] hover:border-[var(--cyan)]/60 hover:text-[var(--cyan)] transition-colors duration-200 cursor-pointer"
    >
      <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className="text-[10px] font-sans uppercase tracking-[.15em]">Add card</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Row View — dense table layout for FX pairs
// ---------------------------------------------------------------------------

const RowView = memo(function RowView({
  instruments,
  isFavorite,
  activePair,
  onRowClick,
  onOpenMenu,
  onAddClick,
  onToggleFavorite,
}: {
  instruments: LiveInstrument[];
  isFavorite: (id: string) => boolean;
  activePair?: string | null;
  onRowClick: (pair: string) => void;
  onOpenMenu: (id: string, anchor: { x: number; y: number }) => void;
  onAddClick: () => void;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {/* Headers — font-medium, uppercase, tracking-wider. No bold;
                row content carries the weight via the price cells. */}
            <th className="px-3 py-[var(--table-header-py)] w-9" aria-label="Favorite" />
            <th className="px-5 sm:px-[var(--table-cell-px)] py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)]">Instrument</th>
            <th className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">Sell qty</th>
            <th className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">Sell price</th>
            <th className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">Buy price</th>
            <th className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right">Buy qty</th>
            <th className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden sm:table-cell">24h change</th>
            <th className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans font-medium text-[var(--text-4)] text-right hidden md:table-cell">Prev. close</th>
            <th className="px-3 py-[var(--table-header-py)] w-10" aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {instruments.map((inst) => {
            const isPositive = inst.change24h >= 0;
            const favorited = isFavorite(inst.id);
            const isActive = activePair === inst.pair;
            return (
              <tr
                key={inst.id}
                onClick={() => onRowClick(inst.pair)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onOpenMenu(inst.id, { x: e.clientX, y: e.clientY });
                }}
                aria-selected={isActive}
                className={cn(
                  "group border-b border-[var(--border-row)] transition-colors duration-150 cursor-pointer",
                  isActive
                    ? "bg-[var(--cyan-wash)] hover:bg-[var(--cyan-dim)]"
                    : "hover:bg-[rgba(255,255,255,0.02)]"
                )}
              >
                {/* Star cell — yellow when favorited, gray otherwise. Click
                    toggles via shared store; stops bubbling so it doesn't open RFS. */}
                <td className="pl-3 pr-1 py-[var(--table-cell-py)] w-9">
                  <button
                    type="button"
                    aria-label={favorited ? `Unfavorite ${inst.pair}` : `Favorite ${inst.pair}`}
                    aria-pressed={favorited}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(inst.id);
                    }}
                    className={cn(
                      "p-1 rounded transition-[color,transform] duration-150 cursor-pointer hover:scale-110",
                      favorited
                        ? "text-yellow-400"
                        : "text-[var(--text-3)] hover:text-[var(--text-2)]",
                    )}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill={favorited ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.9 2 .7-4.3-3.1-3 4.3-.6z" />
                    </svg>
                  </button>
                </td>
                <td className="px-5 sm:px-[var(--table-cell-px)] py-[var(--table-cell-py)]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1 h-1 rounded-full" style={{ background: boardSections[inst.section]?.color ?? "#fff" }} aria-hidden="true" />
                    {/* Pair code — font-medium, not bold (de-bold sweep). */}
                    <span className="font-mono text-xs font-medium text-[var(--text)]">
                      {inst.pair}
                    </span>
                  </div>
                </td>
                {/* Quantities — font-medium, secondary text color. */}
                <td className="px-4 py-[var(--table-cell-py)] text-right">
                  <span className="font-mono text-xs font-medium text-[var(--text-4)] tabular-nums">{formatMoney(inst.sellQty)}</span>
                </td>
                {/* Headline price — font-semibold (institutional convention). */}
                <td className={cn("px-4 py-[var(--table-cell-py)] text-right font-mono text-sm font-semibold tabular-nums transition-colors duration-200", inst.flashSell ? "text-[var(--purple)]" : "text-[var(--text-3)]")}>
                  {formatPrice(inst.sell)}
                </td>
                <td className={cn("px-4 py-[var(--table-cell-py)] text-right font-mono text-sm font-semibold tabular-nums transition-colors duration-200", inst.flashBuy ? "text-[var(--status-positive)]" : "text-[var(--text)]")}>
                  {formatPrice(inst.buy)}
                </td>
                <td className="px-4 py-[var(--table-cell-py)] text-right">
                  <span className="font-mono text-xs font-medium text-[var(--text-4)] tabular-nums">{formatMoney(inst.buyQty)}</span>
                </td>
                <td className="px-4 py-[var(--table-cell-py)] text-right hidden sm:table-cell">
                  <span className={cn("inline-flex items-center gap-1 font-mono text-xs font-medium tabular-nums", isPositive ? "text-[var(--status-positive)]" : "text-[var(--red)]")}>
                    <svg width="7" height="7" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className={cn(!isPositive && "rotate-180")}>
                      <path d="M5 2L8.5 7H1.5L5 2Z" />
                    </svg>
                    {isPositive ? "+" : "-"}{Math.abs(inst.change24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-[var(--table-cell-py)] text-right hidden md:table-cell">
                  <span className="font-mono text-xs font-medium text-[var(--text-4)] tabular-nums">{formatPrice(inst.prevClose)}</span>
                </td>
                <td className="px-2 py-[var(--table-header-py)] text-right">
                  <button
                    type="button"
                    aria-label={`Row actions for ${inst.pair}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      onOpenMenu(inst.id, { x: rect.right - 4, y: rect.bottom + 4 });
                    }}
                    className="p-1 rounded text-[var(--text-4)] opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <circle cx="3" cy="8" r="1.3" />
                      <circle cx="8" cy="8" r="1.3" />
                      <circle cx="13" cy="8" r="1.3" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={9} className="p-0">
              <button
                type="button"
                onClick={onAddClick}
                className="w-full flex items-center justify-center gap-2 py-3 text-[var(--text-4)] hover:text-[var(--cyan)] hover:bg-[rgba(5,224,248,0.03)] transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-[10px] font-sans font-medium uppercase tracking-[.12em]">Add instrument</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

// ---------------------------------------------------------------------------
// View toggle — widgets vs rows
// ---------------------------------------------------------------------------

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div
      role="tablist"
      aria-label="View mode"
      className="inline-flex items-center gap-0.5 border border-[var(--border)] rounded-md bg-[var(--bg-card)]"
    >
      <button
        role="tab"
        aria-selected={value === "widgets"}
        aria-label="Widgets view"
        onClick={() => onChange("widgets")}
        className={cn(
          "p-2 rounded-[5px] transition-colors duration-150 cursor-pointer",
          value === "widgets"
            ? "bg-[var(--bg-elevated)] text-[var(--text)]"
            : "text-[var(--text-4)] hover:text-[var(--text-2)]",
        )}
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" />
          <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" />
          <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" />
          <rect x="8" y="8" width="4.5" height="4.5" rx="1" />
        </svg>
      </button>
      <button
        role="tab"
        aria-selected={value === "rows"}
        aria-label="Rows view"
        onClick={() => onChange("rows")}
        className={cn(
          "p-2 rounded-[5px] transition-colors duration-150 cursor-pointer",
          value === "rows"
            ? "bg-[var(--bg-elevated)] text-[var(--text)]"
            : "text-[var(--text-4)] hover:text-[var(--text-2)]",
        )}
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <line x1="2" y1="3.5" x2="12" y2="3.5" />
          <line x1="2" y1="7" x2="12" y2="7" />
          <line x1="2" y1="10.5" x2="12" y2="10.5" />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function FxBoardPage() {
  const shouldReduceMotion = useReducedMotion();
  const { toast } = useToast();
  const { selectedIds, add, remove, toggleFavorite, isFavorite } =
    useWidgetSelection();

  // Desktop = inline trade panel. Tablet/mobile = legacy modal RFS dialog.
  // SSR-safe: defaults to false until the matchMedia query resolves on mount.
  const isDesktop = useIsDesktop();

  const [search, setSearch] = useState("");
  // Inline panel state — present on desktop. When set, the cards grid
  // squeezes to make room and the chosen card gets a cyan accent.
  const [activePair, setActivePair] = useState<string | null>(null);
  // Modal RFS state — used by the top-right RFS button (always) and by
  // card clicks on tablet/mobile (where there's no horizontal room).
  const [rfsOpen, setRfsOpen] = useState(false);
  const [rfsInstrument, setRfsInstrument] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("widgets");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuState, setMenuState] = useState<{ id: string; x: number; y: number } | null>(null);
  const [dismissedOffers, setDismissedOffers] = useState<Set<string>>(new Set());
  const [tradingOffer, setTradingOffer] = useState<DeskOffer | null>(null);
  const [instruments, setInstruments] = useState<LiveInstrument[]>(() => {
    const ranked = [...boardInstruments].sort(
      (a, b) => (USAGE_RANK[b.pair] ?? 0) - (USAGE_RANK[a.pair] ?? 0)
    );
    return ranked.map((i) => ({ ...i, flashSell: false, flashBuy: false }));
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist view + favorites-only preferences across reloads.
  useEffect(() => {
    try {
      const storedView = localStorage.getItem(VIEW_STORAGE_KEY);
      if (storedView === "rows" || storedView === "widgets") setViewMode(storedView);

      const storedFavOnly = localStorage.getItem(FAVORITES_ONLY_STORAGE_KEY);
      if (storedFavOnly === "true") setFavoritesOnly(true);
    } catch {
      /* localStorage unavailable (private mode/cookies blocked) — degrade silently */
    }
  }, []);

  const handleViewChange = useCallback((v: ViewMode) => {
    setViewMode(v);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, v);
    } catch {
      /* localStorage unavailable (private mode/cookies blocked) — degrade silently */
    }
  }, []);

  const handleFavoritesOnlyToggle = useCallback(() => {
    setFavoritesOnly((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(FAVORITES_ONLY_STORAGE_KEY, next ? "true" : "false");
      } catch {
        /* localStorage unavailable — degrade silently */
      }
      return next;
    });
  }, []);

  const openRfs = useCallback((pair?: string) => {
    setRfsInstrument(pair);
    setRfsOpen(true);
  }, []);

  // Card / row click handler — splits desktop (inline panel) vs mobile
  // (modal RFS dialog). Clicking the active card again closes the panel,
  // matching the behaviour of toggle buttons and Linear's side peek.
  const handleSelectPair = useCallback(
    (pair: string) => {
      if (isDesktop) {
        setActivePair((prev) => (prev === pair ? null : pair));
      } else {
        openRfs(pair);
      }
    },
    [isDesktop, openRfs]
  );

  // If the user resizes from desktop down to mobile, hide the panel.
  // Derived during render (no effect) — the underlying `activePair` state
  // is preserved so flipping back to desktop restores the selection.
  const effectiveActivePair = isDesktop ? activePair : null;

  // ── Price flicker simulation ──
  const tickPrice = useCallback(() => {
    setInstruments((prev) => {
      const cleared = prev.map((i) => ({ ...i, flashSell: false, flashBuy: false }));
      const idx = Math.floor(Math.random() * cleared.length);
      const inst = { ...cleared[idx] };
      const side = Math.random() > 0.5 ? "sell" : "buy";
      const pct = (Math.random() * 0.0004 + 0.0001) * (Math.random() > 0.5 ? 1 : -1);

      if (side === "sell") {
        inst.sell = +(inst.sell * (1 + pct)).toFixed(inst.sell > 100 ? 2 : 4);
        inst.flashSell = true;
      } else {
        inst.buy = +(inst.buy * (1 + pct)).toFixed(inst.buy > 100 ? 2 : 4);
        inst.flashBuy = true;
      }
      cleared[idx] = inst;
      return cleared;
    });
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(tickPrice, 700);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [tickPrice]);

  // Filter: user selection → optional favorites-only → search.
  // SSR + first client paint use the seeded selection so the hydration tree matches.
  //
  // Ordering (J4 — frequency approximation):
  //   Favorites first (alphabetical among themselves), then the rest in their
  //   existing USAGE_RANK order. We do NOT track real usage telemetry yet — this
  //   surfaces the user's most-relevant pairs (the ones they intentionally
  //   starred) at the top of both grid and rows, which matches the spirit of
  //   the client's "position by how often the user uses them" feedback.
  const filtered = useMemo(() => {
    let list = instruments.filter((i) => selectedIds.has(i.id));
    if (favoritesOnly) list = list.filter((i) => isFavorite(i.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.pair.toLowerCase().includes(q) ||
          i.baseCurrency.toLowerCase().includes(q) ||
          i.quoteCurrency.toLowerCase().includes(q),
      );
    }

    // Stable partition: favorites first (alphabetical), then non-favorites
    // in the same order they came in (already USAGE_RANK-sorted at seed).
    const favs: LiveInstrument[] = [];
    const rest: LiveInstrument[] = [];
    for (const inst of list) {
      if (isFavorite(inst.id)) favs.push(inst);
      else rest.push(inst);
    }
    favs.sort((a, b) => a.pair.localeCompare(b.pair));
    return [...favs, ...rest];
  }, [instruments, search, selectedIds, favoritesOnly, isFavorite]);

  const handleAction = useCallback(
    (action: CardAction) => {
      if (!menuState) return;
      const inst = instruments.find((i) => i.id === menuState.id);
      if (!inst) return;

      switch (action) {
        case "edit":
          toast(`Edit card — ${inst.pair} (coming soon)`, "success");
          break;
        case "favorite":
          toggleFavorite(inst.id);
          toast(
            isFavorite(inst.id) ? `Removed ${inst.pair} from favorites` : `Favorited ${inst.pair}`,
            "success",
          );
          break;
        case "deep-dive":
          toast(`DeepDive — ${inst.pair} (coming soon)`, "success");
          break;
        case "multileg":
          toast(`New multileg with ${inst.pair} (coming soon)`, "success");
          break;
        case "delete":
          remove(inst.id);
          toast(`Removed ${inst.pair}`, "success");
          break;
      }
      setMenuState(null);
    },
    [menuState, instruments, toggleFavorite, isFavorite, remove, toast],
  );

  const visibleOffers = activeDeskOffers.filter((o) => !dismissedOffers.has(o.id));

  const handleOfferDismiss = useCallback((id: string) => {
    setDismissedOffers((prev) => new Set(prev).add(id));
  }, []);

  const handleOfferTrade = useCallback((offer: DeskOffer) => {
    setTradingOffer(offer);
  }, []);

  const handleOfferConfirm = useCallback(
    (offer: DeskOffer, quantity: number) => {
      const baseAsset = offer.pair.split("/")[0];
      toast(
        `Trade executed — ${offer.pair} ${offer.side === "desk-offers" ? "Buy" : "Sell"} ${formatMoney(quantity)} ${baseAsset} @ ${offer.price.toFixed(2)}`,
        "success",
      );
      setTradingOffer(null);
      setDismissedOffers((prev) => new Set(prev).add(offer.id));
    },
    [toast],
  );

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full space-y-5">
      <h1 className="sr-only">Trade</h1>

      {/* ── Desk offers ── */}
      {visibleOffers.map((offer) => (
        <DeskOfferBanner
          key={offer.id}
          offer={offer}
          onTrade={handleOfferTrade}
          onDismiss={handleOfferDismiss}
        />
      ))}

      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
        {/* Page title + live pulse */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-[.18em] font-sans text-[var(--text-3)]">
            Pairs
          </span>
          <span className="h-3 w-px bg-[var(--border)]" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <LiveDot />
            <span className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
              Live
            </span>
          </span>
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-[320px] sm:ml-auto">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pairs"
            aria-label="Search currency pairs"
            className="w-full bg-transparent border border-[var(--border)] rounded-md pl-8 pr-3 py-2 text-xs font-sans text-[var(--text)] outline-none focus:border-[var(--border-outline)] transition-colors duration-150 placeholder:text-[var(--text-4)]"
          />
        </div>

        {/* Favorites-only toggle — filters the visible list down to starred pairs. */}
        <FavoritesFilterToggle
          active={favoritesOnly}
          onToggle={handleFavoritesOnlyToggle}
        />

        {/* View toggle */}
        <ViewToggle value={viewMode} onChange={handleViewChange} />

        {/* RFS button */}
        <Button variant="cyan" size="sm" onClick={() => openRfs()}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 1v10M1 6h10" />
          </svg>
          <span className="font-sans text-[11px] uppercase tracking-[.12em]">RFS</span>
        </Button>
      </div>

      {/* ── Market View — Widgets or Rows + optional inline trade panel ──
          Layout: 2-column grid on desktop when a pair is selected; cards
          drop one breakpoint of columns to make room for the 420/460px
          panel. Below `lg`, the panel never mounts (mobile falls back to
          the modal RFS dialog) so the cards keep their normal density. */}
      <div
        className={cn(
          "grid gap-4 lg:gap-5 transition-[grid-template-columns] duration-300 ease-out",
          effectiveActivePair
            ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]"
            : "grid-cols-1"
        )}
      >
        {/* Market view column — shrinks one breakpoint when panel is open. */}
        <motion.div
          key={viewMode}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0"
        >
          {viewMode === "widgets" ? (
            <div
              className={cn(
                "grid gap-3 sm:gap-4 transition-[grid-template-columns] duration-300 ease-out",
                effectiveActivePair
                  ? // Panel open — drop one column at each desktop breakpoint
                    // so cards still breathe at ~280px+ wide.
                    "grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              )}
            >
              {filtered.map((inst) => (
                <MarketCard
                  key={inst.id}
                  instrument={inst}
                  isFavorite={isFavorite(inst.id)}
                  isActive={effectiveActivePair === inst.pair}
                  onClick={() => handleSelectPair(inst.pair)}
                  onOpenMenu={(anchor) => setMenuState({ id: inst.id, ...anchor })}
                  onToggleFavorite={() => toggleFavorite(inst.id)}
                />
              ))}
              {!search.trim() && <AddCardSlot onClick={() => setPickerOpen(true)} />}
            </div>
          ) : (
            <RowView
              instruments={filtered}
              isFavorite={isFavorite}
              activePair={effectiveActivePair}
              onRowClick={handleSelectPair}
              onOpenMenu={(id, anchor) => setMenuState({ id, ...anchor })}
              onAddClick={() => setPickerOpen(true)}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </motion.div>

        {/* Inline trade panel — desktop only. AnimatePresence handles the
            slide-out when activePair clears or the user closes the panel. */}
        <AnimatePresence>
          {effectiveActivePair && (
            <TradePanel
              key="trade-panel"
              pair={effectiveActivePair}
              onClose={() => setActivePair(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          {search.trim() ? (
            <>
              <p className="text-sm font-medium text-[var(--text-3)] mb-1">No pairs match &quot;{search}&quot;</p>
              <p className="text-xs text-[var(--text-4)]">Try a different search term</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[var(--text-3)] mb-1">No cards selected</p>
              <p className="text-xs text-[var(--text-4)] mb-4">Add instruments to start watching prices</p>
              <Button variant="cyan" size="sm" onClick={() => setPickerOpen(true)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" />
                </svg>
                <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">Add card</span>
              </Button>
            </>
          )}
        </div>
      )}

      {/* ── Recent Trading Activity ── */}
      <div className="pt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[.18em] font-sans text-[var(--text-3)]">
            Recent activity
          </span>
          <Link
            href="/trades"
            className="text-[11px] font-sans text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-5 sm:px-6 py-3 text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)]">Pair</th>
                <th className="px-4 py-3 text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)]">Side</th>
                <th className="px-4 py-3 text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] text-right">Quantity</th>
                <th className="px-4 py-3 text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] text-right">Price</th>
                <th className="px-4 py-3 text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] hidden sm:table-cell">Settlement</th>
                <th className="px-4 py-3 text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] text-right hidden sm:table-cell">When</th>
              </tr>
            </thead>
            <tbody>
              {allTrades.slice(0, 8).map((trade) => {
                const accentCurrency = displayCurrency(trade.pair);
                const baseColor = currencyColors[accentCurrency]?.border ?? "rgba(255,255,255,0.5)";
                return (
                  <tr
                    key={trade.id}
                    className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150"
                  >
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${baseColor}12`, border: `1px solid ${baseColor}24` }}
                        >
                          <span className="font-mono text-[9px]" style={{ color: baseColor }}>
                            {accentCurrency.slice(0, 2)}
                          </span>
                        </span>
                        <span className="font-mono text-xs text-[var(--text)]">{trade.pair}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {trade.side === "buy" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-[.1em] bg-[var(--buy-dim)] text-[var(--buy)]">Buy</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-[.1em] bg-[var(--sell-dim)] text-[var(--sell)]">Sell</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-mono text-xs text-[var(--text)] tabular-nums">{formatMoney(trade.quantity)}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-mono text-xs text-[var(--text)] tabular-nums">{trade.price.toFixed(4)}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-[10px] font-mono text-[var(--text-3)]">{trade.settlement}</span>
                    </td>
                    <td className="px-4 py-4 text-right hidden sm:table-cell">
                      <span className="font-mono text-[11px] text-[var(--text-4)] tabular-nums">{timeAgo(trade.timestamp)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RFS Dialog */}
      <Suspense fallback={<div className="fixed inset-0 pointer-events-none" aria-hidden="true" />}>
        <RfsDialog
          open={rfsOpen}
          onClose={() => setRfsOpen(false)}
          defaultInstrument={rfsInstrument}
        />
      </Suspense>

      {/* Card context menu (widgets + rows share the same menu) */}
      <CardContextMenu
        open={menuState !== null}
        anchor={menuState ? { x: menuState.x, y: menuState.y } : null}
        isFavorite={menuState ? isFavorite(menuState.id) : false}
        onAction={handleAction}
        onClose={() => setMenuState(null)}
      />

      {/* Add-card picker */}
      <WidgetPickerDialog
        open={pickerOpen}
        selectedIds={selectedIds}
        onToggle={(id) => (selectedIds.has(id) ? remove(id) : add(id))}
        onClose={() => setPickerOpen(false)}
      />

      {/* Desk offer trade dialog */}
      <DeskOfferDialog
        open={tradingOffer !== null}
        offer={tradingOffer}
        onConfirm={handleOfferConfirm}
        onClose={() => setTradingOffer(null)}
      />
    </PageTransition>
  );
}
