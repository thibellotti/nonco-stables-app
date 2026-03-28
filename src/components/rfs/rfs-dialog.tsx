"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatMoney } from "@/lib/utils";
import { instruments, type Instrument } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RfsDialogProps {
  open: boolean;
  onClose: () => void;
  defaultInstrument?: string;
}

type SettlementType = "spot" | "tod" | "tom" | "forward";

type ForwardTenor = "1W" | "2W" | "1M" | "2M" | "3M" | "6M";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRICE_VALIDITY_SECONDS = 30;

const SETTLEMENT_OPTIONS: { key: SettlementType; label: string }[] = [
  { key: "spot", label: "SPOT" },
  { key: "tod", label: "TOD" },
  { key: "tom", label: "TOM" },
  { key: "forward", label: "Forward" },
];

const FORWARD_TENORS: ForwardTenor[] = ["1W", "2W", "1M", "2M", "3M", "6M"];

const SETTLEMENT_DISPLAY: Record<SettlementType, string> = {
  spot: "Spot · T+2",
  tod: "TOD · T+0",
  tom: "TOM · T+1",
  forward: "Forward",
};

// Base mid-market rates for all supported pairs
const BASE_RATES: Record<string, number> = {
  "MXN/USDT": 17.45,
  "MXN/USDC": 17.42,
  "BRL/USDT": 5.16,
  "BRL/USDC": 5.15,
  "EUR/USDT": 1.0835,
  "EUR/USDC": 1.084,
  "GBP/USDT": 1.265,
  "GBP/USDC": 1.265,
  "USD/USDT": 1.0002,
  "COP/USDT": 4118.0,
  "CLP/USDT": 942.5,
};

// Forward premium multipliers (annualised, scaled to tenor)
const TENOR_PREMIUMS: Record<ForwardTenor, number> = {
  "1W": 1 + 0.03 / 52,
  "2W": 1 + 0.032 / 26,
  "1M": 1 + 0.035 / 12,
  "2M": 1 + 0.037 / 6,
  "3M": 1 + 0.04 / 4,
  "6M": 1 + 0.042 / 2,
};

const FEE_RATE = 0.0015; // 0.15%

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
  const halfSpread = mid * 0.00025; // ~5 bps round-trip for RFS

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
  // Large prices (COP, CLP) get 2 decimals, rest get 4
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

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function StreamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5L12 12m0 0l3-1.5M12 12V9" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Settlement Tabs
// ---------------------------------------------------------------------------

