"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

/** Max distance (px) at which two neurons are considered connected. */
const LINK_DISTANCE = 155;
/** One neuron per this many square pixels of viewport. */
const AREA_PER_NODE = 24000;
const MIN_NODES = 38;
const MAX_NODES = 88;
/** Depth limit for a signal cascading along edges. */
const MAX_FIRE_DEPTH = 3;
const MAX_PULSES = 50;

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Activation, 0–1, decays every frame. */
  act: number;
  /** Phase of the idle "breathing" oscillation. */
  phase: number;
  r: number;
}

interface Pulse {
  a: number;
  b: number;
  /** Travel progress along the edge, 0–1. */
  t: number;
  speed: number;
  depth: number;
}

type Rgb = [number, number, number];

/**
 * Resolves a CSS custom property to an [r, g, b] triple.
 *
 * The tokens are authored in oklch, which canvas cannot blend with a
 * per-pixel alpha, so we let a 1×1 canvas do the colour-space conversion.
 */
function readToken(probe: CanvasRenderingContext2D, name: string, fallback: Rgb): Rgb {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) return fallback;
  try {
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "#000";
    probe.fillStyle = value;
    // An invalid colour leaves fillStyle untouched, so it stays "#000".
    if (probe.fillStyle === "#000000") return fallback;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  } catch {
    return fallback;
  }
}

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  // Set up by the effect below; called again whenever the theme flips.
  const recolorRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const probeCanvas = document.createElement("canvas");
    probeCanvas.width = 1;
    probeCanvas.height = 1;
    const probe = probeCanvas.getContext("2d", { willReadFrequently: true });
    if (!probe) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let rafId = 0;
    let running = false;

    const mouse = { x: -9999, y: -9999, active: false };
    const colors = {
      accent: [120, 200, 255] as Rgb,
      line: [120, 130, 160] as Rgb,
      dark: true,
    };

    function recolor() {
      colors.accent = readToken(probe!, "--accent", [120, 200, 255]);
      colors.line = readToken(probe!, "--ink-faint", [120, 130, 160]);
      colors.dark = document.documentElement.classList.contains("dark");
    }
    recolorRef.current = () => {
      recolor();
      if (!running) paintStatic();
    };

    function build() {
      const target = Math.max(
        MIN_NODES,
        Math.min(Math.round((W * H) / AREA_PER_NODE), MAX_NODES)
      );
      nodes = [];
      for (let i = 0; i < target; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = 0.05 + Math.random() * 0.09;
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          act: 0,
          phase: Math.random() * Math.PI * 2,
          r: 1.2 + Math.random() * 1.1,
        });
      }
      pulses = [];
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (!running) paintStatic();
    }

    function neighbors(i: number) {
      const out: { j: number; d: number }[] = [];
      const n = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const d = Math.hypot(nodes[j].x - n.x, nodes[j].y - n.y);
        if (d < LINK_DISTANCE) out.push({ j, d });
      }
      out.sort((a, b) => a.d - b.d);
      return out;
    }

    function fire(i: number, depth: number) {
      const n = nodes[i];
      if (!n) return;
      n.act = 1;
      if (depth > MAX_FIRE_DEPTH || pulses.length > MAX_PULSES) return;
      const nb = neighbors(i);
      const cap = depth === 0 ? 2 : 1;
      let sent = 0;
      for (let k = 0; k < nb.length && sent < cap; k++) {
        const prob = (depth === 0 ? 0.8 : 0.4) * (1 - nb[k].d / LINK_DISTANCE);
        if (Math.random() < prob) {
          pulses.push({
            a: i,
            b: nb[k].j,
            t: 0,
            speed: 0.45 + Math.random() * 0.35,
            depth,
          });
          sent++;
        }
      }
    }

    function nearest(x: number, y: number) {
      let best = -1;
      let bd = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const d = (nodes[i].x - x) ** 2 + (nodes[i].y - y) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      return best;
    }

    function rgba(c: Rgb, a: number) {
      return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    }

    function drawLinks(alphaScale: number) {
      ctx!.lineWidth = 0.6;
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d >= LINK_DISTANCE) continue;
          ctx!.strokeStyle = rgba(colors.line, alphaScale * (1 - d / LINK_DISTANCE));
          ctx!.beginPath();
          ctx!.moveTo(nodes[a].x, nodes[a].y);
          ctx!.lineTo(nodes[b].x, nodes[b].y);
          ctx!.stroke();
        }
      }
    }

    let lastSpontaneous = 0;
    let lastFrame = 0;

    function frame(now: number) {
      if (!running) return;
      const dt = Math.min(40, now - (lastFrame || now));
      lastFrame = now;
      const k = dt / 16.67;

      ctx!.clearRect(0, 0, W, H);

      if (now - lastSpontaneous > 1500 + Math.random() * 2200) {
        lastSpontaneous = now;
        if (nodes.length) fire((Math.random() * nodes.length) | 0, 0);
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * k;
        n.y += n.vy * k;
        if (n.x < -25) n.x = W + 25;
        else if (n.x > W + 25) n.x = -25;
        if (n.y < -25) n.y = H + 25;
        else if (n.y > H + 25) n.y = -25;
        n.phase += 0.012 * k;
        n.act *= Math.pow(0.93, k);

        const sp = Math.hypot(n.vx, n.vy);
        if (sp < 0.035) {
          const a = Math.random() * Math.PI * 2;
          n.vx += Math.cos(a) * 0.015;
          n.vy += Math.sin(a) * 0.015;
        }
        if (sp > 0.3) {
          n.vx *= 0.9;
          n.vy *= 0.9;
        }

        if (mouse.active) {
          const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (md < 150) {
            n.act = Math.max(n.act, 0.16 * (1 - md / 150));
            if (md < 60 && Math.random() < 0.0035 * k) fire(i, 1);
          }
        }
      }

      if (colors.dark) ctx!.globalCompositeOperation = "lighter";

      drawLinks(colors.dark ? 0.045 : 0.1);

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pl = pulses[p];
        pl.t += pl.speed * 0.03 * k;
        const na = nodes[pl.a];
        const nb = nodes[pl.b];
        if (!na || !nb) {
          pulses.splice(p, 1);
          continue;
        }
        if (pl.t >= 1) {
          pulses.splice(p, 1);
          fire(pl.b, pl.depth + 1);
          continue;
        }
        const hx = na.x + (nb.x - na.x) * pl.t;
        const hy = na.y + (nb.y - na.y) * pl.t;
        const g = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 8);
        g.addColorStop(0, "rgba(255,255,255,0.8)");
        g.addColorStop(0.4, rgba(colors.accent, 0.55));
        g.addColorStop(1, rgba(colors.accent, 0));
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(hx, hy, 8, 0, Math.PI * 2);
        ctx!.fill();
      }

      for (let m = 0; m < nodes.length; m++) {
        const nd = nodes[m];
        const breathe = 0.5 + 0.5 * Math.sin(nd.phase);
        const act = nd.act;
        if (act > 0.04) {
          const rr = 4 + act * 17;
          const gg = ctx!.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, rr);
          gg.addColorStop(0, rgba(colors.accent, 0.36 * act));
          gg.addColorStop(1, rgba(colors.accent, 0));
          ctx!.fillStyle = gg;
          ctx!.beginPath();
          ctx!.arc(nd.x, nd.y, rr, 0, Math.PI * 2);
          ctx!.fill();
        }
        const core: Rgb =
          act > 0.35 ? [255, 255, 255] : colors.dark ? [180, 200, 232] : [95, 105, 135];
        const coreA = (colors.dark ? 0.3 : 0.44) + act * 0.45;
        ctx!.fillStyle = rgba(core, Math.min(1, coreA * (0.6 + breathe * 0.4)));
        ctx!.beginPath();
        ctx!.arc(nd.x, nd.y, nd.r + act * 1.8, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(frame);
    }

    /** Single still paint used for reduced motion, hidden tabs and resizes. */
    function paintStatic() {
      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, W, H);
      drawLinks(0.13);
      const core: Rgb = colors.dark ? [180, 200, 232] : [95, 105, 135];
      ctx!.fillStyle = rgba(core, 0.5);
      for (let m = 0; m < nodes.length; m++) {
        ctx!.beginPath();
        ctx!.arc(nodes[m].x, nodes[m].y, nodes[m].r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function start() {
      if (running || reduceMotion.matches || document.hidden) return;
      running = true;
      lastFrame = 0;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    function onPointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onPointerLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onPointerDown(e: PointerEvent) {
      if (!running) return;
      const i = nearest(e.clientX, e.clientY);
      if (i >= 0) fire(i, 0);
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onMotionPreference() {
      if (reduceMotion.matches) {
        stop();
        paintStatic();
      } else {
        start();
      }
    }

    recolor();
    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionPreference);

    if (reduceMotion.matches) paintStatic();
    else start();

    return () => {
      stop();
      recolorRef.current = null;
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionPreference);
    };
  }, []);

  // The tokens change with the theme class; re-read them without a full rebuild.
  useEffect(() => {
    recolorRef.current?.();
  }, [theme]);

  return <canvas ref={canvasRef} id="neural" aria-hidden="true" />;
}
