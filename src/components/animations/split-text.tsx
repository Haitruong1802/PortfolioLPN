"use client";

import { motion, type Variants } from "framer-motion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
};

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const word: Variants = {
  hidden: { y: "110%" },
  visible: (custom: { delay: number; duration: number }) => ({
    y: "0%",
    transition: {
      duration: custom.duration,
      delay: custom.delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  duration = 0.7,
}: Props) {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={container}
      custom={stagger}
      className={className}
      style={{ display: "inline-block" }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
          }}
        >
          <motion.span
            variants={word}
            custom={{ delay: delay + i * 0.02, duration }}
            style={{ display: "inline-block" }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
