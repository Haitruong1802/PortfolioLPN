"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { profile } from "@/lib/content/profile";
import { LinkedInIcon, FacebookIcon } from "@/components/icons/social";
import { MusicToggle } from "./music-toggle";
import { SoundToggle } from "./sound-toggle";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const socialList = [
  { href: profile.socials.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
  { href: profile.socials.facebook, icon: FacebookIcon, label: "Facebook" },
];

/**
 * Mobile menu drawer.
 *
 * Previously built on framer-motion (AnimatePresence + motion.divs for
 * backdrop, drawer and 6 staggered nav links). On weak phones the user
 * reported the button "khựng" - sometimes the tap registered, sometimes
 * it didn't, sometimes the whole UI froze. Causes:
 *   - the root MotionConfig sets reducedMotion='always' on most non-full
 *     profiles, so AnimatePresence was being asked to play instant
 *     entrance/exit transitions; if the user double-tapped during an
 *     exit it would block the next enter.
 *   - portal-mounting 8 motion components per toggle is heavy.
 * Replaced with plain CSS transitions (transform on the drawer, opacity
 * on the backdrop). The drawer stays in the DOM after first open so the
 * second toggle is just a class flip - no portal mount, no Framer Motion
 * reconciliation, no chance of getting wedged between an enter and an
 * exit. Buttons stay responsive.
 */
export function MobileMenu() {
  const { t, locale } = useLocale();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Match the story-first section flow in page.tsx
  const links = [
    { href: "#about", label: t("nav.about") },
    { href: "#process", label: t("nav.process") },
    { href: "#services", label: t("nav.services") },
    { href: "#work", label: t("nav.work") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted active:bg-muted md:hidden"
      >
        <Menu className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {mounted &&
        createPortal(
          <>
            {/* Backdrop - CSS opacity transition, pointer-events gated on
                `open` so it doesn't catch taps while invisible. */}
            <div
              onClick={() => setOpen(false)}
              aria-hidden
              className={cn(
                "fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-200 md:hidden",
                open ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            />

            {/* Drawer - CSS translateX transition. Stays mounted after
                first open; subsequent opens are pure class swaps. */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className={cn(
                "fixed right-0 top-0 z-[90] flex h-[100dvh] w-[88%] max-w-sm flex-col bg-background border-l border-border md:hidden",
                "transition-transform duration-300 ease-out will-change-transform",
                open ? "translate-x-0" : "translate-x-full",
              )}
            >
              <div className="flex items-center justify-between border-b border-border p-5">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted active:bg-muted"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 p-5">
                {links.map((link, i) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-4 font-display text-2xl font-semibold transition-colors hover:bg-muted active:bg-muted"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                  </a>
                ))}
              </nav>

              <div className="border-t border-border p-5">
                {/* Controls row — music / sound / theme toggles */}
                <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {locale === "vi" ? "Tuỳ chỉnh" : "Preferences"}
                  </span>
                  <div className="flex items-center gap-2">
                    <MusicToggle />
                    <SoundToggle />
                    <ThemeToggle />
                  </div>
                </div>

                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mb-5 grid h-12 place-items-center rounded-full bg-gradient-to-r from-brand-orange via-primary to-brand-blue text-sm font-medium text-white shadow-lg shadow-primary/20"
                >
                  {t("cta.hire")}
                </a>

                <div className="flex flex-wrap items-center gap-2">
                  {socialList.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
