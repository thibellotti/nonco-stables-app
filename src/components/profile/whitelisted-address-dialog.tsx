"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  NETWORK_META,
  validateAddressShape,
  type WhitelistedAddress,
  type WhitelistedNetwork,
} from "@/stores/whitelisted-addresses";

// ---------------------------------------------------------------------------
// Add / Edit whitelisted address dialog
// ---------------------------------------------------------------------------
// Mirrors the chrome of FixedOfferDialog and DepositDialog: backdrop fade +
// scale/slide-up panel, ESC to close, focus management on first input.
// Stays UI-only — actual persistence is handled by the parent (the card)
// via the onSubmit / onUpdate callbacks against the whitelisted-addresses
// Zustand store.

const NICKNAME_MAX = 32;
const NOTES_MAX = 200;

const NETWORK_OPTIONS: { value: WhitelistedNetwork; label: string }[] = [
  { value: "ETH", label: NETWORK_META.ETH.label },
  { value: "TRC20", label: NETWORK_META.TRC20.label },
  { value: "BSC", label: NETWORK_META.BSC.label },
  { value: "SOL", label: NETWORK_META.SOL.label },
  { value: "BASE", label: NETWORK_META.BASE.label },
  { value: "POLYGON", label: NETWORK_META.POLYGON.label },
  { value: "ARB", label: NETWORK_META.ARB.label },
];

interface WhitelistedAddressDialogProps {
  open: boolean;
  /** When provided, the dialog opens in "edit" mode prefilled from this entry. */
  editing?: WhitelistedAddress | null;
  /** Existing nicknames — used to enforce uniqueness on save. The current
   *  nickname (when editing) is allowed to remain unchanged. */
  existingNicknames: string[];
  onClose: () => void;
  onSubmit: (input: {
    nickname: string;
    network: WhitelistedNetwork;
    address: string;
    notes?: string;
  }) => void;
}

interface FieldErrors {
  nickname?: string;
  network?: string;
  address?: string;
  notes?: string;
}

