"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface UnderConstructionDialogProps {
  open: boolean;
  feature: string;
  description?: string;
  onClose: () => void;
}

export function UnderConstructionDialog({
  open,
  feature,
  description,
  onClose,
}: UnderConstructionDialogProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${feature} — under construction`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[400px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Icon */}
            <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-[var(--cyan-dim)] border border-[rgba(5,224,248,0.2)] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" />
              </svg>
            </div>

            <h2 className="text-base font-sans text-[var(--text)] text-center mb-2">
              {feature} is under construction
            </h2>
            <p className="text-xs font-sans text-[var(--text-3)] text-center leading-relaxed mb-6">
              {description ?? "We're building this feature. Check back soon."}
            </p>

            <Button variant="cyan" onClick={onClose} className="w-full">
              <span className="font-sans text-[11px] uppercase tracking-[.12em]">Got it</span>
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
