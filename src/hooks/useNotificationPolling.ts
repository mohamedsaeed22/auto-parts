import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getNotifications } from "@/services/api/notifications";

interface UseNotificationPollingOptions {
  /** Polling interval in milliseconds (default: 30000 = 30 seconds) */
  interval?: number;
  /** Whether to poll when window is not visible (default: false) */
  pollWhenHidden?: boolean;
  /** Whether to poll when user is not authenticated (default: false) */
  pollWhenUnauthenticated?: boolean;
  /** Whether to immediately fetch when window becomes visible (default: true) */
  fetchOnFocus?: boolean;
  /** Whether to immediately fetch when page becomes visible (default: true) */
  fetchOnVisibilityChange?: boolean;
}

export const useNotificationPolling = (
  options: UseNotificationPollingOptions = {}
) => {
  const {
    interval = 30000, // 30 seconds
    pollWhenHidden = false,
    pollWhenUnauthenticated = false,
    fetchOnFocus = true,
    fetchOnVisibilityChange = true,
  } = options;

  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const [isPolling, setIsPolling] = useState(false);
  const errorCountRef = useRef(0);

  // Function to fetch notifications with exponential backoff
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated && !pollWhenUnauthenticated) {
      return;
    }

    try {
      // Fetch notifications for the first page to update the count
      await getNotifications(1, 5);

      // Invalidate all notification queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // Reset error count on successful fetch
      errorCountRef.current = 0;
    } catch (error) {
      // Increment error count and implement exponential backoff
      errorCountRef.current += 1;
      console.debug("Notification polling error:", error);

      // If too many errors, temporarily stop polling
      if (errorCountRef.current >= 5) {
        console.warn(
          "Too many notification polling errors, temporarily stopping"
        );
        stopPolling();
        // Restart polling after a longer delay
        setTimeout(() => {
          errorCountRef.current = 0;
          if (isAuthenticated) {
            startPolling();
          }
        }, 60000); // 1 minute delay
      }
    }
  }, [isAuthenticated, pollWhenUnauthenticated, queryClient]);

  // Start polling
  const startPolling = useCallback(() => {
    if (isPollingRef.current) return;

    isPollingRef.current = true;
    setIsPolling(true);
    intervalRef.current = setInterval(fetchNotifications, interval);
  }, [fetchNotifications, interval]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
    setIsPolling(false);
  }, []);

  // Handle window focus
  const handleWindowFocus = useCallback(() => {
    if (fetchOnFocus && isAuthenticated) {
      fetchNotifications();
    }
    if (isAuthenticated) {
      startPolling();
    }
  }, [fetchOnFocus, isAuthenticated, fetchNotifications, startPolling]);

  // Handle window blur
  const handleWindowBlur = useCallback(() => {
    if (!pollWhenHidden) {
      stopPolling();
    }
  }, [pollWhenHidden, stopPolling]);

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      if (fetchOnVisibilityChange && isAuthenticated) {
        fetchNotifications();
      }
      if (isAuthenticated) {
        startPolling();
      }
    } else {
      if (!pollWhenHidden) {
        stopPolling();
      }
    }
  }, [
    fetchOnVisibilityChange,
    isAuthenticated,
    fetchNotifications,
    startPolling,
    pollWhenHidden,
    stopPolling,
  ]);

  // Effect to manage polling based on authentication state
  useEffect(() => {
    if (isAuthenticated) {
      // Initial fetch
      fetchNotifications();
      // Start polling
      startPolling();
    } else {
      // Stop polling when not authenticated
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isAuthenticated, fetchNotifications, startPolling, stopPolling]);

  // Effect to handle window focus/blur events
  useEffect(() => {
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [handleWindowFocus, handleWindowBlur]);

  // Effect to handle visibility change events
  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    startPolling,
    stopPolling,
    fetchNotifications,
    isPolling,
  };
};
