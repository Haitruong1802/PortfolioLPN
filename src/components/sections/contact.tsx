"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, Copy, Check, Download } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { profile } from "@/lib/content/profile";
import { AnimatedEyebrow } from "@/components/animations/animated-eyebrow";
import { SectionSpotlight } from "@/components/site/section-spotlight";
import { LinkedInIcon, FacebookIcon } from "@/components/icons/social";
import { LetterReveal } from "@/components/animations/letter-reveal";
import { Tilt } from "@/components/animations/tilt";
import { useConfetti } from "@/components/animations/confetti";

const socialIcons = [
  { href: profile.socials.linkedin, icon: LinkedInIcon, label: "LinkedIn", color: "#0A66C2" },
  { href: profile.socials.facebook, icon: FacebookIcon, label: "Facebook", color: "#1877F2" },
];

export function Contact() {
  const { t, locale } = useLocale();
  const ref = React.useRef<HTMLElement>(null);
  const { fire, renderBursts } = useConfetti();

  // Scroll-driven background blobs
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const blobOrangeY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const blobBlueY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const blobScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.15, 0.9]);

  // Toast state for "copied!" feedback
  const [copiedLabel, setCopiedLabel] = React.useState<string | null>(null);
  const copiedTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async (
    value: string,
    label: string,
    e: React.MouseEvent<HTMLElement>,
  ) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard may be unavailable */
    }
    fire({
      origin: { x: e.clientX, y: e.clientY },
      count: 24,
      spread: 200,
      power: 380,
      durationMs: 1400,
    });
    setCopiedLabel(label);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopiedLabel(null), 1800);
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative isolate section-py container-px mx-auto max-w-7xl overflow-hidden"
    >
      {/* Floating gradient blobs */}
      <motion.div
        aria-hidden
        style={{ y: blobOrangeY, scale: blobScale }}
        className="pointer-events-none absolute -left-[10%] top-1/3 -z-10 h-[40rem] w-[40rem] rounded-full bg-brand-orange/8 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: blobBlueY, scale: blobScale }}
        className="pointer-events-none absolute -right-[10%] top-1/4 -z-10 h-[40rem] w-[40rem] rounded-full bg-brand-blue/8 blur-3xl"
      />

      <SectionSpotlight number="05" align="left" />
      <AnimatedEyebrow color="text-brand-blue">
        {t("contact.eyebrow")}
      </AnimatedEyebrow>

      <div className="flex flex-col items-center text-center">
        <h2
          className="font-display font-semibold leading-[1.05] tracking-tight"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          <LetterReveal text={locale === "vi" ? "Cùng nhau " : "Let's "} />
          <span className="text-go-big">GO BIG</span>?
        </h2>

        {/* Identity line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <p className="font-display text-xl font-semibold sm:text-2xl">
            {profile.name}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Account Intern · UEH
          </p>
        </motion.div>
      </div>

      {/* Contact info row — 3 cards centered */}
      <div className="mx-auto mt-14 grid w-full max-w-4xl gap-5 sm:grid-cols-3">
        <ContactInfoCard
          icon={Mail}
          iconBehavior="shake"
          label="Email"
          value={profile.email}
          accent="orange"
          delay={0.3}
          onClick={(e) => handleCopy(profile.email, "Email", e)}
          copiedActive={copiedLabel === "Email"}
        />
        <ContactInfoCard
          icon={Phone}
          iconBehavior="ring"
          label={locale === "vi" ? "Điện thoại" : "Phone"}
          value={profile.phone}
          accent="blue"
          delay={0.4}
          onClick={(e) =>
            handleCopy(
              profile.phone,
              locale === "vi" ? "Điện thoại" : "Phone",
              e,
            )
          }
          copiedActive={
            copiedLabel === (locale === "vi" ? "Điện thoại" : "Phone")
          }
        />
        <ContactInfoCard
          icon={MapPin}
          iconBehavior="bounce"
          label={locale === "vi" ? "Địa điểm" : "Location"}
          value={profile.location[locale]}
          accent="orange"
          delay={0.5}
        />
      </div>

      {/* Primary CTAs — mailto + tel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href={`mailto:${profile.email}?subject=${encodeURIComponent(
            locale === "vi"
              ? "Mời phỏng vấn Account Intern"
              : "Account Intern interview invite",
          )}`}
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-blue px-6 text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition-all hover:shadow-brand-blue/40 active:scale-[0.98]"
        >
          <Mail className="h-4 w-4" />
          {locale === "vi" ? "Gửi email cho Nam" : "Email Nam"}
        </a>
        <a
          href={`tel:${profile.phone}`}
          className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-all hover:border-foreground/40 hover:bg-card/80 active:scale-[0.98]"
        >
          <Phone className="h-4 w-4" />
          {locale === "vi" ? "Gọi trực tiếp" : "Call now"}
        </a>
        <a
          href="/cv/le-phuong-nam-cv.pdf"
          download="Le-Phuong-Nam-CV.pdf"
          className="group inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-all hover:border-foreground/40 hover:bg-card/80 active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          {locale === "vi" ? "Tải CV PDF" : "Download CV"}
        </a>
      </motion.div>

      {/* Social row — centered */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.75 }}
        className="mx-auto mt-10 flex flex-col items-center gap-4"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {locale === "vi" ? "Hoặc kết nối qua" : "Or connect via"}
        </p>
        <div className="flex items-center gap-3">
          {socialIcons.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: 0.85 + i * 0.08,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ scale: 1.1, y: -3 }}
              className="group relative grid h-11 w-11 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground"
            >
              <s.icon className="h-5 w-5 relative z-10" />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Copied! toast (bottom center) */}
      {copiedLabel && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 z-[170] -translate-x-1/2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 backdrop-blur-md"
        >
          <p className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            {locale === "vi" ? "Đã copy" : "Copied"} {copiedLabel}
          </p>
        </motion.div>
      )}

      {/* Confetti bursts portal */}
      {renderBursts()}
    </section>
  );
}

