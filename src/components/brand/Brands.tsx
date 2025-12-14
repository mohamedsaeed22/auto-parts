"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetBrandsQuery } from "@/services/hooks";
import { Brand } from "@/services/api/types";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ViewAllButton from "@/components/ui/view-all-button";

const Brands = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation("brands");
  const { t: tCommon } = useTranslation("common");
  const isRTL = i18n.language === "ar";

  // API hook to fetch brands
  const {
    data: brandsResponse,
    isLoading,
    error,
    refetch,
  } = useGetBrandsQuery();

  // Extract brands from response
  const brands = brandsResponse?.data?.items || [];

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 bg-neutral-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              {t("title")}
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full mb-4" />
                <Skeleton className="w-24 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error component
  if (error) {
    return (
      <section className="py-16 bg-neutral-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {tCommon("errorLoadingData") || "Error loading data"}
              </h3>
              <p className="text-neutral-600 mb-4">
                {tCommon("errorLoadingDataDesc") ||
                  "There was an error loading the data. Please try again."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
              >
                {tCommon("tryAgain") || "Try Again"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No brands found
  if (brands.length === 0) {
    return (
      <section className="py-16 bg-neutral-50" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("title")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-neutral-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {t("noBrandsFound") || "No brands found"}
              </h3>
              <p className="text-neutral-600">
                {t("noBrandsFoundDesc") ||
                  "No brands are available at the moment."}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleViewBrand = (brandId: number) => {
    router.push(`/brands/${brandId}`);
  };

  return (
    <section className="py-16 bg-neutral-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            {t("title")}
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
          {brands.slice(0, 8).map((brand: Brand) => (
            <div
              key={brand.id}
              className="group relative flex flex-col items-center cursor-pointer"
              onClick={() => handleViewBrand(brand.id)}
            >
              {/* Brand logo container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white ring-1 ring-neutral-200 group-hover:ring-2 group-hover:ring-primary/60">
                {/* Subtle gradient to match theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white" />

                {/* Brand logo overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <div className="w-full h-full relative">
                    <Image
                      src={
                        brand.image || brand.logo || "/placeholder-brand.png"
                      }
                      alt={brand.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-brand.png";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Brand name */}
              <p
                className="mt-3 text-sm sm:text-base md:text-lg font-medium text-neutral-800 text-center group-hover:text-neutral-900 transition-colors duration-300"
                title={brand.name}
              >
                {brand.name}
              </p>
            </div>
          ))}
        </div>

        {/* Show All Brands Button */}
        <ViewAllButton
          href="/brands"
          translationKey="showAllBrands"
          fallbackText="Show All Brands"
          namespace="brands"
        />
      </div>
    </section>
  );
};

export default Brands;
