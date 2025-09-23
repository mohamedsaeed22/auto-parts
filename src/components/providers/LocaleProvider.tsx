"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLocale } from "@/store/slices/localeSlice";
import { initializeLocale, addLocaleChangeListener, setCurrentLocale } from "@/lib/localeService";

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale?: string;
}

export default function LocaleProvider({
  children,
  initialLocale,
}: LocaleProviderProps) {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    const initLocales = async () => {
      // First try to get locale from URL or cookie
      initializeLocale();

      // Get the initial locale with priority: URL > Cookie > Initial prop > i18n > default
      let initialLang = "ar";
      
      // 1. Try URL first
      if (typeof window !== "undefined") {
        const pathLocale = window.location.pathname.split("/")[1];
        if (pathLocale === "en" || pathLocale === "ar") {
          initialLang = pathLocale;
        } else {
          // 2. Try cookie
          const cookieLocale = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("NEXT_LOCALE="))
            ?.split("=")[1];
          if (cookieLocale === "en" || cookieLocale === "ar") {
            initialLang = cookieLocale;
          }
        }
      }

      // 3. Fallback chain: initial prop > i18n language > default ar
      initialLang = initialLocale || i18n.language || initialLang;

      // Update all locale sources atomically
      try {
        // Update locale service first (this will affect upcoming requests)
        setCurrentLocale(initialLang);
        
        // Update Redux state
        dispatch(setLocale(initialLang));
        
        // Update i18n last (this can trigger rerenders)
        if (i18n.language !== initialLang) {
          await i18n.changeLanguage(initialLang);
        }

        console.log("LocaleProvider - All locale sources synchronized to:", initialLang);
      } catch (error) {
        console.error("LocaleProvider - Error synchronizing locales:", error);
      }
    };

    // Run initialization
    initLocales();

    // Set up locale change listener for subsequent changes
    const unsubscribe = addLocaleChangeListener((newLocale) => {
      console.log("LocaleProvider - Locale service changed to:", newLocale);
      // Update Redux state
      dispatch(setLocale(newLocale));
      // Update i18n language
      if (i18n.language !== newLocale) {
        i18n.changeLanguage(newLocale).catch(console.warn);
      }
    });

    return unsubscribe;
  }, [dispatch, i18n, initialLocale]);

  return <>{children}</>;
}
