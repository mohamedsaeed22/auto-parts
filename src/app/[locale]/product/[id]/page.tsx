"use client";

import Image from "next/image";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash,
  Heart,
  Bookmark,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Info,
  Home,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, ErrorMessage } from "@/components/ui";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStockAwareCart } from "@/hooks/useStockAwareCart";
import { useFavouritesWishlist } from "@/hooks/useFavouritesWishlist";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useTranslation } from "react-i18next";
import { useGetProductQuery } from "@/services/hooks";
import { showSuccess, showError } from "@/lib/toast";
import { storage } from "@/lib/storage";
import { Product } from "@/services/api/types";

// Loading Component

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
  canShowOptimisticUpdates,
}: {
  isRTL: boolean;
  product: ProductForActions;
  isInFavourites: boolean;
  isInWishlist: boolean;
  onToggleFavourite: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
  isLoading: (key: string) => boolean;
  canShowOptimisticUpdates: boolean;
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
        canShowOptimisticUpdates && isInFavourites
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
            canShowOptimisticUpdates && isInFavourites
              ? "text-white fill-white"
              : "text-neutral-700"
          }`}
        />
      )}
    </Button>
    <Button
      variant="outline"
      size="sm"
      className={`w-10 h-10 rounded-full border-neutral-200 hover:bg-white shadow-lg transition-colors duration-300 ${
        canShowOptimisticUpdates && isInWishlist
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
            canShowOptimisticUpdates && isInWishlist
              ? "text-white fill-white"
              : "text-neutral-700"
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
  <div className="flex flex-wrap p-6 bg-gray-50 rounded-lg">
    {/* <div
      className={`w-1/2 flex items-center gap-3 ${
        isRTL ? "flex-row" : "flex-row"
      }`}
    >
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Truck size={20} className="text-blue-600" />
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="font-medium text-gray-900">{t("freeShipping")}</p>
        <p className="text-sm text-gray-500">{t("freeShippingDesc")}</p>
      </div>
    </div> */}

    <div
      className={`w-1/2 flex items-center gap-3 ${
        isRTL ? "flex-row" : "flex-row"
      }`}
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
      <div className={`flex items-center gap-3 flex-row justify-start`}>
        {hasDiscount && (
          <span className="text-xl text-gray-500 line-through">
            {isRTL
              ? `${t("currency")} ${Number(originalPrice)}`
              : `${Number(originalPrice)} ${t("currency")}`}
          </span>
        )}
        <span className="text-3xl font-bold text-gray-900">
          {isRTL
            ? `${t("currency")} ${finalPrice}`
            : `${finalPrice} ${t("currency")}`}
        </span>
      </div>

      {/* Price includes VAT text */}
      <div
        className={`flex items-center gap-2 ${isRTL ? "flex-row" : "flex-row"}`}
      >
        <span className="text-sm text-gray-600 font-medium">
          {t("priceIncludesVat")}
        </span>
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

const StockIndicator = ({
  product,
  isRTL,
  t,
  getProductStockStatus,
}: {
  product: Product | undefined;
  isRTL: boolean;
  t: TranslateFn;
  getProductStockStatus: (product: Product) => {
    message: string;
    type: "success" | "warning" | "error";
  };
}) => {
  if (!product) {
    return (
      <div
        className={`flex items-center gap-2 ${isRTL ? "flex-row" : "flex-row"}`}
      >
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        <span className="text-sm font-medium text-gray-500">Loading...</span>
      </div>
    );
  }

  const stockStatus = getProductStockStatus(product);
  const colorClass =
    stockStatus.type === "error"
      ? "text-red-600"
      : stockStatus.type === "warning"
      ? "text-orange-600"
      : "text-green-600";

  const dotClass =
    stockStatus.type === "error"
      ? "bg-red-500"
      : stockStatus.type === "warning"
      ? "bg-orange-500"
      : "bg-green-500";

  return (
    <div
      className={`flex items-center gap-2 ${isRTL ? "flex-row" : "flex-row"}`}
    >
      <div
        className={`w-3 h-3 ${dotClass} rounded-full ${
          stockStatus.type === "success" ? "animate-pulse" : ""
        }`}
      ></div>
      <span className={`text-sm font-medium ${colorClass}`}>
        {stockStatus.message}
      </span>
      {stockStatus.type === "success" && (
        <span className="text-sm text-gray-500">- {t("readyToShip")}</span>
      )}
    </div>
  );
};

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();

  // Safely parse product ID with error handling
  const productId = (() => {
    try {
      const id = params.id as string;
      if (!id || id === "undefined" || id === "null") {
        throw new Error("Invalid product ID");
      }
      const parsed = parseInt(id, 10);
      if (isNaN(parsed) || parsed <= 0) {
        throw new Error("Invalid product ID format");
      }
      return parsed;
    } catch (error) {
      return null;
    }
  })();

  const { t, i18n } = useTranslation("productDetails");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAutoSwipeActive, setIsAutoSwipeActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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
  } = useGetProductQuery(productId as number, { skip: !productId });

  // Remove direct API add; rely on enhanced cart hook to decide (guest vs API)

  // Use Redux hook for local cart state with stock validation
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    loading,
    canAddToCart,
    canIncreaseQuantity,
    isProductOutOfStock,
    getProductStockStatus,
  } = useStockAwareCart();

  // Use favourites/wishlist hook
  const {
    handleToggleFavourite,
    handleToggleWishlist,
    isLoading: isFavouritesLoading,
  } = useFavouritesWishlist();

  // Check authentication and registration status for visual feedback
  const isAuthenticated = storage.isAuthenticated();
  const canShowOptimisticUpdates = isAuthenticated;

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

  // Listen for global product state updates (fav/wishlist)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        productId?: number;
        in_favorites?: boolean;
        in_wishlist?: boolean;
      };
      if (!detail || detail.productId !== productId) return;
      if (typeof detail.in_favorites === "boolean") {
        setLocalFavouriteState(detail.in_favorites);
      }
      if (typeof detail.in_wishlist === "boolean") {
        setLocalWishlistState(detail.in_wishlist);
      }
    };
    window.addEventListener("productStateUpdated", handler as EventListener);
    return () => {
      window.removeEventListener(
        "productStateUpdated",
        handler as EventListener
      );
    };
  }, [productId]);

  // Check if product is in favourites or wishlist (use local state if available, otherwise use API data)
  const isInFavourites =
    localFavouriteState !== null
      ? localFavouriteState
      : product?.in_favorites === true;
  const isInWishlist =
    localWishlistState !== null
      ? localWishlistState
      : product?.in_wishlist === true;

  // Image navigation functions
  const nextImage = () => {
    if (productImages && productImages.length > 1) {
      setSelectedImage((prev) => (prev + 1) % productImages.length);
    }
  };

  const prevImage = () => {
    if (productImages && productImages.length > 1) {
      setSelectedImage(
        (prev) => (prev - 1 + productImages.length) % productImages.length
      );
    }
  };

  const toggleAutoSwipe = () => {
    setIsAutoSwipeActive(!isAutoSwipeActive);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Auto-swipe effect for product images - moved here to avoid conditional hook calls
  useEffect(() => {
    if (!product) return;

    // Create images array including primary_image
    const images: string[] = [];

    // Add primary image if it exists and is not empty
    if (product.primary_image && product.primary_image.trim() !== "") {
      images.push(product.primary_image);
    }

    // Add other images from the images array
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: string) => {
        if (img && img.trim() !== "" && !images.includes(img)) {
          images.push(img);
        }
      });
    }

    if (images.length <= 1 || !isAutoSwipeActive || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [product, isAutoSwipeActive, isHovered]);

  const handleAddToCart = async () => {
    if (!product) return;
    // Use stock-aware cart which handles validation automatically
    await addToCart(product);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!product) return;

    if (newQuantity <= 0) {
      await removeFromCart(product.id);
    } else {
      await updateQuantity(product.id, newQuantity, product);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  // Enhanced toggle functions with conditional visual feedback
  const handleToggleFavouriteWithFeedback = async () => {
    if (!product) return;

    // Only show optimistic updates if user is authenticated and registration is complete
    if (canShowOptimisticUpdates) {
      // Immediately update local state for visual feedback
      const newFavouriteState = !isInFavourites;
      setLocalFavouriteState(newFavouriteState);

      try {
        const next = await handleToggleFavourite(product.id);
        if (typeof next === "boolean") {
          setLocalFavouriteState(next);
        }
      } catch (error) {
        // Revert local state if API call fails
        setLocalFavouriteState(!newFavouriteState);
      }
    } else {
      // Just call the handler without optimistic updates
      // The useFavouritesWishlist hook will handle showing appropriate messages
      const next = await handleToggleFavourite(product.id);
      if (typeof next === "boolean") {
        setLocalFavouriteState(next);
      }
    }
  };

  const handleToggleWishlistWithFeedback = async () => {
    if (!product) return;

    // Only show optimistic updates if user is authenticated and registration is complete
    if (canShowOptimisticUpdates) {
      // Immediately update local state for visual feedback
      const newWishlistState = !isInWishlist;
      setLocalWishlistState(newWishlistState);

      try {
        const next = await handleToggleWishlist(product.id);
        if (typeof next === "boolean") {
          setLocalWishlistState(next);
        }
      } catch (error) {
        // Revert local state if API call fails
        setLocalWishlistState(!newWishlistState);
      }
    } else {
      // Just call the handler without optimistic updates
      // The useFavouritesWishlist hook will handle showing appropriate messages
      const next = await handleToggleWishlist(product.id);
      if (typeof next === "boolean") {
        setLocalWishlistState(next);
      }
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
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess(t("linkCopied"));
      } catch (clipboardError) {
        showError(t("shareError"));
      }
    }
  };

  // Early return if product ID is invalid (hooks called unconditionally above)
  if (!productId) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <ErrorMessage
          message={t("invalidProductId") || "Invalid product ID"}
          onRetry={() => router.back()}
        />
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <LoadingSpinner
          message={t("loadingProductDetails") || "Loading product details..."}
        />
      </div>
    );
  }

  // Handle error state
  if (error) {
    let errorMessage =
      t("failedToLoadProductDetails") || "Failed to load product details";
    if ("status" in error) {
      errorMessage = `${t("error") || "Error"} ${error.status}: ${
        t("failedToLoadProductDetails") || "Failed to load product details"
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

  // Handle case where product is not found
  if (!product) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        dir={direction}
      >
        <ErrorMessage message={t("productNotFound") || "Product not found"} />
      </div>
    );
  }

  // Prepare images array with safety checks - include primary_image as first image
  const productImages = (() => {
    const images: string[] = [];

    // Add primary image if it exists and is not empty
    if (product.primary_image && product.primary_image.trim() !== "") {
      images.push(product.primary_image);
    }

    // Add other images from the images array
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: string) => {
        if (img && img.trim() !== "" && !images.includes(img)) {
          images.push(img);
        }
      });
    }

    // If no images found, return empty array
    return images;
  })();

  // Non-typed fields or optional fields from backend response
  type ProductOptionalFields = { weight?: number | string };
  const productWeight = (product as ProductOptionalFields).weight;

  // Safe access to product properties
  const productName = product.name || "Product Name Unavailable";
  const productDescription = product.description || "No description available";
  const productCode = product.product_identifier || "N/A";
  const categoryName = product.category?.name || "Unknown Category";
  const brandName = product.brand?.name;
  const offerInfo = product.offer;
  const hoverText = product.hover_text;

  // Localized fallbacks for labels if i18n keys are missing
  const weightLabel = t("weight", { defaultValue: isRTL ? "الوزن" : "Weight" });
  const gramsLabel = t("grams", { defaultValue: isRTL ? "جم" : "g" });

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      dir={direction}
    >
      {/* Enhanced Breadcrumb */}
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
        <span className="text-gray-900">{productName}</span>
      </nav>

      {/* Main Product Layout */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${
          isRTL ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Enhanced Product Images */}
        <div className="space-y-4">
          <div
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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
              canShowOptimisticUpdates={canShowOptimisticUpdates}
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

            {/* Image Navigation Controls - Only show if multiple images */}
            {productImages.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/95 hover:bg-white border-gray-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-gray-900"
                  onClick={prevImage}
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-white/95 hover:bg-white border-gray-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-gray-900"
                  onClick={nextImage}
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </Button>

                {/* Auto-swipe Toggle Button */}
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute top-4 left-4 w-10 h-10 p-0 bg-white/95 hover:bg-white border-gray-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-gray-900"
                  onClick={toggleAutoSwipe}
                >
                  {isAutoSwipeActive ? (
                    <Pause size={20} className="text-gray-700" />
                  ) : (
                    <Play size={20} className="text-gray-700" />
                  )}
                </Button>

                {/* Image Thumbnails Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === selectedImage
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              </>
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

            {/* Stock Status */}
            <div className="mt-3">
              <StockIndicator
                product={product}
                isRTL={isRTL}
                t={t}
                getProductStockStatus={getProductStockStatus}
              />
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

          {/* Category and Brand chips removed to avoid duplicating details */}

          {/* Enhanced Offer Information */}
          {offerInfo && (
            <div
              className={`bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div className={`flex items-center gap-3 flex-row`}>
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
              <div className={`flex items-center gap-2 flex-row`}>
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
                  disabled={
                    loading ||
                    isProductOutOfStock(product) ||
                    !canAddToCart(product)
                  }
                  className={`w-full h-12 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-white disabled:bg-gray-400 disabled:cursor-not-allowed ${
                    isRTL ? "flex-row" : "flex-row"
                  }`}
                  size="sm"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isRTL ? (
                    <>
                      <ShoppingCart size={16} />
                      <span>
                        {isProductOutOfStock(product)
                          ? t("outOfStock")
                          : t("addToCart")}
                      </span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>
                        {isProductOutOfStock(product)
                          ? t("outOfStock")
                          : t("addToCart")}
                      </span>
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
                    {" "}
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
                    <span className="text-lg font-semibold w-8 text-center text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(currentQuantity + 1)}
                      disabled={!canIncreaseQuantity(product)}
                      className="w-8 h-8 bg-white/20 rounded-md text-white flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <Plus size={14} />
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
                className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg flex-row`}
              >
                <span className="text-sm text-gray-600 font-medium">
                  {t("productCode")}:
                </span>
                <span className="text-sm font-semibold">{productCode}</span>
              </div>
              {/* <div
                className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg flex-row`}
              >
                <span className="text-sm text-gray-600 font-medium">
                  {t("availability")}:
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {t("available")}
                </span>
              </div> */}
              <div
                className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg flex-row`}
              >
                <span className="text-sm text-gray-600 font-medium">
                  {t("category")}:
                </span>
                <span className="text-sm font-semibold capitalize">
                  {categoryName}
                </span>
              </div>
              {productWeight && (
                <div
                  className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg flex-row`}
                >
                  <span className="text-sm text-gray-600 font-medium">
                    {weightLabel}:
                  </span>
                  <span className="text-sm font-semibold">
                    {productWeight} {gramsLabel}
                  </span>
                </div>
              )}
              {brandName && (
                <div
                  className={`flex justify-between items-center p-3 bg-gray-50 rounded-lg flex-row`}
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
