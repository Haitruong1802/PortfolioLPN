"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import { LangSwitch } from "./lang-switch";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./sound-toggle";
import { MusicToggle } from "./music-toggle";
import { MobileMenu } from "./mobile-menu";
import { Magnetic } from "@/components/animations/magnetic";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useLocale();
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.8]);

  // Order matches the new proof-first section flow in page.tsx:
  // Hero → Work → Process → About → Services → Contact
  const links = [
    { href: "#work", label: t("nav.work") },
    { href: "#process", label: t("nav.process") },
    { href: "#about", label: t("nav.about") },
    { href: "#services", label: t("nav.services") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          background: "var(--color-background)",
          opacity: bgOpacity,
        }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 h-px bg-border"
        style={{ opacity: borderOpacity }}
      />
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between pl-5 pr-10 md:pl-10 md:pr-14">
        <a
          href="#top"
          className="flex items-center gap-3 text-base font-semibold tracking-tight md:text-lg"
        >
          {/* Plain <img> instead of next/image — the source PNG is 6250x6250
              (~1.85 MB) and next/image optimization can stall on files that
              big for the small display size. Plain img loads directly. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Lê Phương Nam logo"
            width={48}
            height={48}
            className="block h-8 w-8 shrink-0 object-contain md:h-12 md:w-12"
          />
          <span className="hidden sm:inline">Lê Phương Nam</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Audio + theme controls — desktop only; moved into MobileMenu on mobile */}
          <div className="hidden items-center gap-2 md:flex">
            <MusicToggle />
            <SoundToggle />
            <ThemeToggle />
          </div>
          <LangSwitch />
          {/* Wrap Magnetic in parent — Magnetic forces display:inline-block via
              inline style, which overrides Tailwind's `hidden` class. The
              wrapper lets the visibility utility win. */}
          <div className="hidden md:inline-flex">
            <Magnetic strength={0.4}>
              <Button size="sm" variant="primary">
                <a href="#contact">{t("cta.hire")}</a>
              </Button>
            </Magnetic>
          </div>
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}
