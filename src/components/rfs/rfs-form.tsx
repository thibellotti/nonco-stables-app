"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatMoney } from "@/lib/utils";
import { instruments, type Instrument } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RfsFormState {
  pair: string;
  settlement: SettlementType;
  tenor: ForwardTenor;
}

export interface RfsFormProps {
  /** Initial instrument to focus. When this changes, the form re-syncs. */
  defaultInstrument?: string;
  /** Optional close hook — wired to ESC + done flows. Dialog/panel decide UX. */
  onClose?: () => void;
  /**
   * Render variant. `compact` is used by the inline TradePanel on /fx —
   * slightly tighter padding so the form sits naturally inside the
   * 420px peek panel without feeling oversized. `false` is the dialog
   * variant (original spacing).
   */
  compact?: boolean;
  /**
   * Optional change hook so the parent (dialog header, panel header) can
   * mirror the live form state — e.g. show the active pair + settlement
   * label in the chrome.
   */
  onStateChange?: (state: RfsFormState) => void;
}

type SettlementType = "spot" | "tod" | "tom" | "forward";

type ForwardTenor = "1W" | "2W" | "1M" | "2M" | "3M" | "6M";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRICE_VALIDITY_SECONDS = 30;

const SETTLEMENT_OPTIONS: { key: SettlementType; label: string }[] = [
  { key: "spot", label: "Spot" },
  { key: "tod", label: "Tod" },
  { key: "tom", label: "Tom" },
  { key: "forward", label: "Forward" },
];

const FORWARD_TENORS: ForwardTenor[] = ["1W", "2W", "1M", "2M", "3M", "6M"];

const SETTLEMENT_DISPLAY: Record<SettlementType, string> = {
  spot: "Spot",
  tod: "Today (TOD)",
  tom: "Tomorrow (TOM)",
  forward: "Forward",
};

function settlementLabel(s: SettlementType): string {
  return SETTLEMENT_DISPLAY[s];
}

// Base mid-market rates for all supported pairs
const BASE_RATES: Record<string, number> = {
  "USDT/MXN": 17.45,
  "USDC/MXN": 17.42,
  "USDT/BRL": 5.16,
  "USDC/BRL": 5.15,
  "EUR/USDT": 1.0835,
  "EUR/USDC": 1.084,
  "GBP/USDT": 1.265,
  "GBP/USDC": 1.265,
  "USD/USDT": 1.0002,
  "USDT/COP": 4118.0,
  "USDT/CLP": 942.5,
};

const TENOR_PREMIUMS: Record<ForwardTenor, number> = {
  "1W": 1 + 0.03 / 52,
  "2W": 1 + 0.032 / 26,
  "1M": 1 + 0.035 / 12,
  "2M": 1 + 0.037 / 6,
  "3M": 1 + 0.04 / 4,
  "6M": 1 + 0.042 / 2,
};

const FEE_RATE = 0.0015; // 0.15%

