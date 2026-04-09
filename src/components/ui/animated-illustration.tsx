"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface AnimatedIllustrationProps {
  src: string;
  style?: CSSProperties;
  className?: string;
}

/**
 * Loads an SVG inline and animates:
 * 1. Stroke draw-on with stagger
 * 2. Fill fade-in
 * 3. Each major shape drifts up or down independently (alternating direction)
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

        // --- Stroke draw-on ---
        const allEls = svg.querySelectorAll<SVGGeometryElement>(
          "path, circle, rect, line, polyline, polygon, ellipse"
        );

        const strokesToAnimate: { el: SVGGeometryElement; len: number }[] = [];

        allEls.forEach((el, i) => {
          const cs = window.getComputedStyle(el);
          const hasStroke = cs.stroke && cs.stroke !== "none";
          const hasFill = cs.fill && cs.fill !== "none";
          const isFillOnly = !hasStroke && hasFill;

          if (hasStroke) {
            const len = getLength(el);
            if (len > 0) {
              strokesToAnimate.push({ el, len });
              const dash = cs.strokeDasharray;
              if (dash && dash !== "none" && dash !== "0") {
                el.style.strokeDashoffset = `${len}`;
              } else {
                el.style.strokeDasharray = `${len}`;
                el.style.strokeDashoffset = `${len}`;
              }
            }
          }

          if (isFillOnly) {
            const orig = cs.opacity;
            el.style.opacity = "0";
            el.style.transition = `opacity 1s ease ${1.0 + i * 0.08}s`;
            requestAnimationFrame(() => { el.style.opacity = orig; });
          }
        });

        // Trigger draw-on
        requestAnimationFrame(() => {
          strokesToAnimate.forEach(({ el, len }, i) => {
            const delay = i * 0.1;
            const dur = 1.2 + Math.min(len / 400, 1.2);
            el.style.transition = `stroke-dashoffset ${dur}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
            el.style.strokeDashoffset = "0";
          });
        });

        // --- Major shape grouping ---
        // Find the main <g> or use SVG root. Get its direct children as major shapes.
        const mainGroup = svg.querySelector(":scope > g") || svg;
        const topLevelEls = Array.from(mainGroup.children) as SVGElement[];

        // Also get SVG-root-level elements outside the main <g> (dots, small shapes)
        if (mainGroup !== svg) {
          Array.from(svg.children).forEach((child) => {
            if (child !== mainGroup && child.tagName !== "defs") {
              topLevelEls.push(child as SVGElement);
            }
          });
        }

        // Group consecutive stroked pairs (path + circle = one compound shape)
        // by wrapping them in <g> elements for unified movement
        interface ShapeGroup {
          wrapper: SVGGElement;
          speed: number;
          amplitude: number;
          phase: number;
          direction: number; // 1 = down, -1 = up (in SVG Y space)
        }

        const shapeGroups: ShapeGroup[] = [];
        let groupIndex = 0;

        // Process children: pair a <path> followed by a <circle> as one shape
        let i = 0;
        while (i < topLevelEls.length) {
          const el = topLevelEls[i];
          const next = topLevelEls[i + 1];

          const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");

          // Check if this + next form a compound shape (path + circle pair)
          const isPath = el.tagName === "path";
          const nextIsCircle = next?.tagName === "circle";

          if (isPath && nextIsCircle) {
            // Compound shape: wrap both
            const parent = el.parentNode!;
            parent.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            wrapper.appendChild(next);
            i += 2;
          } else {
            // Single element
            const parent = el.parentNode!;
            parent.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            i += 1;
          }

          // Slow, perceptible drift — like nonco.com media page
          const r = groupIndex;
          const speed = 0.04 + (r % 5) * 0.015;     // 0.04–0.10 rad/s (very slow)
          const amplitude = 20 + (r % 4) * 10;      // 20–50px (wide, visible)
          const phase = r * 1.8;                      // well-staggered
          const direction = r % 2 === 0 ? 1 : -1;   // alternating up/down

          shapeGroups.push({ wrapper, speed, amplitude, phase, direction });
          groupIndex++;
        }

        // --- Continuous drift: each shape shifts up or down ---
        const startTime = performance.now();
        const animate = (time: number) => {
          rafRef.current = requestAnimationFrame(animate);
          const t = (time - startTime) / 1000;

          shapeGroups.forEach(({ wrapper, speed, amplitude, phase, direction }) => {
            // Translate in X (SVG space) because the container is rotated 90deg,
            // so SVG-X becomes visual-Y (up/down on screen)
            const dx = Math.sin(t * speed + phase) * amplitude * direction;
            wrapper.setAttribute("transform", `translate(${dx}, 0)`);
          });
        };
        rafRef.current = requestAnimationFrame(animate);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  return <div ref={containerRef} className={className} style={style} />;
}
