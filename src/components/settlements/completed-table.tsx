"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { type Transaction } from "@/lib/mock-data";
import { formatMoney, timeAgo } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { currencyColors } from "@/lib/currency-colors";

interface CompletedTableProps {
  settlements: Transaction[];
}

const FIAT_PLACEHOLDER = "—";

// Truncate a long hex string for inline display: 0x1234…abcd
function shortHash(s: string): string {
  return s.length > 14 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
}

// Format a Date as YYYY-MM-DD for <input type="date" value=…>.
function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Parse YYYY-MM-DD into a Date at local midnight; returns null on empty.
function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

// Escape a CSV cell (RFC 4180): wrap in quotes if it contains comma/quote/newline.
function csvCell(value: string | number | undefined): string {
  if (value === undefined || value === null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function CompletedTable({ settlements }: CompletedTableProps) {
  // Date range — both fields are optional; empty means "no bound on this side".
  // Per Fernando's Apr 2026 feedback: "Add a date range filter on the top".
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const filtered = useMemo(() => {
    const from = parseIsoDate(fromDate);
    const to = parseIsoDate(toDate);
    // Inclusive end-of-day on the To bound so "to=Mar 25" includes Mar 25.
    const toEnd = to ? new Date(to.getTime() + 86_400_000 - 1) : null;
    return settlements.filter((t) => {
      const ts = t.timestamp.getTime();
      if (from && ts < from.getTime()) return false;
      if (toEnd && ts > toEnd.getTime()) return false;
      return true;
    });
  }, [settlements, fromDate, toDate]);

  const handleExport = () => {
    const headers = [
      "Description",
      "Amount",
      "Currency",
      "Counterparty",
      "Type",
      "Hash",
      "Wallet",
      "Date",
    ];
    const rows = filtered.map((t) => [
      csvCell(t.description),
      csvCell(t.amount),
      csvCell(t.currency),
      csvCell(t.counterparty),
      csvCell(t.settlementType ?? FIAT_PLACEHOLDER),
      csvCell(t.hash ?? FIAT_PLACEHOLDER),
      csvCell(t.wallet ?? FIAT_PLACEHOLDER),
      csvCell(t.timestamp.toISOString()),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nonco-settlements-${toIsoDate(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header: title + From/To date range + export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <SectionLabel>Settlement history</SectionLabel>

        {/* Date range — From + To inputs */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <DateField
            id="settlements-from"
            label="From"
            value={fromDate}
            onChange={setFromDate}
            max={toDate || undefined}
          />
          <span aria-hidden="true" className="text-[var(--text-4)] text-xs">
            —
          </span>
          <DateField
            id="settlements-to"
            label="To"
            value={toDate}
            onChange={setToDate}
            min={fromDate || undefined}
          />
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              className="text-[10px] uppercase tracking-[.12em] font-sans text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors cursor-pointer"
              aria-label="Clear date range"
            >
              Clear
            </button>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={handleExport}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 1v7M6 8L3.5 5.5M6 8l2.5-2.5M1 10h10" />
          </svg>
          <span className="font-sans text-[11px] uppercase tracking-[.12em]">Export CSV</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-5 sm:px-[var(--table-cell-px)] py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)]">Description</th>
              <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] text-right">Amount</th>
              <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)]">Currency</th>
              <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] hidden sm:table-cell">Counterparty</th>
              <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] hidden md:table-cell">Hash</th>
              <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] hidden md:table-cell">Wallet</th>
              <th scope="col" className="px-4 py-[var(--table-header-py)] text-[9px] tracking-[.15em] uppercase font-sans text-[var(--text-4)] text-right hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-xs text-[var(--text-4)]">No settlements in this range</p>
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => {
                const hash = t.hash ?? null;
                const wallet = t.wallet ?? null;

                return (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="border-b border-[var(--border-row)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-150"
                  >
                    <td className="px-5 sm:px-[var(--table-cell-px)] py-[var(--table-cell-py)]">
                      <span className="text-xs text-[var(--text)]">{t.description}</span>
                    </td>
                    <td className="px-4 py-[var(--table-cell-py)] text-right">
                      <span className="font-mono text-xs text-[var(--text)] tabular-nums">
                        {formatMoney(t.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-[var(--table-cell-py)]">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono"
                        style={{
                          backgroundColor: currencyColors[t.currency]?.bg ?? "rgba(255,255,255,0.04)",
                          color: currencyColors[t.currency]?.text ?? "var(--text-2)",
                        }}
                      >
                        {t.currency}
                      </span>
                    </td>
                    <td className="px-4 py-[var(--table-cell-py)] hidden sm:table-cell">
                      <span className="text-xs text-[var(--text-3)]">{t.counterparty}</span>
                    </td>
                    <td className="px-4 py-[var(--table-cell-py)] hidden md:table-cell">
                      {hash ? (
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="font-mono text-[11px] text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors tabular-nums"
                          title={hash}
                        >
                          {shortHash(hash)}
                        </a>
                      ) : (
                        <span className="font-mono text-[11px] text-[var(--text-4)]">{FIAT_PLACEHOLDER}</span>
                      )}
                    </td>
                    <td className="px-4 py-[var(--table-cell-py)] hidden md:table-cell">
                      {wallet ? (
                        <span
                          className="font-mono text-[11px] text-[var(--text-3)] tabular-nums"
                          title={wallet}
                        >
                          {shortHash(wallet)}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-[var(--text-4)]">{FIAT_PLACEHOLDER}</span>
                      )}
                    </td>
                    <td className="px-4 py-[var(--table-cell-py)] text-right hidden sm:table-cell whitespace-nowrap">
                      <span className="font-mono text-[11px] text-[var(--text-4)] tabular-nums">
                        {timeAgo(t.timestamp)}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// DateField — small labelled native date input that matches the toolbar style
// ---------------------------------------------------------------------------

function DateField({
  id,
  label,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  min?: string;
  max?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 border border-[var(--border)] rounded-md px-2.5 py-1 hover:border-[var(--border-outline)] transition-colors"
    >
      <span className="text-[10px] uppercase tracking-[.12em] font-sans text-[var(--text-4)]">
        {label}
      </span>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        aria-label={`${label} date`}
        className="bg-transparent border-0 outline-none font-mono text-[11px] text-[var(--text)] tabular-nums w-[110px] [color-scheme:dark]"
      />
    </label>
  );
}
