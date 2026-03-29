interface GeoDividerProps {
  variant?: "dots" | "line-dot" | "squares";
  className?: string;
}

export function GeoDivider({ variant = "dots", className }: GeoDividerProps) {
  if (variant === "squares") {
    return (
      <div className={`flex items-center gap-0 w-full ${className ?? ""}`} aria-hidden="true">
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
        <div className="flex items-center gap-2 px-4">
          <div className="w-1.5 h-1.5 bg-[rgba(255,255,255,0.15)]" />
          <div className="w-1.5 h-1.5 bg-[rgba(255,255,255,0.1)]" />
          <div className="w-1.5 h-1.5 bg-[rgba(255,255,255,0.15)]" />
        </div>
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
      </div>
    );
  }

  if (variant === "line-dot") {
    return (
      <div className={`flex items-center gap-0 w-full ${className ?? ""}`} aria-hidden="true">
        <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 4px, transparent 4px, transparent 8px)" }} />
        <div className="w-2 h-2 rounded-full bg-[var(--cyan)] mx-3" style={{ opacity: 0.25 }} />
        <div className="flex-1 h-px" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 4px, transparent 4px, transparent 8px)" }} />
      </div>
    );
  }

  // Default: dots
  return (
    <div className={`flex items-center gap-0 w-full ${className ?? ""}`} aria-hidden="true">
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
      <div className="flex items-center gap-1.5 px-3">
        <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.15)]" />
        <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.12)]" />
        <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.15)]" />
      </div>
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
    </div>
  );
}
