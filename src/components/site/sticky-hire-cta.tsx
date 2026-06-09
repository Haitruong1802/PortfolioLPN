"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { Magnetic } from "@/components/animations/magnetic";

/**
 * Floating "Hire me" CTA — appears after user scrolls past hero (>700px).
 * Magnetic + ring pulse + collapsed-by-default on mobile.
 */
export function StickyHireCTA() {
  const { locale } = useLocale();
  const { scrollY } = useScroll();
  const [visible, setVisible] = React.useState(false);
  const [nearContact, setNearContact] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 700);
    // Hide when near contact section (avoid duplicate CTA)
    if (typeof window !== "undefined") {
      const contact = document.getElementById("contact");
      if (contact) {
        const rect = contact.getBoundingClientRect();
        setNearContact(rect.top < window.innerHeight * 0.6);
      }
    }
  });

  const show = visible && !nearContact;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
        >
          <Magnetic strength={0.3}>
            <a
              href="#contact"
              aria-label={locale === "vi" ? "Liên hệ ngay" : "Contact now"}
              className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-orange to-brand-blue px-4 text-xs font-semibold text-white shadow-2xl shadow-brand-orange/30 transition-shadow hover:shadow-brand-blue/50 md:h-14 md:gap-3 md:px-6 md:text-sm"
            >
              {/* Pulsing rings */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full ring-2 ring-brand-orange/60 animate-ping-slow"
              />
              <Phone className="relative h-4 w-4" strokeWidth={2.2} />
              <span className="relative">
                {locale === "vi" ? "Liên hệ" : "Contact"}
                <span className="hidden md:inline">
                  {locale === "vi" ? " ngay" : " now"}
                </span>
              </span>
              <ArrowRight className="relative hidden h-4 w-4 transition-transform group-hover:translate-x-1 md:inline-block" />
            </a>
          </Magnetic>

          <style jsx>{`
            @keyframes ping-slow {
              0% {
                transform: scale(1);
                opacity: 0.7;
              }
              80%, 100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }
            :global(.animate-ping-slow) {
              animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
