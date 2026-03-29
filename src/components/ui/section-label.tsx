import { Diamond } from "@/components/ui/diamond";

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Diamond size={6} color="var(--cyan)" />
      <span className="font-sans text-[11px] font-medium uppercase tracking-[.15em] text-[var(--text-3)]">
        {children}
      </span>
    </div>
  );
}
