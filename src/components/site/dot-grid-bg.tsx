"use client";

/**
 * Subtle global dotted grid background — adds texture without competing with content.
 * Fades top + bottom so it doesn't interfere with section transitions.
 */
export function DotGridBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 opacity-[0.35]"
      style={{
        backgroundImage:
          "radial-gradient(circle, color-mix(in srgb, var(--color-foreground) 15%, transparent) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    />
  );
}
