"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetProductsMutation } from "@/services/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useFilterData } from "@/hooks/useFilterData";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { SEOMetadata } from "@/components/seo/SEOMetadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { seoConfig } from "@/lib/seo/config";
import {
  ArrowLeft,
  Package,
  Star,
  Filter,
  Grid3X3,
  List,
  Award,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  DollarSign,
  Building2,
  FolderOpen,
  Search as SearchIcon,
  X as CloseIcon,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, LoadingSpinner, ErrorMessage } from "@/components/ui";
import ProductCard from "@/components/product/ProductCard";
import type { FilterState } from "@/lib/types/filters";

// Hero Section Component
const HeroSection = ({ t }: { t: (key: string) => string }) => (
  <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Package className="h-8 w-8 text-green-200" />
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("hero.title") || "Premium Products"}
          </h1>
          <Award className="h-8 w-8 text-green-200" />
        </div>
        <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-6">
          {t("hero.subtitle") ||
            "Discover high-quality automotive parts and accessories for your vehicle"}
        </p>
        <div className="flex items-center justify-center gap-6 text-green-100">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>{t("hero.feature1") || "Quality Assured"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span>{t("hero.feature2") || "Premium Parts"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>{t("hero.feature3") || "Global Brands"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Filter Sidebar Component
const FilterSidebar = ({
  t,
  isOpen,
  onToggle,
}: {
  t: (key: string) => string;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="lg:hidden">
    <Button
      onClick={onToggle}
      variant="outline"
      className="w-full mb-4 flex items-center justify-between"
    >
      <span className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        {t("filters") || "Filters"}
      </span>
      {isOpen ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  </div>
);

// Filter Panel Component
const FilterPanel = ({
  isRTL,
  t,
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  brands,
  isLoading,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  filters: FilterState;
  onFilterChange: (
    key: keyof FilterState,
    value: string | number | null
  ) => void;
  onClearFilters: () => void;
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
  isLoading: boolean;
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
    <div
      className={`flex items-center justify-between mb-4 ${
        isRTL ? "flex-row" : ""
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Filter className="h-5 w-5" />
        {t("filters") || "Filters"}
      </h3>
      <Button
        onClick={onClearFilters}
        variant="outline"
        size="sm"
        className="text-gray-600 hover:text-white"
      >
        {t("clearAll") || "Clear All"}
      </Button>
    </div>

    <div className="space-y-6">
      {/* Categories Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          {t("categories") || "Categories"}
        </h4>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" className="min-h-0" />
            <span className="text-sm text-gray-500">
              {t("loadingCategories") || "Loading categories..."}
            </span>
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={filters.category_id === category.id}
                  onChange={(e) => {
                    const value = e.target.checked ? category.id : null;
                    onFilterChange("category_id", value);
                  }} //
                  className="border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {t("brands") || "Brands"}
        </h4>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" className="min-h-0" />
            <span className="text-sm text-gray-500">
              {t("loadingBrands") || "Loading brands..."}
            </span>
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="brand"
                  value={brand.id}
                  checked={filters.brand_id === brand.id}
                  onChange={(e) => {
                    const value = e.target.checked ? brand.id : null;
                    onFilterChange("brand_id", value);
                  }}
                  className="border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{brand.name}</span>
              </label>
            ))}
            {/* Clear brand selection */}
            {filters.brand_id && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  value=""
                  checked={false}
                  onChange={() => onFilterChange("brand_id", null)}
                  className="border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-500">
                  {t("clearBrand") || "Clear selection"}
                </span>
              </label>
            )}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {t("priceRange") || "Price Range"}
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-1 w-full">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder={t("minPrice") || "Min"}
              value={filters.min_price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) >= 0) {
                  onFilterChange("min_price", value);
                }
              }}
              className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
            />
            <span className="text-gray-600 text-sm font-medium flex-shrink-0 mx-1">
              -
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder={t("maxPrice") || "Max"}
              value={filters.max_price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) >= 0) {
                  onFilterChange("max_price", value);
                }
              }}
              className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Description Filter */}
      {/* <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          {t("description") || "Description"}
        </h4>
        <input
          type="text"
          placeholder={t("enterDescription") || "Enter description keywords..."}
          value={filters.description}
          onChange={(e) => onFilterChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div> */}
    </div>
  </div>
);

// View Mode Toggle Component
const ViewModeToggle = ({
  t,
  viewMode,
  onViewModeChange,
}: {
  t: (key: string) => string;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium text-gray-700">
      {t("viewMode") || "View Mode"}:
    </span>
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "grid"
            ? "bg-white text-green-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Grid3X3 size={18} />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`p-2 rounded-md transition-colors ${
          viewMode === "list"
            ? "bg-white text-green-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <List size={18} />
      </button>
    </div>
  </div>
);

export default function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const { t, i18n } = useTranslation("products");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isRTL = i18n.language === "ar";
  const { locale } = React.use(params);
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts
  useScrollToTop();

  // Custom hooks
  const {
    filters,
    apiFilters,
    hasActiveFilters,
    updateSearch,
    updateCategory,
    updateBrand,
    updatePriceRange,
    updateDescription,
    updateSortBy,
    updateViewMode,
    updatePage,
    clearFilters,
  } = useProductFilters();

  const {
    categories,
    brands,
    isLoading: isLoadingFilterData,
  } = useFilterData();

  // API Hooks
  const [getProducts, { data: productsResponse, isLoading, error }] =
    useGetProductsMutation();

  const products = productsResponse?.data?.items || [];
  const pagination = productsResponse?.data?.pagination;

  // Load products when filters change
  useEffect(() => {
    getProducts(apiFilters);
  }, [getProducts, apiFilters]);

  const handleGoBack = () => {
    router.push("/");
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number | null
  ) => {
    switch (key) {
      case "category_id":
        updateCategory(value as number | null);
        break;
      case "brand_id":
        updateBrand(value as number | null);
        break;
      case "min_price":
      case "max_price":
        updatePriceRange(
          key === "min_price" ? (value as string) : filters.min_price,
          key === "max_price" ? (value as string) : filters.max_price
        );
        break;
      case "description":
        updateDescription(value as string);
        break;
      case "sort_by":
        updateSortBy(value as string);
        break;
      case "view_mode":
        updateViewMode(value as "grid" | "list");
        break;
    }
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  // Handle error state
  if (error) {
    let errorMessage = t("failedToLoadProducts") || "Failed to load products";
    if ("status" in error) {
      errorMessage = `${t("error") || "Error"} ${error.status}: ${
        t("failedToLoadProducts") || "Failed to load products"
      }`;
    } else if ("message" in error) {
      errorMessage = error.message || errorMessage;
    }

    return (
      <div dir={direction}>
        <HeroSection t={t} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage
            message={errorMessage}
            onRetry={() => getProducts(apiFilters)}
          />
        </div>
      </div>
    );
  }

  return (
    <div dir={direction}>
      <SEOMetadata
        title={seoConfig.defaultMetadata.products.title[locale as "en" | "ar"]}
        description={
          seoConfig.defaultMetadata.products.description[locale as "en" | "ar"]
        }
        keywords={seoConfig.company.keywords[locale as "en" | "ar"].join(", ")}
        locale={locale}
        type="website"
      />

      <StructuredData
        type="website"
        data={{
          name: `${seoConfig.company.name} - Products`,
          description:
            seoConfig.defaultMetadata.products.description[
              locale as "en" | "ar"
            ],
          url: `${seoConfig.siteUrl}/${locale}/products`,
        }}
        locale={locale}
      />

      {/* Hero Section */}
      <HeroSection t={t} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav
          className={`flex items-center gap-2 text-sm text-gray-500 mb-8 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <button
            onClick={handleGoBack}
            className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
              isRTL ? "flex-row" : ""
            }`}
          >
            {isRTL ? (
              <>
                <Home size={16} />
                <span>{t("home")}</span>
              </>
            ) : (
              <>
                <Home size={16} />
                <span>{t("home")}</span>
              </>
            )}
          </button>

          <span>/</span>
          <span className="text-gray-900">{t("products") || "Products"}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              t={t}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />

            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <FilterPanel
                isRTL={isRTL}
                t={t}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                categories={categories}
                brands={brands}
                isLoading={isLoadingFilterData}
              />
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <div className="lg:hidden">
                <FilterPanel
                  isRTL={isRTL}
                  t={t}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  categories={categories}
                  brands={brands}
                  isLoading={isLoadingFilterData}
                />
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Search Results Header */}
            {filters.search && (
              <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div
                    className={`flex items-center justify-between ${
                      isRTL ? "flex-row" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SearchIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">
                          {t("searchResults") || "Search Results"}
                        </h3>
                        <p className="text-green-700">
                          {t("searchingFor") || "Searching for"}:
                          <span className="font-medium ml-1">
                            &quot;{filters.search}&quot;
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => updateSearch("")}
                      variant="outline"
                      size="sm"
                      className="text-green-700 border-green-300 hover:bg-green-100 hover:border-green-400"
                    >
                      <CloseIcon className="h-4 w-4 mr-2" />
                      {t("clearSearch") || "Clear Search"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Count and View Controls */}
            <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row" : ""
                }`}
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("foundProducts") || "Found Products"}
                  </h2>
                  {hasActiveFilters && (
                    <p className="text-sm text-green-600 mt-1">
                      {t("filtersApplied") || "Filters applied"}
                    </p>
                  )}
                </div>
                <ViewModeToggle
                  t={t}
                  viewMode={filters.view_mode}
                  onViewModeChange={updateViewMode}
                />
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="text-center py-16">
                <LoadingSpinner
                  message={t("loadingProducts") || "Loading products..."}
                />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {t("noProductsFound") || "No products found"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {hasActiveFilters
                    ? t("noProductsWithFilters") ||
                      "Try adjusting your filter criteria."
                    : t("noProductsFoundDesc") ||
                      "No products are available at the moment."}
                </p>
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters} variant="outline">
                    {t("clearFilters") || "Clear Filters"}
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div
                  className={
                    filters.view_mode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {products.map(
                    (product: {
                      id: number;
                      name: string;
                      price: string;
                      final_price: number;
                      primary_image: string;
                      description: string;
                      product_identifier: string;
                      discount_info: string;
                      offer: {
                        id: number;
                        image: string;
                        discount_type: "percentage" | "fixed";
                        discount_amount: string;
                        discount_info: string;
                        products_count: number;
                      } | null;
                      brand: {
                        id: number;
                        name: string;
                        image?: string;
                      } | null;
                      category: {
                        id: number;
                        name: string;
                        level: number;
                        image: string;
                        parent: {
                          id: number;
                          name: string;
                        } | null;
                      };
                      discount_type: "percentage" | "fixed" | null;
                      discount_amount: string | null;
                      images: string[];
                      hover_text: string;
                      in_favorites?: boolean | null;
                      in_wishlist?: boolean | null;
                    }) => (
                      <ProductCard
                        key={product.id}
                        variant={
                          filters.view_mode === "list" ? "list" : "default"
                        }
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          final_price: product.final_price,
                          primary_image: product.primary_image,
                          description: product.description,
                          product_identifier: product.product_identifier,
                          discount_info: product.discount_info,
                          offer: product.offer,
                          brand: product.brand,
                          category: product.category,
                          discount_type: product.discount_type as
                            | "percentage"
                            | "fixed"
                            | null,
                          discount_amount: product.discount_amount,
                          images: product.images,
                          hover_text: product.hover_text,
                          in_favorites: product.in_favorites || false,
                          in_wishlist: product.in_wishlist || false,
                        }}
                      />
                    )
                  )}
                </div>

                {/* Pagination */}
                {products.length > 0 &&
                  pagination &&
                  pagination.last_page > 1 && (
                    <div className="mt-12">
                      <CustomPagination
                        currentPage={pagination.current_page}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.per_page}
                      />
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
