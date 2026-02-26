"use client";

import { useRef, useState, FormEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

function MagneticButton({
  children,
  type = "button",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type={type}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-3xl" />
      </motion.div>
      {/* Animated decorations */}
      <motion.div
        className="absolute top-[12%] right-[10%] w-3 h-3 border border-accent/10 rotate-45"
        animate={{ rotate: [45, 225, 45] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[8%] w-2 h-2 rounded-full bg-primary/10"
        animate={{ y: [0, -15, 0], scale: [1, 1.5, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[25%] left-[3%] w-16 h-16 rounded-full border border-primary/[0.06]"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[5%] w-px h-20"
        style={{ background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.06), transparent)" }}
        animate={{ y: [-30, 30, -30] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ margin: "-50px" }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-primary/60 tracking-widest uppercase">
            04 — Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            Let&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Connect
            </span>
          </h2>
          <p className="text-muted mt-4 max-w-xl">
            Interested in collaborating or working together? Let&apos;s build
            something impactful.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ margin: "-50px" }}
          >
            <div className="space-y-8">
              {/* Email */}
              <motion.a
                href="mailto:louai.nasrellah.soufi@ensia.edu.dz"
                whileHover={{ x: 10 }}
                className="group flex items-start gap-4 p-4 rounded-xl border border-primary/10 bg-surface/40 hover:bg-surface/80 hover:border-primary/25 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">
                    Email
                  </p>
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                    louai.nasrellah.soufi@ensia.edu.dz
                  </p>
                </div>
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                href="https://www.linkedin.com/in/louai-nasrellah-soufi-8940a1298"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 10 }}
                className="group flex items-start gap-4 p-4 rounded-xl border border-primary/10 bg-surface/40 hover:bg-surface/80 hover:border-primary/25 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">
                    LinkedIn
                  </p>
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                    Louai Nasrellah Soufi
                  </p>
                </div>
              </motion.a>

              {/* GitHub */}
              <motion.a
                href="https://github.com/LouaiSf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 10 }}
                className="group flex items-start gap-4 p-4 rounded-xl border border-primary/10 bg-surface/40 hover:bg-surface/80 hover:border-primary/25 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">
                    GitHub
                  </p>
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                    LouaiSf
                  </p>
                </div>
              </motion.a>

              {/* Location */}
              <motion.div
                whileHover={{ x: 10 }}
                className="group flex items-start gap-4 p-4 rounded-xl border border-primary/10 bg-surface/40"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-sm text-foreground">Algiers, Algeria</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ margin: "-50px" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs text-muted uppercase tracking-widest mb-2 block">
                  Name
                </label>
                <motion.input
                  whileFocus={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-primary/10 text-foreground text-sm outline-none focus:bg-surface/80 transition-all duration-300 placeholder:text-muted/50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-xs text-muted uppercase tracking-widest mb-2 block">
                  Email
                </label>
                <motion.input
                  whileFocus={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
                  type="email"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-primary/10 text-foreground text-sm outline-none focus:bg-surface/80 transition-all duration-300 placeholder:text-muted/50"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-xs text-muted uppercase tracking-widest mb-2 block">
                  Message
                </label>
                <motion.textarea
                  whileFocus={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-primary/10 text-foreground text-sm outline-none focus:bg-surface/80 transition-all duration-300 placeholder:text-muted/50 resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              <MagneticButton
                type="submit"
                className="group relative w-full py-4 rounded-xl bg-primary/10 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] overflow-hidden"
              >
                <span className="relative z-10">
                  {submitted ? "Message Sent! ✓" : "Send Message"}
                </span>
              </MagneticButton>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
