export type Locale = "vi" | "en";

export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALES: Record<Locale, { name: string; flag: string }> = {
  vi: { name: "Tiếng Việt", flag: "VI" },
  en: { name: "English", flag: "EN" },
};
