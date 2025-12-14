import { useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import {
  notificationPollingService,
  NotificationPollingConfig,
} from "@/services/notificationPollingService";

interface UseNotificationPollingServiceOptions
  extends Partial<NotificationPollingConfig> {
  /** Whether to start polling immediately */
  autoStart?: boolean;
}

export const useNotificationPollingService = (
  options: UseNotificationPollingServiceOptions = {}
) => {
  const { autoStart = true, ...config } = options;
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const isInitializedRef = useRef(false);

  // Initialize the service with configuration
  useEffect(() => {
    if (!isInitializedRef.current) {
      notificationPollingService.updateConfig(config);
      isInitializedRef.current = true;
    }
  }, [config]);

  // Set up callbacks
  useEffect(() => {
    const handleUpdate = () => {
      // Invalidate all notification queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    const handleError = (error: Error) => {
      console.debug("Notification polling error:", error);
    };

    notificationPollingService.setOnUpdate(handleUpdate);
    notificationPollingService.setOnError(handleError);

    return () => {
      notificationPollingService.setOnUpdate(undefined);
      notificationPollingService.setOnError(undefined);
    };
  }, [queryClient]);

  // Handle authentication state changes
  useEffect(() => {
    if (autoStart && isAuthenticated) {
      notificationPollingService.start(isAuthenticated);
    } else {
      notificationPollingService.stop();
    }

    return () => {
      notificationPollingService.stop();
    };
  }, [isAuthenticated, autoStart]);

  // Handle window focus/blur
  useEffect(() => {
    const handleFocus = () => {
      notificationPollingService.handleWindowFocus(true, isAuthenticated);
    };

    const handleBlur = () => {
      notificationPollingService.handleWindowFocus(false, isAuthenticated);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isAuthenticated]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === "visible";
      notificationPollingService.handleVisibilityChange(
        isVisible,
        isAuthenticated
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // Manual controls
  const startPolling = useCallback(() => {
    notificationPollingService.start(isAuthenticated);
  }, [isAuthenticated]);

  const stopPolling = useCallback(() => {
    notificationPollingService.stop();
  }, []);

  const fetchNow = useCallback(async () => {
    await notificationPollingService.fetchNow(isAuthenticated);
  }, [isAuthenticated]);

  const getStatus = useCallback(() => {
    return notificationPollingService.getStatus();
  }, []);

  return {
    startPolling,
    stopPolling,
    fetchNow,
    getStatus,
  };
};
