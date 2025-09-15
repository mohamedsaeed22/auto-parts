import React, { useState } from "react";
import {
  Package,
  ShoppingBag,
  MapPin,
  CreditCard,
  Shield,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useCreateOrderMutation } from "@/services/api/ordersApi";
import { Address } from "@/services/api/types";
import { showSuccess, showError } from "@/lib/toast";

interface OrderReviewStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  totalItems: number;
  selectedAddress: Address | null;
  paymentMethod: string;
  isProcessing: boolean;
  onPlaceOrder: (order: import("@/services/api/ordersApi").Order) => void;
  onBack: () => void;
  couponCode?: string;
}

const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  items,
  totalItems,
  selectedAddress,
  paymentMethod,
  isProcessing,
  onPlaceOrder,
  onBack,
  couponCode,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const [notes, setNotes] = useState("");
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();

  const handlePlaceOrder = async () => {
    try {
      // Validate required data
      if (selectedAddress?.id === undefined || selectedAddress?.id === null) {
        showError(
          t("orderReview.selectAddressFirst", {
            defaultValue: "Please select a shipping address first",
          })
        );
        return;
      }

      if (!paymentMethod) {
        showError(
          t("orderReview.selectPaymentFirst", {
            defaultValue: "Please select a payment method first",
          })
        );
        return;
      }

      // Create order using the API
      const result = await createOrder({
        payment_method: paymentMethod,
        address_id: selectedAddress.id,
        coupon_code: couponCode || "",
        notes: notes || "",
      }).unwrap();

      showSuccess(
        t("orderReview.orderCreated", {
          defaultValue: "Order created successfully!",
        })
      );

      // Call the original onPlaceOrder callback with created order
      // result is ApiResponse<{ order: Order }>
      if (result && (result as any).data && (result as any).data.order) {
        onPlaceOrder((result as any).data.order);
      } else {
        showError(
          t("orderReview.orderError", {
            defaultValue: "Failed to create order. Please try again.",
          })
        );
        return;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showError(
        t("orderReview.orderError", {
          defaultValue: "Failed to create order. Please try again.",
        })
      );
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-6 border-b border-logo-gold/30">
        <h2 className="text-2xl font-bold text-logo-black flex items-center">
          <Package className="w-6 h-6 mx-3 text-logo-gold" />
          {t("orderReview.title")}
        </h2>
        <p className="text-neutral-600 mt-1">{t("orderReview.description")}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Order Items Summary */}
        <div className="bg-logo-gold/5 rounded-xl p-4">
          <h3 className="font-semibold text-logo-black mb-3 flex items-center">
            <ShoppingBag className="w-4 h-4 mx-2 text-logo-gold" />
            {t("orderReview.products")} ({totalItems})
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-logo-black">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {t("orderReview.quantity")}: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-logo-black">
                  {(item.price * item.quantity).toFixed(2)} {t("currency")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-logo-gold/5 rounded-xl p-4">
          <h3 className="font-semibold text-logo-black mb-3 flex items-center">
            <MapPin className="w-4 h-4 mx-2 text-logo-gold" />
            {t("orderReview.shippingAddress")}
          </h3>
          {selectedAddress ? (
            <div className="text-sm text-neutral-700 space-y-1">
              <p className="font-medium text-logo-black">
                {selectedAddress.name}
              </p>
              <p>{selectedAddress.detailed_address}</p>
              <p>{selectedAddress.city}</p>
              <p dir="ltr">{selectedAddress.phone}</p>
              <p className="text-xs text-neutral-500">
                {selectedAddress.address_type === "home"
                  ? t("address.home", { defaultValue: "Home" })
                  : selectedAddress.address_type === "office"
                  ? t("address.office", { defaultValue: "Office" })
                  : t("address.other", { defaultValue: "Other" })}
              </p>
            </div>
          ) : (
            <div className="text-sm text-neutral-600">
              {t("shipping.selectAddress")}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-logo-gold/5 rounded-xl p-4">
          <h3 className="font-semibold text-logo-black mb-3 flex items-center">
            <CreditCard className="w-4 h-4 mx-2 text-logo-gold" />
            {t("orderReview.paymentMethod")}
          </h3>
          <p className="text-sm text-neutral-700">
            {paymentMethod === "credit_card"
              ? t("orderReview.creditCard")
              : paymentMethod === "cash"
              ? t("orderReview.cashOnDelivery")
              : paymentMethod === "paypal"
              ? "PayPal"
              : paymentMethod === "stripe"
              ? "Stripe"
              : paymentMethod === "bank_transfer"
              ? t("payment.bankTransfer", { defaultValue: "Bank Transfer" })
              : "-"}
          </p>
        </div>

        {/* Order Notes */}
        <div className="bg-logo-gold/5 rounded-xl p-4">
          <h3 className="font-semibold text-logo-black mb-3 flex items-center">
            <FileText className="w-4 h-4 mx-2 text-logo-gold" />
            {t("orderReview.notes", { defaultValue: "Order Notes" })}
          </h3>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("orderReview.notesPlaceholder", {
              defaultValue:
                "Add any special instructions or notes for your order (optional)",
            })}
            className="min-h-[80px] resize-none border-logo-gold/30 focus:border-logo-gold"
            maxLength={500}
          />
          <p className="text-xs text-neutral-500 mt-1">
            {notes.length}/500{" "}
            {t("orderReview.characters", { defaultValue: "characters" })}
          </p>
        </div>

        {/* Address Warning */}
        {(selectedAddress?.id === undefined ||
          selectedAddress?.id === null) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">
              {t("orderReview.selectAddressWarning", {
                defaultValue: "Please select a shipping address to continue",
              })}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 py-3 flex items-center border-logo-gold text-logo-black hover:bg-logo-gold/10 hover:text-logo-black"
          >
            {isRTL ? (
              <>
                {t("orderReview.back")}
                <ArrowRight className="w-4 h-4 mx-2" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mx-2" />
                {t("orderReview.back")}
              </>
            )}
          </Button>
          <Button
            onClick={handlePlaceOrder}
            disabled={
              isProcessing ||
              isCreatingOrder ||
              selectedAddress?.id === undefined ||
              selectedAddress?.id === null
            }
            className="flex-1 bg-logo-gold hover:bg-logo-gold/90 text-white py-3 flex items-center justify-center disabled:bg-logo-gold/50 disabled:text-white/70"
          >
            {isProcessing || isCreatingOrder ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mx-2 text-white" />
                {t("orderReview.processing")}
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mx-2 text-white" />
                {t("orderReview.confirmOrder")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewStep;
