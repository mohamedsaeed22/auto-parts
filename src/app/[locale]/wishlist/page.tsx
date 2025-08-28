"use client";

import { useTranslation } from "react-i18next";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/services/api";
import { WishlistItem } from "@/services/api/wishlistApi";
import { Bookmark, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function WishlistPage() {
  const { t } = useTranslation("wishlist");
  const { data: wishlistData, isLoading, error } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemoveFromWishlist = async (productId: number) => {
    setRemovingId(productId);
    try {
      await removeFromWishlist({ product_id: productId }).unwrap();
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (product: {
    id: number;
    name: string;
    price: number;
    image: string;
  }) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-gold"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div>
            <Bookmark className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {t("error.title") || "Error loading wishlist"}
            </h2>
            <p className="text-gray-500">
              {t("error.message") || "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const wishlist = (wishlistData?.data || []) as unknown as WishlistItem[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("title") || "My Wishlist"}
        </h1>
        <p className="text-gray-600">
          {t("subtitle") || "Your saved wishlist products"}
        </p>
      </div>

      {/* Wishlist List */}
      {wishlist.length === 0 ? (
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div>
            <Bookmark className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {t("empty.title") || "No wishlist items yet"}
            </h2>
            <p className="text-gray-500 mb-6">
              {t("empty.message") ||
                "Start adding products to your wishlist to see them here."}
            </p>
            <Button
              onClick={() => window.history.back()}
              className="bg-logo-gold hover:bg-logo-gold/90"
            >
              {t("empty.browseButton") || "Browse Products"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((item: WishlistItem) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.product?.image || "/products/product1.jpg"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveFromWishlist(item.product_id)}
                      disabled={removingId === item.product_id}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      {removingId === item.product_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.product?.name || "Product Name"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.product?.description || "Product description"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-logo-gold">
                      ${item.product?.price || 0}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        item.product && handleAddToCart(item.product)
                      }
                      className="bg-logo-gold hover:bg-logo-gold/90"
                      disabled={!item.product}
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      {t("addToCart") || "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
