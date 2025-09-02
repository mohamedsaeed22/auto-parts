"use client";

import { useState } from "react";
import { Bell, Package, ShoppingCart, Tag, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Notification {
  id: number;
  type: "order" | "promotion" | "system" | "delivery";
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "order",
      title: isRTL ? "تم تأكيد طلبك" : "Order Confirmed",
      message: isRTL
        ? "تم تأكيد طلبك رقم ORD-2024-001 بنجاح. سيتم شحنه خلال 2-3 أيام عمل."
        : "Your order ORD-2024-001 has been confirmed successfully. It will be shipped within 2-3 business days.",
      date: "2024-01-25 14:30",
      isRead: false,
      actionUrl: "/orders/ORD-2024-001",
    },
    {
      id: 2,
      type: "delivery",
      title: isRTL ? "تم شحن طلبك" : "Order Shipped",
      message: isRTL
        ? "تم شحن طلبك رقم ORD-2024-002. رقم التتبع: TRK987654321"
        : "Your order ORD-2024-002 has been shipped. Tracking number: TRK987654321",
      date: "2024-01-24 09:15",
      isRead: false,
      actionUrl: "/orders/ORD-2024-002",
    },
    {
      id: 3,
      type: "promotion",
      title: isRTL ? "عرض خاص على الفرامل" : "Special Offer on Brakes",
      message: isRTL
        ? "خصم 25% على جميع أنواع الفرامل. العرض ساري حتى نهاية الشهر."
        : "25% discount on all brake types. Offer valid until end of month.",
      date: "2024-01-23 16:45",
      isRead: true,
      actionUrl: "/products?category=brakes",
    },
    {
      id: 4,
      type: "system",
      title: isRTL ? "تحديث سياسة الخصوصية" : "Privacy Policy Update",
      message: isRTL
        ? "تم تحديث سياسة الخصوصية الخاصة بنا. يرجى مراجعتها."
        : "Our privacy policy has been updated. Please review it.",
      date: "2024-01-22 11:20",
      isRead: true,
    },
    {
      id: 5,
      type: "order",
      title: isRTL ? "تم توصيل طلبك" : "Order Delivered",
      message: isRTL
        ? "تم توصيل طلبك رقم ORD-2024-003 بنجاح. نأمل أن تكون راضياً عن منتجاتنا."
        : "Your order ORD-2024-003 has been delivered successfully. We hope you're satisfied with our products.",
      date: "2024-01-21 13:10",
      isRead: true,
      actionUrl: "/orders/ORD-2024-003",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingCart size={20} className="text-blue-500" />;
      case "delivery":
        return <Package size={20} className="text-green-500" />;
      case "promotion":
        return <Tag size={20} className="text-orange-500" />;
      case "system":
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getNotificationTypeText = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return t("notifications.types.order");
      case "delivery":
        return t("notifications.types.delivery");
      case "promotion":
        return t("notifications.types.promotion");
      case "system":
        return t("notifications.types.system");
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2
          className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("notifications.title")}
        </h2>
        <div
          className={`flex items-center gap-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="text-sm text-gray-600">
            {unreadCount} {isRTL ? "إشعارات جديدة" : "new notifications"}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <Check size={16} />
              {t("notifications.markAllRead")}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`flex gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          {t("notifications.filters.all")} ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          {t("notifications.filters.unread")} ({unreadCount})
        </Button>
        <Button
          variant={filter === "read" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("read")}
        >
          {t("notifications.filters.read")} (
          {notifications.length - unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 transition-colors ${
              notification.isRead
                ? "bg-white border-gray-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div
              className={`flex items-start gap-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                <div
                  className={`flex items-center justify-between mb-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check size={14} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-gray-600">
                      {getNotificationTypeText(notification.type)} •{" "}
                      {notification.date}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{notification.message}</p>

                {notification.actionUrl && (
                  <Button size="sm" variant="outline">
                    {isRTL ? "عرض التفاصيل" : "View Details"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("notifications.empty")}
          </h3>
          <p className="text-gray-500">{t("notifications.emptyDesc")}</p>
        </div>
      )}
    </div>
  );
}
