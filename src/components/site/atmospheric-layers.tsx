"use client";

import * as React from "react";
import { AuroraFlow } from "./aurora-flow";
import { FloatingShapes } from "./floating-shapes";
import { SparkleDrift } from "./sparkle-drift";
import { CursorSpotlight } from "./cursor-spotlight";
import { useAnimationProfile } from "@/lib/hooks/use-animation-profile";

/**
 * Profile-aware ambient layer stack.
 *
 *   full     - all 4 layers (AuroraFlow + FloatingShapes + SparkleDrift +
 *              CursorSpotlight)
 *   balanced - skip AuroraFlow + CursorSpotlight (the two heaviest -
 *              two 85vw blurred circles and a 700px radial-gradient
 *              follower respectively); keep the lighter shapes + sparkle
 *   lite     - none
 *
 * Wrapping the layers in a single client component keeps the root layout
 * a Server Component.
 */
export function AtmosphericLayers() {
  const profile = useAnimationProfile();

  if (profile === "lite") return null;

  if (profile === "balanced") {
    return (
      <>
        <FloatingShapes />
        <SparkleDrift />
      </>
    );
  }

  return (
    <>
      <AuroraFlow />
      <FloatingShapes />
      <SparkleDrift />
      <CursorSpotlight />
    </>
  );
}
