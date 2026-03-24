import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function SectionLabel({ children, color, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="w-[2px] h-3 rounded-sm"
        style={{ background: color || "var(--cyan)" }}
      />
      <span className="font-mono text-[10px] font-medium uppercase tracking-[.15em] text-[var(--text-4)]">
        {children}
      </span>
    </div>
  );
}
