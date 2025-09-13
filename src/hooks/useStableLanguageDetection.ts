import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useStableLanguageDetection = () => {
  const { i18n } = useTranslation();

  // Detect language immediately without state to prevent flash
  const languageData = useMemo(() => {
    if (typeof window !== "undefined") {
      // First, try to get language from URL
      const pathname = window.location.pathname;
      const localeFromUrl = pathname.split("/")[1];

      if (localeFromUrl === "en") {
        return { currentLang: "en", isRTL: false };
      }

      if (localeFromUrl === "ar") {
        return { currentLang: "ar", isRTL: true };
      }

      // Second, try to get from i18n
      if (i18n.language === "en") {
        return { currentLang: "en", isRTL: false };
      }

      if (i18n.language === "ar") {
        return { currentLang: "ar", isRTL: true };
      }

      // Third, try to get from browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        return { currentLang: "en", isRTL: false };
      }

      // Default to Arabic (since that's the primary language)
      return { currentLang: "ar", isRTL: true };
    }

    // Server-side default
    return { currentLang: "ar", isRTL: true };
  }, [i18n.language]);

  return languageData;
};
