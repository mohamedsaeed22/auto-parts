import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/lib/storage";
import { showError, showSuccess } from "@/lib/toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  errors: string[];
  data: T;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface NotificationsResponse {
  items: Notification[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export type NotificationsApiResponse = ApiResponse<NotificationsResponse>;

// Custom error type for API errors
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// API Helper Functions
const getHeaders = () => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = storage.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Add locale header for proper language response
  try {
    // Import getCurrentLocale dynamically to avoid circular dependencies
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCurrentLocale } = require("@/lib/localeService");
    const locale = getCurrentLocale();
    headers.locale = locale;
    headers["Accept-Language"] = locale;
  } catch {
    headers.locale = "ar";
    headers["Accept-Language"] = "ar";
  }

  return headers;
};

const handleResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const error = await response.json();
    const errorMessage = error.message || "An error occurred";

    // If it's a 401 error, we should handle it specially
    if (response.status === 401) {
      throw new ApiError(errorMessage, 401);
    }

    throw new Error(errorMessage);
  }
  return response.json();
};

// Notification API Functions
export const getNotifications = async (
  page: number = 1,
  perPage: number = 5
): Promise<NotificationsApiResponse> => {
  const response = await fetch(
    `${BASE_URL}/notifications?page=${page}&per_page=${perPage}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );
  return handleResponse(response);
};

export const deleteNotification = async (
  notificationId: string
): Promise<ApiResponse> => {
  const response = await fetch(
    `${BASE_URL}/notifications/delete/${notificationId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );
  return handleResponse(response);
};

export const deleteAllNotifications = async (): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/notifications/delete-all`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(response);
};

// Custom Hooks
export const useNotifications = (page: number = 1, perPage: number = 5) => {
  return useQuery<NotificationsApiResponse, Error>({
    queryKey: ["notifications", page, perPage],
    queryFn: () => getNotifications(page, perPage),
    enabled: !!storage.getToken(),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false, // Disable aggressive refetching (handled by polling)
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: (failureCount, error: Error | ApiError) => {
      // Don't retry on 401 errors (authentication issues)
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      if (
        error?.message?.includes("401") ||
        error?.message?.includes("Unauthorized")
      ) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, string>({
    mutationFn: deleteNotification,
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getCurrentLocale } = require("@/lib/localeService");
        const locale = getCurrentLocale();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const translations = require(`@/lib/i18n/translations/${locale}/notifications.json`);
        const message =
          translations?.success?.deleted || "Notification deleted successfully";
        showSuccess(message);
      } catch {
        showSuccess("Notification deleted successfully");
      }
    },
    onError: (error) => {
      showError(error.message);
    },
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, void>({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getCurrentLocale } = require("@/lib/localeService");
        const locale = getCurrentLocale();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const translations = require(`@/lib/i18n/translations/${locale}/notifications.json`);
        const message =
          translations?.success?.allDeleted ||
          "All notifications deleted successfully";
        showSuccess(message);
      } catch {
        showSuccess("All notifications deleted successfully");
      }
    },
    onError: (error) => {
      showError(error.message);
    },
  });
};

// Hook to get notification count
export const useNotificationCount = () => {
  const { data, error } = useNotifications(1, 1); // Only get first page to get total count

  // Return 0 if there's an authentication error
  if (error instanceof ApiError && error.status === 401) {
    return 0;
  }
  if (
    error?.message?.includes("401") ||
    error?.message?.includes("Unauthorized")
  ) {
    return 0;
  }

  return data?.data?.pagination?.total || 0;
};
