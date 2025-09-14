"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Trash,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { showError, showSuccess } from "@/lib/toast";

interface CartReviewStepProps {
  onNext: () => void;
}

const CartReviewStep: React.FC<CartReviewStepProps> = ({ onNext }) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    items,
    totalItems,
    shouldUseAPI,
    syncLocalCartToAPI,
    updateQuantity,
    removeFromCart,
    isItemLoading,
  } = useEnhancedCart();
  console.log(items);
  const handleContinueToShipping = async () => {
    onNext();
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-6 border-b border-logo-gold/30">
        <div className="flex items-center justify-between">
          <h2
            className={`text-2xl font-bold text-logo-black flex items-center ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <ShoppingBag
              className={`w-6 h-6 text-logo-gold ${isRTL ? "ml-3" : "mr-3"}`}
            />
            {t("cartReview.title")} ({totalItems} {t("cartReview.items")})
          </h2>
        </div>
      </div>

      <div className="divide-y divide-logo-gold/20">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6"
          >
            <div
              className={`flex items-start ${
                isRTL ? "space-x space-x-4" : "space-x-4"
              }`}
            >
              <div className="relative w-24 h-24 bg-logo-gold/10 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-logo-black mb-1 text-lg ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {item.title}
                </h3>
                <div
                  className={`flex items-center mb-3 ${
                    isRTL ? "space-x space-x-4" : "space-x-4"
                  }`}
                >
                  <span className="bg-logo-gold/15 text-logo-black text-xs font-medium px-2 py-1 rounded-full">
                    {t("cartReview.inStock")}
                  </span>
                </div>

                <div
                  className={`flex items-center ${
                    isRTL ? "space-x space-x-4" : "space-x-4"
                  }`}
                >
                  <div
                    className={`flex items-center bg-white border-2 border-logo-gold/50 rounded-lg overflow-hidden flex-row`}
                  >
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.id);
                        } else {
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          );
                        }
                      }}
                      disabled={isItemLoading(item.id)}
                      className={`h-8 w-8 p-0 hover:bg-logo-gold/10 text-logo-black rounded-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                        isRTL
                          ? "border-l border-logo-gold/30"
                          : "border-r border-logo-gold/30"
                      }`}
                    >
                      {isItemLoading(item.id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border border-logo-gold border-t-transparent"></div>
                      ) : item.quantity === 1 ? (
                        <Trash size={16} />
                      ) : (
                        <Minus size={16} />
                      )}
                    </button>

                    <div className="h-8 px-3 flex items-center justify-center bg-logo-gold/10 min-w-[40px]">
                      <span className="text-sm font-semibold text-logo-black">
                        {item.quantity}
                      </span>
                    </div>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isItemLoading(item.id)}
                      className={`h-8 w-8 p-0 hover:bg-logo-gold/10 text-logo-black rounded-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                        isRTL
                          ? "border-r border-logo-gold/30"
                          : "border-l border-logo-gold/30"
                      }`}
                    >
                      {isItemLoading(item.id) ? (
                        <div className="animate-spin rounded-full h-3 w-3 border border-logo-gold border-t-transparent"></div>
                      ) : (
                        <Plus size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`flex-shrink-0 ${
                  isRTL ? "text-left" : "text-right"
                }`}
              >
                <p className="text-2xl font-bold text-logo-black mb-1">
                  {(item.price * item.quantity).toFixed(2)} {t("currency")}
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-neutral-600">
                    {item.price.toFixed(2)} {t("currency")} /{" "}
                    {t("cartReview.piece")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 border-t border-logo-gold/30">
        <Button
          onClick={handleContinueToShipping}
          disabled={isSyncing}
          className={`flex-1 bg-logo-gold hover:bg-logo-gold/90 disabled:bg-logo-gold/50 text-white disabled:text-white/70 py-3 rounded-lg font-medium w-full flex items-center justify-center ${
            isRTL ? "flex-row" : ""
          }`}
        >
          {isSyncing ? (
            <>
              <RefreshCw
                className={`w-5 h-5 text-logo-black animate-spin ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              />
              {t("cartReview.syncing", "Synchronizing...")}
            </>
          ) : isRTL ? (
            <>
              {t("cartReview.continueToShipping")}
              <ArrowLeft className="w-5 h-5 mr-2 text-white" />
            </>
          ) : (
            <>
              {t("cartReview.continueToShipping")}
              <ArrowRight className="w-5 h-5 ml-2 text-white" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartReviewStep;
