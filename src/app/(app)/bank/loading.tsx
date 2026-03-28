// Skeleton loading state for Bank page

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`bg-[var(--bg-highest)] rounded-lg animate-pulse ${className ?? ""}`} />;
}

export default function BankLoading() {
  return (
    <div className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <SkeletonPulse className="h-3 w-28" />
        <SkeletonPulse className="h-12 w-72" />
      </div>

      {/* KPI Row — 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 sm:p-8 space-y-3"
          >
            <SkeletonPulse className="h-3 w-24" />
            <SkeletonPulse className="h-10 w-36" />
            <SkeletonPulse className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Filter + Table container */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        {/* Filter bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <SkeletonPulse className="h-10 w-48 rounded-lg" />
        </div>

        {/* Table header */}
        <div className="px-6 py-3 border-b border-[var(--border)] flex gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-3 w-20" />
          ))}
        </div>

        {/* Table rows — 6 */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`px-6 py-4 flex items-center gap-6 border-b border-[rgba(255,255,255,0.03)] ${
              i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-highest)] animate-pulse" />
              <SkeletonPulse className="h-4 w-24" />
            </div>
            <SkeletonPulse className="h-5 w-16 rounded-full" />
            <SkeletonPulse className="h-4 w-20 ml-auto" />
            <SkeletonPulse className="h-4 w-16" />
            <SkeletonPulse className="h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
