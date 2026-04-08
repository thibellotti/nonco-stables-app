import { cn } from "@/lib/utils";

export function SkeletonPulse({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[var(--bg-highest)] ${className}`} />;
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--bg-elevated)]",
        className
      )}
      {...props}
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 space-y-4", className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="px-6 py-3 border-b border-[var(--border)]">
        <Skeleton className="h-3 w-32" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[rgba(255,255,255,0.03)]">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-2 w-32" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-16 w-80" />
      <Skeleton className="h-[180px] w-full rounded-lg" />
      <div className="flex gap-8">
        <Skeleton className="h-12 w-28" />
        <Skeleton className="h-12 w-28" />
        <Skeleton className="h-12 w-28" />
      </div>
    </div>
  );
}
