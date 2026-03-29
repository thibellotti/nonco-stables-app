// Individual geometric shape — place anywhere with full control over position, size, opacity.
// Use to compose unique grafismo layouts per page.

const CYAN = "#05e0f8";

export type GeoShapeVariant =
  | "crosshair"      // Circle with crosshair lines + cyan center square
  | "square-dots"    // Square with corner dot accents
  | "square-circles" // Cyan square with corner circles
  | "three-dots"     // Three cyan dots in a row
  | "ring-square"    // Large circle with corner dots + rounded cyan center
  | "diamond"        // Rotated square
  | "bracket-tl"     // Top-left corner bracket
  | "bracket-tr"     // Top-right corner bracket
  | "bracket-bl"     // Bottom-left corner bracket
  | "bracket-br"     // Bottom-right corner bracket
  | "target"         // Concentric circles (targeting reticle)
  | "grid-4"         // 2x2 dot grid
  | "dash-h"         // Horizontal dashed line
  | "dash-v"         // Vertical dashed line
  | "node"           // Circle with center dot (connection node)
  | "hex"            // Hexagon outline
  | "plus";          // Plus/cross shape

function shapeContent(variant: GeoShapeVariant): React.ReactNode {
  switch (variant) {
    case "crosshair":
      return (
        <svg viewBox="0 0 189 189" fill="none" className="w-full h-full">
          <circle stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" cx="94.5" cy="94.5" r="91" />
          <line stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" x1="94.5" y1="3" x2="94.5" y2="31" />
          <line stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" x1="94.5" y1="158" x2="94.5" y2="186" />
          <line stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" x1="3" y1="94.5" x2="31" y2="94.5" />
          <line stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" x1="158" y1="94.5" x2="186" y2="94.5" />
          <rect fill={CYAN} opacity="0.5" x="71" y="71" width="47" height="47" />
        </svg>
      );
    case "square-dots":
      return (
        <svg viewBox="0 0 66 66" fill="none" className="w-full h-full">
          <rect stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" x="13" y="13" width="40" height="40" />
          <rect fill="rgba(255,255,255,0.35)" width="5" height="5" />
          <rect fill="rgba(255,255,255,0.35)" x="61" width="5" height="5" />
          <rect fill="rgba(255,255,255,0.35)" y="61" width="5" height="5" />
          <rect fill="rgba(255,255,255,0.35)" x="61" y="61" width="5" height="5" />
        </svg>
      );
    case "square-circles":
      return (
        <svg viewBox="0 0 49 49" fill="none" className="w-full h-full">
          <rect stroke={CYAN} opacity={0.3} strokeWidth="1.5" x="8" y="8" width="33" height="33" />
          <circle stroke={CYAN} opacity={0.2} strokeWidth="1.5" cx="8" cy="8" r="5" />
          <circle stroke={CYAN} opacity={0.2} strokeWidth="1.5" cx="41" cy="8" r="5" />
          <circle stroke={CYAN} opacity={0.2} strokeWidth="1.5" cx="8" cy="41" r="5" />
          <circle stroke={CYAN} opacity={0.2} strokeWidth="1.5" cx="41" cy="41" r="5" />
        </svg>
      );
    case "three-dots":
      return (
        <svg viewBox="0 0 48 11" fill="none" className="w-full h-full">
          <circle fill={CYAN} opacity={0.4} cx="5.5" cy="5.5" r="4" />
          <circle fill={CYAN} opacity={0.4} cx="24" cy="5.5" r="4" />
          <circle fill={CYAN} opacity={0.4} cx="42" cy="5.5" r="4" />
        </svg>
      );
    case "ring-square":
      return (
        <svg viewBox="0 0 192 192" fill="none" className="w-full h-full">
          <circle stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" cx="96" cy="96" r="92" />
          <rect fill="rgba(255,255,255,0.25)" x="60" y="60" width="6" height="6" />
          <rect fill="rgba(255,255,255,0.25)" x="126" y="60" width="6" height="6" />
          <rect fill="rgba(255,255,255,0.25)" x="60" y="124" width="6" height="6" />
          <rect fill="rgba(255,255,255,0.25)" x="126" y="124" width="6" height="6" />
          <rect fill={CYAN} opacity={0.25} x="68" y="68" width="56" height="56" rx="28" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
          <rect x="3" y="3" width="14" height="14" transform="rotate(45 10 10)" stroke={CYAN} strokeWidth="1.2" opacity={0.4} />
        </svg>
      );
    case "bracket-tl":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M2 12V2h10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        </svg>
      );
    case "bracket-tr":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M12 2h10v10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        </svg>
      );
    case "bracket-bl":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M2 12v10h10" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        </svg>
      );
    case "bracket-br":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M12 22h10V12" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <circle stroke="rgba(255,255,255,0.12)" strokeWidth="1" cx="40" cy="40" r="38" />
          <circle stroke="rgba(255,255,255,0.08)" strokeWidth="1" cx="40" cy="40" r="24" />
          <circle stroke={CYAN} strokeWidth="1" cx="40" cy="40" r="10" opacity={0.3} />
          <circle fill={CYAN} cx="40" cy="40" r="2" opacity={0.5} />
        </svg>
      );
    case "grid-4":
      return (
        <svg viewBox="0 0 30 30" fill="none" className="w-full h-full">
          <rect fill="rgba(255,255,255,0.2)" x="2" y="2" width="4" height="4" />
          <rect fill="rgba(255,255,255,0.15)" x="24" y="2" width="4" height="4" />
          <rect fill="rgba(255,255,255,0.15)" x="2" y="24" width="4" height="4" />
          <rect fill="rgba(255,255,255,0.2)" x="24" y="24" width="4" height="4" />
        </svg>
      );
    case "dash-h":
      return (
        <svg viewBox="0 0 80 4" fill="none" className="w-full h-full">
          <line x1="0" y1="2" x2="80" y2="2" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      );
    case "dash-v":
      return (
        <svg viewBox="0 0 4 80" fill="none" className="w-full h-full">
          <line x1="2" y1="0" x2="2" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      );
    case "node":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <circle stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" cx="12" cy="12" r="10" />
          <circle fill={CYAN} cx="12" cy="12" r="3" opacity={0.5} />
        </svg>
      );
    case "hex":
      return (
        <svg viewBox="0 0 50 58" fill="none" className="w-full h-full">
          <path d="M25 1L48 15v28L25 57 2 43V15z" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <line x1="12" y1="4" x2="12" y2="20" stroke={CYAN} strokeWidth="1.2" opacity={0.3} />
          <line x1="4" y1="12" x2="20" y2="12" stroke={CYAN} strokeWidth="1.2" opacity={0.3} />
        </svg>
      );
  }
}

interface GeoShapeProps {
  variant: GeoShapeVariant;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

export function GeoShape({ variant, size, className, style }: GeoShapeProps) {
  return (
    <div
      className={`pointer-events-none ${className ?? ""}`}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      {shapeContent(variant)}
    </div>
  );
}
