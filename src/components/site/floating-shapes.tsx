"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * Ambient floating shapes — decorative SVG elements that gently drift,
 * adding life to empty areas without competing with content.
 */
export function FloatingShapes() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Top-right floating dot */}
      <motion.div
        className="absolute right-[8%] top-[15%] h-2 w-2 rounded-full bg-brand-orange/40"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mid-left orbit */}
      <motion.div
        className="absolute left-[5%] top-[35%] h-3 w-3 rounded-full bg-brand-blue/40"
        animate={{
          y: [0, 30, 0],
          x: [0, -15, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* Bottom-right glow */}
      <motion.div
        className="absolute right-[12%] top-[60%] h-4 w-4 rounded-full bg-brand-orange/30 blur-sm"
        animate={{
          y: [0, -25, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Center-left rotating ring */}
      <motion.div
        className="absolute left-[18%] top-[55%] h-8 w-8 rounded-full border border-brand-blue/30"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Bottom-left pulse */}
      <motion.div
        className="absolute left-[8%] bottom-[20%] h-2 w-2 rounded-full bg-foreground/30"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
