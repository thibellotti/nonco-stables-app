"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { balances, usdRates } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";
import { currencyColors } from "@/lib/currency-colors";

// Simple rows per client feedback (Apr 17 + Apr 24):
// - graphs removed
// - banks / "Tether" subtitle removed
// - % change removed
// Result: badge + currency code + value only.

export function StableAssetsList() {
  return (
    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col h-full min-h-[280px]">
      <header className="flex items-center justify-between px-6 pt-6 pb-3">
        <SectionLabel>Stable Assets</SectionLabel>
        <Link
          href="/fx"
          className="text-[11px] font-sans text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
        >
          View wallet &rarr;
        </Link>
      </header>

      {/* Lighter dividers (border-subtle) for a quieter list feel.
          Tighter row spacing — values right-aligned in mono so columns scan
          vertically without effort. */}
      <ul className="divide-y divide-[var(--border-subtle)] flex-1 flex flex-col">
        {balances.map((b) => {
          const usdValue = (b.available + b.pending) * (usdRates[b.currency] ?? 1);
          const accent = currencyColors[b.currency]?.border ?? "rgba(255,255,255,0.5)";

          return (
            <li key={b.currency} className="flex-1 flex">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-6 py-2.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-200 ease-out text-left cursor-pointer"
              >
                {/* Currency badge */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}28` }}
                >
                  <span className="font-mono text-[10px]" style={{ color: accent }}>
                    {b.currency.slice(0, 2)}
                  </span>
                </div>

                {/* Currency code */}
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs font-medium text-[var(--text)] tracking-tight">
                    {b.currency}
                  </span>
                </div>

                {/* USD value — right-aligned, font-medium for prominence */}
                <span className="font-mono text-xs font-medium text-[var(--text)] tabular-nums shrink-0">
                  ${formatMoney(usdValue)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
