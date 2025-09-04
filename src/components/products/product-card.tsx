'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product, useToggleFavorite, useToggleWishlist } from '@/services/api/products';
import { useAuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const { t } = useTranslation('products');
  const { isAuthenticated } = useAuthContext();
  const toggleFavoriteMutation = useToggleFavorite();
  const toggleWishlistMutation = useToggleWishlist();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Handle unauthenticated user
      return;
    }
    await toggleFavoriteMutation.mutateAsync(product.id);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Handle unauthenticated user
      return;
    }
    await toggleWishlistMutation.mutateAsync(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(product);
  };

  const discountPercentage = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <Card className={cn('group relative overflow-hidden', className)}>
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {discountPercentage > 0 && (
            <Badge
              variant="destructive"
              className="absolute left-2 top-2"
            >
              -{discountPercentage}%
            </Badge>
          )}
          <div className="absolute right-2 top-2 flex flex-col gap-2">
            <Button
              size="icon"
              variant={product.is_favorite ? 'default' : 'outline'}
              className="h-8 w-8"
              onClick={handleToggleFavorite}
              disabled={toggleFavoriteMutation.isPending}
            >
              <Heart
                className={cn('h-4 w-4', product.is_favorite && 'fill-current')}
              />
            </Button>
            <Button
              size="icon"
              variant={product.is_in_wishlist ? 'default' : 'outline'}
              className="h-8 w-8"
              onClick={handleToggleWishlist}
              disabled={toggleWishlistMutation.isPending}
            >
              <ShoppingCart
                className={cn('h-4 w-4', product.is_in_wishlist && 'fill-current')}
              />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold">
              {product.discount_price ? (
                <>
                  {t('currency', { value: product.discount_price })}
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    {t('currency', { value: product.price })}
                  </span>
                </>
              ) : (
                t('currency', { value: product.price })
              )}
            </span>
          </div>
          {product.rating > 0 && (
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <span>★</span>
              <span>{product.rating.toFixed(1)}</span>
              <span>({product.reviews_count})</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? t('outOfStock')
              : t('addToCart')}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}