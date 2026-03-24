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
        d="M13 5L5 13M5 13h5.5M5 13V7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Arrow up-right (withdrawal)
    withdrawal: (
      <path
        d="M5 13L13 5M13 5H7.5M13 5v5.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    // Double horizontal arrow (trade)
    trade: (
      <>
        <path
          d="M4 7h10M14 7l-3-3M4 11h10M4 11l3 3"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    // Diamond (settlement)
    settlement: (
      <path
        d="M9 3L15 9L9 15L3 9L9 3Z"
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
      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
      style={{ backgroundColor: iconBgColors[type] }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        {paths[type]}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transaction row
// ---------------------------------------------------------------------------

function TransactionRow({
  tx,
  isLast,
}: {
  tx: (typeof transactions)[number];
  isLast: boolean;
}) {
  const isPositive = tx.type === "deposit" || tx.type === "settlement";

  return (
    <div
      className={cn(
        "flex items-center gap-3 py-3 lg:py-3.5 px-2 -mx-2 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-[var(--bg-elevated)]",
        !isLast && "border-b border-[var(--border-subtle)]"
      )}
    >
      {/* Left: icon + text */}
      <TxIcon type={tx.type} />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text)] truncate">{tx.description}</p>
        {tx.counterparty && (
          <p className="text-xs text-[var(--text-4)] mt-0.5 truncate">
            {tx.counterparty}
          </p>
        )}
      </div>

      {/* Right: amount + time + status */}
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <span
          className={cn(
            "font-mono text-sm font-medium tabular-nums",
            isPositive ? "text-[var(--cyan)]" : "text-[var(--text)]"
          )}
        >
          {isPositive ? "+" : "-"}
          {formatCompact(tx.amount)}
        </span>

        <div className="flex items-center gap-1.5">
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
// Transaction list (filtered)
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

  return (
    <div className="mt-3">
      {filtered.map((tx, i) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          isLast={i === filtered.length - 1}
        />
      ))}
    </div>
  );
}
