"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Trophy, X, ZoomIn, Award, Medal } from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";
import { useLocale } from "@/lib/i18n/provider";
import { caseStudies, type CaseStudy } from "@/lib/content/case-studies";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnimatedEyebrow } from "@/components/animations/animated-eyebrow";
import { SectionSpotlight } from "@/components/site/section-spotlight";
import { LetterReveal } from "@/components/animations/letter-reveal";
import { ImageGlow } from "@/components/animations/image-glow";
import { Tilt } from "@/components/animations/tilt";

const accentText: Record<string, string> = {
  orange: "text-brand-orange",
  blue: "text-brand-blue",
  amber: "text-brand-orange",
  primary: "text-foreground",
};

const accentBorder: Record<string, string> = {
  orange: "hover:border-brand-orange/60",
  blue: "hover:border-brand-blue/60",
  amber: "hover:border-brand-orange/40",
  primary: "hover:border-foreground/30",
};

const accentRing: Record<string, string> = {
  orange: "ring-brand-orange/40",
  blue: "ring-brand-blue/40",
  amber: "ring-brand-orange/40",
  primary: "ring-foreground/30",
};

const accentBg: Record<string, string> = {
  orange: "bg-brand-orange/10",
  blue: "bg-brand-blue/10",
  amber: "bg-brand-orange/10",
  primary: "bg-foreground/10",
};

export function Work() {
  const { locale } = useLocale();
  const [zoomImg, setZoomImg] = React.useState<{ src: string; alt: string } | null>(null);
  const onZoom = React.useCallback(
    (src: string, alt: string) => setZoomImg({ src, alt }),
    [],
  );

  return (
    <section id="work" className="relative">
      {/* The sticky-scroll studio kept locking up scroll even on machines
          we classified as "full" - navigator.hardwareConcurrency reports 8
          for an i7-7th gen desktop, so a profile guard wasn't catching it.
          Use the stacked layout for everyone; it's still the original
          cinematic content (giant index, big card, metrics block) just
          scrolled natively one after another instead of pinned + cross-
          faded. WorkStudioReveal stays in the file in case we ever want
          to bring the sticky version back behind an explicit opt-in. */}
      <WorkStackedFallback locale={locale} onZoom={onZoom} />

      <WorkZoomModal img={zoomImg} onClose={() => setZoomImg(null)} />
    </section>
  );
}

function WorkStackedFallback({
  locale,
  onZoom,
}: {
  locale: "vi" | "en";
  onZoom: (src: string, alt: string) => void;
}) {
  return (
    <>
      <MobileWorkHeader locale={locale} />
      <div className="container-px mx-auto flex max-w-3xl flex-col gap-10 pb-16">
        {caseStudies.map((cs, i) => (
          <MobileContestCard
            key={cs.slug}
            cs={cs}
            index={i + 1}
            locale={locale}
            onZoom={onZoom}
          />
        ))}
      </div>
    </>
  );
}

