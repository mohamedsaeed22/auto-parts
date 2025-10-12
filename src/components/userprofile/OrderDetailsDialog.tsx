"use client";

import {
  Percent,
  MapPin,
  User,
  Phone,
  Package,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import type { Order } from "@/services/api/ordersApi";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  isRTL?: boolean;
}

export default function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
  width = "max-w-5xl",
}: OrderDetailsDialogProps) {
  const { t, i18n } = useTranslation("userProfile");
  const currentLocale = i18n.language;
  const isCurrentRTL = currentLocale === "ar";

  // Use order data directly from props since it contains all details
  const orderDetails = order;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" };
      case "processing":
        return { icon: Package, color: "text-blue-600", bg: "bg-blue-50" };
      case "shipped":
        return { icon: Truck, color: "text-purple-600", bg: "bg-purple-50" };
      case "delivered":
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case "cancelled":
        return { icon: X, color: "text-red-600", bg: "bg-red-50" };
      case "paid":
        return {
          icon: CreditCard,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        };
      default:
        return { icon: Clock, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${width} max-h-[90vh] overflow-y-auto`}
        dir={isCurrentRTL ? "rtl" : "ltr"}
      >
        <DialogHeader className="border-b border-gray-200 pb-4 mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Package size={24} className="text-primary" />
            {t("orders.orderDetails")}
          </DialogTitle>
        </DialogHeader>

        {orderDetails && (
          <div className="space-y-4">
            {/* Order Header with Status - Modern Card */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Number */}
                <div>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {orderDetails.order_number}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <Clock size={14} />
                    {formatDate(orderDetails.created_at)}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const statusInfo = getStatusIcon(orderDetails.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <span
                        className={`${statusInfo.bg} ${statusInfo.color} px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm`}
                      >
                        <StatusIcon size={16} />
                        {t(
                          `orders.statuses.${orderDetails.status}`,
                          orderDetails.status
                        )}
                      </span>
                    );
                  })()}

                  <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm border border-blue-200">
                    <CreditCard size={16} />
                    {t(
                      `orders.paymentStatuses.${orderDetails.payment_status}`,
                      orderDetails.payment_status
                    )}
                  </span>

                  <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-300">
                    {t(
                      `orders.paymentMethods.${orderDetails.payment_method}`,
                      orderDetails.payment_method
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Layout for Address and Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Shipping Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  {t("orders.shippingAddress")}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("orders.customer", "Customer")}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {orderDetails.address.first_name}{" "}
                        {orderDetails.address.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("orders.phone", "Phone")}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {orderDetails.address.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {t("orders.address", "Address")}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {orderDetails.address.address}
                      </p>
                      {orderDetails.address.apartment && (
                        <p className="text-sm text-gray-600">
                          {t("orders.apartment")}{" "}
                          {orderDetails.address.apartment}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {orderDetails.address.city}
                        {orderDetails.address.state &&
                          `, ${orderDetails.address.state}`}
                        {orderDetails.address.country &&
                          `, ${orderDetails.address.country}`}
                        {orderDetails.address.zip_code &&
                          ` - ${orderDetails.address.zip_code}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-primary" />
                  {t("orders.orderSummary")}
                </h3>

                <div className="space-y-2.5">
                  {/* Subtotal breakdown */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {t("orders.subtotalWithoutTax", "Subtotal (excl. tax)")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.pricing.subtotal_without_tax ||
                        orderDetails.pricing.subtotal}{" "}
                      {isCurrentRTL ? "ر.س" : "SAR"}
                    </span>
                  </div>

                  {orderDetails.pricing.subtotal_tax &&
                    orderDetails.pricing.subtotal_tax > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {t("orders.subtotalTax", "Subtotal Tax")}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {orderDetails.pricing.subtotal_tax!}{" "}
                          {isCurrentRTL ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {t("orders.subtotal")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.pricing.subtotal}{" "}
                      {isCurrentRTL ? "ر.س" : "SAR"}
                    </span>
                  </div>

                  {orderDetails.pricing.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {t("orders.discount")}
                      </span>
                      <span className="font-semibold text-green-600">
                        -{orderDetails.pricing.discount_amount}{" "}
                        {isCurrentRTL ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  )}

                  {/* Shipping breakdown */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {t("orders.shippingWithoutTax", "Shipping (excl. tax)")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.pricing.shipping_cost_without_tax ||
                        orderDetails.pricing.shipping_cost}{" "}
                      {isCurrentRTL ? "ر.س" : "SAR"}
                    </span>
                  </div>

                  {orderDetails.pricing.shipping_cost_tax &&
                    orderDetails.pricing.shipping_cost_tax > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {t("orders.shippingTax", "Shipping Tax")}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {orderDetails.pricing.shipping_cost_tax!}{" "}
                          {isCurrentRTL ? "ر.س" : "SAR"}
                        </span>
                      </div>
                    )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {t("orders.shipping")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.pricing.shipping_cost}{" "}
                      {isCurrentRTL ? "ر.س" : "SAR"}
                    </span>
                  </div>

                  {orderDetails.pricing.tax_amount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{t("orders.tax")}</span>
                      <span className="font-semibold text-gray-900">
                        {orderDetails.pricing.tax_amount}{" "}
                        {isCurrentRTL ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        {t("orders.total")}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {orderDetails.pricing.total}{" "}
                        {isCurrentRTL ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coupon Badge */}
                {orderDetails.coupon?.code && (
                  <div className="mt-4 bg-green-50 border-2 border-green-300 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Percent size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-green-600 font-medium">
                            {t("orders.couponApplied", "Coupon Applied")}
                          </p>
                          <p className="text-sm font-bold text-green-700 font-mono">
                            {orderDetails.coupon.code}
                          </p>
                          {orderDetails.coupon.details && (
                            <div className="mt-1">
                              <p className="text-xs text-green-600">
                                {orderDetails.coupon.details.name}
                              </p>
                              <p className="text-xs text-green-500">
                                {orderDetails.coupon.details.type ===
                                "percentage"
                                  ? `${orderDetails.coupon.details.value}% OFF`
                                  : `${orderDetails.coupon.details.value} ${
                                      isCurrentRTL ? "ر.س" : "SAR"
                                    } OFF`}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-700">
                        -{orderDetails.coupon.discount}{" "}
                        {isCurrentRTL ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-primary" />
                {t("orders.products")} ({orderDetails.total_items}{" "}
                {t("orders.items", "Items")})
              </h3>

              <div className="space-y-3">
                {orderDetails.products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition-all bg-gray-50/50"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <Image
                          src={`https://brave.iseek.name/storage/${product.product_image}`}
                          alt={product.product_name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {product.product_name}
                        </h4>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500">
                              {t("orders.sku", "SKU")}:
                            </span>
                            <span className="font-mono text-gray-700 text-xs">
                              {product.product_sku}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500">
                              {t("orders.quantity", "Qty")}:
                            </span>
                            <span className="font-semibold text-gray-900">
                              × {product.quantity}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500">
                              {t("orders.unitPrice", "Unit Price")}:
                            </span>
                            <div className="flex items-center gap-2">
                              {product.price !== product.final_unit_price && (
                                <span className="text-sm text-gray-400 line-through">
                                  {product.price} {isCurrentRTL ? "ر.س" : "SAR"}
                                </span>
                              )}
                              <span className="font-semibold text-gray-900">
                                {product.final_unit_price}{" "}
                                {isCurrentRTL ? "ر.س" : "SAR"}
                              </span>
                            </div>
                          </div>

                          {product.discount_percentage > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-500">
                                {t("orders.discount")}:
                              </span>
                              <span className="font-semibold text-green-600">
                                {product.discount_percentage}% OFF
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Total */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("orders.lineTotal", "Line Total")}
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {product.line_total || product.total}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {isCurrentRTL ? "ر.س" : "SAR"}
                        </p>
                        {product.discount_amount > 0 && (
                          <p className="text-xs text-green-600 font-semibold mt-1">
                            {t("orders.saved", "Saved")}{" "}
                            {product.discount_amount}{" "}
                            {isCurrentRTL ? "ر.س" : "SAR"}
                          </p>
                        )}
                        {product.line_total &&
                          product.line_total !== product.total && (
                            <p className="text-xs text-gray-500 mt-1">
                              {t("orders.itemTotal", "Item Total")}:{" "}
                              {product.total}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            {(orderDetails.tracking_number ||
              orderDetails.notes ||
              orderDetails.can_be_cancelled ||
              orderDetails.can_be_refunded ||
              orderDetails.paid_at ||
              orderDetails.shipped_at ||
              orderDetails.delivered_at) && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-primary" />
                  {t("orders.additionalInfo", "Additional Information")}
                </h3>

                <div className="space-y-3">
                  {/* Order Timestamps */}
                  {(orderDetails.paid_at ||
                    orderDetails.shipped_at ||
                    orderDetails.delivered_at) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {orderDetails.paid_at && (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                          <CreditCard
                            size={16}
                            className="text-emerald-600 flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
                              {t("orders.paidAt", "Paid At")}
                            </p>
                            <p className="text-sm font-semibold text-emerald-900">
                              {formatDate(orderDetails.paid_at)}
                            </p>
                          </div>
                        </div>
                      )}

                      {orderDetails.shipped_at && (
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <Truck
                            size={16}
                            className="text-purple-600 flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                              {t("orders.shippedAt", "Shipped At")}
                            </p>
                            <p className="text-sm font-semibold text-purple-900">
                              {formatDate(orderDetails.shipped_at)}
                            </p>
                          </div>
                        </div>
                      )}

                      {orderDetails.delivered_at && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <CheckCircle
                            size={16}
                            className="text-green-600 flex-shrink-0"
                          />
                          <div>
                            <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                              {t("orders.deliveredAt", "Delivered At")}
                            </p>
                            <p className="text-sm font-semibold text-green-900">
                              {formatDate(orderDetails.delivered_at)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tracking Number */}
                  {orderDetails.tracking_number && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <Truck
                        size={20}
                        className="text-blue-600 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                          {t("orders.trackingNumber", "Tracking Number")}
                        </p>
                        <p className="font-mono text-lg font-bold text-blue-900 mt-1">
                          {orderDetails.tracking_number}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Notes */}
                  {orderDetails.notes && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                      <Package
                        size={20}
                        className="text-amber-600 flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">
                          {t("orders.notes", "Order Notes")}
                        </p>
                        <p className="text-sm text-amber-900 leading-relaxed">
                          {orderDetails.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Actions Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-lg border-2 ${
                        orderDetails.can_be_cancelled
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <X
                          size={16}
                          className={
                            orderDetails.can_be_cancelled
                              ? "text-red-600"
                              : "text-gray-400"
                          }
                        />
                        <span
                          className={`text-sm font-semibold ${
                            orderDetails.can_be_cancelled
                              ? "text-red-900"
                              : "text-gray-500"
                          }`}
                        >
                          {orderDetails.can_be_cancelled
                            ? t("orders.canBeCancelled", "Can be Cancelled")
                            : t("orders.cannotBeCancelled", "Cannot Cancel")}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-lg border-2 ${
                        orderDetails.can_be_refunded
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle
                          size={16}
                          className={
                            orderDetails.can_be_refunded
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        />
                        <span
                          className={`text-sm font-semibold ${
                            orderDetails.can_be_refunded
                              ? "text-green-900"
                              : "text-gray-500"
                          }`}
                        >
                          {orderDetails.can_be_refunded
                            ? t("orders.canBeRefunded", "Can be Refunded")
                            : t("orders.cannotBeRefunded", "No Refund")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
