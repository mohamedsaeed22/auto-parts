"use client";

import { useTranslation } from "react-i18next";
import { useGetWishlistQuery, useToggleWishlistMutation } from "@/services/api";
import { WishlistItem } from "@/services/api/wishlistApi";
import { Bookmark, Trash2, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { ProtectedPageGuard } from "@/components/auth/AuthGuard";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";
import { useFavouritesWishlist } from "@/hooks/useFavouritesWishlist";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RegistrationIncompleteErrorResponse } from "@/services/api/baseApi";
import React from "react";

export default function WishlistPage() {
  const { t } = useTranslation("wishlist");
  const { data: wishlistData, isLoading, error } = useGetWishlistQuery();
  const [toggleWishlist] = useToggleWishlistMutation();
  const { addToCart } = useEnhancedCart();
  const { handleToggleFavourite, isLoading: isFavouriteLoading } =
    useFavouritesWishlist();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [optimisticWishlist, setOptimisticWishlist] = useState<WishlistItem[]>(
    []
  );
  const [optimisticFavourites, setOptimisticFavourites] = useState<{
    [key: number]: boolean;
  }>({});

  // Handle API errors (403 registration incomplete, 401 unauthorized, etc.)
  // Disable toasts since ProtectedPageGuard handles authentication toasts
  useApiErrorHandler(
    error as
      | FetchBaseQueryError
      | RegistrationIncompleteErrorResponse
      | undefined,
    { showToasts: false }
  );

  // Scroll to top when page loads
  useScrollToTop();

  // Update optimistic wishlist when data changes
  React.useEffect(() => {
    if (wishlistData?.data?.items) {
      setOptimisticWishlist(wishlistData.data.items as WishlistItem[]);
    }
  }, [wishlistData]);

  const handleRemoveFromWishlist = async (productId: number) => {
    setRemovingId(productId);

    // Optimistically remove from UI
    const currentWishlist = [...optimisticWishlist];
    const itemToRemove = currentWishlist.find((item) => item.id === productId);
    setOptimisticWishlist(
      currentWishlist.filter((item) => item.id !== productId)
    );

    try {
      await toggleWishlist({ product_id: productId }).unwrap();
    } catch {
      // Revert optimistic update on error
      if (itemToRemove) {
        setOptimisticWishlist([...currentWishlist]);
      }
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleToggleFavouriteOptimistic = async (productId: number) => {
    // Get current favourite state
    const currentItem = optimisticWishlist.find(
      (item) => item.id === productId
    );
    const currentFavouriteState = currentItem?.in_favorites || false;
    const newFavouriteState = !currentFavouriteState;

    // Optimistically update UI
    setOptimisticFavourites((prev) => ({
      ...prev,
      [productId]: newFavouriteState,
    }));
    setOptimisticWishlist((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, in_favorites: newFavouriteState }
          : item
      )
    );

    try {
      await handleToggleFavourite(productId);
    } catch {
      // Revert optimistic update on error
      setOptimisticFavourites((prev) => ({
        ...prev,
        [productId]: currentFavouriteState,
      }));
      setOptimisticWishlist((prev) =>
        prev.map((item) =>
          item.id === productId
            ? { ...item, in_favorites: currentFavouriteState }
            : item
        )
      );
    }
  };

  const handleAddToCart = (product: WishlistItem) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.final_price,
      image: product.primary_image,
      category: product.category.name,
      description: product.description,
    });
  };

  // Use optimistic data for rendering
  const wishlist =
    optimisticWishlist.length > 0
      ? optimisticWishlist
      : ((wishlistData?.data?.items || []) as WishlistItem[]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-gold"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <Bookmark className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {t("error.title") || "Error loading wishlist"}
              </h2>
              <p className="text-gray-500">
                {t("error.message") ||
                  "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (wishlist.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <Bookmark className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {t("empty.title") || "No wishlist items yet"}
              </h2>
              <p className="text-gray-500 mb-6">
                {t("empty.message") ||
                  "Start adding products to your wishlist to see them here."}
              </p>
              <Button
                onClick={() => window.history.back()}
                className="bg-logo-gold hover:bg-logo-gold/90"
              >
                {t("empty.browseButton") || "Browse Products"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("title") || "My Wishlist"}
          </h1>
          <p className="text-gray-600">
            {t("subtitle") ||
              `You have ${wishlist.length} wishlist item${
                wishlist.length !== 1 ? "s" : ""
              }`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item: WishlistItem) => {
              // Use optimistic state if available, otherwise use item state
              const isInFavourites = optimisticFavourites.hasOwnProperty(
                item.id
              )
                ? optimisticFavourites[item.id]
                : item.in_favorites;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.primary_image || "/products/product1.jpg"}
                      alt={item.name || "Product"}
                      fill
                      className="object-cover"
                    />

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      {/* Favourites Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFavouriteOptimistic(item.id);
                        }}
                        disabled={isFavouriteLoading(`favourite-${item.id}`)}
                        className={`h-8 w-8 p-0 rounded-full backdrop-blur-sm border-neutral-200 hover:bg-white shadow-sm transition-colors ${
                          isInFavourites
                            ? "bg-red-500 border-red-500 hover:bg-red-600"
                            : "bg-white/90 hover:bg-white"
                        }`}
                      >
                        {isFavouriteLoading(`favourite-${item.id}`) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>
                        ) : (
                          <Heart
                            size={14}
                            className={`${
                              isInFavourites
                                ? "text-white fill-white"
                                : "text-neutral-600"
                            }`}
                          />
                        )}
                      </Button>

                      {/* Remove from Wishlist Button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFromWishlist(item.id);
                        }}
                        disabled={removingId === item.id}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        {removingId === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </Button>
                    </div>

                    {/* Discount Badge */}
                    {item.discount_type && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          {item.discount_info || "SALE"}
                        </div>
                      </div>
                    )}

                    {/* Offer Badge */}
                    {item.offer && (
                      <div className="absolute bottom-2 left-2">
                        <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          OFFER
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category and Brand */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs text-neutral-600 bg-neutral-100 rounded-full px-2 py-1 capitalize">
                        {item.category?.name || "Unknown Category"}
                      </span>
                      {item.brand?.name && (
                        <span className="text-xs text-info bg-info-light rounded-full px-2 py-1">
                          {item.brand.name}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.name || "Product Name"}
                    </h3>

                    <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.description || "Product description",
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-logo-gold">
                          ${item.final_price || 0}
                        </span>
                        {item.discount_type && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.price || 0}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="bg-logo-gold hover:bg-logo-gold/90"
                      >
                        <ShoppingCart size={16} className="mr-1" />
                        {t("addToCart") || "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return <ProtectedPageGuard>{renderContent()}</ProtectedPageGuard>;
}
