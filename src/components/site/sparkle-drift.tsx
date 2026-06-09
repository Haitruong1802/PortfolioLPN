"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * Persistent sparkle drift — 18 ✦ stars continuously rise from bottom of
 * viewport to top, with subtle horizontal sway. Like fireflies / floating ash.
 *
 * Each sparkle has its own deterministic position/timing so the layout is
 * SSR-stable. Mix of cam + xanh accent colors.
 */
export function SparkleDrift() {
  const sparkles = React.useMemo(
    () =>
      // 12 sparkles instead of 18 — less visual noise, cleaner
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        // Deterministic spread across viewport width
        left: ((i * 11.3) % 100 + (i % 3) * 7) % 100,
        // Stagger the rise so they're not all at the same height
        delay: (i * 1.1) % 12,
        duration: 16 + ((i * 0.9) % 8),
        sizeRem: 0.7 + (i % 4) * 0.2,
        accent: i % 2 === 0 ? "orange" : "blue",
        // Slight horizontal sway range
        sway: 15 + ((i * 7) % 25),
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden"
    >
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="absolute select-none"
          style={{
            left: `${s.left}%`,
            fontSize: `${s.sizeRem}rem`,
            color:
              s.accent === "orange"
                ? "var(--brand-orange)"
                : "var(--brand-blue)",
            textShadow: "0 0 8px currentColor",
            bottom: "-3rem",
          }}
          animate={{
            y: ["0vh", "-110vh"],
            x: [0, s.sway, -s.sway * 0.6, s.sway * 0.4, 0],
            opacity: [0, 0.7, 0.7, 0.7, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
            // sub-tween for opacity/x so they stay independent of y linear
            opacity: {
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              times: [0, 0.08, 0.5, 0.92, 1],
              ease: "easeInOut",
            },
            x: {
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              times: [0, 0.25, 0.5, 0.75, 1],
              ease: "easeInOut",
            },
          }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}
