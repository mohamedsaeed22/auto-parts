"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetOffersQuery } from "@/services/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShoppingCart,
  Percent,
  DollarSign,
  Tag,
  Star,
  Clock,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  Search,
  Flame,
  Gift,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, Pagination } from "@/components/ui";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <p className="text-gray-600">Loading latest offers...</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  </div>
);

// Hero Section Component
const HeroSection = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`text-center ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flame className="h-8 w-8 text-yellow-300" />
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("hero.title") || "Latest Offers"}
          </h1>
          <Gift className="h-8 w-8 text-yellow-300" />
        </div>
        <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto mb-6">
          {t("hero.subtitle") ||
            "Discover amazing deals and exclusive discounts on premium auto parts"}
        </p>
        <div className="flex items-center justify-center gap-6 text-orange-100">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span>{t("hero.feature1") || "Limited Time"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span>{t("hero.feature2") || "Premium Quality"}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>{t("hero.feature3") || "Best Prices"}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Offer Card Component
const OfferCard = ({
  offer,
  isRTL,
  t,
  onViewOffer,
}: {
  offer: any;
  isRTL: boolean;
  t: (key: string) => string;
  onViewOffer: (id: number) => void;
}) => (
  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
    {/* Offer Image */}
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image
        src={offer.image}
        alt={`Offer ${offer.id}`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* Discount Badge */}
      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
        {offer.discount_type === "percentage" ? (
          <Percent size={14} />
        ) : (
          <DollarSign size={14} />
        )}
        {offer.discount_info}
      </div>

      {/* Products Count Badge */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
        {offer.products_count} {t("products") || "Products"}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <Button
          onClick={() => onViewOffer(offer.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 hover:bg-gray-100"
        >
          {t("viewOffer") || "View Offer"}
        </Button>
      </div>
    </div>

    {/* Offer Details */}
    <div className="p-6">
      <div className={`space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex items-center gap-2">
          <Tag className="text-orange-500" size={18} />
          <h3 className="text-xl font-bold text-gray-900">
            {t("specialOffer") || "Special Offer"} #{offer.id}
          </h3>
        </div>

        <div className="space-y-2">
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              {offer.discount_type === "percentage" ? (
                <Percent size={16} className="text-orange-600" />
              ) : (
                <DollarSign size={16} className="text-orange-600" />
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">
                {offer.discount_info}
              </p>
              <p className="text-sm text-gray-600">
                {offer.discount_type === "percentage"
                  ? t("percentageDiscount") || "Percentage Discount"
                  : t("fixedDiscount") || "Fixed Amount Discount"}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {offer.products_count} {t("products") || "Products"}
              </p>
              <p className="text-xs text-gray-500">
                {t("includedInOffer") || "included in this offer"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Button
            onClick={() => onViewOffer(offer.id)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            {t("exploreOffer") || "Explore Offer"}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Filter Bar Component
const FilterBar = ({
  isRTL,
  t,
  viewMode,
  onViewModeChange,
}: {
  isRTL: boolean;
  t: (key: string) => string;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}) => (
  <div className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className={`flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-600" size={20} />
            <span className="text-gray-700 font-medium">
              {t("filters") || "Filters"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Search className="text-gray-600" size={20} />
            <span className="text-gray-700 font-medium">
              {t("search") || "Search"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">
            {t("viewMode") || "View Mode"}:
          </span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function LatestOffersPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation("offers");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts
  useScrollToTop();

  // API Hooks
  const {
    data: offersResponse,
    isLoading,
    error,
    refetch,
  } = useGetOffersQuery();

  const offers = offersResponse?.data?.items || [];

  const handleGoBack = () => {
    router.back();
  };

  const handleViewOffer = (offerId: number) => {
    router.push(`/offers/${offerId}`);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div dir={direction}>
        <HeroSection isRTL={isRTL} t={t} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    let errorMessage = "Failed to load offers";
    if ("status" in error) {
      errorMessage = `Error ${error.status}: Failed to load offers`;
    } else if ("message" in error) {
      errorMessage = error.message || errorMessage;
    }

    return (
      <div dir={direction}>
        <HeroSection isRTL={isRTL} t={t} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={errorMessage} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div dir={direction}>
      {/* Hero Section */}
      <HeroSection isRTL={isRTL} t={t} />

      {/* Filter Bar */}
      {/* <FilterBar
        isRTL={isRTL}
        t={t}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      /> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: t("backButton") || "Back",
              icon: (
                <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
              ),
            },
            {
              label: t("latestOffers") || "Latest Offers",
            },
          ]}
          className="mb-8"
          onItemClick={(item, index) => {
            if (index === 0) handleGoBack();
          }}
        />

        {/* Offers Count */}
        <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("foundOffers") || "Found Offers"}
          </h2>
          <p className="text-gray-600">
            {t("offersCount") || `${offers.length} amazing offers available`}
          </p>
        </div>

        {/* Offers Grid/List */}
        {offers.length === 0 ? (
          <div className="text-center py-16">
            <Gift className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t("noOffers") || "No offers available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {t("noOffersDesc") || "Check back later for new exciting offers!"}
            </p>
            <Button onClick={handleGoBack} variant="outline">
              {t("goBack") || "Go Back"}
            </Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {offers.map((offer: any) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isRTL={isRTL}
                t={t}
                onViewOffer={handleViewOffer}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {offers.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("stayUpdated") || "Stay Updated"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {t("stayUpdatedDesc") ||
                  "Don't miss out on our latest offers and exclusive deals. Subscribe to our newsletter for early access!"}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Clock className="text-orange-500" size={20} />
                <span className="text-gray-700 font-medium">
                  {t("newOffersDaily") || "New offers added daily"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
