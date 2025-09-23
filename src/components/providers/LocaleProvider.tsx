"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLocale } from "@/store/slices/localeSlice";
import { initializeLocale, addLocaleChangeListener } from "@/lib/localeService";

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
    // Initialize locale service first
    initializeLocale();

    // Initialize locale state with the current i18n language or initial locale
    const currentLocale = initialLocale || i18n.language || "ar";
    dispatch(setLocale(currentLocale));

    // Listen for locale changes from the locale service
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
