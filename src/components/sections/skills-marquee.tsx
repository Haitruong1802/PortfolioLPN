"use client";

import * as React from "react";
import { useLocale } from "@/lib/i18n/provider";
import { useInViewport } from "@/lib/hooks/use-in-viewport";
import { usePageVisibility } from "@/lib/hooks/use-page-visibility";
import { cn } from "@/lib/utils";

// Curated skill chips — kept short for marquee rhythm.
// Mixes Hard / Soft / Tools chips for visual variety.
const CHIPS: { label: { vi: string; en: string }; accent: "orange" | "blue" }[] = [
  { label: { vi: "Pitching", en: "Pitching" }, accent: "orange" },
  { label: { vi: "Big Idea", en: "Big Idea" }, accent: "blue" },
  { label: { vi: "Dự trù ngân sách", en: "Budgeting" }, accent: "orange" },
  { label: { vi: "Timeline", en: "Timeline" }, accent: "blue" },
  { label: { vi: "Key Visual", en: "Key Visual" }, accent: "orange" },
  { label: { vi: "Insight", en: "Insight" }, accent: "blue" },
  { label: { vi: "Quản trị rủi ro", en: "Risk Management" }, accent: "orange" },
  { label: { vi: "Booth concept", en: "Booth Concept" }, accent: "blue" },
  { label: { vi: "Biên bản họp", en: "Meeting Minutes" }, accent: "orange" },
  { label: { vi: "Teamwork", en: "Teamwork" }, accent: "blue" },
  { label: { vi: "AI Agents", en: "AI Agents" }, accent: "orange" },
  { label: { vi: "Canva Proposal", en: "Canva Proposal" }, accent: "blue" },
  { label: { vi: "Google Suite", en: "Google Suite" }, accent: "orange" },
  { label: { vi: "Microsoft Suite", en: "Microsoft Suite" }, accent: "blue" },
  { label: { vi: "Khảo sát địa điểm", en: "Location Scouting" }, accent: "orange" },
  { label: { vi: "Hoạt náo", en: "Crowd Hyping" }, accent: "blue" },
  { label: { vi: "Phỏng vấn CTV", en: "CTV Interviewing" }, accent: "orange" },
  { label: { vi: "Quản lý Fanpage", en: "Fanpage Management" }, accent: "blue" },
];

/**
 * Dual-row skills marquee — chips chạy 2 hướng ngược nhau, pause khi hover.
 * Đặt sau Services section.
 */
export function SkillsMarquee() {
  const { locale } = useLocale();
  const ref = React.useRef<HTMLElement>(null);
  // Pause when section is off-screen or tab hidden.
  const inView = useInViewport(ref, { rootMargin: "200px" });
  const pageVisible = usePageVisibility();
  const [hoverPaused, setHoverPaused] = React.useState(false);
  const paused = hoverPaused || !inView || !pageVisible;

  const top = CHIPS;
  const bottom = [...CHIPS].reverse();

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative my-12 overflow-hidden border-y border-border bg-card/40 py-8 md:my-16 md:py-10"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent md:w-40" />

      {/* Row 1 — chạy trái */}
      <div className={cn("marquee-track flex w-max gap-3 md:gap-4", paused && "paused")}>
        {[...top, ...top, ...top].map((chip, i) => (
          <Chip key={`r1-${i}`} chip={chip} locale={locale} />
        ))}
      </div>

      {/* Row 2 — chạy phải, chậm hơn, offset margin top */}
      <div
        className={cn(
          "marquee-track-reverse mt-3 flex w-max gap-3 md:mt-5 md:gap-4",
          paused && "paused",
        )}
      >
        {[...bottom, ...bottom, ...bottom].map((chip, i) => (
          <Chip key={`r2-${i}`} chip={chip} locale={locale} />
        ))}
      </div>

      <style jsx>{`
        :global(.marquee-track) {
          animation: marquee-left 45s linear infinite;
        }
        :global(.marquee-track-reverse) {
          animation: marquee-right 55s linear infinite;
        }
        :global(.paused) {
          animation-play-state: paused;
        }
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(-33.333%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.marquee-track),
          :global(.marquee-track-reverse) {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function Chip({
  chip,
  locale,
}: {
  chip: { label: { vi: string; en: string }; accent: "orange" | "blue" };
  locale: "vi" | "en";
}) {
  return (
    <span
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors md:text-sm",
        chip.accent === "orange"
          ? "border-brand-orange/30 bg-brand-orange/5 text-brand-orange hover:bg-brand-orange/15"
          : "border-brand-blue/30 bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/15",
      )}
    >
      ▸ {chip.label[locale]}
    </span>
  );
}
