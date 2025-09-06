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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(isCurrentRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      isCurrentRTL ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
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
          <div className="space-y-8 py-4">
            {/* Order Header Card */}
            <div className="bg-gradient-to-r from-[#fdfbf7] to-[#f9f5ed] border border-[#f3e9d8] rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#b3984a] rounded-lg flex items-center justify-center">
                    <Hash size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.orderNumber")}
                    </div>
                    <div className="text-2xl font-bold text-[#272627] font-mono">
                      {orderDetails.order_number}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.orderDate")}
                    </div>
                    <div className="text-lg font-semibold text-[#272627]">
                      {formatDate(orderDetails.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap gap-3">
                {(() => {
                  const statusInfo = getStatusIcon(orderDetails.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div
                      className={`${statusInfo.bg} ${statusInfo.color} px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2`}
                    >
                      <StatusIcon size={16} />
                      {t("orders.status")}: {orderDetails.status}
                    </div>
                  );
                })()}

                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <CreditCard size={16} />
                  {t("orders.paymentStatus")}: {orderDetails.payment_status}
                </div>

                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Package size={16} />
                  {orderDetails.payment_method}
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#272627] mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-[#b3984a] rounded-full"></div>
                {t("orders.orderSummary")}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("orders.subtotal")}
                  </div>
                  <div className="text-lg font-bold text-[#272627]">
                    {formatCurrency(
                      orderDetails.pricing.subtotal,
                      orderDetails.pricing.currency
                    )}
                  </div>
                </div>

                {orderDetails.pricing.discount_amount > 0 && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.discount")}
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      -
                      {formatCurrency(
                        orderDetails.pricing.discount_amount,
                        orderDetails.pricing.currency
                      )}
                    </div>
                  </div>
                )}

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("orders.shipping")}
                  </div>
                  <div className="text-lg font-bold text-[#272627]">
                    {formatCurrency(
                      orderDetails.pricing.shipping_cost,
                      orderDetails.pricing.currency
                    )}
                  </div>
                </div>

                {orderDetails.pricing.tax_amount > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.tax")}
                    </div>
                    <div className="text-lg font-bold text-[#272627]">
                      {formatCurrency(
                        orderDetails.pricing.tax_amount,
                        orderDetails.pricing.currency
                      )}
                    </div>
                  </div>
                )}

                <div className="text-center p-6   rounded-lg">
                  <div className="text-sm font-medium mb-1">
                    {t("orders.total")}
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      orderDetails.pricing.grand_total,
                      orderDetails.pricing.currency
                    )}
                  </div>
                </div>
              </div>

              {/* Coupon Row */}
              {orderDetails.coupon?.code && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Percent size={20} className="text-green-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-green-800">
                          {t("orders.couponApplied")}:{" "}
                        </span>
                        <span className="font-mono font-bold text-green-700">
                          {orderDetails.coupon.code}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600">
                        {t("orders.savedAmount")}
                      </div>
                      <div className="text-xl font-bold text-green-700">
                        -
                        {formatCurrency(
                          orderDetails.coupon.discount,
                          orderDetails.pricing.currency
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Products and Details Grid */}
            <div className="space-y-6">
              {/* Shipping Address - Full Width */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#272627] mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#b3984a] rounded-lg flex items-center justify-center">
                    <MapPin size={20} className="text-white" />
                  </div>
                  {t("orders.shippingAddress")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User size={18} className="text-[#b3984a]" />
                    <span className="font-semibold text-[#272627]">
                      {orderDetails.address.first_name}{" "}
                      {orderDetails.address.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-[#b3984a]" />
                    <span className="font-medium text-[#272627]">
                      {orderDetails.address.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={18} className="text-[#b3984a] mt-1" />
                    <div className="text-sm text-[#272627]">
                      <p className="font-medium">
                        {orderDetails.address.address}
                      </p>
                      {orderDetails.address.apartment && (
                        <p>
                          {t("orders.apartment")}{" "}
                          {orderDetails.address.apartment}
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

              {/* Products - Full Width Rows */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#272627] mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#b3984a] rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-white" />
                  </div>
                  {t("orders.products")} ({orderDetails.products.length})
                </h3>

                <div className="space-y-4">
                  {orderDetails.products.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={`https://brave.iseek.name/storage/${product.product_image}`}
                          alt={product.product_name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#272627] mb-2 truncate">
                            {product.product_name}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
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
                              {formatCurrency(
                                product.final_unit_price,
                                orderDetails.pricing.currency
                              )}
                            </span>
                            {product.discount_amount > 0 && (
                              <span className="text-green-600 font-medium">
                                -
                                {formatCurrency(
                                  product.discount_amount,
                                  orderDetails.pricing.currency
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#b3984a]">
                            {formatCurrency(
                              product.total,
                              orderDetails.pricing.currency
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info - Full Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orderDetails.tracking_number && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Truck size={20} className="text-blue-600" />
                      </div>
                      <span className="font-semibold text-[#272627]">
                        {t("orders.trackingNumber")}
                      </span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <span className="font-mono text-blue-700 text-lg">
                        {orderDetails.tracking_number}
                      </span>
                    </div>
                  </div>
                )}

                {orderDetails.notes && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <span className="font-semibold text-[#272627] block mb-4">
                      {t("orders.notes")}
                    </span>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <span className="text-amber-800">
                        {orderDetails.notes}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
