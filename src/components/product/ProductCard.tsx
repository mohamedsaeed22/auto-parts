import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash, Minus, Plus, Heart, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "@/services/api/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  // Safe access to product properties
  const productName = product.name || "Product Name Unavailable";
  const productPrice = product.price || "0";
  const productFinalPrice = product.final_price || Number(productPrice);
  const productImage = product.primary_image || "/placeholder-product.jpg";
  const categoryName = product.category?.name || "Unknown Category";
  const brandName = product.brand?.name;
  const hasDiscount = product.discount_type || product.offer;
  const discountInfo = product.discount_info;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: productName,
      price: productFinalPrice,
      image: productImage,
      category: categoryName,
      description: product.description || "",
    });
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
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-gray-200 overflow-hidden">
          {/* Image Container with Badges */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {/* Product Image */}
            <Image
              src={productImage}
              alt={productName}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Action Buttons */}
            <div
              className={`absolute top-2 ${
                isRTL ? "left-2" : "right-2"
              } flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            >
              <Button
                size="sm"
                variant="outline"
                className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart size={12} className="text-gray-600" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Eye size={12} className="text-gray-600" />
              </Button>
            </div>

            {/* Discount Badge */}
            {hasDiscount && (
              <div className={`absolute top-2 ${isRTL ? "right-2" : "left-2"}`}>
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  {discountInfo || "SALE"}
                </div>
              </div>
            )}

            {/* Offer Badge */}
            {product.offer && (
              <div
                className={`absolute bottom-2 ${isRTL ? "right-2" : "left-2"}`}
              >
                <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  OFFER
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 flex flex-col flex-1">
            {/* Category and Brand */}
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-1 capitalize">
                {categoryName}
              </span>
              {brandName && (
                <span className="text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-1">
                  {brandName}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2rem]  group-hover:text-blue-600 transition-colors">
              {productName}
            </h3>

            {/* Price and Add to Cart Section */}
            <div className="mt-auto">
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {/* Price Section */}
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-base font-bold text-gray-900">
                    {isRTL
                      ? `${t("currency")} ${productFinalPrice}`
                      : `${productFinalPrice} ${t("currency")}`}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
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
                    className="bg-black hover:bg-gray-800 text-white rounded px-2 py-1 flex items-center gap-1 transition-all duration-200 hover:scale-105 text-xs"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={12} />
                    <span>{t("addToCart")}</span>
                  </Button>
                ) : (
                  <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
                    <Button
                      onClick={handleDecreaseQuantity}
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-gray-100 text-gray-700 rounded-none border-r border-gray-200"
                    >
                      {cartItem?.quantity === 1 ? (
                        <Trash size={10} />
                      ) : (
                        <Minus size={10} />
                      )}
                    </Button>

                    <div className="h-7 px-2 flex items-center justify-center bg-gray-50 min-w-[28px]">
                      <span className="text-sm font-semibold text-gray-800">
                        {cartItem?.quantity}
                      </span>
                    </div>

                    <Button
                      onClick={handleIncreaseQuantity}
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-gray-100 text-gray-700 rounded-none border-l border-gray-200"
                    >
                      <Plus size={10} />
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
