"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatMoney } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FixedOfferDialogProps {
  open: boolean;
  onClose: () => void;
  /** 'buy' if the desk is offering (client buys), 'sell' if the desk is buying (client sells). */
  side: "buy" | "sell";
  base: string;
  quote: string;
  price: number;
  available: number;
  settlement?: string;
  fee?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeNumeric(raw: string): number {
  // Strip everything except digits and a single decimal point.
  const cleaned = raw.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  if (cleaned === "" || cleaned === ".") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatThousands(value: number, fractionDigits = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FixedOfferDialog({
  open,
  onClose,
  side,
  base,
  quote,
  price,
  available,
  settlement = "Spot",
  fee = 0.0015,
}: FixedOfferDialogProps) {
  const [amount, setAmount] = useState(available);
  const [prevOpen, setPrevOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  // Reset amount on open transition (false → true) using React 19's
  // adjust-state-during-render pattern — avoids the setState-in-effect anti-pattern.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setAmount(available);
  }

  // Focus + select the input shortly after the dialog opens.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.select(), 80);
    return () => clearTimeout(t);
  }, [open]);

  // Keyboard: Esc closes, Enter confirms when focus is in the input.
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && document.activeElement === inputRef.current) {
        confirmRef.current?.click();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const overLimit = amount > available;
  const belowMin = amount <= 0;
  const invalid = overLimit || belowMin;

  const notional = useMemo(() => amount * price, [amount, price]);
  const feeAmount = useMemo(() => notional * fee, [notional, fee]);
  const total = useMemo(
    () => (side === "buy" ? notional + feeAmount : notional - feeAmount),
    [notional, feeAmount, side],
  );

  const handleQuickPick = useCallback(
    (pct: number) => {
      setAmount(Math.floor(available * pct));
    },
    [available],
  );

  const handleConfirm = useCallback(() => {
    if (invalid) return;
    const verb = side === "buy" ? "Buy" : "Sell";
    toast(
      `${verb} ${formatMoney(amount)} ${base} @ ${price.toFixed(2)} ${quote}`,
      "success",
    );
    onClose();
  }, [invalid, side, amount, base, price, quote, toast, onClose]);

  const headerTitle = side === "buy" ? `Buy ${base}` : `Sell ${base}`;
  const counterLabel = side === "buy" ? "You pay" : "You receive";
  const ctaLabel = side === "buy" ? "Confirm purchase" : "Confirm sale";

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={headerTitle}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[440px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white font-sans mb-0.5">
                    {headerTitle}
                  </h2>
                  <p className="text-[11px] font-mono text-[var(--text-3)]">
                    {base}/{quote} &middot; {settlement}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-2 p-1 text-[var(--text-4)] hover:text-white transition-colors cursor-pointer"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Fixed price callout */}
            <div className="px-6 pt-5 pb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
                  Fixed price
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[10px] font-mono text-[var(--text-3)]">
                  {quote} per {base}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl text-[var(--cyan)] tabular-nums">
                  {price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Amount input */}
            <div className="px-6 pb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="fixed-offer-amount"
                  className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]"
                >
                  Amount
                </label>
                <span className="text-[10px] font-sans text-[var(--text-4)]">
                  Available{" "}
                  <span className="font-mono text-[var(--text-2)] tabular-nums">
                    {formatMoney(available)}
                  </span>{" "}
                  {base}
                </span>
              </div>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="fixed-offer-amount"
                  type="text"
                  inputMode="decimal"
                  value={amount ? formatMoney(amount).replace(/\.00$/, "") : ""}
                  onChange={(e) => setAmount(sanitizeNumeric(e.target.value))}
                  placeholder="0"
                  aria-invalid={invalid}
                  className={
                    "w-full bg-[var(--bg-highest,#0f0f10)] border rounded-md px-3 py-2.5 pr-16 font-mono text-base text-white placeholder:text-[var(--text-4)] outline-none transition-colors " +
                    (overLimit
                      ? "border-[var(--red)] focus:border-[var(--red)]"
                      : "border-[var(--border)] focus:border-[var(--border-outline)]")
                  }
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[var(--text-4)] pointer-events-none">
                  {base}
                </span>
              </div>
              {/* Quick picks */}
              <div className="flex gap-1.5 mt-2">
                {[0.25, 0.5, 1].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickPick(pct)}
                    className="flex-1 py-1.5 rounded border border-[var(--border)] text-[10px] font-sans font-medium text-[var(--text-3)] hover:border-[var(--border-outline)] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
                  >
                    {pct === 1 ? "Max" : `${pct * 100}%`}
                  </button>
                ))}
              </div>
              {overLimit && (
                <p className="mt-2 text-[11px] font-sans text-[var(--red)]">
                  Exceeds available inventory ({formatMoney(available)} {base}).
                </p>
              )}
            </div>

            {/* Counter (you pay / you receive) — read-only */}
            <div className="px-6 pb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
                  {counterLabel}
                </span>
              </div>
              <div className="relative">
                <div
                  aria-readonly="true"
                  className="w-full bg-[rgba(255,255,255,0.02)] border border-[var(--border)] rounded-md px-3 py-2.5 pr-16 font-mono text-base text-[var(--text-2)] tabular-nums"
                >
                  {formatThousands(notional)}
                </div>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[var(--text-4)] pointer-events-none">
                  {quote}
                </span>
              </div>
            </div>

            {/* Summary row */}
            <div className="px-6 py-4 border-t border-[var(--border)] bg-[rgba(255,255,255,0.015)] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="text-[var(--text-4)]">Settlement</span>
                <span className="font-mono text-[var(--text-2)]">{settlement}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans">
                <span className="text-[var(--text-4)]">Fee</span>
                <span className="font-mono text-[var(--text-2)] tabular-nums">
                  {(fee * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-sans pt-1 border-t border-[var(--border)] mt-1">
                <span className="text-[var(--text-3)]">Total</span>
                <span className="font-mono tabular-nums text-white">
                  {formatThousands(total)}{" "}
                  <span className="text-[var(--text-4)]">{quote}</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-[var(--border)] grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                ref={confirmRef}
                variant="cyan"
                disabled={invalid}
                onClick={handleConfirm}
              >
                <span className="font-sans text-[11px] font-bold uppercase tracking-[.1em]">
                  {ctaLabel}
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
