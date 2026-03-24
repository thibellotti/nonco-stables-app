import { SectionLabel } from "@/components/ui/section-label";

export default function BankPage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <SectionLabel>Bank</SectionLabel>
      <div className="mt-8 flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-4)]">
            <path d="M3 21h18" />
            <path d="M3 10h18" />
            <path d="M12 3l9 7H3l9-7z" />
            <path d="M5 10v11" />
            <path d="M19 10v11" />
            <path d="M9 10v11" />
            <path d="M15 10v11" />
          </svg>
        </div>
        <h2 className="font-mono text-lg font-semibold mb-2">Bank</h2>
        <p className="text-[var(--text-4)] text-sm">Fiat and crypto deposits and withdrawals</p>
        <p className="text-[var(--text-4)] text-xs mt-1">Coming soon</p>
      </div>
    </div>
  );
}
