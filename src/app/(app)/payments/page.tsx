"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { payments } from "@/lib/mock-data";
import { FlowDiagram } from "@/components/viz/flow-diagram";
import { formatMoney, timeAgo } from "@/lib/utils";
import { GeoDivider } from "@/components/ui/geo-divider";


// ---------------------------------------------------------------------------
// Static options for form selects
// ---------------------------------------------------------------------------

const sendFromOptions = [
  { currency: "USDT", balance: 310_000, symbol: "$" },
  { currency: "USDC", balance: 280_000, symbol: "$" },
  { currency: "USD", balance: 425_000, symbol: "$" },
];

const deliverCurrencies = ["MXN", "BRL", "EUR", "GBP", "USD"];

const statusFilters = ["all", "completed", "processing", "failed"] as const;
type StatusFilter = (typeof statusFilters)[number];

const statusBadge: Record<string, { variant: "green" | "amber" | "red" | "default"; label: string }> = {
  completed: { variant: "green", label: "Completed" },
  processing: { variant: "amber", label: "Processing" },
  failed: { variant: "red", label: "Failed" },
};

// ---------------------------------------------------------------------------
// Payments page
// ---------------------------------------------------------------------------

export default function PaymentsPage() {
  const [sendFrom, setSendFrom] = useState(sendFromOptions[0].currency);
  const [recipient, setRecipient] = useState("Grupo Burs\u00e1til Mexicano");
  const [clabe, setClabe] = useState("646180157000000001");
  const [amount, setAmount] = useState("240000");
  const [deliverIn, setDeliverIn] = useState("MXN");
  const [reference, setReference] = useState("INV-2025-0382");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const numericAmount = parseFloat(amount) || 0;
  const fxRate = deliverIn === "MXN" ? 17.452 : deliverIn === "BRL" ? 5.148 : deliverIn === "EUR" ? 0.923 : deliverIn === "GBP" ? 0.791 : 1.0;
  const fee = numericAmount * 0.0015;
  const recipientGets = (numericAmount - fee) * fxRate;

  const filteredPayments = payments.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !p.payee.toLowerCase().includes(search.toLowerCase()) && !p.reference.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: New payment form */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
              New payment
            </span>
          </div>

          <div className="p-6 space-y-5">
            {/* Send from */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                Send from
              </label>
              <select
                value={sendFrom}
                onChange={(e) => setSendFrom(e.target.value)}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors"
              >
                {sendFromOptions.map((opt) => (
                  <option key={opt.currency} value={opt.currency}>
                    {opt.currency} — {opt.symbol}{formatMoney(opt.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Recipient section ── */}
            <div className="text-[9px] font-bold text-[var(--text-4)] uppercase tracking-[0.12em] pt-2">Recipient</div>

            {/* Recipient name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                Recipient name
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors placeholder:text-[var(--text-4)]"
              />
            </div>

            {/* CLABE / Account number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                CLABE / Account number
              </label>
              <input
                type="text"
                value={clabe}
                onChange={(e) => setClabe(e.target.value)}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-mono text-[var(--text)] outline-none focus:border-white/30 transition-colors placeholder:text-[var(--text-4)]"
              />
            </div>

            {/* Amount + Deliver in */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-mono text-[var(--text)] outline-none focus:border-white/30 transition-colors placeholder:text-[var(--text-4)]"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                  Deliver in
                </label>
                <select
                  value={deliverIn}
                  onChange={(e) => setDeliverIn(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors"
                >
                  {deliverCurrencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reference */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-sans font-medium uppercase tracking-[.1em] text-[var(--text-4)]">
                Reference
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm font-mono text-[var(--text)] outline-none focus:border-white/30 transition-colors placeholder:text-[var(--text-4)]"
              />
            </div>

            {/* ── Quote Preview section ── */}
            <div className="text-[9px] font-bold text-[var(--text-4)] uppercase tracking-[0.12em] pt-2">Quote Preview</div>

            {/* Flow diagram */}
            <FlowDiagram
              from={{ label: sendFrom, value: `$${formatMoney(numericAmount)}`, color: "rgba(255,255,255,0.5)" }}
              to={{ label: deliverIn, value: formatMoney(recipientGets), color: "var(--green)" }}
              rate={fxRate.toFixed(4)}
              className="mb-4"
            />

            {/* Quote summary */}
            <div className="bg-[var(--bg-elevated)] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans text-[var(--text-4)]">FX Rate</span>
                <span className="text-xs font-mono text-[var(--text-3)] tabular-nums">
                  1 {sendFrom} = {fxRate.toFixed(4)} {deliverIn}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans text-[var(--text-4)]">Fee (0.15%)</span>
                <span className="text-xs font-mono text-[var(--text-3)] tabular-nums">
                  ${formatMoney(fee)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans text-[var(--text-4)]">Settlement</span>
                <span className="text-xs font-sans text-[var(--text-3)]">~3 min SPEI</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
                <span className="text-[11px] font-sans text-[var(--text-4)]">Recipient gets</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {deliverIn === "MXN" ? "MX$" : deliverIn === "BRL" ? "R$" : deliverIn === "EUR" ? "\u20AC" : deliverIn === "GBP" ? "\u00A3" : "$"}
                  {formatMoney(recipientGets)}
                </span>
              </div>
            </div>

            {/* Submit */}
            <Button variant="cyan" size="lg" className="w-full">
              Send payment
            </Button>
          </div>
        </motion.div>

        <GeoDivider variant="dots" className="my-6 lg:hidden" />

        {/* RIGHT: Payment history */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
              Payment history
            </span>
          </div>

          {/* Filters */}
          <div className="px-6 py-3 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payee or reference..."
              className="flex-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors placeholder:text-[var(--text-4)] w-full sm:w-auto"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-sans text-[var(--text)] outline-none focus:border-white/30 transition-colors"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
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
                    To
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
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p, i) => {
                  const sb = statusBadge[p.status] ?? statusBadge.completed;
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
                            {p.payee}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-4)] block mt-0.5">
                            {p.reference} &middot; {timeAgo(p.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-[12px] font-sans text-[var(--text-3)]">
                          {p.corridor}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-[12px] font-mono font-bold text-white tabular-nums">
                          ${formatMoney(p.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={sb.variant}>{sb.label}</Badge>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[var(--border)]">
            <span className="text-[11px] text-[var(--text-4)] font-sans">
              <span className="font-mono">{filteredPayments.length}</span> payments
            </span>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
