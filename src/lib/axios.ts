import axios from "axios";
import https from "https";

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Bypass SSL certificate verification for development
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Request interceptor to add locale header
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Dynamically import to avoid circular dependencies
      const { getCurrentLocale, isLocaleUpdating } = await import("@/lib/localeService");
      
      // If locale is currently being updated, wait a bit for consistency
      if (isLocaleUpdating()) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      let locale = getCurrentLocale();

      // Override with URL or cookie locale if they differ (handles first-load race where service still has default "ar")
      if (typeof window !== "undefined") {
        try {
          const pathLocale = window.location.pathname.split("/")[1];
          if ((pathLocale === "en" || pathLocale === "ar") && pathLocale !== locale) {
            locale = pathLocale;
          }
          const cookieLocale = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("NEXT_LOCALE="))
            ?.split("=")[1];
          if ((cookieLocale === "en" || cookieLocale === "ar") && cookieLocale !== locale) {
            locale = cookieLocale;
          }
        } catch (e) {
          console.warn("Axios interceptor - Failed syncing with URL/cookie locale:", e);
        }
      }
      
      // Fallback to cookie if service is not available
      if (!locale || (locale !== "en" && locale !== "ar")) {
        if (typeof document !== "undefined") {
          const cookieLocale = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("NEXT_LOCALE="))
            ?.split("=")[1];
          locale = cookieLocale === "en" || cookieLocale === "ar" ? cookieLocale : "ar";
        } else {
          locale = "ar";
        }
      }

      // Always set both locale and Accept-Language headers for all requests
      config.headers = config.headers || {};
      config.headers["locale"] = locale;
      config.headers["Accept-Language"] = locale;

      // For GET requests, also add locale as query parameter
      if (config.method?.toLowerCase() === "get") {
        config.params = config.params || {};
        config.params.locale = locale;
      }

      console.log(
        `Axios interceptor - Request to ${config.url} with locale: ${locale}, method: ${config.method}`
      );
    } catch (error) {
      console.warn("Axios interceptor - Error setting locale:", error);
      // Fallback to default
      config.headers = config.headers || {};
      config.headers["locale"] = "ar";
      config.headers["Accept-Language"] = "ar";
    }

    // Get token from localStorage
    const authData = localStorage.getItem("fal_parts_auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("fal_parts_auth");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
