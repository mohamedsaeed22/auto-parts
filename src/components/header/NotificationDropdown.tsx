"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Trash2,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import {
  useNotifications,
  useDeleteNotification,
  useDeleteAllNotifications,
  Notification,
} from "@/services/api/notifications";
import { showError } from "@/lib/toast";

interface NotificationDropdownProps {
  isRTL: boolean;
}

export default function NotificationDropdown({
  isRTL,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("notifications");

  const perPage = 5;
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useNotifications(currentPage, perPage);

  const deleteNotificationMutation = useDeleteNotification();
  const deleteAllNotificationsMutation = useDeleteAllNotifications();

  const notifications = notificationsData?.data?.items || [];
  const pagination = notificationsData?.data?.pagination;
  const totalNotifications = pagination?.total || 0;
  const hasMorePages = pagination
    ? pagination.current_page < pagination.last_page
    : false;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      showError("Failed to refresh notifications");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteAll = async () => {
    if (totalNotifications === 0) return;

    try {
      await deleteAllNotificationsMutation.mutateAsync();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleShowMore = () => {
    if (hasMorePages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setShowAll(true);
    }
  };

  const formatTimeAgo = (timeString: string) => {
    // The API already returns formatted time like "6 minutes ago"
    return timeString;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-700 hover:text-primary transition-colors"
        title={t("title") || "Notifications"}
      >
        <div className="relative">
          <Bell size={20} />
          {totalNotifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-2 ${
                isRTL ? "-left-2" : "-right-2"
              } bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium`}
            >
              {totalNotifications > 99 ? "99+" : totalNotifications}
            </motion.span>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-full mt-2 ${
              isRTL ? "left-0" : "right-0"
            } w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 max-h-96 overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-900">
                {t("title") || "Notifications"}
              </h3>
              <div className="flex items-center gap-2">
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-1 text-neutral-500 hover:text-primary transition-colors disabled:opacity-50"
                  title={t("refresh") || "Refresh"}
                >
                  <RefreshCw
                    size={16}
                    className={isLoading ? "animate-spin" : ""}
                  />
                </button>

                {/* Delete All Button */}
                {totalNotifications > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    disabled={deleteAllNotificationsMutation.isPending}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                    title={t("deleteAll") || "Delete All"}
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw
                    size={20}
                    className="animate-spin text-neutral-400"
                  />
                  <span className="ml-2 text-sm text-neutral-500">
                    {t("loading") || "Loading..."}
                  </span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle size={24} className="text-red-500 mb-2" />
                  <p className="text-sm text-red-600 mb-2">
                    {t("error") || "Failed to load notifications"}
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("retry") || "Try again"}
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell size={24} className="text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-500">
                    {t("empty") || "No notifications yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 hover:bg-neutral-50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-neutral-900 mb-1 line-clamp-2">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-neutral-600 mb-2 line-clamp-3">
                            {notification.body}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          disabled={deleteNotificationMutation.isPending}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-all disabled:opacity-50"
                          title={t("delete") || "Delete"}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-neutral-100 p-3">
                {hasMorePages && !showAll ? (
                  <button
                    onClick={handleShowMore}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                  >
                    <MoreHorizontal size={16} />
                    {t("showMore") || "Show More"}
                    <ChevronDown size={14} />
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-neutral-500">
                      {t("showing") || "Showing"} {notifications.length}{" "}
                      {t("of") || "of"} {totalNotifications}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
