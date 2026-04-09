"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface AnimatedIllustrationProps {
  src: string;
  style?: CSSProperties;
  className?: string;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export function AnimatedIllustration({ src, style, className }: AnimatedIllustrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
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

        // ── Classify elements ──
        interface StrokeInfo { el: SVGGeometryElement; len: number }
        interface FillInfo { el: SVGElement; origOpacity: string }

        const strokeInfos: StrokeInfo[] = [];
        const fillInfos: FillInfo[] = [];
        const dotPositions: { cx: number; cy: number; el: SVGElement }[] = [];

        const allEls = svg.querySelectorAll<SVGGeometryElement>(
          "path, circle, rect, line, polyline, polygon, ellipse"
        );

        allEls.forEach((el) => {
          const cs = window.getComputedStyle(el);
          const hasStroke = cs.stroke && cs.stroke !== "none";
          const hasFill = cs.fill && cs.fill !== "none";
          const isFillOnly = !hasStroke && hasFill;

          // Identify dots: small circles (r < 15) with fill
          const isDot =
            el.tagName === "circle" &&
            parseFloat(el.getAttribute("r") || "0") < 15 &&
            isFillOnly;

          if (isDot) {
            // Hide original dot — we'll replace with animated clusters
            el.style.opacity = "0";
            el.style.transition = "none";
            dotPositions.push({
              cx: parseFloat(el.getAttribute("cx") || "0"),
              cy: parseFloat(el.getAttribute("cy") || "0"),
              el,
            });
            return;
          }

          if (hasStroke) {
            const len = getLength(el);
            if (len > 0) {
              const dash = cs.strokeDasharray;
              const isDashed = dash && dash !== "none" && dash !== "0";
              if (!isDashed) el.style.strokeDasharray = `${len}`;
              el.style.strokeDashoffset = `${len}`;
              el.style.transition = "none";
              strokeInfos.push({ el, len });
            }
          }

          if (isFillOnly) {
            const orig = cs.opacity || "1";
            el.style.opacity = "0";
            el.style.transition = "none";
            fillInfos.push({ el, origOpacity: orig });
          }
        });

        // ── Create animated dot clusters ──
        // For each original dot position, spawn a vertical stack of 2-3 dots
        // Mix of filled (cyan) and stroked (white outline)

        interface DotCluster {
          dots: SVGElement[];
          triggerTime: number;   // when in the cycle this cluster appears
          cycleDuration: number; // how long the full cycle is
          showDuration: number;  // how long dots stay visible
        }

        const dotClusters: DotCluster[] = [];
        const DOT_R = 4;
        const DOT_GAP = 12; // vertical gap between stacked dots

        dotPositions.forEach((pos, pi) => {
          const count = 2 + Math.floor(seeded(pi) * 2); // 2 or 3 dots
          const dots: SVGElement[] = [];

          for (let d = 0; d < count; d++) {
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const cy = pos.cy + (d - (count - 1) / 2) * DOT_GAP; // vertical stack centered
            dot.setAttribute("cx", `${pos.cx}`);
            dot.setAttribute("cy", `${cy}`);
            dot.setAttribute("r", `${DOT_R}`);

            // Alternate: filled cyan vs white stroke
            const isFilled = seeded(pi * 10 + d) > 0.4;
            if (isFilled) {
              dot.setAttribute("fill", "#05e0f8");
              dot.setAttribute("stroke", "none");
            } else {
              dot.setAttribute("fill", "none");
              dot.setAttribute("stroke", "rgba(255,255,255,0.6)");
              dot.setAttribute("stroke-width", "1.2");
            }

            dot.style.opacity = "0";
            dot.style.transition = "none";
            svg.appendChild(dot);
            dots.push(dot);
          }

          dotClusters.push({
            dots,
            triggerTime: seeded(pi + 500) * 8, // random start within 0-8s
            cycleDuration: 6 + seeded(pi + 600) * 6, // 6-12s per cycle
            showDuration: 2.5 + seeded(pi + 700) * 2, // visible for 2.5-4.5s
          });
        });

        // ── Major shape grouping for drift ──
        const mainGroup = svg.querySelector(":scope > g") || svg;
        const topLevelEls = Array.from(mainGroup.children).filter(
          (c) => c.tagName !== "defs"
        ) as SVGElement[];

        if (mainGroup !== svg) {
          Array.from(svg.children).forEach((child) => {
            if (child !== mainGroup && child.tagName !== "defs" && child.tagName !== "circle") {
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
            el.parentNode!.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            wrapper.appendChild(next);
            idx += 2;
          } else {
            el.parentNode!.insertBefore(wrapper, el);
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

        // ── Animation loop ──
        const CYCLE = 12;
        const CONSTRUCT = 0.22;
        const HOLD = 0.55;
        const DECONSTRUCT = 0.78;

        const startTime = performance.now();

        const animate = (time: number) => {
          rafRef.current = requestAnimationFrame(animate);
          const t = (time - startTime) / 1000;

          // Stroke construct/deconstruct
          strokeInfos.forEach(({ el, len }, i) => {
            const ph = (i * 1.2) % CYCLE;
            const ct = ((t + ph) % CYCLE) / CYCLE;
            let offset: number;
            if (ct < CONSTRUCT) offset = len * (1 - easeInOut(ct / CONSTRUCT));
            else if (ct < HOLD) offset = 0;
            else if (ct < DECONSTRUCT) offset = len * easeInOut((ct - HOLD) / (DECONSTRUCT - HOLD));
            else offset = len;
            el.style.strokeDashoffset = `${offset}`;
          });

          // Fill opacity (non-dot)
          fillInfos.forEach(({ el, origOpacity }, i) => {
            const ph = (i * 1.5) % CYCLE;
            const ct = ((t + ph) % CYCLE) / CYCLE;
            const mx = parseFloat(origOpacity) || 1;
            let op: number;
            if (ct < CONSTRUCT) op = mx * easeInOut(ct / CONSTRUCT);
            else if (ct < HOLD) op = mx;
            else if (ct < DECONSTRUCT) op = mx * (1 - easeInOut((ct - HOLD) / (DECONSTRUCT - HOLD)));
            else op = 0;
            el.style.opacity = `${op}`;
          });

          // Dot clusters: appear in sequence, stacked vertically
          dotClusters.forEach(({ dots, triggerTime, cycleDuration, showDuration }) => {
            const ct = (t + triggerTime) % cycleDuration;

            dots.forEach((dot, di) => {
              // Each dot in the stack appears with a small delay
              const dotDelay = di * 0.3;
              const dotT = ct - dotDelay;

              let op = 0;
              if (dotT >= 0 && dotT < 0.4) {
                // Pop in
                op = easeInOut(dotT / 0.4);
              } else if (dotT >= 0.4 && dotT < showDuration) {
                // Hold
                op = 1;
              } else if (dotT >= showDuration && dotT < showDuration + 0.4) {
                // Fade out
                op = 1 - easeInOut((dotT - showDuration) / 0.4);
              }

              dot.style.opacity = `${Math.max(0, Math.min(1, op)) * 0.8}`;
            });
          });

          // Drift
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
