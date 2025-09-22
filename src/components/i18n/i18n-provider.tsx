"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

type Props = {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: unknown;
};

export default function I18NProvider({ children, locale, namespaces }: Props) {
  const i18n = createInstance();

  // Initialize with backend resources loading
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

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
