"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

interface Project {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  gradient: string;
  /** Optional screenshot in /public (e.g. "/projects/streetwatch.png"). Falls back to a branded monogram header when absent. */
  image?: string;
  link?: string;
  linkLabel?: string;
}

/** Derive a 1–2 letter monogram from a project title for the fallback header. */
function getMonogram(title: string): string {
  const caps = title.match(/[A-Z]/g);
  if (caps && caps.length >= 2) return caps.slice(0, 2).join("");
  return title.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
}

const projects: Project[] = [
  {
    id: 5,
    title: "StreetWatch — Citizen Road-Damage Reporting",
    shortTitle: "StreetWatch",
    description:
      "Offline-first mobile app where citizens report road damage, with an on-device CNN that classifies the damage type from a photo.",
    longDescription:
      "A two-part platform for road infrastructure. The Flutter mobile app lets citizens sign in with Google, explore an interactive map of nearby damage reports filterable by type, browse a community feed where they can upvote and filter reports, and capture new reports with the camera. The core feature is fully on-device image classification with TensorFlow Lite: a captured photo is split into 112×112 patches, each patch is classified, and the report's damage type (pothole, alligator crack, transversal crack, …) is decided by aggregating the patch predictions. A dedicated 'background' class trained into the model gates out irrelevant photos, so random captures are rejected before a report is created. The app is offline-first — inference runs locally, reports are cached in a local Hive database, and captures made without connectivity sit in an offline queue that syncs to Supabase automatically once a connection returns. Gamification (leaderboard and badges) rewards active reporters. A companion web dashboard for authorities (Next.js / React) provides analytics over incoming reports and lets officials triage and mark reports as fixed.",
    tags: [
      "Flutter",
      "TensorFlow Lite",
      "Supabase",
      "Hive",
      "Docker",
      "Next.js",
    ],
    gradient: "from-amber-500/20 to-orange-500/20",
    image: "/streetwatch_bg.png",
    linkLabel: "Link coming soon",
  },
  {
    id: 6,
    title: "Privacy-Preserving Face Recognition via Federated Learning",
    shortTitle: "Federated Face Recognition",
    description:
      "Face-recognition models trained across client devices using federated learning — no raw image ever leaves the device.",
    longDescription:
      "A privacy-preserving face-recognition system trained with federated learning, so no single face image is ever sent to a central server. Training starts from a model pretrained on public celebrity faces. Each round, every client device fine-tunes the shared baseline locally using only its own positive-class images, then sends just the updated weights (never the images) to the central server. The server applies spread-out regularization to keep identity embeddings well separated, averages the client updates into a new global model, and redistributes it to the clients. This loop repeats for several iterations, progressively improving recognition while keeping all biometric data on-device.",
    tags: [
      "PyTorch",
      "Federated Learning",
      "Privacy-Preserving ML",
      "Face Recognition",
      "Computer Vision",
    ],
    gradient: "from-cyan-500/20 to-blue-500/20",
    image: "/face_recognition.jpg",
    linkLabel: "View in Github",
    link: "https://github.com/akrambel2115/Privacy-Preserving-Face-Recognition-using-Federated-Learning",
  },
  {
    id: 1,
    title: "Fantasy Premier League Points Prediction System",
    shortTitle: "FPL Predictor",
    description:
      "End-to-end ML pipeline predicting player performance using structured historical data and model evaluation.",
    longDescription:
      "A comprehensive machine learning system that predicts Fantasy Premier League player points using historical performance data. Features include automated data collection, feature engineering pipelines, multiple model comparison (Random Forest, XGBoost, Neural Networks), and a systematic evaluation framework with cross-validation and hyperparameter tuning.",
    tags: ["Python", "Scikit-learn", "Pandas", "ML Pipeline", "Feature Engineering"],
    gradient: "from-indigo-500/20 to-purple-500/20",
    link: "https://github.com/LouaiSf/Fantasy-premier-league-points-prediction",
    linkLabel: "View on GitHub",
    image: "/fpl.jpg",
  },
  {
    id: 2,
    title: "AI-Powered Job Matching System",
    shortTitle: "Job Matcher AI",
    description:
      "Optimization-based matching system using A*, Genetic Algorithms, and Constraint Satisfaction.",
    longDescription:
      "An intelligent job matching platform that leverages classical AI algorithms to optimally pair candidates with job opportunities. Implements A* search for optimal path finding in skill-matching graphs, Genetic Algorithms for multi-objective optimization of match quality, and CSP solvers for constraint satisfaction across multiple hiring criteria.",
    tags: ["Python", "A*", "Genetic Algorithms", "CSP", "Optimization"],
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    link: "https://github.com/HassaneAitAhmed/Job-Matching-AI-Platform",
    linkLabel: "View on GitHub",
    image: "/job_matching.jpg",
  },
  {
    id: 3,
    title: "FootLink — Amateur Football App",
    shortTitle: "FootLink",
    description:
      "Flutter-based mobile platform enabling match organization and skill-based player discovery.",
    longDescription:
      "A mobile application built with Flutter and Firebase that connects amateur football players. Key features include real-time match scheduling, player profiles, skill-based matchmaking, team formation tools, and a social feed for local football communities. Uses Firebase for real-time data sync and authentication.",
    tags: ["Flutter", "Firebase", "Dart", "Mobile", "Real-time"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    link: "https://footlink-ochre.vercel.app/",
    linkLabel: "View Live",
    image: "/footlink_bg.png",
  },
  {
    id: 4,
    title: "Online Appointment Management Platform",
    shortTitle: "Appointment System",
    description:
      "Full-stack system with React/Next.js frontend and Express backend supporting real-time scheduling.",
    longDescription:
      "A production-ready appointment management platform featuring a responsive React/Next.js frontend with an Express.js backend. Includes real-time availability checking, automated scheduling, email notifications, role-based access control, and a dashboard with analytics. Built with modern full-stack practices including REST APIs and Supabase for database and auth.",
    tags: ["React", "Next.js", "Express", "Node.js", "Supabase"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    link: "https://medi-connect-amber.vercel.app/home",
    linkLabel: "View Live",
    image: "/mediconnect.png",
  },
];

/* ───────────────────────────────────────────
   Static card (no per-card scroll tracking)
   ─────────────────────────────────────────── */
function StaticCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer rounded-2xl border border-primary/10 bg-surface/40 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(99,102,241,0.1)]"
    >
      {/* Project visual header */}
      <div
        className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${project.gradient}`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.shortTitle}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl md:text-7xl font-bold tracking-tight text-white/15 group-hover:text-white/25 transition-colors duration-500">
                {getMonogram(project.shortTitle)}
              </span>
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="text-sm font-medium text-primary">
            Click to explore →
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {project.shortTitle}
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary/70 border border-primary/10"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs px-3 py-1 rounded-full bg-surface-light text-muted">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Modal
   ─────────────────────────────────────────── */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full max-h-[90vh] rounded-3xl border border-primary/20 bg-surface overflow-y-auto shadow-2xl shadow-primary/10"
      >
        <div
          className={`relative aspect-[16/9] overflow-hidden flex items-center justify-center bg-gradient-to-br ${project.gradient}`}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.shortTitle}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
          ) : (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="text-7xl font-bold tracking-tight text-white/20"
            >
              {getMonogram(project.shortTitle)}
            </motion.span>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/80 transition-all"
          >
            ✕
          </button>
        </div>
        <div className="p-8">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            {project.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted leading-relaxed mb-6"
          >
            {project.longDescription}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="text-sm px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
          {project.link ? (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium text-sm hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              {project.linkLabel ?? "View project"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          ) : (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-light/60 border border-primary/10 text-muted font-medium text-sm"
            >
              {project.linkLabel ?? "Link coming soon"}
            </motion.span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────
   Main Projects section — normal scroll layout
   with per-card whileInView animations
   ─────────────────────────────────────────── */
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background blobs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-accent/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl" />
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
            03 — Projects
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Work
            </span>
          </h2>
          <p className="text-muted mt-4 max-w-xl">
            A selection of projects showcasing my expertise in AI, optimization,
            and full-stack development.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: i % 2 === 0 ? 0 : 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ margin: "-50px" }}
            >
              <StaticCard
                project={project}
                onOpen={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
