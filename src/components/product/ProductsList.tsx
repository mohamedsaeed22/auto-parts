"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useGetProductsMutation } from "@/services/hooks";
import { Product, ProductsRequest } from "@/services/api/types";
import { AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsList = () => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";

  // State for basic filters
  const [filters] = useState<ProductsRequest>({
    per_page: 12,
    page: 1,
  });

  // API hook
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  // Extract products from response
  const products = productsResponse?.data?.items || [];

  // Load products on component mount
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("errorLoadingProducts") || "Error loading products"}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("errorLoadingProductsDesc") ||
                  "There was an error loading the products. Please try again."}
              </p>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("tryAgain") || "Try Again"}
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
            {t("allProducts") || "All Products"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("productsDescription") ||
              "Discover our wide range of high-quality auto parts"}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {products.length === 0 && !isLoading && !error && (
          <div className="text-center py-16">
            <p className="text-gray-600">
              {t("noProductsAvailable") ||
                "No products are currently available."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsList;
