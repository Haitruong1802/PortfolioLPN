"use client";

import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LangSwitch({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1 rounded-full border border-border bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted",
        className,
      )}
      aria-label={`Switch to ${locale === "vi" ? "English" : "Tiếng Việt"}`}
    >
      <span className={cn("font-mono", locale === "vi" && "opacity-100")}>VI</span>
      <span className="text-muted-foreground">/</span>
      <span className={cn("font-mono", locale === "en" && "opacity-100")}>EN</span>
    </button>
  );
}
