"use client";

import { motion } from "framer-motion";
import { Trophy, Briefcase, Users } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";

const STATS = [
  {
    icon: Trophy,
    value: 4,
    label: { vi: "Cuộc thi đạt giải", en: "Competition wins" },
  },
  {
    icon: Briefcase,
    value: 3,
    label: { vi: "Nơi đã làm việc", en: "Workplaces" },
  },
  {
    icon: Users,
    value: 2,
    label: { vi: "CLB UEH tham gia", en: "UEH clubs" },
  },
];

/**
 * Hero stats badge — small inline strip below tagline.
 * Adds substance to the small upper area without taking visual focus from the big text.
 */
export function StatsBadge() {
  const { locale } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1 }}
      className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2"
    >
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label.en}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.05 + i * 0.08 }}
            className="flex items-center gap-2"
          >
            <Icon className="h-3.5 w-3.5 text-brand-orange" strokeWidth={2} />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="font-bold text-foreground">{s.value}</span>{" "}
              {s.label[locale]}
            </span>
            {i < STATS.length - 1 && (
              <span className="ml-3 hidden text-muted-foreground/40 sm:inline">
                /
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