const ALL_PAIRS = [
  "USDT/MXN",
  "USDC/MXN",
  "USDT/BRL",
  "USDC/BRL",
  "EUR/USDT",
  "EUR/USDC",
  "GBP/USDT",
  "GBP/USDC",
  "USD/USDT",
  "USDT/COP",
  "USDT/CLP",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBaseRate(pair: string): number {
  return BASE_RATES[pair] ?? 1;
}

function jitterPrice(base: number): number {
  const jitter = (Math.random() - 0.5) * 2 * base * 0.0008;
  return base + jitter;
}

function computePrices(
  pair: string,
  settlement: SettlementType,
  tenor: ForwardTenor
): { sell: number; buy: number } {
  const mid = getBaseRate(pair);
  const halfSpread = mid * 0.00025;

  let factor = 1;
  if (settlement === "forward") {
    factor = TENOR_PREMIUMS[tenor];
  } else if (settlement === "tom") {
    factor = 1 + 0.03 / 365;
  } else if (settlement === "tod") {
    factor = 1;
  }

  const sell = jitterPrice((mid - halfSpread) * factor);
  const buy = jitterPrice((mid + halfSpread) * factor);

  return {
    sell: +sell.toFixed(4),
    buy: +buy.toFixed(4),
  };
}

function formatPrice(price: number): string {
  if (price > 100) return price.toFixed(2);
  return price.toFixed(4);
}

function formatNotional(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function parseNotional(value: string): number {
  return parseFloat(value.replace(/,/g, "")) || 0;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function RefreshIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Settlement Tabs — pill style. `gap-2` fixes spacing alignment in compact mode.
// ---------------------------------------------------------------------------

function SettlementTabs({
  active,
  onChange,
}: {
  active: SettlementType;
  onChange: (s: SettlementType) => void;
}) {
  return (
    <div role="tablist" aria-label="Settlement type" className="inline-flex items-center gap-1">
      {SETTLEMENT_OPTIONS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(key)}
            className={cn(
              "px-3 py-1.5 rounded-md text-[11px] font-sans font-medium tracking-[.06em] transition-colors duration-150 cursor-pointer",
              isActive
                ? "bg-[var(--cyan-dim)] text-[var(--cyan)] border border-[rgba(5,224,248,0.18)]"
                : "border border-transparent text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--bg-elevated)]"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Forward Tenor Pills
// ---------------------------------------------------------------------------

function TenorPills({
  active,
  onChange,
}: {
  active: ForwardTenor;
  onChange: (t: ForwardTenor) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap gap-1.5 pt-3">
        {FORWARD_TENORS.map((tenor) => {
          const isActive = active === tenor;
          return (
            <button
              key={tenor}
              onClick={() => onChange(tenor)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-mono tabular-nums transition-colors duration-150 cursor-pointer",
                isActive
                  ? "bg-[var(--cyan-dim)] text-[var(--cyan)] border border-[rgba(5,224,248,0.18)]"
                  : "border border-transparent text-[var(--text-3)] hover:text-[var(--text-2)] hover:bg-[var(--bg-elevated)]"
              )}
            >
              {tenor}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Price Timer — 1px hairline progress, lowercase label
// ---------------------------------------------------------------------------

function PriceTimer({
  secondsLeft,
  expired,
  onRefresh,
}: {
  secondsLeft: number;
  expired: boolean;
  onRefresh: () => void;
}) {
  const progress = expired ? 0 : secondsLeft / PRICE_VALIDITY_SECONDS;
  const isUrgent = secondsLeft <= 10 && !expired;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-sans">
        <span className="text-[var(--text-4)]">
          {expired ? "Quote expired" : `Price valid · ${secondsLeft}s`}
        </span>
        {expired ? (
          <button
            onClick={onRefresh}
            aria-label="Refresh quote"
            className="inline-flex items-center gap-1.5 text-[var(--cyan)] hover:text-[var(--cyan-light)] transition-colors cursor-pointer font-medium"
          >
            <RefreshIcon />
            Refresh quote
          </button>
        ) : null}
      </div>
      <div className="relative w-full h-px bg-[var(--border)] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 transition-[width,background-color,opacity] duration-500 ease-linear"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: isUrgent ? "var(--red)" : "var(--cyan)",
            opacity: isUrgent ? 0.9 : 0.8,
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quote Tile (Sell / Buy) — equal-height tiles via grid + items-stretch
// ---------------------------------------------------------------------------

function QuoteTile({
  side,
  price,
  expired,
  onClick,
  compact,
}: {
  side: "sell" | "buy";
  price: number;
  expired: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const isSell = side === "sell";
  const accent = isSell ? "var(--status-negative)" : "var(--status-positive)";
  const baseBg = isSell ? "rgba(239,68,68,0.04)" : "rgba(34,197,94,0.04)";
  const hoverBg = isSell ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)";
  const baseBorder = isSell ? "rgba(239,68,68,0.18)" : "rgba(34,197,94,0.18)";
  const hoverBorder = isSell ? "rgba(239,68,68,0.32)" : "rgba(34,197,94,0.32)";

  return (
    <button
      onClick={onClick}
      disabled={expired}
      aria-label={`${side === "sell" ? "Sell" : "Buy"} at ${formatPrice(price)}`}
      style={
        {
          "--tile-bg": baseBg,
          "--tile-bg-hover": hoverBg,
          "--tile-border": baseBorder,
          "--tile-border-hover": hoverBorder,
        } as React.CSSProperties
      }
      className={cn(
        "group relative flex h-full flex-col items-stretch text-left w-full rounded-md cursor-pointer",
        compact ? "px-4 py-4" : "px-5 py-5",
        "bg-[var(--tile-bg)] border border-[var(--tile-border)]",
        "hover:bg-[var(--tile-bg-hover)] hover:border-[var(--tile-border-hover)]",
        "transition-colors duration-200",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--tile-bg)] disabled:hover:border-[var(--tile-border)]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cyan)]"
      )}
    >
      <span
        className="text-[10px] font-sans font-medium uppercase tracking-[.15em]"
        style={{ color: accent }}
      >
        {side}
      </span>

      <span
        className={cn(
          "mt-3 font-mono font-medium tabular-nums tracking-tight leading-none text-[var(--text)]",
          compact ? "text-[28px]" : "text-[40px] sm:text-[44px]"
        )}
      >
        {formatPrice(price)}
      </span>

      <span className="mt-3 text-[10px] font-sans text-[var(--text-4)]">
        click to {side}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Summary Footer — 2-col grid; col 1 = NOTIONAL/FEE, col 2 = SETTLEMENT/EST. RECEIVE
// ---------------------------------------------------------------------------

function SummaryFooter({
  notional,
  settlementType,
  tenor,
  buyPrice,
  baseCurrency,
  compact,
}: {
  notional: number;
  settlementType: SettlementType;
  tenor: ForwardTenor;
  buyPrice: number;
  baseCurrency: string;
  compact?: boolean;
}) {
  const estimatedReceive = notional * buyPrice;
  const tenorLabel =
    settlementType === "forward"
      ? `Fwd · ${tenor}`
      : settlementLabel(settlementType);

  // Layout matches spec: row 1 = Notional | Settlement, row 2 = Fee | Est. receive.
  // CSS grid auto-flow row preserves left-to-right reading order so labels and
  // values stay column-aligned at every viewport width.
  const cells: {
    label: string;
    value: string;
    mono?: boolean;
    accent?: boolean;
  }[] = [
    { label: "Notional", value: `$${formatMoney(notional)}`, mono: true },
    { label: "Settlement", value: tenorLabel, mono: false },
    { label: "Fee", value: `${(FEE_RATE * 100).toFixed(2)}%`, mono: true },
    {
      label: "Est. receive",
      value: `${formatMoney(estimatedReceive)} ${baseCurrency}`,
      mono: true,
      accent: true,
    },
  ];

  return (
    <div className="border-t border-[var(--border)]">
      <div
        className={cn(
          "grid grid-cols-2 gap-x-6 gap-y-4",
          compact ? "px-5 py-5 lg:px-6" : "p-5 lg:p-6"
        )}
      >
        {cells.map(({ label, value, mono, accent }) => (
          <div key={label} className="flex flex-col min-w-0">
            <span className="text-[9px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)] mb-1.5">
              {label}
            </span>
            <span
              className={cn(
                "truncate",
                mono ? "font-mono tabular-nums" : "font-sans",
                accent
                  ? "text-[15px] font-medium text-[var(--cyan)]"
                  : "text-[13px] font-medium text-[var(--text)]"
              )}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RfsForm — shared interaction surface for both modal + inline panel
// ---------------------------------------------------------------------------

export function RfsForm({ defaultInstrument, onClose, compact = false, onStateChange }: RfsFormProps) {
  const initialPair = defaultInstrument ?? instruments[0].pair;

  const [selectedPair, setSelectedPair] = useState(initialPair);
  const [notionalInput, setNotionalInput] = useState("1,000,000");
  const [settlement, setSettlement] = useState<SettlementType>("spot");
  const [tenor, setTenor] = useState<ForwardTenor>("1M");
  const [secondsLeft, setSecondsLeft] = useState(PRICE_VALIDITY_SECONDS);
  const [prices, setPrices] = useState(() =>
    computePrices(initialPair, "spot", "1M")
  );
  const [frozen, setFrozen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const expired = secondsLeft <= 0;

  // ── Sync with `defaultInstrument` ────────────────────────────────────
  // The dialog version remounts on each open so this never fires there;
  // the inline panel keeps the same form mounted while the user clicks
  // different cards, so we resync price + reset the timer when the
  // parent passes a new pair.
  useEffect(() => {
    if (!defaultInstrument || defaultInstrument === selectedPair) return;
    setSelectedPair(defaultInstrument);
    setSecondsLeft(PRICE_VALIDITY_SECONDS);
    setFrozen(false);
    setPrices(computePrices(defaultInstrument, settlement, tenor));
    // We deliberately exclude settlement/tenor — only react to incoming pair.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultInstrument]);

  const instrument: Instrument | undefined = instruments.find(
    (i) => i.pair === selectedPair
  );
  const baseCurrency = instrument?.baseCurrency ?? selectedPair.split("/")[0];
  const quoteCurrency = instrument?.quoteCurrency ?? selectedPair.split("/")[1];

  // Notify parent of state changes so chrome (dialog/panel header) can
  // reflect the live pair + settlement.
  useEffect(() => {
    onStateChange?.({ pair: selectedPair, settlement, tenor });
  }, [selectedPair, settlement, tenor, onStateChange]);

  // ── Countdown timer ───────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    setSecondsLeft(PRICE_VALIDITY_SECONDS);
    setFrozen(false);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setFrozen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Price jitter ──────────────────────────────────────────────────────
  useEffect(() => {
    if (frozen) return;

    const interval = setInterval(() => {
      setPrices(computePrices(selectedPair, settlement, tenor));
    }, 1000);

    return () => clearInterval(interval);
  }, [frozen, selectedPair, settlement, tenor]);

  const handleRefresh = useCallback(() => {
    resetTimer();
    setPrices(computePrices(selectedPair, settlement, tenor));
  }, [resetTimer, selectedPair, settlement, tenor]);

  const handlePairChange = useCallback(
    (pair: string) => {
      setSelectedPair(pair);
      resetTimer();
      setPrices(computePrices(pair, settlement, tenor));
    },
    [settlement, tenor, resetTimer]
  );

  const handleSettlementChange = useCallback(
    (s: SettlementType) => {
      setSettlement(s);
      resetTimer();
      setPrices(computePrices(selectedPair, s, tenor));
    },
    [selectedPair, tenor, resetTimer]
  );

  const handleTenorChange = useCallback(
    (t: ForwardTenor) => {
      setTenor(t);
      resetTimer();
      setPrices(computePrices(selectedPair, settlement, t));
    },
    [selectedPair, settlement, resetTimer]
  );

  const handleTrade = useCallback(
    (side: "sell" | "buy") => {
      if (expired) return;
      // TODO: wire to confirmation dialog / real trading API
      void side;
      onClose?.();
    },
    [expired, onClose]
  );

  const handleNotionalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      if (raw === "") {
        setNotionalInput("");
        return;
      }
      setNotionalInput(formatNotional(parseInt(raw, 10)));
    },
    []
  );

  const notional = parseNotional(notionalInput);

  // Spacing pads compact slightly on x to feel right inside 420px panel,
  // while keeping the same vertical rhythm (space-y-5) as the dialog so
  // the form looks identical edge-to-edge.
  const bodyPadding = compact ? "px-5 py-5 lg:px-6" : "px-6 py-5";

  return (
    <div className="flex flex-col">
      {/* ── Body ───────────────────────────────────────── */}
      <div className={cn(bodyPadding, "space-y-5")}>
        {/* Row 1: Instrument + Notional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label
              htmlFor="rfs-instrument"
              className="block text-[10px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)]"
            >
              Instrument
            </label>
            <div className="relative">
              <select
                id="rfs-instrument"
                value={selectedPair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="w-full appearance-none bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-md px-3 py-2.5 pr-9 text-[15px] font-mono tabular-nums font-medium text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)] focus:ring-offset-0 transition-shadow cursor-pointer"
              >
                {ALL_PAIRS.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-4)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="rfs-notional"
              className="block text-[10px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)]"
            >
              Notional
            </label>
            <div className="relative">
              <input
                id="rfs-notional"
                type="text"
                inputMode="numeric"
                value={notionalInput}
                onChange={handleNotionalChange}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--bg-elevated)] rounded-md px-3 py-2.5 pr-14 text-[15px] font-mono tabular-nums font-medium text-[var(--text)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-1 focus:ring-[var(--cyan)] focus:ring-offset-0 transition-shadow"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums text-[var(--text-4)] tracking-[.05em]">
                {quoteCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Settlement tabs + tenor pills */}
        <div>
          <SettlementTabs active={settlement} onChange={handleSettlementChange} />
          <AnimatePresence>
            {settlement === "forward" && (
              <TenorPills active={tenor} onChange={handleTenorChange} />
            )}
          </AnimatePresence>
        </div>

        {/* Row 3: Price timer */}
        <PriceTimer
          secondsLeft={secondsLeft}
          expired={expired}
          onRefresh={handleRefresh}
        />

        {/* Row 4: Quote tiles — items-stretch keeps SELL and BUY equal height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch pb-1">
          <QuoteTile
            side="sell"
            price={prices.sell}
            expired={expired}
            onClick={() => handleTrade("sell")}
            compact={compact}
          />
          <QuoteTile
            side="buy"
            price={prices.buy}
            expired={expired}
            onClick={() => handleTrade("buy")}
            compact={compact}
          />
        </div>
      </div>

      {/* ── Footer summary ───────────────────────────────────────────── */}
      <SummaryFooter
        notional={notional}
        settlementType={settlement}
        tenor={tenor}
        buyPrice={prices.buy}
        baseCurrency={baseCurrency}
        compact={compact}
      />
    </div>
  );
}

// Re-export so the dialog can build its own header subtitle without
// duplicating the constant table.
export { settlementLabel };
export type { SettlementType, ForwardTenor };
