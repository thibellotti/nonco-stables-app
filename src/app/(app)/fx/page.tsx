"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { TabGroup } from "@/components/ui/tab-group";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import {
  boardInstruments,
  boardSections,
  type BoardInstrument,
} from "@/lib/mock-data";
import Link from "next/link";
import { RfsDialog } from "@/components/rfs/rfs-dialog";
import { GeoDivider } from "@/components/ui/geo-divider";
import { GeoShape } from "@/components/ui/geo-shape";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FxTab = "board" | "chart" | "history";

interface LiveInstrument extends BoardInstrument {
  flashSell: boolean;
  flashBuy: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(value: number): string {
  return value > 100 ? value.toFixed(2) : value.toFixed(4);
}

function formatQty(qty: number): string {
  return qty.toLocaleString("en-US");
}

// Group instruments by section, preserving order
function groupBySection(instruments: LiveInstrument[]) {
  const sectionOrder: Array<"latam" | "brl" | "eur" | "gbp"> = [
    "latam",
    "brl",
    "eur",
    "gbp",
  ];
  return sectionOrder
    .filter((s) => instruments.some((i) => i.section === s))
    .map((sectionId) => ({
      section: boardSections[sectionId],
      instruments: instruments.filter((i) => i.section === sectionId),
    }));
}

// ---------------------------------------------------------------------------
// Sub-components (all self-contained in this file)
// ---------------------------------------------------------------------------

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-positive)] opacity-50" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--status-positive)]" />
    </span>
  );
}

function ChangeCell({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs tabular-nums",
        isPositive ? "text-[var(--status-positive)]" : "text-[var(--red)]"
      )}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="currentColor"
        aria-hidden="true"
        className={cn(!isPositive && "rotate-180")}
      >
        <path d="M5 2L8.5 7H1.5L5 2Z" />
      </svg>
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function PriceCell({
  value,
  side,
  flash,
  onClick,
}: {
  value: number;
  side: "sell" | "buy";
  flash: boolean;
  onClick?: () => void;
}) {
  const isSell = side === "sell";
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-md font-mono text-sm font-bold tabular-nums transition-colors duration-150 cursor-pointer",
        isSell
          ? "bg-[var(--purple-dim)] text-[var(--purple)] hover:bg-[rgba(161,36,248,0.18)]"
          : "bg-[var(--status-positive-dim)] text-[var(--status-positive)] hover:bg-[rgba(34,197,94,0.18)]",
        flash && (isSell ? "flash-sell" : "flash-buy")
      )}
      aria-label={`${side} at ${formatPrice(value)}`}
    >
      {formatPrice(value)}
    </button>
  );
}

