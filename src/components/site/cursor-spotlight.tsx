"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRafThrottle } from "@/lib/hooks/use-raf-throttle";

/**
 * Cursor spotlight — a soft radial light follows the cursor across the whole
 * viewport. Uses mix-blend-mode: screen so it BRIGHTENS content underneath
 * rather than obscuring it.
 *
 * Touch devices: disabled (no cursor to follow).
 * Mousemove is rAF-throttled so we never write to motion values more than
 * once per frame even if the OS feeds us 240Hz of pointer events.
 *
 * Whether this component renders at all is decided one level up by
 * AtmosphericLayers based on the animation profile.
 */
export function CursorSpotlight() {
  const [enabled, setEnabled] = React.useState(false);
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  // Slow spring → "lazy" spotlight feel
  const x = useSpring(mx, { stiffness: 70, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 70, damping: 22, mass: 0.6 });

  const onMove = useRafThrottle((e: MouseEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[3]"
      style={{ x, y, mixBlendMode: "screen" }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: "700px",
          height: "700px",
          left: "-350px",
          top: "-350px",
          background:
            "radial-gradient(circle, rgba(255,170,80,0.08) 0%, rgba(80,150,255,0.05) 30%, transparent 60%)",
        }}
      />
    </motion.div>
  );
}
