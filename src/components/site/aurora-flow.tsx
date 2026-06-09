"use client";

import { motion } from "framer-motion";

/**
 * Aurora flow — 2 huge blurred color gradients drifting across the viewport,
 * creating a "northern lights" atmosphere behind everything.
 *
 * - Layer 1: warm cam, sweeps top-left → bottom-right (35s)
 * - Layer 2: cool xanh, sweeps opposite direction (50s)
 * - Both have low opacity + heavy blur → never obtrusive, always present
 */
export function AuroraFlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-30 overflow-hidden"
    >
      {/* Layer 1 — orange aurora */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "85vw",
          height: "85vw",
          background:
            "radial-gradient(circle, var(--brand-orange) 0%, transparent 55%)",
          filter: "blur(140px)",
          opacity: 0.1,
          left: "-20%",
          top: "-20%",
        }}
        animate={{
          x: ["0%", "30%", "10%", "40%", "0%"],
          y: ["0%", "20%", "40%", "10%", "0%"],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 2 — blue aurora */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "80vw",
          height: "80vw",
          background:
            "radial-gradient(circle, var(--brand-blue) 0%, transparent 55%)",
          filter: "blur(140px)",
          opacity: 0.09,
          right: "-20%",
          bottom: "-20%",
        }}
        animate={{
          x: ["0%", "-25%", "10%", "-30%", "0%"],
          y: ["0%", "-15%", "-30%", "-10%", "0%"],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 3 — subtle white shimmer for "shimmer" effect */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 50%)",
          filter: "blur(160px)",
          opacity: 0.03,
          left: "20%",
          top: "30%",
        }}
        animate={{
          x: ["0%", "20%", "-20%", "0%"],
          y: ["0%", "-20%", "20%", "0%"],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
