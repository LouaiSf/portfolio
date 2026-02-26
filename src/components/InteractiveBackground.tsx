"use client";

import { useEffect, useRef, useCallback } from "react";

interface Shape {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  type: "circle" | "ring" | "diamond" | "dot" | "cross";
  speed: number;
  angle: number;
  orbitRadius: number;
  color: string;
  alpha: number;
}

// Fixed seed positions so SSR and client match
const SHAPE_DEFS: Omit<Shape, "baseX" | "baseY">[] = [
  { x: 0, y: 0, size: 7, type: "circle", speed: 0.0003, angle: 0, orbitRadius: 40, color: "180,190,255", alpha: 0.35 },
  { x: 0, y: 0, size: 5, type: "ring", speed: 0.0005, angle: 1, orbitRadius: 30, color: "200,195,255", alpha: 0.30 },
  { x: 0, y: 0, size: 8, type: "diamond", speed: 0.0004, angle: 2, orbitRadius: 35, color: "180,190,255", alpha: 0.25 },
  { x: 0, y: 0, size: 5, type: "dot", speed: 0.0006, angle: 3, orbitRadius: 22, color: "190,200,255", alpha: 0.40 },
  { x: 0, y: 0, size: 7, type: "cross", speed: 0.0003, angle: 4, orbitRadius: 45, color: "180,190,255", alpha: 0.20 },
  { x: 0, y: 0, size: 5, type: "circle", speed: 0.0007, angle: 0.5, orbitRadius: 28, color: "200,195,255", alpha: 0.32 },
  { x: 0, y: 0, size: 10, type: "ring", speed: 0.0002, angle: 1.5, orbitRadius: 50, color: "180,190,255", alpha: 0.18 },
  { x: 0, y: 0, size: 5, type: "diamond", speed: 0.0005, angle: 2.5, orbitRadius: 25, color: "190,200,255", alpha: 0.28 },
  { x: 0, y: 0, size: 6, type: "dot", speed: 0.0004, angle: 3.5, orbitRadius: 38, color: "180,190,255", alpha: 0.25 },
  { x: 0, y: 0, size: 8, type: "circle", speed: 0.0003, angle: 4.5, orbitRadius: 42, color: "200,195,255", alpha: 0.22 },
  { x: 0, y: 0, size: 5, type: "cross", speed: 0.0006, angle: 5, orbitRadius: 30, color: "180,190,255", alpha: 0.30 },
  { x: 0, y: 0, size: 7, type: "ring", speed: 0.0004, angle: 5.5, orbitRadius: 35, color: "190,200,255", alpha: 0.20 },
  { x: 0, y: 0, size: 5, type: "diamond", speed: 0.0003, angle: 0.8, orbitRadius: 45, color: "180,190,255", alpha: 0.26 },
  { x: 0, y: 0, size: 8, type: "dot", speed: 0.0005, angle: 2.2, orbitRadius: 28, color: "200,195,255", alpha: 0.35 },
  { x: 0, y: 0, size: 7, type: "circle", speed: 0.0004, angle: 3.8, orbitRadius: 40, color: "180,190,255", alpha: 0.22 },
];

// Seed positions evenly across viewport
const POSITIONS = [
  [0.08, 0.12], [0.25, 0.08], [0.42, 0.15], [0.62, 0.06], [0.85, 0.14],
  [0.1, 0.4], [0.35, 0.35], [0.55, 0.45], [0.78, 0.38], [0.92, 0.5],
  [0.05, 0.7], [0.3, 0.65], [0.5, 0.75], [0.72, 0.68], [0.88, 0.8],
];

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const shapes = useRef<Shape[]>([]);
  const animRef = useRef(0);
  const timeRef = useRef(0);

  const initShapes = useCallback((w: number, h: number) => {
    shapes.current = SHAPE_DEFS.map((def, i) => {
      const [px, py] = POSITIONS[i];
      const bx = px * w;
      const by = py * h;
      return { ...def, x: bx, y: by, baseX: bx, baseY: by };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initShapes(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 1;

      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Mouse spotlight glow
      if (mx > 0 && my > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 250);
        grad.addColorStop(0, "rgba(99, 102, 241, 0.04)");
        grad.addColorStop(0.5, "rgba(99, 102, 241, 0.015)");
        grad.addColorStop(1, "rgba(99, 102, 241, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (const s of shapes.current) {
        // Orbit around base position
        s.angle += s.speed;
        const ox = s.baseX + Math.cos(s.angle * 60) * s.orbitRadius;
        const oy = s.baseY + Math.sin(s.angle * 60) * s.orbitRadius;

        // Repel gently from mouse
        const dx = ox - mx;
        const dy = oy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxInfluence = 250;
        let pushX = 0, pushY = 0;
        if (dist < maxInfluence && dist > 0) {
          const force = (1 - dist / maxInfluence) * 40;
          pushX = (dx / dist) * force;
          pushY = (dy / dist) * force;
        }

        // Smooth lerp
        s.x += (ox + pushX - s.x) * 0.05;
        s.y += (oy + pushY - s.y) * 0.05;

        // Breathing alpha
        const breathe = 0.7 + 0.3 * Math.sin(timeRef.current * 0.02 + s.angle * 10);
        const alpha = s.alpha * breathe;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.globalAlpha = alpha;

        switch (s.type) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color}, 1)`;
            ctx.fill();
            break;
          case "ring":
            ctx.beginPath();
            ctx.arc(0, 0, s.size, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${s.color}, 1)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            break;
          case "diamond":
            ctx.rotate(Math.PI / 4 + timeRef.current * 0.005);
            ctx.strokeStyle = `rgba(${s.color}, 1)`;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-s.size, -s.size, s.size * 2, s.size * 2);
            break;
          case "dot":
            ctx.beginPath();
            ctx.arc(0, 0, s.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color}, 1)`;
            ctx.fill();
            // Outer glow
            ctx.beginPath();
            ctx.arc(0, 0, s.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color}, 0.15)`;
            ctx.fill();
            break;
          case "cross":
            ctx.strokeStyle = `rgba(${s.color}, 1)`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-s.size, 0);
            ctx.lineTo(s.size, 0);
            ctx.moveTo(0, -s.size);
            ctx.lineTo(0, s.size);
            ctx.stroke();
            break;
        }

        ctx.restore();
      }

      // Draw faint connection lines between nearby shapes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < shapes.current.length; i++) {
        for (let j = i + 1; j < shapes.current.length; j++) {
          const a = shapes.current[i];
          const b = shapes.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 280) {
            const lineAlpha = (1 - dist / 280) * 0.15;
            ctx.strokeStyle = `rgba(180, 190, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [initShapes]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
