import { motion } from "framer-motion";
import { formatMoney } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SettlementCardProps {
  pair: string;
  amount: number;
  status: "processing" | "awaiting";
  counterparty: string;
  dueDate: string;
  settlement: string;
  progress: number;
  contractRef?: string;
  /** Index used for stagger animation delay */
  index: number;
}

// ---------------------------------------------------------------------------
// Settlement Card
// ---------------------------------------------------------------------------

export function SettlementCard({
  pair,
  amount,
  status,
  counterparty,
  dueDate,
  settlement,
  progress,
  index,
}: SettlementCardProps) {
  const isProcessing = status === "processing";

  const statusBadge = isProcessing ? (
    <span className="flex items-center gap-1.5 bg-[rgba(5,224,248,0.1)] text-[var(--cyan)] text-[10px] font-bold font-mono px-2 py-1 rounded-sm">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--cyan)]" />
      </span>
      PROCESSING
    </span>
  ) : (
    <span className="flex items-center gap-1.5 bg-[rgba(249,226,32,0.1)] text-[var(--amber)] text-[10px] font-bold font-mono px-2 py-1 rounded-sm">
      <span className="relative flex h-1.5 w-1.5">
        <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[var(--amber)]" />
      </span>
      AWAITING
    </span>
  );

  const progressGradient = isProcessing
    ? "linear-gradient(90deg, var(--cyan-dark, #0a8a9e), var(--cyan))"
    : "linear-gradient(90deg, #d97706, var(--amber))";

  const cardInner = (
    <div className="p-6 flex flex-col justify-between min-h-64">
      {/* Top: pair + status */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[.15em] text-[var(--text-3)]">
              {settlement}
            </span>
            <p className="text-xl font-bold text-white mt-0.5">{pair}</p>
          </div>
          {statusBadge}
        </div>

        {/* Amount */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold font-mono text-white tabular-nums">
            {formatMoney(amount)}
          </span>
          <span className="text-sm font-mono font-bold text-[var(--cyan)]">
            {pair.split("/")[0]}
          </span>
        </div>
      </div>

      {/* Bottom: counterparty, due, progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[var(--text-3)]">{counterparty}</span>
          <span className="text-[10px] font-mono text-[var(--text-3)]">Due {dueDate}</span>
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-[var(--text-3)]">Progress</span>
          <span className="text-[10px] font-mono font-bold text-white">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ background: progressGradient }}
          />
        </div>
      </div>
    </div>
  );

  if (isProcessing) {
    return (
      <div className="processing-border rounded-lg">
        <div className="bg-[var(--bg-card)] rounded-lg">
          {cardInner}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] hover:border-[var(--border-outline)] transition-colors duration-200">
      {cardInner}
    </div>
  );
}
