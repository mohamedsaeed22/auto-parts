"use client";

import { useTranslation } from "react-i18next";
import { useGetWishlistQuery, useToggleWishlistMutation } from "@/services/api";
import { WishlistItem } from "@/services/api/wishlistApi";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AuthOnlyGuard } from "@/components/auth/AuthGuard";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";
import { useFavouritesWishlist } from "@/hooks/useFavouritesWishlist";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RegistrationIncompleteErrorResponse } from "@/services/api/baseApi";
import React from "react";
import ProductCard from "@/components/product/ProductCard";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { t } = useTranslation("wishlist");
  const { data: wishlistData, isLoading, error } = useGetWishlistQuery();
  const [toggleWishlist] = useToggleWishlistMutation();
  const { handleToggleFavourite, isLoading: isFavouriteLoading } =
    useFavouritesWishlist();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const router = useRouter();
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
    try {
      await toggleWishlist({ product_id: productId }).unwrap();
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

  // ProductCard handles add-to-cart internally

  // Use optimistic data for rendering
  const wishlist = (wishlistData?.data?.items || []) as WishlistItem[];

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
                onClick={() => router.push("/products")}
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
          {wishlist.map((item: WishlistItem) => (
            <ProductCard key={item.id} product={item} variant="wishlist" />
          ))}
        </div>
      </div>
    );
  };

  return <AuthOnlyGuard>{renderContent()}</AuthOnlyGuard>;
}
