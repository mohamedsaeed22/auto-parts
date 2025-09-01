"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { storage } from "@/lib/storage";
import { showError, showSuccess } from "@/lib/toast";

export interface AuthGuardOptions {
  requireAuth?: boolean;
  requireCompleteRegistration?: boolean;
  redirectOnAuthFail?: string;
  redirectOnIncompleteRegistration?: string;
  showToastOnAuthFail?: boolean;
  showToastOnIncompleteRegistration?: boolean;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  isRegistrationComplete: boolean;
  isLoading: boolean;
  user: any;
}

const DEFAULT_OPTIONS: AuthGuardOptions = {
  requireAuth: true,
  requireCompleteRegistration: true,
  redirectOnAuthFail: "/",
  redirectOnIncompleteRegistration: "/complete-registration",
  showToastOnAuthFail: true,
  showToastOnIncompleteRegistration: true,
};

export function useAuthGuard(options: AuthGuardOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation("auth");

  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isRegistrationComplete: false,
    isLoading: true,
    user: null,
  });

  // Refs to prevent duplicate toasts and actions
  const lastToastTime = useRef<number>(0);
  const lastRedirectPath = useRef<string>("");
  const hasShownToast = useRef<boolean>(false);

  // Memoize merged options to prevent new object on every render
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...options }),
    [options]
  );

  // Store the current page as previous page for redirect after login
  const storePreviousPage = useCallback(() => {
    if (typeof window !== "undefined") {
      storage.setPreviousPage(pathname);
    }
  }, [pathname]);

  // Check authentication status
  const checkAuthStatus = useCallback(() => {
    const isAuthenticated = storage.isAuthenticated();
    const isRegistrationComplete = storage.isRegistrationComplete();
    const user = storage.getUser();

    setAuthStatus({
      isAuthenticated,
      isRegistrationComplete,
      isLoading: false,
      user,
    });

    return { isAuthenticated, isRegistrationComplete, user };
  }, []);

  // Handle authentication failure
  const handleAuthFailure = useCallback(() => {
    const now = Date.now();
    const redirectPath = mergedOptions.redirectOnAuthFail || "/";

    // Prevent duplicate toasts within 2 seconds or for the same path
    const shouldShowToast =
      mergedOptions.showToastOnAuthFail &&
      !hasShownToast.current &&
      now - lastToastTime.current > 2000 &&
      lastRedirectPath.current !== redirectPath;

    if (shouldShowToast) {
      showError(
        t("errors.loginRequired") || "Please login to access this page"
      );
      lastToastTime.current = now;
      hasShownToast.current = true;
      lastRedirectPath.current = redirectPath;
    }

    storePreviousPage();

    if (mergedOptions.redirectOnAuthFail) {
      router.push(mergedOptions.redirectOnAuthFail);
    }
  }, [
    mergedOptions.showToastOnAuthFail,
    mergedOptions.redirectOnAuthFail,
    router,
    storePreviousPage,
    t,
  ]);

  // Handle incomplete registration
  const handleIncompleteRegistration = useCallback(() => {
    const now = Date.now();
    const redirectPath =
      mergedOptions.redirectOnIncompleteRegistration ||
      "/complete-registration";

    // Prevent duplicate toasts within 2 seconds or for the same path
    const shouldShowToast =
      mergedOptions.showToastOnIncompleteRegistration &&
      now - lastToastTime.current > 2000 &&
      lastRedirectPath.current !== redirectPath;

    if (shouldShowToast) {
      showError(
        t("errors.completeRegistrationRequired") ||
          "Please complete your registration"
      );
      lastToastTime.current = now;
      lastRedirectPath.current = redirectPath;
    }

    if (mergedOptions.redirectOnIncompleteRegistration) {
      router.push(mergedOptions.redirectOnIncompleteRegistration);
    }
  }, [
    mergedOptions.showToastOnIncompleteRegistration,
    mergedOptions.redirectOnIncompleteRegistration,
    router,
    t,
  ]);

  // Main guard function
  const guardCheck = useCallback(() => {
    const { isAuthenticated, isRegistrationComplete } = checkAuthStatus();

    // Check if authentication is required and user is not authenticated
    if (mergedOptions.requireAuth && !isAuthenticated) {
      handleAuthFailure();
      return false;
    }

    // Check if complete registration is required and user hasn't completed registration
    if (
      mergedOptions.requireCompleteRegistration &&
      isAuthenticated &&
      !isRegistrationComplete
    ) {
      handleIncompleteRegistration();
      return false;
    }

    return true;
  }, [
    checkAuthStatus,
    mergedOptions.requireAuth,
    mergedOptions.requireCompleteRegistration,
    handleAuthFailure,
    handleIncompleteRegistration,
  ]);

  // Reset toast flag when pathname changes
  useEffect(() => {
    hasShownToast.current = false;
    lastRedirectPath.current = "";
  }, [pathname]);

  // Effect to run guard check on mount and when dependencies change
  useEffect(() => {
    guardCheck();
  }, [guardCheck]);

  // Listen for storage changes (auth state changes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fal_parts_auth" || e.key === null) {
        guardCheck();
      }
    };

    const handleAuthChange = () => {
      guardCheck();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [guardCheck]);

  // Manual check function for use in components
  const checkAccess = useCallback(() => {
    return guardCheck();
  }, [guardCheck]);

  // Redirect to login with current page stored
  const redirectToLogin = useCallback(() => {
    storePreviousPage();
    router.push(mergedOptions.redirectOnAuthFail || "/");
  }, [storePreviousPage, router, mergedOptions]);

  // Redirect to complete registration
  const redirectToCompleteRegistration = useCallback(() => {
    router.push(
      mergedOptions.redirectOnIncompleteRegistration || "/complete-registration"
    );
  }, [router, mergedOptions]);

  return {
    ...authStatus,
    checkAccess,
    redirectToLogin,
    redirectToCompleteRegistration,
    storePreviousPage,
  };
}

// Predefined configurations for common use cases
export const AUTH_GUARD_CONFIGS = {
  // For pages that require full authentication and completed registration
  PROTECTED_PAGE: {
    requireAuth: true,
    requireCompleteRegistration: true,
    redirectOnAuthFail: "/",
    redirectOnIncompleteRegistration: "/complete-registration",
    showToastOnAuthFail: true,
    showToastOnIncompleteRegistration: true,
  },

  // For pages that only require authentication (registration can be incomplete)
  AUTH_ONLY: {
    requireAuth: true,
    requireCompleteRegistration: false,
    redirectOnAuthFail: "/",
    showToastOnAuthFail: true,
    showToastOnIncompleteRegistration: false,
  },

  // For pages that should redirect but not show toasts
  SILENT_REDIRECT: {
    requireAuth: true,
    requireCompleteRegistration: true,
    redirectOnAuthFail: "/",
    redirectOnIncompleteRegistration: "/complete-registration",
    showToastOnAuthFail: false,
    showToastOnIncompleteRegistration: false,
  },

  // For optional authentication (no redirects, just status checking)
  OPTIONAL_AUTH: {
    requireAuth: false,
    requireCompleteRegistration: false,
    showToastOnAuthFail: false,
    showToastOnIncompleteRegistration: false,
  },
} as const;
