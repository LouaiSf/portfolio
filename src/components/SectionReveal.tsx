"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * Wraps a section so it fades/scales into focus as it enters the viewport
 * and slightly zooms out as it leaves \u2014 giving a "focus" feel when scrolling.
 */
export default function SectionReveal({ children, id, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Enter: 0->0.2 = fade/scale in, Middle: 0.2->0.8 = full, Exit: 0.8->1 = fade/scale out
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.15, 1, 1, 0.15]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.96, 1, 1, 0.96]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [40, 0, 0, -40]
  );

  return (
    <motion.div
      ref={ref}
      id={id}
      style={{ opacity, scale, y }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
