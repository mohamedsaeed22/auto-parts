import React, { useState, useEffect } from "react";
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

// Constants for localStorage
const COUPON_CODE_KEY = "auto_parts_coupon_code";

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
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);

  // New state for calculated cart values
  const [calculatedSubtotal, setCalculatedSubtotal] = useState<number>(0);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);

  // Fetch server cart to reflect authoritative totals
  type CartItem = {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: string;
      final_price: number;
      primary_image: string;
      brand: {
        id: number;
        name: string;
      };
      category: {
        id: number;
        name: string;
      };
    };
    delivery_amount: string;
  };

  type ServerCart = {
    total_before_discount: number;
    cart_items: Array<CartItem>;
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

  const isApplyCouponApiData = React.useCallback(
    (val: unknown): val is ApplyCouponApiData => {
      if (!val || typeof val !== "object") return false;
      const v = val as Record<string, unknown>;
      return (
        typeof v.cart_total === "number" &&
        typeof v.discount_amount === "number" &&
        typeof v.final_total === "number"
      );
    },
    []
  );

  const handleApplyCoupon = async () => {
    setLocalError("");

    // Validate coupon code is not empty
    if (!couponCode || couponCode.trim() === "") {
      setLocalError(
        t("orderSummary.couponRequired", "Please enter a coupon code")
      );
      return;
    }

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

        // Set discount amount if it's greater than 0
        if (data.discount_amount > 0) {
          setApiDiscountAmount(data.discount_amount);
          setIsCouponApplied(true);

          // Save the valid coupon code to localStorage
          try {
            localStorage.setItem(COUPON_CODE_KEY, couponCode.trim());
          } catch (error) {}
        }

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

  // Remove coupon functionality
  const handleRemoveCoupon = () => {
    try {
      // Remove coupon from localStorage
      localStorage.removeItem(COUPON_CODE_KEY);

      // Reset all coupon-related states
      setIsCouponApplied(false);
      setApiDiscountAmount(null);
      setApiCartTotal(null);
      setApiFinalTotal(null);
      setCouponFinalTotal(null);
      setLocalError("");
      setSuccessMessage("");

      // Clear coupon code in parent component
      onCouponCodeChange("");

      // Refresh cart data to get default response
      dispatch(cartApi.util.invalidateTags(["Cart"]));
    } catch (error) {}
  };

  // Auto-apply saved coupon from localStorage when component renders
  useEffect(() => {
    const applySavedCoupon = async () => {
      try {
        const savedCouponCode = localStorage.getItem(COUPON_CODE_KEY);

        // Only apply if we have a saved coupon code and no discount already applied
        if (
          savedCouponCode &&
          savedCouponCode.trim() !== "" &&
          (!apiDiscountAmount || apiDiscountAmount <= 0)
        ) {
          // Update the coupon code in the parent component
          onCouponCodeChange(savedCouponCode);

          // Apply the coupon automatically
          try {
            const result = await applyCoupon({
              coupon_code: savedCouponCode,
            }).unwrap();

            if (result && typeof result.message === "string") {
              setSuccessMessage(result.message);
              setLocalError("");
            }

            const data = (result as ApiResponse<unknown>)?.data as unknown;
            if (isApplyCouponApiData(data)) {
              // Update local display state based on API response
              setApiCartTotal(data.cart_total);

              if (data.discount_amount > 0) {
                setApiDiscountAmount(data.discount_amount);
                setIsCouponApplied(true);
              } else {
                // If the saved coupon is no longer valid, remove it from localStorage
                localStorage.removeItem(COUPON_CODE_KEY);
                setIsCouponApplied(false);
              }

              setApiFinalTotal(data.final_total);
              setCouponFinalTotal(data.final_total);

              // Refresh cart data
              dispatch(cartApi.util.invalidateTags(["Cart"]));
              onApplyCoupon();
            }
          } catch (error) {
            // Remove invalid coupon from localStorage
            localStorage.removeItem(COUPON_CODE_KEY);
          }
        }
      } catch (error) {}
    };

    // Only run if we have cart data available
    if (apiCart) {
      applySavedCoupon();
    }
  }, [
    apiCart,
    applyCoupon,
    onCouponCodeChange,
    onApplyCoupon,
    dispatch,
    apiDiscountAmount,
    isApplyCouponApiData,
  ]);

  // Use effect to calculate cart totals from cart items when API data changes
  useEffect(() => {
    // Function to calculate cart total from cart items
    const calculateCartTotal = (
      cartItems: CartItem[]
    ): {
      subtotal: number;
      total: number;
    } => {
      let subtotal = 0;

      cartItems.forEach((item) => {
        // Final price * quantity
        const finalPrice = item.product.final_price * item.quantity;
        subtotal += finalPrice;
      });

      return {
        subtotal,
        total: subtotal,
      };
    };

    const server = (apiCart as ApiResponse<unknown> | undefined)?.data as
      | ServerCart
      | undefined;

    if (server?.cart_items && server.cart_items.length > 0) {
      const { subtotal, total } = calculateCartTotal(server.cart_items);
      setCalculatedSubtotal(subtotal);
      setCalculatedTotal(total);
    }
  }, [apiCart]);

  // Determine values to display, prioritizing API response when available
  const server = (apiCart as ApiResponse<unknown> | undefined)?.data as
    | ServerCart
    | undefined;

  // Get values from server response, prioritizing calculated values
  const displayedSubtotal =
    calculatedSubtotal || apiCartTotal || server?.cart_total || 0;
  const displayedShippingCost = Number(server?.delivery_amount) || 0;
  const displayedTotalBeforeDiscount = server?.total_before_discount || 0;

  // Original total is used in the UI for displaying the price before discount

  // Calculate final total (cart_total + delivery_amount)
  const finalTotal = server
    ? (calculatedTotal || server.cart_total) +
      Number(server.delivery_amount || 0)
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
                className={`flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-logo-gold focus:border-logo-gold ${
                  !isCouponApplied && (!couponCode || couponCode.trim() === "")
                    ? "border-gray-300 bg-gray-50"
                    : "border-neutral-300 bg-white"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              />

              <Button
                onClick={
                  isCouponApplied ? handleRemoveCoupon : handleApplyCoupon
                }
                disabled={
                  !isCouponApplied && (!couponCode || couponCode.trim() === "")
                }
                size="sm"
                className={`px-3 py-2 text-xs text-white ${
                  isCouponApplied
                    ? "bg-red-500 hover:bg-red-600"
                    : !couponCode || couponCode.trim() === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-logo-gold hover:bg-logo-gold/90"
                }`}
              >
                {isApplyingCoupon || isApplying
                  ? t("orderSummary.applying")
                  : isCouponApplied
                  ? t("orderSummary.remove", "Remove")
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
            {!isCouponApplied && (!couponCode || couponCode.trim() === "") && (
              <p className="text-xs text-gray-500 mt-2">
                {t(
                  "orderSummary.enterCouponCode",
                  "Enter a coupon code to apply"
                )}
              </p>
            )}
          </div>
        )}
        {/* {couponApplied && displayedDiscount > 0 && (
          <div className="flex items-center justify-between text-sm text-logo-black">
            <span>{t("orderSummary.discountApplied")}</span>
            <div className="flex items-center">
              <span className="font-medium text-logo-gold">
                -{displayedDiscount.toFixed(2)} {t("currency")}
              </span>
            </div>
          </div>
        )} */}

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          {/* Original price before discount - show when value > 0 */}
          {displayedTotalBeforeDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {t(
                  "cartReview.cartTotalBeforeDiscount",
                  "Cart Total Before Discount"
                )}
              </span>
              <span className="font-medium line-through text-neutral-500">
                {displayedTotalBeforeDiscount.toFixed(2)} {t("currency")}
              </span>
            </div>
          )}

          {/* Subtotal after discount */}
          <div className="flex justify-between">
            <span className="text-neutral-600">
              {t("orderSummary.subtotal")}
            </span>
            <span className="font-medium">
              {displayedSubtotal.toFixed(2)} {t("currency")}
            </span>
          </div>

          {/* Discount row - only show when coupon is applied */}
          {isCouponApplied &&
            apiDiscountAmount !== null &&
            apiDiscountAmount > 0 && (
              <div className="flex justify-between text-logo-gold">
                <span>{t("cartReview.totalDiscount")}</span>
                <span className="font-medium">
                  -{apiDiscountAmount.toFixed(2)} {t("currency")}
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
              {/* Show couponFinalTotal if coupon is applied, otherwise show default cart total */}
              {(isCouponApplied && couponFinalTotal !== null
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
