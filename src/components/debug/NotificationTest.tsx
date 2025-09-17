"use client";

import { useState } from "react";
import { useNotifications } from "@/services/api/notifications";
import {
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/services/api/notifications";

export default function NotificationTest() {
  const [showTest, setShowTest] = useState(false);
  const { data: notificationsData, isLoading, error } = useNotifications(1, 5);
  const deleteNotificationMutation = useDeleteNotification();
  const deleteAllNotificationsMutation = useDeleteAllNotifications();

  const notifications = notificationsData?.data?.items || [];
  const totalCount = notificationsData?.data?.pagination?.total || 0;

  if (!showTest) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowTest(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          Test Notifications
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Notification Test</h3>
        <button
          onClick={() => setShowTest(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Status:</strong>{" "}
          {isLoading ? "Loading..." : error ? "Error" : "Loaded"}
        </div>
        <div>
          <strong>Total Count:</strong> {totalCount}
        </div>
        <div>
          <strong>Current Page:</strong> {notifications.length} notifications
        </div>

        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="max-h-32 overflow-y-auto">
            <strong>Notifications:</strong>
            <ul className="list-disc list-inside space-y-1">
              {notifications.map((notification) => (
                <li key={notification.id} className="text-xs">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-gray-600">{notification.created_at}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => deleteAllNotificationsMutation.mutate()}
            disabled={
              deleteAllNotificationsMutation.isPending || totalCount === 0
            }
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
          >
            Delete All
          </button>
          {notifications.length > 0 && (
            <button
              onClick={() =>
                deleteNotificationMutation.mutate(notifications[0].id)
              }
              disabled={deleteNotificationMutation.isPending}
              className="bg-orange-500 text-white px-2 py-1 rounded text-xs hover:bg-orange-600 disabled:opacity-50"
            >
              Delete First
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
