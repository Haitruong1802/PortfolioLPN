"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Border thickness in pixels (default 2) */
  thickness?: number;
  /** Border radius — keep matching the inner element */
  radius?: string;
  /** Spinning border or static gradient */
  spin?: boolean;
  /** Spin duration in seconds (default 6) */
  duration?: number;
  /** Show corner accent dots */
  corners?: boolean;
  /** Accent color for corners */
  cornerAccent?: "orange" | "blue" | "both";
};

/**
 * ImageFrame — wraps any image/card with:
 *  1. Animated conic-gradient border ring
 *  2. Optional 4 corner accent dots
 *  3. Soft outer glow that pulses on hover
 *
 * Pure CSS animations — bulletproof, GPU-accelerated.
 */
export function ImageFrame({
  children,
  className,
  thickness = 2,
  radius = "1.25rem",
  spin = true,
  duration = 6,
  corners = false,
  cornerAccent = "both",
}: Props) {
  const orangeCorner = (
    <span
      aria-hidden
      className="absolute h-2 w-2 rounded-full bg-brand-orange"
      style={{ boxShadow: "0 0 8px var(--brand-orange)" }}
    />
  );
  const blueCorner = (
    <span
      aria-hidden
      className="absolute h-2 w-2 rounded-full bg-brand-blue"
      style={{ boxShadow: "0 0 8px var(--brand-blue)" }}
    />
  );

  const cornerTL = cornerAccent === "blue" ? blueCorner : orangeCorner;
  const cornerTR = cornerAccent === "orange" ? orangeCorner : blueCorner;
  const cornerBL = cornerAccent === "orange" ? orangeCorner : blueCorner;
  const cornerBR = cornerAccent === "blue" ? blueCorner : orangeCorner;

  return (
    <div className={cn("group relative", className)}>
      {/* Animated gradient border ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute opacity-90 transition-opacity group-hover:opacity-100"
        style={{
          inset: `-${thickness}px`,
          borderRadius: radius,
          background:
            "conic-gradient(from 0deg, var(--brand-orange) 0deg, transparent 90deg, transparent 270deg, var(--brand-blue) 360deg)",
          animation: spin ? `image-frame-spin ${duration}s linear infinite` : "none",
        }}
      />

      {/* Inner content with bg to mask the border center */}
      <div
        className="relative h-full w-full overflow-hidden bg-card"
        style={{ borderRadius: radius }}
      >
        {children}
      </div>

      {/* Corner accent dots */}
      {corners && (
        <>
          {React.cloneElement(cornerTL, { style: { ...cornerTL.props.style, top: "-4px", left: "-4px" } })}
          {React.cloneElement(cornerTR, { style: { ...cornerTR.props.style, top: "-4px", right: "-4px" } })}
          {React.cloneElement(cornerBL, { style: { ...cornerBL.props.style, bottom: "-4px", left: "-4px" } })}
          {React.cloneElement(cornerBR, { style: { ...cornerBR.props.style, bottom: "-4px", right: "-4px" } })}
        </>
      )}

      {/* Soft outer glow — pulses on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-0 blur-2xl group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,122,26,0.25), rgba(47,125,255,0.25))",
          transition: "opacity 0.5s ease",
        }}
      />

      <style jsx>{`
        @keyframes image-frame-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="image-frame-spin"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
