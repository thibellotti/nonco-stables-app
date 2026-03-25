"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { DeskOfferBanner } from "@/components/ui/desk-offer-banner";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { CurrencyBreakdown } from "@/components/dashboard/currency-breakdown";
import { HistoricalCharts } from "@/components/dashboard/historical-charts";
import { CategoryTabs } from "@/components/dashboard/category-tabs";
import { TransactionList } from "@/components/dashboard/transaction-list";

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");

  return (
    <PageTransition className="px-6 md:px-8 w-full space-y-8">
      {/* Desk offer banner */}
      <DeskOfferBanner />

      {/* Balance hero with sparkline */}
      <BalanceHero />

      {/* Quick action buttons */}
      <QuickActions />

      {/* Currency breakdown grid */}
      <CurrencyBreakdown />

      {/* Historical performance charts */}
      <HistoricalCharts />

      {/* Transactions section */}
      <div>
        <CategoryTabs active={filter} onChange={setFilter} />
        <TransactionList filter={filter} />
      </div>
    </PageTransition>
  );
}
