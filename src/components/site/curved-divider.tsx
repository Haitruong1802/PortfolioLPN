"use client";

import { motion } from "framer-motion";

type Props = {
  flip?: boolean;
  accent?: "orange" | "blue";
};

/**
 * Animated SVG divider — 2 paths draw in + a dot travels along path.
 */
export function CurvedDivider({ flip = false, accent = "orange" }: Props) {
  const accentColor =
    accent === "orange" ? "var(--brand-orange)" : "var(--brand-blue)";
  const oppositeColor =
    accent === "orange" ? "var(--brand-blue)" : "var(--brand-orange)";

  return (
    <div
      aria-hidden
      className={`relative my-6 h-24 w-full overflow-hidden md:my-10 md:h-32 ${
        flip ? "rotate-180" : ""
      }`}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`curved-grad-bg-${accent}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-border)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`curved-grad-accent-${accent}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="50%" stopColor={accentColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background subtle path */}
        <motion.path
          d="M 0 60 Q 300 0, 600 60 T 1200 60"
          fill="none"
          stroke={`url(#curved-grad-bg-${accent})`}
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Accent path — main visible */}
        <motion.path
          id={`accent-path-${accent}`}
          d="M 0 70 Q 300 10, 600 70 T 1200 70"
          fill="none"
          stroke={`url(#curved-grad-accent-${accent})`}
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Center dot */}
        <motion.circle
          cx="600"
          cy="60"
          r="3"
          fill={accentColor}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.6,
            delay: 1.4,
            type: "spring",
            stiffness: 200,
          }}
        />

        {/* Traveling particle 1 — small dot moves along the path */}
        <motion.circle
          r="4"
          fill={accentColor}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.3, delay: 1.8 }}
        >
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M 0 70 Q 300 10, 600 70 T 1200 70"
            begin="2s"
          />
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur="2s"
            repeatCount="indefinite"
            begin="2s"
          />
        </motion.circle>

        {/* Traveling particle 2 — opposite direction, smaller */}
        <motion.circle
          r="2.5"
          fill={oppositeColor}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.3, delay: 2.2 }}
        >
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            keyPoints="1;0"
            keyTimes="0;1"
            path="M 0 70 Q 300 10, 600 70 T 1200 70"
            begin="2.5s"
          />
          <animate
            attributeName="opacity"
            values="0.1;0.7;0.1"
            dur="3s"
            repeatCount="indefinite"
            begin="2.5s"
          />
        </motion.circle>
      </svg>
    </div>
  );
}
