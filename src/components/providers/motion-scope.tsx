"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { useAnimationProfile } from "@/lib/hooks/use-animation-profile";

/**
 * Global Framer Motion config.
 *
 * - profile "full": respect user's OS reduced-motion preference, otherwise
 *   run the full cinematic.
 * - profile "balanced" / "lite": force reducedMotion = "always". This tells
 *   every motion component to skip the animation and jump to its final
 *   state instantly. Components stay visible, content stays in place, but
 *   no per-frame animation cost.
 *
 * Without this, every section's 10-30 motion components fire whileInView
 * simultaneously when crossed during a fast scroll - even on iPhone 14
 * Pro Max that produced 4-5 hitches in a row on the way down the page.
 * Globally telling Framer Motion to skip animations eliminates that
 * entirely on phones / tablets / low-end laptops while keeping the
 * cinematic on a strong desktop with a mouse.
 */
export function MotionScope({ children }: { children: React.ReactNode }) {
  const profile = useAnimationProfile();
  const reducedMotion = profile === "full" ? "user" : "always";

  return <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>;
}
