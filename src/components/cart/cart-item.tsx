'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useRemoveFromCart, useUpdateCartItem } from '@/services/api/cart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export function CartItem({ item, className }: CartItemProps) {
  const { t } = useTranslation('cart');
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;
    await updateCartItemMutation.mutateAsync({
      id: item.id,
      quantity: newQuantity,
    });
  };

  const handleRemove = async () => {
    await removeFromCartMutation.mutateAsync(item.id);
  };

  const isDiscounted = item.product.discount_price !== null;
  const price = isDiscounted ? item.product.discount_price! : item.product.price;
  const totalPrice = price * item.quantity;

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={
                item.quantity <= 1 ||
                updateCartItemMutation.isPending ||
                removeFromCartMutation.isPending
              }
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={
                item.quantity >= item.product.stock ||
                updateCartItemMutation.isPending ||
                removeFromCartMutation.isPending
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">
              {t('currency', { value: totalPrice })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleRemove}
              disabled={
                updateCartItemMutation.isPending ||
                removeFromCartMutation.isPending
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}