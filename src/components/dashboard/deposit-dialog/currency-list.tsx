"use client";

import { useMemo, useState } from "react";
import { CRYPTO_CURRENCIES } from "./data";

interface CurrencyListProps {
  recent: string[]; // symbols
  onSelect: (symbol: string) => void;
}

// Step 1 — pick a crypto currency. Recent at top, then full list.
export function CurrencyList({ recent, onSelect }: CurrencyListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CRYPTO_CURRENCIES;
    return CRYPTO_CURRENCIES.filter(
      (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [query]);

  const recentCurrencies = useMemo(
    () => recent.map((sym) => CRYPTO_CURRENCIES.find((c) => c.symbol === sym)).filter(Boolean) as typeof CRYPTO_CURRENCIES,
    [recent],
  );

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="px-6 pt-4 pb-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search currency…"
            aria-label="Search currency"
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md pl-9 pr-3 py-2 text-[12px] font-sans text-[var(--text)] placeholder-[var(--text-4)] focus:outline-none focus:border-[var(--border-outline)] transition-colors"
          />
        </div>
      </div>

      {/* Recent */}
      {recentCurrencies.length > 0 && query.length === 0 && (
        <div className="px-6 pb-3">
          <p className="text-[10px] font-sans uppercase tracking-[.15em] text-[var(--text-3)] mb-2">
            Recent
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recentCurrencies.map((c) => (
              <button
                key={c.symbol}
                type="button"
                onClick={() => onSelect(c.symbol)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-outline)] transition-colors cursor-pointer"
              >
                <CurrencyDot symbol={c.symbol} />
                <span className="text-[12px] font-sans text-[var(--text)]">{c.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All currencies */}
      <div className="px-6 pb-1">
        <p className="text-[10px] font-sans uppercase tracking-[.15em] text-[var(--text-3)] mb-1">
          {query.length > 0 ? "Results" : "All currencies"}
        </p>
      </div>

      <div role="listbox" aria-label="Available currencies" className="px-2 pb-3">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-[12px] font-sans text-[var(--text-3)]">
            No currencies match &ldquo;{query}&rdquo;
          </p>
        ) : (
          filtered.map((c) => (
            <button
              key={c.symbol}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => onSelect(c.symbol)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-md hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CurrencyDot symbol={c.symbol} />
                <div className="min-w-0">
                  <div className="text-[13px] font-sans text-[var(--text)] leading-tight">
                    {c.symbol}
                  </div>
                  <div className="text-[11px] font-sans text-[var(--text-3)] leading-tight truncate">
                    {c.name}
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-[10px] font-sans text-[var(--text-4)]">
                {c.networks.length} network{c.networks.length === 1 ? "" : "s"}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// Lightweight first-letter "logo" — keeps the file dependency-free and
// consistent with the dark-theme palette. Replace with real icons when ready.
function CurrencyDot({ symbol }: { symbol: string }) {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 size-7 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[10px] font-mono text-[var(--text-2)]"
    >
      {symbol.slice(0, 2)}
    </div>
  );
}
