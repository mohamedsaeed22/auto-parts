"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetBrandsQuery } from "@/services/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useQueryState, parseAsInteger } from "nuqs";
import { SEOMetadata } from "@/components/seo/SEOMetadata";
import { StructuredData } from "@/components/seo/StructuredData";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { seoConfig, getKeywords } from "@/lib/seo/config";
import {
  ArrowLeft,
  Building2,
  Star,
  Clock,
  Award,
  Shield,
  CheckCircle,
  Globe,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";

// Types
interface Brand {
  id: number;
  name: string;
  image?: string;
  number_of_products?: number;
}

interface BrandsPageClientProps {
  locale: string;
}

// Hero Section Component
const HeroSection = ({ t }: { t: (key: string) => string }) => (
  <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 flex-wrap">
          <Building2 className="h-6 w-6 md:h-8 md:w-8 text-white/70" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            {t("hero.title") || "Premium Brands"}
          </h1>
          <Award className="h-6 w-6 md:h-8 md:w-8 text-white/70" />
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-6">
          {t("hero.subtitle") ||
            "Discover world-class automotive brands and premium quality parts"}
        </p>
        <div className="flex items-center justify-center gap-3 md:gap-6 text-white/70 flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>{t("hero.feature1") || "Trusted Quality"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span>{t("hero.feature2") || "Premium Brands"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>{t("hero.feature3") || "Global Standards"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Brand Card Component
const BrandCard = ({
  brand,
  isRTL,
  t,
  onViewBrand,
}: {
  brand: Brand;
  isRTL: boolean;
  t: (key: string) => string;
  onViewBrand: (id: number) => void;
}) => (
  <div
    className="cursor-pointer group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    onClick={() => onViewBrand(brand.id)}
  >
    {/* Brand Image */}
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <Image
        src={brand.image || "/placeholder-brand.png"}
        alt={brand.name}
        fill
        className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
      />

      {/* Premium Badge */}
      <div
        className={`absolute top-4 ${
          isRTL ? "right-4" : "left-4"
        } bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg`}
      >
        <Star size={14} />
        {t("premium") || "Premium"}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onViewBrand(brand.id);
          }}
          className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
        >
          {t("viewBrand") || "View Brand"}
        </Button>
      </div>
    </div>

    {/* Brand Details */}
    <div className="p-6">
      <div className="space-y-3">
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}>
          <Building2 className="text-primary" size={18} />
          <h3
            className="text-xl font-bold text-gray-900 truncate"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {brand.name}
          </h3>
        </div>

        <div className="space-y-2">
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-primary" />
            </div>
            <div
              className={isRTL ? "text-right" : "text-left"}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="text-sm font-semibold text-gray-900">
                {t("certified") || "Certified Brand"}
              </p>
              <p className="text-xs text-gray-500">
                {t("qualityAssured") || "Quality assured"}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Car size={16} className="text-green-600" />
            </div>
            <div
              className={isRTL ? "text-right" : "text-left"}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="text-sm font-semibold text-gray-900">
                {brand.number_of_products || 0} {t("products") || "Products"}
              </p>
              <p className="text-xs text-gray-500">
                {t("available") || "Available"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewBrand(brand.id);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white cursor-pointer"
          >
            {t("exploreBrand") || "Explore Brand"}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Brand Features Component
const BrandFeatures = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg mb-8">
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <Shield size={20} className="text-primary" />
      </div>
      <div
        className={isRTL ? "text-right" : "text-left"}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <p className="font-medium text-gray-900">
          {t("certifiedBrands") || "Certified Brands"}
        </p>
        <p className="text-sm text-gray-500">
          {t("certifiedBrandsDesc") || "All brands are certified"}
        </p>
      </div>
    </div>
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle size={20} className="text-green-600" />
      </div>
      <div
        className={isRTL ? "text-right" : "text-left"}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <p className="font-medium text-gray-900">
          {t("qualityAssurance") || "Quality Assurance"}
        </p>
        <p className="text-sm text-gray-500">
          {t("qualityAssuranceDesc") || "Premium quality guarantee"}
        </p>
      </div>
    </div>
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <Globe size={20} className="text-primary" />
      </div>
      <div
        className={isRTL ? "text-right" : "text-left"}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <p className="font-medium text-gray-900">
          {t("globalStandards") || "Global Standards"}
        </p>
        <p className="text-sm text-gray-500">
          {t("globalStandardsDesc") || "International quality standards"}
        </p>
      </div>
    </div>
  </div>
);

