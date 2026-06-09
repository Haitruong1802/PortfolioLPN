"use client";

import * as React from "react";
import { motion } from "framer-motion";

const PRELOADER_KEY = "portfolio-preloader-seen";
const PRELOADER_DURATION = 3200; // ms, matches preloader

/**
 * Page entrance wrapper — runs AFTER preloader exits.
 *
 * Plain opacity fade only (no blur, no scale). An earlier version animated
 * `filter: blur()` which:
 *   - froze the marquee + typing text for ~1s on mobile (GPU composite cost)
 *   - left the whole page stuck behind the initial blur layer when the
 *     responsive branch picked the wrong path on certain tablets
 * Keeping this dead simple — opacity 0 → 1 with no transforms — avoids both.
 */
export function PageEntrance({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Restore native scroll behavior + force top
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      /* ignore */
    }
    // Snap to top before any animation starts (prevents jump on entrance)
    window.scrollTo(0, 0);

    const wasSeen = sessionStorage.getItem(PRELOADER_KEY) === "1";
    if (wasSeen) {
      // Already seen preloader → fast entrance
      setReady(true);
      return;
    }
    // First visit: wait for preloader to finish, then animate
    const timer = setTimeout(() => {
      // Lock scroll position before entrance animation
      window.scrollTo(0, 0);
      setReady(true);
    }, PRELOADER_DURATION - 200);
    return () => clearTimeout(timer);
  }, []);

  // Also: when "ready" goes true, make sure we are at the top
  React.useEffect(() => {
    if (ready && typeof window !== "undefined") {
      // Sub-frame nudge to guarantee position after layout settles
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  }, [ready]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
