"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "diagonal";

type Props = {
  children: React.ReactNode;
  direction?: Direction;
  className?: string;
  /** Border radius preserved via round() in clip-path. */
  rounded?: string;
};

/**
 * Scroll-driven mask reveal — wraps an image (or anything visual)
 * and uncovers it with a clip-path inset as the user scrolls into view.
 *
 * Pure CSS clip-path performance — no layout thrash.
 */
export function ImageReveal({
  children,
  direction = "up",
  className,
  rounded = "1rem",
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.45"],
  });

  // Build clip-path start state based on direction
  const startClip = (() => {
    switch (direction) {
      case "up":
        return `inset(100% 0 0 0 round ${rounded})`;
      case "down":
        return `inset(0 0 100% 0 round ${rounded})`;
      case "left":
        return `inset(0 100% 0 0 round ${rounded})`;
      case "right":
        return `inset(0 0 0 100% round ${rounded})`;
      case "diagonal":
        return `inset(50% 50% 0 0 round ${rounded})`;
      default:
        return `inset(100% 0 0 0 round ${rounded})`;
    }
  })();
  const endClip = `inset(0 0 0 0 round ${rounded})`;

  const clipPath = useTransform(scrollYProgress, [0, 1], [startClip, endClip]);

  return (
    <motion.div
      ref={ref}
      style={{ clipPath, WebkitClipPath: clipPath }}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}
