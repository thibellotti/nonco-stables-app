"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { instruments } from "@/lib/mock-data";
import {
  RfsForm,
  settlementLabel,
  type RfsFormState,
} from "./rfs-form";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RfsDialogProps {
  open: boolean;
  onClose: () => void;
  defaultInstrument?: string;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
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
// RfsDialog — overlay + animated card. Body is the shared <RfsForm>.
// Keeps body-scroll lock + ESC handling. The form remounts on each open
// (key=defaultInstrument-when-open) so all state resets naturally.
// ---------------------------------------------------------------------------

export function RfsDialog({ open, onClose, defaultInstrument }: RfsDialogProps) {
  const shouldReduceMotion = useReducedMotion();

  // Body scroll lock
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

  // ESC to close
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
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl backdrop-saturate-150"
            onClick={onClose}
          />

          {/* Panel — remounts each open via key, so RfsForm state resets */}
          <RfsDialogShell
            key={defaultInstrument ?? "default"}
            defaultInstrument={defaultInstrument}
            onClose={onClose}
            shouldReduceMotion={!!shouldReduceMotion}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Inner shell — animated card chrome + live header subtitle
// ---------------------------------------------------------------------------

function RfsDialogShell({
  defaultInstrument,
  onClose,
  shouldReduceMotion,
}: {
  defaultInstrument?: string;
  onClose: () => void;
  shouldReduceMotion: boolean;
}) {
  // Mirror the form's live state so the header subtitle stays in sync
  // when the user changes the instrument selector or settlement tabs.
  const initialPair = defaultInstrument ?? instruments[0].pair;
  const [formState, setFormState] = useState<RfsFormState>({
    pair: initialPair,
    settlement: "spot",
    tenor: "1M",
  });

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--border)]">
        <div className="flex items-start gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]"
          />
          <div className="min-w-0">
            <h2 className="text-[15px] font-sans font-medium tracking-tight text-[var(--text)]">
              Request for Stream
            </h2>
            <p className="mt-0.5 text-[11px] font-sans text-[var(--text-3)] tabular-nums truncate">
              {formState.pair.replace("/", " / ")}
              <span className="mx-1.5 text-[var(--text-4)]">·</span>
              {settlementLabel(formState.settlement)}
              {formState.settlement === "forward" && (
                <>
                  <span className="mx-1.5 text-[var(--text-4)]">·</span>
                  {formState.tenor}
                </>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="ml-4 -mr-1 p-1.5 rounded-md text-[var(--text-4)] hover:text-[var(--text-2)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--cyan)]"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Shared form body + summary footer */}
      <RfsForm
        defaultInstrument={defaultInstrument}
        onClose={onClose}
        onStateChange={setFormState}
      />
    </motion.div>
  );
}
