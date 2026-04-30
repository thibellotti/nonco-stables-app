"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { boardInstruments, boardSections, type BoardInstrument } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface WidgetPickerDialogProps {
  open: boolean;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function WidgetPickerDialog({
  open,
  selectedIds,
  onToggle,
  onClose,
}: WidgetPickerDialogProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? boardInstruments.filter((i) => i.pair.toLowerCase().includes(q))
      : boardInstruments;
    const bySection = new Map<string, BoardInstrument[]>();
    for (const inst of filtered) {
      const list = bySection.get(inst.section) ?? [];
      list.push(inst);
      bySection.set(inst.section, list);
    }
    return bySection;
  }, [search]);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add cards to dashboard"
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
            className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-white font-sans">Add card</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-[var(--text-4)] hover:text-white transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>

              <div className="relative">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search instruments..."
                  className="w-full bg-[var(--bg-highest,#18181b)] border border-[var(--border)] rounded-md pl-8 pr-3 py-2 text-xs font-sans text-white outline-none focus:border-[var(--border-outline)] placeholder:text-[var(--text-4)]"
                />
              </div>
            </div>

            {/* List — scrollable */}
            <div className="max-h-[420px] overflow-y-auto">
              {grouped.size === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-[var(--text-4)]">No pairs match &quot;{search}&quot;</p>
                </div>
              ) : (
                [...grouped.entries()].map(([sectionId, items]) => {
                  const section = boardSections[sectionId];
                  return (
                    <div key={sectionId} className="py-2">
                      <div className="px-5 py-1.5 text-[10px] uppercase tracking-[.15em] font-sans text-[var(--text-4)] flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: section?.color ?? "#fff" }}
                        />
                        {section?.label ?? sectionId}
                      </div>
                      {items.map((inst) => {
                        const active = selectedIds.has(inst.id);
                        return (
                          <button
                            key={inst.id}
                            type="button"
                            onClick={() => onToggle(inst.id)}
                            className={cn(
                              "w-full flex items-center justify-between px-5 py-2 text-left transition-colors cursor-pointer",
                              active
                                ? "bg-[rgba(5,224,248,0.04)] hover:bg-[rgba(5,224,248,0.08)]"
                                : "hover:bg-[rgba(255,255,255,0.03)]",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="font-mono text-sm"
                                style={{ color: active ? "var(--cyan)" : "var(--text)" }}
                              >
                                {inst.pair}
                              </span>
                              <span className="font-mono text-[10px] text-[var(--text-4)] tabular-nums">
                                {inst.buy > 100 ? inst.buy.toFixed(2) : inst.buy.toFixed(4)}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                active
                                  ? "bg-[var(--cyan)] border-[var(--cyan)]"
                                  : "border-[var(--border-outline)]",
                              )}
                              aria-hidden="true"
                            >
                              {active && (
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 5l2 2 4-4" />
                                </svg>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-[10px] font-sans text-[var(--text-4)]">
                <span className="font-mono text-[var(--text-3)]">{selectedIds.size}</span>{" "}
                selected
              </span>
              <button
                onClick={onClose}
                className="text-[11px] font-sans font-medium text-white hover:opacity-70 transition-opacity cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
