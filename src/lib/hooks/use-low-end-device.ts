"use client";

import { useAnimationProfile } from "./use-animation-profile";

/**
 * Backwards-compatible boolean view of the animation profile system.
 * Returns true when the page should run the "lite" cinema-free path.
 *
 * New code should call useAnimationProfile() directly and branch on
 * "full" / "balanced" / "lite" instead of a single boolean - some
 * decorative effects can still run in balanced mode.
 */
export function useLowEndDevice(): boolean {
  return useAnimationProfile() === "lite";
}
