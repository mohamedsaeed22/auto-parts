import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Truck,
} from "lucide-react";
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "shipped":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-logo-gold/5 via-white to-logo-gold/10 py-8 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-logo-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-logo-black mb-3">
            {t("orderComplete.title")}
          </h1>
          <p className="text-lg text-neutral-600 mb-2">
            {t("orderComplete.thankYou", {
              defaultValue: "Thank you for your order!",
            })}
          </p>
          {order && (
            <>
              <div className="inline-flex items-center gap-2 bg-logo-gold/10 border border-logo-gold/30 rounded-full px-6 py-3 mb-4">
                <span className="text-neutral-700 font-medium">
                  {t("orderComplete.orderNumber")}:
                </span>
                <span className="text-logo-black font-bold text-lg">
                  {order.order_number}
                </span>
              </div>
              <p className="text-neutral-600 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                {t("orderComplete.deliveryTime")}
              </p>
            </>
          )}
        </motion.div>

        {order && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Details - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Order Status */}
              <div className="bg-white rounded-2xl shadow-lg border border-logo-gold/20 p-6">
                <h2 className="text-xl font-semibold text-logo-black mb-4 flex items-center gap-3">
                  <Package className="w-5 h-5 text-logo-gold" />
                  {t("orderComplete.orderStatus", {
                    defaultValue: "Order Status",
                  })}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div
                    className={`px-4 py-3 rounded-xl border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    <div className="text-sm opacity-75 mb-1">
                      {t("orders.status", { defaultValue: "Order Status" })}
                    </div>
                    <div className="font-semibold capitalize">
                      {t(`orderStatus.${order.status}`, {
                        defaultValue: order.status,
                      })}
                    </div>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl border ${getPaymentStatusColor(
                      order.payment_status
                    )}`}
                  >
                    <div className="text-sm opacity-75 mb-1">
                      {t("orderComplete.paymentStatus", {
                        defaultValue: "Payment Status",
                      })}
                    </div>
                    <div className="font-semibold capitalize">
                      {t(`paymentStatus.${order.payment_status}`, {
                        defaultValue: order.payment_status,
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="bg-white rounded-2xl shadow-lg border border-logo-gold/20 p-6">
                <h2 className="text-xl font-semibold text-logo-black mb-4 flex items-center gap-3">
                  <Package className="w-5 h-5 text-logo-gold" />
                  {t("orderReview.products")}
                  <span className="bg-logo-gold/20 text-logo-black px-3 py-1 rounded-full text-sm font-medium">
                    {order.total_items}{" "}
                    {t("orderComplete.items", { defaultValue: "items" })}
                  </span>
                </h2>
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4 p-4 bg-logo-gold/5 rounded-xl border border-logo-gold/10"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.product_image ? (
                          <img
                            src={
                              product.product_image.startsWith("http")
                                ? product.product_image
                                : `https://brave.iseek.name/storage/${product.product_image}`
                            }
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-logo-black mb-1 line-clamp-2">
                          {product.product_name}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          {t("orderComplete.sku", { defaultValue: "SKU" })}:{" "}
                          {product.product_sku}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-neutral-600">
                            {t("orderComplete.quantity", {
                              defaultValue: "Qty",
                            })}
                            : {product.quantity}
                          </div>
                          <div className="text-right">
                            {product.discount_amount > 0 && (
                              <div className="text-sm text-gray-400 line-through">
                                {product.price.toFixed(2)}{" "}
                                {order.pricing.currency}
                              </div>
                            )}
                            <div className="font-semibold text-logo-black">
                              {product.final_unit_price.toFixed(2)}{" "}
                              {order.pricing.currency}
                            </div>
                          </div>
                        </div>
                        {product.discount_amount > 0 && (
                          <div className="mt-2 inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                            {t("orderComplete.saved", {
                              defaultValue: "Saved",
                            })}{" "}
                            {product.discount_amount.toFixed(2)}{" "}
                            {order.pricing.currency}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-lg border border-logo-gold/20 p-6">
                <h2 className="text-xl font-semibold text-logo-black mb-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-logo-gold" />
                  {t("orderReview.shippingAddress")}
                </h2>
                <div className="bg-logo-gold/5 rounded-xl p-4 border border-logo-gold/10">
                  <div className="space-y-2">
                    <p className="font-semibold text-logo-black text-lg">
                      {order.address.first_name} {order.address.last_name}
                    </p>
                    <p
                      className="text-neutral-700 flex items-center gap-2"
                      dir="ltr"
                    >
                      <span className="w-2 h-2 bg-logo-gold rounded-full"></span>
                      {order.address.phone}
                    </p>
                    <p className="text-neutral-700 flex items-start gap-2">
                      <span className="w-2 h-2 bg-logo-gold rounded-full mt-2"></span>
                      <span>
                        {order.address.address}
                        {order.address.apartment &&
                          `, ${order.address.apartment}`}
                      </span>
                    </p>
                    <p className="text-neutral-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-logo-gold rounded-full"></span>
                      {order.address.city}
                      {order.address.state && `, ${order.address.state}`}
                      {order.address.zip_code && ` - ${order.address.zip_code}`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Payment & Delivery */}
              <div className="bg-white rounded-2xl shadow-lg border border-logo-gold/20 p-6">
                <h2 className="text-xl font-semibold text-logo-black mb-4">
                  {t("orderComplete.paymentDelivery", {
                    defaultValue: "Payment & Delivery",
                  })}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-logo-gold/5 rounded-xl">
                    <CreditCard className="w-5 h-5 text-logo-gold" />
                    <div>
                      <div className="text-sm text-neutral-600">
                        {t("orderReview.paymentMethod")}
                      </div>
                      <div className="font-semibold text-logo-black capitalize">
                        {t(`paymentMethod.${order.payment_method}`, {
                          defaultValue: order.payment_method,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-logo-gold/5 rounded-xl">
                    <Truck className="w-5 h-5 text-logo-gold" />
                    <div>
                      <div className="text-sm text-neutral-600">
                        {t("orderComplete.deliveryMethod", {
                          defaultValue: "Delivery",
                        })}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {t("orderComplete.standardDelivery", {
                          defaultValue: "Standard Delivery",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-logo-gold/20 p-6">
                <h2 className="text-xl font-semibold text-logo-black mb-4">
                  {t("orderComplete.summary", {
                    defaultValue: "Order Summary",
                  })}
                </h2>
                <div className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">
                        {t("orderSummary.subtotal")}
                      </span>
                      <span className="font-medium text-logo-black">
                        {order.pricing.subtotal.toFixed(2)}{" "}
                        {order.pricing.currency}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">
                        {t("orderSummary.shipping")}
                      </span>
                      <span className="font-medium text-logo-black">
                        {order.pricing.shipping_cost.toFixed(2)}{" "}
                        {order.pricing.currency}
                      </span>
                    </div>

                    {order.pricing.tax_amount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">
                          {t("orderSummary.tax")}
                        </span>
                        <span className="font-medium text-logo-black">
                          {order.pricing.tax_amount.toFixed(2)}{" "}
                          {order.pricing.currency}
                        </span>
                      </div>
                    )}

                    {order.pricing.discount_amount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-600">
                          {t("orderSummary.discount")}
                        </span>
                        <span className="font-medium text-green-600">
                          -{order.pricing.discount_amount.toFixed(2)}{" "}
                          {order.pricing.currency}
                        </span>
                      </div>
                    )}

                    {order.coupon.code && (
                      <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded-lg">
                        <span className="text-green-700">
                          {t("orderComplete.coupon", {
                            defaultValue: "Coupon",
                          })}
                          : {order.coupon.code}
                        </span>
                        <span className="font-medium text-green-700">
                          -{order.coupon.discount.toFixed(2)}{" "}
                          {order.pricing.currency}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-logo-gold/20 pt-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold text-logo-black">
                        {t("orderSummary.total")}
                      </span>
                      <span className="font-bold text-2xl text-logo-gold">
                        {order.pricing.total.toFixed(2)}{" "}
                        {order.pricing.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={onBackToShopping}
                  className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {t("orderComplete.backToShopping")}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-2 border-logo-gold text-logo-gold hover:bg-logo-gold/5 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
                >
                  {t("orderComplete.trackOrder", {
                    defaultValue: "Track Order",
                  })}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderComplete;
