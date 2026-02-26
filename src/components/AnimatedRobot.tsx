"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Animated robot (bottom-right) that tracks the mouse with its eyes
 * and shoots laser beams to wherever the user clicks.
 * Full-screen canvas so lasers can reach any point on the page.
 */
export default function AnimatedRobot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const headAngle = useRef(0);
  const blinkTimer = useRef(0);
  const blinkState = useRef(0);
  const pulsePhase = useRef(0);
  const scanY = useRef(0);
  const armPhase = useRef(0);

  // Laser state: click target + remaining frames
  const laserTarget = useRef({ x: 0, y: 0 });
  const laserFrames = useRef(0); // counts down from 30 (~0.5s)
  const LASER_DURATION = 30;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleClick = (e: MouseEvent) => {
      laserTarget.current = { x: e.clientX, y: e.clientY };
      laserFrames.current = LASER_DURATION;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [mounted]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    canvas.width = screenW * 2;
    canvas.height = screenH * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, screenW, screenH);

    // Robot dimensions & position (bottom-right with 16px margin)
    const RW = 200;
    const RH = 260;
    const robotX = screenW - RW - 16;
    const robotY = screenH - RH - 16;

    // Eye level in screen coords (for laser origin)
    const eyeScreenY = robotY + 87;
    const leftEyeScreenX = robotX + 70;
    const rightEyeScreenX = robotX + 130;

    // Smooth mouse interpolation
    const sm = smoothMouse.current;
    const tm = mouseRef.current;
    sm.x += (tm.x - sm.x) * 0.06;
    sm.y += (tm.y - sm.y) * 0.06;

    // Direction from robot eyes to mouse
    const eyeCenterX = (leftEyeScreenX + rightEyeScreenX) / 2;
    const dx = sm.x - eyeCenterX;
    const dy = sm.y - eyeScreenY;
    const maxDist = 400;
    const nx = Math.max(-1, Math.min(1, dx / maxDist));
    const ny = Math.max(-1, Math.min(1, dy / maxDist));

    const targetAngle = nx * 10;
    headAngle.current += (targetAngle - headAngle.current) * 0.05;

    pulsePhase.current += 0.03;
    scanY.current += 0.02;
    armPhase.current += 0.015;

    // Blink
    blinkTimer.current += 1;
    if (blinkTimer.current > 200 + Math.sin(pulsePhase.current * 0.3) * 80) {
      blinkState.current = 1;
      blinkTimer.current = 0;
    }
    if (blinkState.current > 0) {
      blinkState.current += 0.15;
      if (blinkState.current > 2) blinkState.current = 0;
    }
    const blinkAmount = blinkState.current <= 1
      ? blinkState.current
      : 2 - blinkState.current;

    // ─── Draw robot (translated to bottom-right) ───
    ctx.save();
    ctx.translate(robotX, robotY);

    const rcx = RW / 2;
    const angle = (headAngle.current * Math.PI) / 180;

    ctx.save();
    ctx.translate(rcx, 120);
    ctx.rotate(angle * 0.3);
    ctx.translate(-rcx, -120);

    // === ANTENNA ===
    const antennaWobble = Math.sin(pulsePhase.current * 1.5) * 3;
    ctx.beginPath();
    ctx.moveTo(rcx, 50);
    ctx.quadraticCurveTo(rcx + antennaWobble, 25, rcx + antennaWobble * 0.5, 12);
    ctx.strokeStyle = "rgba(140,160,255,0.6)";
    ctx.lineWidth = 3;
    ctx.stroke();

    const tipGlow = 0.7 + Math.sin(pulsePhase.current * 2) * 0.3;
    const tipR = 7 + Math.sin(pulsePhase.current * 2) * 2;
    const grad0 = ctx.createRadialGradient(
      rcx + antennaWobble * 0.5, 12, 0,
      rcx + antennaWobble * 0.5, 12, tipR * 2.5
    );
    grad0.addColorStop(0, `rgba(140,160,255,${tipGlow})`);
    grad0.addColorStop(1, "rgba(140,160,255,0)");
    ctx.beginPath();
    ctx.arc(rcx + antennaWobble * 0.5, 12, tipR * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grad0;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rcx + antennaWobble * 0.5, 12, tipR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(140,160,255,${tipGlow + 0.2})`;
    ctx.fill();

    // === HEAD ===
    ctx.beginPath();
    ctx.roundRect(25, 45, 150, 106, 28);
    ctx.fillStyle = "rgba(20,22,50,0.95)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,255,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(30, 50, 140, 96, 24);
    ctx.strokeStyle = "rgba(140,160,255,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // === VISOR ===
    ctx.beginPath();
    ctx.roundRect(42, 63, 116, 48, 14);
    ctx.fillStyle = "rgba(80,90,180,0.1)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,255,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const scanPos = 63 + (Math.sin(scanY.current) * 0.5 + 0.5) * 48;
    const scanAlpha = 0.3 + Math.sin(scanY.current) * 0.15;
    ctx.beginPath();
    ctx.rect(44, scanPos, 112, 2);
    ctx.fillStyle = `rgba(140,160,255,${scanAlpha})`;
    ctx.fill();

    // === EYES ===
    const eyeMaxMove = 7;
    const ex = nx * eyeMaxMove;
    const ey = ny * eyeMaxMove;
    const leftEyeLocalX = 70;
    const rightEyeLocalX = 130;
    const eyeBaseY = 87;

    // If laser is active, eyes glow red
    const isLasing = laserFrames.current > 0;
    const laserLife = isLasing ? laserFrames.current / LASER_DURATION : 0;

    for (const ecx of [leftEyeLocalX, rightEyeLocalX]) {
      ctx.beginPath();
      ctx.arc(ecx, eyeBaseY, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5,5,18,0.98)";
      ctx.fill();
      ctx.strokeStyle = isLasing
        ? `rgba(255,80,80,${0.4 + laserLife * 0.4})`
        : "rgba(140,160,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const eyeGrad = ctx.createRadialGradient(
        ecx + ex, eyeBaseY + ey, 0,
        ecx + ex, eyeBaseY + ey, 16
      );
      if (isLasing) {
        eyeGrad.addColorStop(0, `rgba(255,100,100,${0.6 + laserLife * 0.4})`);
        eyeGrad.addColorStop(0.5, `rgba(255,60,60,${0.3 + laserLife * 0.3})`);
        eyeGrad.addColorStop(1, "rgba(255,60,60,0)");
      } else {
        eyeGrad.addColorStop(0, "rgba(130,150,255,1)");
        eyeGrad.addColorStop(0.5, "rgba(100,120,255,0.5)");
        eyeGrad.addColorStop(1, "rgba(100,120,255,0)");
      }
      ctx.beginPath();
      ctx.arc(ecx + ex, eyeBaseY + ey, 16, 0, Math.PI * 2);
      ctx.fillStyle = eyeGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ecx + ex, eyeBaseY + ey, 10, 0, Math.PI * 2);
      ctx.fillStyle = isLasing
        ? `rgba(255,120,120,${0.7 + laserLife * 0.3})`
        : "rgba(120,140,255,0.9)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ecx + ex * 1.1, eyeBaseY + ey * 1.1, 5, 0, Math.PI * 2);
      ctx.fillStyle = isLasing ? "rgba(255,200,200,1)" : "rgba(200,180,255,1)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ecx + ex * 1.1 - 2, eyeBaseY + ey * 1.1 - 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fill();

      if (blinkAmount > 0) {
        ctx.beginPath();
        ctx.arc(ecx, eyeBaseY, 18, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10,10,25,${blinkAmount * 0.95})`;
        ctx.fill();
      }
    }

    // === MOUTH ===
    const mouthWidth = 44 + Math.sin(pulsePhase.current * 0.8) * 4;
    const mouthX = rcx - mouthWidth / 2;
    ctx.beginPath();
    ctx.roundRect(mouthX, 122, mouthWidth, 5, 3);
    ctx.fillStyle = "rgba(140,160,255,0.25)";
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const dotX = mouthX + 6 + i * (mouthWidth - 12) / 4;
      const dotAlpha = 0.2 + Math.sin(pulsePhase.current + i * 0.5) * 0.1;
      ctx.beginPath();
      ctx.arc(dotX, 124.5, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(140,160,255,${dotAlpha})`;
      ctx.fill();
    }

    // === NECK ===
    ctx.beginPath();
    ctx.roundRect(78, 151, 44, 16, 5);
    ctx.fillStyle = "rgba(20,22,50,0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,255,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(88, 153); ctx.lineTo(88, 165);
    ctx.moveTo(100, 153); ctx.lineTo(100, 165);
    ctx.moveTo(112, 153); ctx.lineTo(112, 165);
    ctx.strokeStyle = "rgba(140,160,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // === BODY ===
    ctx.beginPath();
    ctx.roundRect(38, 167, 124, 60, 20);
    ctx.fillStyle = "rgba(20,22,50,0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.setLineDash([4, 4]);
    for (const lx of [60, 100, 140]) {
      ctx.beginPath();
      ctx.moveTo(lx, 175); ctx.lineTo(lx, 218);
      ctx.strokeStyle = "rgba(140,160,255,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const chestGlow = 0.5 + Math.sin(pulsePhase.current * 1.2) * 0.35;
    const chestGrad = ctx.createRadialGradient(rcx, 190, 0, rcx, 190, 18);
    chestGrad.addColorStop(0, `rgba(140,160,255,${chestGlow + 0.3})`);
    chestGrad.addColorStop(0.5, `rgba(100,120,255,${chestGlow * 0.6})`);
    chestGrad.addColorStop(1, "rgba(100,120,255,0)");
    ctx.beginPath();
    ctx.arc(rcx, 190, 18, 0, Math.PI * 2);
    ctx.fillStyle = chestGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rcx, 190, 6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,190,255,${chestGlow + 0.2})`;
    ctx.fill();

    // === ARMS ===
    const armSwing = Math.sin(armPhase.current) * 4;
    ctx.save();
    ctx.translate(30, 172);
    ctx.rotate((-3 + armSwing) * Math.PI / 180);
    ctx.beginPath();
    ctx.roundRect(-10, 0, 22, 44, 11);
    ctx.fillStyle = "rgba(20,22,50,0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,255,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(170, 172);
    ctx.rotate((3 - armSwing) * Math.PI / 180);
    ctx.beginPath();
    ctx.roundRect(-12, 0, 22, 44, 11);
    ctx.fillStyle = "rgba(20,22,50,0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(140,160,255,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // End robot local coords
    ctx.restore(); // head rotation
    ctx.restore(); // robot translation

    // ─── LASER BEAMS (drawn in screen coords) ───
    if (laserFrames.current > 0) {
      laserFrames.current -= 1;
      const life = (laserFrames.current + 1) / LASER_DURATION;
      const tx = laserTarget.current.x;
      const ty = laserTarget.current.y;

      // Eye positions in screen coords (accounting for eye movement)
      const lEyeX = leftEyeScreenX + ex;
      const lEyeY = eyeScreenY + ey;
      const rEyeX = rightEyeScreenX + ex;
      const rEyeY = eyeScreenY + ey;

      ctx.save();
      ctx.lineCap = "round";

      // Draw laser from each eye
      for (const [ox, oy] of [[lEyeX, lEyeY], [rEyeX, rEyeY]]) {
        // Outer glow beam
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(255,60,60,${life * 0.15})`;
        ctx.lineWidth = 8 * life;
        ctx.stroke();

        // Mid beam
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(255,100,80,${life * 0.4})`;
        ctx.lineWidth = 3 * life;
        ctx.stroke();

        // Core beam
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(255,200,200,${life * 0.8})`;
        ctx.lineWidth = 1.2 * life;
        ctx.stroke();
      }

      // Impact glow at target
      const impactR = 20 * life;
      const impactGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, impactR);
      impactGrad.addColorStop(0, `rgba(255,150,120,${life * 0.6})`);
      impactGrad.addColorStop(0.5, `rgba(255,60,60,${life * 0.2})`);
      impactGrad.addColorStop(1, "rgba(255,60,60,0)");
      ctx.beginPath();
      ctx.arc(tx, ty, impactR, 0, Math.PI * 2);
      ctx.fillStyle = impactGrad;
      ctx.fill();

      // Bright core at impact point
      ctx.beginPath();
      ctx.arc(tx, ty, 3 * life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${life * 0.9})`;
      ctx.fill();

      ctx.restore();
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let id: number;
    const loop = () => {
      draw();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [mounted, draw]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none select-none hidden lg:block"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
