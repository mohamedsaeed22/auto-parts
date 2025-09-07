export type Locale = "ar" | "en";

export type AllowedLocales = Locale[];

export type I18NConfig = {
  locales: string[];
  defaultLocale: string;
  prefixDefault: boolean;
};

// Filter types
export * from "./filters";
