"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface AnimatedIllustrationProps {
  src: string;
  style?: CSSProperties;
  className?: string;
  /** Rotate the entire SVG (degrees). Affects drift direction automatically. */
  rotate?: number;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function seeded(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export function AnimatedIllustration({ src, style, className, rotate }: AnimatedIllustrationProps) {
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

        // Apply rotation to SVG element itself so everything inside rotates
        if (rotate) {
          svg.style.transform = `rotate(${rotate}deg)`;
          svg.style.transformOrigin = "center center";
        }

        if (prefersReduced) return;

        function getLength(el: SVGGeometryElement): number {
          try { return el.getTotalLength(); } catch { return 200; }
        }

        // ── Classify elements ──
        interface StrokeInfo { el: SVGGeometryElement; len: number }
        interface FillInfo { el: SVGElement; origOpacity: string }

        const strokeInfos: StrokeInfo[] = [];
        const fillInfos: FillInfo[] = [];
        const dotPositions: { cx: number; cy: number }[] = [];

        const allEls = svg.querySelectorAll<SVGGeometryElement>(
          "path, circle, rect, line, polyline, polygon, ellipse"
        );

        allEls.forEach((el) => {
          const cs = window.getComputedStyle(el);
          const hasStroke = cs.stroke && cs.stroke !== "none";
          const hasFill = cs.fill && cs.fill !== "none";
          const isFillOnly = !hasStroke && hasFill;
          const isDot = el.tagName === "circle" && parseFloat(el.getAttribute("r") || "0") < 15 && isFillOnly;

          if (isDot) {
            el.style.opacity = "0";
            el.style.transition = "none";
            dotPositions.push({
              cx: parseFloat(el.getAttribute("cx") || "0"),
              cy: parseFloat(el.getAttribute("cy") || "0"),
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

        // ── Dot sequences — positioned in open spaces, avoiding big shapes ──
        interface DotCluster {
          dots: SVGElement[];
          triggerTime: number;
          cycleDuration: number;
          showDuration: number;
        }

        const dotClusters: DotCluster[] = [];
        const DOT_R = 3.5;
        const DOT_GAP = 11;

        // Get SVG viewBox dimensions
        const vb = svg.getAttribute("viewBox")?.split(" ").map(Number) || [0, 0, 800, 800];
        const vbW = vb[2] || 800;
        const vbH = vb[3] || 800;

        // Pre-defined safe zones (away from big shapes) + original positions
        // Spread across the illustration for dynamic feel
        const dotSlots: { cx: number; cy: number; count: number }[] = [];

        // Use original positions but shift slightly to avoid overlap
        dotPositions.forEach((pos, i) => {
          dotSlots.push({
            cx: pos.cx + (seeded(i + 80) - 0.5) * 40,
            cy: pos.cy + (seeded(i + 90) - 0.5) * 40,
            count: 2 + Math.floor(seeded(i) * 2), // 2-3
          });
        });

        // Add extra dot sequences in empty zones for better distribution
        const extraSlots = [
          { cx: vbW * 0.15, cy: vbH * 0.10 },
          { cx: vbW * 0.85, cy: vbH * 0.15 },
          { cx: vbW * 0.10, cy: vbH * 0.42 },
          { cx: vbW * 0.75, cy: vbH * 0.50 },
          { cx: vbW * 0.50, cy: vbH * 0.85 },
          { cx: vbW * 0.90, cy: vbH * 0.75 },
          { cx: vbW * 0.35, cy: vbH * 0.08 },
          { cx: vbW * 0.60, cy: vbH * 0.95 },
        ];

        // Only add extras that don't overlap with existing dot positions (>80px away)
        extraSlots.forEach((slot, i) => {
          const tooClose = dotSlots.some(
            (d) => Math.hypot(d.cx - slot.cx, d.cy - slot.cy) < 80
          );
          if (!tooClose) {
            dotSlots.push({
              cx: slot.cx,
              cy: slot.cy,
              count: 2 + Math.floor(seeded(i + 200) * 2),
            });
          }
        });

        dotSlots.forEach((slot, pi) => {
          const dots: SVGElement[] = [];

          // Vary orientation: some horizontal rows, some vertical, some diagonal
          const orientation = seeded(pi + 300);
          let dxStep: number, dyStep: number;
          if (orientation < 0.5) {
            // Horizontal row
            dxStep = DOT_GAP;
            dyStep = 0;
          } else if (orientation < 0.75) {
            // Vertical column
            dxStep = 0;
            dyStep = DOT_GAP;
          } else {
            // Diagonal
            dxStep = DOT_GAP * 0.7;
            dyStep = DOT_GAP * 0.7;
          }

          for (let d = 0; d < slot.count; d++) {
            const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const cx = slot.cx + (d - (slot.count - 1) / 2) * dxStep;
            const cy = slot.cy + (d - (slot.count - 1) / 2) * dyStep;
            dot.setAttribute("cx", `${cx}`);
            dot.setAttribute("cy", `${cy}`);

            // Vary dot sizes slightly
            const r = DOT_R + seeded(pi * 10 + d + 50) * 1.5;
            dot.setAttribute("r", `${r}`);

            // Mix: ~50% filled cyan, ~25% filled white, ~25% stroked
            const style = seeded(pi * 10 + d);
            if (style < 0.5) {
              dot.setAttribute("fill", "#05e0f8");
              dot.setAttribute("stroke", "none");
            } else if (style < 0.75) {
              dot.setAttribute("fill", "rgba(255,255,255,0.5)");
              dot.setAttribute("stroke", "none");
            } else {
              dot.setAttribute("fill", "none");
              dot.setAttribute("stroke", "rgba(255,255,255,0.45)");
              dot.setAttribute("stroke-width", "1.2");
            }

            dot.style.opacity = "0";
            dot.style.transition = "none";
            svg.appendChild(dot);
            dots.push(dot);
          }

          dotClusters.push({
            dots,
            triggerTime: seeded(pi + 500) * 10,
            cycleDuration: 5 + seeded(pi + 600) * 8, // 5-13s varied cycles
            showDuration: 2 + seeded(pi + 700) * 3,  // 2-5s hold
          });
        });

        // ── Major shape grouping — match paths + circles by coordinate proximity ──
        const mainGroup = svg.querySelector(":scope > g") || svg;
        const shapeEls = Array.from(mainGroup.children).filter(
          (c) => c.tagName !== "defs"
        ) as SVGElement[];

        // Also collect root-level non-dot elements
        if (mainGroup !== svg) {
          Array.from(svg.children).forEach((child) => {
            if (child !== mainGroup && child.tagName !== "defs" && child.tagName !== "circle") {
              shapeEls.push(child as SVGElement);
            }
          });
        }

        // Get start coordinate of a path (from M command)
        function getPathStart(el: SVGElement): { x: number; y: number } | null {
          const d = el.getAttribute("d");
          if (!d) return null;
          const m = d.match(/M\s*([\d.]+)\s*,\s*([\d.]+)/);
          return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
        }

        // Get center of a circle
        function getCircleCenter(el: SVGElement): { x: number; y: number } | null {
          const cx = el.getAttribute("cx");
          const cy = el.getAttribute("cy");
          return cx && cy ? { x: parseFloat(cx), y: parseFloat(cy) } : null;
        }

        // Match paths and circles that share a coordinate (belong to same compound shape)
        const paths = shapeEls.filter((el) => el.tagName === "path");
        const circles = shapeEls.filter(
          (el) => el.tagName === "circle" && parseFloat(el.getAttribute("r") || "0") >= 15
        );
        const others = shapeEls.filter(
          (el) => el.tagName !== "path" && !(el.tagName === "circle" && parseFloat(el.getAttribute("r") || "0") >= 15) && el.tagName !== "defs"
        );

        const usedCircles = new Set<SVGElement>();
        const groups: SVGElement[][] = [];

        // For each path, find matching circle (shared x or y coordinate within tolerance)
        paths.forEach((path) => {
          const ps = getPathStart(path);
          if (!ps) { groups.push([path]); return; }

          let bestCircle: SVGElement | null = null;
          let bestDist = Infinity;

          circles.forEach((circle) => {
            if (usedCircles.has(circle)) return;
            const cc = getCircleCenter(circle);
            if (!cc) return;
            // Check if they share X or Y within radius tolerance
            const dx = Math.abs(ps.x - cc.x);
            const dy = Math.abs(ps.y - cc.y);
            const dist = Math.min(dx, dy); // One axis should be close
            if (dist < 5 && (dx + dy) < bestDist) {
              bestDist = dx + dy;
              bestCircle = circle;
            }
          });

          if (bestCircle) {
            usedCircles.add(bestCircle);
            groups.push([path, bestCircle]);
          } else {
            groups.push([path]);
          }
        });

        // Add unmatched circles as individual groups
        circles.forEach((c) => {
          if (!usedCircles.has(c)) groups.push([c]);
        });

        // Add other elements
        others.forEach((el) => groups.push([el]));

        interface ShapeGroup {
          wrapper: SVGGElement;
          speed: number;
          amplitude: number;
          phase: number;
          direction: number;
        }

        const shapeGroups: ShapeGroup[] = [];

        groups.forEach((els, gi) => {
          const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
          const parent = els[0].parentNode!;
          parent.insertBefore(wrapper, els[0]);
          els.forEach((el) => wrapper.appendChild(el));

          shapeGroups.push({
            wrapper,
            speed: 0.04 + (gi % 5) * 0.015,
            amplitude: 20 + (gi % 4) * 10,
            phase: gi * 1.8,
            direction: gi % 2 === 0 ? 1 : -1,
          });
        });

        // ── Animation loop ──
        const CYCLE = 12;
        const CONSTRUCT = 0.22;
        const HOLD = 0.55;
        const DECONSTRUCT = 0.78;
        const startTime = performance.now();

        // Drift axis: X in SVG space = sideways on screen (works for both rotated and non-rotated)
        const animate = (time: number) => {
          rafRef.current = requestAnimationFrame(animate);
          const t = (time - startTime) / 1000;

          // Stroke loop
          strokeInfos.forEach(({ el, len }, i) => {
            const ph = (i * 1.2) % CYCLE;
            const ct = ((t + ph) % CYCLE) / CYCLE;
            let off: number;
            if (ct < CONSTRUCT) off = len * (1 - easeInOut(ct / CONSTRUCT));
            else if (ct < HOLD) off = 0;
            else if (ct < DECONSTRUCT) off = len * easeInOut((ct - HOLD) / (DECONSTRUCT - HOLD));
            else off = len;
            el.style.strokeDashoffset = `${off}`;
          });

          // Fill opacity
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

          // Dot clusters
          dotClusters.forEach(({ dots, triggerTime, cycleDuration, showDuration }) => {
            const ct = (t + triggerTime) % cycleDuration;
            dots.forEach((dot, di) => {
              const dotT = ct - di * 0.3;
              let op = 0;
              if (dotT >= 0 && dotT < 0.4) op = easeInOut(dotT / 0.4);
              else if (dotT >= 0.4 && dotT < showDuration) op = 1;
              else if (dotT >= showDuration && dotT < showDuration + 0.4) op = 1 - easeInOut((dotT - showDuration) / 0.4);
              dot.style.opacity = `${Math.max(0, Math.min(1, op)) * 0.8}`;
            });
          });

          // Sideways drift — translate along X (horizontal)
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
  }, [src, rotate]);

  return <div ref={containerRef} className={className} style={style} />;
}
