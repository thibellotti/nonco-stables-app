// Skeleton loading state for Settlements page

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`bg-[var(--bg-highest)] rounded-lg animate-pulse ${className ?? ""}`} />;
}

export default function SettlementsLoading() {
  return (
    <div className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <SkeletonPulse className="h-3 w-40" />
        <SkeletonPulse className="h-12 w-64" />
      </div>

      {/* Tab navigation */}
      <div className="flex gap-8 border-b border-[var(--border)]">
        <div className="pb-4 flex items-center gap-2">
          <SkeletonPulse className="h-4 w-16" />
          <SkeletonPulse className="h-5 w-6 rounded-sm" />
        </div>
        <div className="pb-4">
          <SkeletonPulse className="h-4 w-20" />
        </div>
      </div>

      {/* Settlement cards — 3 cards in responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 space-y-5"
          >
            {/* Card header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-highest)] animate-pulse" />
                <div className="space-y-2">
                  <SkeletonPulse className="h-4 w-20" />
                  <SkeletonPulse className="h-3 w-28" />
                </div>
              </div>
              <SkeletonPulse className="h-5 w-20 rounded-full" />
            </div>

            {/* Amount */}
            <SkeletonPulse className="h-8 w-36" />

            {/* Details rows */}
            <div className="space-y-3 pt-3 border-t border-[var(--border)]">
              <div className="flex justify-between">
                <SkeletonPulse className="h-3 w-20" />
                <SkeletonPulse className="h-3 w-24" />
              </div>
              <div className="flex justify-between">
                <SkeletonPulse className="h-3 w-16" />
                <SkeletonPulse className="h-3 w-20" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <SkeletonPulse className="h-3 w-16" />
                <SkeletonPulse className="h-3 w-8" />
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--bg-highest)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
