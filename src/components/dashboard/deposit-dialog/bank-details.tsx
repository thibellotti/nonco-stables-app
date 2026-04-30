"use client";

import { useState } from "react";
import { FIAT_RAILS } from "./data";
import { CopyButton } from "./copy-button";

// Bank-transfer tab. Each fiat currency block has a header + field list with
// per-row copy buttons. Defaults to the first rail expanded; users can switch
// between USD / EUR / MXN / BRL via the segmented control at the top.
export function BankDetails() {
  const [active, setActive] = useState(FIAT_RAILS[0].symbol);
  const rail = FIAT_RAILS.find((r) => r.symbol === active) ?? FIAT_RAILS[0];

  return (
    <div className="flex flex-col">
      {/* Currency segmented control */}
      <div className="px-6 pt-4 pb-3">
        <div
          role="tablist"
          aria-label="Fiat currency"
          className="inline-flex w-full gap-0.5 p-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border)]"
        >
          {FIAT_RAILS.map((r) => (
            <button
              key={r.symbol}
              type="button"
              role="tab"
              aria-selected={active === r.symbol}
              onClick={() => setActive(r.symbol)}
              className={
                "flex-1 px-3 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer " +
                (active === r.symbol
                  ? "bg-[var(--bg-card)] text-[var(--text)]"
                  : "text-[var(--text-3)] hover:text-[var(--text-2)]")
              }
            >
              {r.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Rail header */}
      <div className="px-6 pb-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[13px] font-sans text-[var(--text)]">{rail.name}</h3>
          <span className="text-[10px] font-sans uppercase tracking-[.12em] text-[var(--text-3)]">
            {rail.rail}
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 pb-2 space-y-1.5">
        {rail.fields.map((f) => (
          <BankRow key={f.label} label={f.label} value={f.value} mono={f.mono} />
        ))}
      </div>

      {/* Note */}
      <div className="px-6 pt-3 pb-4">
        <div className="flex items-start gap-2.5 rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2.5">
          <svg
            className="shrink-0 mt-[1px] text-[var(--cyan)]"
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3.5M8 11h.01" />
          </svg>
          <p className="text-[11px] font-sans text-[var(--text-2)] leading-relaxed">
            Wire transfers settle in 1–2 business days. Always include your{" "}
            <span className="font-mono text-[var(--text)]">Reference</span> in the
            wire memo to ensure correct attribution to your account.
          </p>
        </div>
      </div>
    </div>
  );
}

function BankRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[var(--border-row)] last:border-b-0">
      <span className="text-[11px] font-sans text-[var(--text-3)] shrink-0 w-28">
        {label}
      </span>
      <span
        className={
          "flex-1 text-[12px] text-[var(--text)] break-all min-w-0 " +
          (mono ? "font-mono tabular-nums" : "font-sans")
        }
      >
        {value}
      </span>
      <CopyButton value={value} label={label} />
    </div>
  );
}
