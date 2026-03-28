"use client";

import { useState } from "react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { CurrencyBreakdown } from "@/components/dashboard/currency-breakdown";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { MarketWatch } from "@/components/dashboard/market-watch";
import { RfsDialog } from "@/components/rfs/rfs-dialog";

// ---------------------------------------------------------------------------
// Inline quick actions — no separate component
// ---------------------------------------------------------------------------

const actions = [
  {
    label: "Send",
    href: null,
    color: "#f9e220",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 14L14 6M14 6H8M14 6v6" />
      </svg>
    ),
  },
  {
    label: "Receive",
    href: null,
    color: "#22C55E",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 6L6 14M6 14h6M6 14V8" />
      </svg>
    ),
  },
  {
    label: "Convert",
    href: "/fx",
    color: "#05E0F8",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h12M16 8l-3-3M16 12H4M4 12l3 3" />
      </svg>
    ),
  },
  {
    label: "Earn",
    href: "/yield",
    color: "#a124f8",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14l4-5 4 2.5L17 5M13 5h4v4" />
      </svg>
    ),
  },
  {
    label: "Deposit",
    href: null,
    color: "#e5e2e1",
    icon: (
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 4v12M10 16l-4-4M10 16l4-4" />
        <path d="M4 4h12" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const [rfsOpen, setRfsOpen] = useState(false);
  const [rfsInstrument, setRfsInstrument] = useState<string | undefined>();

  function handleRequestRfs(pair: string) {
    setRfsInstrument(pair);
    setRfsOpen(true);
  }

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-4">
      {/* Hero + Quick Actions — visually attached */}
      <div>
        <BalanceHero />

        {/* Actions row */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none pb-1">
          {actions.map((a) => {
            const pill = (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] text-[12px] font-sans font-medium text-[var(--text-2)] hover:text-white transition-colors whitespace-nowrap cursor-pointer">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${a.color} 15%, transparent)`,
                    color: a.color,
                  }}
                >
                  {a.icon}
                </span>
                {a.label}
              </span>
            );

            if (a.href) {
              return (
                <Link key={a.label} href={a.href}>
                  {pill}
                </Link>
              );
            }

            return (
              <button key={a.label} type="button">
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento middle row — Stable Assets (3col) + Market Watch (2col) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <CurrencyBreakdown />
        </div>
        <div className="lg:col-span-2">
          <MarketWatch onRequestRfs={handleRequestRfs} />
        </div>
      </div>

      {/* Recent Activity — compact, borderless header */}
      <div className="rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
            Recent Activity
          </span>
          <Link
            href="/bank"
            className="text-[11px] font-sans text-[var(--cyan)] hover:text-white transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <TransactionList filter="all" limit={4} />
        </div>
      </div>

      {/* RFS Dialog */}
      <RfsDialog
        open={rfsOpen}
        onClose={() => setRfsOpen(false)}
        defaultInstrument={rfsInstrument}
      />
    </PageTransition>
  );
}