function ContactInfoCard({
  icon: Icon,
  iconBehavior = "none",
  label,
  value,
  accent,
  delay,
  onClick,
  copiedActive,
}: {
  icon: typeof Mail;
  iconBehavior?: "shake" | "ring" | "bounce" | "none";
  label: string;
  value: string;
  accent: "orange" | "blue";
  delay: number;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  copiedActive?: boolean;
}) {
  const isClickable = !!onClick;
  const accentTextCls = accent === "orange" ? "text-brand-orange" : "text-brand-blue";

  // Icon animations per behavior
  const iconAnim =
    iconBehavior === "shake"
      ? {
          rotate: [0, -8, 8, -6, 6, 0],
          transition: { duration: 1.4, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" as const },
        }
      : iconBehavior === "ring"
        ? {
            rotate: [0, -12, 12, -8, 8, 0],
            transition: { duration: 0.8, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" as const },
          }
        : iconBehavior === "bounce"
          ? {
              y: [0, -3, 0],
              transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
            }
          : undefined;

  return (
    <Tilt max={8} glare className="rounded-2xl">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -3 }}
        onClick={onClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
                }
              }
            : undefined
        }
        className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30 ${
          isClickable ? "cursor-pointer" : ""
        }`}
      >
        {/* Hover glow */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-60 ${
            accent === "orange" ? "bg-brand-orange/30" : "bg-brand-blue/30"
          }`}
        />

        {/* Copy indicator hint (top-right) */}
        {isClickable && (
          <div
            aria-hidden
            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100"
          >
            {copiedActive ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </div>
        )}

        <div className="relative">
          <p className="mb-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-foreground sm:text-base md:text-lg">
            <motion.span
              className={`inline-grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                accent === "orange" ? "bg-brand-orange/10" : "bg-brand-blue/10"
              }`}
              animate={iconAnim}
            >
              <Icon className={`h-4 w-4 ${accentTextCls}`} strokeWidth={2} />
            </motion.span>
            <span className="truncate">{value}</span>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
}
