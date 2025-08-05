"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  addedDate: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "فرامل عالية الأداء",
      price: 89.99,
      originalPrice: 120.0,
      image: "/products/product1.jpg",
      category: "الفرامل",
      inStock: true,
      addedDate: "2024-01-10",
    },
    {
      id: 2,
      name: "زيت محرك اصطناعي",
      price: 150.0,
      image: "/products/product2.jpg",
      category: "الزيوت",
      inStock: false,
      addedDate: "2024-01-15",
    },
    {
      id: 3,
      name: "فلتر هواء محرك",
      price: 75.5,
      image: "/products/product3.png",
      category: "الفلترة",
      inStock: true,
      addedDate: "2024-01-20",
    },
    {
      id: 4,
      name: "شمعة اشتعال",
      price: 45.0,
      originalPrice: 60.0,
      image: "/products/product4.png",
      category: "الإشعال",
      inStock: true,
      addedDate: "2024-01-25",
    },
  ]);

  const handleRemoveFromWishlist = (id: number) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    // Add to cart logic would go here
    console.log("Add to cart:", item);
  };

  const handleViewProduct = (item: WishlistItem) => {
    // Navigate to product page
    console.log("View product:", item);
  };

  const totalSavings = wishlist.reduce((sum, item) => {
    return sum + (item.originalPrice ? item.originalPrice - item.price : 0);
  }, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-right">المفضلة</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {wishlist.length} منتج في المفضلة
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={wishlist.filter((item) => item.inStock).length === 0}
          >
            <ShoppingCart size={16} />
            إضافة الكل للسلة
          </Button>
        </div>
      </div>

      {/* Wishlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-pink-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-pink-600">
            {wishlist.length}
          </div>
          <div className="text-sm text-gray-600">المنتجات المفضلة</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {wishlist.filter((item) => item.inStock).length}
          </div>
          <div className="text-sm text-gray-600">متوفر في المخزون</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalSavings.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">إجمالي التوفير</div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="relative mb-4">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="aspect-square w-full h-auto object-cover bg-gray-200 rounded-lg mb-3"
              />
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
              {!item.inStock && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  نفذ المخزون
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-600">{item.category}</div>
              <h3 className="font-medium text-right">{item.name}</h3>

              <div className="flex items-center gap-2 justify-end">
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {item.originalPrice} ر.س
                  </span>
                )}
                <span className="font-bold text-lg">{item.price} ر.س</span>
              </div>

              <div className="text-xs text-gray-500 text-right">
                أضيف في {item.addedDate}
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!item.inStock}
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart size={14} className="ml-1" />
                  إضافة للسلة
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewProduct(item)}
                >
                  <Eye size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {wishlist.length === 0 && (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            قائمة المفضلة فارغة
          </h3>
          <p className="text-gray-500 mb-4">
            لم تقم بإضافة أي منتجات للمفضلة بعد
          </p>
          <Button>تصفح المنتجات</Button>
        </div>
      )}
    </div>
  );
}
