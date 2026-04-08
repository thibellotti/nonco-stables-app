// Skeleton loading state for RFQ page

import { SkeletonPulse } from "@/components/ui/skeleton";

export default function RFQLoading() {
  return (
    <div className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Favorites section label */}
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-20" />
        <SkeletonPulse className="h-4 w-48" />
      </div>

      {/* Favorites grid — 2x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 space-y-4 h-[200px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-highest)] animate-pulse" />
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-24" />
                <SkeletonPulse className="h-3 w-16" />
              </div>
            </div>
            <SkeletonPulse className="h-8 w-32" />
            <SkeletonPulse className="h-3 w-full" />
          </div>
        ))}
      </div>

      {/* New Quote section label */}
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-24" />
        <SkeletonPulse className="h-4 w-56" />
      </div>

      {/* Quote form — 3 inputs in a row */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-12 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-12 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <SkeletonPulse className="h-3 w-16" />
            <SkeletonPulse className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Price card placeholder */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 h-[300px] flex items-center justify-center">
        <SkeletonPulse className="h-6 w-48" />
      </div>

      {/* Recent Trades section label */}
      <div className="space-y-2">
        <SkeletonPulse className="h-3 w-28" />
        <SkeletonPulse className="h-4 w-56" />
      </div>

      {/* Recent trades table */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-3 border-b border-[var(--border)] flex gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-3 w-16" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="px-6 py-4 border-b border-[rgba(255,255,255,0.03)] flex items-center gap-6"
          >
            <SkeletonPulse className="h-4 w-20" />
            <SkeletonPulse className="h-5 w-12 rounded-full" />
            <SkeletonPulse className="h-4 w-24 ml-auto" />
            <SkeletonPulse className="h-4 w-16" />
            <SkeletonPulse className="h-4 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}
