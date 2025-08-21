"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { products } from "./productsData";

const ProductsList = () => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";

  return (
    <section
      className="py-16 bg-gray-50 rounded-3xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-800 mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("featuredProducts")}
          </h2>
          <p
            className={`text-gray-600 max-w-2xl mx-auto ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("featuredDescription")}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 py-3">
            {t("loadMore")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
