"use client";

import Image from "next/image";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";
import { useGetProductQuery, useAddToCartMutation } from "@/services/hooks";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <p className="text-gray-600">Loading product details...</p>
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

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { t, i18n } = useTranslation("product");
  const [selectedImage, setSelectedImage] = useState(0);

  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // API Hooks
  const {
    data: productResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductQuery(productId);

  const [addToCartApi, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Use Redux hook for local cart state
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();

  const product = productResponse?.data?.product;
  const cartItem = items.find((item) => item.id === productId);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Add to API cart
      await addToCartApi({
        product_id: product.id,
        quantity: 1,
      }).unwrap();

      // Add to local Redux cart for immediate UI update
      addToCart({
        id: product.id,
        title: product.name || "Product",
        price: Number(product.final_price) || Number(product.price) || 0,
        image: product.primary_image || "",
        category: product.category?.name || "Unknown Category",
        description: product.description || "",
      });

      console.log("Added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

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
    let errorMessage = "Failed to load product details";
    if ("status" in error) {
      errorMessage = `Error ${error.status}: Failed to load product`;
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

  // Handle case where product is not found
  if (!product) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <ErrorMessage message="Product not found" />
      </div>
    );
  }

  // Prepare images array with safety checks
  const productImages = (() => {
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images;
    }
    if (product.primary_image) {
      return [product.primary_image];
    }
    return [];
  })();

  // Safe access to product properties
  const productName = product.name || "Product Name Unavailable";
  const productPrice = product.price || "0";
  const productFinalPrice = product.final_price || productPrice;
  const productDescription = product.description || "No description available";
  const productCode = product.product_identifier || "N/A";
  const categoryName = product.category?.name || "Unknown Category";
  const parentCategoryName = product.category?.parent?.name;
  const brandName = product.brand?.name;
  const offerInfo = product.offer;
  const hoverText = product.hover_text;

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
        <span className="capitalize">{categoryName}</span>
        <span>/</span>
        <span className="text-gray-900 truncate">{productName}</span>
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
            {productImages.length > 0 ? (
              <Image
                src={
                  productImages[
                    Math.min(selectedImage, productImages.length - 1)
                  ]
                }
                alt={productName}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Thumbnail images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image: string, index: number) => (
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
                    alt={`${productName} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - Always second in RTL, first in LTR */}
        <div className="space-y-6">
          <div>
            <h1
              className={`text-3xl font-bold text-gray-900 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {productName}
            </h1>
            <div className={`space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
              {product.discount_type && (
                <p className="text-lg text-gray-500 line-through">
                  {isRTL
                    ? `${t("currency")} ${productPrice}`
                    : `${productPrice} ${t("currency")}`}
                </p>
              )}
              <p className="text-2xl font-bold text-gray-900">
                {isRTL
                  ? `${t("currency")} ${productFinalPrice}`
                  : `${productFinalPrice} ${t("currency")}`}
              </p>
              {product.discount_info && (
                <p className="text-sm text-green-600 font-medium">
                  {product.discount_info}
                </p>
              )}
            </div>
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
            <div
              className={`text-gray-700 leading-relaxed ${
                isRTL ? "text-right" : "text-left"
              }`}
              dangerouslySetInnerHTML={{ __html: productDescription }}
            />
          </div>

          {/* Category and Brand */}
          <div className={isRTL ? "text-right" : "text-left"}>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
                {categoryName}
              </span>
              {parentCategoryName && (
                <span className="inline-block bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {parentCategoryName}
                </span>
              )}
              {brandName && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {brandName}
                </span>
              )}
            </div>
          </div>

          {/* Offer Information */}
          {offerInfo && (
            <div
              className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div className="flex items-center gap-3">
                {offerInfo.image && (
                  <img
                    src={offerInfo.image}
                    alt="Offer"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-yellow-800">
                    Special Offer!
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    {offerInfo.discount_info}
                  </p>
                  <p className="text-yellow-600 text-xs">
                    {offerInfo.products_count} products in this offer
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hover Text */}
          {hoverText && (
            <div
              className={`bg-green-50 border border-green-200 rounded-lg p-3 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <p className="text-green-800 text-sm font-medium">{hoverText}</p>
            </div>
          )}

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
                disabled={isAddingToCart}
                className={`w-full h-9 flex items-center justify-center gap-2 text-sm font-medium ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
                size="sm"
              >
                {isAddingToCart ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isRTL ? (
                  <>
                    <span>{t("addToCart")}</span>
                    <ShoppingCart size={16} />
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>{t("addToCart")}</span>
                  </>
                )}
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
              <span className="text-sm font-medium">{productCode}</span>
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
                {categoryName}
              </span>
            </div>
            {brandName && (
              <div
                className={`flex justify-between items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-sm text-gray-600">Brand:</span>
                <span className="text-sm font-medium">{brandName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
