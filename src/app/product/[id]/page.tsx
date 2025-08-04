"use client";

import Image from "next/image";
import { ArrowRight, ShoppingCart, Minus, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart"; // Use Redux hook

const product = {
  id: 1,
  title: "فرامل عالية الأداء",
  price: 89.99,
  description:
    "وسائد فرامل ممتازة مصممة للمركبات عالية الأداء. تتميز بمواد احتكاك متقدمة لقوة توقف فائقة وتقليل تلاشي الفرامل. مثالية للسيارات الرياضية والتطبيقات الشاقة.",
  category: "الفرامل",
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
  const [selectedImage, setSelectedImage] = useState(0);

  // Use Redux hook
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const isInCart = currentQuantity > 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-1 hover:text-gray-700 transition-colors flex-row-reverse space-x-reverse"
        >
          <span>رجوع</span>
          <ArrowRight size={16} />
        </button>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
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
                  alt={`${product.title} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-2xl font-bold text-gray-900">
              {product.price} ر.س
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">الوصف</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category */}
          <div>
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
              {product.category}
            </span>
          </div>

          <label className="block text-sm font-medium text-black mb-4">
            الكمية
          </label>

          <div className="bg-black rounded-lg p-2 min-h-[44px] flex items-center justify-center">
            {!isInCart ? (
              <Button
                onClick={handleAddToCart}
                className="w-full max-w-[200px] h-9 flex items-center justify-center space-x-2 flex-row-reverse space-x-reverse text-sm font-medium"
                size="sm"
              >
                <ShoppingCart size={16} />
                <span>أضف إلى السلة</span>
              </Button>
            ) : (
              // Quantity Selector with matching compact dimensions
              <div className="w-full max-w-[200px] h-9 flex items-center justify-center">
                <div className="flex items-center space-x-2 flex-row-reverse space-x-reverse">
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
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">رمز المنتج:</span>
              <span className="text-sm font-medium">PRD-{product.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">التوفر:</span>
              <span className="text-sm font-medium text-green-600">متوفر</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">القسم:</span>
              <span className="text-sm font-medium capitalize">
                {product.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
