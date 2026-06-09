"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { caseStudies, type CaseStudy } from "@/lib/content/case-studies";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const accentBg: Record<string, string> = {
  cyan: "from-brand-orange/30 via-transparent to-transparent",
  magenta: "from-brand-blue/30 via-transparent to-transparent",
  amber: "from-brand-orange/30 via-transparent to-transparent",
  orange: "from-brand-orange/30 via-transparent to-transparent",
  blue: "from-brand-blue/30 via-transparent to-transparent",
  primary: "from-primary/30 via-transparent to-transparent",
};

export function CaseStudyView({ caseStudy }: { caseStudy: CaseStudy }) {
  const { t, locale } = useLocale();

  const otherCases = caseStudies.filter((c) => c.slug !== caseStudy.slug).slice(0, 3);

  return (
    <article>
      <section className="relative section-py container-px mx-auto max-w-7xl">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-gradient-radial",
            "bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_var(--tw-gradient-from),_transparent_70%)]",
            accentBg[caseStudy.accent],
          )}
        />

        <Link
          href="/#work"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {locale === "vi" ? "Quay lại danh sách" : "Back to all campaigns"}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"
        >
          <span className="font-mono">{caseStudy.category}</span>
          <span>·</span>
          <span className="font-mono">{caseStudy.year}</span>
          <span>·</span>
          <span>{caseStudy.client}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          {caseStudy.title[locale]}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {caseStudy.summary[locale]}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 flex flex-wrap gap-1.5"
        >
          {caseStudy.tags.map((tag) => (
            <Badge key={tag} variant={caseStudy.accent}>
              {tag}
            </Badge>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3"
        >
          {caseStudy.metrics.map((m) => (
            <div key={m.label} className="bg-card p-8">
              <p className="font-display text-5xl font-bold tracking-tight gradient-text">
                {m.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground uppercase tracking-wider">
                {m.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="section-py container-px mx-auto max-w-4xl">
        <div className="prose prose-invert max-w-none">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            {locale === "vi" ? "Bối cảnh" : "Context"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {locale === "vi"
              ? "[Bối cảnh chi tiết của chiến dịch — mô tả thị trường, khách hàng, vấn đề cần giải quyết, ngân sách, timeline. Em sẽ điền nội dung thực tế ở đây.]"
              : "[Detailed context for this campaign — describe the market, client, problem to solve, budget, and timeline. Replace with real content.]"}
          </p>

          <h2 className="mt-12 font-display text-3xl font-semibold tracking-tight">
            {locale === "vi" ? "Hướng tiếp cận" : "Approach"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {locale === "vi"
              ? "[Chiến lược + chiến thuật — tại sao chọn cách làm này, các bước thực hiện chính, đội ngũ phối hợp, công cụ sử dụng.]"
              : "[Strategy + tactics — why this approach, main execution steps, collaborators, tools used.]"}
          </p>

          <h2 className="mt-12 font-display text-3xl font-semibold tracking-tight">
            {locale === "vi" ? "Kết quả" : "Results"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {locale === "vi"
              ? "[Mô tả kết quả chi tiết theo số liệu — ROAS, CPA, traffic, conversion, brand recall. Có thể đính kèm screenshot dashboard ở đây.]"
              : "[Detailed results in numbers — ROAS, CPA, traffic, conversion, brand recall. Attach dashboard screenshots here.]"}
          </p>

          <h2 className="mt-12 font-display text-3xl font-semibold tracking-tight">
            {locale === "vi" ? "Bài học" : "Lessons"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {locale === "vi"
              ? "[Bài học rút ra — điều gì hoạt động, điều gì cần cải thiện, áp dụng được cho chiến dịch sau.]"
              : "[Lessons learned — what worked, what to improve, applicable for future campaigns.]"}
          </p>
        </div>
      </section>

      <section className="section-py container-px mx-auto max-w-7xl border-t border-border">
        <p className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          — {locale === "vi" ? "Chiến dịch khác" : "Other campaigns"}
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {locale === "vi" ? "Xem thêm" : "More work"}
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {otherCases.map((cs) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">{cs.category}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {cs.title[locale]}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {cs.summary[locale]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
