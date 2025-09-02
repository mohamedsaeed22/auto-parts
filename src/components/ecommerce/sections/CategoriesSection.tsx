"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetCategoriesQuery } from "@/services/api/categoriesApi";
import { ChevronRight, Package, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ViewAllButton from "@/components/ui/view-all-button";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: number;
  name: string;
  image: string;
  children?: Category[];
}

const CategoryCard = ({
  category,
  isRTL,
  t,
  onCategoryClick,
}: {
  category: Category;
  isRTL: boolean;
  t: (key: string) => string;
  onCategoryClick: (categoryId: number) => void;
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      // Retry after a short delay
      setTimeout(() => {
        setImageError(false);
      }, 1000);
    } else {
      setImageError(true);
    }
  };

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-200 overflow-hidden"
      onClick={() => onCategoryClick(category.id)}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* Category Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageError ? fallbackImage : category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Category Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <ChevronRight
                size={20}
                className={`text-neutral-400 group-hover:text-primary transition-colors ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Subcategories Count */}
            {category.children && category.children.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Package size={16} className="text-primary" />
                <span>
                  {category.children.length}{" "}
                  {t("categories.subcategories") || "subcategories"}
                </span>
              </div>
            )}

            {/* Features */}
            <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-primary" />
                <span>{t("categories.quality") || "Quality"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-primary" />
                <span>{t("categories.fast") || "Fast"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CategoriesSection = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation("home");
  const isRTL = i18n.language === "ar";

  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useGetCategoriesQuery({
    level: 1,
    perPage: 6,
    with_children: true,
  });

  const categories = categoriesResponse?.data?.categories || [];

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              {t("categories.title") || "Shop by Category"}
            </h2>
            <p className="text-lg text-neutral-600">
              {t("categories.subtitle") ||
                "Find the perfect parts for your vehicle"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-48 rounded-t-lg" />
                <div className="bg-background p-4 rounded-b-lg">
                  <Skeleton className="h-4 rounded mb-2" />
                  <Skeleton className="h-3 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              {t("categories.title") || "Shop by Category"}
            </h2>
            <p className="text-neutral-600 mb-8">
              {t("categories.error") ||
                "Unable to load categories. Please try again later."}
            </p>
            <Button onClick={() => window.location.reload()}>
              {t("categories.retry") || "Retry"}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {t("categories.title") || "Shop by Category"}
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            {t("categories.subtitle") ||
              "Find the perfect parts for your vehicle from our comprehensive selection"}
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isRTL={isRTL}
                  t={t}
                  onCategoryClick={handleCategoryClick}
                />
              ))}
            </div>

            {/* View All Button */}
            <ViewAllButton
              href="/categories"
              translationKey="categories.viewAll"
              fallbackText="View All Categories"
              namespace="home"
            />
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-neutral-300 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-600 mb-2">
              {t("categories.noCategories") || "No Categories Available"}
            </h3>
            <p className="text-neutral-500">
              {t("categories.noCategoriesDesc") ||
                "Check back later for new categories."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
