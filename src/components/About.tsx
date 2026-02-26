"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Left side fades in first (0→0.25 of scroll)
  const leftOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const leftY = useTransform(scrollYProgress, [0, 0.2], [80, 0]);
  const leftScale = useTransform(scrollYProgress, [0, 0.2], [0.85, 1]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative"
    >
      {/* Background decoration */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl bg-primary/5 pointer-events-none"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl bg-accent/5 pointer-events-none"
      />
      {/* Floating shapes */}
      <motion.div
        className="absolute top-[10%] right-[8%] w-3 h-3 border border-primary/10 rotate-45"
        animate={{ rotate: [45, 225, 45], scale: [1, 1.5, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[5%] w-2 h-2 rounded-full bg-accent/10"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] right-[3%] w-16 h-16 rounded-full border border-primary/5"
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[40%] h-px w-20"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.1), transparent)" }}
        animate={{ x: [-40, 40, -40] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        {/* Sticky scroll layout — heading lives inside the sticky left column */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* LEFT — Sticky pinned at vertical center of viewport */}
          <div
            className="md:sticky self-start"
            style={{ top: "calc(50vh - 280px)" }}
          >
            <motion.div style={{ opacity: leftOpacity, y: leftY, scale: leftScale }}>
              {/* Section heading — part of the sticky left */}
              <div className="mb-8">
                <span className="text-xs font-mono text-primary/60 tracking-widest uppercase">
                  01 — About
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
                  Who I{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Am
                  </span>
                </h2>
              </div>

              <div className="relative aspect-square max-w-md">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-accent/10 rounded-2xl" />

                  <div className="absolute inset-0 p-8 flex flex-col justify-center">
                    {[
                      { text: "class AISolution:", color: "text-primary" },
                      { text: "  def __init__(self):", color: "text-accent" },
                      { text: "    self.stack = 'full'", color: "text-primary-light" },
                      { text: "    self.passion = True", color: "text-muted" },
                      { text: "", color: "" },
                      { text: "  def build(self):", color: "text-accent" },
                      { text: "    return Impact()", color: "text-primary" },
                    ].map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className={`font-mono text-sm md:text-base ${line.color} mb-2`}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                  </div>

                  <div className="absolute inset-0 rounded-2xl border border-primary/20" />
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-2xl" />
                </div>

                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-6 -right-6 w-24 h-24 border border-primary/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 border border-accent/10 rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Scrolls naturally, visually "catching up" to the left */}
          <div className="md:pt-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <p className="text-lg text-foreground/90 leading-relaxed mb-8">
                I am a third-year{" "}
                <span className="text-primary font-medium">
                  Artificial Intelligence
                </span>{" "}
                student at ENSIA focused on designing intelligent systems and
                scalable software solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <p className="text-base text-muted leading-relaxed mb-8">
                My expertise lies at the intersection of{" "}
                <span className="text-foreground/80">machine learning</span>,{" "}
                <span className="text-foreground/80">
                  algorithmic problem solving
                </span>
                ,{" "}
                <span className="text-foreground/80">backend architecture</span>
                , and{" "}
                <span className="text-foreground/80">
                  modern frontend development
                </span>
                .
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <p className="text-base text-muted leading-relaxed mb-12">
                I build complete systems — from data pipelines and optimization
                algorithms to{" "}
                <span className="text-primary/80">
                  production-ready applications
                </span>
                .
              </p>
            </motion.div>

            {/* Info grid */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: "Location", value: "Algiers, Algeria" },
                { label: "University", value: "ENSIA" },
                { label: "Focus", value: "AI & Full-Stack" },
                { label: "Year", value: "3rd Year" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(99, 102, 241, 0.3)",
                  }}
                  className="p-4 rounded-xl border border-primary/10 bg-surface/50 transition-colors"
                >
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
