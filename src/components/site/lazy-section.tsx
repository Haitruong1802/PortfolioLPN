"use client";

import * as React from "react";

type Props = {
  children: React.ReactNode;
  /**
   * Placeholder height while the section hasn't mounted yet. Try to match
   * the rendered section's height so the scrollbar doesn't jump when the
   * real content swaps in. CSS units accepted ("80vh", "1200px", etc.).
   */
  minHeight: string;
  /**
   * How far outside the viewport to start mounting. Default "800px" -
   * fires ~one viewport ahead of the user, so they reach the section
   * with the content already animated in and never see a placeholder.
   */
  rootMargin?: string;
};

/**
 * IntersectionObserver-gated mount. The placeholder div reserves space
 * so the page scroll height is accurate from first paint; the real section
 * subtree only mounts once the user has scrolled close to it. Once mounted
 * the component stays in the tree forever - no re-mounts when scrolling
 * back up, no animation re-play.
 *
 * Why: the initial page render had ~200 motion components live at once.
 * Even with MotionConfig reducedMotion='always' that still costs reconciler
 * work for every subtree on every state change, and it pinned weak office
 * machines at ~100% CPU until the page settled. Mounting sections lazily
 * keeps the active React tree small - the rest of the page is just empty
 * spacer divs until the user scrolls toward them.
 *
 * SSR-safe: defaults to NOT mounted so the server-rendered HTML is just
 * the placeholders. On the client the observer fires immediately for any
 * section that's already in (or within rootMargin of) the viewport.
 */
export function LazySection({
  children,
  minHeight,
  rootMargin = "800px",
}: Props) {
  const [shouldMount, setShouldMount] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // No observer support (very old browser) - mount immediately.
      setShouldMount(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setShouldMount(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      // Only reserve space before mount. After mount, let the real content
      // dictate its own height so the section can use its own intrinsic
      // padding/min-h without us forcing a min.
      style={shouldMount ? undefined : { minHeight }}
    >
      {shouldMount ? children : null}
    </div>
  );
}
