"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/provider";

/**
 * Animated availability pill — rotating gradient border + pulsing dot.
 * "Animated gradient border" via conic-gradient mask + spin animation.
 */
export function AvailablePill() {
  const { locale } = useLocale();
  const text =
    locale === "vi"
      ? "Đang tìm vị trí Account Intern"
      : "Looking for Account Intern role";

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.05 }}
      className="relative inline-flex"
    >
      {/* Rotating gradient border */}
      <div
        aria-hidden
        className="absolute -inset-[1.5px] rounded-full opacity-90"
        style={{
          background:
            "conic-gradient(from 0deg, #ff7a1a 0deg, transparent 70deg, transparent 290deg, #2f7dff 360deg)",
          animation: "pill-spin 4s linear infinite",
        }}
      />

      <div className="relative inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-brand-orange backdrop-blur">
        <span className="relative grid place-items-center">
          <span className="absolute h-2 w-2 animate-ping rounded-full bg-brand-orange opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-brand-orange" />
        </span>
        {text}
      </div>

      <style jsx>{`
        @keyframes pill-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pill-spin"] {
            animation: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
