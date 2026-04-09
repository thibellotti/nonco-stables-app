"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { SectionLabel } from "@/components/ui/section-label";
import { Badge } from "@/components/ui/badge";
import { TabGroup } from "@/components/ui/tab-group";
import { cn, formatCompact, timeAgo } from "@/lib/utils";

// ---------------------------------------------------------------------------
// On-chain activity types & mock data
// ---------------------------------------------------------------------------

type ActivityType = "bridge" | "swap" | "yield" | "deposit" | "withdraw";
type ActivityStatus = "confirmed" | "pending" | "failed";

interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  token: string;
  amount: number;
  chain: string;
  toChain?: string;
  txHash: string;
  status: ActivityStatus;
  timestamp: Date;
  fee: number;
}

const ACTIVITIES: Activity[] = [
  { id: "a1", type: "bridge", description: "Bridge USDT", token: "USDT", amount: 50000, chain: "Ethereum", toChain: "Base", txHash: "0x1a2b3c...d4e5f6", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 45), fee: 0.8 },
  { id: "a2", type: "swap", description: "Swap USDC → DAI", token: "USDC", amount: 125000, chain: "Ethereum", txHash: "0x7f8e9d...a1b2c3", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 120), fee: 12.5 },
  { id: "a3", type: "yield", description: "Deposit to Aave V3", token: "USDC", amount: 250000, chain: "Ethereum", txHash: "0x4d5e6f...789abc", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 180), fee: 3.2 },
  { id: "a4", type: "bridge", description: "Bridge USDC", token: "USDC", amount: 75000, chain: "Arbitrum", toChain: "Ethereum", txHash: "0xab12cd...ef3456", status: "pending", timestamp: new Date(Date.now() - 1000 * 60 * 210), fee: 0.5 },
  { id: "a5", type: "withdraw", description: "Withdraw from Compound", token: "DAI", amount: 180000, chain: "Ethereum", txHash: "0x99aa88...bb77cc", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), fee: 2.1 },
  { id: "a6", type: "swap", description: "Swap DAI → USDT", token: "DAI", amount: 95000, chain: "Polygon", txHash: "0xdd11ee...ff2233", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), fee: 0.3 },
  { id: "a7", type: "deposit", description: "Deposit to Morpho", token: "USDT", amount: 300000, chain: "Base", txHash: "0x445566...778899", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), fee: 1.5 },
  { id: "a8", type: "bridge", description: "Bridge DAI", token: "DAI", amount: 40000, chain: "Polygon", toChain: "Arbitrum", txHash: "0xaabb00...ccdd11", status: "failed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), fee: 0.4 },
  { id: "a9", type: "yield", description: "Claim rewards", token: "USDC", amount: 1250, chain: "Ethereum", txHash: "0x112233...445566", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), fee: 1.8 },
  { id: "a10", type: "swap", description: "Swap WETH → USDC", token: "WETH", amount: 15, chain: "Arbitrum", txHash: "0x667788...990011", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), fee: 0.2 },
  { id: "a11", type: "bridge", description: "Bridge USDC", token: "USDC", amount: 200000, chain: "Ethereum", toChain: "Polygon", txHash: "0xaabbcc...ddeeff", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), fee: 0.9 },
  { id: "a12", type: "deposit", description: "Deposit to Aave V3", token: "USDT", amount: 500000, chain: "Ethereum", txHash: "0x223344...556677", status: "confirmed", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), fee: 4.1 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TYPE_ICONS: Record<ActivityType, string> = {
  bridge: "↔",
  swap: "⇄",
  yield: "↗",
  deposit: "↓",
  withdraw: "↑",
};

const TYPE_COLORS: Record<ActivityType, string> = {
  bridge: "var(--cyan)",
  swap: "var(--purple, #a855f7)",
  yield: "var(--green, #22c55e)",
  deposit: "rgba(255,255,255,0.5)",
  withdraw: "var(--amber, #f59e0b)",
};

