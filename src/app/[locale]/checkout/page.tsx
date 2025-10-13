"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEnhancedCart } from "@/hooks/useEnhancedCart";
import { AuthOnlyGuard } from "@/components/auth/AuthGuard";
import { useGetAddressesQuery } from "@/services/api/addressesApi";
import { useAuthContext } from "@/contexts/auth-context";
import {
  CheckoutProgress,
  CartReviewStep,
  ShippingStep,
  PaymentStep,
  OrderReviewStep,
  OrderSummary,
  EmptyCart,
  OrderComplete,
} from "@/components/checkout";

const CheckoutPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const {
    items,
    total,
    totalItems,
    clearCart,
    updateQuantity,
    removeFromCart,
  } = useEnhancedCart();
  // Only fetch addresses if user is authenticated to prevent 401 errors
  const { data: addressesResp } = useGetAddressesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<
    import("@/services/api/ordersApi").Order | null
  >(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/");
    }
  };

  const handlePlaceOrder = async (
    order?: import("@/services/api/ordersApi").Order
  ) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setIsProcessing(false);
    if (order) {
      setCreatedOrder(order);
    }
    setOrderComplete(true);
    clearCart();
    // Clear coupon from localStorage on successful order
    if (typeof window !== "undefined") {
      localStorage.removeItem("auto_parts_coupon_code");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");

    setTimeout(() => {
      const validCoupons = {
        SAVE10: 10,
        WELCOME20: 20,
        FREESHIP: 15,
      };

      if (validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons]) {
        setCouponDiscount(
          validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons]
        );
        setCouponError("");
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError("");
  };

  const handleCouponCodeChange = (code: string) => {
    setCouponCode(code);
  };

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddress(addressId);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleBackToShopping = () => {
    router.push("/");
  };

  const renderContent = () => {
    // Early returns for special states
    if (items.length === 0 && !orderComplete) {
      return <EmptyCart onBackToShopping={handleBackToShopping} />;
    }

    if (orderComplete) {
      return (
        <OrderComplete
          onBackToShopping={handleBackToShopping}
          order={createdOrder}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CheckoutProgress currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200"
                >
                  {currentStep === 1 && <CartReviewStep onNext={handleNext} />}

                  {currentStep === 2 && (
                    <ShippingStep
                      savedAddresses={addressesResp?.data?.addresses || []}
                      selectedAddress={selectedAddress}
                      onAddressSelect={handleAddressSelect}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}

                  {currentStep === 3 && (
                    <PaymentStep
                      paymentMethod={paymentMethod}
                      onPaymentMethodChange={handlePaymentMethodChange}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}

                  {currentStep === 4 && (
                    <OrderReviewStep
                      items={items}
                      totalItems={totalItems}
                      selectedAddress={
                        selectedAddress !== null
                          ? addressesResp?.data?.addresses?.find(
                              (addr) => addr.id === selectedAddress
                            ) || null
                          : null
                      }
                      paymentMethod={paymentMethod}
                      isProcessing={isProcessing}
                      onPlaceOrder={handlePlaceOrder}
                      onBack={handleBack}
                      couponCode={couponCode}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <OrderSummary
                currentStep={currentStep}
                couponCode={couponCode}
                isApplyingCoupon={isApplyingCoupon}
                couponError={couponError}
                onCouponCodeChange={handleCouponCodeChange}
                onApplyCoupon={handleApplyCoupon}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <AuthOnlyGuard>{renderContent()}</AuthOnlyGuard>;
};

export default CheckoutPage;
