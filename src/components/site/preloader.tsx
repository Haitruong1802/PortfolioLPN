"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "portfolio-preloader-seen";
const TOTAL_DURATION = 3200; // 3.2s smoother

/**
 * Cinematic preloader — 4 cohesive acts, 3.2s total.
 *
 * Act 1 (0 – 0.5s)  — "Ignition": Scanline draws + 1 spark grows
 * Act 2 (0.5 – 1.6s) — "Inhale": 200 stars converge inward (cinematic depth)
 * Act 3 (1.6 – 2.6s) — "Reveal": "GO BIG OR GO HOME" materializes letter-by-letter
 *                                 Loading bar fills underneath in parallel
 * Act 4 (2.6 – 3.2s) — "Liftoff": Ring expand + final flash
 * Exit (3.2 – 4.0s) — Scale 1.5 + blur 25 → page emerges
 */
export function Preloader() {
  const [visible, setVisible] = React.useState(true);
  const [phase, setPhase] = React.useState<1 | 2 | 3 | 4>(1);
  const [stars, setStars] = React.useState<
    Array<{ id: number; tx: number; ty: number; delay: number; size: number; color: string }>
  >([]);

  React.useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setVisible(false);
      return;
    }

    // 200 was punishing on weak office machines. 80 keeps the cosmic feel
    // and drops to 40 on mobile where each particle costs more relatively.
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

    const t1 = setTimeout(() => setPhase(2), 500);
    const t2 = setTimeout(() => setPhase(3), 1600);
    const t3 = setTimeout(() => setPhase(4), 2600);
    const tEnd = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, TOTAL_DURATION);

    document.body.style.overflow = "hidden";
    return () => {
      [t1, t2, t3, tEnd].forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

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

          {/* Loading bar (Act 3+) — slides in from bottom */}
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
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 1.4,
                      delay: 0.3,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                    className="h-full w-full"
                    style={{
                      background:
                        "linear-gradient(to right, #ff7a1a, #ffffff, #2f7dff)",
                      boxShadow: "0 0 14px rgba(255,122,26,0.9)",
                    }}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/55">
                  100
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
