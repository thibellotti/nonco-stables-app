"use client";

import { useState, useMemo } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { SettlementsStats } from "@/components/settlements/settlements-stats";
import { SettlementsTabBar } from "@/components/settlements/settlements-tab-bar";
import { PendingSettlementsTable } from "@/components/settlements/pending-settlements-table";
import { CompletedTable } from "@/components/settlements/completed-table";
import {
  type Tab,
  type TermFilter,
  pendingSettlements,
  completedSettlements,
} from "@/components/settlements/settlements-data";

// Settlements page — implements Fernando's Apr 2026 feedback:
//   • Removed Next Due + Counterparty Exposure side cards.
//   • Removed dual processing/awaiting pipeline layer.
//   • Replaced ring-gauge overview with a compact rows breakdown that ties
//     directly to the table totals below it.
//   • Pending table: full-width, no bold weights, search by pair, no
//     counterparty/progress columns.
//   • Completed table: From/To date range, hash + wallet columns.

export default function SettlementsPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [termFilter, setTermFilter] = useState<TermFilter>("all");
  const [search, setSearch] = useState("");

  const filteredSettlements = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pendingSettlements.filter((s) => {
      if (termFilter !== "all" && s.settlement !== termFilter) return false;
      if (!q) return true;
      // Search by pair text — feedback example: "trades that only involve MXN".
      return s.pair.toLowerCase().includes(q);
    });
  }, [termFilter, search]);

  const filteredTotal = filteredSettlements.reduce(
    (sum, s) => sum + s.amount,
    0,
  );

  return (
    <PageTransition className="px-4 sm:px-6 lg:px-8 xl:px-12 w-full space-y-5">
      <h1 className="sr-only">Settlements</h1>

      {/* Compact overview — Total exposure + per-term rows */}
      <SettlementsStats />

      {/* Tab Toggle + Filters */}
      <SettlementsTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        termFilter={termFilter}
        onTermFilterChange={setTermFilter}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Pending: full-width table */}
      {activeTab === "pending" && (
        <PendingSettlementsTable
          settlements={filteredSettlements}
          filteredTotal={filteredTotal}
        />
      )}

      {/* Completed */}
      {activeTab === "completed" && (
        <CompletedTable settlements={completedSettlements} />
      )}
    </PageTransition>
  );
}