export function WhitelistedAddressDialog({
  open,
  editing,
  existingNicknames,
  onClose,
  onSubmit,
}: WhitelistedAddressDialogProps) {
  const isEditing = Boolean(editing);
  const titleId = useId();

  // Form state — reset on every open transition so the dialog is fresh.
  const [nickname, setNickname] = useState("");
  const [network, setNetwork] = useState<WhitelistedNetwork>("ETH");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  /** Flips true once the user has tried to submit. Drives whether inline
   *  validation messages are shown — we don't shout about "required" while
   *  the user is still typing. */
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  const nicknameRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Reset on open transition (closed → open) using React 19 render-time
  // adjustment — same pattern used by FixedOfferDialog above.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setNickname(editing?.nickname ?? "");
      setNetwork(editing?.network ?? "ETH");
      setAddress(editing?.address ?? "");
      setNotes(editing?.notes ?? "");
      setSubmitAttempted(false);
    }
  }

  // Auto-focus the nickname input shortly after open
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => nicknameRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Existing nicknames excluding our own (when editing)
  const otherNicknames = useMemo(() => {
    const own = editing?.nickname.trim().toLowerCase();
    return existingNicknames
      .map((n) => n.trim().toLowerCase())
      .filter((n) => n !== own);
  }, [existingNicknames, editing]);

  // Live validation — derived directly from form state so it stays consistent
  // with what the user sees, no setState-in-effect needed.
  const liveErrors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};

    const trimmedNick = nickname.trim();
    if (!trimmedNick) {
      next.nickname = "Nickname is required.";
    } else if (trimmedNick.length > NICKNAME_MAX) {
      next.nickname = `Maximum ${NICKNAME_MAX} characters.`;
    } else if (otherNicknames.includes(trimmedNick.toLowerCase())) {
      next.nickname = "Nickname is already in use.";
    }

    const addrCheck = validateAddressShape(network, address);
    if (addrCheck !== true) {
      next.address = addrCheck;
    }

    if (notes.length > NOTES_MAX) {
      next.notes = `Maximum ${NOTES_MAX} characters.`;
    }

    return next;
  }, [nickname, network, address, notes, otherNicknames]);

  // Only surface inline errors after the user has attempted submit at least
  // once. Keeps the dialog quiet on first open.
  const errors: FieldErrors = submitAttempted ? liveErrors : {};

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitAttempted(true);
      if (Object.keys(liveErrors).length > 0) return;

      onSubmit({
        nickname: nickname.trim(),
        network,
        address: address.trim(),
        notes: notes.trim() || undefined,
      });

      toast(
        isEditing ? "Address updated" : "Address added to whitelist",
        "success",
      );
      onClose();
    },
    [liveErrors, onSubmit, nickname, network, address, notes, isEditing, toast, onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[460px] max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-[var(--border)] flex items-start justify-between gap-3">
              <div>
                <h2
                  id={titleId}
                  className="text-[15px] font-sans font-medium tracking-tight text-[var(--text)] mb-0.5"
                >
                  {isEditing ? "Edit whitelisted address" : "Add whitelisted address"}
                </h2>
                <p className="text-[11px] font-sans text-[var(--text-3)]">
                  Outgoing transfers will be restricted to this list.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 p-1 text-[var(--text-4)] hover:text-[var(--text)] transition-colors duration-200 ease-out cursor-pointer"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
            >
              {/* Nickname ───────────────────────────────────────── */}
              <Field
                label="Nickname"
                htmlFor="wl-nickname"
                error={errors.nickname}
                hint={`${nickname.length}/${NICKNAME_MAX}`}
              >
                <input
                  ref={nicknameRef}
                  id="wl-nickname"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={NICKNAME_MAX}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Treasury hot wallet"
                  aria-invalid={Boolean(errors.nickname)}
                  className={fieldInputClass(Boolean(errors.nickname))}
                />
              </Field>

              {/* Network ────────────────────────────────────────── */}
              <Field label="Network" htmlFor="wl-network" error={errors.network}>
                <div className="relative">
                  <select
                    id="wl-network"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as WhitelistedNetwork)}
                    className={
                      fieldInputClass(false) +
                      " appearance-none pr-9 cursor-pointer font-sans"
                    }
                  >
                    {NETWORK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-4)]">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 4l3 3 3-3" />
                    </svg>
                  </span>
                </div>
              </Field>

              {/* Address ────────────────────────────────────────── */}
              <Field label="Address" htmlFor="wl-address" error={errors.address}>
                <input
                  id="wl-address"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={NETWORK_META[network].placeholder}
                  aria-invalid={Boolean(errors.address)}
                  className={
                    fieldInputClass(Boolean(errors.address)) +
                    " font-mono text-[12px] tracking-tight"
                  }
                />
              </Field>

              {/* Notes (optional) ──────────────────────────────── */}
              <Field
                label="Notes"
                htmlFor="wl-notes"
                optional
                error={errors.notes}
                hint={`${notes.length}/${NOTES_MAX}`}
              >
                <textarea
                  id="wl-notes"
                  rows={3}
                  maxLength={NOTES_MAX}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal context — counterparty, desk, purpose…"
                  aria-invalid={Boolean(errors.notes)}
                  className={
                    fieldInputClass(Boolean(errors.notes)) + " resize-none leading-relaxed"
                  }
                />
              </Field>

              {/* Actions ───────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="cyan" className="w-full">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[.1em]">
                    {isEditing ? "Save changes" : "Save address"}
                  </span>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Small bits — Field row, shared input class
// ---------------------------------------------------------------------------

function Field({
  label,
  htmlFor,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <label
          htmlFor={htmlFor}
          className="text-[10px] font-sans uppercase tracking-[.15em] text-[var(--text-4)]"
        >
          {label}
          {optional && (
            <span className="ml-1.5 normal-case tracking-normal text-[var(--text-4)]">
              (optional)
            </span>
          )}
        </label>
        {hint && (
          <span className="text-[10px] font-mono tabular-nums text-[var(--text-4)]">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p
          role="alert"
          className="mt-1.5 text-[11px] font-sans text-[var(--red)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function fieldInputClass(invalid: boolean): string {
  return (
    "w-full bg-[var(--bg-elevated)] border rounded-md px-3 py-2.5 text-[13px] font-sans text-[var(--text)] placeholder:text-[var(--text-4)] outline-none transition-colors " +
    (invalid
      ? "border-[var(--red)] focus:border-[var(--red)]"
      : "border-[var(--border)] focus:border-[var(--border-outline)]")
  );
}
