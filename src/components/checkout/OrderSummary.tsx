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
import { useSmartAddress } from "@/hooks/useSmartAddress";

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

// Updated types to match exact API response structure
type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    tax: number;
    price_without_tax: number;
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

type CartResponse = {
  cart_items: CartItem[];
  total_amount_without_tax: number;
  total_tax: number;
  total_before_discount: number;
  total_discount: number;
  cart_total: number;
  total_coupon_discount: number;
  delivery_amount: number;
  delivery_tax: number;
  final_total: number;
  item_count: number;
};

type CouponResponse = {
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
  total_amount_without_tax: number;
  total_tax: number;
  total_before_discount: number;
  total_discount: number;
  cart_total: number;
  total_coupon_discount: number;
  delivery_amount: number;
  delivery_tax: number;
  final_total: number;
};

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

  // Smart address management
  const { getEffectiveAddressId, selectedAddress } = useSmartAddress();

  // State management
  const [localError, setLocalError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [couponData, setCouponData] = useState<CouponResponse | null>(null);

  // Get effective address ID for API calls
  const effectiveAddressId = getEffectiveAddressId();

  // Fetch cart data
  const {
    data: apiCart,
    isLoading: isCartLoading,
    error: cartError,
  } = useGetCartQuery(
    effectiveAddressId ? { address_id: effectiveAddressId } : undefined,
    {
      // If unauthenticated, this will be skipped by the API layer or error; we handle undefined below
      refetchOnMountOrArgChange: true, // Ensure we get fresh data
    }
  );

  // Get cart data from API response
  const cartData = (apiCart as ApiResponse<CartResponse> | undefined)?.data;

  // Handle coupon application
  const handleApplyCoupon = async () => {
    setLocalError("");
    setSuccessMessage("");

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
        address_id: effectiveAddressId || undefined,
      }).unwrap();

      // Display success message from API response
      if (result && typeof result.message === "string") {
        setSuccessMessage(result.message);
        setLocalError("");
      }

      const data = (result as ApiResponse<unknown>)?.data as CouponResponse;
      if (data) {
        // Check if coupon is valid
        if (data.total_coupon_discount > 0) {
          setIsCouponApplied(true);
          setCouponData(data); // Store coupon response data

          // Save the valid coupon code to localStorage
          try {
            localStorage.setItem(COUPON_CODE_KEY, couponCode.trim());
          } catch (error) {
            console.warn("Failed to save coupon to localStorage:", error);
          }
        } else {
          setLocalError(
            t("orderSummary.invalidCoupon", "This coupon is not valid")
          );
          return;
        }
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
      setCouponData(null); // Clear coupon data
      setLocalError("");
      setSuccessMessage("");

      // Clear coupon code in parent component
      onCouponCodeChange("");

      // Refresh cart data to get default response
      dispatch(cartApi.util.invalidateTags(["Cart"]));
    } catch (error) {
      console.warn("Failed to remove coupon from localStorage:", error);
    }
  };

  // Auto-apply saved coupon from localStorage when component renders
  useEffect(() => {
    const applySavedCoupon = async () => {
      try {
        const savedCouponCode = localStorage.getItem(COUPON_CODE_KEY);

        // Only apply if we have a saved coupon code and cart data is available
        if (
          savedCouponCode &&
          savedCouponCode.trim() !== "" &&
          cartData &&
          !isInitialized
        ) {
          // Update the coupon code in the parent component
          onCouponCodeChange(savedCouponCode);

          // Apply the coupon automatically
          try {
            const result = await applyCoupon({
              coupon_code: savedCouponCode,
              address_id: effectiveAddressId || undefined,
            }).unwrap();

            if (result && typeof result.message === "string") {
              setSuccessMessage(result.message);
              setLocalError("");
            }

            const data = (result as ApiResponse<unknown>)
              ?.data as CouponResponse;
            if (data && data.total_coupon_discount > 0) {
              setIsCouponApplied(true);
              setCouponData(data); // Store coupon response data
            } else {
              // If the saved coupon is no longer valid, remove it from localStorage
              localStorage.removeItem(COUPON_CODE_KEY);
              setIsCouponApplied(false);
              setCouponData(null);
            }

            // Refresh cart data
            dispatch(cartApi.util.invalidateTags(["Cart"]));
            onApplyCoupon();
          } catch {
            // Remove invalid coupon from localStorage
            localStorage.removeItem(COUPON_CODE_KEY);
            setIsCouponApplied(false);
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.warn("Failed to apply saved coupon:", error);
        setIsInitialized(true);
      }
    };

    // Only run if we have cart data available and not yet initialized
    if (cartData && !isInitialized) {
      applySavedCoupon();
    }
  }, [
    cartData,
    applyCoupon,
    onCouponCodeChange,
    onApplyCoupon,
    dispatch,
    isInitialized,
    effectiveAddressId,
  ]);

  // Re-apply coupon when address changes
  useEffect(() => {
    const reapplyCouponOnAddressChange = async () => {
      if (isCouponApplied && selectedAddress && effectiveAddressId) {
        try {
          const savedCouponCode = localStorage.getItem(COUPON_CODE_KEY);
          if (savedCouponCode && savedCouponCode.trim() !== "") {
            const result = await applyCoupon({
              coupon_code: savedCouponCode,
              address_id: effectiveAddressId,
            }).unwrap();

            if (result && typeof result.message === "string") {
              setSuccessMessage(result.message);
              setLocalError("");
            }

            const data = (result as ApiResponse<unknown>)
              ?.data as CouponResponse;
            if (data && data.total_coupon_discount > 0) {
              setCouponData(data);
            }
          }
        } catch (error) {
          console.warn("Failed to re-apply coupon with new address:", error);
        }
      }
    };

    // Only re-apply if we have an initialized component and address changed
    if (isInitialized && selectedAddress) {
      reapplyCouponOnAddressChange();
    }
  }, [
    selectedAddress,
    effectiveAddressId,
    isCouponApplied,
    isInitialized,
    applyCoupon,
  ]);

  // Display values - use coupon data if available, otherwise use cart data
  const displayData = couponData ||
    cartData || {
      total_amount_without_tax: 0,
      total_tax: 0,
      total_before_discount: 0,
      total_discount: 0,
      cart_total: 0,
      total_coupon_discount: 0,
      delivery_amount: 0,
      delivery_tax: 0,
      final_total: 0,
      item_count: 0,
    };

  // Show loading state
  if (isCartLoading) {
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
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-logo-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (cartError) {
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
          <div className="text-center text-red-500">
            {t("orderSummary.cartError", "Failed to load cart data")}
          </div>
        </div>
      </div>
    );
  }

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
                  ? t("orderSummary.applying", {
                      defaultValue:
                        i18n.language === "ar"
                          ? "جاري التطبيق..."
                          : "Applying...",
                    })
                  : isCouponApplied
                  ? t("orderSummary.remove", {
                      defaultValue: i18n.language === "ar" ? "حذف" : "Remove",
                    })
                  : t("orderSummary.apply", {
                      defaultValue: i18n.language === "ar" ? "تطبيق" : "Apply",
                    })}
              </Button>
            </div>

            {/* Error and success messages */}
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

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          {/* 1. Total Amount Without Tax (الإجمالي بدون الضريبة) */}
          {displayData.total_amount_without_tax > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {t("orderSummary.totalAmountWithoutTax", "Total Without Tax")}
              </span>
              <span className="font-medium">
                {isRTL
                  ? `${displayData.total_amount_without_tax.toFixed(2)} ر.س`
                  : `${displayData.total_amount_without_tax.toFixed(2)} SAR`}
              </span>
            </div>
          )}

          {/* 2. Total Tax (الضريبة) */}
          {displayData.total_tax > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {t("orderSummary.totalTax", "Tax")}
              </span>
              <span className="font-medium">
                {isRTL
                  ? `${displayData.total_tax.toFixed(2)} ر.س`
                  : `${displayData.total_tax.toFixed(2)} SAR`}
              </span>
            </div>
          )}

          {/* 3. Total Before Discount (الإجمالي شامل ضريبة القيمة المضافة) */}
          {displayData.total_before_discount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {t("orderSummary.totalBeforeDiscount", "Total Including VAT")}
              </span>
              <span className="font-medium">
                {isRTL
                  ? `${displayData.total_before_discount.toFixed(2)} ر.س`
                  : `${displayData.total_before_discount.toFixed(2)} SAR`}
              </span>
            </div>
          )}

          {/* 4. Total Discount (إجمالي الخصم) */}
          {displayData.total_discount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {t("orderSummary.totalDiscount", "Total Discount")}
              </span>
              <span className="font-medium text-red-600">
                {isRTL
                  ? `-${displayData.total_discount.toFixed(2)} ر.س`
                  : `-${displayData.total_discount.toFixed(2)} SAR`}
              </span>
            </div>
          )}

          {/* 5. Cart Total (الإجمالي شامل الخصم) */}
          <div className="flex justify-between">
            <span className="text-neutral-600 font-semibold">
              {t("orderSummary.cartTotal", "Cart Total")}
            </span>
            <span className="font-semibold">
              {isRTL
                ? `${displayData.cart_total.toFixed(2)} ر.س`
                : `${displayData.cart_total.toFixed(2)} SAR`}
            </span>
          </div>

          {/* 6. Total Coupon Discount (خصم الكوبون) */}
          {displayData.total_coupon_discount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-600">
                {t("orderSummary.couponDiscount", "Coupon Discount")}
              </span>
              <span className="font-medium text-logo-gold">
                {isRTL
                  ? `-${displayData.total_coupon_discount.toFixed(2)} ر.س`
                  : `-${displayData.total_coupon_discount.toFixed(2)} SAR`}
              </span>
            </div>
          )}

          {/* Show applied coupon info */}
          {isCouponApplied &&
            couponData &&
            displayData.total_coupon_discount > 0 && (
              <div className="flex justify-between text-sm text-logo-gold bg-logo-gold/10 p-2 rounded">
                <span>
                  {t("orderSummary.couponApplied", "Coupon Applied")}:{" "}
                  {couponData.coupon.code}
                </span>
                <span className="font-medium">
                  {couponData.coupon.type === "percentage"
                    ? `${couponData.coupon.value}% ${t(
                        "orderSummary.off",
                        "off"
                      )}`
                    : isRTL
                    ? `${couponData.coupon.value} ر.س ${t(
                        "orderSummary.off",
                        "off"
                      )}`
                    : `${couponData.coupon.value} SAR ${t(
                        "orderSummary.off",
                        "off"
                      )}`}
                </span>
              </div>
            )}

          {/* 7. Total Delivery (مبلغ التوصيل شامل الضريبة) */}
          {(displayData.delivery_amount > 0 ||
            displayData.delivery_tax > 0) && (
            <div className="flex justify-between">
              <span className="text-neutral-600 font-semibold">
                {isRTL
                  ? "مبلغ التوصيل (شامل الضريبة)"
                  : "Total Delivery (incl. Tax)"}
              </span>
              <span className="font-semibold">
                {isRTL
                  ? `${displayData.delivery_amount.toFixed(2)} ر.س`
                  : `${displayData.delivery_amount.toFixed(2)} SAR`}
              </span>
            </div>
          )}

          {/* 7.1. Delivery Amount Before Tax (الشحن قبل الضريبة) */}
          {displayData.delivery_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">
                {isRTL ? "الشحن (قبل الضريبة)" : "Shipping (before tax)"}
              </span>
              <span className="text-gray-500 text-xs">
                {isRTL
                  ? `${
                      displayData.delivery_amount - displayData.delivery_tax
                    } ر.س`
                  : `${
                      displayData.delivery_amount - displayData.delivery_tax
                    } SAR`}
              </span>
            </div>
          )}

          {/* 7.2. Delivery Tax (ضريبة الشحن) */}
          {displayData.delivery_tax > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">
                {isRTL ? "ضريبة الشحن" : "Delivery Tax"}
              </span>
              <span className="text-gray-500 text-xs">
                {isRTL
                  ? `${displayData.delivery_tax.toFixed(2)} ر.س`
                  : `${displayData.delivery_tax.toFixed(2)} SAR`}
              </span>
            </div>
          )}
        </div>

        {/* 9. Final Total (الإجمالي النهائي) */}
        <div className="border-t border-logo-gold/30 mt-4 pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span className="text-logo-black">
              {t("orderSummary.finalTotal", "Final Total")}
            </span>
            <span className="text-logo-gold">
              {isRTL
                ? `${displayData.final_total.toFixed(2)} ر.س`
                : `${displayData.final_total.toFixed(2)} SAR`}
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
