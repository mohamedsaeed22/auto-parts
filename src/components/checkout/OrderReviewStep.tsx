import React from "react";
import {
  Package,
  ShoppingBag,
  MapPin,
  CreditCard,
  Shield,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Address {
  id: number;
  name: string;
  city: string;
  phone: string;
  detailed_address: string;
  is_default: boolean;
}

interface OrderReviewStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  totalItems: number;
  selectedAddress: Address;
  paymentMethod: string;
  isProcessing: boolean;
  onPlaceOrder: () => void;
  onBack: () => void;
}

const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  items,
  totalItems,
  selectedAddress,
  paymentMethod,
  isProcessing,
  onPlaceOrder,
  onBack,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";

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

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 py-3 flex items-center border-logo-gold text-logo-black hover:bg-logo-gold/10"
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
            onClick={onPlaceOrder}
            disabled={isProcessing}
            className="flex-1 bg-logo-gold hover:bg-logo-gold/90 text-logo-black py-3 flex items-center justify-center disabled:bg-logo-gold/50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mx-2 text-logo-gold" />
                {t("orderReview.processing")}
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mx-2 text-logo-black" />
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
