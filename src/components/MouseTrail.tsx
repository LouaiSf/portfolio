"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let lastX = -100;
    let lastY = -100;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new points when the mouse moves enough
      const dx = mouse.current.x - lastX;
      const dy = mouse.current.y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3) {
        points.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          age: 0,
        });
        lastX = mouse.current.x;
        lastY = mouse.current.y;
      }

      // Update & draw points
      const maxAge = 120; // frames (~2 seconds at 60fps)
      points.current = points.current.filter((p) => p.age < maxAge);

      for (let i = 0; i < points.current.length; i++) {
        const p = points.current[i];
        p.age += 1;

        const life = 1 - p.age / maxAge;
        const radius = 3.5 * life;
        const alpha = life * 0.7;

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 160, 255, ${alpha * 0.2})`;
        ctx.fill();
      }

      // Draw a connected trail line
      if (points.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);
        for (let i = 1; i < points.current.length; i++) {
          const p = points.current[i];
          const life = 1 - p.age / maxAge;
          ctx.strokeStyle = `rgba(255, 255, 255, ${life * 0.18})`;
          ctx.lineWidth = life * 2;
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
