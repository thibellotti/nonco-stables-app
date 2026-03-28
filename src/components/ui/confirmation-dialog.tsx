"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConfirmationDialogProps {
  open: boolean;
  side: "buy" | "sell";
  pair: string;
  price: number;
  settlement: string;
  quantity?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function BuyIcon() {
  return (
    <div className="w-14 h-14 mx-auto rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
      <svg
        className="w-7 h-7"
        style={{ color: "white" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

function SellIcon() {
  return (
    <div className="w-14 h-14 mx-auto rounded-full bg-[var(--purple)]/10 flex items-center justify-center">
      <svg
        className="w-7 h-7"
        style={{ color: "var(--purple)" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail Row
// ---------------------------------------------------------------------------

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
      <span className="text-sm text-[var(--text-3)] font-sans">{label}</span>
      <span
        className={cn(
          "text-sm font-medium text-[var(--text)]",
          mono && "font-mono tabular-nums"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConfirmationDialog
// ---------------------------------------------------------------------------

export function ConfirmationDialog({
  open,
  side,
  pair,
  price,
  settlement,
  quantity = 100_000,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const dialogPanelRef = useRef<HTMLDivElement>(null);

  // Auto-focus confirm button when dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to let the animation start before focusing
      const timer = setTimeout(() => {
        confirmRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape key to cancel
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  // Focus trap — keep Tab cycling within dialog
  useEffect(() => {
    if (!open) return;
    const dialog = dialogPanelRef.current;
    if (!dialog) return;

    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  const isBuy = side === "buy";
  const estimatedValue = quantity * price;

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Confirm ${isBuy ? "Buy" : "Sell"}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            ref={dialogPanelRef}
            className="relative w-full max-w-[420px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8"
          >
            {/* Icon */}
            <div className="mb-5">
              {isBuy ? <BuyIcon /> : <SellIcon />}
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-white text-center mb-6 font-sans">
              Confirm {isBuy ? "Buy" : "Sell"}
            </h2>

            {/* Details grid */}
            <div className="mb-8">
              <DetailRow label="Pair" value={pair} />
              <DetailRow label="Price" value={price.toFixed(4)} mono />
              <DetailRow label="Settlement" value={settlement} />
              <DetailRow label="Quantity" value={formatMoney(quantity)} mono />
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-[var(--text-3)] font-sans">
                  Estimated value
                </span>
                <span className="text-sm font-bold text-white font-mono tabular-nums">
                  ${formatMoney(estimatedValue)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={onCancel} className="py-3">
                Cancel
              </Button>
              {isBuy ? (
                <Button
                  ref={confirmRef}
                  variant="cyan"
                  onClick={onConfirm}
                  className="py-3 uppercase tracking-wider"
                >
                  Confirm Buy
                </Button>
              ) : (
                <button
                  ref={confirmRef}
                  onClick={onConfirm}
                  className="rounded-full py-3 text-sm font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 border border-[var(--purple)] text-[var(--purple)] hover:bg-[var(--purple-dim)]"
                >
                  Confirm Sell
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
