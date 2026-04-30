"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CornerBrackets } from "@/components/ui/corner-brackets";

// ---------------------------------------------------------------------------
// Sign-out — clears all "nonco-stables-" prefixed localStorage keys, then
// routes the operator back to the login screen. No real auth wired yet.
//
// Two exports:
//   - SignOutButton — the bare destructive pill (kept for any standalone use)
//   - SignOutCard   — full card-shaped container with intro text + button.
//                     Used on the /profile page at lg+ widths so the button
//                     doesn't float untethered next to SupportCard.
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = "nonco-stables-";

function useSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(() => {
    if (isSigningOut) return;
    setIsSigningOut(true);

    try {
      // Snapshot keys first — mutating during iteration breaks indices.
      const keys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key);
      }
      keys.forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // ignore — storage may be unavailable in some browser modes
    }

    router.push("/login");
  }, [isSigningOut, router]);

  return { isSigningOut, handleSignOut };
}

// ---------------------------------------------------------------------------
// Bare destructive pill (legacy export — kept for any caller that wants the
// button without the card chrome).
// ---------------------------------------------------------------------------

export function SignOutButton() {
  const shouldReduceMotion = useReducedMotion();
  const { isSigningOut, handleSignOut } = useSignOut();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      <SignOutPill isSigningOut={isSigningOut} onClick={handleSignOut} />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Card-shaped destructive zone — matches AccountCard / SupportCard chrome
// (corner brackets, header strip, p-7/p-8 body padding). The button is
// destructive but the card itself is calm — only the button uses red tokens.
// ---------------------------------------------------------------------------

export function SignOutCard() {
  const shouldReduceMotion = useReducedMotion();
  const { isSigningOut, handleSignOut } = useSignOut();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="profile-signout-heading"
      className="relative h-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col"
    >
      <CornerBrackets size={14} color="var(--border-outline)" opacity={0.35} corners={["tl", "br"]} />

      <div className="px-6 lg:px-8 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <h2
          id="profile-signout-heading"
          className="text-[11px] uppercase tracking-[.15em] font-sans font-medium text-[var(--text-3)]"
        >
          Session
        </h2>
      </div>

      <div className="p-7 lg:p-8 flex flex-col gap-5 flex-1">
        <p className="text-[13px] font-sans text-[var(--text-2)] leading-relaxed">
          Need to switch accounts or step away?
        </p>
        <p className="text-[12px] font-sans text-[var(--text-3)] leading-relaxed">
          Signing out clears your local session data on this device. You can sign
          back in with your credentials at any time.
        </p>

        <div className="mt-auto pt-2 flex">
          <SignOutPill isSigningOut={isSigningOut} onClick={handleSignOut} />
        </div>
      </div>
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// SignOutPill — shared destructive pill, used by both exports.
// ---------------------------------------------------------------------------

function SignOutPill({
  isSigningOut,
  onClick,
}: {
  isSigningOut: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSigningOut}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-transparent border border-[var(--red-dim)] text-[var(--red)] text-[11px] font-sans font-medium uppercase tracking-[.1em] hover:bg-[var(--red-dim)] hover:border-[var(--red)] transition-colors duration-200 ease-out active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 9.5L9.5 7M9.5 7L7 4.5M9.5 7H4M5.5 1.5H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2.5" />
      </svg>
      <span>{isSigningOut ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
