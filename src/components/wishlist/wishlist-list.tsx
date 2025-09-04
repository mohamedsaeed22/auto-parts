'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Trash2 } from 'lucide-react';
import { useWishlist, useClearWishlist } from '@/services/api/wishlist';
import { Button } from '@/components/ui/button';
import { WishlistItem } from './wishlist-item';

export function WishlistList() {
  const { t } = useTranslation('wishlist');
  const [page, setPage] = useState(1);
  const { data: wishlistResponse, isLoading, isError } = useWishlist(page);
  const clearWishlistMutation = useClearWishlist();

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

  if (!wishlistResponse?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">{t('empty')}</p>
        <Button variant="outline" asChild>
          <a href="/products">{t('continueShopping')}</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          onClick={() => {
            if (window.confirm(t('confirmClear'))) {
              clearWishlistMutation.mutate();
            }
          }}
          disabled={clearWishlistMutation.isPending}
        >
          <Trash2 className="h-4 w-4" />
          {t('clearWishlist')}
        </Button>
      </div>
      <div className="divide-y rounded-lg border">
        {wishlistResponse.data.map((item) => (
          <WishlistItem key={item.id} item={item} className="p-4" />
        ))}
      </div>
      {wishlistResponse.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            {t('previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('page', { current: page, total: wishlistResponse.meta.last_page })}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === wishlistResponse.meta.last_page}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  );
}