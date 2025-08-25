"use client";

import React from "react";
import ProductsList from "@/components/product/ProductsList";
import { useTranslation } from "react-i18next";

export default function ProductsPage() {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("products") || "Products"}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("productsPageDescription") ||
                "Browse our comprehensive collection of high-quality auto parts and accessories"}
            </p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <ProductsList />
    </div>
  );
}
