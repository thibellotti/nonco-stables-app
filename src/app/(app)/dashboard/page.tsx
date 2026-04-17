"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageTransition } from "@/components/ui/page-transition";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { StableAssetsList } from "@/components/dashboard/stable-assets-list";
import { MarketWatchWidget } from "@/components/dashboard/market-watch-widget";
import { DeskOfferBanner } from "@/components/ui/desk-offer-banner";
import { GeoDivider } from "@/components/ui/geo-divider";

const RfsDialog = dynamic(
  () => import("@/components/rfs/rfs-dialog").then((mod) => ({ default: mod.RfsDialog })),
  { ssr: false }
);

// ---------------------------------------------------------------------------
// Quick actions — Convert is primary (the main thing for stables, per client feedback).
// Send / Receive / Earn are supporting actions.
// ---------------------------------------------------------------------------

const supportingActions = [
  { label: "Send", href: null, icon: <path d="M6 14L14 6M14 6H8M14 6v6" />, description: "Transfer stablecoins" },
  { label: "Receive", href: null, icon: <path d="M14 6L6 14M6 14h6M6 14V8" />, description: "Deposit funds" },
  { label: "Earn", href: "/yield" as const, icon: <path d="M3 14l4-5 4 2.5L17 5M13 5h4v4" />, description: "Yield vaults" },
];

export default function DashboardPage() {
  const [rfsOpen, setRfsOpen] = useState(false);
  const [rfsInstrument, setRfsInstrument] = useState<string | undefined>();

  function openRfs(pair?: string) {
    setRfsInstrument(pair);
    setRfsOpen(true);
  }

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-4">
      <h1 className="sr-only">Dashboard</h1>
      {/* ── Top desk-offer banner (RFS entry point) ── */}
      <DeskOfferBanner onGetRfs={() => openRfs()} />

      {/* ── Top row: Portfolio (left) + Stable assets list (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-stretch">
        <BalanceHero />
        <StableAssetsList />
      </div>

      {/* ── Primary CTA: Convert (the main product for stables, prominent) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-3">
        {/* Convert — primary, larger, cyan accent */}
        <Link
          href="/fx"
          className="group flex items-center gap-4 px-5 py-5 rounded-xl bg-[var(--cyan-dim)] border border-[rgba(5,224,248,0.25)] hover:bg-[rgba(5,224,248,0.14)] hover:border-[var(--cyan)] transition-all cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[rgba(5,224,248,0.18)] group-hover:bg-[rgba(5,224,248,0.3)] flex items-center justify-center transition-colors shrink-0">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="var(--cyan)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8h12M16 8l-3-3M16 12H4M4 12l3 3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-sans font-medium text-white">Convert</span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-[.1em] text-[var(--cyan)] bg-[rgba(5,224,248,0.12)] px-1.5 py-0.5 rounded">Primary</span>
            </div>
            <span className="text-xs font-sans text-[var(--text-3)] mt-0.5 block">FX swap between stablecoins, fiat & crypto</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" className="shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
            <path d="M5 3l5 5-5 5" />
          </svg>
        </Link>

        {/* Supporting actions — Send / Receive / Earn (smaller, neutral) */}
        {supportingActions.map((a) => {
          const inner = (
            <div className="flex flex-col items-center justify-center gap-2 px-3 py-5 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.18)] transition-all cursor-pointer group h-full">
              <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.06)] group-hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-2)] group-hover:text-white transition-colors">{a.icon}</svg>
              </div>
              <span className="text-[13px] font-sans font-medium text-[var(--text)] group-hover:text-white transition-colors">{a.label}</span>
              <span className="text-[10px] font-sans text-[var(--text-4)] text-center">{a.description}</span>
            </div>
          );
          if (a.href) return <Link key={a.label} href={a.href}>{inner}</Link>;
          return <button key={a.label} type="button" className="text-left">{inner}</button>;
        })}
      </div>

      {/* ── Market Watch (personalised) ── */}
      <MarketWatchWidget onRequestRfs={openRfs} />

      <GeoDivider variant="dots" className="my-6" />

      {/* ── Recent Activity ── */}
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
      <Suspense fallback={<div className="fixed inset-0 pointer-events-none" aria-hidden="true" />}>
        <RfsDialog
          open={rfsOpen}
          onClose={() => setRfsOpen(false)}
          defaultInstrument={rfsInstrument}
        />
      </Suspense>
    </PageTransition>
  );
}
