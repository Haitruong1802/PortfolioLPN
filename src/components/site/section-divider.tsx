"use client";

import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <div
      aria-hidden
      className="container-px mx-auto max-w-7xl"
    >
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-px origin-left bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </div>
  );
}
