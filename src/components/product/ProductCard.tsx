import { useCart } from "@/hooks/useCart"; // Use Redux hook
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Product } from "./productsData";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, i18n } = useTranslation("product");
  const isRTL = i18n.language === "ar";
  const { items, addToCart, updateQuantity } = useCart(); // Use Redux hook
  const cartItem = items.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: isRTL ? product.title.ar : product.title.en,
      price: product.price,
      image: product.image,
      category: isRTL ? product.category.ar : product.category.en,
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
      updateQuantity(product.id, 0);
    }
  };

  return (
    <div className="group" dir={isRTL ? "rtl" : "ltr"}>
      <Link href={`/product/${product.id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          <div className="aspect-square overflow-hidden bg-gray-200">
            <Image
              src={product.image}
              alt={isRTL ? product.title.ar : product.title.en}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3 flex flex-col flex-1">
            <h3
              className={`text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem] ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {isRTL ? product.title.ar : product.title.en}
            </h3>

            <p
              className={`text-xs text-gray-600 mb-2 capitalize bg-gray-100 rounded-full px-2 py-1 w-fit ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {isRTL ? product.category.ar : product.category.en}
            </p>

            <div
              className={`flex items-center justify-between mt-auto ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span
                className={`text-lg font-bold text-gray-900 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {product.price} {t("currencySymbol")}
              </span>

              {!isInCart ? (
                <Button
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white rounded-lg px-3 py-2 flex items-center gap-1 transition-all duration-200 hover:scale-105"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={16} />
                </Button>
              ) : (
                <div
                  className={`flex items-center bg-white border-2 border-gray-400 rounded-lg overflow-hidden ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Button
                    onClick={handleDecreaseQuantity}
                    size="sm"
                    variant="ghost"
                    className={`h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none ${
                      isRTL
                        ? "border-l border-gray-300"
                        : "border-r border-gray-300"
                    }`}
                  >
                    {cartItem?.quantity === 1 ? (
                      <Trash size={16} />
                    ) : (
                      <Minus size={16} />
                    )}
                  </Button>

                  <div className="h-8 px-3 flex items-center justify-center bg-gray-100 min-w-[40px]">
                    <span className="text-sm font-semibold text-gray-800">
                      {cartItem?.quantity}
                    </span>
                  </div>

                  <Button
                    onClick={handleIncreaseQuantity}
                    size="sm"
                    variant="ghost"
                    className={`h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none ${
                      isRTL
                        ? "border-r border-gray-300"
                        : "border-l border-gray-300"
                    }`}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
