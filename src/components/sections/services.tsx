"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/i18n/provider";
import { skillGroups, type SkillGroupKey } from "@/lib/content/services";
import { Tilt } from "@/components/animations/tilt";
import { AnimatedEyebrow } from "@/components/animations/animated-eyebrow";
import { SectionSpotlight } from "@/components/site/section-spotlight";
import { GlitchText } from "@/components/animations/glitch-text";
import { cn } from "@/lib/utils";

const groupAccent: Record<SkillGroupKey, { text: string; bg: string; ring: string; rgba: string }> = {
  hard: {
    text: "text-brand-orange",
    bg: "bg-brand-orange/10",
    ring: "ring-brand-orange/30",
    rgba: "255,122,26",
  },
  soft: {
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
    ring: "ring-brand-blue/30",
    rgba: "47,125,255",
  },
  tools: {
    text: "text-foreground",
    bg: "bg-muted",
    ring: "ring-foreground/20",
    rgba: "230,200,120",
  },
};

const ACTIVE_BG: Record<SkillGroupKey, string> = {
  hard: "rgba(255,122,26,0.13)",
  soft: "rgba(47,125,255,0.13)",
  tools: "rgba(230,200,120,0.09)",
};

export function Services() {
  const { locale } = useLocale();
  const [active, setActive] = React.useState<SkillGroupKey>("hard");
  const group = skillGroups.find((g) => g.key === active)!;
  const accent = groupAccent[active];

  return (
    <section
      id="services"
      className="relative isolate section-py container-px mx-auto max-w-7xl overflow-hidden"
    >
      <SectionSpotlight number="04" align="right" />
      <AnimatedEyebrow color="text-brand-blue">
        {locale === "vi" ? "Skills & Expertise" : "Skills & Expertise"}
      </AnimatedEyebrow>

      {/* ░░░ Background tint blob — shifts color when tab changes ░░░ */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 -z-10 h-[42rem] w-[42rem] rounded-full blur-3xl"
        animate={{ backgroundColor: ACTIVE_BG[active] }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[36rem] w-[36rem] rounded-full blur-3xl"
        animate={{ backgroundColor: ACTIVE_BG[active] }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />

      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
        >
          <GlitchText>
            {locale === "vi"
              ? "Bộ kỹ năng của Account."
              : "An Account toolkit."}
          </GlitchText>
        </motion.h2>

      </div>

      {/* ─── Pill tabs with shared-layout indicator ─── */}
      <div className="mt-12 flex flex-wrap gap-2">
        {skillGroups.map((g) => {
          const groupClr = groupAccent[g.key];
          const isActive = active === g.key;
          return (
            <motion.button
              key={g.key}
              type="button"
              onClick={() => setActive(g.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: isActive ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? cn(
                      "border-transparent ring-2",
                      groupClr.ring,
                      groupClr.bg,
                      groupClr.text,
                    )
                  : "border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-bg"
                  aria-hidden
                  className={cn("absolute inset-0 -z-10 rounded-full", groupClr.bg)}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {/* Soft glow halo behind active pill */}
              {isActive && (
                <motion.span
                  layoutId="active-tab-glow"
                  aria-hidden
                  className="pointer-events-none absolute -inset-2 -z-20 rounded-full blur-lg"
                  style={{ backgroundColor: `rgba(${groupClr.rgba},0.4)` }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              {isActive && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    groupClr.text.replace("text-", "bg-"),
                  )}
                />
              )}
              {g.label[locale]}
              <motion.span
                key={`count-${g.key}-${isActive}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-[10px]"
              >
                {String(g.items.length).padStart(2, "0")}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {/* ─── Cards grid — 3D flip-in on tab change ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-10 grid gap-6 md:grid-cols-3"
          style={{ perspective: 1400 }}
        >
          {group.items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title.en + active}
                initial={{ opacity: 0, y: 36, rotateY: -28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformStyle: "flat" }}
              >
                <Tilt max={8} glare className="h-full rounded-2xl">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-2xl">
                    {/* Accent halo top-right */}
                    <div
                      aria-hidden
                      className={cn(
                        "absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500",
                        accent.bg,
                        "opacity-50 group-hover:opacity-100",
                      )}
                    />

                    {/* Pulse ring around icon */}
                    <div className="relative mb-5 inline-block">
                      <motion.span
                        aria-hidden
                        className={cn(
                          "absolute -inset-1 rounded-xl",
                          accent.bg,
                        )}
                        animate={{
                          opacity: [0, 0.6, 0],
                          scale: [1, 1.4, 1.4],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeOut",
                        }}
                      />
                      <div
                        className={cn(
                          "relative grid h-11 w-11 place-items-center rounded-xl",
                          accent.bg,
                          accent.text,
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                    </div>

                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {item.title[locale]}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description[locale]}
                    </p>

                    {/* Bottom accent line — animated on hover */}
                    <div
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100",
                        accent.text.replace("text-", "bg-"),
                      )}
                    />
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
