"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLowEndDevice } from "@/lib/hooks/use-low-end-device";

const STORAGE_KEY = "portfolio-preloader-seen";
// Cinematic act timings (fixed):
const ACT2_AT = 500; // stars converge
const ACT3_AT = 1600; // GO BIG appears + progress bar fills
// Real-load gate timings:
const MIN_HOLD_MS = 2500; // never exit faster than 2.5s
const MAX_HOLD_MS = 8000; // never block past 8s even if load stalls
const STABLE_POLLS = 2; // image count must stay still for 2 polls before we trust it
const FINAL_FLASH_MS = 600; // exit animation duration

/**
 * Cinematic preloader that waits for the actual page load before revealing.
 *
 * Previous version exited on a fixed 3.2s timer regardless of whether the
 * page was ready. On mobile that meant the preloader stepped aside while
 * images, fonts, and JS chunks were still streaming, so the user saw
 * elements jumping into place as they scrolled - the "load không hết"
 * report.
 *
 * Now the exit is gated by THREE conditions, all of which must be true:
 *   1) Cinematic acts have played past Act 3 (so the brand reveal lands).
 *   2) Minimum hold time has elapsed (so it doesn't flash by on fast networks).
 *   3) The page is actually ready: window load fired AND fonts loaded.
 * A failsafe maximum hold of 7s guarantees we never trap the user if
 * something stalls (slow third-party script, broken image, etc.).
 *
 * Progress bar reflects real image-load progress so the user has a hint
 * of why we're waiting rather than just a sitting-there bar.
 */
