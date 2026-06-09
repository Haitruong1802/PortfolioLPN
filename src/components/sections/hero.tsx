"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { profile } from "@/lib/content/profile";
import { GlitchText } from "@/components/animations/glitch-text";
import { TypingText } from "@/components/animations/typing-text";

// 6 sparkles scattered around the portrait silhouette.
// Position relative to the portrait wrapper (right column).
const SPARKLES = [
  { left: "8%", top: "12%", delay: 0, dur: 4.2, color: "var(--brand-orange)" },
  { left: "82%", top: "18%", delay: 1.1, dur: 5.4, color: "var(--brand-blue)" },
  { left: "4%", top: "55%", delay: 2.3, dur: 4.8, color: "var(--brand-blue)" },
  { left: "88%", top: "62%", delay: 0.6, dur: 5.0, color: "var(--brand-orange)" },
  { left: "48%", top: "6%", delay: 1.7, dur: 4.4, color: "var(--brand-orange)" },
  { left: "70%", top: "82%", delay: 2.9, dur: 5.2, color: "var(--brand-blue)" },
];

/**
 * Hero / Trang Bìa — minimal, theo đúng docs.
 *  - 2/3 trái: Typography
 *      • GO BIG / OR / GO HOME (cam / trắng / xanh)
 *      • Lê Phương Nam — Account Intern
 *      • Tagline italic
 *  - 1/3 phải: Portrait cut-out
 *  - Background: Fluid Gradient
 */
export function Hero() {
  const { t, locale } = useLocale();
  const ref = React.useRef<HTMLElement>(null);

  // Disable per-character typing on mobile - even with rAF the residual
  // setState reflow could stutter on slow CPUs. Mobile gets the full
  // tagline in one fade-in instead; the typing animation is a desktop-
  // only flourish.
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  // Scroll-driven exit
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blurAmount = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const blur = useTransform(blurAmount, (v) => `blur(${v}px)`);
  const portraitY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden noise-bg pt-24 pb-12 md:pt-28"
    >
      {/* Fluid Gradient background — theo docs */}
      <div className="fluid-bg" aria-hidden />

      {/* DESKTOP PORTRAIT — absolute, no cursor tilt. Depth via layered glow + drop-shadow. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: portraitY }}
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden h-full items-end justify-end lg:flex"
      >
        {/* ░░░ Layered "3D depth" glow stack behind portrait ░░░
            Each layer at different scale + blur + opacity → silhouette feels
            like it's pushing out of the page. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 grid place-items-center"
        >
          {/* Layer 1 — deepest: huge cam-xanh radial, slowly pulses */}
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.55, 0.8, 0.55] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-[60rem] w-[60rem] rounded-full bg-gradient-to-br from-brand-orange/35 via-transparent to-brand-blue/35 blur-3xl"
          />
          {/* Layer 2 — mid: conic spectrum, slowly rotates → subtle aurora */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute h-[44rem] w-[44rem] rounded-full bg-[conic-gradient(from_0deg,var(--brand-orange)_0%,transparent_25%,transparent_55%,var(--brand-blue)_75%,transparent_95%)] opacity-30 blur-3xl"
          />
          {/* Layer 3 — tight rim hug to silhouette: warm halo behind shoulders/head */}
          <motion.div
            animate={{
              opacity: [0.7, 0.95, 0.7],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-[32rem] w-[32rem] rounded-full bg-gradient-to-t from-brand-orange/50 via-brand-orange/20 to-transparent blur-2xl"
            style={{ transform: "translateY(15%)" }}
          />
        </div>

        {/* ✦ Floating sparkles — 6 stars scattered around silhouette */}
        {SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute z-20 text-2xl md:text-3xl"
            style={{
              left: s.left,
              top: s.top,
              color: s.color,
              textShadow: `0 0 14px ${s.color}`,
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1.2, 0.8],
              y: [0, -10, -18, -26],
            }}
            transition={{
              duration: s.dur,
              delay: 1.5 + s.delay,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: "easeInOut",
            }}
          >
            ✦
          </motion.span>
        ))}

        {/* Portrait — multi-layer drop-shadow gives "lifted off page" depth */}
        <div
          className="relative overflow-hidden"
          style={{
            height: "92vh",
            maxWidth: "none",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
          }}
        >
          <Image
            src="/portrait-cutout.png"
            alt={profile.name}
            width={1200}
            height={1560}
            priority
            sizes="60vw"
            className="relative h-full w-auto object-contain"
          />
        </div>
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale, filter: blur }}
        className="container-px relative z-10 mx-auto w-full max-w-7xl"
      >
        <div className="lg:max-w-[60%]">
          {/* Typography only, no grid */}
          <div className="min-w-0">
            {/* GO BIG / OR / GO HOME */}
            <h1 className="font-display font-extrabold leading-[0.92] tracking-tight">
              <motion.span
                initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block whitespace-nowrap text-go-big"
                style={{ fontSize: "clamp(2.75rem, 10vw, 8rem)" }}
              >
                <GlitchText>GO BIG</GlitchText>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  delay: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block whitespace-nowrap text-go-or my-1"
                style={{ fontSize: "clamp(1.5rem, 5vw, 4rem)" }}
              >
                OR
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="block whitespace-nowrap text-go-home"
                style={{ fontSize: "clamp(2.75rem, 10vw, 8rem)" }}
              >
                <GlitchText>GO HOME.</GlitchText>
              </motion.span>
            </h1>

            {/* Tiêu đề định vị: Lê Phương Nam — Account Intern */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="mt-10 font-display tracking-tight"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              <span className="font-semibold">{profile.name}</span>
              <span className="text-muted-foreground"> — {t("hero.eyebrow")}</span>
            </motion.p>

            {/* Tagline italic — narrative, typed character by character.
                Ghost copy reserves the final layout so wraps don't reflow the
                page as new characters arrive (was causing a noticeable stutter
                at the word "Account" mid-line on mobile). */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="relative mt-4 max-w-2xl text-base italic leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
            >
              {isMobile ? (
                // Mobile: just show the full tagline. Skip typing entirely.
                <span>{profile.tagline[locale]}</span>
              ) : (
                <>
                  {/* Desktop: ghost preserves layout while typing reveals chars. */}
                  <span aria-hidden className="invisible">
                    {profile.tagline[locale]}
                  </span>
                  <span className="absolute inset-0">
                    <TypingText
                      text={profile.tagline[locale]}
                      speed={24}
                      startDelay={0}
                    />
                  </span>
                </>
              )}
            </motion.p>

          </div>
        </div>
      </motion.div>

      {/* Scroll indicator — minimal */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground md:flex"
      >
        {t("hero.scroll")}
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
