"use client";

import React, { useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore"; // Update this path to your store location
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Cart: React.FC = () => {
  const router = useRouter();

  // Destructure all needed state and actions from Zustand store
  const {
    isOpen,
    items,
    total,
    totalItems,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartOpen,
  } = useCartStore();

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setCartOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setCartOpen]);

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(id, quantity);
  };

  const handleClearCart = () => {
    if (confirm("هل أنت متأكد من تفريغ عربة التسوق؟")) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  const handleContinueShopping = () => {
    setCartOpen(false);
    router.push("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 space-x-reverse">
                <ShoppingBag size={24} className="text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900 ms-2">عربة التسوق</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="إغلاق عربة التسوق"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    عربة التسوق فارغة
                  </h3>
                  <p className="text-gray-500 mb-6">
                    أضف بعض المنتجات للبدء في التسوق
                  </p>
                  <Button onClick={handleContinueShopping} className="w-full">
                    استمر في التسوق
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-start space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 ml-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-xs line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-blue-600 font-semibold text-xs mb-1">
                          {item.price.toFixed(2)} ر.س
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-0.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                            aria-label="إزالة المنتج"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          المجموع: {(item.price * item.quantity).toFixed(2)} ر.س
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-gray-200 p-6 space-y-4 bg-gray-50"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">عدد المنتجات:</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span className="text-blue-600">
                      {total.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-black hover:bg-black/80"
                    size="lg"
                  >
                    <span>إتمام الطلب</span>
                    <ArrowLeft size={18} />
                  </Button>

                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      onClick={handleContinueShopping}
                      variant="outline"
                      className="flex-1"
                    >
                      استمر في التسوق
                    </Button>
                    <Button
                      onClick={handleClearCart}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
