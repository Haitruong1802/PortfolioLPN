"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
  /** Override glitch trigger — default is hover. */
  trigger?: "hover" | "always";
};

/**
 * Glitch text effect — RGB-split layers shift slightly on hover or always.
 * 2 stacked offset copies in cyan + magenta blend modes create the classic glitch look.
 */
export function GlitchText({ children, className, trigger = "hover" }: Props) {
  const [active, setActive] = React.useState(trigger === "always");

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => trigger === "hover" && setActive(true)}
      onMouseLeave={() => trigger === "hover" && setActive(false)}
      data-text={children}
    >
      <span className="relative">{children}</span>

      {/* Orange glitch layer */}
      <motion.span
        aria-hidden
        animate={
          active
            ? {
                x: [-2, 2, -1, 1.5, -1.5, 2, -2, 0],
                y: [1, -1, 1, -0.5, 0.5, -1, 0, 0],
              }
            : { x: 0, y: 0 }
        }
        transition={
          active
            ? { duration: 0.45, repeat: Infinity, ease: "linear" }
            : { duration: 0.2 }
        }
        style={{
          color: "var(--brand-orange)",
          mixBlendMode: "screen",
          opacity: active ? 0.85 : 0,
        }}
        className="pointer-events-none absolute left-0 top-0 select-none"
      >
        {children}
      </motion.span>

      {/* Blue glitch layer */}
      <motion.span
        aria-hidden
        animate={
          active
            ? {
                x: [2, -2, 1, -1.5, 1.5, -2, 2, 0],
                y: [-1, 1, -1, 0.5, -0.5, 1, 0, 0],
              }
            : { x: 0, y: 0 }
        }
        transition={
          active
            ? { duration: 0.5, repeat: Infinity, ease: "linear" }
            : { duration: 0.2 }
        }
        style={{
          color: "var(--brand-blue)",
          mixBlendMode: "screen",
          opacity: active ? 0.85 : 0,
        }}
        className="pointer-events-none absolute left-0 top-0 select-none"
      >
        {children}
      </motion.span>
    </span>
  );
}
