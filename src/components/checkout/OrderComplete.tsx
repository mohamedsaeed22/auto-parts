import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import type { Order } from "@/services/api/ordersApi";

interface OrderCompleteProps {
  onBackToShopping: () => void;
  order: Order | null;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({
  onBackToShopping,
  order,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";

  return (
    <div
      className="min-h-screen bg-logo-gold/5 flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-logo-gold/30 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-logo-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-logo-black mb-2 text-center">
          {t("orderComplete.title")}
        </h2>
        {order && (
          <>
            <p className="text-neutral-700 mb-1 text-center font-medium">
              {t("orderComplete.orderNumber")}:
              <span className="mx-2 text-logo-black">{order.order_number}</span>
            </p>
            <p className="text-neutral-600 text-sm mb-4 text-center">
              {t("orderComplete.deliveryTime")}
            </p>

            <div className="text-left space-y-4 mb-6">
              <div className="bg-logo-gold/5 rounded-xl p-4 border border-logo-gold/20">
                <h3 className="text-sm font-semibold text-logo-black mb-2">
                  {t("orderComplete.summary", {
                    defaultValue: "Order Summary",
                  })}
                </h3>
                <div className="text-sm text-neutral-700 space-y-1">
                  <div className="flex justify-between">
                    <span>{t("orderSummary.subtotal")}</span>
                    <span>
                      {order.pricing.subtotal.toFixed(2)}{" "}
                      {order.pricing.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("orderSummary.shipping")}</span>
                    <span>
                      {order.pricing.shipping_cost.toFixed(2)}{" "}
                      {order.pricing.currency}
                    </span>
                  </div>
                  {order.pricing.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span>{t("orderSummary.discount")}</span>
                      <span>
                        -{order.pricing.discount_amount.toFixed(2)}{" "}
                        {order.pricing.currency}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-2 border-t border-logo-gold/20 mt-2">
                    <span>{t("orderSummary.total")}</span>
                    <span className="text-logo-gold">
                      {order.pricing.grand_total.toFixed(2)}{" "}
                      {order.pricing.currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-logo-gold/5 rounded-xl p-4 border border-logo-gold/20">
                <h3 className="text-sm font-semibold text-logo-black mb-2">
                  {t("orderReview.shippingAddress")}
                </h3>
                <div className="text-sm text-neutral-700 space-y-1">
                  <p className="font-medium text-logo-black">
                    {order.address.first_name} {order.address.last_name}
                  </p>
                  <p dir="ltr">{order.address.phone}</p>
                  <p>{order.address.address}</p>
                  <p>
                    {order.address.city}
                    {order.address.state ? `, ${order.address.state}` : ""}
                    {order.address.zip_code
                      ? `, ${order.address.zip_code}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="bg-logo-gold/5 rounded-xl p-4 border border-logo-gold/20">
                <h3 className="text-sm font-semibold text-logo-black mb-2">
                  {t("orderReview.products")}
                  <span className="mx-2 text-neutral-600">
                    ({order.total_items})
                  </span>
                </h3>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {order.products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-neutral-700 truncate mr-2">
                        {p.product_name}
                      </span>
                      <span className="text-neutral-800">
                        {p.quantity} × {p.final_unit_price.toFixed(2)}{" "}
                        {order.pricing.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-logo-gold/5 rounded-xl p-3 text-sm">
                  <div className="text-neutral-500">
                    {t("orderReview.paymentMethod")}
                  </div>
                  <div className="font-medium text-logo-black capitalize">
                    {order.payment_method}
                  </div>
                </div>
                <div className="bg-logo-gold/5 rounded-xl p-3 text-sm">
                  <div className="text-neutral-500">
                    {t("orders.status", { defaultValue: "Status" })}
                  </div>
                  <div className="font-medium text-logo-black capitalize">
                    {order.status}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="space-y-3">
          <Button
            onClick={onBackToShopping}
            className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white py-3 rounded-full font-medium"
          >
            {t("orderComplete.backToShopping")}
          </Button>
         
        </div>
      </motion.div>
    </div>
  );
};

export default OrderComplete;
