// Skeleton loading state for Wallet page

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`bg-[var(--bg-highest)] rounded-lg animate-pulse ${className ?? ""}`} />;
}

export default function WalletLoading() {
  return (
    <div className="px-6 md:px-8 w-full space-y-6">
      {/* Hero */}
      <div className="space-y-4">
        <div className="space-y-3">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-12 w-36" />
        </div>
        <SkeletonPulse className="h-10 w-52" />
        <SkeletonPulse className="h-4 w-56" />
        <div className="flex gap-3 pt-1">
          <SkeletonPulse className="h-10 w-28 rounded-full" />
          <SkeletonPulse className="h-10 w-28 rounded-full" />
        </div>
      </div>

      {/* Currency cards grid — 5 cards + 1 dashed */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
          >
            {/* Color top border */}
            <div className="h-[2px] w-full bg-[var(--bg-highest)] animate-pulse" />

            <div className="p-8 flex flex-col gap-5">
              {/* Header: icon + name */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-highest)] animate-pulse" />
                  <div className="space-y-2">
                    <SkeletonPulse className="h-5 w-24" />
                    <SkeletonPulse className="h-3 w-10" />
                  </div>
                </div>
                <SkeletonPulse className="h-3 w-20" />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <SkeletonPulse className="h-8 w-40" />
                <SkeletonPulse className="h-4 w-28" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-[var(--border)]">
                <SkeletonPulse className="flex-1 h-10 rounded" />
                <SkeletonPulse className="flex-1 h-10 rounded" />
              </div>
            </div>
          </div>
        ))}

        {/* Dashed add-currency card */}
        <div className="border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center p-8 min-h-[240px]">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-highest)] animate-pulse" />
          <SkeletonPulse className="h-4 w-40 mt-3" />
          <SkeletonPulse className="h-3 w-48 mt-2" />
        </div>
      </div>

      {/* Recent Settlements table */}
      <div className="space-y-4">
        <SkeletonPulse className="h-3 w-32" />

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-3 border-b border-[var(--border)] flex gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-3 w-20" />
            ))}
          </div>

          {/* Table rows — 4 */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`px-6 py-4 flex items-center gap-6 border-b border-[var(--border)] ${
                i % 2 === 1 ? "bg-[rgba(255,255,255,0.02)]" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[var(--bg-highest)] animate-pulse" />
                <SkeletonPulse className="h-4 w-12" />
              </div>
              <SkeletonPulse className="h-3 w-28 hidden sm:block" />
              <SkeletonPulse className="h-4 w-20 ml-auto" />
              <SkeletonPulse className="h-3 w-14 hidden md:block" />
              <SkeletonPulse className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
