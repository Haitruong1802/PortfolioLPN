"use client";

import * as React from "react";

/**
 * Returns a function that, no matter how often it's called, only runs once
 * per animation frame with the most recent arguments. Use for mousemove
 * and similar high-frequency events that update DOM/CSS - bare event
 * handlers can fire ~120 times per second and cause layout thrashing.
 *
 *   const onMove = useRafThrottle((e: MouseEvent) => {
 *     element.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
 *   });
 *   window.addEventListener("mousemove", onMove);
 *
 * Cancels any pending frame on unmount.
 */
export function useRafThrottle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
): (...args: TArgs) => void {
  const fnRef = React.useRef(fn);
  // Sync latest callback into the ref after render. React's strict "no
  // ref writes during render" rule mandates this layout-effect pattern -
  // a direct assignment in the function body would invalidate the
  // throttle when React's compiler memoises the parent.
  React.useLayoutEffect(() => {
    fnRef.current = fn;
  });

  const rafIdRef = React.useRef<number | null>(null);
  const pendingArgsRef = React.useRef<TArgs | null>(null);

  React.useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return React.useCallback((...args: TArgs) => {
    pendingArgsRef.current = args;
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const next = pendingArgsRef.current;
      pendingArgsRef.current = null;
      if (next) fnRef.current(...next);
    });
  }, []);
}
