import { SectionLabel } from "@/components/ui/section-label";

export default function TradesPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <SectionLabel>Trades</SectionLabel>
      <div className="mt-8 flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-4)]">
            <path d="M16 3l4 4-4 4" />
            <path d="M20 7H4" />
            <path d="M8 21l-4-4 4-4" />
            <path d="M4 17h16" />
          </svg>
        </div>
        <h2 className="font-mono text-lg font-semibold mb-2">Trades</h2>
        <p className="text-[var(--text-4)] text-sm">Trade history and executed orders</p>
        <p className="text-[var(--text-4)] text-xs mt-1">Coming soon</p>
      </div>
    </div>
  );
}
