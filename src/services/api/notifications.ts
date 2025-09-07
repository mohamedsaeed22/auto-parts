import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/lib/toast";

export interface Notification {
  id: number;
  type: "order_status" | "order_delivery" | "promotion" | "system";
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
  };
}

const notificationsKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationsKeys.all, "list"] as const,
  list: (page: number) => [...notificationsKeys.lists(), { page }] as const,
};

const getNotifications = async ({ page = 1 }: { page?: number }) => {
  const { data } = await axios.get<NotificationsResponse>(
    "/api/notifications",
    {
      params: { page },
    }
  );
  return data;
};

const markAsRead = async (id: number) => {
  const { data } = await axios.post<NotificationsResponse>(
    `/api/notifications/${id}/read`
  );
  return data;
};

const markAllAsRead = async () => {
  const { data } = await axios.post<NotificationsResponse>(
    "/api/notifications/read-all"
  );
  return data;
};

const deleteNotification = async (id: number) => {
  const { data } = await axios.delete<NotificationsResponse>(
    `/api/notifications/${id}`
  );
  return data;
};

const deleteAllNotifications = async () => {
  const { data } = await axios.delete<NotificationsResponse>(
    "/api/notifications"
  );
  return data;
};

export function useNotifications(page = 1) {
  return useQuery({
    queryKey: notificationsKeys.list(page),
    queryFn: () => getNotifications({ page }),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (data) => {
      queryClient.setQueryData(notificationsKeys.list(1), data);
      showSuccess("Notification marked as read");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to mark notification as read"
      );
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: (data) => {
      queryClient.setQueryData(notificationsKeys.list(1), data);
      showSuccess("All notifications marked as read");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to mark all notifications as read"
      );
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (data) => {
      queryClient.setQueryData(notificationsKeys.list(1), data);
      showSuccess("Notification deleted successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete notification"
      );
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: (data) => {
      queryClient.setQueryData(notificationsKeys.list(1), data);
      showSuccess("All notifications deleted successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete all notifications"
      );
    },
  });
}
