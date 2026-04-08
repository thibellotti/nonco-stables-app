interface FlowDiagramProps {
  from: { label: string; value: string; color: string };
  to: { label: string; value: string; color: string };
  rate?: string;
  className?: string;
}

export function FlowDiagram({ from, to, rate, className }: FlowDiagramProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {/* Source */}
      <div
        className="flex-1 rounded-lg border px-4 py-3 text-center"
        style={{
          background: `color-mix(in srgb, ${from.color} 8%, transparent)`,
          borderColor: `color-mix(in srgb, ${from.color} 15%, transparent)`,
        }}
      >
        <div className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: from.color }}>
          {from.label}
        </div>
        <div className="text-sm font-mono font-bold text-[var(--text)] mt-0.5">{from.value}</div>
      </div>

      {/* Arrow + rate */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <svg width="32" height="14" viewBox="0 0 32 14" fill="none" aria-hidden="true">
          <path d="M2 7h24M22 3l4 4-4 4" stroke="var(--text-4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {rate && (
          <span className="text-[9px] font-mono text-[var(--text-4)]">{rate}</span>
        )}
      </div>

      {/* Destination */}
      <div
        className="flex-1 rounded-lg border px-4 py-3 text-center"
        style={{
          background: `color-mix(in srgb, ${to.color} 8%, transparent)`,
          borderColor: `color-mix(in srgb, ${to.color} 15%, transparent)`,
        }}
      >
        <div className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: to.color }}>
          {to.label}
        </div>
        <div className="text-sm font-mono font-bold text-[var(--text)] mt-0.5">{to.value}</div>
      </div>
    </div>
  );
}
