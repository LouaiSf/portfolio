"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";

function AnimatedChar({ char, index }: { char: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 80, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5 + index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="inline-block"
      style={{ transformOrigin: "bottom" }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

function FloatingOrb({
  size,
  color,
  x,
  y,
  delay,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Deterministic particle data to avoid SSR/client Math.random() mismatch
const PARTICLES = [
  { x: 5, dur: 10, sz: 2.5, drift: -3 },
  { x: 12, dur: 14, sz: 3.2, drift: 2 },
  { x: 22, dur: 9, sz: 2.8, drift: -1 },
  { x: 30, dur: 13, sz: 4.0, drift: 4 },
  { x: 38, dur: 11, sz: 2.2, drift: -2 },
  { x: 45, dur: 15, sz: 3.5, drift: 1 },
  { x: 52, dur: 10, sz: 2.0, drift: -4 },
  { x: 60, dur: 12, sz: 3.8, drift: 3 },
  { x: 68, dur: 14, sz: 2.6, drift: -2 },
  { x: 75, dur: 9, sz: 4.2, drift: 1 },
  { x: 82, dur: 13, sz: 3.0, drift: -3 },
  { x: 90, dur: 11, sz: 2.4, drift: 2 },
  { x: 15, dur: 16, sz: 3.3, drift: -1 },
  { x: 48, dur: 10, sz: 2.7, drift: 4 },
  { x: 95, dur: 12, sz: 3.6, drift: -2 },
];

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Top glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99, 102, 241, 0.12), transparent)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rising particles — deterministic values */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{ width: p.sz, height: p.sz, left: `${p.x}%`, top: "110%" }}
          animate={{
            y: ["-10vh", "-120vh"],
            x: ["0vw", `${p.drift}vw`],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.dur,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Horizontal scanning lines */}
      <motion.div
        className="absolute h-px w-40 top-1/4"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)" }}
        animate={{ x: ["-10vw", "110vw"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute h-px w-60 top-2/3"
        style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.1), transparent)" }}
        animate={{ x: ["110vw", "-10vw"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 3 }}
      />
      <motion.div
        className="absolute h-px w-32 top-1/2"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.08), transparent)" }}
        animate={{ x: ["-10vw", "110vw"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 6 }}
      />

      {/* Pulsing rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/5"
        animate={{ width: [200, 600, 200], height: [200, 600, 200], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/5"
        animate={{ width: [100, 500, 100], height: [100, 500, 100], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Diagonal floating lines */}
      <motion.div
        className="absolute w-px h-32 top-[10%] left-[20%] origin-top"
        style={{ background: "linear-gradient(180deg, rgba(99,102,241,0.12), transparent)" }}
        animate={{ rotate: [0, 15, -15, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-px h-24 top-[30%] right-[15%] origin-top"
        style={{ background: "linear-gradient(180deg, rgba(167,139,250,0.1), transparent)" }}
        animate={{ rotate: [0, -20, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Small diamond shapes */}
      <motion.div
        className="absolute w-3 h-3 top-[15%] left-[70%] border border-primary/10 rotate-45"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-2 h-2 top-[65%] left-[25%] border border-accent/10 rotate-45"
        animate={{ scale: [1, 2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute w-4 h-4 top-[80%] right-[30%] border border-primary/8 rotate-45"
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15], rotate: [45, 90, 45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Crossing beams */}
      <motion.div
        className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.04) 50%, transparent 100%)" }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.03) 50%, transparent 100%)" }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}

function MagneticButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        document
          .querySelector(href)
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary/10 border border-primary/30 rounded-full text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="relative z-10"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

const TYPEWRITER_PHRASES = [
  "AI Engineer",
  "Full-Stack Developer",
  "ML Enthusiast",
  "Problem Solver",
];

function TypewriterSubtext() {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = TYPEWRITER_PHRASES[phraseIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed === current) {
      // pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed === "") {
      // move to next phrase
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
    } else {
      const speed = isDeleting ? 40 : 80;
      timeout = setTimeout(() => {
        setDisplayed(
          isDeleting
            ? current.slice(0, displayed.length - 1)
            : current.slice(0, displayed.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIdx]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="text-lg md:text-xl text-muted font-light tracking-wide h-8"
    >
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="text-primary ml-0.5"
      >
        |
      </motion.span>
    </motion.p>
  );
}

function CounterStat({ value, label }: { value: string; label: string }) {
  const numericPart = parseInt(value);
  const suffix = value.replace(/[0-9]/g, "");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controls = animate(0, numericPart, {
      duration: 2,
      delay: 2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (el) el.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [numericPart, suffix]);

  return (
    <div className="text-center">
      <span ref={ref} className="text-2xl md:text-3xl font-bold text-primary">
        0{suffix}
      </span>
      <p className="text-xs text-muted mt-1 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const name = "Louai Soufi";

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background elements */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <GridBackground />
        <FloatingOrb
          size={400}
          color="rgba(99, 102, 241, 0.08)"
          x="10%"
          y="20%"
          delay={0}
        />
        <FloatingOrb
          size={300}
          color="rgba(167, 139, 250, 0.06)"
          x="70%"
          y="60%"
          delay={2}
        />
        <FloatingOrb
          size={200}
          color="rgba(99, 102, 241, 0.05)"
          x="50%"
          y="10%"
          delay={4}
        />
      </motion.div>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050510_70%)]" />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity, scale }}
        className="relative z-10 px-6 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16"
      >
        {/* Left — text */}
        <div className="flex-1 text-center md:text-left">
          {/* Pre-title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary/80 tracking-wider uppercase">
              Available for opportunities
            </span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 glow-text leading-tight">
            {name.split("").map((char, i) => (
              <AnimatedChar key={i} char={char} index={i} />
            ))}
          </h1>

          {/* Subtitle — looping typewriter */}
          <TypewriterSubtext />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            className="mt-6 text-sm md:text-base text-muted/70 max-w-2xl leading-relaxed"
          >
            Building intelligent systems from machine learning models to scalable
            full-stack applications.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <MagneticButton href="#projects">View My Work</MagneticButton>
            <MagneticButton href="#contact">Get in Touch</MagneticButton>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="flex items-center gap-3 mt-2"
          >
            <a
              href="https://github.com/LouaiSf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center text-primary/60 hover:text-primary hover:border-primary/30 hover:bg-primary/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/louai-nasrellah-soufi-8940a1298"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center text-primary/60 hover:text-primary hover:border-primary/30 hover:bg-primary/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="mt-16 flex items-center justify-center md:justify-start gap-12"
          >
            <CounterStat value="6+" label="Projects" />
            <div className="w-px h-8 bg-primary/20" />
            <CounterStat value="10+" label="Technologies" />
            <div className="w-px h-8 bg-primary/20" />
            <CounterStat value="3+" label="Years Learning" />
          </motion.div>
        </div>

        {/* Right — photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative shrink-0"
        >
          {/* Glow behind photo */}
          <div className="absolute -inset-4 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
          {/* Rotating ring decoration */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-dashed border-primary/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full border border-dashed border-accent/10"
          />
          {/* Photo container */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary/20 bg-surface/60">
            <Image src="/me.png" alt="Louai Soufi" fill className="object-cover" priority />
          </div>
          {/* Small floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 -right-2 px-3 py-1.5 rounded-full bg-surface border border-primary/20 text-xs font-mono text-primary shadow-lg shadow-primary/10"
          >
            ⚡ Open to work
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted/50 tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-primary/30 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-2 rounded-full bg-primary/60"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
