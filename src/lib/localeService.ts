// Locale service to provide current locale to axios interceptor
// This avoids circular dependencies and provides a reliable way to get the current locale

let currentLocale: string = "ar"; // Default to Arabic

export const setCurrentLocale = (locale: string) => {
  console.log("LocaleService - Setting locale to:", locale);
  currentLocale = locale;
  // Verify the locale was set correctly
  console.log(
    "LocaleService - Verification: currentLocale is now:",
    currentLocale
  );
};

// Initialize locale service on app load
export const initializeLocale = () => {
  if (typeof window !== "undefined") {
    // Try to get locale from URL first
    const pathname = window.location.pathname;
    const localeFromUrl = pathname.split("/")[1];
    if (localeFromUrl === "en" || localeFromUrl === "ar") {
      console.log("LocaleService - Initializing from URL:", localeFromUrl);
      currentLocale = localeFromUrl;
      return;
    }

    // Try to get from cookie
    const cookieLocale = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    if (cookieLocale === "en" || cookieLocale === "ar") {
      console.log("LocaleService - Initializing from cookie:", cookieLocale);
      currentLocale = cookieLocale;
      return;
    }

    // Default to Arabic
    console.log("LocaleService - Initializing with default: ar");
    currentLocale = "ar";
  }
};

export const getCurrentLocale = (): string => {
  if (typeof window === "undefined") {
    return "ar"; // Server-side default
  }

  try {
    // Always return the service state if it's been explicitly set
    console.log(
      "LocaleService - getCurrentLocale called, service state:",
      currentLocale
    );

    // If service state is valid, use it
    if (currentLocale === "en" || currentLocale === "ar") {
      console.log("LocaleService - Returning service state:", currentLocale);
      return currentLocale;
    }

    // Fallback to URL if service state is not set
    const pathname = window.location.pathname;
    const localeFromUrl = pathname.split("/")[1];
    if (localeFromUrl === "en" || localeFromUrl === "ar") {
      console.log(
        "LocaleService - Service state not set, using URL locale:",
        localeFromUrl
      );
      currentLocale = localeFromUrl;
      return localeFromUrl;
    }

    // Fallback to cookie if URL doesn't have locale
    const cookieLocale = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    if (cookieLocale === "en" || cookieLocale === "ar") {
      console.log("LocaleService - Using cookie locale:", cookieLocale);
      currentLocale = cookieLocale;
      return cookieLocale;
    }

    // Default to Arabic
    console.log("LocaleService - Using default: ar");
    return "ar";
  } catch (error) {
    console.warn("Error getting locale:", error);
    return "ar";
  }
};
