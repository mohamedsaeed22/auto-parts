import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useLanguageDetection = () => {
  const { i18n } = useTranslation();

  // Detect language immediately without state to prevent flash
  const detectedLanguage = useMemo(() => {
    if (typeof window !== "undefined") {
      // First, try to get language from URL
      const pathname = window.location.pathname;
      const localeFromUrl = pathname.split("/")[1];

      if (localeFromUrl === "en") {
        return { lang: "en", rtl: false };
      }

      if (localeFromUrl === "ar") {
        return { lang: "ar", rtl: true };
      }

      // Second, try to get from i18n
      if (i18n.language === "en") {
        return { lang: "en", rtl: false };
      }

      if (i18n.language === "ar") {
        return { lang: "ar", rtl: true };
      }

      // Third, try to get from browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        return { lang: "en", rtl: false };
      }

      // Default to Arabic (since that's the primary language)
      return { lang: "ar", rtl: true };
    }

    // Server-side default
    return { lang: "ar", rtl: true };
  }, [i18n.language]);

  const [currentLang, setCurrentLang] = useState<string>(detectedLanguage.lang);
  const [isRTL, setIsRTL] = useState<boolean>(detectedLanguage.rtl);

  useEffect(() => {
    // Only update if the detected language actually changed
    if (detectedLanguage.lang !== currentLang) {
      setCurrentLang(detectedLanguage.lang);
      setIsRTL(detectedLanguage.rtl);
    }
  }, [detectedLanguage.lang, detectedLanguage.rtl, currentLang]);

  return { currentLang, isRTL };
};
