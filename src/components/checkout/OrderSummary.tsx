import React, { useState } from "react";
import { Clock, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useApplyCouponMutation,
  cartApi,
  useGetCartQuery,
} from "@/services/api/cartApi";
import { useAppDispatch } from "@/store/hooks";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";
import type { ApiResponse } from "@/services/api/types";

interface OrderSummaryProps {
  currentStep: number;
  couponCode: string;
  isApplyingCoupon: boolean;
  couponError: string;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  currentStep,
  couponCode,
  isApplyingCoupon,
  couponError,
  onCouponCodeChange,
  onApplyCoupon,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const dispatch = useAppDispatch();
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [localError, setLocalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiCartTotal, setApiCartTotal] = useState<number | null>(null);
  const [apiDiscountAmount, setApiDiscountAmount] = useState<number | null>(
    null
  );
  const [apiFinalTotal, setApiFinalTotal] = useState<number | null>(null);
  const [couponFinalTotal, setCouponFinalTotal] = useState<number | null>(null);

  // Fetch server cart to reflect authoritative totals
  type ServerCart = {
    cart_items: Array<unknown>;
    cart_total: number;
    item_count: number;
    total_discount: number;
    delivery_amount: string | number;
  };
  const { data: apiCart } = useGetCartQuery(undefined, {
    // If unauthenticated, this will be skipped by the API layer or error; we handle undefined below
  });

  type ApplyCouponApiData = {
    coupon: {
      id: number;
      code: string;
      name: string;
      description: string | null;
      type: "percentage" | "fixed" | string;
      value: number;
      is_valid: boolean;
      has_reached_limit: boolean;
    };
    discount_amount: number;
    cart_total: number;
    final_total: number;
  };

  const isApplyCouponApiData = (val: unknown): val is ApplyCouponApiData => {
    if (!val || typeof val !== "object") return false;
    const v = val as Record<string, unknown>;
    return (
      typeof v.cart_total === "number" &&
      typeof v.discount_amount === "number" &&
      typeof v.final_total === "number"
    );
  };

  const handleApplyCoupon = async () => {
    setLocalError("");
    try {
      const result = await applyCoupon({
        coupon_code: couponCode.trim(),
      }).unwrap();

      // Display success message from API response
      if (result && typeof result.message === "string") {
        setSuccessMessage(result.message);
        setLocalError("");
      }

      const data = (result as ApiResponse<unknown>)?.data as unknown;
      if (isApplyCouponApiData(data)) {
        // Check if coupon is valid (discount_amount > 0 and final_total > 0)
        if (data.discount_amount === 0 && data.final_total === 0) {
          setLocalError(
            t("orderSummary.invalidCoupon", "This coupon is not valid")
          );
          return;
        }

        // Update local display state based on API response
        setApiCartTotal(data.cart_total);
        setApiDiscountAmount(data.discount_amount);
        setApiFinalTotal(data.final_total);
        setCouponFinalTotal(data.final_total);
      }
      // Refresh cart data from backend
      dispatch(cartApi.util.invalidateTags(["Cart"]));
      onApplyCoupon();
    } catch (err) {
      // Display error message from API response
      const e = err as FetchBaseQueryError & { data?: { message?: unknown } };
      if (e?.data && typeof e.data.message === "string") {
        setLocalError(e.data.message as string);
      } else {
        setLocalError(t("orderSummary.applyError", "Failed to apply coupon"));
      }
    }
  };

  // Remove coupon functionality is not needed

  // Determine values to display, prioritizing API response when available
  const server = (apiCart as ApiResponse<unknown> | undefined)?.data as
    | ServerCart
    | undefined;

  // Get values from server response
  const displayedSubtotal = apiCartTotal ?? server?.cart_total ?? 0;
  const displayedDiscount = apiDiscountAmount ?? server?.total_discount ?? 0;
  const displayedShippingCost = Number(server?.delivery_amount) || 0;

  // Calculate original total (before discount) - used in commented out section
  // In the API, cart_total is already after discount, so we need to add the discount back
  // const originalTotal = displayedSubtotal + displayedDiscount;

  // Calculate final total (cart_total + delivery_amount)
  const finalTotal = server
    ? server.cart_total + Number(server.delivery_amount || 0)
    : apiFinalTotal !== null
    ? apiFinalTotal
    : displayedSubtotal + displayedShippingCost;

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
                dir={isRTL ? "rtl" : "ltr"}
              />

              <Button
                onClick={handleApplyCoupon}
                size="sm"
                className="px-3 py-2 text-xs bg-logo-gold hover:bg-logo-gold/90 text-white"
              >
                {isApplyingCoupon || isApplying
                  ? t("orderSummary.applying")
                  : t("orderSummary.apply")}
              </Button>
            </div>
            {couponError && (
              <p className="text-xs text-logo-red mt-2">{couponError}</p>
            )}
            {localError && !couponError && (
              <p className="text-xs text-logo-red mt-2">{localError}</p>
            )}
            {successMessage && !localError && !couponError && (
              <p className="text-xs text-logo-gold mt-2">{successMessage}</p>
            )}
            {displayedDiscount > 0 && (
              <div className="mt-2 p-3 bg-logo-gold/10 rounded-lg">
                <div className="flex items-center justify-between text-sm text-logo-black">
                  <span>{t("orderSummary.discountApplied")}</span>
                  <div className="flex items-center">
                    <span className="font-medium">
                      -{displayedDiscount.toFixed(2)} {t("currency")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          {/* Original total (before discount) */}
          {/* <div className="flex justify-between">
            <span className="text-neutral-600">
              {t("cartReview.cartTotal")}
            </span>
            <span
              className={`font-medium ${
                displayedDiscount > 0 ? "line-through text-neutral-500" : ""
              }`}
            >
              {originalTotal.toFixed(2)} {t("currency")}
            </span>
          </div> */}

          {/* Subtotal after discount */}

          <div className="flex justify-between">
            <span className="text-neutral-600">
              {t("orderSummary.subtotal")}
            </span>
            <span className="font-medium">
              {displayedSubtotal.toFixed(2)} {t("currency")}
            </span>
          </div>

          {/* Discount row - only shown if there is a discount */}
          {displayedDiscount > 0 && (
            <div className="flex justify-between text-logo-gold">
              <span>{t("cartReview.totalDiscount")}</span>
              <span className="font-medium">
                -{displayedDiscount.toFixed(2)} {t("currency")}
              </span>
            </div>
          )}
          {/* Shipping cost */}
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {t("orderSummary.shipping")}
            </span>
            <span className="font-medium text-logo-gold">
              {displayedShippingCost > 0
                ? `${displayedShippingCost.toFixed(2)} ${t("currency")}`
                : t("orderSummary.free")}
            </span>
          </div>
        </div>
        <div className="border-t border-logo-gold/30 mt-4 pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span className="text-logo-black">{t("orderSummary.total")}</span>
            <span className="text-logo-gold">
              {/* Show couponFinalTotal if available (from coupon API response), otherwise show calculated finalTotal */}
              {(couponFinalTotal !== null && displayedDiscount > 0
                ? couponFinalTotal + displayedShippingCost
                : finalTotal
              ).toFixed(2)}{" "}
              {t("currency")}
            </span>
          </div>
        </div>

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