function SectionSeparator({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div
      className="col-span-full flex items-center gap-2.5 px-4 py-2 border-l-2"
      style={{
        borderLeftColor: color,
        background: `linear-gradient(90deg, color-mix(in srgb, ${color} 6%, transparent), transparent)`,
      }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="font-sans text-[11px] font-bold uppercase tracking-[.15em] text-[var(--text-4)]">
        {label}
      </span>
    </div>
  );
}

function StatusDot({ active }: { active?: boolean }) {
  return (
    <span
      className={cn(
        "w-1.5 h-1.5 rounded-full shrink-0",
        active ? "bg-[var(--status-positive)]" : "bg-[var(--text-4)]"
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Column header labels
// ---------------------------------------------------------------------------

const COLUMNS = [
  { key: "status", label: "", width: "w-8" },
  { key: "instrument", label: "Instrument", width: "flex-1 min-w-[160px]" },
  { key: "sellQty", label: "Sell qty", width: "w-20 hidden xl:flex", align: "text-right" },
  { key: "sell", label: "Sell price", width: "w-28", align: "text-center" },
  { key: "buy", label: "Buy price", width: "w-28", align: "text-center" },
  { key: "buyQty", label: "Buy qty", width: "w-20", align: "text-right" },
  { key: "change", label: "24h chg", width: "w-24", align: "text-right" },
  { key: "prevClose", label: "Prev close", width: "w-28 hidden xl:flex", align: "text-right" },
] as const;

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function FxBoardPage() {
  const [activeTab, setActiveTab] = useState<FxTab>("board");
  const [rfsOpen, setRfsOpen] = useState(false);
  const [rfsInstrument, setRfsInstrument] = useState<string | undefined>();
  const [instruments, setInstruments] = useState<LiveInstrument[]>(() =>
    boardInstruments.map((i) => ({ ...i, flashSell: false, flashBuy: false }))
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const openRfs = useCallback((pair?: string) => {
    setRfsInstrument(pair);
    setRfsOpen(true);
  }, []);

  // ── Price flicker simulation ──
  const tickPrice = useCallback(() => {
    setInstruments((prev) => {
      // Clear all flashes first
      const cleared = prev.map((i) => ({
        ...i,
        flashSell: false,
        flashBuy: false,
      }));

      // Pick a random instrument
      const idx = Math.floor(Math.random() * cleared.length);
      const inst = { ...cleared[idx] };

      // Random side
      const side = Math.random() > 0.5 ? "sell" : "buy";

      // Small delta: +-0.01% to 0.05% of the price
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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tickPrice]);

  const grouped = groupBySection(instruments);

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-4">
      {/* ── Top bar: Tabs + Live indicator + RFS button ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <TabGroup
          tabs={[
            { value: "board" as FxTab, label: "Rate board" },
            { value: "chart" as FxTab, label: "Chart" },
            { value: "history" as FxTab, label: "History" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        {/* Live indicator */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <LiveDot />
          <span className="font-sans text-[11px] text-[var(--text-4)]">
            Live prices{" "}
            <span className="text-[var(--text-4)]/60">
              · qty in USD thousands
            </span>
          </span>
        </div>

        {/* RFS button */}
        <Button variant="cyan" size="sm" onClick={() => openRfs()}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 1v10M1 6h10" />
          </svg>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[.1em]">
            RFS
          </span>
        </Button>
      </div>

      <GeoDivider variant="line-dot" className="my-4" />

      {/* ── Rate Board ── */}
      {activeTab === "board" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[var(--bg-card)] rounded-lg overflow-hidden"
        >
          {/* Geo shapes — "Exchange" theme */}
          <GeoShape variant="diamond" size={24} className="absolute" style={{ top: '6px', right: '48px', opacity: 0.2 }} />
          <GeoShape variant="diamond" size={18} className="absolute" style={{ top: '14px', right: '120px', opacity: 0.3 }} />
          <GeoShape variant="diamond" size={20} className="absolute" style={{ top: '10px', left: '240px', opacity: 0.22 }} />
          <GeoShape variant="grid-4" size={28} className="absolute" style={{ top: '8px', left: '52%', opacity: 0.2 }} />
          <GeoShape variant="bracket-tr" size={18} className="absolute" style={{ top: '4px', right: '4px', opacity: 0.15 }} />
          <GeoShape variant="bracket-bl" size={18} className="absolute" style={{ bottom: '4px', left: '4px', opacity: 0.15 }} />

          {/* Header row */}
          <div className="flex items-center gap-0 bg-[rgba(255,255,255,0.02)] px-4 py-3">
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className={cn(
                  "text-[10px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)] select-none",
                  col.width,
                  "align" in col ? col.align : ""
                )}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Body: grouped sections */}
          <div>
            {grouped.map(({ section, instruments: sectionInstruments }) => (
              <div key={section.id}>
                {/* Section separator */}
                <SectionSeparator
                  label={section.label}
                  color={section.color}
                />

                {/* Instrument rows */}
                {sectionInstruments.map((inst, idx) => (
                  <motion.div
                    key={inst.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-0 px-4 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.03)] hover:shadow-[inset_2px_0_0_rgba(255,255,255,0.15)] transition-all duration-100 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => openRfs(inst.pair)}
                  >
                    {/* Row index */}
                    <div className="w-8 flex items-center justify-center">
                      <span className="text-[10px] font-mono text-[var(--text-4)] tabular-nums">{idx + 1}</span>
                    </div>

                    {/* Instrument name */}
                    <div className="flex-1 min-w-[160px]">
                      <div className="flex items-center gap-1.5">
                        <StatusDot active />
                        <span className="font-mono text-sm font-bold text-white">
                          {inst.pair}
                        </span>
                      </div>
                      <span className="block font-sans text-[10px] text-[var(--text-4)] mt-0.5 ml-[14px]">
                        {inst.baseCurrency} → {inst.quoteCurrency}
                      </span>
                    </div>

                    {/* Sell qty */}
                    <div className="w-20 text-right hidden xl:flex xl:justify-end">
                      <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">
                        {formatQty(inst.sellQty)}
                      </span>
                    </div>

                    {/* Sell price */}
                    <div className="w-28 flex justify-center">
                      <PriceCell
                        value={inst.sell}
                        side="sell"
                        flash={inst.flashSell}
                      />
                    </div>

                    {/* Buy price */}
                    <div className="w-28 flex justify-center">
                      <PriceCell
                        value={inst.buy}
                        side="buy"
                        flash={inst.flashBuy}
                      />
                    </div>

                    {/* Buy qty */}
                    <div className="w-20 text-right">
                      <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">
                        {formatQty(inst.buyQty)}
                      </span>
                    </div>

                    {/* 24h change */}
                    <div className="w-24 flex justify-end">
                      <ChangeCell value={inst.change24h} />
                    </div>

                    {/* Prev close */}
                    <div className="w-28 text-right hidden xl:flex xl:justify-end">
                      <span className="font-mono text-xs text-[var(--text-3)] tabular-nums">
                        {formatPrice(inst.prevClose)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-[10px] font-sans text-[var(--text-4)] tracking-[.06em]">
              <span className="font-mono">{instruments.length}</span> instruments
              across{" "}
              <span className="font-mono">
                {Object.keys(boardSections).length}
              </span>{" "}
              corridors
            </span>
            <span className="text-[10px] font-sans text-[var(--text-4)]/60">
              Prices update every 700ms · indicative only
            </span>
          </div>
        </motion.div>
      )}

      {/* ── Chart tab (placeholder) ── */}
      {activeTab === "chart" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg"
        >
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="mb-4">
              {/* 4x4 dot grid */}
              {[0,1,2,3].map(row => [0,1,2,3].map(col => (
                <circle key={`${row}-${col}`} cx={12 + col * 14} cy={12 + row * 14} r="1.5" fill="rgba(255,255,255,0.1)" />
              )))}
              {/* Connection lines between some dots */}
              <line x1="12" y1="12" x2="26" y2="26" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="26" y1="26" x2="40" y2="12" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="40" y1="26" x2="54" y2="40" stroke="rgba(5,224,248,0.15)" strokeWidth="1" />
              {/* Highlighted node */}
              <circle cx="40" cy="26" r="3" fill="none" stroke="rgba(5,224,248,0.25)" strokeWidth="1" />
            </svg>
            <p className="text-sm font-medium text-[var(--text-3)] mb-1">
              Chart view coming soon
            </p>
            <p className="text-xs text-[var(--text-4)]">
              Candlestick and depth charts for all corridors
            </p>
            <button className="mt-4 text-[11px] font-sans font-medium text-white hover:opacity-70 underline-offset-2 transition-colors cursor-pointer">
              Notify me when available
            </button>
          </div>
        </motion.div>
      )}

      {/* ── History tab (placeholder) ── */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg"
        >
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <svg width="64" height="32" viewBox="0 0 64 32" fill="none" aria-hidden="true" className="mb-4">
              <line x1="4" y1="16" x2="60" y2="16" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle cx="12" cy="16" r="4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <circle cx="32" cy="16" r="4" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <rect x="49" y="13" width="6" height="6" fill="rgba(255,255,255,0.1)" />
            </svg>
            <p className="text-sm font-medium text-[var(--text-3)] mb-1">
              Trade history coming soon
            </p>
            <p className="text-xs text-[var(--text-4)]">
              Full execution history with export options
            </p>
            <Link href="/trades" className="mt-4 inline-flex items-center gap-1 text-[11px] font-sans font-medium text-white hover:opacity-70 underline-offset-2 transition-colors">
              View recent trades <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </motion.div>
      )}
      {/* RFS Dialog */}
      <RfsDialog
        open={rfsOpen}
        onClose={() => setRfsOpen(false)}
        defaultInstrument={rfsInstrument}
      />
    </PageTransition>
  );
}
