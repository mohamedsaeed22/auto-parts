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
import OrderPdfViewer from "@/components/orders/OrderPdfViewer";

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
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
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
      if (result && result.data && result.data.order) {
        // Clear coupon from localStorage on successful order
        try {
          localStorage.removeItem("auto_parts_coupon_code");
        } catch {
          // Ignore localStorage errors
        }

        onPlaceOrder(result.data.order);
      } else {
        showError(
          t("orderReview.orderError", {
            defaultValue: "Failed to create order. Please try again.",
          })
        );
        return;
      }
    } catch {
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
        <div className="bg-gradient-to-br from-logo-gold/5 to-logo-gold/10 rounded-xl p-5 border border-logo-gold/20">
          <h3 className="font-semibold text-logo-black mb-4 flex items-center">
            <div className="p-2 bg-logo-gold/20 rounded-lg mx-2">
              <ShoppingBag className="w-4 h-4 text-logo-gold" />
            </div>
            {t("orderReview.products")} ({totalItems})
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 bg-white/60 rounded-lg p-3 border border-logo-gold/10"
              >
                <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-logo-black leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    {t("orderReview.quantity")}: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-logo-black">
                    {(item.price * item.quantity).toFixed(2)} {t("currency")}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {item.price.toFixed(2)} {t("currency")}{" "}
                    {isRTL ? "لكل قطعه" : "each piece"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gradient-to-br from-logo-gold/5 to-logo-gold/10 rounded-xl p-5 border border-logo-gold/20">
          <h3 className="font-semibold text-logo-black mb-4 flex items-center">
            <div className="p-2 bg-logo-gold/20 rounded-lg mx-2">
              <MapPin className="w-4 h-4 text-logo-gold" />
            </div>
            {t("orderReview.shippingAddress")}
          </h3>
          {selectedAddress ? (
            <div className="bg-white/60 rounded-lg p-4 border border-logo-gold/10">
              <div className="text-sm text-neutral-700 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-logo-black text-base">
                    {selectedAddress.name}
                  </p>
                  <span className="px-2 py-1 bg-logo-gold/20 text-logo-gold text-xs rounded-full">
                    {selectedAddress.address_type === "home"
                      ? t("address.home", { defaultValue: "Home" })
                      : selectedAddress.address_type === "office"
                      ? t("address.office", { defaultValue: "Office" })
                      : t("address.other", { defaultValue: "Other" })}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-neutral-700">
                    {selectedAddress.detailed_address}
                  </p>
                  <p className="text-neutral-700">{selectedAddress.city}</p>
                  <p dir="ltr" className="text-neutral-700 font-medium">
                    {selectedAddress.phone}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                {t("shipping.selectAddress")}
              </p>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-gradient-to-br from-logo-gold/5 to-logo-gold/10 rounded-xl p-5 border border-logo-gold/20">
          <h3 className="font-semibold text-logo-black mb-4 flex items-center">
            <div className="p-2 bg-logo-gold/20 rounded-lg mx-2">
              <CreditCard className="w-4 h-4 text-logo-gold" />
            </div>
            {t("orderReview.paymentMethod")}
          </h3>
          <div className="bg-white/60 rounded-lg p-4 border border-logo-gold/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-logo-gold/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-logo-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-logo-black">
                  {paymentMethod === "credit_card"
                    ? t("orderReview.creditCard")
                    : paymentMethod === "cash"
                    ? t("orderReview.cashOnDelivery")
                    : paymentMethod === "paypal"
                    ? "PayPal"
                    : paymentMethod === "stripe"
                    ? "Stripe"
                    : paymentMethod === "bank_transfer"
                    ? t("payment.bankTransfer", {
                        defaultValue: "Bank Transfer",
                      })
                    : "-"}
                </p>
                <p className="text-xs text-neutral-500">
                  {paymentMethod === "credit_card"
                    ? t("payment.creditCardDesc", {
                        defaultValue: "Visa, MasterCard, American Express",
                      })
                    : paymentMethod === "cash"
                    ? t("payment.cashOnDeliveryDesc", {
                        defaultValue: "Pay cash when order arrives",
                      })
                    : isRTL
                    ? "طريقة دفع آمنة"
                    : "Secure payment method"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div className="bg-gradient-to-br from-logo-gold/5 to-logo-gold/10 rounded-xl p-5 border border-logo-gold/20">
          <h3 className="font-semibold text-logo-black mb-4 flex items-center">
            <div className="p-2 bg-logo-gold/20 rounded-lg mx-2">
              <FileText className="w-4 h-4 text-logo-gold" />
            </div>
            {t("orderReview.notes")}
          </h3>
          <div className="space-y-3">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("orderReview.notesPlaceholder")}
              className="min-h-[100px] resize-none border-logo-gold/30 focus:border-logo-gold focus:ring-2 focus:ring-logo-gold/20 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              maxLength={500}
              dir={isRTL ? "rtl" : "ltr"}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-500">
                {t("orderReview.characters")}: {notes.length}/500
              </p>
              {notes.length > 400 && (
                <p className="text-xs text-amber-600 font-medium">
                  {isRTL ? "اقتربت من الحد الأقصى" : "Approaching limit"}
                </p>
              )}
            </div>
            {notes.length > 0 && (
              <div className="bg-white/60 rounded-lg p-3 border border-logo-gold/20">
                <p className="text-xs text-neutral-600 mb-1">
                  {isRTL ? "معاينة الملاحظة:" : "Note preview:"}
                </p>
                <p className="text-sm text-logo-black leading-relaxed">
                  {notes}
                </p>
              </div>
            )}
          </div>
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

        {/* Preview Order PDF Button */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-logo-black">
                  {isRTL ? "معاينة الفاتورة" : "Preview Invoice"}
                </h4>
                <p className="text-sm text-gray-600">
                  {isRTL
                    ? "اضغط لمعاينة وتحميل الفاتورة بصيغة PDF"
                    : "Click to preview and download your invoice as PDF"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsPdfViewerOpen(true)}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
            >
              <FileText className="w-4 h-4 mx-2" />
              {isRTL ? "عرض الفاتورة" : "View Invoice"}
            </Button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 py-4 flex items-center justify-center border-logo-gold text-logo-black hover:bg-logo-gold/10 hover:text-logo-black transition-all duration-200 font-medium"
          >
            {isRTL ? (
              <>
                <ArrowRight className="w-4 h-4 mx-2" />
                {t("orderReview.back")}
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
            className="flex-1 bg-gradient-to-r from-logo-gold to-logo-gold/90 hover:from-logo-gold/90 hover:to-logo-gold text-white py-4 flex items-center justify-center disabled:from-logo-gold/50 disabled:to-logo-gold/50 disabled:text-white/70 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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

      {/* PDF Viewer Dialog */}
      <OrderPdfViewer
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
      />
    </div>
  );
};

export default OrderReviewStep;
