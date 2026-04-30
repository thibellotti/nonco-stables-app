"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/ui/page-transition";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { StableAssetsList } from "@/components/dashboard/stable-assets-list";
import { DeskOfferBanner } from "@/components/ui/desk-offer-banner";

// Dynamic + ssr:false: both MarketWatchWidget and TransactionList consume
// hydration-sensitive state (favorites Zustand persist, mock-data Date()
// timestamps). Rendering client-only eliminates the SSR/CSR mismatch that
// was leaking 3 orphan cards + a duplicate Recent Activity directly to
// <body> (React error #418). Forensic: Apr 30 session.
const MarketWatchWidget = dynamic(
  () => import("@/components/dashboard/market-watch-widget").then((m) => ({ default: m.MarketWatchWidget })),
  {
    ssr: false,
    loading: () => (
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 sm:p-5 min-h-[260px]" />
    ),
  },
);
const TransactionList = dynamic(
  () => import("@/components/dashboard/transaction-list").then((m) => ({ default: m.TransactionList })),
  {
    ssr: false,
    loading: () => <div className="min-h-[200px]" />,
  },
);
import { DepositDialog } from "@/components/dashboard/deposit-dialog";
import { UnderConstructionDialog } from "@/components/dashboard/under-construction-dialog";

const RfsDialog = dynamic(
  () => import("@/components/rfs/rfs-dialog").then((mod) => ({ default: mod.RfsDialog })),
  { ssr: false }
);

// Quick actions — order matters per client spec (Apr 17/24):
// Convert (primary) | Deposit | Send | Earn (under construction).
// Deposit replaced "Receive" and moved next to Convert.

type ActionKey = "deposit" | "send" | "earn";

const supportingActions: Array<{
  key: ActionKey;
  label: string;
  description: string;
  iconPath: string;
}> = [
  { key: "deposit", label: "Deposit", description: "Bank wires & wallets", iconPath: "M14 6L6 14M6 14h6M6 14V8" },
  { key: "send", label: "Send", description: "Transfer stablecoins", iconPath: "M6 14L14 6M14 6H8M14 6v6" },
  { key: "earn", label: "Earn", description: "Yield vaults", iconPath: "M3 14l4-5 4 2.5L17 5M13 5h4v4" },
];

export default function DashboardPage() {
  const [rfsOpen, setRfsOpen] = useState(false);
  const [rfsInstrument, setRfsInstrument] = useState<string | undefined>();
  const [depositOpen, setDepositOpen] = useState(false);
  const [earnOpen, setEarnOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  function openRfs(pair?: string) {
    setRfsInstrument(pair);
    setRfsOpen(true);
  }

  function handleAction(key: ActionKey) {
    if (key === "deposit") setDepositOpen(true);
    else if (key === "earn") setEarnOpen(true);
    else if (key === "send") setSendOpen(true);
  }

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full space-y-5 lg:space-y-6">
      <h1 className="sr-only">Dashboard</h1>
      {/* ── Top desk-offer banner (one-sided fixed-price offer — NOT an RFS stream) ── */}
      <DeskOfferBanner />

      {/* ── Top row: Portfolio (left) + Stable assets list (right).
          At xl+ widths the portfolio chart breathes by widening to 1.6fr so
          the globe and headline number have room without crowding the assets
          list. ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.6fr_1fr] gap-4 lg:gap-5 items-stretch">
        <BalanceHero />
        <StableAssetsList />
      </div>

      {/* ── Primary CTA: Convert (the main product for stables, prominent).
          Quiet-luxury treatment: subtle cyan tint on Convert (not a saturated
          fill), supporting actions sit on near-flat surfaces with hairline
          borders and align horizontally so the row reads as a unit. ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-3">
        {/* Convert — primary CTA. Lower saturation, thin cyan accent ring,
            horizontal layout so the supporting actions can match height. */}
        <Link
          href="/fx"
          className="group flex items-center gap-4 px-5 py-5 rounded-xl bg-[rgba(5,224,248,0.04)] border border-[rgba(5,224,248,0.18)] hover:bg-[rgba(5,224,248,0.07)] hover:border-[rgba(5,224,248,0.32)] transition-colors duration-200 ease-out cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-[rgba(5,224,248,0.1)] group-hover:bg-[rgba(5,224,248,0.16)] flex items-center justify-center transition-colors shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 8h12M16 8l-3-3M16 12H4M4 12l3 3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-sans font-medium text-[var(--text)] tracking-tight">Convert</span>
              <span className="text-[9px] font-sans font-medium uppercase tracking-[.12em] text-[var(--cyan)]">Primary</span>
            </div>
            <span className="text-xs font-sans text-[var(--text-3)] mt-1 block">FX swap between stablecoins, fiat & crypto</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" className="shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 ease-out" aria-hidden="true">
            <path d="M5 3l5 5-5 5" />
          </svg>
        </Link>

        {/* Supporting actions — Deposit / Send / Earn. Horizontal layout
            mirrors Convert's anatomy (icon + label + description) so the row
            reads consistently. Hairline borders, calm hover. */}
        {supportingActions.map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => handleAction(a.key)}
            className="group flex items-center gap-4 px-5 py-5 rounded-xl bg-[rgba(255,255,255,0.015)] border border-[var(--border)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[var(--border-outline)] transition-colors duration-200 ease-out cursor-pointer text-left"
          >
            <span className="w-11 h-11 rounded-full bg-[rgba(255,255,255,0.04)] group-hover:bg-[rgba(255,255,255,0.08)] flex items-center justify-center transition-colors shrink-0">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-2)] group-hover:text-[var(--text)] transition-colors" aria-hidden="true">
                <path d={a.iconPath} />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <span className="block text-[15px] font-sans font-medium text-[var(--text)] tracking-tight">{a.label}</span>
              <span className="block text-xs font-sans text-[var(--text-3)] mt-1">{a.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Market Watch (personalised) ── */}
      <MarketWatchWidget onRequestRfs={openRfs} />

      {/* ── Recent Activity ── */}
      <section aria-labelledby="recent-activity-heading" className="pt-2">
        <header className="flex items-center justify-between px-1 mb-3">
          <h2 id="recent-activity-heading" className="text-[11px] uppercase tracking-[.15em] font-sans font-medium text-[var(--text-4)]">
            Recent Activity
          </h2>
          <Link
            href="/trades"
            className="text-[11px] font-sans text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
          >
            View all &rarr;
          </Link>
        </header>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <TransactionList filter="all" limit={4} />
        </div>
      </section>

      {/* RFS Dialog */}
      <Suspense fallback={<div className="fixed inset-0 pointer-events-none" aria-hidden="true" />}>
        <RfsDialog
          open={rfsOpen}
          onClose={() => setRfsOpen(false)}
          defaultInstrument={rfsInstrument}
        />
      </Suspense>

      {/* Deposit dialog (bank details + wallet addresses) */}
      <DepositDialog open={depositOpen} onClose={() => setDepositOpen(false)} />

      {/* Earn — under construction */}
      <UnderConstructionDialog
        open={earnOpen}
        feature="Earn"
        description="Yield vaults coming soon. We're integrating with treasury rate providers across MXN, EUR, and USD."
        onClose={() => setEarnOpen(false)}
      />

      {/* Send — under construction (placeholder until full wire flow ships) */}
      <UnderConstructionDialog
        open={sendOpen}
        feature="Send"
        description="Outbound transfers will support fiat wires and on-chain stablecoin sends. Available in the next release."
        onClose={() => setSendOpen(false)}
      />
    </PageTransition>
  );
}
