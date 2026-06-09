"use client";

import { motion } from "framer-motion";
import { useAnimationProfile } from "@/lib/hooks/use-animation-profile";
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
  const profile = useAnimationProfile();
  const reveal = profile === "full";
  return (
    <motion.div
      initial={reveal ? { opacity: 0, y: 12 } : false}
      whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
      viewport={reveal ? { once: true, margin: "200px 0px" } : undefined}
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
