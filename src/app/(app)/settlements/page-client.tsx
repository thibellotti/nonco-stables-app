"use client";

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { SettlementsStats } from "@/components/settlements/settlements-stats";
import { SettlementsTabBar } from "@/components/settlements/settlements-tab-bar";
import { PendingSettlementsTable } from "@/components/settlements/pending-settlements-table";
import { SettlementsSidebar } from "@/components/settlements/settlements-sidebar";
import { CompletedTable } from "@/components/settlements/completed-table";
import {
  type Tab,
  type TermFilter,
  pendingSettlements,
  completedSettlements,
} from "@/components/settlements/settlements-data";

// ---------------------------------------------------------------------------
// Settlements page client
// ---------------------------------------------------------------------------

export default function SettlementsPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [termFilter, setTermFilter] = useState<TermFilter>("all");

  const filteredSettlements = pendingSettlements.filter((s) => {
    if (termFilter !== "all" && s.settlement !== termFilter) return false;
    return true;
  });

  const filteredTotal = filteredSettlements.reduce(
    (sum, s) => sum + s.amount,
    0,
  );

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Analytics Row */}
      {activeTab === "pending" && <SettlementsStats />}

      {/* Tab Toggle + Filters */}
      <SettlementsTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        termFilter={termFilter}
        onTermFilterChange={setTermFilter}
      />

      {/* Pending: Table + Sidebar */}
      {activeTab === "pending" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <PendingSettlementsTable
            settlements={filteredSettlements}
            filteredTotal={filteredTotal}
          />
          <SettlementsSidebar filteredSettlements={filteredSettlements} />
        </div>
      )}

      {/* Completed */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
