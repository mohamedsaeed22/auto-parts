"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLocale } from "@/store/slices/localeSlice";

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
    // Initialize locale state with the current i18n language or initial locale
    const currentLocale = initialLocale || i18n.language || "ar";
    dispatch(setLocale(currentLocale));
  }, [dispatch, i18n.language, initialLocale]);

  return <>{children}</>;
}
