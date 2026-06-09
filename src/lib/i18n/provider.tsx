"use client";

import * as React from "react";
import { DEFAULT_LOCALE, type Locale } from "./types";
import { messages, type MessageKey } from "./messages";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "portfolio-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "vi" || stored === "en") {
      setLocaleState(stored);
    } else {
      const browser = navigator.language.split("-")[0];
      if (browser === "en") setLocaleState("en");
    }
    setHydrated(true);
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  React.useEffect(() => {
    if (hydrated) document.documentElement.lang = locale;
  }, [locale, hydrated]);

  const t = React.useCallback(
    (key: MessageKey) => messages[locale][key] ?? key,
    [locale],
  );

  const value = React.useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
