'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Check, Trash2 } from 'lucide-react';
import {
  useNotifications,
  useMarkAllAsRead,
  useDeleteAllNotifications,
} from '@/services/api/notifications';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './notification-item';

export function NotificationList() {
  const { t } = useTranslation('notifications');
  const [page, setPage] = useState(1);
  const { data: notificationsResponse, isLoading, isError } = useNotifications(
    page
  );
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteAllNotificationsMutation = useDeleteAllNotifications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">
          {t('errors.loadingFailed')}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  if (!notificationsResponse?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">{t('empty')}</p>
      </div>
    );
  }

  const hasUnread = notificationsResponse.meta.unread_count > 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t('title')}
          {hasUnread && (
            <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
              {notificationsResponse.meta.unread_count}
            </span>
          )}
        </h1>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={
                markAllAsReadMutation.isPending ||
                deleteAllNotificationsMutation.isPending
              }
            >
              <Check className="h-4 w-4" />
              {t('markAllAsRead')}
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (window.confirm(t('confirmDeleteAll'))) {
                deleteAllNotificationsMutation.mutate();
              }
            }}
            disabled={
              markAllAsReadMutation.isPending ||
              deleteAllNotificationsMutation.isPending
            }
          >
            <Trash2 className="h-4 w-4" />
            {t('deleteAll')}
          </Button>
        </div>
      </div>
      <div className="divide-y rounded-lg border">
        {notificationsResponse.data.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
      {notificationsResponse.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            {t('previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('page', {
              current: page,
              total: notificationsResponse.meta.last_page,
            })}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === notificationsResponse.meta.last_page}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  );
}