// Synchronous language detection utility
export const detectLanguageSync = (): {
  currentLang: string;
  isRTL: boolean;
} => {
  // Server-side default
  if (typeof window === "undefined") {
    return { currentLang: "ar", isRTL: true };
  }

  // Client-side detection
  try {
    // First, try to get language from URL
    const pathname = window.location.pathname;
    const localeFromUrl = pathname.split("/")[1];

    if (localeFromUrl === "en") {
      return { currentLang: "en", isRTL: false };
    }

    if (localeFromUrl === "ar") {
      return { currentLang: "ar", isRTL: true };
    }

    // Check if URL contains /en/ anywhere
    if (pathname.includes("/en/")) {
      return { currentLang: "en", isRTL: false };
    }

    // Check if URL contains /ar/ anywhere
    if (pathname.includes("/ar/")) {
      return { currentLang: "ar", isRTL: true };
    }

    // Default to Arabic (primary language)
    return { currentLang: "ar", isRTL: true };
  } catch (error) {
    // Fallback in case of any error
    return { currentLang: "ar", isRTL: true };
  }
};
