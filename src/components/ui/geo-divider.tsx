interface GeoDividerProps {
  variant?: "dots" | "line-dot" | "squares";
  className?: string;
}

export function GeoDivider({ variant = "dots", className }: GeoDividerProps) {
  if (variant === "squares") {
    return (
      <div className={`flex items-center gap-0 w-full ${className ?? ""}`} aria-hidden="true">
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
        <div className="flex items-center gap-3 px-5">
          <div className="w-2 h-2 bg-[var(--cyan)] opacity-30" />
          <div className="w-1.5 h-1.5 bg-[rgba(255,255,255,0.25)]" />
          <div className="w-2 h-2 bg-[var(--cyan)] opacity-30" />
        </div>
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
      </div>
    );
  }

  if (variant === "line-dot") {
    return (
      <div className={`flex items-center gap-0 w-full ${className ?? ""}`} aria-hidden="true">
        <div className="flex-1 h-px" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 6px, transparent 6px, transparent 12px)" }} />
        <div className="flex items-center gap-2 mx-4">
          <div className="w-1 h-1 bg-[var(--cyan)] opacity-40" />
          <div className="w-2.5 h-2.5 rounded-full border border-[var(--cyan)] opacity-40" />
          <div className="w-1 h-1 bg-[var(--cyan)] opacity-40" />
        </div>
        <div className="flex-1 h-px" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 6px, transparent 6px, transparent 12px)" }} />
      </div>
    );
  }

  // Default: dots
  return (
    <div className={`flex items-center gap-0 w-full ${className ?? ""}`} aria-hidden="true">
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
      <div className="flex items-center gap-2 px-4">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] opacity-35" />
        <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.3)]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] opacity-35" />
      </div>
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
    </div>
  );
}
