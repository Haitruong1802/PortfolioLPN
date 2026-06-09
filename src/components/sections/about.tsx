"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/provider";
import { profile } from "@/lib/content/profile";
import { AnimatedEyebrow } from "@/components/animations/animated-eyebrow";
import { SectionSpotlight } from "@/components/site/section-spotlight";
import { ScrollTextReveal } from "@/components/animations/scroll-text-reveal";
import { LetterReveal } from "@/components/animations/letter-reveal";
import { cn } from "@/lib/utils";

// ─── 1. DNA chips at top — personality snapshot ───
const DNA_CHIPS: { vi: string; en: string; accent: "orange" | "blue" | "gradient" }[] = [
  { vi: "UEH Năm 1", en: "UEH Y1", accent: "blue" },
  { vi: "Account-bound", en: "Account-bound", accent: "orange" },
  { vi: "Event lover", en: "Event lover", accent: "blue" },
  { vi: "GO BIG", en: "GO BIG", accent: "gradient" },
];

export function About() {
  const { locale } = useLocale();

  return (
    <section
      id="about"
      className="relative section-py container-px mx-auto max-w-7xl"
    >
      <SectionSpotlight number="01" align="right" />
      <AnimatedEyebrow color="text-brand-orange">
        {locale === "vi" ? "Về Nam" : "About me"}
      </AnimatedEyebrow>

      {/* ─── 1. DNA STRIP — 5 personality chips ─── */}
      <div className="mb-8 flex flex-wrap gap-2">
        {DNA_CHIPS.map((chip, i) => (
          <motion.span
            key={chip.en}
            initial={{ opacity: 0, y: 12, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              delay: 0.1 + i * 0.08,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.15em] transition-all hover:scale-105",
              chip.accent === "orange" &&
                "border-brand-orange/40 bg-brand-orange/10 text-brand-orange shadow-[0_0_20px_rgba(255,122,26,0.15)]",
              chip.accent === "blue" &&
                "border-brand-blue/40 bg-brand-blue/10 text-brand-blue shadow-[0_0_20px_rgba(47,125,255,0.15)]",
              chip.accent === "gradient" &&
                "border-transparent bg-gradient-to-r from-brand-orange via-foreground to-brand-blue text-white font-bold shadow-[0_0_24px_rgba(255,122,26,0.25)]",
            )}
          >
            <span className="mr-1.5">▸</span>
            {chip[locale]}
          </motion.span>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          <LetterReveal
            text={
              locale === "vi"
                ? "Khởi đầu từ con số 0."
                : "Started from absolute zero."
            }
          />
        </h2>

        <p className="max-w-md text-base leading-relaxed md:text-lg">
          <ScrollTextReveal>{profile.bio[locale]}</ScrollTextReveal>
        </p>
      </div>

      {/* ─── 2. EDITORIAL QUOTE CARDS — 2 story blocks ─── */}
      <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
        <StoryBlock
          number="01"
          label={locale === "vi" ? "Khởi nguồn" : "Origin"}
          text={profile.story.origin[locale]}
          accent="orange"
          delay={0}
        />
        <StoryBlock
          number="02"
          label={locale === "vi" ? "Khoảnh khắc định hình" : "Defining moment"}
          text={profile.story.moment[locale]}
          accent="blue"
          delay={0.12}
        />
      </div>

      {/* ─── 4. GO BIG OR GO HOME — Frameless cinematic ─── */}
      <motion.figure
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative my-20 overflow-hidden py-8 sm:py-12 md:py-16"
      >
        {/* ✨ Floating particles background */}
        <ParticlesBackground />

        {/* Number 03 header — matches StoryBlock pattern */}
        <div className="relative mb-2 flex items-center gap-4">
          <span
            className="font-display font-extrabold leading-none tracking-tight text-foreground"
            style={{ fontSize: "2.25rem" }}
          >
            03
          </span>
          <span className="h-px flex-1 bg-border" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground">
            {locale === "vi" ? "Triết lý làm việc" : "Work philosophy"}
          </p>
        </div>

        {/* GO BIG / OR / GO HOME — 3 dòng giống Hero, blur slide-in stagger */}
        <h3 className="mt-6 font-display font-extrabold leading-[0.92] tracking-tight">
          <motion.span
            initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="block whitespace-nowrap text-go-big"
            style={{ fontSize: "clamp(2.5rem, 10vw, 7rem)" }}
          >
            GO BIG
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.6, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="block whitespace-nowrap text-go-or my-1"
            style={{ fontSize: "clamp(1.25rem, 5vw, 3.5rem)" }}
          >
            OR
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="block whitespace-nowrap text-go-home"
            style={{ fontSize: "clamp(2.5rem, 10vw, 7rem)" }}
          >
            GO HOME.
          </motion.span>
        </h3>

        <blockquote className="mt-8 max-w-3xl text-base italic leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
          &ldquo;{profile.story.philosophy[locale]}&rdquo;
        </blockquote>

        {/* Signature */}
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 flex items-center justify-end gap-2 font-display text-base italic text-foreground/70 sm:text-lg"
        >
          <span className="h-px w-12 bg-foreground/30" />
          Lê Phương Nam
        </motion.p>
      </motion.figure>

      {/* ─── #04 Commitment closer — frameless signed pledge ─── */}
      <CommitmentCloser
        label={locale === "vi" ? "Lời cam kết" : "Commitment"}
        text={profile.story.commitment[locale]}
      />
    </section>
  );
}

// ─────────────────────────────────────────────
// #04 Commitment Closer — frameless signed pledge
// Different visual rhythm than card-style 01/02
// ─────────────────────────────────────────────
function CommitmentCloser({ label, text }: { label: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-6 max-w-4xl text-center"
    >
      {/* Subtle gradient halo behind text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[60%] w-[80%] -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-orange/8 via-transparent to-brand-blue/8 blur-3xl"
      />

      {/* 04 + label eyebrow row */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.6 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-10 flex items-center justify-center gap-4"
      >
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-foreground/30 md:w-24" />
        <span
          className="font-display font-extrabold leading-none tracking-tight text-foreground"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
        >
          04
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground sm:text-xs">
          {label}
        </span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-foreground/30 md:w-24" />
      </motion.div>

      {/* Big gradient open-quote mark */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.9,
          delay: 0.2,
          type: "spring",
          stiffness: 140,
        }}
        className="block font-serif leading-none gradient-text"
        style={{ fontSize: "clamp(4rem, 9vw, 7rem)" }}
      >
        &ldquo;
      </motion.span>

      {/* Pledge text — italic, large, breathable */}
      <motion.blockquote
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay: 0.35 }}
        className="-mt-6 px-2 font-display italic leading-[1.4] text-foreground sm:leading-[1.45]"
        style={{ fontSize: "clamp(1.125rem, 2.4vw, 1.625rem)" }}
      >
        {text}
      </motion.blockquote>

      {/* Signature row — handwritten feel + ENFP tag */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
      >
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-12 origin-right bg-gradient-to-r from-transparent to-brand-orange sm:w-20"
        />
        <span
          className="font-display italic font-semibold text-foreground"
          style={{ fontSize: "clamp(1.125rem, 2vw, 1.375rem)" }}
        >
          — Lê Phương Nam
        </span>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="h-px w-12 origin-left bg-gradient-to-l from-transparent to-brand-blue sm:w-20"
        />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Editorial Story Block — quote-mark + number badge
// ─────────────────────────────────────────────
function StoryBlock({
  number,
  label,
  text,
  accent,
  delay,
}: {
  number: string;
  label: string;
  text: string;
  accent: "orange" | "blue" | "foreground";
  delay: number;
}) {
  const accentText =
    accent === "orange"
      ? "text-brand-orange"
      : accent === "blue"
        ? "text-brand-blue"
        : "text-foreground";
  const accentBorder =
    accent === "orange"
      ? "hover:border-brand-orange/40"
      : accent === "blue"
        ? "hover:border-brand-blue/40"
        : "hover:border-foreground/30";
  const accentGlow =
    accent === "orange"
      ? "hover:shadow-[0_0_40px_rgba(255,122,26,0.18)]"
      : accent === "blue"
        ? "hover:shadow-[0_0_40px_rgba(47,125,255,0.18)]"
        : "hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all md:p-8",
        accentBorder,
        accentGlow,
      )}
    >
      {/* Giant " quote mark background decoration */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-2 -top-8 select-none font-display font-black leading-none transition-opacity",
          accent === "orange"
            ? "text-brand-orange/[0.07] group-hover:text-brand-orange/[0.12]"
            : accent === "blue"
              ? "text-brand-blue/[0.07] group-hover:text-brand-blue/[0.12]"
              : "text-foreground/[0.05] group-hover:text-foreground/[0.08]",
        )}
        style={{ fontSize: "12rem" }}
      >
        &ldquo;
      </span>

      {/* Number + label header */}
      <div className="relative mb-5 flex items-center gap-4">
        <span
          className={cn(
            "font-display font-extrabold leading-none tracking-tight",
            accentText,
          )}
          style={{ fontSize: "2.25rem" }}
        >
          {number}
        </span>
        <span className="h-px flex-1 bg-border" />
        <p
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.22em]",
            accentText,
          )}
        >
          {label}
        </p>
      </div>

      {/* Text content */}
      <p className="relative text-sm leading-relaxed text-foreground sm:text-base md:text-lg">
        &ldquo;{text}&rdquo;
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Particles background for GO BIG panel
// ─────────────────────────────────────────────
function ParticlesBackground() {
  // 30 deterministic positions (no Math.random for SSR stability)
  const particles = React.useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: ((i * 37) % 100) + ((i * 13) % 7),
        top: ((i * 23) % 100) + ((i * 17) % 11),
        size: 2 + (i % 4),
        accent: i % 2 === 0 ? "orange" : "blue",
        delay: (i * 0.13) % 3,
        dur: 5 + ((i * 0.7) % 4),
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left % 100}%`,
            top: `${p.top % 100}%`,
            width: p.size,
            height: p.size,
            backgroundColor:
              p.accent === "orange" ? "var(--brand-orange)" : "var(--brand-blue)",
            opacity: 0.25,
            boxShadow: `0 0 ${p.size * 3}px ${
              p.accent === "orange" ? "var(--brand-orange)" : "var(--brand-blue)"
            }`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.25, 0.6, 0.25],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
