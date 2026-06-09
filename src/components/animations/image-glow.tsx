"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  accent?: "orange" | "blue" | "both";
  className?: string;
  /** Glow intensity 0-1 (default 0.35) */
  intensity?: number;
};

const glowMap = {
  orange:
    "radial-gradient(circle, rgba(255,122,26,VAR), transparent 70%)",
  blue: "radial-gradient(circle, rgba(47,125,255,VAR), transparent 70%)",
  both: "linear-gradient(135deg, rgba(255,122,26,VAR), rgba(47,125,255,VAR))",
};

/**
 * ImageGlow — accent-color glow halo behind a card/image.
 * Fades in on hover. Uses bg-blur for soft, ambient effect.
 */
export function ImageGlow({
  children,
  accent = "both",
  className,
  intensity = 0.35,
}: Props) {
  const bg = glowMap[accent].replaceAll("VAR", String(intensity));

  return (
    <div className={cn("group relative", className)}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-0 blur-3xl group-hover:opacity-100"
        style={{
          background: bg,
          transition: "opacity 0.5s ease",
        }}
      />
      {children}
    </div>
  );
}
