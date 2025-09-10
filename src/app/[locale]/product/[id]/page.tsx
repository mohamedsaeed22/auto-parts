"use client";

import Image from "next/image";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash,
  ArrowLeft,
  Loader2,
  Heart,
  Bookmark,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { useFavouritesWishlist } from "@/hooks/useFavouritesWishlist";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useTranslation } from "react-i18next";
import { useGetProductQuery } from "@/services/hooks";
import { showSuccess, showError } from "@/lib/toast";

// Loading Component
const LoadingSpinner = ({ t }: { t: (key: string) => string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <p className="text-gray-600">{t("loading")}</p>
    </div>
  </div>
);

// Error Component
const ErrorMessage = ({
  message,
  onRetry,
  t,
}: {
  message: string;
  onRetry?: () => void;
  t: (key: string) => string;
}) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="text-red-500 text-lg font-semibold mb-2">
        {t("error")}
      </div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {t("tryAgain")}
        </Button>
      )}
    </div>
  </div>
);

// Enhanced Features Components
type TranslateFn = (key: string) => string;
type ProductForBadges = {
  offer?: { discount_info?: string } | null;
  discount_info?: string | null;
};
const ProductBadges = ({
  product,
  isRTL,
  t,
}: {
  product: ProductForBadges;
  isRTL: boolean;
  t: TranslateFn;
}) => {
  const badges = [];

  if (product.offer) {
    badges.push({
      type: "offer",
      text: `${product.offer.discount_info} OFF`,
      className: "bg-red-500 text-white",
    });
  }

  if (product.discount_info) {
    badges.push({
      type: "discount",
      text: t("sale"),
      className: "bg-orange-500 text-white",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div
      className={`absolute top-4 ${
        isRTL ? "right-4" : "left-4"
      } flex flex-col gap-2 z-10`}
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`px-2 py-1 rounded-md text-xs font-bold ${badge.className} shadow-lg`}
        >
          {badge.text}
        </div>
      ))}
    </div>
  );
};

type ProductForActions = {
  id: number;
  name?: string;
};

const ProductActions = ({
  isRTL,
  product,
  isInFavourites,
  isInWishlist,
  onToggleFavourite,
  onToggleWishlist,
  onShare,
  isLoading,
}: {
  isRTL: boolean;
  product: ProductForActions;
  isInFavourites: boolean;
  isInWishlist: boolean;
  onToggleFavourite: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
  isLoading: (key: string) => boolean;
}) => (
  <div
    className={`absolute top-4 ${
      isRTL ? "left-4" : "right-4"
    } flex flex-col gap-2 z-10`}
  >
    <Button
      variant="outline"
      size="sm"
      className={`w-10 h-10 rounded-full border-neutral-200 hover:bg-white shadow-lg transition-colors duration-300 ${
        isInFavourites
          ? "bg-red-500 border-red-500 hover:bg-red-600"
          : "bg-white hover:bg-gray-50"
      }`}
      onClick={onToggleFavourite}
      disabled={isLoading(`favourite-${product.id}`)}
    >
      {isLoading(`favourite-${product.id}`) ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-600"></div>
      ) : (
        <Heart
          size={18}
          className={`${
            isInFavourites ? "text-white fill-white" : "text-neutral-700"
          }`}
        />
      )}
    </Button>
    <Button
      variant="outline"
      size="sm"
      className={`w-10 h-10 rounded-full border-neutral-200 hover:bg-white shadow-lg transition-colors duration-300 ${
        isInWishlist
          ? "bg-blue-500 border-blue-500 hover:bg-blue-600"
          : "bg-white hover:bg-gray-50"
      }`}
      onClick={onToggleWishlist}
      disabled={isLoading(`wishlist-${product.id}`)}
    >
      {isLoading(`wishlist-${product.id}`) ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-600"></div>
      ) : (
        <Bookmark
          size={18}
          className={`${
            isInWishlist ? "text-white fill-white" : "text-neutral-700"
          }`}
        />
      )}
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="w-10 h-10 rounded-full border-neutral-200 bg-white hover:bg-gray-50 shadow-lg transition-colors duration-300"
      onClick={onShare}
    >
      <Share2
        size={18}
        className="text-neutral-700 hover:text-neutral-900 transition-colors duration-300"
      />
    </Button>
  </div>
);

