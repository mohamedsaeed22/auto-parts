"use client";

import { useTranslation } from "react-i18next";
import { useGetFavouritesQuery } from "@/services/api";
import { FavouriteItem } from "@/services/api/favouritesApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RegistrationIncompleteErrorResponse } from "@/services/api/baseApi";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { AuthOnlyGuard } from "@/components/auth/AuthGuard";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";
import React from "react";
import ProductCard from "@/components/product/ProductCard";

export default function FavouritesPage() {
  const { t } = useTranslation("favourites");
  const { data: favouritesData, isLoading, error } = useGetFavouritesQuery();

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

  const favourites = (favouritesData?.data?.items || []) as FavouriteItem[];

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
              <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {t("error.title") || "Error loading favourites"}
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

    if (favourites.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {t("empty.title") || "No favourites yet"}
              </h2>
              <p className="text-gray-500 mb-6">
                {t("empty.message") ||
                  "Start adding products to your favourites to see them here."}
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
            {t("title") || "My Favourites"}
          </h1>
          <p className="text-gray-600">
            {t("subtitle") ||
              `You have ${favourites.length} favourite product${
                favourites.length !== 1 ? "s" : ""
              }`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favourites.map((item: FavouriteItem) => (
            <ProductCard key={item.id} product={item} variant="favourites" />
          ))}
        </div>
      </div>
    );
  };

  return <AuthOnlyGuard>{renderContent()}</AuthOnlyGuard>;
}
