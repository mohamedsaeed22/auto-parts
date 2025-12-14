'use client';

import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Order, useCancelOrder } from '@/services/api/orders';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrderItemProps {
  order: Order;
  className?: string;
}

export function OrderItem({ order, className }: OrderItemProps) {
  const { t } = useTranslation('orders');
  const cancelOrderMutation = useCancelOrder();

  const handleCancel = async () => {
    if (window.confirm(t('confirmCancel'))) {
      await cancelOrderMutation.mutateAsync(order.id);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'processing':
        return 'text-blue-500';
      case 'shipped':
        return 'text-purple-500';
      case 'delivered':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPaymentStatusColor = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className={cn('space-y-4 rounded-lg border p-4', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('orderNumber')}:</span>
            <span>{order.order_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('date')}:</span>
            <span>
              {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('status')}:</span>
            <span className={getStatusColor(order.status)}>
              {t(`statuses.${order.status}`)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{t('paymentStatus')}:</span>
            <span className={getPaymentStatusColor(order.payment_status)}>
              {t(`paymentStatuses.${order.payment_status}`)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{t('deliveryAddress')}:</span>
          <span className="text-muted-foreground">
            {order.address.address}, {order.address.city}, {order.address.state}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">{t('paymentMethod')}:</span>
          <span className="text-muted-foreground">
            {t(`paymentMethods.${order.payment_method}`)}
          </span>
        </div>
      </div>

      <div className="space-y-2 divide-y rounded-lg border">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              <div className="text-sm text-muted-foreground">
                {t('quantity')}: {item.quantity}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {t('currency', { value: item.final_price })}
              </div>
              {item.discount_price && (
                <div className="text-sm text-muted-foreground line-through">
                  {t('currency', { value: item.price })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('subtotal')}:</span>
          <span className="font-medium">
            {t('currency', { value: order.subtotal })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('discount')}:</span>
          <span className="font-medium text-destructive">
            -{t('currency', { value: order.discount })}
          </span>
        </div>
        <div className="flex items-center justify-between text-base font-bold">
          <span>{t('total')}:</span>
          <span>{t('currency', { value: order.total })}</span>
        </div>
      </div>

      {order.status === 'pending' && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleCancel}
          disabled={cancelOrderMutation.isPending}
        >
          {t('cancel')}
        </Button>
      )}
    </div>
  );
}