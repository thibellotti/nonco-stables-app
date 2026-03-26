"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { DeskOfferBanner } from "@/components/ui/desk-offer-banner";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { CurrencyBreakdown } from "@/components/dashboard/currency-breakdown";
import { TabGroup } from "@/components/ui/tab-group";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { MarketWatch } from "@/components/dashboard/market-watch";

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-6">
      {/* Desk offer banner — full width */}
      <DeskOfferBanner />

      {/* Row 1: Portfolio Hero + Quick Actions sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Portfolio balance + chart */}
        <BalanceHero />

        {/* RIGHT: Quick Actions */}
        <QuickActions />
      </div>

      {/* Row 2: Stable Assets — full width */}
      <CurrencyBreakdown />

      {/* Row 3: Recent Activity + Market Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT: Transactions — single card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="px-5 py-4">
            <TabGroup
              tabs={[
                { value: "all", label: "All" },
                { value: "deposit", label: "Bank" },
                { value: "trade", label: "Trades" },
                { value: "settlement", label: "Settlements" },
                { value: "withdrawal", label: "Wallet" },
              ]}
              active={filter}
              onChange={setFilter}
            />
          </div>
          <TransactionList filter={filter} />
        </div>

        {/* RIGHT: Market Watch */}
        <MarketWatch />
      </div>
    </PageTransition>
  );
}
