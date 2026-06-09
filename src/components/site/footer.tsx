"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { profile } from "@/lib/content/profile";
import { Magnetic } from "@/components/animations/magnetic";

export function Footer() {
  const { t, locale } = useLocale();
  const year = new Date().getFullYear();
  const ref = React.useRef<HTMLElement>(null);

  // Scroll-driven watermark — fades in + scales as footer enters
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.02, 0.08, 0.05]);
  const watermarkScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.05]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={ref}
      className="relative isolate border-t border-border bg-background"
    >
      {/* Giant "GO BIG OR GO HOME" watermark — kept inside its OWN overflow box
          so the scroll-to-top button (which sits above footer top edge via -mt-7)
          isn't clipped. */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          aria-hidden
          style={{ opacity: watermarkOpacity, scale: watermarkScale }}
          className="absolute inset-x-0 bottom-0 flex justify-center"
        >
          <span
            className="select-none whitespace-nowrap font-display font-extrabold leading-[0.8] tracking-tighter text-foreground"
            style={{ fontSize: "clamp(8rem, 22vw, 22rem)" }}
          >
            GO BIG OR GO HOME
          </span>
        </motion.div>
      </div>

      {/* Top scroll-to-top button — sticks up above footer's top edge */}
      <div className="flex justify-center">
        <Magnetic strength={0.3}>
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            aria-label={locale === "vi" ? "Lên đầu trang" : "Back to top"}
            className="group relative -mt-7 grid h-14 w-14 place-items-center rounded-full border border-border bg-card shadow-2xl transition-colors hover:border-foreground/40"
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-60"
              style={{
                background:
                  "conic-gradient(from 0deg, #ff7a1a, #ffffff, #2f7dff, #ff7a1a)",
                animation: "scroll-top-spin 6s linear infinite",
                maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                WebkitMaskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                padding: "1.5px",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <ArrowUp className="h-5 w-5 text-foreground" strokeWidth={2} />
            </motion.span>
          </motion.button>
        </Magnetic>
      </div>

      <div className="container-px relative mx-auto max-w-7xl pt-10 pb-12">
        {/* Signature line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            ▸ {locale === "vi" ? "Cảm ơn vì đã ghé qua" : "Thanks for stopping by"} ▸
          </p>
          <p
            className="font-display font-bold tracking-tight gradient-text"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
          >
            {profile.name}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Account Intern · UEH · {profile.location[locale]}
          </p>
        </motion.div>

        {/* Animated underline */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto my-8 h-px w-full max-w-3xl origin-center bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
        />

        {/* Bottom info row */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p className="font-mono">
            © {year} {profile.name}. {t("footer.rights")}.
          </p>
          <p className="font-mono uppercase tracking-wider">
            <span className="text-go-big">GO BIG</span>
            <span className="text-muted-foreground/50"> · </span>
            <span className="text-go-home">GO HOME.</span>
          </p>
          <p className="font-mono text-xs">v1.0</p>
        </div>

        {/* Music credit — Pixabay CC0 không bắt buộc nhưng professional */}
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
          ♪ Music: &ldquo;Joyful Rhythm Walk Funk&rdquo; by{" "}
          <a
            href="https://pixabay.com/users/lightbeatsmusic/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-foreground hover:underline"
          >
            LightBeatsMusic
          </a>{" "}
          ·{" "}
          <a
            href="https://pixabay.com/music/funk-joyful-rhythm-walk-funk-513936/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:text-foreground hover:underline"
          >
            Pixabay CC0
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes scroll-top-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </footer>
  );
}
