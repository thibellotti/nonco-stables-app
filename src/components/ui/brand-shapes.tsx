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
  // Spread: top-right hero, mid-right accent, bottom-right anchor. Avoid balance/bar zone.
  { index: 0, x: 88, y: 5,   size: 130, opacity: 0.40, phaseOffset: 0,    speedX: 0.15, speedY: 0.12, ampX: 10, ampY: 12 },
  { index: 3, x: 97, y: 45,  size: 32,  opacity: 0.35, phaseOffset: 1.8,  speedX: 0.20, speedY: 0.18, ampX: 5,  ampY: 8 },
  { index: 1, x: 82, y: 88,  size: 60,  opacity: 0.30, phaseOffset: 3.2,  speedX: 0.18, speedY: 0.14, ampX: 7,  ampY: 10 },
  { index: 2, x: 96, y: 80,  size: 52,  opacity: 0.25, phaseOffset: 4.5,  speedX: 0.12, speedY: 0.10, ampX: 6,  ampY: 9 },
  { index: 4, x: 70, y: 5,   size: 60,  opacity: 0.20, phaseOffset: 5.8,  speedX: 0.10, speedY: 0.08, ampX: 8,  ampY: 11 },
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

    // Stroke length calculator for draw-on animation
    function getStrokeLength(el: SVGElement): number {
      const tag = el.tagName.toLowerCase();
      if (tag === "circle") {
        const r = parseFloat(el.getAttribute("r") || "0");
        return 2 * Math.PI * r;
      }
      if (tag === "rect") {
        const w = parseFloat(el.getAttribute("width") || "0");
        const h = parseFloat(el.getAttribute("height") || "0");
        const rx = parseFloat(el.getAttribute("rx") || "0");
        if (rx > 0) {
          return 2 * (w + h) - 8 * rx + 2 * Math.PI * rx;
        }
        return 2 * (w + h);
      }
      if (tag === "line") {
        const x1 = parseFloat(el.getAttribute("x1") || "0");
        const y1 = parseFloat(el.getAttribute("y1") || "0");
        const x2 = parseFloat(el.getAttribute("x2") || "0");
        const y2 = parseFloat(el.getAttribute("y2") || "0");
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      }
      return 200;
    }

    // Create shape nodes
    const nodes: HTMLDivElement[] = [];
    CONFIGS.forEach((cfg, shapeIdx) => {
      const node = document.createElement("div");
      node.style.cssText = `
        position:absolute;
        left:${cfg.x}%;
        top:${cfg.y}%;
        width:${cfg.size}px;
        height:${cfg.size}px;
        margin-left:${-cfg.size / 2}px;
        margin-top:${-cfg.size / 2}px;
        opacity:0;
        pointer-events:none;
        will-change:transform,opacity;
        transition:opacity 0.8s ease;
      `;
      const parser = new DOMParser();
      const doc = parser.parseFromString(SHAPES[cfg.index], "image/svg+xml");
      const parsedSvg = doc.querySelector("svg");
      if (parsedSvg) node.replaceChildren(parsedSvg);
      const svg = node.querySelector("svg");
      if (svg) { svg.style.width = "100%"; svg.style.height = "100%"; svg.style.overflow = "visible"; }

      // Set up stroke draw-on animation
      const strokedEls = node.querySelectorAll<SVGElement>("circle[stroke], rect[stroke], line[stroke]");
      strokedEls.forEach((el, elIdx) => {
        const stroke = el.getAttribute("stroke");
        if (!stroke || stroke === "none") return;
        const len = getStrokeLength(el);
        el.style.strokeDasharray = `${len}`;
        el.style.strokeDashoffset = `${len}`;
        el.style.transition = `stroke-dashoffset ${1.2 + elIdx * 0.3}s cubic-bezier(0.16, 1, 0.3, 1) ${shapeIdx * 0.4 + elIdx * 0.15}s`;
      });

      // Fade in filled elements too
      const filledEls = node.querySelectorAll<SVGElement>("rect[fill]:not([fill='none']), circle[fill]:not([fill='none'])");
      filledEls.forEach((el, elIdx) => {
        const origOpacity = el.getAttribute("opacity") || "1";
        el.setAttribute("opacity", "0");
        el.style.transition = `opacity 0.8s ease ${shapeIdx * 0.4 + 0.6 + elIdx * 0.1}s`;
        el.dataset.targetOpacity = origOpacity;
      });

      container.appendChild(node);
      nodes.push(node);
    });
    nodesRef.current = nodes;

    // Trigger draw-on after a frame
    requestAnimationFrame(() => {
      nodes.forEach((node) => {
        node.style.opacity = String(CONFIGS[nodes.indexOf(node)]?.opacity ?? 0.3);

        // Animate stroke draw-on
        const strokedEls = node.querySelectorAll<SVGElement>("circle[stroke], rect[stroke], line[stroke]");
        strokedEls.forEach((el) => {
          el.style.strokeDashoffset = "0";
        });

        // Fade in fills
        const filledEls = node.querySelectorAll<SVGElement>("[data-target-opacity]");
        filledEls.forEach((el) => {
          el.setAttribute("opacity", el.dataset.targetOpacity || "1");
        });
      });
    });

    // Animation: slow horizontal drift (sideways shift)
    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const t = time / 1000;

      CONFIGS.forEach((cfg, i) => {
        const node = nodes[i];
        if (!node) return;
        const ft = t * cfg.speedX * 0.5 + cfg.phaseOffset;
        const dx = Math.sin(ft) * cfg.ampX;
        node.style.transform = `translate3d(${dx}px, 0, 0)`;
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
