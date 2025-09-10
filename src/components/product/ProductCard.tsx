import { useEnhancedCart } from "@/hooks/useEnhancedCart";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "@/services/api/types";
import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "favourites" | "wishlist";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = "default",
}) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const { items, addToCart, updateQuantity, removeFromCart } =
    useEnhancedCart();
  const { handleToggleFavourite, handleToggleWishlist, isLoading } =
    useFavouritesWishlist();
  const cartItem = items.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  // Local state for immediate visual feedback
  const [localFavouriteState, setLocalFavouriteState] = useState<
    boolean | null
  >(null);
  const [localWishlistState, setLocalWishlistState] = useState<boolean | null>(
    null
  );

  // Sync local states with incoming props only when no optimistic override is active
  useEffect(() => {
    if (localFavouriteState === null) {
      setLocalFavouriteState(product.in_favourites === true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.in_favourites]);

  useEffect(() => {
    if (localWishlistState === null) {
      setLocalWishlistState(product.in_wishlist === true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.in_wishlist]);

  // Safe access to product properties
  const productName = product.name || "Product Name Unavailable";
  const productPrice = product.price || "0";
  const productFinalPrice = product.final_price || Number(productPrice);
  const productImage = product.primary_image || "/placeholder-product.jpg";
  const categoryName = product.category?.name || "Unknown Category";
  const hasDiscount = product.discount_type || product.offer;
  const discountInfo = product.discount_info;

  // Check authentication and registration status for visual feedback
  const isAuthenticated = storage.isAuthenticated();
  const isRegistrationComplete = storage.isRegistrationComplete();
  const canShowOptimisticUpdates = isAuthenticated && isRegistrationComplete;

  // Check if product is in favourites or wishlist (use local state only if user is authenticated and registered)
  const isInFavourites = canShowOptimisticUpdates && localFavouriteState !== null
    ? localFavouriteState
    : product.in_favourites === true;
  const isInWishlist = canShowOptimisticUpdates && localWishlistState !== null
    ? localWishlistState
    : product.in_wishlist === true;

  // Enhanced toggle functions with conditional visual feedback
  const handleToggleFavouriteWithFeedback = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show optimistic updates if user is authenticated and registration is complete
    if (canShowOptimisticUpdates) {
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
    } else {
      // Just call the handler without optimistic updates
      // The useFavouritesWishlist hook will handle showing appropriate messages
      await handleToggleFavourite(product.id);
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

      try {
        await handleToggleWishlist(product.id);
      } catch (error) {
        // Revert local state if API call fails
        console.error("Failed to toggle wishlist:", error);
        setLocalWishlistState(!newWishlistState);
      }
    } else {
      // Just call the handler without optimistic updates
      // The useFavouritesWishlist hook will handle showing appropriate messages
      await handleToggleWishlist(product.id);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only show optimistic updates if user is authenticated and registration is complete
    if (canShowOptimisticUpdates) {
      // Optimistic update: set local cart state immediately
      setLocalCartState(true);
      
      try {
        addToCart({
          id: product.id,
          title: productName,
          price: productFinalPrice,
          image: productImage,
          category: categoryName,
          description: product.description || "",
        });
      } catch (error) {
        // Revert local state if add to cart fails
        console.error("Failed to add to cart:", error);
        setLocalCartState(false);
      }
    } else {
      // Just call addToCart without optimistic updates
      // The cart system will handle authentication checks and show appropriate messages
      addToCart({
        id: product.id,
        title: productName,
        price: productFinalPrice,
        image: productImage,
        category: categoryName,
        description: product.description || "",
      });
    }
  };

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    } else if (cartItem && cartItem.quantity === 1) {
      removeFromCart(product.id);
    }
  };

  return (
    <div className="group relative" dir={isRTL ? "rtl" : "ltr"}>
      <Link href={`/product/${product.id}`}>
        <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-border overflow-hidden">
          {/* Image Container with Badges */}
          <div className="relative aspect-square overflow-hidden bg-neutral-100">
            {/* Product Image */}
            <Image
              src={productImage}
              alt={productName}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Action Buttons - Always Visible */}
            <div
              className={`absolute top-2 ${
                isRTL ? "left-2" : "right-2"
              } flex flex-col gap-1`}
            >
              {variant === "default" && (
                <Button
                  size="sm"
                  variant="outline"
                  className={`w-10 h-10 rounded-full border-neutral-200 hover:bg-white shadow-lg transition-colors duration-300 ${
                    isInFavourites
                      ? "bg-red-500 border-red-500 hover:bg-red-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={handleToggleFavouriteWithFeedback}
                  disabled={isLoading(`favourite-${product.id}`)}
                >
                  {isLoading(`favourite-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-600"></div>
                  ) : (
                    <Heart
                      size={22}
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
                  size="sm"
                  variant="destructive"
                  className="w-10 h-10 rounded-full shadow-lg transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove from favourites by toggling
                    handleToggleFavouriteWithFeedback(e);
                  }}
                  disabled={isLoading(`favourite-${product.id}`)}
                >
                  {isLoading(`favourite-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Trash size={18} />
                  )}
                </Button>
              ) : variant === "wishlist" ? (
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-10 h-10 rounded-full shadow-lg transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove from wishlist by toggling
                    handleToggleWishlistWithFeedback(e);
                  }}
                  disabled={isLoading(`wishlist-${product.id}`)}
                >
                  {isLoading(`wishlist-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Trash size={18} />
                  )}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className={`w-10 h-10 rounded-full border-neutral-200 hover:bg-white shadow-lg transition-colors duration-300 ${
                    isInWishlist
                      ? "bg-blue-500 border-blue-500 hover:bg-blue-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={handleToggleWishlistWithFeedback}
                  disabled={isLoading(`wishlist-${product.id}`)}
                >
                  {isLoading(`wishlist-${product.id}`) ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-600"></div>
                  ) : (
                    <Bookmark
                      size={22}
                      className={`${
                        isInWishlist
                          ? "text-white fill-white"
                          : "text-neutral-700"
                      }`}
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
            <h3 className="text-md font-medium text-neutral-900 mb-3 group-hover:text-primary transition-colors overflow-hidden">
              <span className="block truncate" title={productName}>
                {productName}
              </span>
            </h3>

            {/* Price and Add to Cart Section */}
            <div className="mt-auto">
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row" : ""
                }`}
              >
                {/* Price Section */}
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row" : ""
                  }`}
                >
                  <span className="text-base font-bold text-neutral-900">
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
                    className="bg-primary hover:bg-primary/90 text-white rounded px-2 py-1 flex items-center gap-1 transition-colors duration-200 text-xs"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={12} />
                    <span>{t("addToCart")}</span>
                  </Button>
                ) : (
                  <div className="flex items-center bg-white border border-primary/20 rounded overflow-hidden shadow-sm">
                    <Button
                      onClick={handleDecreaseQuantity}
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-none border-r border-primary/10 transition-colors duration-200"
                    >
                      {cartItem?.quantity === 1 ? (
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
                      className="h-7 w-7 p-0 hover:bg-green-50 text-green-600 hover:text-green-700 rounded-none border-l border-primary/10 transition-colors duration-200"
                    >
                      <Plus size={12} />
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