const STATUS_VARIANT: Record<ActivityStatus, "default" | "green" | "amber" | "red"> = {
  confirmed: "green",
  pending: "amber",
  failed: "red",
};

const TABS = [
  { value: "all" as const, label: "All" },
  { value: "bridge" as const, label: "Bridge" },
  { value: "swap" as const, label: "Swap" },
  { value: "yield" as const, label: "Yield" },
  { value: "deposit" as const, label: "Deposit" },
  { value: "withdraw" as const, label: "Withdraw" },
];

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

const totalVolume = ACTIVITIES.filter((a) => a.status !== "failed").reduce((s, a) => s + a.amount, 0);
const totalFees = ACTIVITIES.filter((a) => a.status !== "failed").reduce((s, a) => s + a.fee, 0);
const pendingCount = ACTIVITIES.filter((a) => a.status === "pending").length;
const chainCount = new Set(ACTIVITIES.flatMap((a) => [a.chain, a.toChain].filter(Boolean))).size;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OnchainActivityClient() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = ACTIVITIES.filter((a) => {
    if (activeTab !== "all" && a.type !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.description.toLowerCase().includes(q) ||
        a.token.toLowerCase().includes(q) ||
        a.chain.toLowerCase().includes(q) ||
        a.txHash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Stats row */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">Total Volume</div>
          <div className="text-lg font-mono font-bold text-white mt-1">${formatCompact(totalVolume)}</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">Total Fees</div>
          <div className="text-lg font-mono font-bold text-white mt-1">${formatCompact(totalFees)}</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">Pending</div>
          <div className="text-lg font-mono font-bold text-[var(--cyan)] mt-1">{pendingCount}</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
          <div className="text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">Chains</div>
          <div className="text-lg font-mono font-bold text-white mt-1">{chainCount}</div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <TabGroup
          tabs={TABS}
          active={activeTab}
          onChange={setActiveTab}
        />
        <div className="flex-1" />
        <input
          type="text"
          placeholder="Search activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search on-chain activity"
          className="w-full sm:w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-sans text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-white transition-colors"
        />
      </div>

      {/* Activity table */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 sm:px-6 py-3 text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">Type</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">Description</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)] hidden sm:table-cell">Chain</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)] text-right">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)] hidden md:table-cell">Tx Hash</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">Status</th>
                <th className="px-4 sm:px-6 py-3 text-[10px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)] text-right hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-[var(--text-3)]">
                    No activity found
                  </td>
                </tr>
              ) : (
                filtered.map((a, i) => (
                  <tr
                    key={a.id}
                    className={cn(
                      "border-b border-[var(--border)] last:border-b-0 hover:bg-white/[0.02] transition-colors",
                      a.status === "failed" && "opacity-50"
                    )}
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-md flex items-center justify-center text-xs"
                          style={{ background: `${TYPE_COLORS[a.type]}15`, color: TYPE_COLORS[a.type] }}
                        >
                          {TYPE_ICONS[a.type]}
                        </span>
                        <span className="text-[11px] font-sans font-medium text-[var(--text-2)] capitalize">{a.type}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-xs font-sans text-white">{a.description}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className="text-[11px] font-sans text-[var(--text-3)]">
                        {a.chain}{a.toChain ? ` → ${a.toChain}` : ""}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <span className="text-sm font-mono font-medium text-white tabular-nums">
                        {a.token === "WETH" ? `${a.amount} ${a.token}` : `$${formatCompact(a.amount)}`}
                      </span>
                      <span className="text-[10px] font-sans text-[var(--text-4)] ml-1.5">{a.token}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <span className="text-[11px] font-mono text-[var(--text-4)] tabular-nums">{a.txHash}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge variant={STATUS_VARIANT[a.status]}>{a.status}</Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right hidden sm:table-cell">
                      <span className="text-[11px] font-sans text-[var(--text-4)]">{timeAgo(a.timestamp)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[var(--border)] text-[11px] text-[var(--text-4)] font-sans">
            Showing {filtered.length} of {ACTIVITIES.length} transactions
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
}
