"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useGetProductsMutation } from "@/services/hooks";
import { Product, ProductsRequest } from "@/services/api/types";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { useQueryState, parseAsInteger } from "nuqs";

const ProductsList = () => {
  const { t, i18n } = useTranslation("products");
  const { t: tCommon } = useTranslation("common");
  const isRTL = i18n.language === "ar";

  // Use nuqs to manage page state
  const [currentPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // State for basic filters
  const [filters, setFilters] = useState<ProductsRequest>({
    per_page: 6,
    page: currentPage,
  });

  // API hook
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  // Extract products and pagination from response
  const products = productsResponse?.data?.items || [];
  const pagination = productsResponse?.data?.pagination;

  // Update filters when URL page parameter changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  // Load products when filters change
  useEffect(() => {
    getProducts(filters);
  }, [filters, getProducts]);

  // Handle retry
  const handleRetry = () => {
    getProducts(filters);
  };

  // Simple loading skeleton
  if (isLoading && products.length === 0) {
    return (
      <section className="py-16 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Simple error component
  if (error && products.length === 0) {
    return (
      <section className="py-16 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {tCommon("errorLoadingData") || "Error loading data"}
              </h3>
              <p className="text-neutral-600 mb-4">
                {tCommon("errorLoadingDataDesc") ||
                  "There was an error loading the data. Please try again."}
              </p>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {tCommon("tryAgain") || "Try Again"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("ourProducts") || "Our Premium Auto Parts Collection"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("productsDescription") ||
              "Explore our extensive catalog of genuine auto parts, accessories, and components. Quality guaranteed for all vehicle makes and models with competitive pricing and fast delivery."}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 && (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="mt-12 flex justify-center">
                <CustomPagination
                  totalItems={pagination.total}
                  itemsPerPage={pagination.per_page}
                />
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {products.length === 0 && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-neutral-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {t("noProductsFound") || "No products found"}
            </h3>
            <p className="text-neutral-600">
              {t("noProductsAvailable") ||
                "No products are currently available. Please check back later or contact us for assistance."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsList;
