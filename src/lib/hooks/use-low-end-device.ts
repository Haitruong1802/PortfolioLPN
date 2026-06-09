"use client";

import * as React from "react";

/**
 * Detects weak machines and "i want fewer animations" preferences.
 *
 * A device is treated as low-end when ANY of these is true:
 *   - prefers-reduced-motion: reduce (user setting / accessibility)
 *   - hardwareConcurrency <= 4 (≤4 CPU cores)
 *   - deviceMemory <= 4 (≤4 GB RAM, where the API exists)
 *   - effectiveType is '2g' / 'slow-2g' (very slow network proxies weak hw)
 *
 * Components read this flag to short-circuit cinematic effects:
 *   const lite = useLowEndDevice();
 *   if (lite) return <StaticVersion />;
 *
 * Returns false during SSR + first client paint so hydration matches; then
 * snaps to the detected value via useEffect.
 */
export function useLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cores =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 8;

    const memory =
      typeof navigator !== "undefined" &&
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
        : 8;

    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType?: string; saveData?: boolean };
      }
    ).connection;

    const slowNetwork =
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g" ||
      connection?.saveData === true;

    setIsLowEnd(reducedMotion || cores <= 4 || memory <= 4 || slowNetwork);
  }, []);

  return isLowEnd;
}
