"use client";

import { useCart } from "@/hooks/useCart";
import { useFavouritesWishlist } from "@/hooks/useFavouritesWishlist";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash,
  Minus,
  Plus,
  Heart,
  Bookmark,
  Star,
  Eye,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product, CommonComponentProps, AnimationProps } from "@/components/types";
import { cn } from "@/lib/utils";
import React from "react";

/**
 * Enhanced ProductCard component with improved TypeScript interfaces
 * and better prop handling for consistent UI across the application
 */
interface ProductCardProps extends CommonComponentProps, AnimationProps {
  /** Product data to display */
  product: Product;
  /** Optional index for animations or tracking */
  index?: number;
  /** Card display variant */
  variant?: "default" | "compact" | "detailed";
  /** Card size */
  size?: "sm" | "md" | "lg";
  /** Whether to show quick actions on hover */
  showQuickActions?: boolean;
  /** Whether to show product rating */
  showRating?: boolean;
  /** Whether to show discount badge */
  showDiscount?: boolean;
  /** Custom click handler for the card */
  onCardClick?: (product: Product) => void;
  /** Whether the card is in a loading state */
  loading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  index = 0,
  variant = "default",
  size = "md",
  showQuickActions = true,
  showRating = false,
  showDiscount = true,
  onCardClick,
  loading = false,
  className,
  animate = true,
  duration = 300,
  delay = 0,
  ...props
}) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const { handleToggleFavourite, handleToggleWishlist, isLoading } =
    useFavouritesWishlist();
  const cartItem = items.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  // Enhanced styling based on props
  const cardVariants = {
    default: "bg-white border border-gray-200 hover:border-gray-300",
    compact: "bg-white border border-gray-100 hover:border-gray-200",
    detailed: "bg-white border-2 border-gray-200 hover:border-blue-300"
  };

  const sizeVariants = {
    sm: "p-3 rounded-lg",
    md: "p-4 rounded-xl",
    lg: "p-6 rounded-2xl"
  };

  // Safe access to product properties
  const productName = product.name || "Product Name Unavailable";
  const productPrice = product.price || "0";
  const productFinalPrice = product.final_price || Number(productPrice);
  const productImage = product.primary_image || "/placeholder-product.jpg";
  const categoryName = product.category?.name || "Unknown Category";
  const brandName = product.brand?.name;
  const hasDiscount = product.discount_type || product.offer;
  const discountInfo = product.discount_info;

  // Check if product is in favourites or wishlist
  const isInFavourites = product.in_favourites === true;
  const isInWishlist = product.in_wishlist === true;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: productName,
      price: productFinalPrice,
      image: productImage,
      category: categoryName,
      description: product.description || "",
    });
  };

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    } else if (cartItem && cartItem.quantity === 1) {
      removeFromCart(product.id);
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(product);
    }
  };

  if (loading) {
    return (
      <div className={cn(
        "animate-pulse",
        cardVariants[variant],
        sizeVariants[size],
        "transition-all duration-300",
        className
      )}>
        <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
        <div className="bg-gray-200 h-4 rounded mb-2"></div>
        <div className="bg-gray-200 h-4 rounded w-3/4 mb-4"></div>
        <div className="bg-gray-200 h-8 rounded"></div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        cardVariants[variant],
        sizeVariants[size],
        "hover:shadow-lg transition-all duration-300 group cursor-pointer",
        animate && "transform hover:scale-[1.02]",
        className
      )}
      onClick={handleCardClick}
      style={{
        animationDelay: animate ? `${delay + index * 100}ms` : undefined,
        animationDuration: animate ? `${duration}ms` : undefined
      }}
      dir={isRTL ? "rtl" : "ltr"}
      {...props}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {/* Product Image */}
        <Image
          src={productImage}
          alt={productName}
          width={300}
          height={300}
          className={cn(
            "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          )}
          priority={index < 4}
        />

            {/* Action Buttons */}
            <div
              className={`absolute top-2 ${
                isRTL ? "left-2" : "right-2"
              } flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            >
              <Button
                size="sm"
                variant="outline"
                className={`w-7 h-7 rounded-full backdrop-blur-sm border-neutral-200 hover:bg-white shadow-sm transition-colors ${
                  isInFavourites 
                    ? "bg-red-500 border-red-500 hover:bg-red-600" 
                    : "bg-white/90 hover:bg-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavourite(product.id);
                }}
                disabled={isLoading(`favourite-${product.id}`)}
              >
                {isLoading(`favourite-${product.id}`) ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>
                ) : (
                  <Heart 
                    size={12} 
                    className={`${
                      isInFavourites ? "text-white fill-white" : "text-neutral-600"
                    }`} 
                  />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={`w-7 h-7 rounded-full backdrop-blur-sm border-neutral-200 hover:bg-white shadow-sm transition-colors ${
                  isInWishlist 
                    ? "bg-blue-500 border-blue-500 hover:bg-blue-600" 
                    : "bg-white/90 hover:bg-white"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleWishlist(product.id);
                }}
                disabled={isLoading(`wishlist-${product.id}`)}
              >
                {isLoading(`wishlist-${product.id}`) ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>
                ) : (
                  <Bookmark 
                    size={12} 
                    className={`${
                      isInWishlist ? "text-white fill-white" : "text-neutral-600"
                    }`} 
                  />
                )}
              </Button>
            </div>

            {/* Discount Badge */}
            {hasDiscount && (
              <div className={`absolute top-2 ${isRTL ? "right-2" : "left-2"}`}>
                <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  {discountInfo || "SALE"}
                </div>
              </div>
            )}

            {/* Offer Badge */}
            {product.offer && (
              <div
                className={`absolute bottom-2 ${isRTL ? "right-2" : "left-2"}`}
              >
                <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  OFFER
                </div>
              </div>
            )}
          </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Category and Brand */}
        {variant !== "compact" && (
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-xs text-neutral-600 bg-neutral-100 rounded-full px-2 py-1 capitalize">
              {categoryName}
            </span>
            {brandName && (
              <span className="text-xs text-info bg-info-light rounded-full px-2 py-1">
                {brandName}
              </span>
            )}
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
          <h3 className={cn(
            "font-medium text-neutral-900 line-clamp-2 group-hover:text-primary transition-colors",
            size === "sm" ? "text-sm min-h-[2rem]" : size === "lg" ? "text-lg min-h-[3rem]" : "text-base min-h-[2.5rem]"
          )}>
            {productName}
          </h3>
        </Link>

        {/* Rating */}
        {showRating && product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.rating})</span>
          </div>
        )}

        {/* Price and Add to Cart Section */}
        <div className="mt-auto">
          <div className={cn(
            "flex items-center justify-between",
            isRTL && "flex-row-reverse"
          )}>
            {/* Price Section */}
            <div className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
              <span className={cn(
                "font-bold text-neutral-900",
                size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
              )}>
                {isRTL
                  ? `${t("currency")} ${productFinalPrice}`
                  : `${productFinalPrice} ${t("currency")}`}
              </span>
              {hasDiscount && (
                <span className={cn(
                  "text-neutral-500 line-through",
                  size === "sm" ? "text-xs" : "text-sm"
                )}>
                  {isRTL
                    ? `${t("currency")} ${productPrice}`
                    : `${productPrice} ${t("currency")}`}
                </span>
              )}
            </div>

                {/* Add to Cart Section */}
            {!isInCart ? (
              <Button
                size={size === "sm" ? "sm" : "default"}
                className={cn(
                  "bg-secondary hover:bg-secondary-dark text-white rounded flex items-center gap-1 transition-all duration-200 hover:scale-105",
                  size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(e);
                }}
              >
                <ShoppingCart size={size === "sm" ? 12 : 14} />
                {size !== "sm" && <span>{t("addToCart")}</span>}
              </Button>
            ) : (
              <div className="flex items-center bg-white border border-neutral-300 rounded overflow-hidden">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecreaseQuantity(e);
                  }}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "p-0 hover:bg-neutral-100 text-neutral-700 rounded-none border-r border-neutral-200",
                    size === "sm" ? "h-6 w-6" : "h-7 w-7"
                  )}
                >
                  {cartItem?.quantity === 1 ? (
                    <Trash size={size === "sm" ? 8 : 10} />
                  ) : (
                    <Minus size={size === "sm" ? 8 : 10} />
                  )}
                </Button>

                <div className={cn(
                  "px-2 flex items-center justify-center bg-neutral-50",
                  size === "sm" ? "h-6 min-w-[24px]" : "h-7 min-w-[28px]"
                )}>
                  <span className={cn(
                    "font-semibold text-neutral-800",
                    size === "sm" ? "text-xs" : "text-sm"
                  )}>
                    {cartItem?.quantity}
                  </span>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncreaseQuantity(e);
                  }}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "p-0 hover:bg-neutral-100 text-neutral-700 rounded-none border-l border-neutral-200",
                    size === "sm" ? "h-6 w-6" : "h-7 w-7"
                  )}
                >
                  <Plus size={size === "sm" ? 8 : 10} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;