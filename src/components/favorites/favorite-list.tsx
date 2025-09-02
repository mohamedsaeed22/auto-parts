'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Trash2 } from 'lucide-react';
import { useFavorites, useClearFavorites } from '@/services/api/favorites';
import { Button } from '@/components/ui/button';
import { FavoriteItem } from './favorite-item';

export function FavoriteList() {
  const { t } = useTranslation('favorites');
  const [page, setPage] = useState(1);
  const { data: favoritesResponse, isLoading, isError } = useFavorites(page);
  const clearFavoritesMutation = useClearFavorites();

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

  if (!favoritesResponse?.data.length) {
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
              clearFavoritesMutation.mutate();
            }
          }}
          disabled={clearFavoritesMutation.isPending}
        >
          <Trash2 className="h-4 w-4" />
          {t('clearFavorites')}
        </Button>
      </div>
      <div className="divide-y rounded-lg border">
        {favoritesResponse.data.map((item) => (
          <FavoriteItem key={item.id} item={item} className="p-4" />
        ))}
      </div>
      {favoritesResponse.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            {t('previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('page', { current: page, total: favoritesResponse.meta.last_page })}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === favoritesResponse.meta.last_page}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  );
}