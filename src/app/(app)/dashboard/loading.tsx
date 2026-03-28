// Skeleton loading state for Dashboard page

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`bg-[var(--bg-highest)] rounded-lg animate-pulse ${className ?? ""}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="px-6 md:px-8 w-full space-y-6">
      {/* Desk offer banner skeleton */}
      <SkeletonPulse className="h-14 w-full" />

      {/* Balance hero */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 space-y-4">
        <SkeletonPulse className="h-4 w-32" />
        <SkeletonPulse className="h-16 w-64" />
        <SkeletonPulse className="h-[180px] w-full rounded-lg" />
      </div>

      {/* Quick actions — 4 circles */}
      <div className="flex items-center justify-center gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-card)] animate-pulse" />
            <SkeletonPulse className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Currency breakdown grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-highest)] animate-pulse" />
              <SkeletonPulse className="h-4 w-12" />
            </div>
            <SkeletonPulse className="h-6 w-20" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonPulse key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Transaction list — 6 rows */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-highest)] animate-pulse" />
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-32" />
                <SkeletonPulse className="h-3 w-20" />
              </div>
            </div>
            <SkeletonPulse className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
