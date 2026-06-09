"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import {
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  Sparkles,
} from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { experienceItems, type ExperienceItem, type ExpImage } from "@/lib/content/process";
import { AnimatedEyebrow } from "@/components/animations/animated-eyebrow";
import { SectionSpotlight } from "@/components/site/section-spotlight";
import { LetterReveal } from "@/components/animations/letter-reveal";
import { ImageReveal } from "@/components/animations/image-reveal";
import { ImageGlow } from "@/components/animations/image-glow";
import { Tilt } from "@/components/animations/tilt";
import { cn } from "@/lib/utils";


const stepAccent = ["text-brand-orange", "text-brand-blue", "text-brand-orange"];
const stepRing = ["ring-brand-orange", "ring-brand-blue", "ring-brand-orange"];
const stepBtn = [
  "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
  "border-brand-blue/40 bg-brand-blue/10 text-brand-blue",
  "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
];
const stepGlow: ("orange" | "blue")[] = ["orange", "blue", "orange"];

export function Process() {
  const { locale } = useLocale();
  const [zoom, setZoom] = React.useState<ExpImage | null>(null);

  return (
    <section
      id="process"
      className="relative section-py container-px mx-auto max-w-7xl"
    >
      <SectionSpotlight number="02" align="left" />
      <AnimatedEyebrow color="text-brand-orange">
        {locale === "vi" ? "Kinh nghiệm" : "Experience"}
      </AnimatedEyebrow>

      <div className="max-w-4xl">
        <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          <LetterReveal
            text={
              locale === "vi"
                ? "Vậy cậu sinh viên năm 1 đã làm gì để phát triển bản thân?"
                : "So what did this first-year student do to grow?"
            }
          />
        </h2>
      </div>

      <ol className="mt-16 flex flex-col gap-24">
        {experienceItems.map((exp, i) =>
          exp.org.toUpperCase().startsWith("SINTECH") ? (
            <SintechShowcase
              key={exp.org}
              exp={exp}
              index={i}
              accent={stepAccent[i]}
              onZoom={setZoom}
            />
          ) : (
            <ExperienceBlock
              key={exp.org}
              exp={exp}
              index={i}
              accent={stepAccent[i]}
              ringClass={stepRing[i]}
              btnClass={stepBtn[i]}
              glowAccent={stepGlow[i]}
              onZoom={setZoom}
            />
          ),
        )}
      </ol>

      <AnimatePresence>
        {zoom && <ImageZoomModal img={zoom} onClose={() => setZoom(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ExperienceBlock({
  exp,
  index,
  accent,
  ringClass,
  btnClass,
  glowAccent,
  onZoom,
}: {
  exp: ExperienceItem;
  index: number;
  accent: string;
  ringClass: string;
  btnClass: string;
  glowAccent: "orange" | "blue";
  onZoom: (img: ExpImage) => void;
}) {
  const { locale } = useLocale();
  const [hoveredRespIdx, setHoveredRespIdx] = React.useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = React.useState(false);

  const programs = exp.programs ?? [];
  const gallery = exp.gallery;
  const identity = exp.hero;

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Header — cleaner, no decorative briefcase */}
      <header className="mb-10 grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2">
          <span
            className={cn(
              "font-display font-extrabold leading-none tracking-tight",
              accent,
            )}
            style={{ fontSize: "clamp(3rem, 7vw, 5rem)" }}
          >
            {exp.step}
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {exp.duration[locale]}
          </p>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            {exp.org}
          </h3>
          <p className="mt-1 text-base text-muted-foreground">
            {exp.role[locale]}
          </p>
        </div>
      </header>

      {/* MAIN — 1/3 identity image (left) + 2/3 right (programs flipbook top, skills bottom) */}
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-10">
        {/* LEFT 1/3 — Identity image (Nam wearing org shirt — represented by hero poster) */}
        {identity && (
          <ImageGlow accent={glowAccent} intensity={0.4}>
            <Tilt max={10} glare className="rounded-[1.5rem]">
            <ImageReveal
              direction="up"
              rounded="1.5rem"
              className="relative aspect-[3/4] overflow-hidden border border-border bg-card shadow-2xl"
            >
              <button
                type="button"
                onClick={() => onZoom(identity)}
                className="group absolute inset-0 block w-full"
                aria-label={`Open ${identity.alt}`}
              >
                <Image
                  src={identity.src}
                  alt={identity.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-transform group-hover:scale-110">
                  <Eye className="h-4 w-4" />
                </span>

                <div className="absolute inset-x-5 bottom-5">
                  <p
                    className={cn(
                      "mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]",
                      accent,
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        accent.replace("text-", "bg-"),
                      )}
                    />
                    {exp.shortOrg}
                  </p>
                  <p className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                    {exp.role[locale]}
                  </p>
                </div>
              </button>
            </ImageReveal>
            </Tilt>
          </ImageGlow>
        )}

        {/* RIGHT 2/3 — Magazine grid of programs (top) + Responsibilities (bottom) */}
        <div className="flex min-w-0 flex-col gap-10">
          {/* PROGRAMS — magazine grid (all visible at once, no flipping) */}
          {programs.length > 0 && (
            <div>
              <p
                className={cn(
                  "mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]",
                  accent,
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {locale === "vi"
                  ? "Chương trình đã tham gia"
                  : "Programs participated"}{" "}
                ·{" "}
                <span className="font-mono">
                  {String(programs.length).padStart(2, "0")}
                </span>
              </p>

              {/* Equal grid — tất cả poster cùng aspect 3/4, dễ scan, click ổn định */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {programs.map((p, pi) => (
                  <motion.div
                    key={p.title + p.date}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.55,
                      delay: pi * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -6 }}
                    className="relative"
                  >
                    <Tilt max={12} glare className="rounded-2xl">
                    <button
                      type="button"
                      onClick={() => p.image && onZoom(p.image)}
                      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-shadow hover:shadow-2xl"
                      aria-label={`Open ${p.title}`}
                    >
                      {p.image && (
                        <Image
                          src={p.image.src}
                          alt={p.image.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, 22vw"
                          className="object-cover"
                        />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Eye hint top-right */}
                      <span className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-transform group-hover:scale-110">
                        <Eye className="h-3.5 w-3.5" />
                      </span>

                      {/* Role + date — bottom */}
                      <div className="pointer-events-none absolute inset-x-3 bottom-3">
                        <p
                          className={cn(
                            "mb-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em]",
                            accent,
                          )}
                        >
                          <span
                            className={cn(
                              "h-1 w-1 rounded-full",
                              accent.replace("text-", "bg-"),
                            )}
                          />
                          {p.role}
                        </p>
                        <p className="font-display text-xs font-bold leading-tight tracking-tight text-white sm:text-sm">
                          {p.title}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] text-white/70">
                          {p.date}
                        </p>
                      </div>

                      {/* Hover accent ring */}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute inset-0 rounded-2xl ring-0 transition-all duration-300 group-hover:ring-2",
                          accent === "text-brand-orange"
                            ? "group-hover:ring-brand-orange/60"
                            : "group-hover:ring-brand-blue/60",
                        )}
                      />
                    </button>
                    </Tilt>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* RESPONSIBILITIES — chips + BIG cinematic hover preview */}
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(380px,_480px)]">
            <div>
              <p
                className={cn(
                  "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]",
                  accent,
                )}
              >
                <span>▸</span>
                {locale === "vi"
                  ? "Việc đã làm — hover để xem"
                  : "Work done — hover to preview"}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {exp.responsibilities.map((r, ri) => (
                  <motion.li
                    key={r.en}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: ri * 0.04 }}
                    onMouseEnter={() => r.image && setHoveredRespIdx(ri)}
                    onMouseLeave={() => setHoveredRespIdx(null)}
                  >
                    <button
                      type="button"
                      onClick={() => r.image && onZoom(r.image)}
                      disabled={!r.image}
                      className={cn(
                        "group/chip inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-all",
                        r.image
                          ? cn(
                              "border-border bg-background text-foreground hover:scale-105 cursor-pointer",
                              accent === "text-brand-orange"
                                ? "hover:border-brand-orange/50 hover:bg-brand-orange/5"
                                : "hover:border-brand-blue/50 hover:bg-brand-blue/5",
                            )
                          : "border-border bg-background text-muted-foreground cursor-default opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-transform group-hover/chip:scale-125",
                          r.image
                            ? accent.replace("text-", "bg-")
                            : "bg-muted-foreground/30",
                        )}
                      />
                      {r[locale]}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* BIG cinematic preview panel — desktop only */}
            <div className="hidden flex-col gap-3 lg:flex">
              {/* Top label row — PREVIEW + counter */}
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]",
                    accent,
                  )}
                >
                  <span>▸</span>
                  <span>{locale === "vi" ? "Xem trước" : "Preview"}</span>
                </p>
                <AnimatePresence mode="wait">
                  {hoveredRespIdx !== null && (
                    <motion.p
                      key={`counter-${hoveredRespIdx}`}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "font-mono text-[10px] font-bold uppercase tracking-[0.25em]",
                        accent,
                      )}
                    >
                      {String(hoveredRespIdx + 1).padStart(2, "0")}
                      <span className="opacity-50">
                        {" / "}
                        {String(exp.responsibilities.length).padStart(2, "0")}
                      </span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Big preview frame — aspect-[4/3], glows when active */}
              <div className="relative aspect-[4/3] w-full">
                {/* Breathing gradient halo behind */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 rounded-3xl blur-3xl"
                  animate={
                    hoveredRespIdx !== null
                      ? {
                          opacity: [0.3, 0.55, 0.3],
                          scale: [1, 1.04, 1],
                        }
                      : { opacity: 0 }
                  }
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    background:
                      accent === "text-brand-orange"
                        ? "radial-gradient(ellipse, rgba(255,122,26,0.4), transparent 70%)"
                        : "radial-gradient(ellipse, rgba(47,125,255,0.4), transparent 70%)",
                  }}
                />

                <AnimatePresence mode="wait">
                  {hoveredRespIdx !== null &&
                    exp.responsibilities[hoveredRespIdx]?.image && (
                      <motion.button
                        type="button"
                        onClick={() =>
                          exp.responsibilities[hoveredRespIdx].image &&
                          onZoom(exp.responsibilities[hoveredRespIdx].image!)
                        }
                        key={hoveredRespIdx}
                        initial={{ opacity: 0, scale: 0.92, y: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -10 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group/preview absolute inset-0 block overflow-hidden rounded-2xl border border-border bg-background text-left"
                        style={{
                          boxShadow:
                            accent === "text-brand-orange"
                              ? "0 30px 80px -20px rgba(255,122,26,0.35), 0 0 0 1px rgba(255,122,26,0.25), inset 0 0 0 1px rgba(255,255,255,0.04)"
                              : "0 30px 80px -20px rgba(47,125,255,0.35), 0 0 0 1px rgba(47,125,255,0.25), inset 0 0 0 1px rgba(255,255,255,0.04)",
                        }}
                        aria-label={`Zoom ${exp.responsibilities[hoveredRespIdx].image!.alt}`}
                      >
                        <Image
                          src={exp.responsibilities[hoveredRespIdx].image!.src}
                          alt={exp.responsibilities[hoveredRespIdx].image!.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 32rem"
                          className="object-cover transition-transform duration-700 group-hover/preview:scale-[1.04]"
                        />

                        {/* Cinematic corner brackets */}
                        <span
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 transition-all duration-500 group-hover/preview:h-8 group-hover/preview:w-8",
                            accent === "text-brand-orange"
                              ? "border-brand-orange/70"
                              : "border-brand-blue/70",
                          )}
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 transition-all duration-500 group-hover/preview:h-8 group-hover/preview:w-8",
                            accent === "text-brand-orange"
                              ? "border-brand-orange/70"
                              : "border-brand-blue/70",
                          )}
                        />

                        {/* Zoom indicator */}
                        <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/preview:opacity-100">
                          <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                        </div>

                        {/* Caption with stronger gradient */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 pt-12">
                          <p
                            className={cn(
                              "font-mono text-[9px] uppercase tracking-[0.3em]",
                              accent === "text-brand-orange"
                                ? "text-brand-orange"
                                : "text-brand-blue",
                            )}
                          >
                            {locale === "vi"
                              ? "Việc đã làm"
                              : "Work done"}
                          </p>
                          <p className="mt-1 line-clamp-2 font-display text-base font-bold leading-tight tracking-tight text-white sm:text-lg">
                            {exp.responsibilities[hoveredRespIdx][locale]}
                          </p>
                        </div>
                      </motion.button>
                    )}
                </AnimatePresence>

                {/* Idle state — cinematic placeholder */}
                {hoveredRespIdx === null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 grid place-items-center overflow-hidden rounded-2xl border border-dashed border-border/60 bg-background/30 text-center backdrop-blur-sm"
                  >
                    {/* Dot grid background */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, color-mix(in srgb, var(--color-foreground) 25%, transparent) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        maskImage:
                          "radial-gradient(ellipse at center, black 25%, transparent 70%)",
                        WebkitMaskImage:
                          "radial-gradient(ellipse at center, black 25%, transparent 70%)",
                      }}
                    />

                    {/* Floating sparkles in corners */}
                    {[
                      { top: "12%", left: "12%", delay: 0 },
                      { top: "16%", right: "14%", delay: 0.8 },
                      { bottom: "18%", left: "10%", delay: 1.6 },
                    ].map((p, i) => (
                      <motion.span
                        key={i}
                        aria-hidden
                        animate={{
                          y: [0, -8, 0],
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.9, 1.1, 0.9],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: p.delay,
                        }}
                        className={cn(
                          "absolute text-lg",
                          accent === "text-brand-orange"
                            ? "text-brand-orange/40"
                            : "text-brand-blue/40",
                        )}
                        style={p}
                      >
                        ✦
                      </motion.span>
                    ))}

                    {/* Center icon + text */}
                    <div className="relative z-10 flex flex-col items-center gap-4 px-8">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={cn(
                          "grid h-16 w-16 place-items-center rounded-full border-2 border-dashed",
                          accent === "text-brand-orange"
                            ? "border-brand-orange/40"
                            : "border-brand-blue/40",
                        )}
                      >
                        <Eye
                          className={cn("h-7 w-7", accent)}
                          strokeWidth={1.8}
                        />
                      </motion.div>
                      <div className="flex flex-col gap-1.5">
                        <p
                          className={cn(
                            "font-display font-bold uppercase tracking-[0.15em]",
                            accent,
                          )}
                          style={{ fontSize: "1rem" }}
                        >
                          {locale === "vi" ? "Hover chip" : "Hover a chip"}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                          {locale === "vi"
                            ? "Để xem ảnh thật"
                            : "To preview the actual asset"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Behind-the-scenes gallery — HIDDEN by default */}
      {gallery.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setGalleryOpen((s) => !s)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
                btnClass,
              )}
            >
              {galleryOpen ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {locale === "vi" ? "Thu gọn" : "Show less"}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {locale === "vi" ? "Xem thêm" : "Show more"}
                </>
              )}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {galleryOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                {/* Uniform aspect-square grid — matches source posters (1:1) */}
                <div className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {gallery.map((g, gi) => (
                    <motion.div
                      key={g.src}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: Math.min(gi * 0.04, 0.4),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ y: -4 }}
                      className="relative aspect-square"
                    >
                      <Tilt max={8} glare className="h-full w-full rounded-xl">
                        <button
                          type="button"
                          onClick={() => onZoom(g)}
                          className="group relative block h-full w-full overflow-hidden rounded-xl bg-card shadow-lg transition-shadow hover:shadow-2xl"
                          aria-label={`Open ${g.alt}`}
                        >
                          <Image
                            src={g.src}
                            alt={g.alt}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="line-clamp-2 text-[11px] font-medium leading-tight text-white">
                              {g.alt}
                            </p>
                          </div>
                          <span
                            aria-hidden
                            className={cn(
                              "pointer-events-none absolute inset-0 rounded-xl ring-0 transition-all duration-300 group-hover:ring-2",
                              accent === "text-brand-orange"
                                ? "group-hover:ring-brand-orange/50"
                                : "group-hover:ring-brand-blue/50",
                            )}
                          />
                        </button>
                      </Tilt>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.li>
  );
}

// ─────────────────────────────────────────────────────────────
// SINTECH SHOWCASE — Different layout from Travel/Margroup
// Each task gets its own "chapter" with all illustration images
// shown in a no-crop grid sized to fit each image type.
// Total: 20 images across 6 tasks.
// ─────────────────────────────────────────────────────────────

type SintechImage = {
  src: string;
  alt: string;
  /** Override task.imgAspect for this image only (e.g., landscape banner in a square grid) */
  aspect?: string;
  /** Make this image span the full task row (e.g., wide banner spans 2 cols in a 2-col grid) */
  spanFull?: boolean;
};

type SintechTask = {
  id: string;
  num: string;
  vi: { title: string; desc: string };
  en: { title: string; desc: string };
  images: SintechImage[];
  /** Default aspect ratio for images. Images are object-contain (never cropped). */
  imgAspect: string;
  /** Grid columns at md+ breakpoint */
  cols: 1 | 2 | 3;
};

const SINTECH_TASKS: SintechTask[] = [
  {
    id: "fanpage",
    num: "01",
    vi: {
      title: "Quản lý fanpage Công ty",
      desc: "Phụ trách vận hành fanpage Sintech PC Gaming & Gear với hơn 7.000 lượt theo dõi. Lên kế hoạch nội dung định kỳ, theo dõi insight tương tác và phối hợp cùng designer, PM để giữ brand voice nhất quán.",
    },
    en: {
      title: "Company fanpage management",
      desc: "Managed Sintech PC Gaming & Gear fanpage with over 7,000 followers. Planned regular content, tracked engagement insights, and coordinated with designers and PMs to maintain a consistent brand voice.",
    },
    images: [
      { src: "/experience/sintech/fanpage.png", alt: "Sintech PC Gaming & Gear fanpage — 7K followers" },
    ],
    imgAspect: "aspect-[4/3]",
    cols: 1,
  },
  {
    id: "fb-content",
    num: "02",
    vi: {
      title: "Viết bài content fanpage Công ty",
      desc: "Sản xuất bài đăng theo lịch nội dung hàng tuần gồm post giới thiệu sản phẩm, deal khuyến mãi và bài kiến thức về phần cứng. Tối ưu hook mở đầu và CTA cuối bài để tăng tương tác tự nhiên.",
    },
    en: {
      title: "Fanpage content writing",
      desc: "Produced weekly posts following the content calendar, including product introductions, promotions, and hardware education. Optimised opening hooks and closing CTAs for organic engagement.",
    },
    images: [
      { src: "/experience/sintech/fb-content.png", alt: "Sintech fanpage content samples" },
    ],
    imgAspect: "aspect-[4/3]",
    cols: 1,
  },
  {
    id: "uxui",
    num: "03",
    vi: {
      title: "Hỗ trợ đảm bảo hình ảnh website (UX/UI)",
      desc: "Review giao diện sintech.vn, đề xuất chỉnh sửa thumbnail sản phẩm, banner trang chủ và bố cục danh mục nhằm cải thiện trải nghiệm mua sắm trực quan cho khách hàng.",
    },
    en: {
      title: "Website UX/UI quality assurance",
      desc: "Reviewed sintech.vn interface, recommended updates to product thumbnails, homepage banners, and category layouts to improve customer shopping experience.",
    },
    images: [
      { src: "/experience/sintech/uxui-1.jpg", alt: "Sintech website UX/UI 1" },
      { src: "/experience/sintech/uxui-2.jpg", alt: "Sintech website UX/UI 2" },
      { src: "/experience/sintech/uxui-3.jpg", alt: "Sintech website UX/UI 3" },
    ],
    imgAspect: "aspect-[16/10]",
    cols: 3,
  },
  {
    id: "seo",
    num: "04",
    vi: {
      title: "Viết content SEO cho website bán hàng",
      desc: "Viết bài blog chuẩn SEO trên sintech.vn với chủ đề review sản phẩm, hướng dẫn build PC theo ngân sách và so sánh hiệu năng GPU, CPU. Nghiên cứu từ khoá, xây dựng cấu trúc H1 đến H3, viết meta description và theo dõi hiệu suất bài viết qua dashboard.",
    },
    en: {
      title: "SEO-optimised e-commerce content",
      desc: "Wrote SEO blog posts on sintech.vn covering product reviews, PC build guides by budget, and GPU/CPU performance comparisons. Researched keywords, structured the H1 to H3 hierarchy, crafted meta descriptions, and tracked article performance via dashboard.",
    },
    images: [
      // Row 1 — analytics dashboard (full-width landscape)
      {
        src: "/experience/sintech/seo-6.jpg",
        alt: "SEO analytics dashboard — Sintech blog performance",
        aspect: "aspect-[2/1]",
        spanFull: true,
      },
      // Rows 2-4 — CMS article lists (each full-width landscape)
      {
        src: "/experience/sintech/seo-1.jpg",
        alt: "SEO articles list 1 — Sintech blog CMS",
        aspect: "aspect-[2/1]",
        spanFull: true,
      },
      {
        src: "/experience/sintech/seo-2.jpg",
        alt: "SEO articles list 2 — Sintech blog CMS",
        aspect: "aspect-[2/1]",
        spanFull: true,
      },
      {
        src: "/experience/sintech/seo-3.jpg",
        alt: "SEO articles list 3 — Sintech blog CMS",
        aspect: "aspect-[2/1]",
        spanFull: true,
      },
      // Row 5 — 2 blog post pages side-by-side
      {
        src: "/experience/sintech/seo-4.jpg",
        alt: "Blog article — NPU là gì? Vì sao PC 2025 cần có NPU",
      },
      {
        src: "/experience/sintech/seo-5.jpg",
        alt: "Blog article — Copilot+ PC là gì?",
      },
    ],
    imgAspect: "aspect-[4/3]",
    cols: 2,
  },
  {
    id: "campaign",
    num: "05",
    vi: {
      title: "Xây dựng các chương trình ưu đãi",
      desc: "Lên ý tưởng và triển khai 6 chiến dịch khuyến mãi xuyên suốt năm gồm Summer Sale, Back to School, Đại lễ 2/9 và Build PC Gaming. Thực hiện trọn vòng công việc từ briefing cùng BOD, định hướng key visual đến đo lường hiệu quả KPI.",
    },
    en: {
      title: "Promotion campaigns co-creation",
      desc: "Ideated and executed 6 promotion campaigns year-round including Summer Sale, Back to School, National Day, and Build PC Gaming. Owned the full cycle from BOD briefing and key visual direction through to KPI measurement.",
    },
    images: [
      // 2 landscape banners on top — each spans full row
      {
        src: "/experience/sintech/campaign-4.jpg",
        alt: "Back to School Sale — Tặng đế tản nhiệt + giảm 200K",
        aspect: "aspect-[2/1]",
        spanFull: true,
      },
      {
        src: "/experience/sintech/campaign-6.jpg",
        alt: "Tưng bừng đại lễ — Săn deal thật dễ · 80 năm",
        aspect: "aspect-[2/1]",
        spanFull: true,
      },
      // 4 square posters: 2 per row, 2 rows
      { src: "/experience/sintech/campaign-1.jpg", alt: "Build dàn máy chiến game cháy" },
      { src: "/experience/sintech/campaign-2.jpg", alt: "Summer Sale — PC Gaming & Gear giá tốt" },
      { src: "/experience/sintech/campaign-3.jpg", alt: "Laptop HS-SV — Back to School giảm 300K" },
      { src: "/experience/sintech/campaign-5.jpg", alt: "Đặt trước — Vệ sinh tra keo giảm 50K" },
    ],
    imgAspect: "aspect-square",
    cols: 2,
  },
  {
    id: "zalo",
    num: "06",
    vi: {
      title: "Xây dựng hệ thống Zalo OA chăm sóc khách hàng",
      desc: "Thiết lập trang Zalo Official Account của Sintech bao gồm profile, banner và tương tác nhanh. Xuất bản bài viết quảng cáo dịch vụ trên kênh OA và xây dựng kịch bản chatbot tự động trả lời theo từ khoá, giúp nâng tỉ lệ phản hồi trong vòng 5 phút.",
    },
    en: {
      title: "Zalo OA customer-care system",
      desc: "Set up Sintech's Zalo Official Account including profile, banner, and quick interactions. Published service promotion articles on the OA channel and built keyword-triggered chatbot scripts that improved 5-minute response rates.",
    },
    images: [
      // Row 1 — 2 portrait images paired side-by-side
      {
        src: "/experience/sintech/zalo-oa-1.png",
        alt: "Trang Zalo OA Sintech — profile khách hàng nhìn thấy",
      },
      {
        src: "/experience/sintech/zalo-oa-articles.jpg",
        alt: "Danh sách bài viết đã đăng lên Zalo OA",
      },
      // Row 2 — Dashboard landscape spans full width = row 1 width
      {
        src: "/experience/sintech/zalo-oa-2.jpg",
        alt: "Dashboard Zalo Official Account Manager — kịch bản chatbot",
        aspect: "aspect-[16/9]",
        spanFull: true,
      },
    ],
    imgAspect: "aspect-[3/4]",
    cols: 2,
  },
];

// ─────────────────────────────────────────────────────────────
// SintechShowcase — Editorial case-study layout
// Minimal decoration. Typography-led. Whitespace generous.
// Inspired by case-study pages from premium agencies / Stripe Press.
// ─────────────────────────────────────────────────────────────
function SintechShowcase({
  exp,
  accent,
  onZoom,
}: {
  exp: ExperienceItem;
  index: number;
  accent: string;
  onZoom: (img: ExpImage) => void;
}) {
  const { locale } = useLocale();

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Header — same hierarchy as other ExperienceBlock */}
      <header className="mb-14 grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2">
          <span
            className={cn(
              "font-display font-extrabold leading-none tracking-tighter",
              accent,
            )}
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)" }}
          >
            {exp.step}
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {exp.duration[locale]}
          </p>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {exp.org}
          </h3>
          <p className="mt-2 text-base text-muted-foreground md:text-lg">
            {exp.role[locale]}
          </p>
          {exp.campaignContext && (
            <p
              className={cn(
                "mt-3 font-mono text-[10px] uppercase tracking-[0.22em]",
                accent,
              )}
            >
              ▸ {exp.campaignContext[locale]}
            </p>
          )}
        </div>
      </header>

      {/* Task grid — single-image tasks pair side-by-side, multi-image span full width */}
      <div className="grid gap-x-8 gap-y-10 md:gap-y-12 md:grid-cols-2">
        {SINTECH_TASKS.map((task) => (
          <SintechTaskSection
            key={task.id}
            task={task}
            locale={locale}
            accent={accent}
            onZoom={onZoom}
            spanTwo={task.images.length > 1}
          />
        ))}
      </div>
    </motion.li>
  );
}

