"use client";

import * as React from "react";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { useInViewport } from "@/lib/hooks/use-in-viewport";
import { usePageVisibility } from "@/lib/hooks/use-page-visibility";
import styles from "./image-marquee.module.css";

// 4 cuộc thi đạt giải — chỉ text, không ảnh.
const TILES = [
  {
    label: { vi: "Top 5 Startup Zone 2025", en: "Top 5 Startup Zone 2025" },
    accent: "orange" as const,
  },
  {
    label: { vi: "Top 20 Techseed 2025", en: "Top 20 Techseed 2025" },
    accent: "blue" as const,
  },
  {
    label: { vi: "Top 12 HR Matrix", en: "Top 12 HR Matrix" },
    accent: "orange" as const,
  },
  {
    label: { vi: "Top 12 Talent A-G", en: "Top 12 Talent A-G" },
    accent: "blue" as const,
  },
];

// Identity tags (hàng dưới, mono, mảnh) — chạy ngược chiều
const TAGS_BOTTOM = [
  "ACCOUNT INTERN",
  "EVENT AGENCY",
  "UEH",
  "GO BIG OR GO HOME",
  "PITCHING",
  "BIG IDEA",
  "TIMELINE",
  "KEY VISUAL",
  "TRAVELGROUP",
  "MARGROUP",
  "SINTECH",
];

/**
 * Award marquee — 1 hàng text-only infinite scroll.
 * Chỉ hiện 4 cuộc thi đạt giải (text + ✦ phân cách).
 */
export function ImageMarquee() {
  const { locale } = useLocale();
  const ref = React.useRef<HTMLElement>(null);
  // Pause when scrolled fully off-screen (saves CPU/GPU paint cost) or
  // when the tab is hidden (background tab on slow machines was a notable
  // battery drain).
  const inView = useInViewport(ref, { rootMargin: "200px" });
  const pageVisible = usePageVisibility();
  const [hoverPaused, setHoverPaused] = React.useState(false);
  const paused = hoverPaused || !inView || !pageVisible;

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative overflow-hidden border-y border-border bg-card py-8 md:py-10"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      {/* Edge gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-card to-transparent md:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-card to-transparent md:w-48" />

      {/* 1 hàng — 4 cuộc thi đạt giải (text only) */}
      <div className={cn(styles.track, paused && styles.paused)}>
        {[...TILES, ...TILES, ...TILES].map((t, i) => (
          <React.Fragment key={`tile-${i}`}>
            <span
              className={cn(
                "whitespace-nowrap font-display font-bold uppercase tracking-tight",
                "text-xl md:text-3xl",
                t.accent === "orange"
                  ? "text-brand-orange"
                  : "text-brand-blue",
              )}
            >
              {t.label[locale]}
            </span>

            {/* Sparkle separator giữa các cuộc thi */}
            <span
              aria-hidden
              className={cn(
                "shrink-0 text-2xl md:text-3xl",
                t.accent === "orange"
                  ? "text-brand-orange/50"
                  : "text-brand-blue/50",
              )}
            >
              ✦
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* HÀNG DƯỚI — identity tags chạy ngược chiều, mono mảnh */}
      <div
        className={cn(
          styles.trackReverse,
          paused && styles.paused,
          "mt-5 md:mt-7",
        )}
      >
        {[...TAGS_BOTTOM, ...TAGS_BOTTOM, ...TAGS_BOTTOM].map((tag, i) => (
          <span
            key={`tag-${tag}-${i}`}
            className="flex shrink-0 items-center gap-6 whitespace-nowrap font-mono text-xs uppercase leading-relaxed tracking-[0.3em] text-foreground/35 md:gap-8 md:text-sm"
          >
            {tag}
            <span className="text-brand-orange/40">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
