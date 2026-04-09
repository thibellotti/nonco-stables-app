"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface AnimatedIllustrationProps {
  src: string;
  style?: CSSProperties;
  className?: string;
}

// Smooth ease-in-out
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/**
 * Loads an SVG inline and animates:
 * 1. Strokes construct/deconstruct in a perpetual loop (staggered per shape)
 * 2. Fills pulse opacity in sync
 * 3. Major shapes drift up/down independently
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

        // --- Collect stroke info for loop animation ---
        interface StrokeInfo {
          el: SVGGeometryElement;
          len: number;
          origDash: string | null; // original dasharray for dashed lines
        }

        interface FillInfo {
          el: SVGElement;
          origOpacity: string;
        }

        const allEls = svg.querySelectorAll<SVGGeometryElement>(
          "path, circle, rect, line, polyline, polygon, ellipse"
        );

        const strokeInfos: StrokeInfo[] = [];
        const fillInfos: FillInfo[] = [];

        allEls.forEach((el) => {
          const cs = window.getComputedStyle(el);
          const hasStroke = cs.stroke && cs.stroke !== "none";
          const hasFill = cs.fill && cs.fill !== "none";
          const isFillOnly = !hasStroke && hasFill;

          if (hasStroke) {
            const len = getLength(el);
            if (len > 0) {
              const origDash = cs.strokeDasharray;
              const isDashed = origDash && origDash !== "none" && origDash !== "0";
              // Set initial state: fully hidden
              if (!isDashed) {
                el.style.strokeDasharray = `${len}`;
              }
              el.style.strokeDashoffset = `${len}`;
              // Clear any CSS transitions — we drive this from rAF
              el.style.transition = "none";
              strokeInfos.push({ el, len, origDash: isDashed ? origDash : null });
            }
          }

          if (isFillOnly) {
            const orig = cs.opacity || "1";
            el.style.opacity = "0";
            el.style.transition = "none";
            fillInfos.push({ el, origOpacity: orig });
          }
        });

        // --- Major shape grouping for drift ---
        const mainGroup = svg.querySelector(":scope > g") || svg;
        const topLevelEls = Array.from(mainGroup.children) as SVGElement[];

        if (mainGroup !== svg) {
          Array.from(svg.children).forEach((child) => {
            if (child !== mainGroup && child.tagName !== "defs") {
              topLevelEls.push(child as SVGElement);
            }
          });
        }

        interface ShapeGroup {
          wrapper: SVGGElement;
          speed: number;
          amplitude: number;
          phase: number;
          direction: number;
        }

        const shapeGroups: ShapeGroup[] = [];
        let gi = 0;
        let idx = 0;

        while (idx < topLevelEls.length) {
          const el = topLevelEls[idx];
          const next = topLevelEls[idx + 1];
          const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");

          if (el.tagName === "path" && next?.tagName === "circle") {
            const parent = el.parentNode!;
            parent.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            wrapper.appendChild(next);
            idx += 2;
          } else {
            const parent = el.parentNode!;
            parent.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            idx += 1;
          }

          shapeGroups.push({
            wrapper,
            speed: 0.04 + (gi % 5) * 0.015,
            amplitude: 20 + (gi % 4) * 10,
            phase: gi * 1.8,
            direction: gi % 2 === 0 ? 1 : -1,
          });
          gi++;
        }

        // --- Animation loop ---
        // Stroke cycle: construct → hold → deconstruct → pause
        // Total cycle: 12s per shape, each shape offset by ~1.5s
        const CYCLE_DURATION = 12; // seconds
        const CONSTRUCT = 0.22;    // 0–22%: draw on
        const HOLD = 0.55;         // 22–55%: visible
        const DECONSTRUCT = 0.78;  // 55–78%: draw off
        // 78–100%: hidden pause

        const startTime = performance.now();

        const animate = (time: number) => {
          rafRef.current = requestAnimationFrame(animate);
          const t = (time - startTime) / 1000;

          // Stroke construct/deconstruct loop
          strokeInfos.forEach(({ el, len }, i) => {
            const phase = (i * 1.2) % CYCLE_DURATION; // stagger each element
            const cycleT = ((t + phase) % CYCLE_DURATION) / CYCLE_DURATION;

            let offset: number;
            if (cycleT < CONSTRUCT) {
              // Constructing: len → 0
              offset = len * (1 - easeInOut(cycleT / CONSTRUCT));
            } else if (cycleT < HOLD) {
              // Holding: fully visible
              offset = 0;
            } else if (cycleT < DECONSTRUCT) {
              // Deconstructing: 0 → len
              const p = (cycleT - HOLD) / (DECONSTRUCT - HOLD);
              offset = len * easeInOut(p);
            } else {
              // Paused: fully hidden
              offset = len;
            }

            el.style.strokeDashoffset = `${offset}`;
          });

          // Fill opacity synced to stroke cycle
          fillInfos.forEach(({ el, origOpacity }, i) => {
            const phase = (i * 1.5) % CYCLE_DURATION;
            const cycleT = ((t + phase) % CYCLE_DURATION) / CYCLE_DURATION;

            let opacity: number;
            const maxOp = parseFloat(origOpacity) || 1;

            if (cycleT < CONSTRUCT) {
              opacity = maxOp * easeInOut(cycleT / CONSTRUCT);
            } else if (cycleT < HOLD) {
              opacity = maxOp;
            } else if (cycleT < DECONSTRUCT) {
              const p = (cycleT - HOLD) / (DECONSTRUCT - HOLD);
              opacity = maxOp * (1 - easeInOut(p));
            } else {
              opacity = 0;
            }

            el.style.opacity = `${opacity}`;
          });

          // Drift: major shapes shift up/down
          shapeGroups.forEach(({ wrapper, speed, amplitude, phase, direction }) => {
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
