import { Card } from "@/components/ui/card";
import { balances } from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";

const totalAvailable = balances.reduce((sum, b) => sum + b.available, 0);
const totalPending = balances.reduce((sum, b) => sum + b.pending, 0);
const currencyCount = balances.length;
const pendingSettlements = balances.filter((b) => b.pending > 0).length;

export function KPICards() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4">
      {/* Available */}
      <Card>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
          Available
        </span>
        <p className="font-mono text-[22px] lg:text-[24px] font-bold tracking-tight text-[var(--text)] mt-1.5">
          {formatCompact(totalAvailable)}
        </p>
        <p className="text-[var(--text-4)] text-xs mt-1">
          {currencyCount} currencies
        </p>
      </Card>

      {/* Pending */}
      <Card>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--text-4)]">
          Pending
        </span>
        <p className="font-mono text-[22px] lg:text-[24px] font-bold tracking-tight text-[var(--text)] mt-1.5">
          {formatCompact(totalPending)}
        </p>
        <p className="text-[var(--text-4)] text-xs mt-1">
          {pendingSettlements} settlements
        </p>
      </Card>
    </div>
  );
}
