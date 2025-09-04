'use client';

import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, X } from 'lucide-react';
import { ReturnItem as ReturnItemType, useCancelReturn } from '@/services/api/returns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReturnItemProps {
  item: ReturnItemType;
  className?: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export function ReturnItem({ item, className }: ReturnItemProps) {
  const { t, i18n } = useTranslation('returns');
  const cancelReturnMutation = useCancelReturn();

  const handleCancel = async () => {
    if (window.confirm(t('confirmCancel'))) {
      await cancelReturnMutation.mutateAsync(item.id);
    }
  };

  const isDiscounted = item.product.discount_price !== null;
  const price = isDiscounted
    ? item.product.discount_price!
    : item.product.price;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">
            {t('returnRequest')} #{item.id}
          </CardTitle>
          <CardDescription>
            {formatDistanceToNow(new Date(item.created_at), {
              addSuffix: true,
              locale: i18n.language === 'ar' ? ar : enUS,
            })}
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            'capitalize',
            statusColors[item.status as keyof typeof statusColors]
          )}
        >
          {t(`status.${item.status}`)}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={`/products/${item.product.id}`}
            className="relative aspect-square h-20 w-20 overflow-hidden rounded-lg"
          >
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          </Link>
          <div className="flex flex-1 flex-col justify-between">
            <div className="space-y-1">
              <Link
                href={`/products/${item.product.id}`}
                className="text-sm font-medium hover:underline"
              >
                {item.product.name}
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {t('currency', { value: price })}
                </span>
                {isDiscounted && (
                  <span className="text-sm text-muted-foreground line-through">
                    {t('currency', { value: item.product.price })}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('quantity')}: {item.quantity}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('reason')}:</p>
          <p className="text-sm text-muted-foreground">{item.reason}</p>
        </div>
        {item.status === 'pending' && (
          <Button
            variant="destructive"
            size="sm"
            className="w-full gap-2"
            onClick={handleCancel}
            disabled={cancelReturnMutation.isPending}
          >
            {cancelReturnMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {t('cancel')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}