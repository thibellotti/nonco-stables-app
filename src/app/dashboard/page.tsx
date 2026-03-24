"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DeskOfferBanner } from "@/components/ui/desk-offer-banner";
import { BalanceHero } from "@/components/dashboard/balance-hero";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { CategoryTabs } from "@/components/dashboard/category-tabs";
import { TransactionList } from "@/components/dashboard/transaction-list";

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 lg:p-8 space-y-6 max-w-4xl"
    >
      <DeskOfferBanner />
      <BalanceHero />
      <KPICards />
      <div>
        <CategoryTabs active={filter} onChange={setFilter} />
        <TransactionList filter={filter} />
      </div>
    </motion.div>
  );
}
