"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationCount } from "@/services/api/notifications";
import { useNotificationPollingService } from "@/hooks/useNotificationPollingService";

interface NotificationContextType {
  unreadCount: number;
  refreshNotifications: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize notification polling with smart options
  useNotificationPollingService({
    baseInterval: 30000, // 30 seconds
    maxInterval: 300000, // 5 minutes
    useExponentialBackoff: true,
    maxErrors: 5,
    pollWhenHidden: false, // Don't poll when tab is hidden
    pollWhenUnauthenticated: false, // Don't poll when not authenticated
    autoStart: true,
  });

  // Get notification count from API
  const countData = useNotificationCount();

  // Update unread count when data changes
  useEffect(() => {
    if (isAuthenticated && countData !== undefined) {
      setUnreadCount(countData);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, countData]);

  // Listen for logout event to clear notification cache
  useEffect(() => {
    const handleLogout = () => {
      // Clear all notification-related queries from React Query cache
      queryClient.removeQueries({ queryKey: ["notifications"] });
      // Reset unread count immediately
      setUnreadCount(0);
    };

    window.addEventListener("userLogout", handleLogout);

    return () => {
      window.removeEventListener("userLogout", handleLogout);
    };
  }, [queryClient]);

  // Reset notifications when user changes or logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      queryClient.removeQueries({ queryKey: ["notifications"] });
    }
  }, [isAuthenticated, queryClient]);

  const refreshNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAsRead = (notificationId: string) => {
    // For now, we'll just refresh the notifications
    // In a real app, you might want to call an API to mark as read
    refreshNotifications();
  };

  const markAllAsRead = () => {
    // For now, we'll just refresh the notifications
    // In a real app, you might want to call an API to mark all as read
    refreshNotifications();
  };

  const value: NotificationContextType = {
    unreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
