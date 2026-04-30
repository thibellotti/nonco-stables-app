"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CornerBrackets } from "@/components/ui/corner-brackets";

// ---------------------------------------------------------------------------
// Account card — read-only display of the signed-in operator + organization.
// All values are mocked for the launch scope; wire to real auth data later.
//
// Aesthetic: Claude.ai-inspired. Generous padding (p-7 / p-8), quiet typography
// (font-medium tracking-tight on the name), 64px avatar, monogram in font-medium
// not bold. Sub-grid below shows email + org as label/value pairs. A hairline
// divider separates a row of read-only stats (member since, last login, API).
// ---------------------------------------------------------------------------

const account = {
  initials: "FM",
  name: "Fernando M.",
  role: "Admin",
  email: "fernando@nonco.com",
  organization: "Treasury 01",
  memberSince: "Mar 2025",
  lastLogin: "2h ago",
  apiAccess: true,
};

export function AccountCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="profile-account-heading"
      className="relative h-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col"
    >
      <CornerBrackets size={14} color="var(--border-outline)" opacity={0.35} corners={["tl", "br"]} />

      {/* Header strip */}
      <div className="px-6 lg:px-8 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <h2
          id="profile-account-heading"
          className="text-[11px] uppercase tracking-[.15em] font-sans font-medium text-[var(--text-3)]"
        >
          Account
        </h2>
      </div>

      {/* Body */}
      <div className="p-7 lg:p-8 flex flex-col gap-7 flex-1">
        {/* Identity — avatar + name + role */}
        <div className="flex items-center gap-5">
          <div
            aria-hidden="true"
            className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center border border-[var(--border-outline)]"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(5,224,248,0.18), rgba(255,255,255,0.04) 65%)",
            }}
          >
            <span className="text-base font-sans font-medium tracking-wider text-[var(--text)]">
              {account.initials}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl font-sans font-medium tracking-tight text-[var(--text)] truncate">
                {account.name}
              </span>
              <span className="text-[10px] font-sans font-medium uppercase tracking-[.12em] text-[var(--cyan)] bg-[var(--cyan-dim)] border border-[rgba(5,224,248,0.18)] px-1.5 py-0.5 rounded">
                {account.role}
              </span>
            </div>
            <p className="mt-1 text-[12px] font-sans text-[var(--text-3)]">
              Signed-in operator
            </p>
          </div>
        </div>

        {/* Email + Organization — label/value mini grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col min-w-0">
            <dt className="text-[10px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)]">
              Email
            </dt>
            <dd className="mt-1.5 text-[13px] font-mono tabular-nums text-[var(--text-2)] truncate">
              {account.email}
            </dd>
          </div>

          <div className="flex flex-col min-w-0">
            <dt className="text-[10px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)]">
              Organization
            </dt>
            <dd className="mt-1.5 text-[13px] font-sans text-[var(--text-2)] truncate">
              {account.organization}
            </dd>
          </div>
        </dl>

        {/* Read-only stats — separated with a hairline divider */}
        <div className="mt-auto pt-5 border-t border-[var(--border-row)] grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3">
          <Stat label="Member since" value={account.memberSince} />
          <Stat label="Last login" value={account.lastLogin} />
          <Stat
            label="API access"
            value={account.apiAccess ? "Enabled" : "Disabled"}
            tone={account.apiAccess ? "positive" : "muted"}
          />
        </div>
      </div>
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Stat — small label/value pair for the footer row.
// ---------------------------------------------------------------------------

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "positive" | "muted";
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)]">
        {label}
      </span>
      <span
        className={
          "mt-1 text-[12px] font-sans tabular-nums " +
          (tone === "positive"
            ? "text-[var(--status-positive)]"
            : tone === "muted"
              ? "text-[var(--text-3)]"
              : "text-[var(--text-2)]")
        }
      >
        {value}
      </span>
    </div>
  );
}
