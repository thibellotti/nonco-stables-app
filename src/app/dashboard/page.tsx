"use client";

import { useState } from "react";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { CategoryTabs } from "@/components/dashboard/category-tabs";
import { TransactionList } from "@/components/dashboard/transaction-list";

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
      <BalanceHero />
      <KPICards />
      <div>
        <CategoryTabs active={filter} onChange={setFilter} />
        <TransactionList filter={filter} />
      </div>
    </div>
  );
}
