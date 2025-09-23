"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: unknown;
};

export default function I18NProvider({ children, locale, namespaces }: Props) {
  const i18nRef = useRef(createInstance());
  const i18n = i18nRef.current;
  const initializedRef = useRef(false);

  // Initialize i18n instance only once
  useEffect(() => {
    if (!initializedRef.current) {
      i18n
        .use(initReactI18next)
        .use(
          resourcesToBackend(
            (language: string, namespace: string) =>
              import(`@/lib/i18n/translations/${language}/${namespace}.json`)
          )
        )
        .init({
          lng: locale,
          fallbackLng: "ar",
          supportedLngs: ["ar", "en"],
          defaultNS: namespaces[0],
          fallbackNS: namespaces[0],
          ns: namespaces,
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          },
        });
      
      initializedRef.current = true;
    }
  }, []);

  // Update language when locale prop changes
  useEffect(() => {
    if (initializedRef.current && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
