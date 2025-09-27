import { useStockAwareCart } from "@/hooks/useStockAwareCart";
import { useFavouritesWishlist } from "@/hooks/useFavouritesWishlist";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash,
  Minus,
  Plus,
  Heart,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "@/services/api/types";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "favourites" | "wishlist" | "list";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = "default",
}) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    isItemLoading,
    canAddToCart,
    canIncreaseQuantity,
    isProductOutOfStock,
    getProductStockStatus,
  } = useStockAwareCart();
  const { handleToggleFavourite, handleToggleWishlist, isLoading } =
    useFavouritesWishlist();
  const cartItem = items.find((item) => item.id === product.id);
  const isInCart = !!cartItem;
  // Listen for global product state updates (fav/wishlist) to sync across views
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        productId?: number;
        in_favorites?: boolean;
        in_wishlist?: boolean;
      };
      if (!detail || detail.productId !== product.id) return;
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
  }, [product.id]);

  // Local state for immediate visual feedback - Initialize with server values
  const [localFavouriteState, setLocalFavouriteState] = useState<boolean>(
    product.in_favorites === true
  );
  const [localWishlistState, setLocalWishlistState] = useState<boolean>(
    product.in_wishlist === true
  );

  // Track if we've made optimistic updates that haven't been confirmed by server
  const [hasOptimisticFavUpdate, setHasOptimisticFavUpdate] = useState(false);
  const [hasOptimisticWishUpdate, setHasOptimisticWishUpdate] = useState(false);

  // Sync with server response when product data changes
  useEffect(() => {
    // Only update local state if we don't have pending optimistic updates
    if (!hasOptimisticFavUpdate) {
      const serverFavState = product.in_favorites === true;
      setLocalFavouriteState(serverFavState);
    }
  }, [product.in_favorites, hasOptimisticFavUpdate, product.id]);

  useEffect(() => {
    // Only update local state if we don't have pending optimistic updates
    if (!hasOptimisticWishUpdate) {
      const serverWishState = product.in_wishlist === true;
      setLocalWishlistState(serverWishState);
    }
  }, [product.in_wishlist, hasOptimisticWishUpdate, product.id]);

  // Reset optimistic flags when server state matches local state
  useEffect(() => {
    if (
      hasOptimisticFavUpdate &&
      product.in_favorites === localFavouriteState
    ) {
      setHasOptimisticFavUpdate(false);
    }
  }, [product.in_favorites, localFavouriteState, hasOptimisticFavUpdate]);

  useEffect(() => {
    if (hasOptimisticWishUpdate && product.in_wishlist === localWishlistState) {
      setHasOptimisticWishUpdate(false);
    }
  }, [product.in_wishlist, localWishlistState, hasOptimisticWishUpdate]);

  // Safe access to product properties
  const productName = product.name || "Product Name Unavailable";
  const productPrice = product.price || "0";
  const productFinalPrice = product.final_price || Number(productPrice);
  const categoryName = product.category?.name || "Unknown Category";
  const hasDiscount = product.discount_type || product.offer;
  const discountInfo = product.discount_info;

  // Image handling logic
  const getAvailableImages = (): string[] => {
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

    // If no images found, use placeholder
    if (images.length === 0) {
      images.push("/placeholder-product.jpg");
    }

    return images;
  };

  const availableImages = getAvailableImages();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoSwipeActive, setIsAutoSwipeActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const currentImage =
    availableImages[currentImageIndex] || "/placeholder-product.jpg";

  // Auto-swipe effect
  useEffect(() => {
    if (availableImages.length <= 1 || !isAutoSwipeActive || isHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [availableImages.length, isAutoSwipeActive, isHovered]);

  // Image navigation functions
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + availableImages.length) % availableImages.length
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const toggleAutoSwipe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAutoSwipeActive(!isAutoSwipeActive);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Check authentication and registration status for visual feedback
  const isAuthenticated = storage.isAuthenticated();
  const isRegistrationComplete = storage.isRegistrationComplete();
  const canShowOptimisticUpdates = isAuthenticated && isRegistrationComplete;

  // Use local state for UI display
  const isInFavourites = localFavouriteState;
  const isInWishlist = localWishlistState;

  // Enhanced toggle functions with conditional visual feedback
  const handleToggleFavouriteWithFeedback = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show optimistic updates if user is authenticated and registration is complete
    if (canShowOptimisticUpdates) {
      // Immediately update local state for visual feedback
      const newFavouriteState = !isInFavourites;
      setLocalFavouriteState(newFavouriteState);
      setHasOptimisticFavUpdate(true);

      // Set a timeout to reset optimistic flag if server doesn't respond
      const timeoutId = setTimeout(() => {
        setHasOptimisticFavUpdate(false);
      }, 5000); // 5 second timeout

      try {
        const next = await handleToggleFavourite(product.id);
        if (typeof next === "boolean") {
          setLocalFavouriteState(next);
        }
        clearTimeout(timeoutId);
        // The useEffect will handle resetting the optimistic flag when server confirms
      } catch (error) {
        clearTimeout(timeoutId);
        // Revert local state if API call fails
        setLocalFavouriteState(!newFavouriteState);
        setHasOptimisticFavUpdate(false);
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

  const handleToggleWishlistWithFeedback = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show optimistic updates if user is authenticated and registration is complete
    if (canShowOptimisticUpdates) {
      // Immediately update local state for visual feedback
      const newWishlistState = !isInWishlist;
      setLocalWishlistState(newWishlistState);
      setHasOptimisticWishUpdate(true);

      try {
        const next = await handleToggleWishlist(product.id);
        if (typeof next === "boolean") {
          setLocalWishlistState(next);
        }
        // The useEffect will handle resetting the optimistic flag when server confirms
      } catch (error) {
        // Revert local state if API call fails
        setLocalWishlistState(!newWishlistState);
        setHasOptimisticWishUpdate(false);
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    await addToCart(product);
  };

  const handleIncreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      await updateQuantity(product.id, cartItem.quantity + 1, product);
    }
  };

  const handleDecreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity > 1) {
      await updateQuantity(product.id, cartItem.quantity - 1, product);
    } else if (cartItem && cartItem.quantity === 1) {
      await removeFromCart(product.id);
    }
  };

  // List view layout
  if (variant === "list") {
    return (
      <div className="group relative" dir={isRTL ? "rtl" : "ltr"}>
        <Link href={`/product/${product.id}`}>
          <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-border overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Image Container */}
              <div
                className="relative w-full sm:w-48 h-48 sm:h-40 overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={currentImage}
                  alt={productName}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Image Navigation - Only show if multiple images */}
                {availableImages.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 bg-white/90 hover:bg-white border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-gray-900"
                      onClick={prevImage}
                    >
                      <ChevronLeft size={12} className="text-gray-700" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 bg-white/90 hover:bg-white border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-gray-900"
                      onClick={nextImage}
                    >
                      <ChevronRight size={12} className="text-gray-700" />
                    </Button>
                  </>
                )}

                {/* Image Thumbnails - Only show if multiple images */}
                {availableImages.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {availableImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectImage(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Auto-swipe Toggle Button - Only show if multiple images */}
                {availableImages.length > 1 && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute top-2 left-2 w-6 h-6 p-0 bg-white/80 hover:bg-white border-gray-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={toggleAutoSwipe}
                  >
                    {isAutoSwipeActive ? (
                      <Pause size={12} />
                    ) : (
                      <Play size={12} />
                    )}
                  </Button>
                )}

                {/* Action Buttons */}
                <div
                  className={`absolute top-2 ${
                    isRTL ? "left-2" : "right-2"
                  } flex flex-col gap-1`}
                >
                  <Button
                    size="icon"
                    variant={isInFavourites ? "default" : "outline"}
                    className={`!w-7 !h-7 p-0 rounded-full shadow-lg transition-colors duration-300 ${
                      isInFavourites
                        ? "bg-red-500 border-red-500 hover:bg-red-600 text-white"
                        : "bg-white border-neutral-200 hover:bg-gray-50"
                    }`}
                    onClick={(e) => {
                      handleToggleFavouriteWithFeedback(e);
                    }}
                    disabled={isLoading(`favourite-${product.id}`)}
                  >
                    {isLoading(`favourite-${product.id}`) ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>
                    ) : (
                      <Heart
                        size={14}
                        className={`${
                          isInFavourites
                            ? "text-white fill-white"
                            : "text-neutral-700"
                        }`}
                      />
                    )}
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    className={`!w-7 !h-7 p-0 rounded-full shadow-lg transition-colors duration-300 !border-2 ${
                      isInWishlist
                        ? "!bg-blue-500 !border-blue-500 hover:!bg-blue-600 !text-white"
                        : "!bg-white !border-neutral-200 hover:!bg-gray-50 !text-neutral-700"
                    }`}
                    onClick={handleToggleWishlistWithFeedback}
                    disabled={isLoading(`wishlist-${product.id}`)}
                  >
                    {isLoading(`wishlist-${product.id}`) ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>
                    ) : (
                      <Bookmark
                        size={8}
                        className={isInWishlist ? "fill-current" : ""}
                      />
                    )}
                  </Button>
                </div>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div
                    className={`absolute top-2 ${isRTL ? "right-2" : "left-2"}`}
                  >
                    <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                      {discountInfo || "SALE"}
                    </div>
                  </div>
                )}

                {/* Offer Badge */}
                {product.offer && (
                  <div
                    className={`absolute bottom-2 ${
                      isRTL ? "right-2" : "left-2"
                    }`}
                  >
                    <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                      OFFER
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 p-4 flex flex-col justify-center">
                <div>
                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                    {productName}
                  </h3>

                  {/* Product Description */}
                  {product.description && (
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Category and Brand */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categoryName && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {categoryName}
                      </span>
                    )}
                    {product.brand?.name && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.brand.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price and Add to Cart Section */}
                <div className="flex items-center justify-between">
                  {/* Price Section */}
                  <div className={`flex items-center gap-2 flex-row`}>
                    <span className="text-xl font-bold text-neutral-900">
                      {isRTL
                        ? `${t("currency")} ${productFinalPrice}`
                        : `${productFinalPrice} ${t("currency")}`}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-neutral-500 line-through">
                        {isRTL
                          ? `${t("currency")} ${productPrice}`
                          : `${productPrice} ${t("currency")}`}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Section */}
                  {!isInCart ? (
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white rounded px-4 py-2 flex items-center gap-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={handleAddToCart}
                      disabled={
                        isItemLoading(product.id) ||
                        isProductOutOfStock(product) ||
                        !canAddToCart(product)
                      }
                    >
                      {isItemLoading(product.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <ShoppingCart size={16} />
                      )}
                      <span>
                        {isProductOutOfStock(product)
                          ? t("outOfStock")
                          : t("addToCart")}
                      </span>
                    </Button>
                  ) : (
                    <div className="flex items-center bg-white border border-primary/20 rounded overflow-hidden shadow-sm">
                      <Button
                        onClick={handleDecreaseQuantity}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-none border-r border-primary/10 transition-colors duration-200"
                        disabled={isItemLoading(product.id)}
                      >
                        {isItemLoading(product.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : cartItem?.quantity === 1 ? (
                          <Trash size={14} />
                        ) : (
                          <Minus size={14} />
                        )}
                      </Button>

                      <div className="h-8 px-3 flex items-center justify-center bg-primary/5 min-w-[32px]">
                        <span className="text-sm font-semibold text-primary">
                          {cartItem?.quantity}
                        </span>
                      </div>

                      <Button
                        onClick={handleIncreaseQuantity}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-green-50 text-green-600 hover:text-green-700 rounded-none border-l border-primary/10 transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        disabled={
                          isItemLoading(product.id) ||
                          !canIncreaseQuantity(product)
                        }
                      >
                        {isItemLoading(product.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <Plus size={14} />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default grid view layout
  return (
    <div className="group relative" dir={isRTL ? "rtl" : "ltr"}>
      <Link href={`/product/${product.id}`}>
        <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-border overflow-hidden">
          {/* Image Container with Badges */}
          <div
            className="relative aspect-square overflow-hidden bg-neutral-100"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Product Image */}
            <Image
              src={currentImage}
              alt={productName}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Image Navigation - Only show if multiple images */}
            {availableImages.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 bg-white/90 hover:bg-white border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-gray-900"
                  onClick={prevImage}
                >
                  <ChevronLeft size={12} className="text-gray-700" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 bg-white/90 hover:bg-white border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-gray-900"
                  onClick={nextImage}
                >
                  <ChevronRight size={12} className="text-gray-700" />
                </Button>
              </>
            )}

            {/* Image Thumbnails - Only show if multiple images */}
            {availableImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {availableImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      selectImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons - Always Visible */}
            <div
              className={`absolute top-2 ${
                isRTL ? "left-2" : "right-2"
              } flex flex-col gap-1`}
            >
              {variant === "default" && (
                <Button
                  size="icon"
                  variant={isInFavourites ? "default" : "outline"}
                  className={`!w-7 !h-7 p-0 rounded-full shadow-lg transition-colors duration-300 ${
                    isInFavourites
                      ? "bg-red-500 border-red-500 hover:bg-red-600 text-white"
                      : "bg-white border-neutral-200 hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    handleToggleFavouriteWithFeedback(e);
                  }}
                  disabled={isLoading(`favourite-${product.id}`)}
                >
                  {isLoading(`favourite-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>
                  ) : (
                    <Heart
                      size={14}
                      className={`${
                        isInFavourites
                          ? "text-white fill-white"
                          : "text-neutral-700"
                      }`}
                    />
                  )}
                </Button>
              )}

              {variant === "favourites" ? (
                <Button
                  size="icon"
                  variant="destructive"
                  className="!w-7 !h-7 p-0 rounded-full shadow-lg transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove from favourites by toggling
                    handleToggleFavouriteWithFeedback(e);
                  }}
                  disabled={isLoading(`favourite-${product.id}`)}
                >
                  {isLoading(`favourite-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Trash size={12} className="text-white" />
                  )}
                </Button>
              ) : variant === "wishlist" ? (
                <Button
                  size="icon"
                  variant="destructive"
                  className="!w-7 !h-7 p-0 rounded-full shadow-lg transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove from wishlist by toggling
                    handleToggleWishlistWithFeedback(e);
                  }}
                  disabled={isLoading(`wishlist-${product.id}`)}
                >
                  {isLoading(`wishlist-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Trash size={12} className="text-white" />
                  )}
                </Button>
              ) : (
                <Button
                  size="icon"
                  variant="outline"
                  className={`!w-7 !h-7 p-0 rounded-full shadow-lg transition-colors duration-300 !border-2 ${
                    isInWishlist
                      ? "!bg-blue-500 !border-blue-500 hover:!bg-blue-600 !text-white"
                      : "!bg-white !border-neutral-200 hover:!bg-gray-50 !text-neutral-700"
                  }`}
                  style={{
                    backgroundColor: isInWishlist ? "#3b82f6" : "#ffffff",
                    borderColor: isInWishlist ? "#3b82f6" : "#e5e5e5",
                    color: isInWishlist ? "#ffffff" : "#374151",
                  }}
                  onClick={handleToggleWishlistWithFeedback}
                  disabled={isLoading(`wishlist-${product.id}`)}
                >
                  {isLoading(`wishlist-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-neutral-600"></div>
                  ) : (
                    <Bookmark
                      size={14}
                      className={isInWishlist ? "fill-current" : ""}
                      style={{
                        color: isInWishlist ? "#ffffff" : "#374151",
                        fill: isInWishlist ? "#ffffff" : "none",
                      }}
                    />
                  )}
                </Button>
              )}
            </div>

            {/* Discount Badge */}
            {hasDiscount && (
              <div className={`absolute top-2 ${isRTL ? "right-2" : "left-2"}`}>
                <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  {discountInfo || "SALE"}
                </div>
              </div>
            )}

            {/* Offer Badge */}
            {product.offer && (
              <div
                className={`absolute bottom-2 ${isRTL ? "right-2" : "left-2"}`}
              >
                <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  OFFER
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 flex flex-col flex-1">
            {/* Product Name */}
            <h3 className="text-md font-medium text-neutral-900 mb-2 group-hover:text-primary transition-colors overflow-hidden">
              <span className="block truncate" title={productName}>
                {productName}
              </span>
            </h3>

            {/* Price and Add to Cart Section */}
            <div className="mt-auto">
              <div className={`flex items-center justify-between flex-row`}>
                {/* Price Section */}
                <div className={`flex flex-col gap-1`}>
                  <span className="text-sm font-bold text-neutral-900">
                    {isRTL
                      ? `${productFinalPrice} ${t("currency")} `
                      : `${productFinalPrice} ${t("currency")}`}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-neutral-500 line-through">
                      {isRTL
                        ? `${productPrice} ${t("currency")} `
                        : `${productPrice} ${t("currency")}`}
                    </span>
                  )}
                </div>

                {!isInCart ? (
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white rounded px-2 py-1 flex items-center gap-1 transition-colors duration-200 text-xs relative z-10 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      handleAddToCart(e);
                    }}
                    disabled={
                      isItemLoading(product.id) ||
                      isProductOutOfStock(product) ||
                      !canAddToCart(product)
                    }
                    style={{
                      pointerEvents: "auto",
                      cursor:
                        isProductOutOfStock(product) || !canAddToCart(product)
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {isItemLoading(product.id) ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <ShoppingCart size={12} />
                    )}
                    <span>
                      {isProductOutOfStock(product)
                        ? t("outOfStock")
                        : t("addToCart")}
                    </span>
                  </Button>
                ) : (
                  <div className="flex items-center bg-white border border-primary/20 rounded overflow-hidden shadow-sm">
                    <Button
                      onClick={handleDecreaseQuantity}
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-none border-r border-primary/10 transition-colors duration-200"
                      disabled={isItemLoading(product.id)}
                    >
                      {isItemLoading(product.id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                      ) : cartItem?.quantity === 1 ? (
                        <Trash size={12} />
                      ) : (
                        <Minus size={12} />
                      )}
                    </Button>

                    <div className="h-7 px-2 flex items-center justify-center bg-primary/5 min-w-[28px]">
                      <span className="text-sm font-semibold text-primary">
                        {cartItem?.quantity}
                      </span>
                    </div>

                    <Button
                      onClick={handleIncreaseQuantity}
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-green-50 text-green-600 hover:text-green-700 rounded-none border-l border-primary/10 transition-colors duration-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      disabled={
                        isItemLoading(product.id) ||
                        !canIncreaseQuantity(product)
                      }
                    >
                      {isItemLoading(product.id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                      ) : (
                        <Plus size={12} />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
