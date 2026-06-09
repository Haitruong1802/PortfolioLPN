"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Props = {
  children: string;
  className?: string;
  /** Color of "future" text (still to be revealed). */
  dimColor?: string;
};

/**
 * Scroll-driven text reveal: as the user scrolls past the element,
 * each WORD lights up from dim (opacity 0.2) to full opacity, one after another.
 * Inspired by GSAP ScrollTrigger split-text but pure framer-motion.
 */
export function ScrollTextReveal({
  children,
  className,
  dimColor = "var(--color-muted-foreground)",
}: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.2"],
  });

  const words = React.useMemo(() => children.split(" "), [children]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            word={word}
            isLast={i === words.length - 1}
            dimColor={dimColor}
          />
        );
      })}
    </span>
  );
}

function Word({
  progress,
  range,
  word,
  isLast,
  dimColor,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  word: string;
  isLast: boolean;
  dimColor: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity, color: dimColor }} className="inline-block">
      <motion.span
        style={{ opacity, color: "var(--color-foreground)" }}
        className="inline-block"
      >
        {word}
      </motion.span>
      {!isLast && " "}
    </motion.span>
  );
}
