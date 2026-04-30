"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DeskOffer } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

interface DeskOfferDialogProps {
  open: boolean;
  offer: DeskOffer | null;
  onConfirm: (offer: DeskOffer, quantity: number) => void;
  onClose: () => void;
}

const SETTLEMENT_LABELS: Record<DeskOffer["settlement"], string> = {
  Spot: "Spot (T+0)",
  TOM: "Tomorrow (TOM)",
  "T+1": "T+1",
  "T+2": "T+2",
};

function sanitizeNumeric(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits === "" ? 0 : Number(digits);
}

export function DeskOfferDialog({ open, offer, onConfirm, onClose }: DeskOfferDialogProps) {
  const [quantity, setQuantity] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Reset on open/offer change: default to full available.
  useEffect(() => {
    if (open && offer) {
      setQuantity(offer.availableQty);
      const t = setTimeout(() => inputRef.current?.select(), 80);
      return () => clearTimeout(t);
    }
  }, [open, offer]);

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

  const max = offer?.availableQty ?? 0;
  const overLimit = quantity > max;
  const belowMin = quantity <= 0;
  const invalid = overLimit || belowMin;

  const baseAsset = offer?.pair.split("/")[0] ?? "";
  const quoteAsset = offer?.pair.split("/")[1] ?? "";
  const totalNotional = useMemo(
    () => (offer ? quantity * offer.price : 0),
    [offer, quantity],
  );

  const handleQuickPick = useCallback(
    (pct: number) => {
      if (!offer) return;
      setQuantity(Math.floor(offer.availableQty * pct));
    },
    [offer],
  );

  return (
    <AnimatePresence>
      {open && offer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Trade ${offer.pair} at ${offer.price}`}
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
                    Trade
                  </h2>
                  <p className="text-[11px] font-mono text-[var(--text-3)]">
                    {offer.pair} · {SETTLEMENT_LABELS[offer.settlement]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-2 p-1 text-[var(--text-4)] hover:text-white transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Fixed price callout */}
            <div className="px-6 pt-5 pb-4">
              <div className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] mb-1.5">
                Desk price — fixed
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl text-[var(--cyan)] tabular-nums">
                  {offer.price.toFixed(2)}
                </span>
                <span className="text-[11px] font-sans text-[var(--text-3)]">
                  {quoteAsset} per 1 {baseAsset}
                </span>
              </div>
            </div>

            {/* Quantity input */}
            <div className="px-6 pb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="desk-offer-quantity"
                  className="text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]"
                >
                  Quantity
                </label>
                <span className="text-[10px] font-sans text-[var(--text-4)]">
                  Max{" "}
                  <span className="font-mono text-[var(--text-2)] tabular-nums">
                    {formatMoney(offer.availableQty)}
                  </span>{" "}
                  {baseAsset}
                </span>
              </div>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="desk-offer-quantity"
                  type="text"
                  inputMode="numeric"
                  value={quantity ? formatMoney(quantity).replace(/\.00$/, "") : ""}
                  onChange={(e) => setQuantity(sanitizeNumeric(e.target.value))}
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
                  {baseAsset}
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
                  Exceeds available inventory ({formatMoney(max)} {baseAsset}).
                </p>
              )}
            </div>

            {/* Total notional */}
            <div className="px-6 py-4 border-t border-[var(--border)] bg-[rgba(255,255,255,0.015)]">
              <div className="flex items-center justify-between text-[12px] font-sans">
                <span className="text-[var(--text-3)]">Est. total</span>
                <span className="font-mono tabular-nums text-white">
                  {formatMoney(totalNotional)}{" "}
                  <span className="text-[var(--text-4)]">{quoteAsset}</span>
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
                onClick={() => offer && onConfirm(offer, quantity)}
              >
                <span className="font-sans text-[11px] font-bold uppercase tracking-[.1em]">
                  Confirm trade
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
