"use client";

import { cn } from "@/lib/utils";

type Status = "processing" | "awaiting" | "completed" | "failed" | "pending";

const STATUS_CONFIG: Record<Status, { color: string; label: string; pulse: boolean }> = {
  processing: { color: "bg-white", label: "Processing", pulse: true },
  awaiting: { color: "bg-[var(--cyan)]", label: "Awaiting", pulse: false },
  completed: { color: "bg-[var(--green)]", label: "Completed", pulse: false },
  failed: { color: "bg-[var(--red)]", label: "Failed", pulse: false },
  pending: { color: "bg-[var(--amber)]", label: "Pending", pulse: true },
};

export function StatusDot({
  status,
  showLabel = true,
  className,
}: {
  status: Status;
  showLabel?: boolean;
  className?: string;
}) {
  const cfg = STATUS_CONFIG[status];
  const textColor =
    status === "awaiting"
      ? "text-[var(--cyan)]"
      : status === "processing"
        ? "text-white"
        : "text-[var(--text-3)]";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-bold font-sans uppercase tracking-[.1em] whitespace-nowrap",
        textColor,
        className
      )}
    >
      {cfg.pulse ? (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              cfg.color
            )}
          />
          <span
            className={cn("relative inline-flex rounded-full h-1.5 w-1.5", cfg.color)}
          />
        </span>
      ) : (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", cfg.color)}
          aria-hidden="true"
        />
      )}
      {showLabel && cfg.label}
    </span>
  );
}
