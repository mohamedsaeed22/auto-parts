"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useGetBrandsQuery, useGetProductsMutation } from "@/services/hooks";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Product } from "@/services/api/types";
import ProductCard from "@/components/product/ProductCard";
import {
  ArrowLeft,
  Building2,
  Star,
  CheckCircle,
  Car,
  Shield,
  Package,
  Truck,
  RotateCcw,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";
import { da } from "date-fns/locale";

// Types
interface Brand {
  id: number;
  name: string;
  image?: string;
  number_of_products?: number;
}

// Brand Header Component
const BrandHeader = ({
  brand,
  isRTL,
  t,
}: {
  brand: Brand;
  isRTL: boolean;
  t: (key: string) => string;
}) => (

  <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 mb-8">
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
        isRTL ? "lg:grid-flow-col-dense" : ""
      }`}
    >
      {/* Brand Image */}
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
        <Image
          src={brand.image || "/placeholder-brand.png"}
          alt={brand.name}
          fill
          className="object-contain p-8"
          priority
        />
        <div
          className={`absolute top-4 ${
            isRTL ? "right-4" : "left-4"
          } bg-primary text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}
        >
          <Star size={14} />
          {t("premium") || "Premium"}
        </div>
      </div>

      {/* Brand Details */}
      <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}>
          <Building2 className="text-primary" size={24} />
          <h1
            className="text-3xl font-bold text-gray-900"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {brand.name}
          </h1>
        </div>

        <div className="space-y-3">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle size={24} className="text-primary" />
            </div>
            <div
              className={isRTL ? "text-right" : "text-left"}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="text-xl font-semibold text-gray-900">
                {t("certifiedBrand") || "Certified Brand"}
              </p>
              <p className="text-gray-600">
                {t("qualityAssured") || "Quality assured and verified"}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Car size={24} className="text-green-600" />
            </div>
            <div
              className={isRTL ? "text-right" : "text-left"}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="text-xl font-semibold text-gray-900">
                {brand.number_of_products || 0} {t("products") || "Products"}
              </p>
              <p className="text-gray-600">
                {t("availableForThisBrand") || "available for this brand"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-primary/20">
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
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <Shield size={20} className="text-primary" />
      </div>
      <div
        className={isRTL ? "text-right" : "text-left"}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <p className="font-medium text-gray-900">
          {t("certifiedQuality") || "Certified Quality"}
        </p>
        <p className="text-sm text-gray-500">
          {t("certifiedQualityDesc") || "All products are certified"}
        </p>
      </div>
    </div>
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <Truck size={20} className="text-green-600" />
      </div>
      <div
        className={isRTL ? "text-right" : "text-left"}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <p className="font-medium text-gray-900">
          {t("fastDelivery") || "Fast Delivery"}
        </p>
        <p className="text-sm text-gray-500">
          {t("fastDeliveryDesc") || "Quick and reliable shipping"}
        </p>
      </div>
    </div>
    <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <RotateCcw size={20} className="text-primary" />
      </div>
      <div
        className={isRTL ? "text-right" : "text-left"}
        dir={isRTL ? "rtl" : "ltr"}
      >
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
  const brand = brands.find((b: Brand) => b.id === brandId);
  console.log(brand);

  // Products state and API
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [getProducts] = useGetProductsMutation();

  // Fetch products for this brand
  useEffect(() => {
    if (brandId) {
      setProductsLoading(true);
      setProductsError(null);

      getProducts({ brand_id: brandId })
        .unwrap()
        .then((response) => {
          if (response.data?.items) {
            setProducts(response.data.items);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setProductsError(error.message || "Failed to load products");
        })
        .finally(() => {
          setProductsLoading(false);
        });
    }
  }, [brandId, getProducts]);

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
          message={t("loadingBrandDetails") || "Loading brand details..."}
        />
      </div>
    );
  }

  // Handle error state
  if (error) {
    let errorMessage =
      t("failedToLoadBrandDetails") || "Failed to load brand details";
    if ("status" in error) {
      errorMessage = `${t("error") || "Error"} ${error.status}: ${
        t("failedToLoadBrandDetails") || "Failed to load brand details"
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

  // Handle case where brand is not found
  if (!brand) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <ErrorMessage message={t("brandNotFound") || "Brand not found"} />
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={direction}
    >
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
        <button
          onClick={() => router.push("/brands")}
          className="hover:text-gray-700 transition-colors"
        >
          {t("brands")}
        </button>
        <span>/</span>
        <span className="text-gray-900">{brand.name}</span>
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

        {/* Products Loading State */}
        {productsLoading && (
          <div className="text-center py-12">
            <LoadingSpinner
              message={t("loadingProducts") || "Loading products..."}
            />
          </div>
        )}

        {/* Products Error State */}
        {productsError && (
          <div className="text-center py-12">
            <ErrorMessage
              message={productsError}
              onRetry={() => {
                setProductsError(null);
                getProducts({ brand_id: brandId })
                  .unwrap()
                  .then((response) => {
                    if (response.data?.items) {
                      setProducts(response.data.items);
                    }
                  })
                  .catch((error) => {
                    setProductsError(
                      error.message || "Failed to load products"
                    );
                  });
              }}
            />
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && !productsError && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Products State */}
        {!productsLoading && !productsError && products.length === 0 && (
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
        )}
      </div>
    </div>
  );
}
