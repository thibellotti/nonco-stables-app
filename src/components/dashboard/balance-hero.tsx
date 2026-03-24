import { SectionLabel } from "@/components/ui/section-label";
import { balances } from "@/lib/mock-data";
import { formatMoney } from "@/lib/utils";

const totalBalance = balances.reduce(
  (sum, b) => sum + b.available + b.pending,
  0
);

// Hardcoded 24h change for prototype
const change24h = 12_340;

export function BalanceHero() {
  return (
    <section>
      <SectionLabel className="mb-4">Portfolio</SectionLabel>

      {/* Total balance */}
      <p className="font-mono text-[36px] lg:text-[46px] font-bold tracking-tight leading-none text-[var(--text)]">
        ${formatMoney(totalBalance)}
      </p>

      {/* 24h change */}
      <div className="flex items-center gap-2 mt-2">
        <span className="inline-flex items-center gap-1 text-[var(--cyan)] text-sm font-medium font-mono">
          {/* Up arrow */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 2.5v9M7 2.5L3.5 6M7 2.5l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          +${formatMoney(change24h)}
        </span>
        <span className="text-[var(--text-4)] text-xs font-mono">24h</span>
      </div>
    </section>
  );
}
