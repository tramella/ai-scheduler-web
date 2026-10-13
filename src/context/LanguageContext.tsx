"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { en, TranslationKey } from "@/i18n/en";
import { vi } from "@/i18n/vi";

export type LanguageMode = "en" | "vi";

interface LanguageContextType {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = "orbit_language";

const dictionaries: Record<LanguageMode, Record<TranslationKey, string>> = {
  en,
  vi,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageMode>("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_KEY) as LanguageMode | null;
      if (savedLang === "en" || savedLang === "vi") {
        setLangState(savedLang);
      }
    } catch {
      // localStorage may not be available
    }
  }, []);

  const setLang = (mode: LanguageMode) => {
    setLangState(mode);
    try {
      localStorage.setItem(LANGUAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "vi" : "en");
  };

  const t = (key: TranslationKey): string => {
    const dict = dictionaries[lang] || en;
    return dict[key] || en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
