"use client";

import Image from "next/image";
import { ShoppingCart, Minus, Plus, Trash, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";
import { Locale } from "@/lib/types";

const product = {
  id: 1,
  title: {
    ar: "فرامل عالية الأداء",
    en: "High Performance Brake Pads",
  },
  price: 89.99,
  description: {
    ar: "وسائد فرامل ممتازة مصممة للمركبات عالية الأداء. تتميز بمواد احتكاك متقدمة لقوة توقف فائقة وتقليل تلاشي الفرامل. مثالية للسيارات الرياضية والتطبيقات الشاقة.",
    en: "Premium brake pads designed for high-performance vehicles. Features advanced friction materials for superior stopping power and reduced brake fade. Ideal for sports cars and demanding applications.",
  },
  category: {
    ar: "الفرامل",
    en: "Brakes",
  },
  image: "/offers/offer1.jpg",
  rating: {
    rate: 4.5,
    count: 128,
  },
  images: [
    "/products/product1.jpg",
    "/products/product1.jpg",
    "/products/product1.jpg",
    "/products/product1.jpg",
  ],
};

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const { t, i18n } = useTranslation("product");
  const [selectedImage, setSelectedImage] = useState(0);

  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Use Redux hook
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title[locale],
      price: product.price,
      image: product.image,
      category: product.category[locale],
      description: product.description[locale],
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

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
              <span>{t("backButton")}</span>
              <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
            </>
          ) : (
            <>
              <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
              <span>{t("backButton")}</span>
            </>
          )}
        </button>
        <span>/</span>
        <span className="capitalize">{product.category[locale]}</span>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.title[locale]}</span>
      </nav>

      {/* Main Product Layout */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${
          isRTL ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Product Images - Always first in RTL, second in LTR */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.title[locale]}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${
                  index === selectedImage
                    ? "border-gray-900"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title[locale]} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info - Always second in RTL, first in LTR */}
        <div className="space-y-6">
          <div>
            <h1
              className={`text-3xl font-bold text-gray-900 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {product.title[locale]}
            </h1>
            <p
              className={`text-2xl font-bold text-gray-900 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {isRTL
                ? `${t("currency")} ${product.price}`
                : `${product.price} ${t("currency")}`}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("description")}
            </h3>
            <p
              className={`text-gray-700 leading-relaxed ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {product.description[locale]}
            </p>
          </div>

          {/* Category */}
          <div className={isRTL ? "text-right" : "text-left"}>
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
              {product.category[locale]}
            </span>
          </div>

          <label
            className={`block text-sm font-medium text-black mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("quantity")}
          </label>

          <div className="bg-black rounded-lg p-2 min-h-[44px] flex items-center justify-center">
            {!isInCart ? (
              <Button
                onClick={handleAddToCart}
                className={`w-full h-9 flex items-center justify-center gap-2 text-sm font-medium ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                size="sm"
              >
                <ShoppingCart size={16} />
                <span>{t("addToCart")}</span>
              </Button>
            ) : (
              // Quantity Selector with matching compact dimensions
              <div className="w-full max-w-[200px] h-9 flex items-center justify-center">
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <button
                    onClick={() => handleQuantityChange(currentQuantity + 1)}
                    className="w-8 h-8 border border-gray-500 rounded-md hover:bg-gray-800 transition-colors text-white flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                  <span className="text-lg font-semibold w-8 text-center text-white">
                    {currentQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(currentQuantity - 1)}
                    className="w-8 h-8 border border-gray-500 rounded-md hover:bg-gray-800 transition-colors text-white flex items-center justify-center"
                  >
                    {currentQuantity === 1 ? (
                      <Trash size={14} />
                    ) : (
                      <Minus size={14} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-4">
            <div
              className={`flex justify-between items-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-sm text-gray-600">{t("productCode")}:</span>
              <span className="text-sm font-medium">PRD-{product.id}</span>
            </div>
            <div
              className={`flex justify-between items-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-sm text-gray-600">
                {t("availability")}:
              </span>
              <span className="text-sm font-medium text-green-600">
                {t("available")}
              </span>
            </div>
            <div
              className={`flex justify-between items-center ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-sm text-gray-600">{t("category")}:</span>
              <span className="text-sm font-medium capitalize">
                {product.category[locale]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
