"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { serverSideTranslation } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: unknown;
};

export default function I18NProvider({
  children,
  locale,
  namespaces,
  resources,
}: Props) {
  const i18n = createInstance();

  // Initialize synchronously with server-provided resources
  i18n.use(initReactI18next);

  i18n.init({
    lng: locale,
    resources: resources as any,
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
