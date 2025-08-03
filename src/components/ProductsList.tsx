"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, updateQuantity } from "@/store/slices/cartSlice";

// Mock products data
const products = [
  {
    id: 1,
    title: "فرامل عالية الأداء للسيارات الرياضية",
    price: 89.99,
    category: "الفرامل",
    image: "/products/product1.jpg",
  },
  {
    id: 2,
    title: "زيت محرك اصطناعي عالي الجودة",
    price: 45.5,
    category: "الزيوت",
    image: "/products/product2.jpg",
  },
  {
    id: 3,
    title: "فلتر هواء محرك قابل للغسل",
    price: 32.75,
    category: "الفلترة",
    image: "/products/product3.png",
  },
  {
    id: 4,
    title: "بطارية سيارة قوية 60 أمبير",
    price: 120.0,
    category: "البطاريات",
    image: "/products/product4.png",
  },
  {
    id: 5,
    title: "إطارات صيفية عالية الأداء",
    price: 180.25,
    category: "الإطارات",
    image: "/products/product5.png",
  },
  {
    id: 6,
    title: "مصباح LED أمامي للسيارة",
    price: 65.8,
    category: "الإضاءة",
    image: "/products/product6.png",
  },
  {
    id: 7,
    title: "مقعد سيارة رياضي قابل للتعديل",
    price: 250.0,
    category: "المقاعد",
    image: "/products/product7.png",
  },
  {
    id: 8,
    title: "عجلة قيادة رياضية جلدية",
    price: 95.5,
    category: "الإكسسوارات",
    image: "/products/product8.jpg",
  },
  {
    id: 9,
    title: "مكيف هواء محمول للسيارة",
    price: 75.3,
    category: "التكييف",
    image: "/products/product9.jpg",
  },
  {
    id: 10,
    title: "جهاز تتبع GPS للسيارة",
    price: 110.0,
    category: "الإلكترونيات",
    image: "/products/product10.png",
  },
];

interface ProductCardProps {
  product: (typeof products)[0];
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // Check if product is in cart
  const cartItem = cartItems.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    );
  };

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      dispatch(
        updateQuantity({ id: product.id, quantity: cartItem.quantity + 1 })
      );
    }
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartItem.quantity > 1) {
      dispatch(
        updateQuantity({ id: product.id, quantity: cartItem.quantity - 1 })
      );
    } else if (cartItem && cartItem.quantity === 1) {
      dispatch(updateQuantity({ id: product.id, quantity: 0 }));
    }
  };

  return (
    <div className="group">
      <Link href={`/product/${product.id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
          <div className="aspect-square overflow-hidden bg-gray-200">
            <Image
              src={product.image}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3 flex flex-col flex-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
              {product.title}
            </h3>
            
            <p className="text-xs text-gray-600 mb-2 capitalize bg-gray-100 rounded-full px-2 py-1 w-fit">
              {product.category}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-lg font-bold text-gray-900">
                {product.price} ر.س
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
                <div className="flex items-center bg-white border-2 border-gray-400 rounded-lg overflow-hidden">
                  <Button
                    onClick={handleDecreaseQuantity}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none border-r border-gray-300"
                  >
                    <Minus size={14} />
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
                    className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none border-l border-gray-300"
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

const ProductsList = () => {
  return (
    <section className="py-16 bg-gray-50 rounded-3xl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            منتجاتنا المميزة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من قطع الغيار والإكسسوارات عالية الجودة لسيارتك
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 py-3">
            عرض المزيد من المنتجات
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsList;