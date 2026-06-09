"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "top", label: { vi: "Hero", en: "Hero" } },
  { id: "about", label: { vi: "Về Nam", en: "About" } },
  { id: "process", label: { vi: "Kinh nghiệm", en: "Experience" } },
  { id: "services", label: { vi: "Skills", en: "Skills" } },
  { id: "work", label: { vi: "Thành tích", en: "Wins" } },
  { id: "contact", label: { vi: "Liên hệ", en: "Contact" } },
];

export function ScrollSpy() {
  const { locale } = useLocale();
  const [activeId, setActiveId] = React.useState<string>("top");
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1280px)").matches) return;
    setVisible(true);

    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(id);
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      aria-label="Section navigation"
    >
      <ul className="flex flex-col gap-3">
        {SECTIONS.map(({ id, label }, i) => {
          const isActive = activeId === id;
          const isHovered = hovered === id;
          return (
            <li
              key={id}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
              <a
                href={`#${id}`}
                className="group relative flex items-center justify-end gap-3 py-1"
                aria-label={label[locale]}
              >
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : 8,
                  }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground"
                >
                  {String(i + 1).padStart(2, "0")} · {label[locale]}
                </motion.span>
                <motion.span
                  initial={false}
                  animate={{
                    width: isActive ? 28 : 16,
                    backgroundColor: isActive
                      ? "var(--brand-orange)"
                      : "var(--color-muted-foreground)",
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "block h-[2px] rounded-full",
                    isActive ? "opacity-100" : "opacity-50 group-hover:opacity-100",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
