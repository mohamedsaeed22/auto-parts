"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useGetProductsMutation } from "@/services/hooks";
import { Product, ProductsRequest } from "@/services/api/types";
import { Search, Filter, Grid, List, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductsList = () => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";

  // State for filters and search
  const [filters, setFilters] = useState<ProductsRequest>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // API hook
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  // Extract products and pagination from response
  const products = productsResponse?.data?.items || [];
  const pagination = productsResponse?.data?.pagination;

  // Load products on component mount
  useEffect(() => {
    getProducts(filters);
  }, [filters]);

  // Handle search
  const handleSearch = () => {
    const newFilters = { ...filters, search: searchTerm || undefined };
    setFilters(newFilters);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<ProductsRequest>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
  };

  // Loading skeleton
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
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error component
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
              <Button onClick={() => getProducts(filters)} variant="outline">
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
        {products.length > 0 ? (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={pagination.current_page === 1}
                  >
                    {t("previous") || "Previous"}
                  </Button>

                  {[...Array(pagination.last_page)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === pagination.current_page;

                    return (
                      <Button
                        key={page}
                        variant={isCurrentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={pagination.current_page === pagination.last_page}
                  >
                    {t("next") || "Next"}
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* No Products Found */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("noProductsFound") || "No products found"}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("noProductsFoundDesc") ||
                  "Try adjusting your search or filter criteria"}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilters({});
                  getProducts({});
                }}
                variant="outline"
              >
                {t("clearFilters") || "Clear Filters"}
              </Button>
            </div>
          </div>
        )}

        {/* Loading More Indicator */}
        {isLoading && products.length > 0 && (
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
              <span className="text-gray-600">
                {t("loadingMore") || "Loading more products..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsList;
