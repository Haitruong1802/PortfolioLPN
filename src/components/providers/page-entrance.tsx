"use client";

import * as React from "react";
import { motion } from "framer-motion";

const PRELOADER_KEY = "portfolio-preloader-seen";
// Failsafe in case the preloader stalls or never marks itself done.
const MAX_WAIT_MS = 9000;

/**
 * Page entrance wrapper — fades the page in once the preloader signals it's
 * done (it writes "1" to sessionStorage[PRELOADER_KEY] on exit). We poll for
 * that flag every 100ms; cheap, robust, and handles the case where the
 * preloader times itself out on the load-gate or skips entirely.
 *
 * Plain opacity fade only — no blur, no scale. Earlier filter: blur() variants
 * cost the marquee + typing text a frame on mobile and could leave the whole
 * page stuck behind the initial layer on some Safari versions.
 */
export function PageEntrance({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      /* ignore */
    }
    window.scrollTo(0, 0);

    // Fast path: already seen this session (back/forward into the page).
    if (sessionStorage.getItem(PRELOADER_KEY) === "1") {
      setReady(true);
      return;
    }

    // Poll the storage flag until the preloader marks itself done.
    let timer: number | null = null;
    const tick = () => {
      if (sessionStorage.getItem(PRELOADER_KEY) === "1") {
        window.scrollTo(0, 0);
        setReady(true);
        timer = null;
        return;
      }
      timer = window.setTimeout(tick, 100);
    };
    tick();

    // Hard failsafe: if the preloader never signals done within
    // MAX_WAIT_MS, reveal the page anyway so the user is never stranded.
    const fallback = window.setTimeout(() => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
      setReady(true);
    }, MAX_WAIT_MS);

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      window.clearTimeout(fallback);
    };
  }, []);

  // When ready flips true, nudge scroll back to top after layout settles.
  React.useEffect(() => {
    if (ready && typeof window !== "undefined") {
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  }, [ready]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
