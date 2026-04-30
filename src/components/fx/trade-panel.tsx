"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RfsForm, settlementLabel, type RfsFormState } from "@/components/rfs/rfs-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TradePanelProps {
  /** Pair the panel is locked to — drives the form's defaultInstrument. */
  pair: string;
  /** Close the panel (clears the parent's selection state). */
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TradePanel — inline side panel for /fx desktop
//
// Layout: sticky to the top of the cards grid (just below the global header)
// so the panel scrolls with the page until it pins, then stays in view while
// the user scans the cards. The panel itself is internally scrollable when
// content overflows.
//
// Accessibility: this is a peek panel, not a modal — no focus trap, no
// backdrop. Cards remain clickable; clicking another pair updates the
// panel content in place via the `pair` prop. ESC + close button clear it.
// ---------------------------------------------------------------------------

export function TradePanel({ pair, onClose }: TradePanelProps) {
  const shouldReduceMotion = useReducedMotion();

  // Mirror form state so the slim header can show the live settlement badge
  // alongside the pair name (matches the dialog's pattern). The form drives
  // this via onStateChange; we initialise to the current pair so the first
  // paint shows the right header even before the form reports its state.
  const [formState, setFormState] = useState<RfsFormState>({
    pair,
    settlement: "spot",
    tenor: "1M",
  });

  // ESC closes the panel — same gesture as the dialog so muscle memory works.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.aside
      role="region"
      aria-label="Trade panel"
      initial={shouldReduceMotion ? false : { x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { x: 40, opacity: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]"
    >
      {/* Slim header — mirrors the dialog's header treatment but tighter.
          Sticks to the top of the panel so it stays visible during internal
          scroll. Same hairline border as the dialog. */}
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-5 py-4 lg:px-6 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-start gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)] shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-[13px] font-sans font-medium tracking-tight text-[var(--text)] truncate">
              {formState.pair.replace("/", " / ")}
            </h2>
            <p className="mt-0.5 text-[10px] font-sans uppercase tracking-[.15em] text-[var(--text-4)] truncate">
              {settlementLabel(formState.settlement)}
              {formState.settlement === "forward" && (
                <>
                  <span className="mx-1.5">·</span>
                  {formState.tenor}
                </>
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close trade panel"
          className="-mr-1 p-1.5 rounded-md text-[var(--text-4)] hover:text-[var(--text-2)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cyan)]"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Shared form body. `key=pair` forces a fresh remount + timer reset
          when switching between cards so prices reflect the new pair from
          the first frame instead of jittering on stale state. */}
      <RfsForm
        key={pair}
        defaultInstrument={pair}
        onClose={onClose}
        compact
        onStateChange={setFormState}
      />
    </motion.aside>
  );
}
