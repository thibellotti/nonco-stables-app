"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CornerBrackets } from "@/components/ui/corner-brackets";

// ---------------------------------------------------------------------------
// Support card — minimal contact rows for client support inquiries.
// Mirrors the chrome of AccountCard / PreferencesCard (corner brackets, header
// strip, p-7/p-8 body padding). Calm presence — kept intentionally sparse.
// ---------------------------------------------------------------------------

const SUPPORT_EMAIL = "inquiries@nonco.com";
const DOC_URL = "https://nonco.com/docs";

function MailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" />
      <path d="M2 4l5 3.5L12 4" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M5 2H2.5A.5.5 0 002 2.5V9.5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V7" />
      <path d="M7 2h3v3M5.5 6.5L10 2" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M3 2h5l3 3v7H3z" />
      <path d="M8 2v3h3" />
      <path d="M5 7.5h4M5 9.5h4" />
    </svg>
  );
}

export function SupportCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="profile-support-heading"
      className="relative h-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col"
    >
      <CornerBrackets size={14} color="var(--border-outline)" opacity={0.35} corners={["tl", "br"]} />

      <div className="px-6 lg:px-8 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <h2
          id="profile-support-heading"
          className="text-[11px] uppercase tracking-[.15em] font-sans font-medium text-[var(--text-3)]"
        >
          Support
        </h2>
      </div>

      <div className="p-7 lg:p-8 flex flex-col gap-2 flex-1">
        <p className="text-[13px] font-sans text-[var(--text-2)] leading-relaxed">
          Reach out to the desk for any account, settlement, or operational
          questions.
        </p>

        <div className="mt-4 flex flex-col">
          <ContactRow
            icon={<MailIcon />}
            label="Email the desk"
            href={`mailto:${SUPPORT_EMAIL}`}
            value={SUPPORT_EMAIL}
            valueClass="font-mono tabular-nums"
          />
          <ContactRow
            icon={<DocIcon />}
            label="Documentation"
            href={DOC_URL}
            value="nonco.com/docs"
            external
          />
        </div>
      </div>
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// ContactRow — clickable row, label on the left, value + (optional) external
// indicator on the right. Calm hover (bg shift + cyan text), 200ms ease-out.
// ---------------------------------------------------------------------------

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  valueClass?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="group flex items-center justify-between gap-4 -mx-3 px-3 py-3 rounded-md hover:bg-[var(--bg-elevated)] transition-colors duration-200 ease-out cursor-pointer"
    >
      <span className="flex items-center gap-3 min-w-0">
        <span className="text-[var(--text-3)] group-hover:text-[var(--cyan)] transition-colors duration-200 ease-out">
          {icon}
        </span>
        <span className="text-[13px] font-sans text-[var(--text)] truncate">
          {label}
        </span>
      </span>
      <span className="flex items-center gap-1.5 shrink-0">
        <span
          className={
            "text-[12px] font-sans text-[var(--text-3)] group-hover:text-[var(--cyan)] transition-colors duration-200 ease-out " +
            (valueClass ?? "")
          }
        >
          {value}
        </span>
        {external && (
          <span className="text-[var(--text-4)] group-hover:text-[var(--cyan)] transition-colors duration-200 ease-out">
            <ExternalIcon />
          </span>
        )}
      </span>
    </a>
  );
}
