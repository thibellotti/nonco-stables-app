"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { DeskOfferBanner } from "@/components/ui/desk-offer-banner";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { CurrencyBreakdown } from "@/components/dashboard/currency-breakdown";
import { CategoryTabs } from "@/components/dashboard/category-tabs";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { MarketWatch } from "@/components/dashboard/market-watch";

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Desk offer banner — full width */}
      <DeskOfferBanner />

      {/* Row 1: Portfolio Hero + Quick Actions sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* LEFT: Portfolio balance + chart */}
        <BalanceHero />

        {/* RIGHT: Quick Actions + Insight card */}
        <div className="space-y-4">
          <QuickActions />

          {/* Insight card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
                <circle cx="8" cy="8" r="6" stroke="var(--cyan)" strokeWidth="1.5" />
                <path d="M8 5.5v3M8 10.5h.01" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm text-[var(--text)]">
                  Volume up <span className="text-[var(--cyan)] font-mono font-bold">12.4%</span> since last session.
                </p>
                <p className="text-xs text-[var(--text-4)] mt-1 font-sans">
                  Opportunity in <span className="font-mono">USDC/EUR</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Stable Assets — full width */}
      <CurrencyBreakdown />

      {/* Row 3: Recent Activity + Market Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* LEFT: Transactions */}
        <div>
          <CategoryTabs active={filter} onChange={setFilter} />
          <TransactionList filter={filter} />
        </div>

        {/* RIGHT: Market Watch */}
        <MarketWatch />
      </div>
    </PageTransition>
  );
}
