"use client";

import { useEffect, useRef } from "react";

// Actual Nonco branded SVGs adapted for Stables (cyan + white, stroke-width 1.5)
const SHAPES = [
  // Circle with crosshairs + cyan center square
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 189 189"><circle fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" cx="94.5" cy="94.5" r="91"/><line stroke="rgba(255,255,255,0.25)" stroke-width="1.5" x1="94.5" y1="3" x2="94.5" y2="31"/><line stroke="rgba(255,255,255,0.25)" stroke-width="1.5" x1="94.5" y1="158" x2="94.5" y2="186"/><line stroke="rgba(255,255,255,0.25)" stroke-width="1.5" x1="3" y1="94.5" x2="31" y2="94.5"/><line stroke="rgba(255,255,255,0.25)" stroke-width="1.5" x1="158" y1="94.5" x2="186" y2="94.5"/><rect fill="#05e0f8" opacity="0.5" x="71" y="71" width="47" height="47"/></svg>`,
  // Square with corner dots
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66"><rect fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" x="13" y="13" width="40" height="40"/><rect fill="rgba(255,255,255,0.35)" width="5" height="5"/><rect fill="rgba(255,255,255,0.35)" x="61" width="5" height="5"/><rect fill="rgba(255,255,255,0.35)" y="61" width="5" height="5"/><rect fill="rgba(255,255,255,0.35)" x="61" y="61" width="5" height="5"/></svg>`,
  // Square with corner circles (cyan)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 49"><rect fill="none" stroke="#05e0f8" opacity="0.3" stroke-width="1.5" x="8" y="8" width="33" height="33"/><circle fill="none" stroke="#05e0f8" opacity="0.2" stroke-width="1.5" cx="8" cy="8" r="5"/><circle fill="none" stroke="#05e0f8" opacity="0.2" stroke-width="1.5" cx="41" cy="8" r="5"/><circle fill="none" stroke="#05e0f8" opacity="0.2" stroke-width="1.5" cx="8" cy="41" r="5"/><circle fill="none" stroke="#05e0f8" opacity="0.2" stroke-width="1.5" cx="41" cy="41" r="5"/></svg>`,
  // Three cyan dots in a row
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 11"><circle fill="#05e0f8" opacity="0.4" cx="42" cy="5.5" r="4"/><circle fill="#05e0f8" opacity="0.4" cx="24" cy="5.5" r="4"/><circle fill="#05e0f8" opacity="0.4" cx="5.5" cy="5.5" r="4"/></svg>`,
  // Large circle with corner dots + rounded cyan center
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><circle fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" cx="96" cy="96" r="92"/><rect fill="rgba(255,255,255,0.25)" x="60" y="124" width="6" height="6"/><rect fill="rgba(255,255,255,0.25)" x="126" y="124" width="6" height="6"/><rect fill="rgba(255,255,255,0.25)" x="60" y="60" width="6" height="6"/><rect fill="rgba(255,255,255,0.25)" x="126" y="60" width="6" height="6"/><rect fill="#05e0f8" opacity="0.25" x="68" y="68" width="56" height="56" rx="28"/></svg>`,
];

interface ShapeConfig {
  index: number;
  x: number;       // % from left
  y: number;       // % from top
  size: number;    // px
  opacity: number;
  phaseOffset: number;
  speedX: number;
  speedY: number;
  ampX: number;
  ampY: number;
}

function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Positions: right-side biased, edge-clipped, center exclusion
const CONFIGS: ShapeConfig[] = [
  { index: 0, x: 82, y: 8,  size: 100, opacity: 0.045, phaseOffset: 0,    speedX: 0.18, speedY: 0.14, ampX: 8,  ampY: 6 },
  { index: 1, x: 90, y: 52, size: 44,  opacity: 0.04,  phaseOffset: 1.2,  speedX: 0.22, speedY: 0.16, ampX: 5,  ampY: 4 },
  { index: 2, x: 75, y: 82, size: 56,  opacity: 0.035, phaseOffset: 2.8,  speedX: 0.15, speedY: 0.12, ampX: 6,  ampY: 5 },
  { index: 3, x: 94, y: 30, size: 28,  opacity: 0.05,  phaseOffset: 4.1,  speedX: 0.25, speedY: 0.20, ampX: 4,  ampY: 3 },
  { index: 4, x: 68, y: 38, size: 72,  opacity: 0.03,  phaseOffset: 5.5,  speedX: 0.12, speedY: 0.10, ampX: 7,  ampY: 5 },
];

export function BrandShapes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    // Create shape nodes
    const nodes: HTMLDivElement[] = [];
    CONFIGS.forEach((cfg) => {
      const node = document.createElement("div");
      node.style.cssText = `
        position:absolute;
        left:${cfg.x}%;
        top:${cfg.y}%;
        width:${cfg.size}px;
        height:${cfg.size}px;
        margin-left:${-cfg.size / 2}px;
        margin-top:${-cfg.size / 2}px;
        opacity:${cfg.opacity};
        pointer-events:none;
        will-change:transform;
      `;
      node.innerHTML = SHAPES[cfg.index];
      const svg = node.querySelector("svg");
      if (svg) { svg.style.width = "100%"; svg.style.height = "100%"; }
      container.appendChild(node);
      nodes.push(node);
    });
    nodesRef.current = nodes;

    // Animation: gentle sine/cosine orbital float — NO rotation, NO tilt
    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const t = time / 1000;

      CONFIGS.forEach((cfg, i) => {
        const node = nodes[i];
        if (!node) return;
        const ft = t * cfg.speedX + cfg.phaseOffset;
        const dx = Math.sin(ft) * cfg.ampX;
        const dy = Math.cos(ft * 0.7 + cfg.phaseOffset) * cfg.ampY;
        node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      nodes.forEach((n) => n.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
}
