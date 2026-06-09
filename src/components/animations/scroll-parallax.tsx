"use client";

import * as React from "react";
import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";

type Props = {
  children: React.ReactNode;
  /** parallax distance in % — positive moves DOWN as scroll, negative moves UP */
  offset?: number;
  className?: string;
  style?: MotionStyle;
};

/**
 * Wrap content to give it scroll-driven Y parallax.
 * As the element travels through the viewport, it moves up/down at a different rate.
 */
export function ScrollParallax({
  children,
  offset = -20,
  className,
  style,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-offset}%`, `${offset}%`]);

  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Scale wrapper — content scales up slightly as it enters the viewport.
 */
export function ScrollScale({
  children,
  from = 0.92,
  to = 1.05,
  className,
}: {
  children: React.ReactNode;
  from?: number;
  to?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [from, to, from]);

  return (
    <motion.div ref={ref} style={{ scale }} className={className}>
      {children}
    </motion.div>
  );
}