function SettlementTabs({
  active,
  onChange,
}: {
  active: SettlementType;
  onChange: (s: SettlementType) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 p-1 bg-[var(--bg-elevated)] rounded-lg">
      {SETTLEMENT_OPTIONS.map(({ key, label }) => (
        <button
          key={key}
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={cn(
            "relative px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer",
            active === key
              ? "bg-[var(--bg-card)] text-white shadow-sm"
              : "bg-transparent text-[var(--text-4)] hover:text-[var(--text-3)]"
          )}
        >
          {label}
          {active === key && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-white" />
          )}
        </button>
      ))}
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
      <div className="flex gap-2 pt-3">
        {FORWARD_TENORS.map((tenor) => (
          <button
            key={tenor}
            onClick={() => onChange(tenor)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all duration-200 cursor-pointer border",
              active === tenor
                ? "bg-white text-black border-white"
                : "bg-transparent text-[var(--text-3)] border-[var(--border)] hover:border-[var(--border-outline)] hover:text-[var(--text-2)]"
            )}
          >
            {tenor}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Price Timer Bar
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--text-4)]">
          <TimerIcon />
          <span className="text-xs font-sans">Price valid</span>
        </div>
        {expired ? (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-xs font-sans font-medium text-white hover:text-[var(--text-2)] transition-colors cursor-pointer"
          >
            <RefreshIcon />
            Refresh
          </button>
        ) : (
          <span
            className={cn(
              "text-xs font-mono font-bold tabular-nums",
              isUrgent ? "text-[var(--amber)]" : "text-[var(--text-3)]"
            )}
          >
            {secondsLeft}s
          </span>
        )}
      </div>
      <div className="w-full h-[3px] rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 linear"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: isUrgent ? "var(--amber)" : "white",
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quote Box (Sell / Buy)
// ---------------------------------------------------------------------------

function QuoteBox({
  side,
  price,
  currency,
  expired,
  onClick,
}: {
  side: "sell" | "buy";
  price: number;
  currency: string;
  expired: boolean;
  onClick: () => void;
}) {
  const isSell = side === "sell";

  return (
    <motion.button
      onClick={onClick}
      disabled={expired}
      whileHover={expired ? {} : { scale: 1.01 }}
      whileTap={expired ? {} : { scale: 0.99 }}
      className={cn(
        "relative flex flex-col items-center gap-3 p-5 rounded-lg border-2 transition-all duration-200 cursor-pointer text-left w-full",
        "disabled:cursor-not-allowed disabled:opacity-40",
        isSell
          ? "bg-[var(--sell-dim)] border-transparent hover:border-[var(--purple)]"
          : "bg-[var(--buy-dim)] border-transparent hover:border-[var(--buy)]"
      )}
    >
      {/* Label */}
      <span
        className={cn(
          "text-[10px] font-sans font-bold uppercase tracking-[.14em]",
          isSell ? "text-[var(--purple)]" : "text-[var(--buy)]"
        )}
      >
        {side}
      </span>

      {/* Price */}
      <span
        className={cn(
          "font-mono text-3xl font-extrabold tabular-nums tracking-tight",
          isSell ? "text-[var(--purple)]" : "text-[var(--buy)]"
        )}
      >
        {formatPrice(price)}
      </span>

      {/* Subtitle */}
      <span
        className={cn(
          "text-[11px] font-sans",
          isSell ? "text-[var(--purple)]/60" : "text-[var(--buy)]/60"
        )}
      >
        {currency} · click to {side}
      </span>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Summary Row
// ---------------------------------------------------------------------------

function SummaryGrid({
  notional,
  settlement,
  settlementType,
  tenor,
  buyPrice,
  baseCurrency,
}: {
  notional: number;
  settlement: string;
  settlementType: SettlementType;
  tenor: ForwardTenor;
  buyPrice: number;
  baseCurrency: string;
}) {
  const estimatedReceive = notional * buyPrice;
  const tenorLabel = settlementType === "forward" ? `Fwd · ${tenor}` : settlement;

  return (
    <div className="grid grid-cols-4 gap-px bg-[var(--border)] rounded-lg overflow-hidden">
      {[
        { label: "Notional", value: `$${formatMoney(notional)}`, mono: true },
        { label: "Settlement", value: tenorLabel, mono: false },
        { label: "Fee", value: `${(FEE_RATE * 100).toFixed(2)}%`, mono: true },
        {
          label: "Est. receive",
          value: `${formatMoney(estimatedReceive)} ${baseCurrency}`,
          mono: true,
          accent: true,
        },
      ].map(({ label, value, mono, accent }) => (
        <div key={label} className="bg-[var(--bg-elevated)] px-3 py-3 flex flex-col gap-1">
          <span className="text-[11px] font-sans text-[var(--text-4)] uppercase tracking-[.1em]">
            {label}
          </span>
          <span
            className={cn(
              "font-medium truncate",
              mono ? "font-mono tabular-nums" : "font-sans",
              accent ? "text-sm text-white font-bold" : "text-xs text-[var(--text)]"
            )}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RfsDialog — outer shell: AnimatePresence + overlay + body scroll lock
// Inner content mounts/unmounts with `open` so all state resets naturally.
// ---------------------------------------------------------------------------

export function RfsDialog({ open, onClose, defaultInstrument }: RfsDialogProps) {
  // ── Body scroll lock ──────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── ESC to close ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Request for Stream"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel — inner content remounts on each open, resetting state */}
          <RfsDialogContent
            defaultInstrument={defaultInstrument}
            onClose={onClose}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// RfsDialogContent — all stateful logic lives here, mounts fresh each open
// ---------------------------------------------------------------------------

function RfsDialogContent({
  defaultInstrument,
  onClose,
}: {
  defaultInstrument?: string;
  onClose: () => void;
}) {
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

  // Derive instrument data
  const instrument: Instrument | undefined = instruments.find(
    (i) => i.pair === selectedPair
  );
  const baseCurrency = instrument?.baseCurrency ?? selectedPair.split("/")[0];
  const quoteCurrency = instrument?.quoteCurrency ?? selectedPair.split("/")[1];

  // All tradable pairs (superset of instruments array)
  const allPairs = [
    "MXN/USDT",
    "MXN/USDC",
    "BRL/USDT",
    "BRL/USDC",
    "EUR/USDT",
    "EUR/USDC",
    "GBP/USDT",
    "GBP/USDC",
    "USD/USDT",
    "COP/USDT",
    "CLP/USDT",
  ];

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

  // ── Event handlers (no effects for state resets) ──────────────────────
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
      console.log(`[RFS] ${side} trade executed for ${selectedPair}`);
      onClose();
    },
    [expired, onClose, selectedPair]
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden"
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-white">
            <StreamIcon />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-sans">
              Request for Stream
            </h2>
            <p className="text-xs font-sans text-[var(--text-3)] mt-0.5">
              {selectedPair} · {SETTLEMENT_DISPLAY[settlement]}
              {settlement === "forward" && ` · ${tenor}`}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="p-1.5 rounded-md text-[var(--text-4)] hover:text-[var(--text-2)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <div className="px-6 py-5 space-y-5">
        {/* Row 1: Instrument + Notional */}
        <div className="grid grid-cols-2 gap-3">
          {/* Instrument select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-medium text-[var(--text-4)] uppercase tracking-[.1em]">
              Instrument
            </label>
            <div className="relative">
              <select
                value={selectedPair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="w-full appearance-none bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-sans text-[var(--text)] focus:border-white focus:outline-none transition-colors cursor-pointer"
              >
                {allPairs.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-4)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Notional input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-medium text-[var(--text-4)] uppercase tracking-[.1em]">
              Notional
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={notionalInput}
                onChange={handleNotionalChange}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 pr-14 text-sm font-mono text-[var(--text)] placeholder:text-[var(--text-4)] focus:border-white focus:outline-none transition-colors tabular-nums"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[var(--text-4)]">
                {quoteCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Settlement tabs */}
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

        {/* Row 4: Quote boxes */}
        <div className="grid grid-cols-2 gap-3">
          <QuoteBox
            side="sell"
            price={prices.sell}
            currency={baseCurrency}
            expired={expired}
            onClick={() => handleTrade("sell")}
          />
          <QuoteBox
            side="buy"
            price={prices.buy}
            currency={baseCurrency}
            expired={expired}
            onClick={() => handleTrade("buy")}
          />
        </div>

        {/* Row 5: Summary */}
        <SummaryGrid
          notional={notional}
          settlement={SETTLEMENT_DISPLAY[settlement]}
          settlementType={settlement}
          tenor={tenor}
          buyPrice={prices.buy}
          baseCurrency={baseCurrency}
        />
      </div>
    </motion.div>
  );
}
