import { Locale } from "@/lib/types";

export const i18nConfig = {
  locales: ["ar", "en"] as const,
  defaultLocale: "ar" as const,
  prefixDefault: false,
  localeDetector: false as const, // Disable browser language detection to always use defaultLocale
};

export const namespaces = [
  // Layout & Common
  "common",
  "header",
  "footer",
  "cart",

  // Pages
  "home",
  "about",
  "contact",
  "products",
  "categories",
  "categoryDetail",
  "offers",
  "wishlist",
  "favourites",
  "userPricing",

  // Features
  "auth",
  "product",
  "productDetails",
  "checkout",
  "profile",

  // Components
  "forms",
  "buttons",
  "notifications",
  "validation",
  "profileFormErrors",
  "addressSelection",
] as const;

export type Namespace = (typeof namespaces)[number];

export const getDirection = (locale: Locale) => {
  return locale === "ar" ? "rtl" : "ltr";
};

export const getTextAlign = (locale: Locale) => {
  return locale === "ar" ? "right" : "left";
};

export const getOppositeTextAlign = (locale: Locale) => {
  return locale === "ar" ? "left" : "right";
};

export const getFlexDirection = (locale: Locale) => {
  return locale === "ar" ? "row" : "row";
};

export const getOppositeFlexDirection = (locale: Locale) => {
  return locale === "ar" ? "row" : "row";
};
