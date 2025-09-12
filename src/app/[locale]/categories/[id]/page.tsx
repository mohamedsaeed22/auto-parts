"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/services/api/categoriesApi";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  Package,
  Search,
  ChevronRight,
  Star,
  Zap,
  Shield,
  Clock,
  Grid3X3,
  List,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";

// Types
interface Subcategory {
  id: number;
  name: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
  children?: Subcategory[];
}

// Subcategory Card Component
const SubcategoryCard = ({
  subcategory,
  isRTL,
  t,
  onSubcategoryClick,
  viewMode,
}: {
  subcategory: Subcategory;
  isRTL: boolean;
  t: (key: string) => string;
  onSubcategoryClick: (subcategoryId: number) => void;
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
        className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30"
        onClick={() => onSubcategoryClick(subcategory.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Subcategory Image */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={imageError ? fallbackImage : subcategory.image}
                alt={subcategory.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                onError={handleImageError}
              />
            </div>

            {/* Subcategory Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                  {subcategory.name}
                </h3>
                <ChevronRight
                  size={18}
                  className={`text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 ${
                    isRTL ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Features */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" />
                  <span>{t("categoryFeatures.quality")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-primary" />
                  <span>{t("categoryFeatures.fast")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={12} className="text-green-500" />
                  <span>{t("categoryFeatures.reliable")}</span>
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
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden"
      onClick={() => onSubcategoryClick(subcategory.id)}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Subcategory Image */}
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={imageError ? fallbackImage : subcategory.image}
              alt={subcategory.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Subcategory Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {subcategory.name}
              </h3>
              <ChevronRight
                size={18}
                className={`text-gray-400 group-hover:text-primary transition-colors ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Features */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500" />
                <span>{t("categoryFeatures.quality")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-primary" />
                <span>{t("categoryFeatures.fast")}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Search and View Mode Component
const SearchAndViewMode = ({
  t,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}: {
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
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t("viewMode")}:</span>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-primary text-white"
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

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  const { t, i18n } = useTranslation("categoryDetail");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  useScrollToTop([categoryId]);

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
  const category = categories.find((cat: Category) => cat.id === categoryId);
  const subcategories = category?.children || [];

  // Filter subcategories based on search query
  const filteredSubcategories = subcategories.filter(
    (subcategory: Subcategory) =>
      subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    router.push(`/products?category=${subcategoryId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        message={t("loadingCategories") || "Loading categories..."}
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={t("failedToLoadCategories") || "Failed to load categories"}
        onRetry={() => refetch()}
      />
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {t("categoryNotFound")}
        </h3>
        <p className="text-gray-500 mb-6">{t("categoryNotFoundDesc")}</p>
        <Button onClick={handleGoHome}>{t("goHome")}</Button>
      </div>
    );
  }

  return (
    <div dir={direction}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-white/80 mb-6">{t("hero.subtitle")}</p>
            <div className="flex items-center justify-center gap-6 text-white/70">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>
                  {subcategories.length} {t("subcategories")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>{t("categoryFeatures.quality")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{t("categoryFeatures.fast")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchAndViewMode
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
            onClick={handleGoHome}
            className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
              isRTL ? "flex-row" : ""
            }`}
          >
            {isRTL ? (
              <>
                <span>{t("home")}</span>
                <Home size={16} />
              </>
            ) : (
              <>
                <Home size={16} />
                <span>{t("home")}</span>
              </>
            )}
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/categories")}
            className="hover:text-gray-700 transition-colors"
          >
            {t("categories")}
          </button>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Subcategories Count */}
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("foundSubcategories")}
          </h2>
          <p className="text-gray-600">
            {t("subcategoriesCount", { count: filteredSubcategories.length })}
          </p>
        </div>

        {/* Subcategories Content */}
        {filteredSubcategories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchQuery ? t("noResults") : t("noSubcategories")}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? t("noResultsDesc") : t("noSubcategoriesDesc")}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                {t("clearSearch")}
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredSubcategories.map((subcategory: Subcategory) => (
              <SubcategoryCard
                key={subcategory.id}
                subcategory={subcategory}
                isRTL={isRTL}
                t={t}
                onSubcategoryClick={handleSubcategoryClick}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
