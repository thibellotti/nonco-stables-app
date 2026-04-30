"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useDensity, type Density } from "@/components/layout/density-provider";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Preferences card — interactive, persists to localStorage via providers.
//
// Aesthetic match for AccountCard: corner brackets, header strip, generous
// p-7/p-8 body padding. Sections grouped under uppercase mini-headings, with
// hairline dividers between groups. Density toggle uses pill segmented style
// with cyan accent for the active state.
// ---------------------------------------------------------------------------

export function PreferencesCard() {
  const shouldReduceMotion = useReducedMotion();
  const { density, setDensity } = useDensity();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="profile-preferences-heading"
      className="relative h-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col"
    >
      <CornerBrackets size={14} color="var(--border-outline)" opacity={0.35} corners={["tl", "br"]} />

      <div className="px-6 lg:px-8 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <h2
          id="profile-preferences-heading"
          className="text-[11px] uppercase tracking-[.15em] font-sans font-medium text-[var(--text-3)]"
        >
          Preferences
        </h2>
      </div>

      <div className="p-7 lg:p-8 flex flex-col flex-1">
        {/* Appearance ─────────────────────────────────────── */}
        <Section heading="Appearance">
          <PrefRow label="Theme" description="Switch between dark and light surfaces.">
            <ThemeToggle />
          </PrefRow>
        </Section>

        {/* Display ────────────────────────────────────────── */}
        <Section heading="Display">
          <PrefRow
            label="Table density"
            description="Reduce spacing on tables to see more rows at once."
          >
            <DensityToggle value={density} onChange={setDensity} />
          </PrefRow>
        </Section>
      </div>
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Section — uppercase mini-heading + body, with hairline divider between
// adjacent sections so the card reads as grouped lists.
// ---------------------------------------------------------------------------

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-4 first:pt-0 last:pb-0 border-b border-[var(--border-row)] last:border-b-0">
      <h3 className="text-[11px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)] mb-3">
        {heading}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PrefRow — label (with optional helper text) on the left, control on the right.
// ---------------------------------------------------------------------------

function PrefRow({
  label,
  description,
  htmlFor,
  children,
}: {
  label: string;
  description?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex flex-col">
        <label
          htmlFor={htmlFor}
          className="text-[13px] font-sans font-medium text-[var(--text)]"
        >
          {label}
        </label>
        {description && (
          <span className="mt-0.5 text-[11px] font-sans text-[var(--text-3)]">
            {description}
          </span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DensityToggle — segmented pill, cyan accent for the active option.
// ---------------------------------------------------------------------------

function DensityToggle({
  value,
  onChange,
}: {
  value: Density;
  onChange: (next: Density) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Table density"
      className="inline-flex items-center bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md p-0.5"
    >
      {(["comfortable", "compact"] as const).map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={cn(
              "px-3 py-1.5 rounded text-[11px] font-sans font-medium uppercase tracking-[.08em] transition-colors duration-200 ease-out cursor-pointer",
              active
                ? "bg-[var(--cyan-dim)] text-[var(--cyan)] border border-[rgba(5,224,248,0.2)] -m-px"
                : "text-[var(--text-3)] hover:text-[var(--text-2)] border border-transparent"
            )}
          >
            {opt === "comfortable" ? "Comfortable" : "Compact"}
          </button>
        );
      })}
    </div>
  );
}
