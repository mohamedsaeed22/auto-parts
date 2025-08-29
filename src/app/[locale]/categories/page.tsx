"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "@/services/api/categoriesApi";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  ArrowLeft,
  Package,
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Building2,
  Users,
  Globe,
  Award,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Category Card Component
const CategoryCard = ({
  category,
  isRTL,
  t,
  onCategoryClick,
  viewMode,
}: {
  category: any;
  isRTL: boolean;
  t: (key: string) => string;
  onCategoryClick: (categoryId: number) => void;
  viewMode: "grid" | "list";
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      setTimeout(() => {
        setImageError(false);
      }, 1000);
    } else {
      setImageError(true);
    }
  };

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

  if (viewMode === "list") {
    return (
      <Card
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
        onClick={() => onCategoryClick(category.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Category Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={imageError ? fallbackImage : category.image}
                alt={category.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={handleImageError}
              />
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {category.name}
                </h3>
                <ChevronRight
                  size={20}
                  className={`text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ${
                    isRTL ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Subcategories */}
              {category.children && category.children.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Package size={16} className="text-blue-500" />
                  <span>
                    {category.children.length}{" "}
                    {t("categories.subcategories") || "subcategories"}
                  </span>
                </div>
              )}

              {/* Features */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" />
                  <span>{t("categories.quality") || "Quality"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-blue-500" />
                  <span>{t("categories.fast") || "Fast"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} className="text-green-500" />
                  <span>{t("categories.reliable") || "Reliable"}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden"
      onClick={() => onCategoryClick(category.id)}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Category Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={imageError ? fallbackImage : category.image}
              alt={category.name}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Category Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <ChevronRight
                size={20}
                className={`text-gray-400 group-hover:text-blue-600 transition-colors ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Subcategories Count */}
            {category.children && category.children.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Package size={16} className="text-blue-500" />
                <span>
                  {category.children.length}{" "}
                  {t("categories.subcategories") || "subcategories"}
                </span>
              </div>
            )}

            {/* Features */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500" />
                <span>{t("categories.quality") || "Quality"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-blue-500" />
                <span>{t("categories.fast") || "Fast"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Hero Section Component
const HeroSection = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {t("hero.title") || "Product Categories"}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
          {t("hero.subtitle") ||
            "Explore our comprehensive range of automotive parts and accessories"}
        </p>
        <div className="flex items-center justify-center gap-8 text-blue-100">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <span>{t("hero.categories") || "100+ Categories"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>{t("hero.quality") || "Premium Quality"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{t("hero.fast") || "Fast Delivery"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Search and Filter Component
const SearchAndFilter = ({
  isRTL,
  t,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}) => (
  <div className="bg-white border-b border-gray-200 py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t("search.placeholder") || "Search categories..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {t("viewMode") || "View Mode"}:
          </span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center gap-2">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      <span className="text-gray-600">Loading categories...</span>
    </div>
  </div>
);

// Error Message Component
const ErrorMessage = ({
  t,
  onRetry,
}: {
  t: (key: string) => string;
  onRetry: () => void;
}) => (
  <div className="text-center py-12">
    <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {t("error.title") || "Unable to Load Categories"}
    </h3>
    <p className="text-gray-600 mb-6">
      {t("error.message") ||
        "There was an error loading the categories. Please try again."}
    </p>
    <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
      {t("error.retry") || "Try Again"}
    </Button>
  </div>
);

export default function CategoriesPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  useScrollToTop();

  const {
    data: categoriesResponse,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery({
    level: 1,
    perPage: 50,
    with_children: true,
  });

  const categories = categoriesResponse?.data?.categories || [];

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category: any) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.children &&
        category.children.some((child: any) =>
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  return (
    <div dir={direction}>
      <HeroSection isRTL={isRTL} t={t} />

      <SearchAndFilter
        isRTL={isRTL}
        t={t}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

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
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {isRTL ? (
              <>
                <span>{t("backButton") || "Back"}</span>
                <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
              </>
            ) : (
              <>
                <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
                <span>{t("backButton") || "Back"}</span>
              </>
            )}
          </button>
          <span>/</span>
          <span className="text-gray-900">
            {t("categories") || "Categories"}
          </span>
        </nav>

        {/* Categories Count */}
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("foundCategories") || "Found Categories"}
          </h2>
          <p className="text-gray-600">
            {t("categoriesCount") ||
              `${filteredCategories.length} categories available`}
          </p>
        </div>

        {/* Categories Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage t={t} onRetry={() => refetch()} />
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchQuery
                ? t("noResults") || "No categories found"
                : t("noCategories") || "No categories available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? t("noResultsDesc") || "Try adjusting your search terms."
                : t("noCategoriesDesc") ||
                  "Check back later for new categories."}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                {t("clearSearch") || "Clear Search"}
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredCategories.map((category: any) => (
              <CategoryCard
                key={category.id}
                category={category}
                isRTL={isRTL}
                t={t}
                onCategoryClick={handleCategoryClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
