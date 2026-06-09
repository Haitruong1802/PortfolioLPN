"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  color?: string;
  className?: string;
};

export function AnimatedEyebrow({
  children,
  color = "text-brand-orange",
  className,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em]",
        color,
        className,
      )}
    >
      <span className="relative grid h-2 w-2 place-items-center">
        <motion.span
          className="absolute h-full w-full rounded-full bg-current"
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span>{children}</span>
    </motion.div>
  );
}
