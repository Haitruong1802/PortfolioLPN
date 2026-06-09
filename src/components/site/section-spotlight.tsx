"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  number: string;
  align?: "left" | "right";
  className?: string;
};

/**
 * Giant ghost number that sits behind a section as a visual anchor.
 * Parallax + slight rotate as the section scrolls past for kinetic feel.
 */
export function SectionSpotlight({
  number,
  align = "right",
  className,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 0.7, 0.7, 0],
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 -z-10 flex items-center",
        align === "right" ? "right-[-8%]" : "left-[-8%]",
        className,
      )}
    >
      <motion.span
        style={{ y, rotate, opacity }}
        className="font-display font-extrabold leading-none tracking-tighter text-foreground/[0.04] select-none whitespace-nowrap"
      >
        <span
          style={{ fontSize: "clamp(14rem, 32vw, 32rem)" }}
          className="block"
        >
          {number}
        </span>
      </motion.span>
    </div>
  );
}
