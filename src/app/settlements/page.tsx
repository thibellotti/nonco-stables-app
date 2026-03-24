import { SectionLabel } from "@/components/ui/section-label";

export default function SettlementsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <SectionLabel>Settlements</SectionLabel>
      <div className="mt-8 flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-4)]">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h2 className="font-mono text-lg font-semibold mb-2">Settlements</h2>
        <p className="text-[var(--text-4)] text-sm">Pending and completed settlements</p>
        <p className="text-[var(--text-4)] text-xs mt-1">Coming soon</p>
      </div>
    </div>
  );
}
