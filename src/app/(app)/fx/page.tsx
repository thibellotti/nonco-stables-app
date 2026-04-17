"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  boardInstruments,
  boardSections,
  recentTrades,
  type BoardInstrument,
  type RecentTrade,
} from "@/lib/mock-data";

// boardSections is already imported above and re-used inside RowView
import dynamic from "next/dynamic";
import { GeoDivider } from "@/components/ui/geo-divider";

const RfsDialog = dynamic(
  () => import("@/components/rfs/rfs-dialog").then((mod) => ({ default: mod.RfsDialog })),
  { ssr: false }
);
import { formatMoney, timeAgo } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";


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
  "MXN/USDT": 100,
  "MXN/USDC": 92,
  "BRL/USDT": 81,
  "BRL/USDC": 74,
  "EUR/USDT": 65,
  "EUR/USDC": 58,
  "GBP/USDC": 42,
  "GBP/USDT": 38,
  "MXN/USD": 30,
  "MXN/USD1": 22,
  "MXN/AUSD": 18,
  "COP/USDT": 14,
  "CLP/USDT": 9,
};

const VIEW_STORAGE_KEY = "nonco-fx-view-mode";

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

const extraTrades: RecentTrade[] = [
  { id: "trade-009", pair: "EUR/USDC", side: "buy", quantity: 120_000, price: 1.0841, settlement: "T+1", timestamp: new Date(Date.now() - 6 * 86400000) },
  { id: "trade-010", pair: "MXN/USDT", side: "sell", quantity: 250_000, price: 17.438, settlement: "Spot", timestamp: new Date(Date.now() - 6 * 86400000 - 5 * 3600000) },
  { id: "trade-011", pair: "USD/USDT", side: "buy", quantity: 750_000, price: 1.0001, settlement: "Spot", timestamp: new Date(Date.now() - 7 * 86400000) },
];

const allTrades = [...recentTrades, ...extraTrades];

// ---------------------------------------------------------------------------
// Market Card
// ---------------------------------------------------------------------------

const MarketCard = memo(function MarketCard({
  instrument,
  onClick,
}: {
  instrument: LiveInstrument;
  onClick: () => void;
}) {
  const isPositive = instrument.change24h >= 0;
  const sectionColor = boardSections[instrument.section]?.color ?? "#fff";

  return (
    <button
      onClick={onClick}
      type="button"
      className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 text-left hover:border-[var(--border-outline)] hover:bg-[rgba(255,255,255,0.02)] transition-all cursor-pointer"
    >
      {/* Section color accent */}
      <div className="absolute top-0 left-4 right-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${sectionColor}40, transparent)` }} />

      {/* Pair name — medium weight, not bold */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sectionColor }} />
        <span className="font-mono text-sm font-medium text-white">{instrument.pair}</span>
      </div>

      {/* Bid / Ask — regular weight on numbers, lighter labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <div>
          <div className="text-[9px] uppercase tracking-[.1em] text-[var(--text-4)] font-sans font-normal mb-0.5">Bid</div>
          <div className={cn(
            "font-mono text-sm font-normal tabular-nums transition-colors duration-150",
            instrument.flashBuy ? "text-[var(--status-positive)]" : "text-[var(--text)]"
          )}>
            {formatPrice(instrument.buy)}
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[.1em] text-[var(--text-4)] font-sans font-normal mb-0.5">Ask</div>
          <div className={cn(
            "font-mono text-sm font-normal tabular-nums transition-colors duration-150",
            instrument.flashSell ? "text-[var(--purple)]" : "text-[var(--text)]"
          )}>
            {formatPrice(instrument.sell)}
          </div>
        </div>
      </div>

      {/* 24h Change — medium not semibold */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-sans text-[var(--text-4)]">24h</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-xs font-medium tabular-nums",
            isPositive ? "text-[var(--status-positive)]" : "text-[var(--red)]"
          )}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className={cn(!isPositive && "rotate-180")}>
            <path d="M5 2L8.5 7H1.5L5 2Z" />
          </svg>
          {Math.abs(instrument.change24h).toFixed(2)}%
        </span>
      </div>
    </button>
  );
});

// ---------------------------------------------------------------------------
// Row View — dense table layout for FX pairs
// ---------------------------------------------------------------------------

