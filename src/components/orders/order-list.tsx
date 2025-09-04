'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useOrders } from '@/services/api/orders';
import { Button } from '@/components/ui/button';
import { OrderItem } from './order-item';

export function OrderList() {
  const { t } = useTranslation('orders');
  const [page, setPage] = useState(1);
  const { data: ordersResponse, isLoading, isError } = useOrders(page);

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

  if (!ordersResponse?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">{t('noOrders')}</p>
        <Button variant="outline" asChild>
          <a href="/products">{t('continueShopping')}</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <div className="space-y-4">
        {ordersResponse.data.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
      {ordersResponse.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            {t('previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('page', { current: page, total: ordersResponse.meta.last_page })}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === ordersResponse.meta.last_page}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  );
}