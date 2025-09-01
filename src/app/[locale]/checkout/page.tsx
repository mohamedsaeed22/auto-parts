"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ProtectedPageGuard } from "@/components/auth/AuthGuard";
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
  const {
    items,
    total,
    totalItems,
    clearCart,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(0);

  const savedAddresses = [
    {
      id: 0,
      label: "المنزل",
      name: "أحمد محمد",
      address: "شارع الملك فهد، حي النزهة",
      city: "الرياض",
      phone: "+966 50 123 4567",
      isDefault: true,
    },
    {
      id: 1,
      label: "العمل",
      name: "أحمد محمد",
      address: "مركز الملك عبدالله المالي، طريق الملك فهد",
      city: "الرياض",
      phone: "+966 11 234 5678",
      isDefault: false,
    },
  ];

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

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
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
      } else {
        setCouponError("Invalid coupon code");
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
      return <OrderComplete onBackToShopping={handleBackToShopping} />;
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
                  {currentStep === 1 && (
                    <CartReviewStep
                      items={items}
                      totalItems={totalItems}
                      onNext={handleNext}
                      onUpdateQuantity={(id: string, quantity: number) =>
                        updateQuantity(Number(id), quantity)
                      }
                      onRemoveItem={(id: string) => removeFromCart(Number(id))}
                    />
                  )}

                  {currentStep === 2 && (
                    <ShippingStep
                      savedAddresses={savedAddresses}
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
                      selectedAddress={savedAddresses[selectedAddress]}
                      paymentMethod={paymentMethod}
                      isProcessing={isProcessing}
                      onPlaceOrder={handlePlaceOrder}
                      onBack={handleBack}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <OrderSummary
                currentStep={currentStep}
                total={total}
                couponCode={couponCode}
                couponDiscount={couponDiscount}
                isApplyingCoupon={isApplyingCoupon}
                couponError={couponError}
                isProcessing={isProcessing}
                onCouponCodeChange={handleCouponCodeChange}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <ProtectedPageGuard>{renderContent()}</ProtectedPageGuard>;
};

export default CheckoutPage;
