"use client";

import * as React from "react";
import { motion } from "framer-motion";

const PRELOADER_KEY = "portfolio-preloader-seen";
const PRELOADER_DURATION = 3200; // ms, matches preloader

/**
 * Page entrance wrapper — runs AFTER preloader exits.
 * Forces scroll to top before animating to prevent unwanted jumps.
 * Uses transform-origin: top center so scaling doesn't cause visual drift.
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
      initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
      animate={
        ready
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.97, filter: "blur(10px)" }
      }
      transition={{
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformOrigin: "center top" }}
    >
      {children}
    </motion.div>
  );
}
