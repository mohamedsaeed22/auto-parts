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

export interface NotificationsApiResponse
  extends ApiResponse<NotificationsResponse> {}

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
    const { getCurrentLocale } = require("@/lib/localeService");
    const locale = getCurrentLocale();
    headers.locale = locale;
    headers["Accept-Language"] = locale;
    console.log("Notifications API - Setting locale header:", locale);
  } catch (error) {
    console.warn(
      "Notifications API - Failed to get locale, using default:",
      error
    );
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
    throw new Error(error.message || "An error occurred");
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
    refetchOnWindowFocus: true,
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
        const { getCurrentLocale } = require("@/lib/localeService");
        const locale = getCurrentLocale();
        const translations = require(`@/lib/i18n/translations/${locale}/notifications.json`);
        const message =
          translations?.success?.deleted || "Notification deleted successfully";
        showSuccess(message);
      } catch (e) {
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
        const { getCurrentLocale } = require("@/lib/localeService");
        const locale = getCurrentLocale();
        const translations = require(`@/lib/i18n/translations/${locale}/notifications.json`);
        const message =
          translations?.success?.allDeleted ||
          "All notifications deleted successfully";
        showSuccess(message);
      } catch (e) {
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
  const { data } = useNotifications(1, 1); // Only get first page to get total count
  return data?.data?.pagination?.total || 0;
};
