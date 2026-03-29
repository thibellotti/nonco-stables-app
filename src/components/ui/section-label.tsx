export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-sans text-[11px] font-medium uppercase tracking-[.15em] text-[var(--text-3)] ${className ?? ""}`}>
      {children}
    </span>
  );
}
