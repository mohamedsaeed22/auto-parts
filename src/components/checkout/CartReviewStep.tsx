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
    isAuthenticated,
    isRegistrationComplete,
    shouldUseAPI,
    syncLocalCartToAPI,
    updateQuantity,
    removeFromCart
  } = useEnhancedCart();

  const handleContinueToShipping = async () => {
    // If user is authenticated and registration is complete, sync cart before proceeding
    if (shouldUseAPI && items.length > 0) {
      setIsSyncing(true);
      try {
        await syncLocalCartToAPI();
        showSuccess(t("cartReview.syncSuccess", "Cart synchronized successfully"));
        onNext();
      } catch (error) {
        console.error("Cart sync failed:", error);
        showError(t("cartReview.syncError", "Failed to sync cart. Please try again."));
      } finally {
        setIsSyncing(false);
      }
    } else {
      // For unauthenticated users or incomplete registration, proceed directly
      onNext();
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2
            className={`text-2xl font-bold text-gray-900 flex items-center ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <ShoppingBag className={`w-6 h-6 ${isRTL ? "ml-3" : "mr-3"}`} />
            {t("cartReview.title")} ({totalItems} {t("cartReview.items")})
          </h2>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
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
              <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-gray-900 mb-1 text-lg ${
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
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {t("cartReview.inStock")}
                  </span>
                </div>

                <div
                  className={`flex items-center ${
                    isRTL ? "space-x space-x-4" : "space-x-4"
                  }`}
                >
                  <div
                    className={`flex items-center bg-white border-2 border-gray-400 rounded-lg overflow-hidden ${
                      isRTL ? "flex-row" : ""
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.id);
                        } else {
                          updateQuantity(item.id, Math.max(1, item.quantity - 1));
                        }
                      }}
                      className={`h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none flex items-center justify-center ${
                        isRTL
                          ? "border-l border-gray-300"
                          : "border-r border-gray-300"
                      }`}
                    >
                      {item.quantity === 1 ? (
                        <Trash size={16} />
                      ) : (
                        <Minus size={16} />
                      )}
                    </button>

                    <div className="h-8 px-3 flex items-center justify-center bg-gray-100 min-w-[40px]">
                      <span className="text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className={`h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none flex items-center justify-center ${
                        isRTL
                          ? "border-r border-gray-300"
                          : "border-l border-gray-300"
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={`flex-shrink-0 ${
                  isRTL ? "text-left" : "text-right"
                }`}
              >
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {(item.price * item.quantity).toFixed(2)} {t("currency")}
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-600">
                    {item.price.toFixed(2)} {t("currency")} /{" "}
                    {t("cartReview.piece")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-200">
        {shouldUseAPI && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center text-sm text-blue-800">
              <RefreshCw className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("cartReview.syncInfo", "Your cart will be synchronized with the server before checkout.")}
            </div>
          </div>
        )}
        
        <Button
          onClick={handleContinueToShipping}
          disabled={isSyncing}
          className={`flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium w-full flex items-center justify-center ${
            isRTL ? "flex-row" : ""
          }`}
        >
          {isSyncing ? (
            <>
              <RefreshCw className={`w-5 h-5 animate-spin ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("cartReview.syncing", "Synchronizing...")}
            </>
          ) : isRTL ? (
            <>
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("cartReview.continueToShipping")}
            </>
          ) : (
            <>
              {t("cartReview.continueToShipping")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartReviewStep;
