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

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach locale in headers and as query param for GET requests
    try {
      // Import getCurrentLocale dynamically to avoid circular dependencies
      let locale = "ar"; // Default fallback
      
      // Try to get locale from localeService first (most reliable)
      if (typeof window !== "undefined") {
        try {
          // Use dynamic import to avoid circular dependency
          const { getCurrentLocale } = require("@/lib/localeService");
          locale = getCurrentLocale();
          console.log("Axios interceptor - Using locale from service:", locale);
        } catch (serviceError) {
          console.warn("Axios interceptor - LocaleService unavailable, falling back to cookie");
          
          // Fallback to cookie
          const cookieLocale = document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("NEXT_LOCALE="))
            ?.split("=")[1];
          
          if (cookieLocale === "en" || cookieLocale === "ar") {
            locale = cookieLocale;
          }
        }
      }
      
      // Always set locale header for all requests
      config.headers = config.headers || {};
      (config.headers as any).locale = locale;
      (config.headers as any)["Accept-Language"] = locale;
      
      console.log("Axios interceptor - Setting locale header:", locale);
      
      // Also add as query param for GET requests
      if (!config.method || config.method.toUpperCase() === "GET") {
        const params = new URLSearchParams(
          (config.params as Record<string, string>) || {}
        );
        if (!params.get("locale")) {
          params.set("locale", locale);
          config.params = Object.fromEntries(params.entries());
          console.log("Axios interceptor - Adding locale query param for GET:", locale);
        }
      }
    } catch (error) {
      console.error("Axios interceptor - Error setting locale:", error);
      // Ensure we always have a locale header even if there's an error
      config.headers = config.headers || {};
      (config.headers as any).locale = "ar";
      (config.headers as any)["Accept-Language"] = "ar";
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
