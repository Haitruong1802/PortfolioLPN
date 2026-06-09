"use client";

import * as React from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll provider — silky scroll for the whole site.
 *
 *  - Long duration (1.8s) + custom easing = "luxury" cinema scroll feel
 *  - Anchor link interceptor: <a href="#about"> animates instead of jumping
 *  - Auto-respects `prefers-reduced-motion`
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip Lenis on small touch devices — silky scroll there fights with the
    // native momentum + costs ~4-6ms/frame of JS, which was the main cause
    // of "đơ" on real mobile. Native scroll is already smooth on mobile.
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const lenis = new Lenis({
      duration: 1.8, // longer = silkier (was 1.2)
      // Asymptotic ease — gentle, never abrupt
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Lerp lower = smoother chase to target each frame
      lerp: 0.07,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // ─── Anchor link interceptor ───
    // Native <a href="#section"> jumps instantly. We want lenis.scrollTo for
    // smooth animated navigation.
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      // Skip if user wants to open new tab
      if (e.ctrlKey || e.metaKey || e.shiftKey || link.target === "_blank") return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      lenis.scrollTo(el, {
        offset: -60, // leave room for fixed header
        duration: 1.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return <>{children}</>;
}
