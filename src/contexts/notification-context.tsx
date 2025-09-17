"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationCount } from "@/services/api/notifications";

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

  // Get notification count from API
  const { data: countData } = useNotificationCount();

  // Update unread count when data changes
  useEffect(() => {
    if (isAuthenticated && countData !== undefined) {
      setUnreadCount(countData);
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, countData]);

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
