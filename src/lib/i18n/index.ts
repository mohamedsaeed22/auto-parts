import { createInstance, TFunction, i18n, Resource } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { Locale } from "@/lib/types/index";

// i18n configuration
export const i18nConfig = {
  locales: ["en", "ar"],
  defaultLocale: "en",
  prefixDefault: false,
};

interface TranslationOptions {
  keyPrefix?: string;
  i18nInstance?: i18n;
  resources?: Resource;
}

async function initTranslations(
  locale: string,
  namespaces: string[],
  options?: TranslationOptions
) {
  const i18nInstance = options?.i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!options?.resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/lib/i18n/transalations/${language}/${namespace}.json`)
      )
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources: options?.resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: options?.resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.getFixedT(
      locale,
      namespaces[0],
      options?.keyPrefix
    ) as TFunction<Locale, undefined>,
  };
}

// Exported function to fetch translations on server components
export async function serverSideTranslation(
  locale: string,
  namespaces: string[],
  options?: TranslationOptions
) {
  return await initTranslations(locale, namespaces, options);
}
