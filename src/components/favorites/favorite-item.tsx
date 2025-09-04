'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { FavoriteItem as FavoriteItemType, useRemoveFromFavorites } from '@/services/api/favorites';
import { useAddToCart } from '@/services/api/cart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FavoriteItemProps {
  item: FavoriteItemType;
  className?: string;
}

export function FavoriteItem({ item, className }: FavoriteItemProps) {
  const { t } = useTranslation(['products', 'favorites']);
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const addToCartMutation = useAddToCart();

  const handleRemove = async () => {
    await removeFromFavoritesMutation.mutateAsync(item.id);
  };

  const handleAddToCart = async () => {
    await addToCartMutation.mutateAsync({
      product_id: item.product.id,
      quantity: 1,
    });
  };

  const isDiscounted = item.product.discount_price !== null;
  const price = isDiscounted ? item.product.discount_price! : item.product.price;

  return (
    <div className={cn('flex gap-4', className)}>
      <Link
        href={`/products/${item.product.id}`}
        className="relative aspect-square h-24 w-24 overflow-hidden rounded-lg"
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
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleAddToCart}
            disabled={
              item.product.stock === 0 ||
              addToCartMutation.isPending ||
              removeFromFavoritesMutation.isPending
            }
          >
            <ShoppingCart className="h-4 w-4" />
            {item.product.stock === 0
              ? t('outOfStock')
              : t('favorites:addToCart')}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleRemove}
            disabled={
              addToCartMutation.isPending || removeFromFavoritesMutation.isPending
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}