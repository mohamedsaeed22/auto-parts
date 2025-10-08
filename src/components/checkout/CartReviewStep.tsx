"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Trash,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { useGetCartQuery } from "@/services/api/cartApi";
import type { ApiResponse } from "@/services/api/types";
import Link from "next/link";

interface CartReviewStepProps {
  onNext: () => void;
}

const CartReviewStep: React.FC<CartReviewStepProps> = ({ onNext }) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const isSyncing = false;

  const {
    items,
    totalItems,
    shouldUseAPI,
    updateQuantity,
    removeFromCart,
    isItemLoading,
  } = useEnhancedCart();

  // Fetch server cart when authenticated; skip on guest
  type ServerCart = {
    total_before_discount: number;
    cart_items: Array<{
      id: number;
      quantity: number;
      delivery_amount?: string | number;
      product: {
        id: number;
        name: string;
        price?: string | number;
        final_price?: string | number;
        primary_image?: string;
        brand?: { name?: string };
        category?: { name?: string };
        stock?: number; // Add stock field
      };
    }>;
    cart_total: number;
    item_count: number;
    total_discount?: number;
    delivery_amount?: string | number;
  };

  const { data: apiCart } = useGetCartQuery(undefined, {
    skip: !shouldUseAPI,
  });

  type ViewItem = {
    id: number;
    title: string;
    finalPrice: number;
    originalPrice: number;
    image: string;
    quantity: number;
    brand?: string;
    category?: string;
    stock?: number;
  };

  // Prefer server cart items when available to avoid stale local storage
  const viewItems = useMemo<ViewItem[]>(() => {
    const server = (apiCart as ApiResponse<unknown> | undefined)?.data as
      | ServerCart
      | undefined;
    if (shouldUseAPI && server?.cart_items) {
      return server.cart_items.map((ci: ServerCart["cart_items"][number]) => {
        const finalPrice =
          Number(
            (ci.product as { final_price?: string | number }).final_price
          ) ||
          Number(ci.product?.price) ||
          0;
        const originalPrice = Number(ci.product?.price) || finalPrice;
        return {
          id: ci.product.id,
          title: ci.product.name,
          finalPrice,
          originalPrice,
          image: ci.product?.primary_image || "",
          quantity: ci.quantity,
          brand: (ci.product as { brand?: { name?: string } } | undefined)
            ?.brand?.name,
          category: (ci.product as { category?: { name?: string } } | undefined)
            ?.category?.name,
          stock: (ci.product as { stock?: number } | undefined)?.stock, // Extract stock from API
        };
      });
    }
    // Fallback to local items shape; map to our ViewItem with same values
    return items.map(
      (it: {
        id: number;
        title: string;
        price: number | string;
        originalPrice?: number | string;
        image: string;
        quantity: number;
        brand?: string;
        category?: string;
        stock?: number;
      }) => ({
        id: it.id,
        title: it.title,
        finalPrice: Number(it.price) || 0,
        originalPrice:
          Number(it.originalPrice ?? it.price) || Number(it.price) || 0,
        image: it.image,
        quantity: it.quantity,
        brand: it.brand,
        category: it.category,
        stock: it.stock,
      })
    );
  }, [shouldUseAPI, apiCart, items]);

  const viewTotalItems = useMemo(() => {
    const server = (apiCart as ApiResponse<unknown> | undefined)?.data as
      | ServerCart
      | undefined;
    if (shouldUseAPI) return server?.item_count || 0;
    return totalItems;
  }, [shouldUseAPI, apiCart, totalItems]);

  const handleContinueToShipping = async () => {
    onNext();
  };

  const hasDiscount = (item: ViewItem) => item.originalPrice > item.finalPrice;
  const getDiscountPercentage = (item: ViewItem) => {
    if (!hasDiscount(item)) return 0;
    return Math.round(
      ((item.originalPrice - item.finalPrice) / item.originalPrice) * 100
    );
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="max-w-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-logo-gold/30">
        <div className="flex items-center justify-between">
          <h2
            className={`text-sm xs:text-base md:text-2xl font-bold text-logo-black flex items-center ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <ShoppingBag
              className={`w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 text-logo-gold ${
                isRTL ? "ml-1 xs:ml-2 md:ml-3" : "mr-1 xs:mr-2 md:mr-3"
              }`}
            />
            <span className="truncate">
              {t("cartReview.title")} ({viewTotalItems} {t("cartReview.items")})
            </span>
          </h2>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-logo-gold/20">
        {viewItems.map((item: ViewItem, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 md:p-6"
          >
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex gap-3 mb-3">
                {/* Product Image */}
                <Link
                  href={`/product/${item.id}`}
                  className="relative w-16 h-16 bg-logo-gold/10 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-logo-black text-sm leading-tight mb-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Brand & Category */}
                  {(item.brand || item.category) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.brand && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-logo-gold/15 text-logo-black border border-logo-gold/30">
                          {item.brand}
                        </span>
                      )}
                      {item.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-logo-gold/15 text-logo-black border border-logo-gold/30">
                          {item.category}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Price Column */}
                <div
                  className={`flex-shrink-0 ${
                    isRTL ? "text-left" : "text-right"
                  }`}
                >
                  {hasDiscount(item) ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded font-medium">
                          -{getDiscountPercentage(item)}%
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 line-through">
                        {(item.originalPrice * item.quantity).toFixed(2)}{" "}
                        {t("currency")}
                      </div>
                      <div className="text-sm font-bold text-logo-black">
                        {(item.finalPrice * item.quantity).toFixed(2)}{" "}
                        {t("currency")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-logo-black">
                      {(item.finalPrice * item.quantity).toFixed(2)}{" "}
                      {t("currency")}
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center bg-white border-2 border-logo-gold/50 rounded-lg overflow-hidden ${
                    isRTL ? "flex-row" : ""
                  }`}
                >
                  <button
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item.id);
                      } else {
                        updateQuantity(item.id, Math.max(1, item.quantity - 1));
                      }
                    }}
                    disabled={isItemLoading(item.id)}
                    className={`h-8 w-8 p-0 hover:bg-logo-gold/10 text-logo-black rounded-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRTL
                        ? "border-l border-logo-gold/30"
                        : "border-r border-logo-gold/30"
                    }`}
                  >
                    {isItemLoading(item.id) ? (
                      <div className="animate-spin rounded-full h-3 w-3 border border-logo-gold border-t-transparent"></div>
                    ) : item.quantity === 1 ? (
                      <Trash size={14} />
                    ) : (
                      <Minus size={14} />
                    )}
                  </button>

                  <div className="h-8 px-3 flex items-center justify-center bg-logo-gold/10 min-w-[40px]">
                    <span className="text-sm font-semibold text-logo-black">
                      {item.quantity}
                    </span>
                  </div>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={
                      isItemLoading(item.id) ||
                      (item.stock !== undefined && item.quantity >= item.stock)
                    }
                    className={`h-8 w-8 p-0 hover:bg-logo-gold/10 text-logo-black rounded-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRTL
                        ? "border-r border-logo-gold/30"
                        : "border-l border-logo-gold/30"
                    }`}
                  >
                    {isItemLoading(item.id) ? (
                      <div className="animate-spin rounded-full h-3 w-3 border border-logo-gold border-t-transparent"></div>
                    ) : (
                      <Plus size={14} />
                    )}
                  </button>
                </div>

                {/* Unit Price */}
                {item.quantity > 1 && (
                  <div className="text-xs text-neutral-600">
                    {hasDiscount(item) ? (
                      <div className="space-y-0.5">
                        <div className="line-through">
                          {item.originalPrice.toFixed(2)} {t("currency")}
                        </div>
                        <div>
                          {item.finalPrice.toFixed(2)} {t("currency")} /{" "}
                          {t("cartReview.piece")}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {item.finalPrice.toFixed(2)} {t("currency")} /{" "}
                        {t("cartReview.piece")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div
                className={`flex items-start gap-4 ${
                  isRTL ? "space-x space-x-4" : "space-x-4"
                }`}
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.id}`}
                  className="relative w-20 h-20 lg:w-24 lg:h-24 bg-logo-gold/10 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className={`font-semibold text-logo-black text-base lg:text-lg leading-tight ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Brand & Category */}
                  {(item.brand || item.category) && (
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {item.brand && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-logo-gold/15 text-logo-black border border-logo-gold/30">
                          {t("cartReview.brand", {
                            defaultValue:
                              i18n.language === "ar"
                                ? "العلامة التجارية"
                                : "Brand",
                          })}
                          : <span className="font-semibold">{item.brand}</span>
                        </span>
                      )}
                      {item.category && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-logo-gold/15 text-logo-black border border-logo-gold/30">
                          {t("cartReview.category", {
                            defaultValue:
                              i18n.language === "ar" ? "الفئة" : "Category",
                          })}
                          :{" "}
                          <span className="font-semibold">{item.category}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div
                    className={`flex items-center mt-4 ${
                      isRTL ? "space-x space-x-4" : "space-x-4"
                    }`}
                  >
                    <div
                      className={`flex items-center bg-white border-2 border-logo-gold/50 rounded-lg overflow-hidden ${
                        isRTL ? "flex-row" : ""
                      }`}
                    >
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.id);
                          } else {
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            );
                          }
                        }}
                        disabled={isItemLoading(item.id)}
                        className={`h-8 w-8 p-0 hover:bg-logo-gold/10 text-logo-black rounded-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                          isRTL
                            ? "border-l border-logo-gold/30"
                            : "border-r border-logo-gold/30"
                        }`}
                      >
                        {isItemLoading(item.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-logo-gold border-t-transparent"></div>
                        ) : item.quantity === 1 ? (
                          <Trash size={16} />
                        ) : (
                          <Minus size={16} />
                        )}
                      </button>

                      <div className="h-8 px-3 flex items-center justify-center bg-logo-gold/10 min-w-[40px]">
                        <span className="text-sm font-semibold text-logo-black">
                          {item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={
                          isItemLoading(item.id) ||
                          (item.stock !== undefined &&
                            item.quantity >= item.stock)
                        }
                        className={`h-8 w-8 p-0 hover:bg-logo-gold/10 text-logo-black rounded-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                          isRTL
                            ? "border-r border-logo-gold/30"
                            : "border-l border-logo-gold/30"
                        }`}
                      >
                        {isItemLoading(item.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-logo-gold border-t-transparent"></div>
                        ) : (
                          <Plus size={14} />
                        )}
                      </button>
                    </div>

                    {/* Unit Price for Desktop */}
                    {item.quantity > 1 && (
                      <div className="text-sm text-neutral-600">
                        {hasDiscount(item) ? (
                          <div className="space-y-1">
                            <div className="line-through text-xs">
                              {item.originalPrice.toFixed(2)} {t("currency")} /{" "}
                              {t("cartReview.piece")}
                            </div>
                            <div>
                              {item.finalPrice.toFixed(2)} {t("currency")} /{" "}
                              {t("cartReview.piece")}
                            </div>
                          </div>
                        ) : (
                          <div>
                            {item.finalPrice.toFixed(2)} {t("currency")} /{" "}
                            {t("cartReview.piece")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Section */}
                <div
                  className={`flex-shrink-0 ${
                    isRTL ? "text-left" : "text-right"
                  }`}
                >
                  {hasDiscount(item) ? (
                    <div className="space-y-2">
                      {/* Discount Badge */}
                      <div className="flex justify-end">
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          -{getDiscountPercentage(item)}%{" "}
                          {t("cartReview.off", {
                            defaultValue:
                              i18n.language === "ar" ? "خصم" : "OFF",
                          })}
                        </span>
                      </div>

                      {/* Original Price */}
                      <div className="text-base text-neutral-500 line-through">
                        {(item.originalPrice * item.quantity).toFixed(2)}{" "}
                        {t("currency")}
                      </div>

                      {/* Final Price */}
                      <div className="text-xl lg:text-2xl font-bold text-logo-black">
                        {(item.finalPrice * item.quantity).toFixed(2)}{" "}
                        {t("currency")}
                      </div>

                      {/* Savings Amount */}
                      <div className="text-sm text-green-600 font-medium">
                        {t("cartReview.youSave", {
                          defaultValue:
                            i18n.language === "ar" ? "وفرت" : "You save",
                        })}
                        :{" "}
                        {(
                          (item.originalPrice - item.finalPrice) *
                          item.quantity
                        ).toFixed(2)}{" "}
                        {t("currency")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xl lg:text-2xl font-bold text-logo-black">
                      {(item.finalPrice * item.quantity).toFixed(2)}{" "}
                      {t("currency")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="p-4 md:p-6 border-t border-logo-gold/30">
        <Button
          onClick={handleContinueToShipping}
          disabled={isSyncing}
          className={`w-full bg-logo-gold hover:bg-logo-gold/90 disabled:bg-logo-gold/50 text-white disabled:text-white/70 py-3 rounded-lg font-medium flex items-center justify-center ${
            isRTL ? "flex-row" : ""
          }`}
        >
          {isSyncing ? (
            <>
              <RefreshCw
                className={`w-5 h-5 text-logo-black animate-spin ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              {t("cartReview.syncing", "Synchronizing...")}
            </>
          ) : isRTL ? (
            <>
              {t("cartReview.continueToShipping")}
              <ArrowLeft className="w-5 h-5 mr-2 text-white" />
            </>
          ) : (
            <>
              {t("cartReview.continueToShipping")}
              <ArrowRight className="w-5 h-5 ml-2 text-white" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartReviewStep;
