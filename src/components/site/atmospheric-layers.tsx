"use client";

import * as React from "react";
import { AuroraFlow } from "./aurora-flow";
import { FloatingShapes } from "./floating-shapes";
import { SparkleDrift } from "./sparkle-drift";
import { CursorSpotlight } from "./cursor-spotlight";
import { useLowEndDevice } from "@/lib/hooks/use-low-end-device";

/**
 * Bundles the GPU-heavy ambient layers behind a single low-end + viewport
 * gate so the layout stays a server component. Low-end devices and
 * sub-md viewports get none of these.
 */
export function AtmosphericLayers() {
  const lite = useLowEndDevice();
  if (lite) return null;
  return (
    <div className="hidden md:contents">
      <AuroraFlow />
      <FloatingShapes />
      <SparkleDrift />
      <CursorSpotlight />
    </div>
  );
}
