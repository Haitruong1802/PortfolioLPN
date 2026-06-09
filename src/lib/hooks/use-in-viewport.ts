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
  const [inView, setInView] = React.useState(false);

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
