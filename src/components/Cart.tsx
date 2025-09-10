"use client";

import React, { useEffect } from "react";
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
import { useEnhancedCart } from "@/hooks/useEnhancedCart"; // Use Enhanced Redux hook
import { Button } from "@/components/ui/button";
// import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const Cart: React.FC = () => {
  const router = useRouter();
  // const [showClearCartDialog, setShowClearCartDialog] = useState(false);
  const { t, i18n } = useTranslation("cart");
  const isRTL = i18n.language === "ar";
  // Use Enhanced Redux hook
  const {
    isOpen,
    items,
    total,
    totalItems,
    // loading,
    removeFromCart,
    updateQuantity,
    // clearCart,
    setCartOpen,
    isItemLoading,
  } = useEnhancedCart();

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

  // const handleClearCart = () => {
  //   setShowClearCartDialog(true);
  // };

  // const confirmClearCart = () => {
  //   clearCart();
  //   setShowClearCartDialog(false);
  // };

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
              } top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <ShoppingBag size={24} className="text-logo-gold" />
                  <h2 className="text-xl font-bold text-logo-black mx-2">
                    {t("title")}
                  </h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                  aria-label={t("cart.actions.close")}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <ShoppingBag size={64} className="text-neutral-300 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      {t("empty.title")}
                    </h3>
                    <p className="text-neutral-500 mb-6">
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
                        className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg border border-border"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 mx-2">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-neutral-900 text-xs line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-logo-gold font-semibold text-xs mb-1">
                            {item.price.toFixed(2)} {t("items.price")}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {item.quantity === 1 ? (
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={isItemLoading(item.id)}
                                  className="p-0.5 text-accent hover:bg-accent-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[20px] min-h-[20px]"
                                  aria-label={t("items.remove")}
                                >
                                  {isItemLoading(item.id) ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border border-accent border-t-transparent"></div>
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={isItemLoading(item.id)}
                                  className="p-0.5 hover:bg-neutral-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[20px] min-h-[20px]"
                                >
                                  {isItemLoading(item.id) ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border border-neutral-400 border-t-transparent"></div>
                                  ) : (
                                    <Minus size={14} />
                                  )}
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
                                disabled={isItemLoading(item.id)}
                                className="p-0.5 hover:bg-neutral-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[20px] min-h-[20px]"
                              >
                                {isItemLoading(item.id) ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border border-neutral-400 border-t-transparent"></div>
                                ) : (
                                  <Plus size={14} />
                                )}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-600 mt-1">
                            {t("items.itemTotal")}:{" "}
                            {(item.price * item.quantity).toFixed(2)}{" "}
                            {t("items.price")}
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
                  className="border-t border-border p-6 space-y-4 bg-neutral-50"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">
                        {t("summary.itemCount")}:
                      </span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>{t("summary.grandTotal")}:</span>
                      <span className="text-logo-gold">
                        {total.toFixed(2)} {t("items.price")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-logo-gold hover:bg-logo-gold/90 text-black flex items-center"
                      size="lg"
                    >
                      {isRTL ? (
                        <>
                          <span className="text-white">
                            {t("actions.checkout")}
                          </span>
                          <ArrowLeft size={18} className="mx-2 text-white" />
                        </>
                      ) : (
                        <>
                          <span className="text-white">
                            {t("actions.checkout")}
                          </span>
                          <ArrowRight size={18} className="mx-2 text-white" />
                        </>
                      )}
                    </Button>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handleContinueShopping}
                        variant="outline"
                        className="flex-1 border-logo-gold text-logo-black "
                      >
                        {t("actions.continueShopping")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
