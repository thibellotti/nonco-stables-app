"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { thirdPartyPayees } from "@/lib/mock-data";
import type { ThirdPartyPayee } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

const typeFilters = ["all", "vendor", "contractor", "payroll"] as const;
type TypeFilter = (typeof typeFilters)[number];

const corridorFilters = ["all", "\u2192 BRL", "\u2192 MXN", "\u2192 GBP", "\u2192 EUR"] as const;
type CorridorFilter = (typeof corridorFilters)[number];

const typeBadge: Record<ThirdPartyPayee["type"], { variant: "default" | "cyan" | "amber"; label: string }> = {
  vendor: { variant: "default", label: "Vendor" },
  contractor: { variant: "cyan", label: "Contractor" },
  payroll: { variant: "amber", label: "Payroll" },
};

const statusBadge: Record<string, { variant: "green" | "amber"; label: string }> = {
  settled: { variant: "green", label: "Settled" },
  processing: { variant: "amber", label: "Processing" },
};

// ---------------------------------------------------------------------------
// Third Party page client
// ---------------------------------------------------------------------------

export default function ThirdPartyPageClient() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [corridorFilter, setCorridorFilter] = useState<CorridorFilter>("all");

  const filteredPayees = thirdPartyPayees.filter((p) => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (corridorFilter !== "all" && p.corridor !== corridorFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.reference.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Top row */}
      <div className="flex items-center justify-end">
        <Button variant="cyan" size="sm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">Add payee</span>
        </Button>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[var(--bg-elevated)] rounded-lg p-4">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Active payees</div>
          <div className="text-xl font-mono font-bold text-white mt-1">12</div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-lg p-4">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Volume MTD</div>
          <div className="text-xl font-mono font-bold text-white mt-1">$44.5K</div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-lg p-4">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Processing</div>
          <div className="text-xl font-mono font-bold text-[var(--amber)] mt-1">1</div>
        </div>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        {/* Search + Filters */}
        <div className="px-6 py-3 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payee or reference..."
            aria-label="Search third-party providers"
            className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors placeholder:text-[var(--text-4)] w-full sm:w-auto"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            aria-label="Filter by type"
            className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors"
          >
            {typeFilters.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All types" : t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={corridorFilter}
            onChange={(e) => setCorridorFilter(e.target.value as CorridorFilter)}
            aria-label="Filter by corridor"
            className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors"
          >
            {corridorFilters.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All corridors" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto table-scroll-mask">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em]">
                  Payee
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] hidden md:table-cell">
                  Type
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] hidden sm:table-cell">
                  Corridor
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-right">
                  Amount
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em]">
                  Status
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] hidden lg:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em]">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-sm font-sans text-[var(--text-3)]">No payees match filters</p>
                    <p className="text-xs font-sans text-[var(--text-4)] mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredPayees.map((p, i) => {
                  const tb = typeBadge[p.type];
                  const sb = statusBadge[p.status] ?? statusBadge.settled;
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.03)] transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-[12px] font-sans font-medium text-[var(--text)] block">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-4)] block mt-0.5">
                            {p.reference}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <Badge variant={tb.variant}>{tb.label}</Badge>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-[12px] font-sans text-[var(--text-3)]">{p.corridor}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[12px] font-mono font-bold text-white tabular-nums">
                          ${formatMoney(p.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={sb.variant}>{sb.label}</Badge>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-[12px] font-mono text-[var(--text-3)] tabular-nums">
                          {p.date}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[11px] uppercase tracking-wider font-bold text-white hover:opacity-70 transition-colors cursor-pointer font-sans">
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border)]">
          <span className="text-[11px] text-[var(--text-4)] font-sans">
            <span className="font-mono">{filteredPayees.length}</span> payees
          </span>
        </div>
      </motion.div>
    </PageTransition>
  );
}
