// Skeleton loading state for Trades page

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`bg-[var(--bg-highest)] rounded-lg animate-pulse ${className ?? ""}`} />;
}

export default function TradesLoading() {
  return (
    <div className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Hero header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-3">
          <SkeletonPulse className="h-3 w-32" />
          <SkeletonPulse className="h-12 w-48" />
        </div>
        {/* LIVE badge */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-5 py-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--bg-highest)] animate-pulse" />
          <SkeletonPulse className="h-3 w-8" />
          <SkeletonPulse className="h-3 w-20" />
        </div>
      </div>

      {/* KPI Row — 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 sm:p-8 border-t-2 border-t-[var(--border)] space-y-3"
          >
            <SkeletonPulse className="h-3 w-24" />
            <div className="flex items-baseline gap-3 mt-3">
              <SkeletonPulse className="h-12 w-32" />
              <SkeletonPulse className="h-4 w-12" />
            </div>
            <SkeletonPulse className="h-3 w-40 mt-2" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-3 w-8" />
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-6 w-12 rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-3 w-16" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-6 w-12 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Trade history table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        {/* Table header bar */}
        <div className="px-6 py-4 flex items-center justify-between bg-[var(--bg-elevated)]">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-8 w-28 rounded-full" />
        </div>

        {/* Column headers */}
        <div className="px-6 py-3 border-b border-[var(--border)] flex gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-3 w-16" />
          ))}
        </div>

        {/* Table rows — 8 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`px-6 py-4 flex items-center gap-6 border-b border-[rgba(255,255,255,0.03)] ${
              i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-highest)] animate-pulse" />
              <SkeletonPulse className="h-4 w-20" />
            </div>
            <SkeletonPulse className="h-5 w-10 rounded-full" />
            <SkeletonPulse className="h-4 w-20 ml-auto" />
            <SkeletonPulse className="h-4 w-16" />
            <SkeletonPulse className="h-4 w-10" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
          <SkeletonPulse className="h-3 w-36" />
          <SkeletonPulse className="h-10 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
}