const ProductFeatures = ({ isRTL, t }: { isRTL: boolean; t: TranslateFn }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg">
    <div
      className={`flex items-center gap-3 ${isRTL ? "flex-row" : "flex-row"}`}
    >
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Truck size={20} className="text-blue-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">{t("freeShipping")}</p>
        <p className="text-sm text-gray-500">{t("freeShippingDesc")}</p>
      </div>
    </div>
    <div
      className={`flex items-center gap-3 ${isRTL ? "flex-row" : "flex-row"}`}
    >
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <Shield size={20} className="text-green-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">{t("warranty")}</p>
        <p className="text-sm text-gray-500">{t("warrantyDesc")}</p>
      </div>
    </div>
    <div
      className={`flex items-center gap-3 ${isRTL ? "flex-row" : "flex-row"}`}
    >
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
        <RotateCcw size={20} className="text-purple-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">{t("returns")}</p>
        <p className="text-sm text-gray-500">{t("returnsDesc")}</p>
      </div>
    </div>
  </div>
);

type ProductForPrice = {
  discount_type?: string | null;
  offer?: unknown | null;
  price: number | string;
  final_price: number;
  discount_info?: string | null;
};
const PriceSection = ({
  product,
  isRTL,
  t,
}: {
  product: ProductForPrice;
  isRTL: boolean;
  t: TranslateFn;
}) => {
  const hasDiscount = Boolean(product.discount_type || product.offer);
  const originalPrice = product.price;
  const finalPrice = product.final_price;

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-3 ${
          isRTL ? "flex-row justify-end" : "flex-row justify-end"
        }`}
      >
        <span className="text-3xl font-bold text-gray-900">
          {isRTL
            ? `${t("currency")} ${finalPrice}`
            : `${finalPrice} ${t("currency")}`}
        </span>
        {hasDiscount && (
          <span className="text-xl text-gray-500 line-through">
            {isRTL
              ? `${t("currency")} ${Number(originalPrice)}`
              : `${Number(originalPrice)} ${t("currency")}`}
          </span>
        )}
      </div>

      {product.discount_info && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <Info size={14} />
          <span>{product.discount_info}</span>
        </div>
      )}

      {hasDiscount && (
        <p className="text-sm text-green-600 font-medium">
          {t("youSave")}:{" "}
          {isRTL
            ? `${t("currency")} ${(Number(originalPrice) - finalPrice).toFixed(
                2
              )}`
            : `${(Number(originalPrice) - finalPrice).toFixed(2)} ${t(
                "currency"
              )}`}
        </p>
      )}
    </div>
  );
};

const StockIndicator = ({ isRTL, t }: { isRTL: boolean; t: TranslateFn }) => (
  <div className={`flex items-center gap-2 ${isRTL ? "flex-row" : "flex-row"}`}>
    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
    <span className="text-sm font-medium text-green-600">{t("inStock")}</span>
    <span className="text-sm text-gray-500">- {t("readyToShip")}</span>
  </div>
);

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { t, i18n } = useTranslation("productDetails");
  const [selectedImage, setSelectedImage] = useState(0);

  const isRTL = i18n.language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // Scroll to top when component mounts or productId changes
  useScrollToTop([productId]);

  // API Hooks
  const {
    data: productResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductQuery(productId);

  // Remove direct API add; rely on enhanced cart hook to decide (guest vs API)

  // Use Redux hook for local cart state
  const { items, addToCart, removeFromCart, updateQuantity, loading } =
    useEnhancedCart();

  // Use favourites/wishlist hook
  const {
    handleToggleFavourite,
    handleToggleWishlist,
    isLoading: isFavouritesLoading,
  } = useFavouritesWishlist();

  const product = productResponse?.data?.product;
  const cartItem = items.find((item) => item.id === productId);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;

  // Local state for immediate visual feedback
  const [localFavouriteState, setLocalFavouriteState] = useState<
    boolean | null
  >(null);
  const [localWishlistState, setLocalWishlistState] = useState<boolean | null>(
    null
  );

  // Check if product is in favourites or wishlist (use local state if available, otherwise use API data)
  const isInFavourites =
    localFavouriteState !== null
      ? localFavouriteState
      : product?.in_favorites === true;
  const isInWishlist =
    localWishlistState !== null
      ? localWishlistState
      : product?.in_wishlist === true;

  const handleAddToCart = async () => {
    if (!product) return;
    // Delegate logic to enhanced hook (guest => localStorage only; logged-in => API)
    addToCart({
      id: product.id,
      title: product.name || "Product",
      price: Number(product.final_price) || Number(product.price) || 0,
      image: product.primary_image || "",
      category: product.category?.name || "Unknown Category",
      description: product.description || "",
    });
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

  // Enhanced toggle functions with immediate visual feedback
  const handleToggleFavouriteWithFeedback = async () => {
    if (!product) return;

    // Immediately update local state for visual feedback
    const newFavouriteState = !isInFavourites;
    setLocalFavouriteState(newFavouriteState);

    try {
      await handleToggleFavourite(product.id);
    } catch (error) {
      // Revert local state if API call fails
      console.error("Failed to toggle favourite:", error);
      setLocalFavouriteState(!newFavouriteState);
    }
  };

  const handleToggleWishlistWithFeedback = async () => {
    if (!product) return;

    // Immediately update local state for visual feedback
    const newWishlistState = !isInWishlist;
    setLocalWishlistState(newWishlistState);

    try {
      await handleToggleWishlist(product.id);
    } catch (error) {
      // Revert local state if API call fails
      console.error("Failed to toggle wishlist:", error);
      setLocalWishlistState(!newWishlistState);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || "Product",
          url: window.location.href,
        });
        showSuccess(t("shareSuccess"));
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        showSuccess(t("linkCopied"));
      }
    } catch (error) {
      console.error("Failed to share:", error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess(t("linkCopied"));
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError);
        showError(t("shareError"));
      }
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <LoadingSpinner t={t} />
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
        <ErrorMessage message={errorMessage} onRetry={refetch} t={t} />
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
        <ErrorMessage message={t("productNotFound")} t={t} />
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
      {/* Enhanced Breadcrumb */}
      <nav
        className={`flex items-center gap-2 text-sm text-gray-500 mb-8 ${
          isRTL ? "flex-row" : "flex-row"
        }`}
      >
        <button
          onClick={handleGoBack}
          className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${
            isRTL ? "flex-row" : "flex-row"
          }`}
        >
          {isRTL ? (
            <>
              <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
              <span>{t("backButton")}</span>
            </>
          ) : (
            <>
              <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
              <span>{t("backButton")}</span>
            </>
          )}
        </button>

        <span>/</span>
        <span className="text-gray-900 truncate">{productName}</span>
      </nav>

      {/* Main Product Layout */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${
          isRTL ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Enhanced Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <ProductBadges product={product} isRTL={isRTL} t={t} />
            <ProductActions
              isRTL={isRTL}
              product={product}
              isInFavourites={isInFavourites}
              isInWishlist={isInWishlist}
              onToggleFavourite={handleToggleFavouriteWithFeedback}
              onToggleWishlist={handleToggleWishlistWithFeedback}
              onShare={handleShare}
              isLoading={isFavouritesLoading}
            />

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
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Enhanced Thumbnail images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-all duration-200 hover:shadow-md ${
                    index === selectedImage
                      ? "border-gray-900 scale-105"
                      : "border-transparent hover:border-gray-300"
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

        {/* Enhanced Product Info */}
        <div className="space-y-6">
          <div>
            <h1
              className={`text-3xl font-bold text-gray-900 mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {productName}
            </h1>

            {/* Rating */}
            {/* <ProductRating isRTL={isRTL} /> */}

            {/* Stock Status */}
            <div className="mt-3">
              <StockIndicator isRTL={isRTL} t={t} />
            </div>
          </div>

          {/* Enhanced Price Section */}
          <PriceSection product={product} isRTL={isRTL} t={t} />

          {/* Enhanced Description */}
          <div>
            <h3
              className={`text-lg font-semibold mb-3 ${
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

          {/* Enhanced Category and Brand */}
          <div className={isRTL ? "text-right" : "text-left"}>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize font-medium">
                {categoryName}
              </span>
              {parentCategoryName && (
                <span className="inline-block bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {parentCategoryName}
                </span>
              )}
              {brandName && (
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {brandName}
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Offer Information */}
          {offerInfo && (
            <div
              className={`bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row" : "flex-row"
                }`}
              >
                {offerInfo.image && (
                  <Image
                    src={offerInfo.image}
                    alt="Offer"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-orange-800 flex items-center gap-2">
                    <span>🎉</span> {t("specialOffer")}
                  </h4>
                  <p className="text-orange-700 text-sm font-medium">
                    {offerInfo.discount_info} {t("discount")}
                  </p>
                  <p className="text-orange-600 text-xs">
                    {offerInfo.products_count} {t("productsInOffer")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Hover Text */}
          {hoverText && (
            <div
              className={`bg-blue-50 border-l-4 border-blue-400 p-4 ${
                isRTL ? "text-right border-r-4 border-l-0" : "text-left"
              }`}
            >
              <div
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row" : "flex-row"
                }`}
              >
                <Info size={16} className="text-blue-600" />
                <p className="text-blue-800 text-sm font-medium">{hoverText}</p>
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart Section */}
          <div className="space-y-4">
            <label
              className={`block text-sm font-medium text-black ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("quantity")}
            </label>

            <div className="min-h-[44px] flex items-center justify-center">
              {!isInCart ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className={`w-full h-12 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-white ${
                    isRTL ? "flex-row" : "flex-row"
                  }`}
                  size="sm"
                >
                  {loading ? (
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
                <div className="w-full h-12 flex items-center justify-center bg-primary rounded-md">
                  <div
                    className={`flex items-center gap-2 ${
                      isRTL ? "flex-row" : "flex-row"
                    }`}
                  >
                    <button
                      onClick={() => handleQuantityChange(currentQuantity + 1)}
                      className="w-8 h-8 bg-white/20 rounded-md text-white flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(currentQuantity - 1)}
                      className="w-8 h-8 bg-white/20 rounded-md text-white flex items-center justify-center"
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
          </div>

          {/* Product Features */}
          <ProductFeatures isRTL={isRTL} t={t} />

          {/* Enhanced Additional Info */}
          <div className="border-t pt-6 space-y-4">
            <h3
              className={`text-lg font-semibold mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("productDetails")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${
                  isRTL ? "flex-row" : "flex-row"
                }`}
              >
                <span className="text-sm text-gray-600 font-medium">
                  {t("productCode")}:
                </span>
                <span className="text-sm font-semibold">{productCode}</span>
              </div>
              <div
                className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${
                  isRTL ? "flex-row" : "flex-row"
                }`}
              >
                <span className="text-sm text-gray-600 font-medium">
                  {t("availability")}:
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {t("available")}
                </span>
              </div>
              <div
                className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${
                  isRTL ? "flex-row" : "flex-row"
                }`}
              >
                <span className="text-sm text-gray-600 font-medium">
                  {t("category")}:
                </span>
                <span className="text-sm font-semibold capitalize">
                  {categoryName}
                </span>
              </div>
              {brandName && (
                <div
                  className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg ${
                    isRTL ? "flex-row" : ""
                  }`}
                >
                  <span className="text-sm text-gray-600 font-medium">
                    {t("brand")}:
                  </span>
                  <span className="text-sm font-semibold">{brandName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