function SintechTaskSection({
  task,
  locale,
  accent,
  onZoom,
  spanTwo,
}: {
  task: SintechTask;
  locale: "vi" | "en";
  accent: string;
  onZoom: (img: ExpImage) => void;
  spanTwo: boolean;
}) {
  const content = task[locale];
  const isMultiImage = task.images.length > 1;
  // Multi-image tasks (03–06) start collapsed — user clicks "Xem thêm" to expand
  const [imagesOpen, setImagesOpen] = React.useState(!isMultiImage);
  const gridCols =
    task.cols === 1
      ? "grid-cols-1"
      : task.cols === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const imageGrid = (
    <div className={cn("grid gap-3", gridCols)}>
      {task.images.map((img, i) => {
        const aspect = img.aspect ?? task.imgAspect;
        const spanClass = img.spanFull
          ? task.cols === 3
            ? "sm:col-span-2 lg:col-span-3"
            : task.cols === 2
              ? "md:col-span-2"
              : ""
          : "";
        return (
          <motion.button
            key={img.src}
            type="button"
            onClick={() =>
              onZoom({ ...img, aspect: "landscape" } as ExpImage)
            }
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: Math.min(i * 0.05, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "group relative block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/20",
              aspect,
              spanClass,
            )}
            aria-label={`Zoom ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={
                img.spanFull
                  ? "(max-width: 768px) 100vw, 80vw"
                  : task.cols === 1
                    ? "100vw"
                    : task.cols === 2
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
              <Eye className="h-3 w-3" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(spanTwo && "md:col-span-2")}
    >
      {/* Header — inline number + title + description */}
      <div className="mb-4">
        <h4
          className="font-display font-semibold leading-tight tracking-tight"
          style={{ fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)" }}
        >
          <span className={cn("mr-2 font-mono text-sm font-bold", accent)}>
            {task.num}
          </span>
          <span className="mr-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            /
          </span>
          {content.title}
        </h4>
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-foreground/80 md:text-base">
          {content.desc}
        </p>
      </div>

      {/* Single-image tasks: show grid directly */}
      {!isMultiImage && imageGrid}

      {/* Multi-image tasks (03–06): "Xem thêm" toggle */}
      {isMultiImage && (
        <>
          <button
            type="button"
            onClick={() => setImagesOpen(!imagesOpen)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground/40 hover:bg-card/80",
            )}
            aria-expanded={imagesOpen}
          >
            {imagesOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>{locale === "vi" ? "Thu gọn" : "Show less"}</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>
                  {locale === "vi"
                    ? `Xem ${task.images.length} tài liệu thực tế`
                    : `Show ${task.images.length} real assets`}
                </span>
              </>
            )}
          </button>

          <AnimatePresence initial={false}>
            {imagesOpen && (
              <motion.div
                key="img-collapse"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4">{imageGrid}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.section>
  );
}

function ImageZoomModal({
  img,
  onClose,
}: {
  img: ExpImage;
  onClose: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!mounted) return null;

  // Portal to document.body — escape PageEntrance's transform/filter context
  // that would otherwise trap `position: fixed` to the wrapper instead of viewport.
  return createPortal(
    <>
      {/* Full-screen backdrop — handles click-to-close + dim overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Content frame — zoom + pan area. Backdrop click still closes;
          we wrap the actual image surface so wheel/pinch are captured there.
          The X close is hidden on mobile per spec (tap backdrop to close);
          wheel zoom on desktop and pinch zoom on touch are handled by the
          react-zoom-pan-pinch wrapper. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[121] flex flex-col items-center justify-center gap-3 p-4 sm:p-10"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        {/* X close — DESKTOP ONLY. Mobile: tap backdrop or pinch out. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 z-10 hidden h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:grid sm:right-8 sm:top-8"
        >
          <X className="h-5 w-5" />
        </button>
        {/* Mobile hint pill — bottom centre, explains tap to close */}
        <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-white/70 backdrop-blur sm:hidden">
          Pinch · Tap để đóng
        </p>
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex w-full max-w-5xl flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={5}
            doubleClick={{ mode: "toggle", step: 1.5 }}
            wheel={{ step: 0.05 }}
            pinch={{ step: 2 }}
            limitToBounds={true}
            centerOnInit
          >
            <TransformComponent
              wrapperClass="!w-full !max-h-[80vh] cursor-grab active:cursor-grabbing"
              contentClass="!w-full"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={1600}
                height={1200}
                sizes="(max-width: 768px) 92vw, (max-width: 1280px) 80vw, 80rem"
                className="block h-auto max-h-[80vh] w-full select-none rounded-2xl object-contain"
                priority
                draggable={false}
              />
            </TransformComponent>
          </TransformWrapper>
          <p className="mt-3 max-w-full text-center text-xs text-white/80 sm:text-sm">
            {img.alt}
          </p>
        </motion.div>
      </motion.div>
    </>,
    document.body,
  );
}
