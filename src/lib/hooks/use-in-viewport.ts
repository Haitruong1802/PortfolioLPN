"use client";

import * as React from "react";

type Options = {
  /** rootMargin passed to IntersectionObserver. */
  rootMargin?: string;
  /** threshold passed to IntersectionObserver. */
  threshold?: number | number[];
  /** Stop observing after first intersection (default false). */
  once?: boolean;
};

/**
 * Returns true while the element is in (or near) the viewport.
 *
 * Pair with infinite/expensive animations so they pause once their
 * section scrolls past:
 *
 *   const ref = useRef<HTMLDivElement>(null);
 *   const inView = useInViewport(ref, { rootMargin: "200px" });
 *   const transition = { duration: 4, repeat: inView ? Infinity : 0 };
 */
export function useInViewport<T extends Element>(
  ref: React.RefObject<T | null>,
  opts: Options = {},
): boolean {
  const { rootMargin = "0px", threshold = 0, once = false } = opts;
  // Default to true (in-view) so consumers that gate an animation on this
  // flag start playing immediately. The previous default of false meant
  // every off-screen optimisation gate was treated as "off-screen" until
  // the first IntersectionObserver callback arrived - which on weak
  // machines can be 100-500ms after mount, long enough that the user sees
  // the marquees just sitting there. The observer still flips this to
  // false the moment the element actually leaves the viewport.
  const [inView, setInView] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold, once]);

  return inView;
}
