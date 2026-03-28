import { Badge } from "@/components/ui/badge";
import { transactions, type TransactionType } from "@/lib/mock-data";
import { cn, formatCompact, timeAgo } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Icons per transaction type
// ---------------------------------------------------------------------------

const iconColors: Record<TransactionType, string> = {
  deposit: "var(--cyan)",
  withdrawal: "var(--purple)",
  trade: "var(--green)",
  settlement: "var(--amber)",
};

const iconBgColors: Record<TransactionType, string> = {
  deposit: "rgba(5,224,248,0.1)",
  withdrawal: "var(--purple-dim)",
  trade: "var(--green-dim)",
  settlement: "var(--amber-dim)",
};

const iconBgColorsMobile: Record<TransactionType, string> = {
  deposit: "rgba(5,224,248,0.12)",
  withdrawal: "rgba(161,36,248,0.1)",
  trade: "rgba(199,255,16,0.1)",
  settlement: "rgba(249,226,32,0.1)",
};

const typeLabels: Record<TransactionType, string> = {
  deposit: "INCOMING DEPOSIT",
  withdrawal: "OUTGOING TRANSFER",
  trade: "TRADE EXECUTION",
  settlement: "SETTLEMENT",
};

// Compact icon for desktop rows (20x20 in 40x40 circle)
function TxIcon({ type }: { type: TransactionType }) {
  const color = iconColors[type];

  const paths: Record<TransactionType, React.ReactNode> = {
    deposit: (
      <path
        d="M14 6L6 14M6 14h5.5M6 14V8.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    withdrawal: (
      <path
        d="M6 14L14 6M14 6H8.5M14 6v5.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    trade: (
      <path
        d="M4 7.5h12M16 7.5l-3-3M4 12.5h12M4 12.5l3 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
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

// Large icon for mobile cards (24x24 in 40x40 rounded-xl)
function TxIconLarge({ type }: { type: TransactionType }) {
  const color = iconColors[type];

  const paths: Record<TransactionType, React.ReactNode> = {
    deposit: (
      <path
        d="M17 7L7 17M7 17h7M7 17V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    withdrawal: (
      <path
        d="M7 17L17 7M17 7H10M17 7v7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    trade: (
      <path
        d="M4 9h16M20 9l-4-4M4 15h16M4 15l4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    settlement: (
      <path
        d="M12 3L21 12L12 21L3 12L12 3Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  };

  return (
    <div
      className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
      style={{ backgroundColor: iconBgColorsMobile[type] }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {paths[type]}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status dot for mobile cards
// ---------------------------------------------------------------------------

function StatusDot({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
        <span className="text-[11px] font-sans text-[var(--text-3)]">
          Completed
        </span>
      </div>
    );
  }
  if (status === "pending") {
    return <Badge variant="amber">Pending</Badge>;
  }
  if (status === "failed") {
    return <Badge variant="red">Failed</Badge>;
  }
  return null;
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
// Transaction row — dual layout (mobile card + desktop row)
// ---------------------------------------------------------------------------

function TransactionRow({ tx }: { tx: (typeof transactions)[number] }) {
  const isPositive = tx.type === "deposit" || tx.type === "settlement";

  return (
    <>
      {/* ── Mobile card — visible only below sm ── */}
      <div
        className={cn(
          "flex sm:hidden flex-col gap-3 p-5",
          "bg-[var(--bg-elevated)] rounded-xl",
          "border border-[var(--border)]",
          "transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "active:bg-[rgba(255,255,255,0.03)] cursor-pointer"
        )}
      >
        {/* Top: type label */}
        <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-4)]">
          {typeLabels[tx.type]}
        </span>

        {/* Middle: large amount + large icon */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-mono text-2xl font-bold tabular-nums",
              isPositive ? "text-[var(--cyan)]" : "text-[var(--text)]"
            )}
          >
            {isPositive ? "+" : "-"}
            {formatCompact(tx.amount)}
          </span>
          <TxIconLarge type={tx.type} />
        </div>

        {/* Bottom: description + time + status */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-3)] font-sans truncate min-w-0 flex-1">
            {tx.description}
            {tx.counterparty ? ` — ${tx.counterparty}` : ""}
          </p>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[11px] text-[var(--text-4)] font-mono tabular-nums">
              {timeAgo(tx.timestamp)}
            </span>
            <StatusDot status={tx.status} />
          </div>
        </div>
      </div>

      {/* ── Desktop row — visible only on sm+ ── */}
      <div
        className={cn(
          "hidden sm:flex items-center gap-3.5 px-6 py-3.5",
          "transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:bg-[rgba(255,255,255,0.03)] cursor-pointer"
        )}
      >
        {/* Left: icon + text */}
        <TxIcon type={tx.type} />

        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text)] truncate font-medium font-sans">
            {tx.description}
          </p>
          {tx.counterparty && (
            <p className="text-xs text-[var(--text-4)] mt-0.5 truncate font-sans">
              {tx.counterparty}
            </p>
          )}
        </div>

        {/* Right: amount + status */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={cn(
              "font-mono text-sm font-semibold tabular-nums",
              isPositive ? "text-[var(--cyan)]" : "text-[var(--text)]"
            )}
          >
            {isPositive ? "+" : "-"}
            {formatCompact(tx.amount)}
          </span>

          <span className="text-[11px] text-[var(--text-4)] font-mono uppercase w-10">
            {tx.currency}
          </span>

          {tx.status === "pending" && (
            <Badge variant="amber">Pending</Badge>
          )}
          {tx.status === "failed" && (
            <Badge variant="red">Failed</Badge>
          )}

          <span className="text-[11px] text-[var(--text-4)] font-mono tabular-nums w-14 text-right">
            {timeAgo(tx.timestamp)}
          </span>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Transaction list (filtered + grouped by date into cards)
// ---------------------------------------------------------------------------

interface TransactionListProps {
  filter: string;
  limit?: number;
}

export function TransactionList({ filter, limit }: TransactionListProps) {
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

  const cap = limit ?? 6;
  const limited = filtered.slice(0, cap);
  const hasMore = filtered.length > cap;
  const groups = groupByDate(limited);

  return (
    <div>
      {groups.map((group, groupIdx) => (
        <div key={group.label}>
          {/* Date header */}
          <div className="px-6 py-3 text-[11px] font-sans font-medium uppercase tracking-[.15em] text-[var(--text-4)] border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
            {group.label}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[var(--border-row)]">
            {group.items.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      {hasMore && (
        <div className="flex justify-center py-4 border-t border-[var(--border)]">
          <button className="text-xs font-sans text-[var(--cyan)] hover:text-white transition-colors cursor-pointer">
            View all {filtered.length} transactions
          </button>
        </div>
      )}
    </div>
  );
}
