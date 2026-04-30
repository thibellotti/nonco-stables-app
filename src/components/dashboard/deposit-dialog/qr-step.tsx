"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Currency, Network } from "./data";
import { CopyButton } from "./copy-button";

interface QRStepProps {
  currency: Currency;
  network: Network;
}

// Step 3 — show the QR code, address, and deposit metadata.
export function QRStep({ currency, network }: QRStepProps) {
  return (
    <div className="flex flex-col">
      {/* QR card */}
      <div className="px-6 pt-4">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-5 flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded-md">
            <QRCodeSVG
              value={network.address}
              size={208}
              bgColor="#ffffff"
              fgColor="#0a0a0a"
              level="M"
              marginSize={0}
              aria-label={`${currency.symbol} deposit address QR code on ${network.name}`}
            />
          </div>

          {/* Currency / Network badges under QR */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans uppercase tracking-[.12em] text-[var(--text-3)]">
              {currency.symbol}
            </span>
            <span className="size-1 rounded-full bg-[var(--text-4)]" aria-hidden="true" />
            <span className="text-[11px] font-mono text-[var(--text-3)]">
              {network.name} ({network.abbr})
            </span>
          </div>
        </div>
      </div>

      {/* Address row */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-sans uppercase tracking-[.15em] text-[var(--text-3)]">
            Address
          </p>
          <CopyButton value={network.address} label="address" variant="pill" />
        </div>
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md px-3 py-2.5">
          <p className="text-[12px] font-mono text-[var(--text)] break-all leading-relaxed">
            {network.address}
          </p>
        </div>
      </div>

      {/* Info rows */}
      <div className="px-6 pt-4 pb-2 space-y-2">
        <InfoRow
          label="Network"
          value={`${network.name} (${network.abbr})`}
          mono={false}
        />
        <InfoRow label="Minimum deposit" value={network.minDeposit} mono />
        <InfoRow label="Arrival time" value={network.arrival} mono />
        <InfoRow
          label="Confirmations"
          value={`${network.confirmations} block${network.confirmations === 1 ? "" : "s"}`}
          mono
        />
      </div>

      {/* Warning */}
      <div className="px-6 pb-4 pt-2">
        <div className="flex items-start gap-2.5 rounded-md border border-[var(--amber-dim)] bg-[var(--amber-dim)] px-3 py-2.5">
          <svg
            className="shrink-0 mt-[1px] text-[var(--amber)]"
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
            <path d="M8 2L1 14h14L8 2z" />
            <path d="M8 6v4M8 12h.01" />
          </svg>
          <p className="text-[11px] font-sans text-[var(--text-2)] leading-relaxed">
            Send only{" "}
            <span className="font-mono text-[var(--text)]">{currency.symbol}</span>{" "}
            on the{" "}
            <span className="font-mono text-[var(--text)]">{network.name}</span>{" "}
            network. Sending other assets or using the wrong network will result in
            permanent loss.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-sans text-[var(--text-3)]">{label}</span>
      <span
        className={
          "text-[12px] text-[var(--text)] " + (mono ? "font-mono tabular-nums" : "font-sans")
        }
      >
        {value}
      </span>
    </div>
  );
}