export default function BrandsPageClient({ locale }: BrandsPageClientProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation("brands");
  const [viewMode] = useState<"grid" | "list">("grid");
  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts
  useScrollToTop();

  // Use nuqs to manage page state
  const [currentPage, setCurrentPage] = useQueryState("page", parseAsInteger.withDefault(1));

  // Reset to page 1 when component first mounts (when navigating to /brands)
  useEffect(() => {
    // Only reset if we're not already on page 1
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  // API Hooks
  const {
    data: brandsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
    isError,
  } = useGetBrandsQuery({
    page: currentPage,
    per_page: 12,
  });

  const brands = brandsResponse?.data?.items || [];
  const pagination = brandsResponse?.data?.pagination;

  // Debug logging
  console.log("🏷️ BrandsPageClient - API State:", {
    isLoading,
    isFetching,
    isError,
    error,
    brandsCount: brands.length,
    currentPage,
    brandsResponse: brandsResponse?.data,
  });

  const handleGoBack = () => {
    router.push("/");
  };

  const handleViewBrand = (brandId: number) => {
    router.push(`/brands/${brandId}`);
  };

  // Enhanced retry function with better error handling
  const handleRetry = () => {
    console.log("🔄 Retrying brands API call...");
    refetch();
  };

  // Auto-retry logic for empty brands with no error
  useEffect(() => {
    if (!isLoading && !isError && brands.length === 0 && brandsResponse) {
      console.log(
        "⚠️ Brands array is empty but API call succeeded, retrying..."
      );
      // Small delay to avoid rapid retries
      const timeoutId = setTimeout(() => {
        refetch();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, isError, brands.length, brandsResponse, refetch]);

  // Handle loading state
  if (isLoading) {
    return (
      <div dir={direction}>
        <HeroSection t={t} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner message={t("loadingBrands", "Loading brands...")} />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || isError) {
    let errorMessage = t("failedToLoadBrands", "Failed to load brands");
    if ("status" in error) {
      errorMessage = `${t("error", "Error")} ${error.status}: ${t(
        "failedToLoadBrands",
        "Failed to load brands"
      )}`;
    } else if ("message" in error) {
      errorMessage = error.message || errorMessage;
    }

    console.error("❌ Brands API Error:", error);

    return (
      <div dir={direction}>
        <HeroSection t={t} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={errorMessage} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div dir={direction}>
      <SEOMetadata
        title={
          seoConfig.defaultMetadata.brands.title[
            locale as keyof typeof seoConfig.defaultMetadata.brands.title
          ] || seoConfig.defaultMetadata.brands.title.en
        }
        description={
          seoConfig.defaultMetadata.brands.description[
            locale as keyof typeof seoConfig.defaultMetadata.brands.description
          ] || seoConfig.defaultMetadata.brands.description.en
        }
        keywords={getKeywords(locale)}
        locale={locale}
        type="website"
      />
      <StructuredData
        type="brand"
        data={{
          name:
            seoConfig.defaultMetadata.brands.title[
              locale as keyof typeof seoConfig.defaultMetadata.brands.title
            ] || seoConfig.defaultMetadata.brands.title.en,
          description:
            seoConfig.defaultMetadata.brands.description[
              locale as keyof typeof seoConfig.defaultMetadata.brands.description
            ] || seoConfig.defaultMetadata.brands.description.en,
          url: `${seoConfig.siteUrl}/${locale}/brands`,
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
            <>
              <ArrowLeft
                size={16}
                className={isRTL ? "transform rotate-180" : ""}
              />
              <span>{t("backButton") || "Back"}</span>
            </>
          </button>
          <span>/</span>
          <span className="text-gray-900">{t("brands") || "Brands"}</span>
        </nav>

        {/* Brand Features */}
        <div data-brand-features>
          <BrandFeatures isRTL={isRTL} t={t} />
        </div>

        {/* Brands Count */}
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("foundBrands") || "Found Brands"}
          </h2>
        </div>

        {/* Brands Grid/List */}
        {brands.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t("noBrands") || "No brands available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {t("noBrandsDesc") || "Check back later for new brands!"}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleGoBack} variant="outline">
                {t("goBack") || "Go Back"}
              </Button>
              <Button onClick={handleRetry} variant="default">
                {t("retry") || "Retry"}
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {brands.map((brand: Brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                isRTL={isRTL}
                t={t}
                onViewBrand={handleViewBrand}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {brands.length > 0 && pagination && pagination.last_page > 1 && (
          <div className="mt-12">
            <CustomPagination
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
            />
          </div>
        )}

        {/* Bottom CTA */}
        {brands.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("stayUpdated") || "Stay Updated"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {t("stayUpdatedDesc") ||
                  "Don't miss out on new brands and exclusive partnerships. Subscribe to our newsletter for early access!"}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Clock className="text-primary" size={20} />
                <span className="text-gray-700 font-medium">
                  {t("newBrandsRegularly") || "New brands added regularly"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
