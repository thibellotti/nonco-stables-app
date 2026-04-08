"use client";

import { useState } from "react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { RfsDialog } from "@/components/rfs/rfs-dialog";
import { GeoDivider } from "@/components/ui/geo-divider";


// ---------------------------------------------------------------------------
// Quick actions — large, prominent buttons (main functionality)
// ---------------------------------------------------------------------------

const actions = [
  { label: "Send", href: null, icon: <path d="M6 14L14 6M14 6H8M14 6v6" />, description: "Transfer stablecoins" },
  { label: "Receive", href: null, icon: <path d="M14 6L6 14M6 14h6M6 14V8" />, description: "Deposit funds" },
  { label: "Convert", href: "/fx" as const, icon: <path d="M4 8h12M16 8l-3-3M16 12H4M4 12l3 3" />, description: "FX swap" },
  { label: "Earn", href: "/yield" as const, icon: <path d="M3 14l4-5 4 2.5L17 5M13 5h4v4" />, description: "Yield vaults" },
];

// ---------------------------------------------------------------------------
// Section navigation cards — the 4 main sections
// ---------------------------------------------------------------------------

const sectionCards = [
  {
    label: "Trading",
    description: "FX Stables & Recent Activity",
    href: "/fx",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 15L7 11L11 13L21 5" />
        <path d="M17 5h4v4" />
      </svg>
    ),
  },
  {
    label: "DeFi & On-Chain",
    description: "FX Onchain, Bridge & Yield",
    href: "/onchain",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      </svg>
    ),
  },
  {
    label: "Swap & Send",
    description: "Payments & Third Party",
    href: "/payments",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M8 9l4-4 4 4" />
      </svg>
    ),
  },
  {
    label: "Settlements",
    description: "Pending & completed",
    href: "/settlements",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 12l3 3 5-5" />
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
      {/* Hero */}
      <BalanceHero />

      {/* Quick actions — large cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a) => {
          const inner = (
            <div className="flex flex-col items-center gap-2.5 px-4 py-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.06)] group-hover:bg-[rgba(5,224,248,0.1)] flex items-center justify-center transition-colors">
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-2)] group-hover:text-[var(--cyan)] transition-colors">{a.icon}</svg>
              </div>
              <span className="text-sm font-sans font-semibold text-[var(--text)] group-hover:text-white transition-colors">{a.label}</span>
              <span className="text-[10px] font-sans text-[var(--text-4)]">{a.description}</span>
            </div>
          );
          if (a.href) return <Link key={a.label} href={a.href}>{inner}</Link>;
          return <button key={a.label} type="button" className="text-left">{inner}</button>;
        })}
      </div>

      <GeoDivider variant="squares" className="my-6" />

      {/* Section navigation cards — 4 main sections */}
      <div>
        <div className="flex items-center px-1 mb-3">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
            Explore
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {sectionCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--border-outline)] hover:bg-[rgba(255,255,255,0.02)] transition-all"
            >
              <div className="text-[var(--text-4)] group-hover:text-[var(--cyan)] transition-colors mb-3">
                {card.icon}
              </div>
              <div className="text-sm font-sans font-semibold text-[var(--text)] group-hover:text-white transition-colors">
                {card.label}
              </div>
              <div className="text-[11px] font-sans text-[var(--text-4)] mt-1">
                {card.description}
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute top-4 right-4 text-[var(--text-4)] group-hover:text-[var(--cyan)] transition-colors" aria-hidden="true">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <GeoDivider variant="dots" className="my-6" />

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
            Recent Activity
          </span>
          <Link
            href="/bank"
            className="text-[11px] font-sans text-white hover:opacity-70 transition-colors"
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
