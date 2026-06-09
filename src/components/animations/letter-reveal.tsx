"use client";

import * as React from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLowEndDevice } from "@/lib/hooks/use-low-end-device";

type Props = {
  text: string;
  className?: string;
  /** dim opacity for "not yet revealed" chars. */
  dim?: number;
};

/**
 * Letter-by-letter scroll reveal — each character lights up
 * based on its position relative to the scroll progress.
 *
 * Mobile + low-end fast path: a 20-char headline becomes 20 separate
 * motion.span + useTransform subscriptions all subscribed to the same
 * scrollYProgress. That was the single biggest cause of the "freeze
 * then snap into view" hitch on phones (yes, even on iPhone 14 Pro Max).
 * Mobile/low-end now renders the same text as a plain <span> with a
 * single fade-in.
 */
export function LetterReveal({ text, className, dim = 0.15 }: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const lite = useLowEndDevice();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  const simplify = lite || isMobile;

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

  if (simplify) {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("inline-block", className)}
      >
        {text}
      </motion.span>
    );
  }

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