const RowView = memo(function RowView({
  instruments,
  onRowClick,
}: {
  instruments: LiveInstrument[];
  onRowClick: (pair: string) => void;
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-4 sm:px-6 py-3 text-[10px] tracking-[.15em] uppercase font-medium text-[var(--text-4)]">Instrument</th>
            <th className="px-4 sm:px-6 py-3 text-[10px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right">Sell qty</th>
            <th className="px-4 sm:px-6 py-3 text-[10px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right">Sell price</th>
            <th className="px-4 sm:px-6 py-3 text-[10px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right">Buy price</th>
            <th className="px-4 sm:px-6 py-3 text-[10px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right">Buy qty</th>
            <th className="px-4 sm:px-6 py-3 text-[10px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right hidden sm:table-cell">24h change</th>
            <th className="px-4 sm:px-6 py-3 text-[10px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right hidden md:table-cell">Prev. close</th>
          </tr>
        </thead>
        <tbody>
          {instruments.map((inst) => {
            const isPositive = inst.change24h >= 0;
            return (
              <tr
                key={inst.id}
                onClick={() => onRowClick(inst.pair)}
                className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150 cursor-pointer"
              >
                <td className="px-4 sm:px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: boardSections[inst.section]?.color ?? "#fff" }} />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-medium text-white">{inst.pair}</span>
                      <span className="text-[10px] font-sans text-[var(--text-4)]">{inst.baseCurrency} → {inst.quoteCurrency} · Spot</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 text-right">
                  <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">{formatMoney(inst.sellQty)}</span>
                </td>
                <td className={cn("px-4 sm:px-6 py-3 text-right font-mono text-sm tabular-nums transition-colors duration-150", inst.flashSell ? "text-[var(--purple)]" : "text-[var(--text)]")}>
                  {formatPrice(inst.sell)}
                </td>
                <td className={cn("px-4 sm:px-6 py-3 text-right font-mono text-sm tabular-nums transition-colors duration-150", inst.flashBuy ? "text-[var(--status-positive)]" : "text-[var(--text)]")}>
                  {formatPrice(inst.buy)}
                </td>
                <td className="px-4 sm:px-6 py-3 text-right">
                  <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">{formatMoney(inst.buyQty)}</span>
                </td>
                <td className="px-4 sm:px-6 py-3 text-right hidden sm:table-cell">
                  <span className={cn("inline-flex items-center gap-1 font-mono text-xs tabular-nums", isPositive ? "text-[var(--status-positive)]" : "text-[var(--red)]")}>
                    <svg width="7" height="7" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className={cn(!isPositive && "rotate-180")}>
                      <path d="M5 2L8.5 7H1.5L5 2Z" />
                    </svg>
                    {isPositive ? "+" : "-"}{Math.abs(inst.change24h).toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 sm:px-6 py-3 text-right hidden md:table-cell">
                  <span className="font-mono text-xs text-[var(--text-4)] tabular-nums">{formatPrice(inst.prevClose)}</span>
                </td>
              </tr>
            );
          })}
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
    <div role="tablist" aria-label="View mode" className="inline-flex p-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
      <button
        role="tab"
        aria-selected={value === "widgets"}
        onClick={() => onChange("widgets")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-sans font-medium uppercase tracking-[.1em] transition-colors cursor-pointer",
          value === "widgets" ? "bg-[var(--bg-elevated)] text-white" : "text-[var(--text-4)] hover:text-[var(--text-2)]"
        )}
      >
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" />
          <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" />
          <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" />
          <rect x="8" y="8" width="4.5" height="4.5" rx="1" />
        </svg>
        Widgets
      </button>
      <button
        role="tab"
        aria-selected={value === "rows"}
        onClick={() => onChange("rows")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-sans font-medium uppercase tracking-[.1em] transition-colors cursor-pointer",
          value === "rows" ? "bg-[var(--bg-elevated)] text-white" : "text-[var(--text-4)] hover:text-[var(--text-2)]"
        )}
      >
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <line x1="2" y1="3.5" x2="12" y2="3.5" />
          <line x1="2" y1="7" x2="12" y2="7" />
          <line x1="2" y1="10.5" x2="12" y2="10.5" />
        </svg>
        Rows
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function FxBoardPage() {
  const shouldReduceMotion = useReducedMotion();
  const [search, setSearch] = useState("");
  const [rfsOpen, setRfsOpen] = useState(false);
  const [rfsInstrument, setRfsInstrument] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("widgets");
  const [instruments, setInstruments] = useState<LiveInstrument[]>(() => {
    const ranked = [...boardInstruments].sort(
      (a, b) => (USAGE_RANK[b.pair] ?? 0) - (USAGE_RANK[a.pair] ?? 0)
    );
    return ranked.map((i) => ({ ...i, flashSell: false, flashBuy: false }));
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist view preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEW_STORAGE_KEY);
      if (stored === "rows" || stored === "widgets") setViewMode(stored);
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

  const openRfs = useCallback((pair?: string) => {
    setRfsInstrument(pair);
    setRfsOpen(true);
  }, []);

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

  // Filter instruments by search
  const filtered = useMemo(() => {
    if (!search.trim()) return instruments;
    const q = search.toLowerCase();
    return instruments.filter(
      (i) =>
        i.pair.toLowerCase().includes(q) ||
        i.baseCurrency.toLowerCase().includes(q) ||
        i.quoteCurrency.toLowerCase().includes(q)
    );
  }, [instruments, search]);

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-4">
      <h1 className="sr-only">FX & Pricing</h1>
      {/* ── Top bar: Search + Live indicator + RFS button ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pairs..."
            aria-label="Search currency pairs"
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg pl-9 pr-4 py-2.5 text-xs font-sans text-[var(--text)] outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors placeholder:text-[var(--text-4)]"
          />
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <LiveDot />
          <span className="font-sans text-[11px] text-[var(--text-4)]">
            Live prices
          </span>
        </div>

        {/* View toggle */}
        <ViewToggle value={viewMode} onChange={handleViewChange} />

        {/* RFS button */}
        <Button variant="cyan" size="sm" onClick={() => openRfs()}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 1v10M1 6h10" />
          </svg>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[.1em]">RFS</span>
        </Button>
      </div>

      {/* ── Market View — Widgets or Rows ── */}
      <motion.div
        key={viewMode}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {viewMode === "widgets" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((inst) => (
              <MarketCard
                key={inst.id}
                instrument={inst}
                onClick={() => openRfs(inst.pair)}
              />
            ))}
          </div>
        ) : (
          <RowView instruments={filtered} onRowClick={openRfs} />
        )}
      </motion.div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-[var(--text-3)] mb-1">No pairs match &quot;{search}&quot;</p>
          <p className="text-xs text-[var(--text-4)]">Try a different search term</p>
        </div>
      )}

      {/* Footer info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-sans text-[var(--text-4)]">
          <span className="font-mono">{filtered.length}</span> of <span className="font-mono">{instruments.length}</span> instruments
        </span>
        <span className="text-[10px] font-sans text-[var(--text-4)]/60">
          Prices update every 700ms · indicative only
        </span>
      </div>

      <GeoDivider variant="line-dot" className="my-6" />

      {/* ── Recent Trading Activity (lower grid) ── */}
      <div>
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
            Recent Trading Activity
          </span>
          <Link
            href="/trades"
            className="text-[11px] font-sans text-white hover:opacity-70 transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-4)]">Pair</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-4)]">Side</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right">Quantity</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right">Price</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] hidden sm:table-cell">Settlement</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] tracking-[.15em] uppercase font-medium text-[var(--text-4)] text-right hidden sm:table-cell">When</th>
              </tr>
            </thead>
            <tbody>
              {allTrades.slice(0, 8).map((trade) => {
                const baseCurrency = trade.pair.split("/")[0];
                const baseColor = currencyColors[baseCurrency]?.border ?? "rgba(255,255,255,0.5)";
                return (
                  <tr
                    key={trade.id}
                    className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${baseColor}15`, border: `1px solid ${baseColor}30` }}
                        >
                          <span className="font-mono text-[10px] font-bold" style={{ color: baseColor }}>
                            {baseCurrency.slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-white">{trade.pair}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      {trade.side === "buy" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-sans uppercase tracking-[.1em] bg-[var(--buy-dim)] text-[var(--buy)]">Buy</span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-sans uppercase tracking-[.1em] bg-[var(--sell-dim)] text-[var(--sell)]">Sell</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <span className="font-mono text-xs text-white tabular-nums">{formatMoney(trade.quantity)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right">
                      <span className="font-mono text-xs text-white tabular-nums">{trade.price.toFixed(4)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[10px] font-mono text-[var(--text-3)]">{trade.settlement}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right hidden sm:table-cell">
                      <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">{timeAgo(trade.timestamp)}</span>
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
    </PageTransition>
  );
}
