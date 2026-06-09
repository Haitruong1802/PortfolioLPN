"use client";

import * as React from "react";

/**
 * Three animation profiles selected automatically from the user agent's
 * capabilities and accessibility preferences.
 *
 *   full     - desktop/strong laptop, no reduced-motion preference
 *              -> all cinematic effects, blur layers, parallax, particles
 *   balanced - mid-tier laptop, mobile with decent specs, or touch device
 *              -> fewer particles, lighter blur, throttled pointer effects,
 *                 marquees paused off-screen
 *   lite     - prefers-reduced-motion, very low cores/RAM, save-data,
 *              slow-2g network, OR runtime FPS sample below threshold
 *              -> opacity+transform-only reveals, no infinite anims,
 *                 no particles, no parallax, no preloader
 *
 * Defaults to "full" during SSR + first client paint (so server-rendered
 * HTML matches), then snaps to the detected value once useEffect runs.
 *
 * Do NOT make this a context provider - it returns a stable string for the
 * lifetime of the page so callers can use it like a constant.
 */
export type AnimationProfile = "full" | "balanced" | "lite";

type NavigatorWithExtras = Navigator & {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
};

function detectProfile(): AnimationProfile {
  if (typeof window === "undefined") return "full";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return "lite";

  const nav = navigator as NavigatorWithExtras;

  // Network and save-data are strong "user wants less" signals.
  if (nav.connection?.saveData) return "lite";
  if (
    nav.connection?.effectiveType === "2g" ||
    nav.connection?.effectiveType === "slow-2g"
  ) {
    return "lite";
  }

  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;

  // Very weak hardware -> lite
  if (cores <= 2 || memory <= 2) return "lite";

  // "full" is reserved for unambiguously strong desktops: >= 12 logical
  // cores AND >= 16 GB RAM, mouse pointer, large viewport. The earlier
  // bar of 8 / 8 was matching i7-7th gen office desktops because Intel
  // hyperthreaded i7s report 8 logical cores even with a relatively
  // weak Intel HD 630 GPU - and the sticky scroll studio + per-frame
  // spring updates were enough to lock those machines up.
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallViewport = window.matchMedia("(max-width: 1024px)").matches;
  if (cores < 12 || memory < 16 || coarsePointer || smallViewport) {
    return "balanced";
  }

  return "full";
}

export function useAnimationProfile(): AnimationProfile {
  // SSR-safe: server + first paint = "full" so hydration matches.
  // Skipping animations server-side and then enabling them on a strong
  // client would also cause a visual jump.
  const [profile, setProfile] = React.useState<AnimationProfile>("full");

  React.useEffect(() => {
    // SSR-safe hydration of browser-only signals (matchMedia, navigator,
    // connection.saveData). React's "no setState in effect" rule does not
    // fit this case - the value can only be computed in the browser and
    // must update once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(detectProfile());
  }, []);

  return profile;
}

/** Convenience: true when profile === "lite". */
export function useIsLite(): boolean {
  return useAnimationProfile() === "lite";
}

/** Convenience: true when profile !== "full" (balanced or lite). */
export function useIsReduced(): boolean {
  const p = useAnimationProfile();
  return p !== "full";
}
