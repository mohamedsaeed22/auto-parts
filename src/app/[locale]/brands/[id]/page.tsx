"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetBrandsQuery } from "@/services/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  Star,
  CheckCircle,
  Globe,
  Car,
  Settings,
  Users,
  Award,
  Shield,
  Clock,
  TrendingUp,
  Package,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <p className="text-gray-600">Loading brand details...</p>
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

// Brand Header Component
const BrandHeader = ({
  brand,
  isRTL,
  t,
}: {
  brand: any;
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 mb-8">
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
        isRTL ? "lg:grid-flow-col-dense" : ""
      }`}
    >
      {/* Brand Image */}
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          className="object-contain p-8"
          priority
        />
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Star size={14} />
          {t("premium") || "Premium"}
        </div>
      </div>

      {/* Brand Details */}
      <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex items-center gap-2">
          <Building2 className="text-blue-500" size={24} />
          <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
        </div>

        <div className="space-y-3">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {t("certifiedBrand") || "Certified Brand"}
              </p>
              <p className="text-gray-600">
                {t("qualityAssured") || "Quality assured and verified"}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Car size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {brand.products_count || 0} {t("products") || "Products"}
              </p>
              <p className="text-gray-600">
                {t("availableForThisBrand") || "available for this brand"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <p className="text-gray-700 font-medium">
            {t("brandDescription") ||
              "Premium automotive brand with world-class quality standards and innovative technology."}
          </p>
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
    <div
      className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
    >
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Shield size={20} className="text-blue-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">
          {t("certifiedQuality") || "Certified Quality"}
        </p>
        <p className="text-sm text-gray-500">
          {t("certifiedQualityDesc") || "All products are certified"}
        </p>
      </div>
    </div>
    <div
      className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
    >
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <Truck size={20} className="text-green-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">
          {t("fastDelivery") || "Fast Delivery"}
        </p>
        <p className="text-sm text-gray-500">
          {t("fastDeliveryDesc") || "Quick and reliable shipping"}
        </p>
      </div>
    </div>
    <div
      className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
    >
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
        <RotateCcw size={20} className="text-purple-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">
          {t("easyReturns") || "Easy Returns"}
        </p>
        <p className="text-sm text-gray-500">
          {t("easyReturnsDesc") || "30 day return policy"}
        </p>
      </div>
    </div>
  </div>
);

export default function BrandPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = parseInt(params.id as string);
  const { t, i18n } = useTranslation("brands");
  const [selectedImage, setSelectedImage] = useState(0);

  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts or brandId changes
  useScrollToTop([brandId]);

  // API Hooks
  const {
    data: brandsResponse,
    isLoading,
    error,
    refetch,
  } = useGetBrandsQuery();

  const brands = brandsResponse?.data?.items || [];
  const brand = brands.find((b: any) => b.id === brandId);

  const handleGoBack = () => {
    router.back();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (error) {
    let errorMessage = "Failed to load brand details";
    if ("status" in error) {
      errorMessage = `Error ${error.status}: Failed to load brand`;
    } else if ("message" in error) {
      errorMessage = error.message || errorMessage;
    }

    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <ErrorMessage message={errorMessage} onRetry={refetch} />
      </div>
    );
  }

  // Handle case where brand is not found
  if (!brand) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <ErrorMessage message="Brand not found" />
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={direction}
    >
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
        <span className="text-gray-900">{t("brands") || "Brands"}</span>
        <span>/</span>
        <span className="text-gray-900 truncate">{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <BrandHeader brand={brand} isRTL={isRTL} t={t} />

      {/* Brand Features */}
      <BrandFeatures isRTL={isRTL} t={t} />

      {/* Products Section */}
      <div className="space-y-6">
        <div className={`text-center ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("brandProducts") || "Products by this Brand"}
          </h2>
          <p className="text-gray-600">
            {t("brandProductsDesc") || `Browse products from ${brand.name}`}
          </p>
        </div>

        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {t("noProductsYet") || "No products available yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("noProductsYetDesc") ||
              "Products from this brand will be available soon."}
          </p>
          <Button onClick={handleGoBack} variant="outline">
            {t("goBack") || "Go Back"}
          </Button>
        </div>
      </div>
    </div>
  );
}
