"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAnimationProfile } from "@/lib/hooks/use-animation-profile";
import { useRafThrottle } from "@/lib/hooks/use-raf-throttle";

type CursorState = "default" | "hover" | "text";

/**
 * Custom cursor - desktop fine-pointer only, "full" profile only.
 *
 * Why "full" only:
 *  - The cursor depends on a mouse, so coarse pointers (touch) are out by
 *    definition.
 *  - On "balanced" (mid-tier laptops or small desktops) the per-pixel
 *    mousemove + spring + style update was the single biggest source of
 *    scroll jank because mousemove fires alongside scroll events.
 *
 * Mousemove is rAF-throttled so even rapid cursor movement only triggers
 * one DOM write per frame.
 */
export function Cursor() {
  const profile = useAnimationProfile();
  const [enabled, setEnabled] = React.useState(false);
  const [state, setState] = React.useState<CursorState>("default");
  const [label, setLabel] = React.useState<string | null>(null);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  // Higher stiffness + lower mass = tighter follow with no perceptible lag
  const x = useSpring(mx, { stiffness: 800, damping: 40, mass: 0.25 });
  const y = useSpring(my, { stiffness: 800, damping: 40, mass: 0.25 });

  const onMove = useRafThrottle((e: MouseEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  });

  React.useEffect(() => {
    if (profile !== "full") return;
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;
    setEnabled(true);

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        'a, button, [role="button"], [data-cursor="hover"]',
      );
      if (interactive) {
        const customLabel = interactive.getAttribute("data-cursor-label");
        setState("hover");
        setLabel(customLabel);
        return;
      }
      const text = t.closest("p, h1, h2, h3, h4, h5, h6, span, li");
      if (text) {
        setState("text");
        setLabel(null);
        return;
      }
      setState("default");
      setLabel(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [profile, onMove]);

  if (!enabled) return null;

  const ringSize = state === "hover" ? 56 : state === "text" ? 4 : 32;
  const dotOpacity = state === "text" ? 1 : state === "hover" ? 0 : 0.7;

  return (
    <>
      <style>{`html, body { cursor: none; } a, button, [role="button"] { cursor: none; }`}</style>

      {/* Ring — outer motion follows cursor, inner CSS-translate centers */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[210] mix-blend-difference"
        style={{ x, y }}
      >
        <div
          className="rounded-full border-2 border-white transition-[width,height,opacity] duration-300 ease-out"
          style={{
            width: `${ringSize}px`,
            height: `${ringSize}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* Dot — separate spring container, CSS-translate centers */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[210] mix-blend-difference"
        style={{ x, y, opacity: dotOpacity }}
      >
        <div
          className="rounded-full bg-white transition-opacity duration-200"
          style={{
            width: "6px",
            height: "6px",
            transform: "translate(-50%, -50%)",
          }}
        />
      </motion.div>

      {/* Optional label */}
      {label && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[210]"
          style={{ x, y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="whitespace-nowrap rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background"
            style={{ transform: "translate(24px, 24px)" }}
          >
            {label}
          </div>
        </motion.div>
      )}
    </>
  );
}
