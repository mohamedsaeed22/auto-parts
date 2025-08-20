"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart"; // Use Redux hook
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Cart: React.FC = () => {
  const router = useRouter();
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const { t, i18n } = useTranslation("cart");
  const isRTL = i18n.language === "ar";
  // Use Redux hook
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
  } = useCart();

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
    setShowClearCartDialog(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearCartDialog(false);
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
    <>
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
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed ${
                isRTL ? "right-0" : "left-0"
              } top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div
                  className={`flex items-center space-x-3 ${
                    isRTL ? "space-x-reverse" : ""
                  }`}
                >
                  <ShoppingBag size={24} className="text-gray-700" />
                  <h2
                    className={`text-xl font-bold text-gray-900 ${
                      isRTL ? "mr-2" : "ml-2"
                    }`}
                  >
                    {t("title") || (isRTL ? "عربة التسوق" : "Shopping Cart")}
                  </h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={t("cart.actions.close")}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-500 text-sm">{t("loading")}</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <ShoppingBag size={64} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("empty.title")}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {t("empty.description")}
                    </p>
                    <Button onClick={handleContinueShopping} className="w-full">
                      {t("empty.continueShopping")}
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
                        className={`flex items-start space-x-3 ${
                          isRTL ? "space-x-reverse" : ""
                        } p-3 bg-gray-50 rounded-lg border border-gray-200`}
                      >
                        <div
                          className={`relative w-16 h-16 flex-shrink-0 ${
                            isRTL ? "mr-2" : "ml-2"
                          }`}
                        >
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
                            {item.price.toFixed(2)}{" "}
                            {t("items.price") || (isRTL ? "ريال" : "SAR")}
                          </p>

                          <div className="flex items-center justify-between">
                            <div
                              className={`flex items-center space-x-1 ${
                                isRTL ? "space-x-reverse" : ""
                              }`}
                            >
                              {item.quantity === 1 ? (
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-0.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  aria-label={t("items.remove")}
                                >
                                  <Trash2 size={14} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                              )}
                              <span className="text-xs font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            {t("items.itemTotal") ||
                              (isRTL ? "المجموع" : "Total")}
                            : {(item.price * item.quantity).toFixed(2)}{" "}
                            {t("items.price") || (isRTL ? "ريال" : "SAR")}
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
                      <span className="text-gray-600">
                        {t("summary.itemCount") ||
                          (isRTL ? "عدد المنتجات" : "Number of products")}
                        :
                      </span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>
                        {t("summary.grandTotal") ||
                          (isRTL ? "المجموع الكلي" : "Grand Total")}
                        :
                      </span>
                      <span className="text-blue-600">
                        {total.toFixed(2)}{" "}
                        {t("items.price") || (isRTL ? "ريال" : "SAR")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-black hover:bg-black/80"
                      size="lg"
                    >
                      <span>
                        {t("actions.checkout") ||
                          (isRTL ? "إتمام الطلب" : "Complete Order")}
                      </span>
                      {isRTL ? (
                        <ArrowRight size={18} />
                      ) : (
                        <ArrowLeft size={18} />
                      )}
                    </Button>

                    <div
                      className={`flex space-x-2 ${
                        isRTL ? "space-x-reverse" : ""
                      }`}
                    >
                      <Button
                        onClick={handleContinueShopping}
                        variant="outline"
                        className="flex-1"
                      >
                        {t("actions.continueShopping") ||
                          (isRTL ? "استمر في التسوق" : "Continue Shopping")}
                      </Button>
                      <Button
                        onClick={handleClearCart}
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        title={t("actions.clearCart")}
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

      {/* Clear Cart Confirmation Dialog */}
      <Dialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <DialogContent
          className={`sm:max-w-md ${isRTL ? "text-right" : "text-left"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <DialogHeader className={isRTL ? "text-right" : "text-left"}>
            <DialogTitle className="text-center">
              {t("dialog.clearTitle")}
            </DialogTitle>
            <DialogDescription className={isRTL ? "text-right" : "text-left"}>
              {t("dialog.clearDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter
            className={`flex space-x-2 ${isRTL ? "space-x-reverse" : ""}`}
          >
            <Button
              variant="outline"
              onClick={() => setShowClearCartDialog(false)}
            >
              {t("dialog.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmClearCart}>
              {t("dialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Cart;
