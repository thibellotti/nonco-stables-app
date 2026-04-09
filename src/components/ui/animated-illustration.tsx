"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface AnimatedIllustrationProps {
  src: string;
  style?: CSSProperties;
  className?: string;
  /** Gentle float amplitude in px (default 8) */
  floatAmp?: number;
}

/**
 * Loads an SVG illustration inline and animates:
 * 1. Stroke draw-on (stroke-dashoffset) with stagger
 * 2. Fill elements fade in after strokes
 * 3. Gentle vertical float
 */
export function AnimatedIllustration({
  src,
  style,
  className,
  floatAmp = 8,
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

        // Inject SVG inline
        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (!svg) return;
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.overflow = "visible";

        if (prefersReduced) return;

        // Calculate stroke length for any SVG element
        function getLength(el: SVGGeometryElement): number {
          try {
            return el.getTotalLength();
          } catch {
            return 200;
          }
        }

        // Find all stroked elements
        const stroked = svg.querySelectorAll<SVGGeometryElement>(
          "path, circle, rect, line, polyline, polygon, ellipse"
        );

        const strokesToAnimate: { el: SVGGeometryElement; len: number }[] = [];

        stroked.forEach((el) => {
          const computedStroke = window.getComputedStyle(el).stroke;
          const hasStroke =
            computedStroke && computedStroke !== "none" && computedStroke !== "";
          const fill = window.getComputedStyle(el).fill;
          const isFillOnly =
            !hasStroke && fill && fill !== "none" && fill !== "";

          if (hasStroke) {
            const len = getLength(el);
            if (len > 0) {
              strokesToAnimate.push({ el, len });
              // Preserve existing dasharray pattern for dashed lines
              const existingDash = el.style.strokeDasharray || el.getAttribute("stroke-dasharray") || window.getComputedStyle(el).strokeDasharray;
              if (existingDash && existingDash !== "none" && existingDash !== "0") {
                // Dashed line — animate by growing the overall offset
                el.style.strokeDashoffset = `${len}`;
              } else {
                // Solid line — standard draw-on
                el.style.strokeDasharray = `${len}`;
                el.style.strokeDashoffset = `${len}`;
              }
            }
          }

          // Fade in filled elements
          if (isFillOnly) {
            const origOpacity = window.getComputedStyle(el).opacity;
            el.style.opacity = "0";
            el.style.transition = `opacity 1s ease 1.2s`;
            requestAnimationFrame(() => {
              el.style.opacity = origOpacity;
            });
          }
        });

        // Trigger stroke animations with stagger
        requestAnimationFrame(() => {
          strokesToAnimate.forEach(({ el, len }, i) => {
            const delay = i * 0.12;
            const duration = 1.2 + Math.min(len / 500, 1);
            el.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`;
            el.style.strokeDashoffset = "0";
          });
        });

        // Gentle float animation
        const startTime = performance.now();
        const animate = (time: number) => {
          rafRef.current = requestAnimationFrame(animate);
          const t = (time - startTime) / 1000;
          const dy = Math.sin(t * 0.4) * floatAmp;
          const dx = Math.cos(t * 0.3 + 1.5) * (floatAmp * 0.3);
          container.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        };
        rafRef.current = requestAnimationFrame(animate);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [src, floatAmp]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style, willChange: "transform" }}
    />
  );
}
