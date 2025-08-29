"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useGetBrandsQuery } from "@/services/hooks";
import { Brand } from "@/services/api/types";
import { Loader2, AlertCircle } from "lucide-react";
import ViewAllButton from "@/components/ui/view-all-button";

const Brands = () => {
  const { t, i18n } = useTranslation("brands");
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

  // Loading component
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

          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
              <p className="text-neutral-600">
                {t("loadingBrands") || "Loading brands..."}
              </p>
            </div>
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
              <AlertCircle className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {t("errorLoadingBrands") || "Error loading brands"}
              </h3>
              <p className="text-neutral-600 mb-4">
                {t("errorLoadingBrandsDesc") ||
                  "There was an error loading the brands. Please try again."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
              >
                {t("tryAgain") || "Try Again"}
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
          {brands.map((brand: Brand) => (
            <div
              key={brand.id}
              className="group relative flex flex-col items-center"
            >
              {/* Brand logo container */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-neutral-100">
                {/* Background with brand color */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-neutral-50" />

                {/* Brand logo overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full h-full relative">
                    <Image
                      src={
                        brand.image || brand.logo || "/placeholder-brand.png"
                      }
                      alt={brand.name}
                      fill
                      className="object-contain p-4"
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
              <p className="mt-4 text-base md:text-lg font-medium text-neutral-700 text-center group-hover:text-neutral-900 transition-colors duration-300">
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
