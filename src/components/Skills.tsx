"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    icon: "⟨/⟩",
    skills: [
      { name: "Python", level: 90, color: "#6366f1" },
      { name: "C++", level: 75, color: "#818cf8" },
      { name: "JavaScript", level: 85, color: "#a78bfa" },
      { name: "PHP", level: 65, color: "#6366f1" },
      { name: "Bash", level: 60, color: "#818cf8" },
    ],
  },
  {
    title: "Machine Learning",
    icon: "⊛",
    skills: [
      { name: "Scikit-learn", level: 85, color: "#6366f1" },
      { name: "Pandas", level: 90, color: "#818cf8" },
      { name: "NumPy", level: 88, color: "#a78bfa" },
      { name: "Feature Engineering", level: 80, color: "#6366f1" },
      { name: "Model Evaluation", level: 82, color: "#818cf8" },
    ],
  },
  {
    title: "Frontend",
    icon: "◈",
    skills: [
      { name: "React", level: 85, color: "#6366f1" },
      { name: "Next.js", level: 80, color: "#818cf8" },
    ],
  },
  {
    title: "Backend",
    icon: "⬡",
    skills: [
      { name: "Express", level: 80, color: "#6366f1" },
      { name: "Node.js", level: 82, color: "#818cf8" },
    ],
  },
  {
    title: "Mobile",
    icon: "◻",
    skills: [{ name: "Flutter", level: 75, color: "#6366f1" }],
  },
  {
    title: "Databases",
    icon: "⊞",
    skills: [
      { name: "MySQL", level: 80, color: "#6366f1" },
      { name: "Oracle SQL", level: 70, color: "#818cf8" },
      { name: "Firebase", level: 75, color: "#a78bfa" },
      { name: "Supabase", level: 72, color: "#6366f1" },
    ],
  },
  {
    title: "Tools",
    icon: "⚙",
    skills: [
      { name: "Git", level: 88, color: "#6366f1" },
      { name: "Linux", level: 80, color: "#818cf8" },
      { name: "Jupyter", level: 85, color: "#a78bfa" },
    ],
  },
];

function SkillBar({
  skill,
  index,
}: {
  skill: Skill;
  index: number;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-foreground/80">{skill.name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          viewport={{ margin: "-50px" }}
          className="text-xs font-mono text-primary/60"
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{
            duration: 1.2,
            delay: 0.3 + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          viewport={{ margin: "-50px" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
            boxShadow: `0 0 10px ${skill.color}40`,
          }}
        />
      </div>
    </div>
  );
}

function Card3D({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className="group relative p-6 rounded-2xl border border-primary/10 bg-surface/40 hover:bg-surface/80 hover:border-primary/25 transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.08)]"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl text-primary">{category.icon}</span>
          <h3 className="text-lg font-semibold text-foreground">
            {category.title}
          </h3>
        </div>

        {/* Skills */}
        {category.skills.map((skill, i) => (
          <SkillBar key={skill.name} skill={skill} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
      </motion.div>
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
            02 — Skills
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Expertise
            </span>
          </h2>
          <p className="text-muted mt-4 max-w-xl">
            A diverse toolkit spanning AI/ML, full-stack development, and modern
            DevOps practices.
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => (
            <Card3D key={category.title} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
