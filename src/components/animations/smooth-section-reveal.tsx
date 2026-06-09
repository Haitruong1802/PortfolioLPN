"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useAnimationProfile } from "@/lib/hooks/use-animation-profile";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Min scale at the edges (1 = no shrink). Default 0.96. */
  scaleEdge?: number;
  /** Opacity at the edges (1 = no fade). Default 0.7. */
  opacityEdge?: number;
  /** Y offset when section starts entering / when leaving (px). Default 40. */
  yEdge?: number;
};

/**
 * Scroll-driven section transition — Apple/Stripe/Linear pattern.
 *
 *  As the section scrolls into view: gracefully grows + fades in.
 *  When centered: full size, full opacity (the "active" state).
 *  As the section scrolls past: gracefully shrinks + fades out.
 *
 * All values are spring-damped → buttery smooth, never abrupt.
 * Respects prefers-reduced-motion: animations decay to identity.
 *
 * Use as a wrapper around any major page section:
 *
 *   <SmoothSectionReveal>
 *     <About />
 *   </SmoothSectionReveal>
 */
export function SmoothSectionReveal({
  children,
  className,
  scaleEdge = 0.96,
  opacityEdge = 0.7,
  yEdge = 40,
}: Props) {
  const profile = useAnimationProfile();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll position (0 = section bottom touches viewport top, 1 = top touches bottom)
  // 0    → just entered viewport (from below)
  // 0.25 → fully in view from below
  // 0.75 → about to start leaving viewport (going up)
  // 1    → fully gone (above viewport)
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [opacityEdge, 1, 1, opacityEdge],
  );
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [scaleEdge, 1, 1, scaleEdge],
  );
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [yEdge, 0, 0, -yEdge * 0.6],
  );

  // Spring-damped — eliminates any jitter, gives "luxury weight" feel
  const opacity = useSpring(rawOpacity, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const scale = useSpring(rawScale, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const y = useSpring(rawY, {
    stiffness: 80,
    damping: 25,
    mass: 0.5,
  });

  // balanced + lite skip the scroll-driven opacity/scale/y transforms.
  // Otherwise the section starts dim (opacityEdge ~0.7) when below the
  // viewport and brightens as the user scrolls in - on mobile that read
  // as 'section is black for a beat then finally appears' because the
  // dim state was visible during the scroll-in.
  if (profile !== "full") {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
