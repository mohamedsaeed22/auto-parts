// Locale service to provide current locale to axios interceptor
// This avoids circular dependencies and provides a reliable way to get the current locale

let currentLocale: string | undefined;
let isUpdating: boolean = false; // Flag to track if locale is being updated
const localeChangeListeners: Array<(locale: string) => void> = [];

export const setCurrentLocale = (locale: string) => {
  if (locale !== "en" && locale !== "ar") {
    return;
  }

  // Set updating flag to prevent race conditions
  isUpdating = true;

  currentLocale = locale;

  // Notify all listeners immediately
  localeChangeListeners.forEach((listener) => {
    try {
      listener(locale);
    } catch (error) {}
  });

  // Clear updating flag after a short delay to ensure all systems are updated
  setTimeout(() => {
    isUpdating = false;
  }, 100);

  // Verify the locale was set correctly
};

export const addLocaleChangeListener = (listener: (locale: string) => void) => {
  localeChangeListeners.push(listener);
  return () => {
    const index = localeChangeListeners.indexOf(listener);
    if (index > -1) {
      localeChangeListeners.splice(index, 1);
    }
  };
};

export const isLocaleUpdating = (): boolean => {
  return isUpdating;
};

// Initialize locale service on app load
export const initializeLocale = () => {
  if (typeof window !== "undefined") {
    // Try to get locale from URL first
    const pathname = window.location.pathname;
    const localeFromUrl = pathname.split("/")[1];
    if (localeFromUrl === "en" || localeFromUrl === "ar") {
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
      currentLocale = cookieLocale;
      return;
    }

    // Default to Arabic
    currentLocale = "ar";
  }
};

export const getCurrentLocale = (): string => {
  if (typeof window === "undefined") {
    return "ar"; // Server-side default
  }

  try {
    // Always return the service state if it's been explicitly set

    // If service state is valid, use it
    if (currentLocale === "en" || currentLocale === "ar") {
      return currentLocale;
    }

    // Fallback to URL if service state is not set
    const pathname = window.location.pathname;
    const localeFromUrl = pathname.split("/")[1];
    if (localeFromUrl === "en" || localeFromUrl === "ar") {
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
      currentLocale = cookieLocale;
      return cookieLocale;
    }

    // Default to Arabic
    return "ar";
  } catch (error) {
    return "ar";
  }
};
