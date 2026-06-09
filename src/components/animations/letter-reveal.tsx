"use client";

import * as React from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  /** dim opacity for "not yet revealed" chars. */
  dim?: number;
};

/**
 * Letter-by-letter scroll reveal — each character lights up
 * based on its position relative to the scroll progress.
 * Inspired by GSAP ScrollTrigger split-text.
 */
export function LetterReveal({ text, className, dim = 0.15 }: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });

  // Split into WORDS, each word wrapped inline-block whitespace-nowrap
  // so line breaks happen ONLY at spaces — never mid-word.
  const words = React.useMemo(() => {
    const parts = text.split(" ");
    let idx = 0;
    return parts.map((word) => {
      const startIdx = idx;
      idx += word.length;
      return { word, startIdx };
    });
  }, [text]);

  const total = React.useMemo(
    () => text.replace(/ /g, "").length,
    [text],
  );

  return (
    <span ref={ref} className={cn("inline", className)}>
      {words.map(({ word, startIdx }, wi) => (
        <React.Fragment key={`${word}-${wi}`}>
          {wi > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char, ci) => {
              const idx = startIdx + ci;
              return (
                <Letter
                  key={`${char}-${idx}`}
                  progress={scrollYProgress}
                  range={[idx / total, (idx + 1) / total]}
                  char={char}
                  dim={dim}
                />
              );
            })}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
}

function Letter({
  progress,
  range,
  char,
  dim,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  char: string;
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  const y = useTransform(progress, range, ["0.15em", "0em"]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {char === " " ? " " : char}
    </motion.span>
  );
}