function WorkZoomModal({
  img,
  onClose,
}: {
  img: { src: string; alt: string } | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!img) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [img, onClose]);

  if (!mounted) return null;

  // Portal to document.body — same reason as ImageZoomModal in process.tsx:
  // PageEntrance applies transform/filter → traps position:fixed otherwise.
  return createPortal(
    <AnimatePresence>
      {img && (
        <>
          {/* Full-screen backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />
          {/* Content frame — zoom + pan via TransformWrapper. X hidden on mobile. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[131] flex flex-col items-center justify-center p-4 sm:p-10"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-6 top-6 z-10 hidden h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:grid sm:right-8 sm:top-8"
            >
              <X className="h-5 w-5" />
            </button>
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
                  wrapperClass="!w-full !max-h-[85vh] cursor-grab active:cursor-grabbing"
                  contentClass="!w-full"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={1600}
                    height={1200}
                    sizes="(max-width: 768px) 92vw, (max-width: 1280px) 80vw, 80rem"
                    className="block h-auto max-h-[85vh] w-full select-none rounded-2xl object-contain"
                    draggable={false}
                  />
                </TransformComponent>
              </TransformWrapper>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─────────────────────────────────────────────────────────────
// WorkStudioReveal — Cinematic sticky-scroll storytelling
//
//  Concept: when user scrolls into this area, the viewport "pins"
//  (sticky position) and becomes a "studio" — a focused space where
//  contests reveal one by one as scroll progresses. After all 4
//  contests are shown, the pin releases and normal scroll resumes.
//
//  Total scroll budget: 5 viewports = 500vh
//   - 0-20% : intro splash ("Bước vào hall of trophies")
//   - 20-40%: contest 1
//   - 40-60%: contest 2
//   - 60-80%: contest 3
//   - 80-100%: contest 4
// ─────────────────────────────────────────────────────────────

// Compact category labels per case-study (override the verbose ones)
const CATEGORY_SHORT: Record<string, { vi: string; en: string }> = {
  "startup-zone-2025": { vi: "Khởi nghiệp", en: "Startup" },
  "techseed-2025": { vi: "Công nghệ", en: "Tech" },
  "giai-ma-ma-tran-nhan-su": { vi: "Nhân sự", en: "HR" },
  "hr-evolve": { vi: "Talent", en: "Talent" },
};

// 6 floating accent orbs — atmospheric depth for the studio background.
// Positions and timings are deterministic (no Math.random) for SSR stability.
const STUDIO_ORBS = [
  { left: "8%", top: "18%", size: 280, accent: "orange", dur: 22 },
  { left: "82%", top: "22%", size: 320, accent: "blue", dur: 26 },
  { left: "16%", top: "68%", size: 240, accent: "blue", dur: 19 },
  { left: "78%", top: "72%", size: 300, accent: "orange", dur: 24 },
  { left: "48%", top: "45%", size: 380, accent: "orange", dur: 28 },
  { left: "4%", top: "42%", size: 200, accent: "blue", dur: 21 },
] as const;

const SIDE_NAV_ITEMS = [
  { vi: "Intro", en: "Intro" },
  { vi: "Khởi nghiệp", en: "Startup" },
  { vi: "Công nghệ", en: "Tech" },
  { vi: "Nhân sự", en: "HR" },
  { vi: "Talent", en: "Talent" },
];

function WorkStudioReveal({
  locale,
  onZoom,
}: {
  locale: "vi" | "en";
  onZoom: (src: string, alt: string) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Smooth out scroll for buttery transitions
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    mass: 0.5,
  });

  // Intro panel: visible 0-18%, fades out 18-22%
  const introOpacity = useTransform(progress, [0, 0.16, 0.22], [1, 1, 0]);
  const introScale = useTransform(progress, [0, 0.22], [1, 0.9]);
  const introY = useTransform(progress, [0, 0.22], [0, -40]);

  // Each contest: visible in its own scroll slot, crossfades to next
  const c1Opacity = useTransform(progress, [0.18, 0.22, 0.38, 0.42], [0, 1, 1, 0]);
  const c2Opacity = useTransform(progress, [0.38, 0.42, 0.58, 0.62], [0, 1, 1, 0]);
  const c3Opacity = useTransform(progress, [0.58, 0.62, 0.78, 0.82], [0, 1, 1, 0]);
  const c4Opacity = useTransform(progress, [0.78, 0.82, 0.98, 1.0], [0, 1, 1, 1]);
  const contestOpacities = [c1Opacity, c2Opacity, c3Opacity, c4Opacity];

  // Subtle y movement: drift up as enter, drift further as exit.
  // c4 is the LAST contest — no next panel to transition to, so it eases
  // in then HOLDS centered (y=0). Otherwise it shifts -30 at the end and
  // creates a bottom black gap as the panel rises out of viewport.
  const c1Y = useTransform(progress, [0.18, 0.42], [40, -30]);
  const c2Y = useTransform(progress, [0.38, 0.62], [40, -30]);
  const c3Y = useTransform(progress, [0.58, 0.82], [40, -30]);
  const c4Y = useTransform(progress, [0.78, 0.85, 1.0], [40, 0, 0]);
  const contestYs = [c1Y, c2Y, c3Y, c4Y];

  // Image parallax INSIDE each panel — image grows slightly + drifts
  const c1ImgScale = useTransform(progress, [0.22, 0.3, 0.38], [0.94, 1, 1.04]);
  const c2ImgScale = useTransform(progress, [0.42, 0.5, 0.58], [0.94, 1, 1.04]);
  const c3ImgScale = useTransform(progress, [0.62, 0.7, 0.78], [0.94, 1, 1.04]);
  const c4ImgScale = useTransform(progress, [0.82, 0.9, 0.98], [0.94, 1, 1.04]);
  const imgScales = [c1ImgScale, c2ImgScale, c3ImgScale, c4ImgScale];

  // pointer-events follow opacity — without this, all 4 panels overlap at z-10
  // and the LAST panel (#4) in DOM order catches every click regardless of
  // which contest is visible. Result: clicking any image opened #4's zoom.
  const c1Pointer = useTransform(c1Opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const c2Pointer = useTransform(c2Opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const c3Pointer = useTransform(c3Opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const c4Pointer = useTransform(c4Opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const contestPointers = [c1Pointer, c2Pointer, c3Pointer, c4Pointer];

  // Background darkness — deeper as scroll enters studio, then fades earlier
  // so the bottom of viewport blends with the next section instead of feeling
  // like an empty black void at the end of contest #4.
  const studioDimOpacity = useTransform(progress, [0, 0.1, 0.85, 1], [0, 1, 1, 0.15]);

  // ─── Cinematic letterbox bars (top + bottom) ───
  const letterboxOpacity = useTransform(progress, [0.02, 0.1, 0.92, 0.99], [0, 1, 1, 0]);
  const letterboxHeight = useTransform(
    progress,
    [0.02, 0.12, 0.92, 1],
    ["0vh", "7vh", "7vh", "0vh"],
  );

  return (
    <>
      {/* DESKTOP / TABLET — sticky studio mode */}
      <div
        ref={containerRef}
        className="relative hidden md:block"
        style={{ height: "500vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* ░░░ Studio backdrop — dims surrounding context ░░░ */}
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)",
              opacity: studioDimOpacity,
            }}
          />

          {/* ░░░ 6 Floating accent orbs — atmospheric depth ░░░ */}
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0 overflow-hidden"
            style={{ opacity: studioDimOpacity }}
          >
            {STUDIO_ORBS.map((o, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: o.left,
                  top: o.top,
                  width: `${o.size}px`,
                  height: `${o.size}px`,
                  background: `radial-gradient(circle, ${
                    o.accent === "orange"
                      ? "rgba(255,122,26,0.4)"
                      : "rgba(47,125,255,0.4)"
                  } 0%, transparent 60%)`,
                  filter: "blur(70px)",
                  opacity: 0.4,
                }}
                animate={{
                  x: [0, 40, -25, 15, 0],
                  y: [0, -30, 25, -10, 0],
                  scale: [1, 1.12, 0.94, 1.06, 1],
                }}
                transition={{
                  duration: o.dur,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>

          {/* ░░░ Stage spotlight — soft warm glow from top center ░░░ */}
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-0 z-0 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,122,26,0.14), rgba(47,125,255,0.08), transparent 70%)",
              filter: "blur(60px)",
              opacity: studioDimOpacity,
            }}
          />

          {/* ░░░ Wireframe grid pattern — subtle "studio floor" ░░░ */}
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{
              opacity: useTransform(studioDimOpacity, (v) => v * 0.4),
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(ellipse 70% 50% at 50% 100%, black 0%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 50% at 50% 100%, black 0%, transparent 80%)",
            }}
          />

          {/* Letterbox bars removed — they showed up as a solid-black gap at the
              bottom that looked like missing background while scrolling into the
              intro. The studio dim radial gradient still provides cinema feel. */}

          {/* ─── Vertical side-nav indicator (left side, desktop only) ─── */}
          <SideNavIndicator progress={progress} locale={locale} />

          {/* ─── INTRO panel — full section header inside studio ─── */}
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
            style={{
              opacity: introOpacity,
              scale: introScale,
              y: introY,
            }}
          >
            {/* Section number + accent line */}
            <p className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-brand-orange">
              <span className="h-px w-12 bg-brand-orange/60" />
              <span className="font-bold">04</span>
              <span>·</span>
              <span>{locale === "vi" ? "Thành tích" : "Achievements"}</span>
              <span className="h-px w-12 bg-brand-orange/60" />
            </p>

            {/* Big "HALL OF TROPHIES" — cinematic gateway */}
            <h2
              className="font-display font-extrabold leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
            >
              <span className="text-brand-orange">HALL</span>{" "}
              <span className="text-foreground">OF</span>{" "}
              <span className="text-brand-blue">TROPHIES</span>
            </h2>

            {/* Subtitle — original "4 cuộc thi · 4 cột mốc" treatment */}
            <p
              className="mt-5 font-display font-semibold tracking-tight text-foreground/80"
              style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
            >
              {locale === "vi"
                ? "4 cuộc thi · 4 cột mốc."
                : "4 contests · 4 milestones."}
            </p>

            {/* Categories tagline */}
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {locale === "vi"
                ? "Khởi nghiệp · Công nghệ · Nhân sự · Talent — mỗi danh hiệu là một bài học khác về làm việc nhóm, áp lực và pitching."
                : "Startup · Tech · HR · Talent — each title is a different lesson on teamwork, pressure, and pitching."}
            </p>

            {/* Scroll indicator */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              ↓ {locale === "vi" ? "Cuộn để khám phá" : "Scroll to enter"}
            </motion.div>
          </motion.div>

          {/* ─── 4 contest panels — crossfade based on scroll ─── */}
          {caseStudies.map((cs, i) => (
            <motion.div
              key={cs.slug}
              className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10 md:pl-32 md:pr-16"
              style={{
                opacity: contestOpacities[i],
                y: contestYs[i],
                pointerEvents: contestPointers[i],
              }}
            >
              <BigContestStage
                cs={cs}
                index={i + 1}
                locale={locale}
                onZoom={onZoom}
                imgScale={imgScales[i]}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* MOBILE — cinematic vertical stack with proper section header */}
      <div className="md:hidden">
        <MobileWorkHeader locale={locale} />
        <div className="container-px mx-auto flex max-w-3xl flex-col gap-10 pb-16">
          {caseStudies.map((cs, i) => (
            <MobileContestCard
              key={cs.slug}
              cs={cs}
              index={i + 1}
              locale={locale}
              onZoom={onZoom}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MobileWorkHeader — Section title block visible on mobile only
// Desktop has intro inside studio, mobile needs equivalent context
// ─────────────────────────────────────────────────────────────
function MobileWorkHeader({ locale }: { locale: "vi" | "en" }) {
  return (
    <div className="container-px mx-auto relative max-w-3xl py-20 text-center overflow-hidden">
      {/* Atmospheric orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[20%] -z-10 h-64 w-64 rounded-full bg-brand-orange/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[40%] -z-10 h-64 w-64 rounded-full bg-brand-blue/15 blur-3xl"
      />

      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, scaleX: 0.6 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7 }}
        className="mb-4 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-brand-orange"
      >
        <span className="h-px w-10 bg-brand-orange/60" />
        <span className="font-bold">04</span>
        <span className="opacity-60">·</span>
        <span>{locale === "vi" ? "Thành tích" : "Achievements"}</span>
        <span className="h-px w-10 bg-brand-orange/60" />
      </motion.p>

      {/* HALL OF TROPHIES — staggered letter reveal */}
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="font-display font-extrabold leading-[0.92] tracking-tight"
        style={{ fontSize: "clamp(2.25rem, 11vw, 3.5rem)" }}
      >
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-brand-orange"
        >
          HALL
        </motion.span>{" "}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-foreground"
        >
          OF
        </motion.span>{" "}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-brand-blue"
        >
          TROPHIES
        </motion.span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="mt-5 font-display font-semibold tracking-tight text-foreground/80"
        style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
      >
        {locale === "vi" ? "4 cuộc thi · 4 cột mốc." : "4 contests · 4 milestones."}
      </motion.p>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
      >
        {locale === "vi"
          ? "Khởi nghiệp · Công nghệ · Nhân sự · Talent — mỗi danh hiệu là một bài học khác."
          : "Startup · Tech · HR · Talent — each title is a different lesson."}
      </motion.p>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-10 flex flex-col items-center gap-2"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          ↓ {locale === "vi" ? "Khám phá" : "Explore"}
        </motion.span>
        <span className="h-8 w-px bg-gradient-to-b from-brand-orange via-foreground/40 to-transparent" />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MobileContestCard — scroll-driven cinematic reveal per card
// Wraps BigContestStage with parallax image scale + entrance anim
// ─────────────────────────────────────────────────────────────
function MobileContestCard({
  cs,
  index,
  locale,
  onZoom,
}: {
  cs: CaseStudy;
  index: number;
  locale: "vi" | "en";
  onZoom: (src: string, alt: string) => void;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  // Parallax: image scales slightly larger as user scrolls past it
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.02, 0.98]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.08,
      }}
    >
      {/* Number ribbon prefix above each card — connects them visually */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-4 flex items-center gap-3"
      >
        <span
          className={cn(
            "font-mono text-[10px] font-bold uppercase tracking-[0.3em]",
            cs.accent === "blue" ? "text-brand-blue" : "text-brand-orange",
          )}
        >
          #{String(index).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "h-px flex-1",
            cs.accent === "blue" ? "bg-brand-blue/40" : "bg-brand-orange/40",
          )}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {CATEGORY_SHORT[cs.slug]?.[locale] ?? cs.category}
        </span>
      </motion.div>

      <BigContestStage
        cs={cs}
        index={index}
        locale={locale}
        onZoom={onZoom}
        mobile
        imgScale={imgScale}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SideNavIndicator — vertical 5-dot indicator on LEFT, with labels
// Active dot is highlighted + label fades in
// ─────────────────────────────────────────────────────────────
function SideNavIndicator({
  progress,
  locale,
}: {
  progress: ReturnType<typeof useSpring>;
  locale: "vi" | "en";
}) {
  // Map progress to active step (0-4)
  // 0-0.2 = intro (0), 0.2-0.4 = contest 1, etc.
  const step0Active = useTransform(progress, [0, 0.16], [1, 0]);
  const step1Active = useTransform(progress, [0.18, 0.22, 0.38, 0.42], [0, 1, 1, 0]);
  const step2Active = useTransform(progress, [0.38, 0.42, 0.58, 0.62], [0, 1, 1, 0]);
  const step3Active = useTransform(progress, [0.58, 0.62, 0.78, 0.82], [0, 1, 1, 0]);
  const step4Active = useTransform(progress, [0.78, 0.82, 1], [0, 1, 1]);
  const stepActives = [step0Active, step1Active, step2Active, step3Active, step4Active];

  // Vertical fill line
  const fillScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <div className="relative">
        {/* Background vertical line */}
        <div className="absolute left-[5px] top-0 h-full w-px bg-border/50" />
        {/* Filled progress line — gradient cam→xanh */}
        <motion.div
          className="absolute left-[5px] top-0 w-px origin-top bg-gradient-to-b from-brand-orange via-foreground to-brand-blue"
          style={{ scaleY: fillScale, height: "100%" }}
        />
        {/* 5 step rows */}
        <div className="relative flex flex-col gap-12">
          {SIDE_NAV_ITEMS.map((item, i) => (
            <SideNavStep
              key={i}
              index={i}
              label={item[locale]}
              active={stepActives[i]}
              isIntro={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SideNavStep({
  index,
  label,
  active,
  isIntro,
}: {
  index: number;
  label: string;
  active: ReturnType<typeof useTransform<number, number>>;
  isIntro: boolean;
}) {
  const dotScale = useTransform(active, [0, 1], [1, 1.6]);
  const labelOpacity = useTransform(active, [0, 1], [0.35, 1]);
  const labelX = useTransform(active, [0, 1], [-8, 0]);

  return (
    <div className="flex items-center gap-4">
      <motion.span
        className="block h-[11px] w-[11px] rounded-full"
        style={{
          scale: dotScale,
          background: isIntro
            ? "var(--color-muted-foreground)"
            : "linear-gradient(135deg, var(--brand-orange), var(--brand-blue))",
          boxShadow: useTransform(
            active,
            [0, 1],
            ["0 0 0 transparent", "0 0 16px var(--brand-orange)"],
          ),
        }}
      />
      <motion.div
        className="flex flex-col gap-0.5"
        style={{ opacity: labelOpacity, x: labelX }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
          {isIntro ? "00" : `0${index}`}
        </p>
        <p className="whitespace-nowrap font-display text-sm font-semibold text-foreground">
          {label}
        </p>
      </motion.div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// BigContestStage — cinematic full-viewport card for "studio" mode
// Image left, content right. Clean editorial layout. Mobile stacks.
// ─────────────────────────────────────────────────────────────
function BigContestStage({
  cs,
  index,
  locale,
  onZoom,
  mobile = false,
  imgScale,
}: {
  cs: CaseStudy;
  index: number;
  locale: "vi" | "en";
  onZoom: (src: string, alt: string) => void;
  mobile?: boolean;
  imgScale?: ReturnType<typeof useTransform<number, number>>;
}) {
  const isOrange = cs.accent === "orange" || cs.accent === "amber";
  const accentRGB = isOrange ? "255,122,26" : "47,125,255";
  const accentTextCls = isOrange ? "text-brand-orange" : "text-brand-blue";
  const accentBgCls = isOrange ? "bg-brand-orange" : "bg-brand-blue";
  const category = CATEGORY_SHORT[cs.slug]?.[locale] ?? cs.category;

  return (
    <div
      className={cn(
        "w-full max-w-6xl",
        mobile
          ? "grid grid-cols-1 gap-5"
          : "grid min-h-[72vh] items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14",
      )}
    >
      {/* ─── IMAGE side (with scroll-driven parallax scale + cursor-tilt 3D) ─── */}
      {cs.image && (
        <Tilt max={8} glare className="w-full rounded-3xl">
        <motion.button
          type="button"
          onClick={() => cs.image && onZoom(cs.image, cs.imageAlt ?? cs.title.en)}
          className="group relative block w-full overflow-hidden rounded-3xl bg-background"
          aria-label={`Zoom ${cs.title[locale]}`}
          style={{
            aspectRatio: cs.imageAspect ?? (mobile ? "4/3" : "5/4"),
            boxShadow: `0 40px 100px -20px rgba(${accentRGB},0.4), 0 0 0 1px rgba(${accentRGB},0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`,
            scale: imgScale,
          }}
        >
          <Image
            src={cs.image}
            alt={cs.imageAlt ?? cs.title.en}
            fill
            sizes={mobile ? "100vw" : "(max-width: 1024px) 100vw, 600px"}
            className="object-contain transition-all duration-700 group-hover:brightness-110"
          />
          {/* Zoom hint */}
          <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </div>
          {/* Subtle gradient overlay bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {/* Cinematic corner brackets */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2"
            style={{ borderColor: `rgba(${accentRGB},0.5)` }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-b-2 border-r-2"
            style={{ borderColor: `rgba(${accentRGB},0.5)` }}
          />
        </motion.button>
        </Tilt>
      )}

      {/* ─── CONTENT side ─── */}
      <div className="flex flex-col gap-4 lg:gap-5">
        {/* MASSIVE Index # + Category in vertical hero treatment */}
        <div className="flex items-baseline gap-5">
          <div className="relative">
            <motion.span
              {...(mobile && {
                initial: { opacity: 0, scale: 0.5, rotate: -8 },
                whileInView: { opacity: 1, scale: 1, rotate: 0 },
                viewport: { once: true, margin: "-60px" },
                transition: {
                  duration: 0.9,
                  delay: 0.15,
                  type: "spring",
                  stiffness: 160,
                  damping: 14,
                },
              })}
              className={cn(
                "block font-display font-black leading-none tracking-tighter pb-1",
                accentTextCls,
              )}
              style={{
                fontSize: mobile
                  ? "clamp(3rem, 12vw, 5rem)"
                  : "clamp(4rem, 9vw, 8rem)",
                background: `linear-gradient(135deg, ${
                  isOrange
                    ? "var(--brand-orange) 0%, rgba(255,122,26,0.4) 100%"
                    : "var(--brand-blue) 0%, rgba(47,125,255,0.4) 100%"
                })`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 8px 20px rgba(${accentRGB},0.3))`,
              }}
            >
              {String(index).padStart(2, "0")}
            </motion.span>
            {/* Decorative # prefix above */}
            <span
              className={cn(
                "absolute -top-3 -left-2 font-mono text-xs font-bold uppercase tracking-wider",
                accentTextCls,
              )}
              style={{ opacity: 0.5 }}
            >
              #
            </span>
          </div>

          <motion.div
            {...(mobile && {
              initial: { opacity: 0, x: -12 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.6, delay: 0.35 },
            })}
            className="flex flex-col gap-1"
          >
            <p
              className={cn(
                "font-mono text-xs font-semibold uppercase tracking-[0.3em]",
                accentTextCls,
              )}
            >
              {category}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {cs.client} · {cs.year}
            </p>
          </motion.div>
        </div>

        {/* Hairline divider with accent dot */}
        <motion.div
          {...(mobile && {
            initial: { opacity: 0, scaleX: 0.3 },
            whileInView: { opacity: 1, scaleX: 1 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.7, delay: 0.45 },
          })}
          className="flex items-center gap-2"
        >
          <span className={cn("h-px flex-1", accentBgCls)} style={{ opacity: 0.4 }} />
          <span className={cn("h-1.5 w-1.5 rounded-full", accentBgCls)} />
          <span className={cn("h-px flex-1", accentBgCls)} style={{ opacity: 0.4 }} />
        </motion.div>

        {/* Title — big, hero-style */}
        <motion.h3
          {...(mobile && {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
          })}
          className={cn(
            "font-display font-bold leading-[1.05] tracking-tight",
            accentTextCls,
          )}
          style={{
            fontSize: mobile
              ? "clamp(1.4rem, 5vw, 2rem)"
              : "clamp(1.75rem, 3.2vw, 2.75rem)",
          }}
        >
          {cs.title[locale]}
        </motion.h3>

        {/* Summary */}
        <motion.p
          {...(mobile && {
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.7, delay: 0.6 },
          })}
          className="text-foreground/85"
          style={{
            fontSize: mobile ? "0.875rem" : "clamp(0.95rem, 1.4vw, 1.1rem)",
            lineHeight: "1.65",
          }}
        >
          {cs.summary[locale]}
        </motion.p>

        {/* Metrics — stagger blur+scale reveal */}
        <motion.div
          {...(mobile && {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.6, delay: 0.7 },
          })}
          className="grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm"
          style={{ boxShadow: `inset 0 0 24px rgba(${accentRGB},0.06)` }}
        >
          {cs.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              {...(mobile && {
                initial: { opacity: 0, scale: 0.6, filter: "blur(8px)" },
                whileInView: {
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                },
                viewport: { once: true, margin: "-40px" },
                transition: {
                  duration: 0.7,
                  delay: 0.85 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                },
              })}
              className="text-center"
            >
              <p
                className={cn(
                  "font-display font-bold leading-tight",
                  accentTextCls,
                )}
                style={{ fontSize: mobile ? "0.95rem" : "clamp(0.95rem, 1.5vw, 1.1rem)" }}
              >
                {m.value}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                {m.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tags — stagger fade in */}
        <motion.div
          {...(mobile && {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.5, delay: 1.25 },
          })}
          className="flex flex-wrap gap-1.5"
        >
          {cs.tags.map((tag, i) => (
            <motion.span
              key={tag}
              {...(mobile && {
                initial: { opacity: 0, y: 8, scale: 0.85 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, margin: "-40px" },
                transition: {
                  duration: 0.5,
                  delay: 1.3 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                },
              })}
            >
              <Badge variant={isOrange ? "orange" : "blue"}>{tag}</Badge>
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// (deprecated — keeping the symbol for any old reference; not used in render)
function DetailNodeCard({
  cs,
  index,
  locale,
  onZoom,
}: {
  cs: CaseStudy;
  index: number;
  locale: "vi" | "en";
  onZoom: (src: string, alt: string) => void;
}) {
  const accentClr =
    cs.accent === "orange" || cs.accent === "amber"
      ? "var(--brand-orange)"
      : cs.accent === "blue"
        ? "var(--brand-blue)"
        : "var(--color-foreground)";
  const isOrange = cs.accent === "orange" || cs.accent === "amber";
  const accentRGB = isOrange ? "255,122,26" : "47,125,255";
  const accentTextCls = isOrange ? "text-brand-orange" : "text-brand-blue";
  const accentBgCls = isOrange ? "bg-brand-orange" : "bg-brand-blue";
  const category = CATEGORY_SHORT[cs.slug]?.[locale] ?? cs.category;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border bg-card/95 backdrop-blur-md transition-all"
      style={{
        width: "clamp(280px, 30vw, 380px)",
        borderColor: `rgba(${accentRGB},0.4)`,
        boxShadow: `0 0 30px rgba(${accentRGB},0.2), 0 0 60px rgba(${accentRGB},0.08)`,
      }}
    >
      {/* Top ribbon — "CHAMPION" only for #01 */}
      {index === 1 && (
        <div
          className="absolute -right-10 top-5 z-10 rotate-45 px-12 py-0.5 text-center"
          style={{
            background: `linear-gradient(to right, var(--brand-orange), var(--brand-blue))`,
          }}
        >
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-white">
            🏆 Champion
          </p>
        </div>
      )}

      {/* Image area — clickable to zoom */}
      {cs.image && (
        <button
          type="button"
          onClick={() => cs.image && onZoom(cs.image, cs.imageAlt ?? cs.title.en)}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-background"
          aria-label={`Zoom ${cs.title[locale]}`}
        >
          <Image
            src={cs.image}
            alt={cs.imageAlt ?? cs.title.en}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover transition-all duration-500 group-hover:brightness-110"
          />
          {/* Subtle gradient overlay on bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card/95 via-card/40 to-transparent" />
          {/* Index badge bottom-left ON image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <motion.span
              className={cn("block h-1.5 w-1.5 rounded-full", accentBgCls)}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ boxShadow: "0 0 10px currentColor" }}
            />
            <p
              className={cn(
                "font-mono text-[9px] font-semibold uppercase tracking-[0.25em]",
                accentTextCls,
              )}
            >
              #{String(index).padStart(2, "0")} · {category}
            </p>
          </div>
          {/* Zoom hint */}
          <div className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="h-3 w-3" />
          </div>
        </button>
      )}

      {/* Content area — tighter, cleaner */}
      <div className="space-y-2.5 p-4 sm:p-5">
        {/* Title (rank + name combined, year on right) */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "font-display font-bold leading-[1.15] tracking-tight",
              accentTextCls,
            )}
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
            }}
          >
            {cs.title[locale]}
          </h3>
          <p className="shrink-0 pt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {cs.year}
          </p>
        </div>

        {/* Divider with accent dot */}
        <div className="flex items-center gap-2">
          <span className={cn("h-px flex-1", accentBgCls)} style={{ opacity: 0.3 }} />
          <span className={cn("h-1 w-1 rounded-full", accentBgCls)} />
          <span className={cn("h-px flex-1", accentBgCls)} style={{ opacity: 0.3 }} />
        </div>

        {/* Summary */}
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {cs.summary[locale]}
        </p>

        {/* Tags only (no metrics — cleaner) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {cs.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant={isOrange ? "orange" : "blue"}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}

function ChampionCard({
  cs,
  onZoom,
}: {
  cs: CaseStudy;
  onZoom: (src: string, alt: string) => void;
}) {
  const { locale } = useLocale();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative mt-14"
    >
      {/* ✨ Floating sparkles — 5 stars scattered around card with independent floats */}
      {[
        { left: "-2%", top: "8%", delay: 0, dur: 4.2, color: "var(--brand-orange)" },
        { left: "98%", top: "20%", delay: 1.1, dur: 5.5, color: "var(--brand-blue)" },
        { left: "-1%", top: "78%", delay: 2.3, dur: 4.8, color: "var(--brand-blue)" },
        { left: "97%", top: "85%", delay: 0.6, dur: 5.2, color: "var(--brand-orange)" },
        { left: "55%", top: "-2%", delay: 1.7, dur: 4.0, color: "var(--brand-orange)" },
      ].map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute z-[5] text-2xl"
          style={{
            left: s.left,
            top: s.top,
            color: s.color,
            textShadow: `0 0 12px ${s.color}`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          whileInView={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.15, 0.9],
            y: [0, -8, -14, -20],
          }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 0.3,
            ease: "easeInOut",
          }}
        >
          ✦
        </motion.span>
      ))}

      {/* 🌅 Breathing podium glow — radial gradient underneath that pulses */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-12 -z-10 rounded-[3rem]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 70%, rgba(255,122,26,0.35), rgba(47,125,255,0.25) 45%, transparent 75%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.85, 0.5],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <article className="relative overflow-hidden rounded-3xl border border-border bg-card">
        {/* 🌈 Holographic shine sweep — diagonal light bar on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[15] overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <div
            className="absolute -inset-y-8 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            style={{ animation: "champion-shine 2.5s ease-in-out infinite" }}
          />
        </div>

      {/* 4 corner accent dots */}
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, type: "spring", stiffness: 250 }}
        className="absolute left-3 top-3 z-20 h-2 w-2 rounded-full bg-brand-orange"
        style={{ boxShadow: "0 0 10px var(--brand-orange)" }}
      />
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, type: "spring", stiffness: 250 }}
        className="absolute right-3 top-3 z-20 h-2 w-2 rounded-full bg-brand-blue"
        style={{ boxShadow: "0 0 10px var(--brand-blue)" }}
      />
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring", stiffness: 250 }}
        className="absolute bottom-3 left-3 z-20 h-2 w-2 rounded-full bg-brand-blue"
        style={{ boxShadow: "0 0 10px var(--brand-blue)" }}
      />
      <motion.span
        aria-hidden
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, type: "spring", stiffness: 250 }}
        className="absolute bottom-3 right-3 z-20 h-2 w-2 rounded-full bg-brand-orange"
        style={{ boxShadow: "0 0 10px var(--brand-orange)" }}
      />

      {/* Trophy ribbon — top-right */}
      <div className="absolute -right-12 top-8 z-20 rotate-45 bg-gradient-to-r from-brand-orange to-brand-blue px-16 py-1 text-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white">
          🏆 Champion
        </p>
      </div>

      {/* Background glow */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-px -z-10 bg-gradient-to-br opacity-60 blur-3xl",
          "from-brand-orange/30 via-transparent to-brand-blue/30",
        )}
      />

      <div className="grid lg:grid-cols-[1.2fr_1fr]">
        {/* Big hero image with parallax */}
        {cs.image && (
          <Tilt max={8} glare className="w-full lg:h-[32rem]">
          <button
            type="button"
            onClick={() => cs.image && onZoom(cs.image, cs.imageAlt ?? cs.title.en)}
            className="group relative aspect-[16/12] w-full overflow-hidden bg-background lg:aspect-auto lg:h-[32rem]"
            aria-label={`Zoom ${cs.title[locale]}`}
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-0 -top-[8%] h-[116%]"
            >
              <Image
                src={cs.image}
                alt={cs.imageAlt ?? cs.title.en}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
              <ZoomIn className="h-4 w-4" />
            </div>
          </button>
          </Tilt>
        )}

        {/* Info */}
        <div className="flex flex-col justify-center gap-5 p-7 md:p-10 lg:p-12">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-blue shadow-lg shadow-brand-orange/30">
              <Trophy className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand-orange">
                #01 · {cs.category}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {cs.client} · {cs.year}
              </p>
            </div>
          </div>

          <h3
            className="font-display font-bold tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            {cs.title[locale]}
          </h3>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {cs.summary[locale]}
          </p>

          {/* Metrics — big numbers */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-background p-5 sm:gap-4 sm:p-6">
            {cs.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <p
                  className="font-display font-bold tracking-tight"
                  style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.875rem)" }}
                >
                  <span className="gradient-text">{m.value}</span>
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {cs.tags.map((tag) => (
              <Badge key={tag} variant="orange">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      </article>

      <style jsx>{`
        @keyframes champion-shine {
          0% {
            left: -50%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            left: 150%;
            opacity: 0;
          }
        }
      `}</style>
    </motion.div>
  );
}

function SupportingCard({
  cs,
  rank,
  onZoom,
}: {
  cs: CaseStudy;
  rank: number;
  onZoom: (src: string, alt: string) => void;
}) {
  const { locale } = useLocale();
  const RankIcon = rank === 2 ? Medal : rank === 3 ? Award : Trophy;
  const glowAccent =
    cs.accent === "orange" || cs.accent === "amber" ? "orange" : cs.accent === "blue" ? "blue" : "both";

  return (
    <ImageGlow accent={glowAccent as "orange" | "blue" | "both"} intensity={0.3}>
    <Tilt max={8} glare className="h-full rounded-2xl">
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (rank - 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all hover:shadow-2xl",
        accentBorder[cs.accent],
      )}
    >
      {/* Trophy icon top-right */}
      <div className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/40 backdrop-blur">
        <RankIcon
          className={cn("h-4 w-4", accentText[cs.accent])}
          strokeWidth={2}
        />
      </div>

      {/* Rank badge top-left */}
      <div
        className={cn(
          "absolute left-4 top-4 z-10 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur",
          accentBg[cs.accent],
          accentText[cs.accent],
        )}
      >
        #0{rank}
      </div>

      {/* Image */}
      {cs.image && (
        <button
          type="button"
          onClick={() => cs.image && onZoom(cs.image, cs.imageAlt ?? cs.title.en)}
          className="relative aspect-[4/3] w-full overflow-hidden bg-background"
          aria-label={`Zoom ${cs.title[locale]}`}
        >
          <Image
            src={cs.image}
            alt={cs.imageAlt ?? cs.title.en}
            fill
            sizes="(max-width: 1024px) 50vw, 30vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.2em]",
              accentText[cs.accent],
            )}
          >
            {cs.category} · {cs.year}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-tight tracking-tight">
            {cs.title[locale]}
          </h3>
        </div>

        {/* Mini metrics */}
        <div
          className={cn(
            "grid grid-cols-3 gap-2 rounded-xl border border-border bg-background p-3 ring-1",
            accentRing[cs.accent],
          )}
        >
          {cs.metrics.map((m) => (
            <div key={m.label} className="min-w-0">
              <p
                className={cn(
                  "font-display font-bold tracking-tight",
                  accentText[cs.accent],
                )}
                style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)" }}
              >
                {m.value}
              </p>
              <p className="mt-0.5 truncate text-[9px] uppercase tracking-wider text-muted-foreground">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {cs.summary[locale]}
        </p>
      </div>
    </motion.article>
    </Tilt>
    </ImageGlow>
  );
}
