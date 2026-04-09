"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface AnimatedIllustrationProps {
  src: string;
  style?: CSSProperties;
  className?: string;
}

/**
 * Loads an SVG illustration inline and animates:
 * 1. Stroke draw-on (stroke-dashoffset) with stagger
 * 2. Fill elements fade in after strokes
 * 3. Individual elements shift sideways at different speeds/directions
 *    to evoke a trading/swapping feel
 */
export function AnimatedIllustration({
  src,
  style,
  className,
}: AnimatedIllustrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    let cancelled = false;

    fetch(src)
      .then((r) => r.text())
      .then((svgText) => {
        if (cancelled || !container) return;

        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (!svg) return;
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.overflow = "visible";

        if (prefersReduced) return;

        function getLength(el: SVGGeometryElement): number {
          try { return el.getTotalLength(); } catch { return 200; }
        }

        // Seeded random for consistent per-element params
        function seeded(seed: number): number {
          const x = Math.sin(seed * 9301 + 49297) * 49297;
          return x - Math.floor(x);
        }

        // Collect all shape elements
        const allEls = svg.querySelectorAll<SVGGeometryElement>(
          "path, circle, rect, line, polyline, polygon, ellipse"
        );

        const strokesToAnimate: { el: SVGGeometryElement; len: number }[] = [];

        // Per-element motion config for sideways shift
        interface ShiftConfig {
          el: SVGElement;
          speed: number;     // radians/sec
          amplitude: number; // px
          phase: number;     // start offset
          direction: number; // 1 or -1
        }
        const shiftConfigs: ShiftConfig[] = [];

        allEls.forEach((el, i) => {
          const computedStroke = window.getComputedStyle(el).stroke;
          const hasStroke = computedStroke && computedStroke !== "none";
          const fill = window.getComputedStyle(el).fill;
          const isFillOnly = !hasStroke && fill && fill !== "none";

          // Stroke draw-on setup
          if (hasStroke) {
            const len = getLength(el);
            if (len > 0) {
              strokesToAnimate.push({ el, len });
              const existingDash = window.getComputedStyle(el).strokeDasharray;
              if (existingDash && existingDash !== "none" && existingDash !== "0") {
                el.style.strokeDashoffset = `${len}`;
              } else {
                el.style.strokeDasharray = `${len}`;
                el.style.strokeDashoffset = `${len}`;
              }
            }
          }

          // Fill fade-in
          if (isFillOnly) {
            const origOpacity = window.getComputedStyle(el).opacity;
            el.style.opacity = "0";
            el.style.transition = `opacity 1s ease ${1.0 + i * 0.08}s`;
            requestAnimationFrame(() => { el.style.opacity = origOpacity; });
          }

          // Sideways shift config — each element gets unique speed/amp/direction
          const r = seeded(i);
          const speed = 0.08 + r * 0.18;           // 0.08–0.26 rad/s (slow, varied)
          const amplitude = 4 + seeded(i + 50) * 12; // 4–16px
          const phase = seeded(i + 100) * Math.PI * 2;
          const direction = seeded(i + 200) > 0.5 ? 1 : -1;

          shiftConfigs.push({ el, speed, amplitude, phase, direction });
        });

        // Also shift top-level <g> groups for compound movement
        const groups = svg.querySelectorAll<SVGGElement>(":scope > g");
        groups.forEach((g, i) => {
          const r = seeded(i + 300);
          shiftConfigs.push({
            el: g,
            speed: 0.06 + r * 0.12,
            amplitude: 6 + seeded(i + 350) * 14,
            phase: seeded(i + 400) * Math.PI * 2,
            direction: i % 2 === 0 ? 1 : -1,
          });
        });

        // Trigger stroke draw-on
        requestAnimationFrame(() => {
          strokesToAnimate.forEach(({ el, len }, i) => {
            const delay = i * 0.1;
            const duration = 1.2 + Math.min(len / 400, 1.2);
            el.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
            el.style.strokeDashoffset = "0";
          });
        });

        // Continuous sideways shift — each element moves independently
        const startTime = performance.now();
        const animate = (time: number) => {
          rafRef.current = requestAnimationFrame(animate);
          const t = (time - startTime) / 1000;

          shiftConfigs.forEach(({ el, speed, amplitude, phase, direction }) => {
            const dx = Math.sin(t * speed + phase) * amplitude * direction;
            el.setAttribute("transform", `translate(${dx}, 0)`);
          });
        };
        rafRef.current = requestAnimationFrame(animate);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    />
  );
}