export function Preloader() {
  const lite = useLowEndDevice();
  const [visible, setVisible] = React.useState(true);
  const [phase, setPhase] = React.useState<1 | 2 | 3 | 4>(1);
  const [progress, setProgress] = React.useState(0); // 0..1 image-load progress
  const [stars, setStars] = React.useState<
    Array<{ id: number; tx: number; ty: number; delay: number; size: number; color: string }>
  >([]);

  React.useEffect(() => {
    // Already-seen this session -> reveal page immediately (no second tax)
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setVisible(false);
      return;
    }

    // Low-end devices skip the cinematic entirely.
    if (lite) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    // Build star field. 80 desktop / 40 mobile - same as before.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const starCount = isMobile ? 40 : 80;
    setStars(
      Array.from({ length: starCount }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 80;
        const colorRand = Math.random();
        const color =
          colorRand < 0.35
            ? "rgba(255,122,26,0.95)"
            : colorRand < 0.7
              ? "rgba(47,125,255,0.95)"
              : "rgba(255,255,255,0.95)";
        return {
          id: i,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          delay: Math.random() * 0.6,
          size: 0.8 + Math.random() * 2,
          color,
        };
      }),
    );

    const startedAt = performance.now();

    // Cinematic phases on a fixed schedule.
    const t2 = window.setTimeout(() => setPhase(2), ACT2_AT);
    const t3 = window.setTimeout(() => setPhase(3), ACT3_AT);

    // Track actual page-load completion.
    let windowLoaded = document.readyState === "complete";
    let fontsLoaded = false;

    const onLoad = () => {
      windowLoaded = true;
    };
    if (!windowLoaded) {
      window.addEventListener("load", onLoad, { once: true });
    }

    if (
      typeof document !== "undefined" &&
      (document as Document & { fonts?: FontFaceSet }).fonts
    ) {
      (document as Document & { fonts: FontFaceSet }).fonts.ready
        .then(() => {
          fontsLoaded = true;
        })
        .catch(() => {
          // No-op: if Font Loading API errors, we still exit on the other gates.
          fontsLoaded = true;
        });
    } else {
      fontsLoaded = true;
    }

    // Force ALL images in the document to load eagerly. Next/Image defaults
    // to lazy via IntersectionObserver - which means below-fold images never
    // start fetching until the user scrolls into them. Without this step the
    // preloader thinks "all images complete" the moment Hero portrait lands,
    // exits, and the user sees the rest of the page populating + shifting
    // as they scroll down. Calling this on every poll catches any new images
    // React mounts after the first frame.
    const forceEager = () => {
      const imgs = document.querySelectorAll<HTMLImageElement>("img");
      imgs.forEach((img) => {
        if (img.loading === "lazy") {
          img.loading = "eager";
          // fetchpriority hint - some browsers honour this for the queue order.
          img.setAttribute("fetchpriority", "high");
        }
      });
    };
    forceEager();

    // Track image-count stability so we don't exit while React is still
    // mounting more <img> nodes.
    let lastImgCount = -1;
    let stablePolls = 0;

    // Single gate ticker: every 200ms (a) force eager on any new images,
    // (b) update progress, (c) decide whether to exit.
    const gateTimer = window.setInterval(() => {
      forceEager();

      const all = Array.from(document.images);
      const total = all.length;
      // img.complete is true after both successful loads AND failed loads
      // (404, decode error). Counting both keeps the gate from waiting on
      // an asset that will never resolve. If naturalWidth > 0 we know it
      // actually decoded; if it's a failed image we still mark "attempted".
      const done = all.filter((img) => img.complete).length;
      setProgress(total > 0 ? done / total : 0);

      // Image count stability: only trust "all done" if the total has been
      // unchanged for at least STABLE_POLLS in a row.
      if (total === lastImgCount) {
        stablePolls++;
      } else {
        stablePolls = 0;
        lastImgCount = total;
      }
      const stable = stablePolls >= STABLE_POLLS;
      const allImagesLoaded = total > 0 && done === total;

      const elapsed = performance.now() - startedAt;
      const ready = windowLoaded && fontsLoaded && allImagesLoaded && stable;
      const minHeld = elapsed >= MIN_HOLD_MS;
      const maxHeld = elapsed >= MAX_HOLD_MS;

      if ((ready && minHeld) || maxHeld) {
        setPhase(4);
        // Fire-and-forget cleanup; the AnimatePresence exit handles fade.
        window.setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem(STORAGE_KEY, "1");
        }, FINAL_FLASH_MS);
        window.clearInterval(gateTimer);
      }
    }, 200);

    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearInterval(gateTimer);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
  }, [lite]);

  // Failsafe: if visible flips false for any reason, unlock scroll.
  React.useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.5,
            filter: "blur(25px)",
          }}
          transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
          className="fixed inset-0 z-[300] grid place-items-center overflow-hidden bg-black"
          style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
          aria-hidden
        >
          {/* Act 1 — Ignition: scanline + initial spark */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 h-[1px] w-[80vw] -translate-x-1/2 -translate-y-1/2 origin-center bg-white"
            style={{ boxShadow: "0 0 12px rgba(255,255,255,0.9)" }}
          />

          {/* Act 2+ — Stars converging inward */}
          {phase >= 2 && (
            <div className="absolute inset-0">
              {stars.map((s) => (
                <span
                  key={s.id}
                  className="collapse-star"
                  style={
                    {
                      "--tx": `${s.tx}vw`,
                      "--ty": `${s.ty}vh`,
                      "--delay": `${s.delay}s`,
                      "--size": `${s.size}px`,
                      "--color": s.color,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          )}

          {/* Subtle ambient gradient backdrop (appears Act 2 onwards) */}
          {phase >= 2 && (
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 3 ? 0.5 : 0.2 }}
              transition={{ duration: 1.2 }}
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at center, rgba(255,122,26,0.15) 0%, rgba(47,125,255,0.1) 50%, transparent 80%)",
              }}
            />
          )}

          {/* CRT scanlines (subtle, ambient) */}
          {phase >= 2 && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
              }}
            />
          )}

          {/* Act 3 — Text materializes + loading bar starts in parallel */}
          {phase >= 3 && (
            <div className="relative z-10 text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 font-mono text-[10px] uppercase tracking-[0.45em] text-white/55 sm:text-xs"
              >
                ▸ Welcome to Nam&apos;s universe
              </motion.p>

              <h1 className="font-display font-extrabold leading-[0.95] tracking-tight">
                <MaterializedLine
                  text="GO BIG"
                  color="text-go-big"
                  delay={0.15}
                  size="clamp(2.5rem, 8vw, 6rem)"
                  glow="rgba(255,122,26,0.7)"
                />
                <MaterializedLine
                  text="OR"
                  color="text-go-or"
                  delay={0.5}
                  size="clamp(1.25rem, 3.5vw, 2.5rem)"
                  glow="rgba(255,255,255,0.7)"
                />
                <MaterializedLine
                  text="GO HOME."
                  color="text-go-home"
                  delay={0.75}
                  size="clamp(2.5rem, 8vw, 6rem)"
                  glow="rgba(47,125,255,0.7)"
                />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="mt-8 font-mono text-[10px] uppercase tracking-[0.45em] text-white/50"
              >
                Lê Phương Nam · Account Intern
              </motion.p>
            </div>
          )}

          {/* Loading bar (Act 3+) — width follows real image-load progress.
              clamp(0.05) so the bar always shows a sliver even on first
              paint (otherwise it looks broken). */}
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-[12vh] left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/55">
                  00
                </span>
                <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full origin-left"
                    style={{
                      width: "100%",
                      transform: `scaleX(${Math.max(0.02, progress)})`,
                      transition: "transform 0.3s ease-out",
                      background:
                        "linear-gradient(to right, #ff7a1a, #ffffff, #2f7dff)",
                      boxShadow: "0 0 14px rgba(255,122,26,0.9)",
                    }}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/55">
                  {Math.round(progress * 100)
                    .toString()
                    .padStart(3, "0")}
                </span>
              </div>
            </motion.div>
          )}

          {/* Act 4 — Liftoff: expanding rings + final white flash */}
          {phase >= 4 && (
            <>
              <motion.div
                aria-hidden
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 10, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.6, 1] }}
                className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              />
              <motion.div
                aria-hidden
                initial={{ scale: 0.3, opacity: 0.7 }}
                animate={{ scale: 14, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.6, 1] }}
                className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-orange"
              />

              {/* Final white flash */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 bg-white"
              />
            </>
          )}

          <style jsx>{`
            .collapse-star {
              position: absolute;
              top: 50%;
              left: 50%;
              width: var(--size);
              height: var(--size);
              border-radius: 50%;
              background: var(--color);
              box-shadow: 0 0 10px var(--color);
              opacity: 0;
              animation: collapse 1.4s cubic-bezier(0.4, 0, 0.3, 1) var(--delay)
                forwards;
              will-change: transform, opacity;
            }
            @keyframes collapse {
              0% {
                transform: translate3d(
                    calc(-50% + var(--tx)),
                    calc(-50% + var(--ty)),
                    1500px
                  )
                  scale(3);
                opacity: 0;
              }
              15% {
                opacity: 1;
              }
              85% {
                opacity: 1;
              }
              100% {
                transform: translate3d(-50%, -50%, -200px) scale(0.1);
                opacity: 0;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .collapse-star {
                animation: none;
                opacity: 0.4;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MaterializedLine({
  text,
  color,
  delay,
  size,
  glow,
}: {
  text: string;
  color: string;
  delay: number;
  size: string;
  glow: string;
}) {
  return (
    <span className="relative block" style={{ fontSize: size }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.4,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.035,
            ease: [0.22, 1.4, 0.36, 1],
          }}
          className={`inline-block ${color}`}
          style={{
            textShadow: `0 0 25px ${glow}`,
          }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
}
