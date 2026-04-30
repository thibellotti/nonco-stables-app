"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import { useToast } from "@/components/ui/toast";
import {
  NETWORK_META,
  truncateAddress,
  useWhitelistedAddressActions,
  useWhitelistedAddresses,
  useWhitelistedAddressesHydrated,
  type WhitelistedAddress,
  type WhitelistedNetwork,
} from "@/stores/whitelisted-addresses";
import { WhitelistedAddressDialog } from "./whitelisted-address-dialog";

// ---------------------------------------------------------------------------
// Whitelisted addresses card — Claude-aesthetic redesign.
// ---------------------------------------------------------------------------
// Header: section heading + count pill + "+ Add address" button.
// Rows: network chip, nickname (font-medium), truncated address (font-mono
//       text-3), "Added Mar 12" date, edit/remove icon buttons revealed on
//       hover. Calm 200ms hover (bg shift only).
// Empty: centered, friendly, larger CTA.
// Footer: tiny security note (text-4).
//
// Persistence is handled by the Zustand store (localStorage). Mock seed data
// is loaded on the FIRST hydration only — once the user clears their list,
// we don't re-seed on top of it.

// ---------------------------------------------------------------------------
// Mock seed (only used on first-ever hydration)
// ---------------------------------------------------------------------------

const MOCK_SEED: Omit<WhitelistedAddress, "id">[] = [
  {
    nickname: "Treasury hot wallet",
    network: "ETH",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    notes: "Primary EVM operations wallet — Treasury 01.",
    // 12 days ago
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    nickname: "Tron operations",
    network: "TRC20",
    address: "TTYVmo6iYmSCsv1GppEhkJKpxv92eokGGe",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    nickname: "Solana ops",
    network: "SOL",
    address: "7VBUjZBM9C6phAiXLGd7CR1m6YfYK1DtPdjZ4Z6Rdkbn",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// LocalStorage key marking that the seed pass has run at least once. Keeps
// the seed from coming back after the user has intentionally cleared the
// list. Lives under the same prefix sign-out wipes.
const SEED_FLAG_KEY = "nonco-stables-whitelisted-addresses-seeded";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WhitelistedAddressesCard() {
  const shouldReduceMotion = useReducedMotion();
  const addresses = useWhitelistedAddresses();
  const hydrated = useWhitelistedAddressesHydrated();
  const { add, remove, update, setAll } = useWhitelistedAddressActions();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WhitelistedAddress | null>(null);

  // One-time seed pass on first hydration. Skipped if the flag has been set
  // OR if the list already has entries (covers the migration case where an
  // older session built the list pre-flag).
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    let alreadySeeded = false;
    try {
      alreadySeeded = window.localStorage.getItem(SEED_FLAG_KEY) === "1";
    } catch {
      /* storage blocked — treat as already seeded so we don't loop */
      alreadySeeded = true;
    }
    if (alreadySeeded || addresses.length > 0) {
      // Make sure the flag is set so we don't seed again later.
      if (!alreadySeeded) {
        try {
          window.localStorage.setItem(SEED_FLAG_KEY, "1");
        } catch {
          /* ignore */
        }
      }
      return;
    }

    const seeded: WhitelistedAddress[] = MOCK_SEED.map((m) => ({
      ...m,
      id: makeSeedId(),
    }));
    setAll(seeded);
    try {
      window.localStorage.setItem(SEED_FLAG_KEY, "1");
    } catch {
      /* ignore */
    }
    // We intentionally read addresses.length here once at hydration time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const existingNicknames = useMemo(
    () => addresses.map((a) => a.nickname),
    [addresses],
  );

  const openAdd = useCallback(() => {
    setEditing(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((entry: WhitelistedAddress) => {
    setEditing(entry);
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (input: {
      nickname: string;
      network: WhitelistedNetwork;
      address: string;
      notes?: string;
    }) => {
      if (editing) {
        update(editing.id, input);
      } else {
        add(input);
      }
    },
    [add, update, editing],
  );

  const handleRemove = useCallback(
    (entry: WhitelistedAddress) => {
      remove(entry.id);
      toast(`Removed "${entry.nickname}"`, "info");
    },
    [remove, toast],
  );

  return (
    <>
      <motion.section
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        aria-labelledby="profile-whitelist-heading"
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <CornerBrackets size={14} color="var(--border-outline)" opacity={0.35} corners={["tl", "br"]} />

        {/* Header strip */}
        <div className="px-6 lg:px-8 py-3.5 border-b border-[var(--border)] bg-[var(--bg-elevated)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <h2
              id="profile-whitelist-heading"
              className="text-[11px] uppercase tracking-[.15em] font-sans font-medium text-[var(--text-3)]"
            >
              Whitelisted addresses
            </h2>
            <span className="text-[11px] font-mono tabular-nums text-[var(--text-4)] bg-[rgba(255,255,255,0.03)] border border-[var(--border-row)] px-1.5 py-0.5 rounded">
              {addresses.length}
            </span>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-sans font-medium uppercase tracking-[.12em] text-[var(--cyan)] hover:bg-[var(--cyan-dim)] border border-transparent hover:border-[rgba(5,224,248,0.2)] transition-colors duration-200 ease-out cursor-pointer"
            aria-label="Add whitelisted address"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add address
          </button>
        </div>

        {/* Body */}
        {addresses.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <ul role="list" className="divide-y divide-[var(--border-row)]">
            <AnimatePresence initial={false}>
              {addresses.map((entry, idx) => (
                <AddressRow
                  key={entry.id}
                  entry={entry}
                  index={idx}
                  onEdit={() => openEdit(entry)}
                  onRemove={() => handleRemove(entry)}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}

        {/* Footer */}
        <div className="px-6 lg:px-8 py-3 border-t border-[var(--border)] bg-[var(--bg-elevated)]">
          <p className="text-[10px] font-sans text-[var(--text-4)] leading-relaxed">
            Outgoing transfers are restricted to whitelisted addresses for security.
          </p>
        </div>
      </motion.section>

      <WhitelistedAddressDialog
        open={dialogOpen}
        editing={editing}
        existingNicknames={existingNicknames}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="px-6 py-14 lg:py-16 flex flex-col items-center text-center"
    >
      <div
        aria-hidden="true"
        className="w-12 h-12 mb-4 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-4)]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
          <path d="M2 6h12" />
          <path d="M5 9.5h2" />
        </svg>
      </div>
      <p className="text-sm font-sans font-medium tracking-tight text-[var(--text)]">
        No whitelisted addresses yet
      </p>
      <p className="text-[12px] font-sans text-[var(--text-3)] mt-1.5 max-w-[320px] leading-relaxed">
        Add the wallet addresses your operators send to. We&apos;ll restrict outgoing
        transfers to this list.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-[var(--cyan)] text-black text-[11px] font-sans font-bold uppercase tracking-[.1em] hover:brightness-110 transition-colors duration-200 ease-out active:scale-95 cursor-pointer"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
        Add your first address
      </button>
    </motion.div>
  );
}

function AddressRow({
  entry,
  index,
  onEdit,
  onRemove,
}: {
  entry: WhitelistedAddress;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // Click-to-copy with a 1.5s "Copied" pill that fades out.
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(entry.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — long-press to copy still works on mobile */
    }
  }, [entry.address]);

  return (
    <motion.li
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
      transition={{
        duration: 0.18,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.2),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="px-6 lg:px-8 py-4 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-200 ease-out group"
    >
      {/* Network chip */}
      <NetworkChip network={entry.network} />

      {/* Main column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 min-w-0 flex-wrap">
          <span className="text-[13px] font-sans font-medium tracking-tight text-[var(--text)] truncate">
            {entry.nickname}
          </span>
          <span
            className="text-[10px] font-sans uppercase tracking-[.12em] text-[var(--text-4)] shrink-0"
            aria-label={`Added ${formatAddedDate(entry.createdAt)}`}
          >
            Added {formatAddedDate(entry.createdAt)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${entry.nickname} address`}
          className="mt-1 inline-flex items-center gap-2 text-left max-w-full cursor-pointer"
        >
          <span className="text-[12px] font-mono tabular-nums text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-200 ease-out truncate">
            {truncateAddress(entry.address)}
          </span>
          <span className="relative inline-flex shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-sans uppercase tracking-[.1em] text-[var(--cyan)] bg-[var(--cyan-dim)] rounded px-1.5 py-0.5"
                >
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy-icon"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="text-[var(--text-4)] group-hover:text-[var(--text-3)] transition-colors duration-200 ease-out"
                  aria-hidden="true"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <rect x="5" y="5" width="9" height="9" rx="1.5" />
                    <path d="M5 11H3a1 1 0 01-1-1V3a1 1 0 011-1h7a1 1 0 011 1v2" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>
      </div>

      {/* Trailing actions — visible on hover, always reachable via focus */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 ease-out">
        <IconButton label={`Edit ${entry.nickname}`} onClick={onEdit}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 2.5l2.5 2.5L6 12.5l-3 .5.5-3 7.5-7.5z" />
          </svg>
        </IconButton>
        <IconButton
          label={`Remove ${entry.nickname}`}
          onClick={onRemove}
          tone="danger"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M5 4.5l.5 8.5a1 1 0 001 .9h3a1 1 0 001-.9L11 4.5" />
          </svg>
        </IconButton>
      </div>
    </motion.li>
  );
}

function IconButton({
  label,
  onClick,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        "p-1.5 rounded transition-colors duration-200 ease-out cursor-pointer " +
        (tone === "danger"
          ? "text-[var(--text-4)] hover:text-[var(--red)] hover:bg-[var(--red-dim)]"
          : "text-[var(--text-4)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)]")
      }
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Network chip — small uppercase pill, color tinted per network. ETH uses the
// brand cyan; other networks use distinct accents from the brand palette so
// the row scans quickly without a literal logo set.
// ---------------------------------------------------------------------------

function NetworkChip({ network }: { network: WhitelistedNetwork }) {
  const tone = NETWORK_CHIP_TONES[network];
  return (
    <span
      className="shrink-0 inline-flex items-center justify-center min-w-[44px] h-5 px-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[.08em] border"
      style={{
        color: tone.fg,
        background: tone.bg,
        borderColor: tone.border,
      }}
    >
      {NETWORK_META[network].chip}
    </span>
  );
}

const NETWORK_CHIP_TONES: Record<
  WhitelistedNetwork,
  { fg: string; bg: string; border: string }
> = {
  ETH: {
    fg: "var(--cyan)",
    bg: "var(--cyan-dim)",
    border: "rgba(5,224,248,0.2)",
  },
  BASE: {
    fg: "var(--cyan-light)",
    bg: "var(--cyan-wash)",
    border: "rgba(5,224,248,0.12)",
  },
  TRC20: {
    fg: "var(--red)",
    bg: "var(--red-dim)",
    border: "rgba(239,68,68,0.18)",
  },
  BSC: {
    fg: "var(--amber)",
    bg: "var(--amber-dim)",
    border: "rgba(249,226,32,0.18)",
  },
  SOL: {
    fg: "var(--purple)",
    bg: "var(--purple-dim)",
    border: "rgba(161,36,248,0.2)",
  },
  POLYGON: {
    fg: "var(--purple)",
    bg: "var(--purple-dim)",
    border: "rgba(161,36,248,0.15)",
  },
  ARB: {
    fg: "var(--text-2)",
    bg: "rgba(255,255,255,0.04)",
    border: "var(--border)",
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Renders an ISO date as "Mar 12" (or includes year if not the current one). */
function formatAddedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const month = MONTHS_SHORT[d.getMonth()];
  const day = d.getDate();
  const thisYear = new Date().getFullYear();
  if (d.getFullYear() !== thisYear) {
    return `${month} ${day}, ${d.getFullYear()}`;
  }
  return `${month} ${day}`;
}

/** Generate a stable id for the seed entries — same fallback shape as the
 *  store's makeId so consumers can't tell the difference. */
function makeSeedId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      /* fall through */
    }
  }
  return `wl_seed_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
