"use client";

import * as React from "react";

/**
 * Returns true while the tab is visible to the user, false when it's
 * hidden (background tab, screen locked, minimised). Use this to pause
 * expensive infinite animations and rAF loops when the user can't see them.
 *
 *   const visible = usePageVisibility();
 *   useEffect(() => {
 *     if (!visible) return;
 *     // ... start animation
 *     return () => {
 *       // ... stop animation
 *     };
 *   }, [visible]);
 */
export function usePageVisibility(): boolean {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}
