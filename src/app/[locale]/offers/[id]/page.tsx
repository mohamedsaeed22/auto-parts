"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetOfferQuery } from "@/services/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Types for the offer page
interface OfferProduct {
  id: number;
  name: string;
  price: string;
  discount_type: string | null;
  discount_amount: string | null;
  final_price: number;
  discount_info: string;
  offer: {
    id: number;
    image: string;
    discount_type: string;
    discount_amount: string;
    discount_info: string;
    products_count: number;
  };
  primary_image: string;
  images: string[];
  description: string;
  hover_text: string;
  product_identifier: string;
}

interface OfferDetails {
  id: number;
  image: string;
  discount_type: string;
  discount_amount: string;
  discount_info: string;
  products_count: number;
  products: OfferProduct[];
}
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Percent,
  DollarSign,
  Tag,
} from "lucide-react";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";
import ProductCard from "@/components/product/ProductCard";

// Offer Header Component
const OfferHeader = ({
  offer,
  isRTL,
  t,
}: {
  offer: OfferDetails;
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 mb-8">
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
        isRTL ? "lg:grid-flow-col-dense" : ""
      }`}
    >
      {/* Offer Image */}
      <div className="relative aspect-video bg-white rounded-xl overflow-hidden shadow-lg">
        <Image
          src={offer.image}
          alt={`Offer ${offer.id}`}
          fill
          className="object-cover"
          priority
        />
        <div
          className={`absolute top-4 ${
            isRTL ? "right-4" : "left-4"
          } bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}
        >
          {offer.discount_type === "percentage" ? (
            <Percent size={14} />
          ) : (
            <DollarSign size={14} />
          )}
          {offer.discount_info}
        </div>
      </div>

      {/* Offer Details */}
      <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex items-center gap-2">
          <Tag className="text-orange-500" size={20} />
          <h1 className="text-3xl font-bold text-gray-900">
            {t("specialOffer") || "Special Offer"}
          </h1>
        </div>

        <div className="space-y-3">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              {offer.discount_type === "percentage" ? (
                <Percent size={24} className="text-orange-600" />
              ) : (
                <DollarSign size={24} className="text-orange-600" />
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {offer.discount_info}
              </p>
              <p className="text-gray-600">
                {offer.discount_type === "percentage"
                  ? t("percentageDiscount") || "Percentage Discount"
                  : t("fixedDiscount") || "Fixed Amount Discount"}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">
                {offer.products_count} {t("products") || "Products"}
              </p>
              <p className="text-gray-600">
                {t("includedInOffer") || "included in this offer"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <p className="text-gray-700 font-medium">
            {t("offerDescription") ||
              "Get amazing discounts on selected products. Limited time offer!"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Product Features Component
const ProductFeatures = ({
  isRTL,
  t,
}: {
  isRTL: boolean;
  t: (key: string) => string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg mb-8">
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Truck size={20} className="text-green-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">
          {t("freeShipping") || "Free Shipping"}
        </p>
        <p className="text-sm text-gray-500">
          {t("freeShippingDesc") || "On orders over $50"}
        </p>
      </div>
    </div>
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <Shield size={20} className="text-green-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">
          {t("warranty") || "Warranty"}
        </p>
        <p className="text-sm text-gray-500">
          {t("warrantyDesc") || "1 year guarantee"}
        </p>
      </div>
    </div>
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
        <RotateCcw size={20} className="text-green-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">
          {t("returns") || "Easy Returns"}
        </p>
        <p className="text-sm text-gray-500">
          {t("returnsDesc") || "30 day policy"}
        </p>
      </div>
    </div>
  </div>
);

export default function OfferPage() {
  const router = useRouter();
  const params = useParams();
  const offerId = parseInt(params.id as string);
  const { t, i18n } = useTranslation("offers");

  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts or offerId changes
  useScrollToTop([offerId]);

  // API Hooks
  const {
    data: offerResponse,
    isLoading,
    error,
    refetch,
  } = useGetOfferQuery(offerId);

  const offerData = offerResponse?.data as { offer: OfferDetails };
  const offer = offerData?.offer;
  const products = offer?.products || [];

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
        <LoadingSpinner
          message={t("loadingOfferDetails") || "Loading offer details..."}
        />
      </div>
    );
  }

  // Handle error state
  if (error) {
    let errorMessage =
      t("failedToLoadOfferDetails") || "Failed to load offer details";
    if ("status" in error) {
      errorMessage = `${t("error") || "Error"} ${error.status}: ${
        t("failedToLoadOfferDetails") || "Failed to load offer details"
      }`;
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

  // Handle case where offer is not found
  if (!offer) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <ErrorMessage message={t("offerNotFound") || "Offer not found"} />
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
            isRTL ? "flex-row" : ""
          }`}
        >
          <ArrowLeft
            size={16}
            className={isRTL ? "transform rotate-180" : ""}
          />
          <span>{t("backButton") || "Back"}</span>
        </button>
        <span>/</span>
        <span className="text-gray-900">{t("offers") || "Offers"}</span>
        <span>/</span>
        <span className="text-gray-900 truncate">
          {t("offer") || "Offer"} #{offer.id}
        </span>
      </nav>

      {/* Offer Header */}
      <OfferHeader offer={offer} isRTL={isRTL} t={t} />

      {/* Product Features */}
      <ProductFeatures isRTL={isRTL} t={t} />

      {/* Products Section */}
      <div className="space-y-6">
        <div className={`text-center ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("offerProducts") || "Products in this Offer"}
          </h2>
          <p className="text-gray-600">
            {t("offerProductsDesc") ||
              `Browse ${products.length} products with special discounts`}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {t("noProducts") || "No products in this offer"}
            </h3>
            <p className="text-gray-500">
              {t("noProductsDesc") ||
                "This offer doesn't contain any products at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: OfferProduct) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  final_price: product.final_price,
                  primary_image: product.primary_image,
                  description: product.description,
                  product_identifier: product.product_identifier,
                  discount_info: product.discount_info,
                  offer: {
                    id: product.offer.id,
                    image: product.offer.image,
                    discount_type: product.offer.discount_type as
                      | "fixed"
                      | "percentage",
                    discount_amount: product.offer.discount_amount,
                    discount_info: product.offer.discount_info,
                    products_count: product.offer.products_count,
                  },
                  brand: null,
                  category: {
                    id: 0,
                    name: "",
                    level: 0,
                    image: "",
                    parent: null,
                  },
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
