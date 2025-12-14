"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { showError } from "@/lib/toast";
import { storage } from "@/lib/storage";
import type { RegistrationIncompleteErrorResponse } from "@/services/api/baseApi";

interface ApiError {
  status?: number;
  data?: unknown;
}

interface UseApiErrorHandlerOptions {
  showToasts?: boolean;
  autoRedirect?: boolean;
  onAuthError?: () => void;
  onRegistrationIncomplete?: () => void;
}

export function useApiErrorHandler(
  error: FetchBaseQueryError | RegistrationIncompleteErrorResponse | undefined,
  options: UseApiErrorHandlerOptions = {}
) {
  const router = useRouter();
  const { t } = useTranslation("auth");

  const {
    showToasts = true,
    autoRedirect = true,
    onAuthError,
    onRegistrationIncomplete,
  } = options;

  useEffect(() => {
    if (!error) return;

    const apiError = error as ApiError;

    // Handle 401 Unauthorized
    if (apiError.status === 401) {
      if (showToasts) {
        showError(
          t("errors.sessionExpired", {
            ns: "auth",
            defaultValue: "Your session has expired. Please login again.",
          })
        );
      }

      if (onAuthError) {
        onAuthError();
      } else if (autoRedirect) {
        // Store current page for redirect after login
        storage.setPreviousPage(window.location.pathname);
        router.push("/");
      }
    }

    // Handle 403 Registration Incomplete
    if (apiError.status === 403) {
      const errorData = apiError.data as {
        data?: { is_registration_complete?: boolean };
      };

      if (errorData?.data?.is_registration_complete === false) {
        if (showToasts) {
          showError(
            t("errors.completeRegistrationRequired", {
              ns: "auth",
              defaultValue:
                "Please complete your registration to access this feature.",
            })
          );
        }

        if (onRegistrationIncomplete) {
          onRegistrationIncomplete();
        } else if (autoRedirect) {
          router.push("/complete-registration");
        }
      }
    }
  }, [
    error,
    showToasts,
    autoRedirect,
    onAuthError,
    onRegistrationIncomplete,
    router,
    t,
  ]);

  // Helper function to check if error is registration incomplete
  const isRegistrationIncompleteError = (err: unknown): boolean => {
    const apiError = err as {
      status?: number;
      data?: { data?: { is_registration_complete?: boolean } };
    };
    return (
      apiError?.status === 403 &&
      apiError?.data?.data?.is_registration_complete === false
    );
  };

  // Helper function to check if error is auth error
  const isAuthError = (err: unknown): boolean => {
    const apiError = err as { status?: number };
    return apiError?.status === 401;
  };

  return {
    isRegistrationIncompleteError: error
      ? isRegistrationIncompleteError(error)
      : false,
    isAuthError: error ? isAuthError(error) : false,
    hasError: !!error,
  };
}

// Hook specifically for handling RTK Query mutation errors
export function useMutationErrorHandler(
  options: UseApiErrorHandlerOptions = {}
) {
  const router = useRouter();
  const { t } = useTranslation("auth");

  const handleError = (error: unknown) => {
    const {
      showToasts = true,
      autoRedirect = true,
      onAuthError,
      onRegistrationIncomplete,
    } = options;

    if (!error) return;

    const apiError = error as {
      status?: number;
      data?: { data?: { is_registration_complete?: boolean } };
    };

    // Handle 401 Unauthorized
    if (apiError.status === 401) {
      if (showToasts) {
        showError(
          t("errors.sessionExpired", {
            ns: "auth",
            defaultValue: "Your session has expired. Please login again.",
          })
        );
      }

      if (onAuthError) {
        onAuthError();
      } else if (autoRedirect) {
        storage.setPreviousPage(window.location.pathname);
        router.push("/");
      }
    }

    // Handle 403 Registration Incomplete
    if (
      apiError.status === 403 &&
      apiError.data?.data?.is_registration_complete === false
    ) {
      if (showToasts) {
        showError(
          t("errors.completeRegistrationRequired", {
            ns: "auth",
            defaultValue:
              "Please complete your registration to access this feature.",
          })
        );
      }

      if (onRegistrationIncomplete) {
        onRegistrationIncomplete();
      } else if (autoRedirect) {
        router.push("/complete-registration");
      }
    }
  };

  return { handleError };
}
