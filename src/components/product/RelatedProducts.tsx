"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetProductsMutation } from "@/services/hooks";
import { Product } from "@/services/api/types";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
  isRTL: boolean;
}

const RelatedProducts = ({ categoryId, currentProductId, isRTL }: RelatedProductsProps) => {
  const { t } = useTranslation("products");
  const [getProducts, { data: productsResponse, isLoading, error }] = useGetProductsMutation();

  useEffect(() => {
    // Fetch related products from the same category, excluding current product
    getProducts({
      category_id: categoryId,
      per_page: 8, // Limit to 8 related products
    });
  }, [categoryId, getProducts]);

  const products = productsResponse?.data?.items?.filter(
    (product: Product) => product.id !== currentProductId
  ) || [];

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className={`text-2xl font-bold mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          {t("details.relatedProducts")}
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <p className="text-gray-600">{t("details.loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't show section if no related products
  }

  return (
    <div className="mt-16">
      <h2 className={`text-2xl font-bold mb-8 ${isRTL ? "text-right" : "text-left"}`}>
        {t("details.relatedProducts")}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;