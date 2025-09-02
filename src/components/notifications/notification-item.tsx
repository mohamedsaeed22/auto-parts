'use client';

import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Bell, Package, Tag, Info, Check, Trash2 } from 'lucide-react';
import {
  Notification as NotificationType,
  useMarkAsRead,
  useDeleteNotification,
} from '@/services/api/notifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: NotificationType;
  className?: string;
}

const notificationIcons = {
  order_status: Package,
  order_delivery: Package,
  promotion: Tag,
  system: Info,
};

export function NotificationItem({
  notification,
  className,
}: NotificationItemProps) {
  const { t, i18n } = useTranslation('notifications');
  const markAsReadMutation = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const Icon = notificationIcons[notification.type];

  const handleMarkAsRead = async () => {
    await markAsReadMutation.mutateAsync(notification.id);
  };

  const handleDelete = async () => {
    await deleteNotificationMutation.mutateAsync(notification.id);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4',
        !notification.read_at && 'bg-muted/50',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full p-2',
          notification.type === 'order_status' && 'bg-blue-100 text-blue-600',
          notification.type === 'order_delivery' && 'bg-green-100 text-green-600',
          notification.type === 'promotion' && 'bg-yellow-100 text-yellow-600',
          notification.type === 'system' && 'bg-red-100 text-red-600'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium">{notification.title}</h4>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: i18n.language === 'ar' ? ar : enUS,
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <div className="flex items-center gap-2 pt-2">
          {!notification.read_at && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2"
              onClick={handleMarkAsRead}
              disabled={
                markAsReadMutation.isPending ||
                deleteNotificationMutation.isPending
              }
            >
              <Check className="h-4 w-4" />
              {t('markAsRead')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={
              markAsReadMutation.isPending || deleteNotificationMutation.isPending
            }
          >
            <Trash2 className="h-4 w-4" />
            {t('delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}