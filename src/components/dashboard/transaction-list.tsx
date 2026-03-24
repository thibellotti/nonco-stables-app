import { Badge } from "@/components/ui/badge";
import { transactions, type TransactionType } from "@/lib/mock-data";
import { cn, formatCompact, timeAgo } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Icons per transaction type — simple SVGs
// ---------------------------------------------------------------------------

const iconColors: Record<TransactionType, string> = {
  deposit: "var(--cyan)",
  withdrawal: "var(--purple)",
  trade: "var(--green)",
  settlement: "var(--amber)",
};

const iconBgColors: Record<TransactionType, string> = {
  deposit: "rgba(5,224,248,0.1)",
  withdrawal: "rgba(168,85,247,0.1)",
  trade: "rgba(34,197,94,0.1)",
  settlement: "rgba(245,158,11,0.1)",
};

function TxIcon({ type }: { type: TransactionType }) {
  const color = iconColors[type];

  const paths: Record<TransactionType, React.ReactNode> = {
    // Arrow down-left (deposit)
    deposit: (
      <path
        d="M14 6L6 14M6 14h5.5M6 14V8.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Arrow up-right (withdrawal)
    withdrawal: (
      <path
        d="M6 14L14 6M14 6H8.5M14 6v5.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Double horizontal arrow (trade)
    trade: (
      <path
        d="M4 7.5h12M16 7.5l-3-3M4 12.5h12M4 12.5l3 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Diamond (settlement)
    settlement: (
      <path
        d="M10 3L17 10L10 17L3 10L10 3Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  };

  return (
    <div
      className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
      style={{ backgroundColor: iconBgColors[type] }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        {paths[type]}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Date grouping helpers
// ---------------------------------------------------------------------------

function getDateGroup(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  const txDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (txDate.getTime() >= today.getTime()) return "Today";
  if (txDate.getTime() >= yesterday.getTime()) return "Yesterday";
  if (txDate.getTime() >= weekAgo.getTime()) return "This Week";
  return "Earlier";
}

function groupByDate(
  txs: typeof transactions
): { label: string; items: typeof transactions }[] {
  const groupOrder = ["Today", "Yesterday", "This Week", "Earlier"];
  const groups: Record<string, typeof transactions> = {};

  for (const tx of txs) {
    const label = getDateGroup(tx.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  }

  return groupOrder
    .filter((label) => groups[label]?.length)
    .map((label) => ({ label, items: groups[label] }));
}

// ---------------------------------------------------------------------------
// Transaction row
// ---------------------------------------------------------------------------

function TransactionRow({ tx }: { tx: (typeof transactions)[number] }) {
  const isPositive = tx.type === "deposit" || tx.type === "settlement";

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 py-3 lg:py-3.5 px-3 -mx-3 rounded-lg cursor-pointer",
        "transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:bg-[var(--bg-elevated)]"
      )}
    >
      {/* Left: icon + text */}
      <TxIcon type={tx.type} />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text)] truncate font-medium">
          {tx.description}
        </p>
        {tx.counterparty && (
          <p className="text-xs text-[var(--text-4)] mt-0.5 truncate">
            {tx.counterparty}
          </p>
        )}
      </div>

      {/* Right: amount + currency + time + status */}
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <span
          className={cn(
            "font-mono text-sm font-semibold tabular-nums",
            isPositive ? "text-[var(--cyan)]" : "text-[var(--text)]"
          )}
        >
          {isPositive ? "+" : "-"}
          {formatCompact(tx.amount)}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--text-4)] font-mono uppercase">
            {tx.currency}
          </span>
          {tx.status === "pending" && (
            <Badge variant="amber">Pending</Badge>
          )}
          {tx.status === "failed" && (
            <Badge variant="purple">Failed</Badge>
          )}
          <span className="text-[10px] text-[var(--text-4)] font-mono tabular-nums">
            {timeAgo(tx.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Date group header
// ---------------------------------------------------------------------------

function DateGroupHeader({ label }: { label: string }) {
  return (
    <div className="sticky top-0 z-10 py-2 mt-2 first:mt-0">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[.12em] text-[var(--text-4)] shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Divider between rows (gradient line, not harsh border)
// ---------------------------------------------------------------------------

function RowDivider() {
  return (
    <div className="mx-3">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transaction list (filtered + grouped by date)
// ---------------------------------------------------------------------------

interface TransactionListProps {
  filter: string;
}

export function TransactionList({ filter }: TransactionListProps) {
  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filter);

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--text-4)] text-sm">
        No transactions
      </div>
    );
  }

  const groups = groupByDate(filtered);

  return (
    <div className="mt-3">
      {groups.map((group) => (
        <div key={group.label}>
          <DateGroupHeader label={group.label} />
          {group.items.map((tx, i) => (
            <div key={tx.id}>
              <TransactionRow tx={tx} />
              {i < group.items.length - 1 && <RowDivider />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
