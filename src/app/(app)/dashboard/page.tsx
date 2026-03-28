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
import { RfsDialog } from "@/components/rfs/rfs-dialog";

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");
  const [rfsOpen, setRfsOpen] = useState(false);
  const [rfsInstrument, setRfsInstrument] = useState<string | undefined>();

  function handleRequestRfs(pair: string) {
    setRfsInstrument(pair);
    setRfsOpen(true);
  }

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6 dot-grid-bg">
      {/* Desk offer banner */}
      <DeskOfferBanner />

      {/* Portfolio Hero — full width */}
      <BalanceHero />

      {/* Quick Actions — horizontal pill row */}
      <QuickActions />

      {/* Stable Assets — full width table */}
      <CurrencyBreakdown />

      {/* Market Watch — full width single row */}
      <MarketWatch onRequestRfs={handleRequestRfs} />

      {/* Activity — full width */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="px-6 py-3">
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

      {/* RFS Dialog */}
      <RfsDialog
        open={rfsOpen}
        onClose={() => setRfsOpen(false)}
        defaultInstrument={rfsInstrument}
      />
    </PageTransition>
  );
}
