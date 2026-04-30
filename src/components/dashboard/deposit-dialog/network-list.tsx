"use client";

import type { Currency, Network } from "./data";

interface NetworkListProps {
  currency: Currency;
  onSelect: (network: Network) => void;
}

// Step 2 — pick a network for the chosen currency.
export function NetworkList({ currency, onSelect }: NetworkListProps) {
  return (
    <div className="flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <p className="text-[11px] font-sans text-[var(--text-3)]">
          Choose the network you&apos;ll send {currency.symbol} on. The network must match
          the sender — wrong-network transfers cannot be recovered.
        </p>
      </div>

      <div role="listbox" aria-label={`Networks for ${currency.symbol}`} className="px-2 py-2">
        {currency.networks.map((n) => (
          <button
            key={n.id}
            type="button"
            role="option"
            aria-selected={false}
            onClick={() => onSelect(n)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-md hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer text-left"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-sans text-[var(--text)] leading-tight">
                  {n.name}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-3)] px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border)]">
                  {n.abbr}
                </span>
              </div>
              <div className="text-[11px] font-sans text-[var(--text-3)] leading-tight mt-1">
                <span className="font-mono">{n.confirmations}</span>{" "}
                confirmation{n.confirmations === 1 ? "" : "s"}
                <span className="text-[var(--text-4)] mx-1.5">·</span>
                Min:{" "}
                <span className="font-mono text-[var(--text-2)]">{n.minDeposit}</span>
                <span className="text-[var(--text-4)] mx-1.5">·</span>
                <span className="font-mono">{n.arrival}</span>
              </div>
            </div>
            <svg
              className="shrink-0 text-[var(--text-4)]"
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
