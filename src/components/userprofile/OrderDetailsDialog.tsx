"use client";

import {
  Percent,
  MapPin,
  User,
  Phone,
  Hash,
  Loader2,
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
import { useGetOrderDetailsQuery } from "@/services/api/ordersApi";

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
  width = "max-w-4xl",
}: OrderDetailsDialogProps) {
  const { t, i18n } = useTranslation("userProfile");
  const currentLocale = i18n.language;
  const isCurrentRTL = currentLocale === "ar";

  const {
    data: orderDetailsResponse,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(order?.order_number || "", {
    skip: !isOpen || !order?.order_number,
  });

  const orderDetails = orderDetailsResponse?.data?.order;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <DialogContent className={`${width} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold text-[#272627] flex items-center gap-3">
            <div className="w-2 h-8 bg-[#b3984a] rounded-full"></div>
            {t("orders.orderDetails")} - {order.order_number}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-[#b3984a] mx-auto mb-4" />
            <p className="text-lg text-gray-600">
              {t("orders.loadingDetails")}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-[#e62626]">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={24} className="text-[#e62626]" />
            </div>
            <p className="text-lg font-semibold mb-2">
              {t("orders.errorLoadingDetails")}
            </p>
            <p className="text-gray-600">
              {error &&
              "data" in error &&
              error.data &&
              typeof error.data === "object" &&
              "message" in error.data
                ? String(error.data.message)
                : "An error occurred while loading order details"}
            </p>
          </div>
        ) : orderDetails ? (
          <div className="space-y-6 py-4">
            {/* Order Header - Simplified */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#b3984a] rounded-lg flex items-center justify-center">
                    <Hash size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      {t("orders.orderNumber")}
                    </div>
                    <div className="text-xl font-bold text-[#272627] font-mono">
                      {orderDetails.order_number}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(orderDetails.created_at)}
                </div>
              </div>

              {/* Status Row - Simplified */}
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const statusInfo = getStatusIcon(orderDetails.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <span
                      className={`${statusInfo.bg} ${statusInfo.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
                    >
                      <StatusIcon size={14} />
                      {t(
                        `orders.statuses.${orderDetails.status}`,
                        orderDetails.status
                      )}
                    </span>
                  );
                })()}

                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <CreditCard size={14} />
                  {t(
                    `orders.paymentStatuses.${orderDetails.payment_status}`,
                    orderDetails.payment_status
                  )}
                </span>

                <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {t(
                    `orders.paymentMethods.${orderDetails.payment_method}`,
                    orderDetails.payment_method
                  )}
                </span>
              </div>
            </div>

            {/* Order Summary - Simplified */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#272627] mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#b3984a] rounded-full"></div>
                {t("orders.orderSummary")}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t("orders.subtotal")}</span>
                  <span className="font-medium text-[#272627]">
                    {orderDetails.pricing.subtotal}{" "}
                    {isCurrentRTL ? "ر.س" : "SAR"}
                  </span>
                </div>

                {orderDetails.pricing.discount_amount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">
                      {t("orders.discount")}
                    </span>
                    <span className="font-medium text-green-600">
                      -{orderDetails.pricing.discount_amount}{" "}
                      {isCurrentRTL ? "ر.س" : "SAR"}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t("orders.shipping")}</span>
                  <span className="font-medium text-[#272627]">
                    {orderDetails.pricing.shipping_cost}{" "}
                    {isCurrentRTL ? "ر.س" : "SAR"}
                  </span>
                </div>

                {orderDetails.pricing.tax_amount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{t("orders.tax")}</span>
                    <span className="font-medium text-[#272627]">
                      {orderDetails.pricing.tax_amount}{" "}
                      {isCurrentRTL ? "ر.س" : "SAR"}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 bg-[#b3984a]/5 rounded-lg px-4">
                  <span className="text-lg font-semibold text-[#272627]">
                    {t("orders.total")}
                  </span>
                  <span className="text-xl font-bold text-[#b3984a]">
                    {orderDetails.pricing.total} {isCurrentRTL ? "ر.س" : "SAR"}
                  </span>
                </div>
              </div>

              {/* Coupon - Simplified */}
              {orderDetails.coupon?.code && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent size={16} className="text-green-600" />
                      <span className="text-sm text-green-700">
                        {t("orders.couponApplied")}:{" "}
                        <span className="font-mono font-bold">
                          {orderDetails.coupon.code}
                        </span>
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-700">
                      -{orderDetails.coupon.discount}{" "}
                      {isCurrentRTL ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Address - Simplified */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#272627] mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#b3984a] rounded-full"></div>
                {t("orders.shippingAddress")}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={16} className="text-[#b3984a]" />
                  <span className="font-medium text-[#272627]">
                    {orderDetails.address.first_name}{" "}
                    {orderDetails.address.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={16} className="text-[#b3984a]" />
                  <span className="font-medium text-[#272627]">
                    {orderDetails.address.phone}
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={16} className="text-[#b3984a] mt-1" />
                  <div className="text-sm text-[#272627]">
                    <p className="font-medium">
                      {orderDetails.address.address}
                    </p>
                    {orderDetails.address.apartment && (
                      <p>
                        {t("orders.apartment")} {orderDetails.address.apartment}
                      </p>
                    )}
                    <p>
                      {orderDetails.address.city}
                      {orderDetails.address.state &&
                        `, ${orderDetails.address.state}`}
                      {orderDetails.address.country &&
                        `, ${orderDetails.address.country}`}
                      {orderDetails.address.zip_code &&
                        ` ${orderDetails.address.zip_code}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products - Simplified */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#272627] mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#b3984a] rounded-full"></div>
                {t("orders.products")} ({orderDetails.products.length})
              </h3>

              <div className="space-y-3">
                {orderDetails.products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#b3984a]/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={`https://brave.iseek.name/storage/${product.product_image}`}
                        alt={product.product_name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#272627] mb-2 truncate">
                          {product.product_name}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>
                            <span className="font-medium">SKU:</span>{" "}
                            {product.product_sku}
                          </span>
                          <span>
                            <span className="font-medium">Qty:</span>{" "}
                            {product.quantity}
                          </span>
                          <span>
                            <span className="font-medium">Price:</span>{" "}
                            {product.final_unit_price}{" "}
                            {isCurrentRTL ? "ر.س" : "SAR"}
                          </span>
                          {product.discount_amount > 0 && (
                            <span className="text-green-600 font-medium">
                              -{product.discount_amount}{" "}
                              {isCurrentRTL ? "ر.س" : "SAR"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#b3984a]">
                          {product.total} {isCurrentRTL ? "ر.س" : "SAR"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info - Simplified */}
            {(orderDetails.tracking_number || orderDetails.notes) && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#272627] mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#b3984a] rounded-full"></div>
                  {t("orders.additionalInfo", "Additional Information")}
                </h3>

                <div className="space-y-4">
                  {orderDetails.tracking_number && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Truck size={16} className="text-blue-600" />
                      <div>
                        <span className="text-sm text-blue-600 font-medium">
                          {t("orders.trackingNumber")}:
                        </span>
                        <span className="font-mono text-blue-700 ml-2">
                          {orderDetails.tracking_number}
                        </span>
                      </div>
                    </div>
                  )}

                  {orderDetails.notes && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="w-4 h-4 bg-amber-200 rounded-full mt-1"></div>
                      <div>
                        <span className="text-sm text-amber-600 font-medium">
                          {t("orders.notes")}:
                        </span>
                        <p className="text-amber-800 mt-1">
                          {orderDetails.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-600">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={24} className="text-gray-400" />
            </div>
            <p className="text-lg">{t("orders.errorLoadingDetails")}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
