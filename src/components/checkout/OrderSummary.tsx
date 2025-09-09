import React, { useState } from "react";
import {
  Clock,
  X,
  Shield,
  RefreshCw,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApplyCouponMutation, cartApi } from "@/services/api/cartApi";
import { useAppDispatch } from "@/store/hooks";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";

interface OrderSummaryProps {
  currentStep: number;
  total: number;
  couponCode: string;
  couponDiscount: number;
  isApplyingCoupon: boolean;
  couponError: string;
  isProcessing: boolean;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onPlaceOrder: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  currentStep,
  total,
  couponCode,
  couponDiscount,
  isApplyingCoupon,
  couponError,
  isProcessing,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  onPlaceOrder,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const finalTotal = total * 1.15 - couponDiscount;
  const dispatch = useAppDispatch();
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [localError, setLocalError] = useState<string>("");

  const handleApplyCoupon = async () => {
    setLocalError("");
    try {
      await applyCoupon({ coupon_code: couponCode.trim() }).unwrap();
      // Refresh cart data from backend
      dispatch(cartApi.util.invalidateTags(["Cart"]));
      onApplyCoupon();
      setLocalError("");
    } catch (err) {
      let msg = t("orderSummary.applyError", "Failed to apply coupon");
      const e = err as FetchBaseQueryError & { data?: { message?: unknown } };
      if (e?.data && typeof e.data.message === "string") {
        msg = e.data.message as string;
      }
      setLocalError(msg);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-logo-gold/30"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="p-6 border-b border-logo-gold/30">
        <h3 className="text-xl font-bold text-logo-black">
          {t("orderSummary.title")}
        </h3>
      </div>

      <div className="p-6">
        {/* Delivery Info */}
        <div className="bg-logo-gold/10 rounded-xl p-4 mb-6">
          <div className="flex items-center text-logo-black mb-2">
            <Clock className="w-4 h-4 mx-2 text-logo-gold" />
            <span className="font-medium text-sm">
              {t("orderSummary.freeDelivery")}
            </span>
          </div>
          <p className="text-xs text-logo-black/70">
            {t("orderSummary.orderWithin")}
          </p>
        </div>

        {/* Coupon Section - Only show in first 3 steps */}
        {currentStep < 4 && (
          <div className="mb-6">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={t("orderSummary.couponPlaceholder")}
                value={couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-logo-gold focus:border-logo-gold"
                disabled={couponDiscount > 0}
                dir={isRTL ? "rtl" : "ltr"}
              />
              {couponDiscount > 0 ? (
                <Button
                  onClick={onRemoveCoupon}
                  variant="outline"
                  size="sm"
                  className="px-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleApplyCoupon}
                  disabled={
                    !couponCode.trim() || isApplyingCoupon || isApplying
                  }
                  size="sm"
                  className="px-3 py-2 text-xs bg-logo-gold hover:bg-logo-gold/90 text-white"
                >
                  {isApplyingCoupon || isApplying
                    ? t("orderSummary.applying")
                    : t("orderSummary.apply")}
                </Button>
              )}
            </div>
            {couponError && (
              <p className="text-xs text-logo-red mt-2">{couponError}</p>
            )}
            {localError && !couponError && (
              <p className="text-xs text-logo-red mt-2">{localError}</p>
            )}
            {couponDiscount > 0 && (
              <div className="mt-2 p-3 bg-logo-gold/10 rounded-lg">
                <div className="flex items-center justify-between text-sm text-logo-black">
                  <span>{t("orderSummary.discountApplied")}</span>
                  <span className="font-medium">
                    -{couponDiscount.toFixed(2)} {t("currency")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {t("orderSummary.subtotal")}
            </span>
            <span className="font-medium">
              {total.toFixed(2)} {t("currency")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {t("orderSummary.shipping")}
            </span>
            <span className="font-medium text-logo-gold">
              {t("orderSummary.free")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">{t("orderSummary.tax")}</span>
            <span className="font-medium">
              {(total * 0.15).toFixed(2)} {t("currency")}
            </span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-logo-gold">
              <span>{t("orderSummary.discount")}</span>
              <span className="font-medium">
                -{couponDiscount.toFixed(2)} {t("currency")}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-logo-gold/30 mt-4 pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span className="text-logo-black">{t("orderSummary.total")}</span>
            <span className="text-logo-gold">
              {finalTotal.toFixed(2)} {t("currency")}
            </span>
          </div>
        </div>

        {currentStep === 4 && (
          <Button
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="w-full mt-6 bg-logo-gold hover:bg-logo-gold/90 text-white py-4 rounded-xl font-medium text-lg shadow-lg"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mx-2" />
                {t("orderSummary.processing")}
              </div>
            ) : (
              <>
                {t("orderSummary.confirmOrder")}
                <CheckCircle className="w-5 h-5 mx-2" />
              </>
            )}
          </Button>
        )}

        {/* Security Features */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <Shield className="w-4 h-4 text-logo-gold mx-2" />
            <span>{t("orderSummary.securePayment")}</span>
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <RefreshCw className="w-4 h-4 text-logo-gold mx-2" />
            <span>{t("orderSummary.returnPolicy")}</span>
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Clock className="w-4 h-4 text-logo-gold mx-2" />
            <span>{t("orderSummary.customerSupport")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
