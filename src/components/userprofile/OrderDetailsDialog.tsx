"use client";

import {
  Download,
  ShoppingCart,
  Percent,
  MapPin,
  User,
  Phone,
  Hash,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import type { Order, DetailedOrder } from "@/services/api/ordersApi";
import { useGetOrderDetailsQuery } from "@/services/api/ordersApi";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isRTL: boolean;
}

export default function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
  isRTL,
}: OrderDetailsDialogProps) {
  const { t } = useTranslation("userProfile");

  // Use the API hook instead of manual fetch
  const {
    data: orderDetailsResponse,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(order?.order_number || "", {
    skip: !isOpen || !order?.order_number,
  });

  const orderDetails = orderDetailsResponse?.data?.order;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle reorder
  const handleReorder = (orderData: DetailedOrder) => {
    // Add to cart logic would go here
    console.log("Reorder:", orderData);
  };

  // Handle download invoice
  const handleDownloadInvoice = (orderData: DetailedOrder) => {
    // Download invoice logic would go here
    console.log("Download invoice:", orderData);
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("orders.orderDetails")} - {order.order_number}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-gray-600">{t("orders.loadingDetails")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p className="mb-2">{t("orders.errorLoadingDetails")}</p>
            <p className="text-sm text-gray-600">
              {error?.data?.message ||
                "An error occurred while loading order details"}
            </p>
          </div>
        ) : orderDetails ? (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash size={16} className="text-gray-600" />
                    <span className="font-medium">
                      {t("orders.orderNumber")}
                    </span>
                  </div>
                  <p className="text-lg font-mono">
                    {orderDetails.order_number}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays size={16} className="text-gray-600" />
                    <span className="font-medium">{t("orders.orderDate")}</span>
                  </div>
                  <p>{formatDate(orderDetails.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  {t("orders.status")}
                </div>
                <div className="font-medium text-blue-700 capitalize">
                  {orderDetails.status}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  {t("orders.paymentStatus")}
                </div>
                <div className="font-medium text-green-700 capitalize">
                  {orderDetails.payment_status}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  {t("orders.paymentMethod")}
                </div>
                <div className="font-medium text-purple-700 capitalize">
                  {orderDetails.payment_method}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-gray-600" />
                <h3 className="font-medium text-lg">
                  {t("orders.shippingAddress")}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {t("orders.customerName")}
                    </span>
                  </div>
                  <p className="font-medium">
                    {orderDetails.address.first_name}{" "}
                    {orderDetails.address.last_name}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={14} className="text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {t("orders.phone")}
                    </span>
                  </div>
                  <p className="font-medium">{orderDetails.address.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("orders.address")}
                  </div>
                  <p className="font-medium">
                    {orderDetails.address.address}
                    {orderDetails.address.apartment &&
                      `, ${t("orders.apartment")} ${
                        orderDetails.address.apartment
                      }`}
                    <br />
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

            {/* Products */}
            <div>
              <h3 className="font-medium text-lg mb-3">
                {t("orders.products")}
              </h3>
              <div className="space-y-3">
                {orderDetails.products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-4">
                      <Image
                        src={`https://brave.iseek.name/storage/${product.product_image}`}
                        alt={product.product_name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-lg mb-2">
                          {product.product_name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">
                              {t("orders.sku")}:
                            </span>
                            <span className="ml-2 font-medium">
                              {product.product_sku}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              {t("orders.quantity")}:
                            </span>
                            <span className="ml-2 font-medium">
                              {product.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              {t("orders.unitPrice")}:
                            </span>
                            <span className="ml-2 font-medium">
                              {formatCurrency(
                                product.final_unit_price,
                                orderDetails.pricing.currency
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              {t("orders.total")}:
                            </span>
                            <span className="ml-2 font-medium text-blue-600">
                              {formatCurrency(
                                product.total,
                                orderDetails.pricing.currency
                              )}
                            </span>
                          </div>
                        </div>
                        {product.discount_amount > 0 && (
                          <div className="mt-2 text-sm text-green-600">
                            {t("orders.discount")}:{" "}
                            {formatCurrency(
                              product.discount_amount,
                              orderDetails.pricing.currency
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-3 text-blue-800">
                {t("orders.pricingDetails")}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("orders.subtotal")}:</span>
                  <span>
                    {formatCurrency(
                      orderDetails.pricing.subtotal,
                      orderDetails.pricing.currency
                    )}
                  </span>
                </div>
                {orderDetails.pricing.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("orders.discount")}:</span>
                    <span>
                      -
                      {formatCurrency(
                        orderDetails.pricing.discount_amount,
                        orderDetails.pricing.currency
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t("orders.shipping")}:</span>
                  <span>
                    {formatCurrency(
                      orderDetails.pricing.shipping_cost,
                      orderDetails.pricing.currency
                    )}
                  </span>
                </div>
                {orderDetails.pricing.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span>{t("orders.tax")}:</span>
                    <span>
                      {formatCurrency(
                        orderDetails.pricing.tax_amount,
                        orderDetails.pricing.currency
                      )}
                    </span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold text-blue-800">
                  <span>{t("orders.grandTotal")}:</span>
                  <span>
                    {formatCurrency(
                      orderDetails.pricing.grand_total,
                      orderDetails.pricing.currency
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Coupon Information */}
            {orderDetails.coupon?.code && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Percent size={18} className="text-green-600" />
                  <h3 className="font-medium text-lg text-green-800">
                    {t("orders.couponApplied")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">
                      {t("orders.couponCode")}:
                    </span>
                    <span className="ml-2 font-medium font-mono">
                      {orderDetails.coupon.code}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      {t("orders.savedAmount")}:
                    </span>
                    <span className="ml-2 font-medium text-green-600">
                      {formatCurrency(
                        orderDetails.coupon.discount,
                        orderDetails.pricing.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderDetails.tracking_number && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("orders.trackingNumber")}
                  </div>
                  <div className="font-mono text-blue-600">
                    {orderDetails.tracking_number}
                  </div>
                </div>
              )}
              {orderDetails.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    {t("orders.notes")}
                  </div>
                  <div>{orderDetails.notes}</div>
                </div>
              )}
            </div>

            {/* Order Actions */}
            {/* <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleReorder(orderDetails)}
                className="flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                {t("orders.reorder")}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDownloadInvoice(orderDetails)}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                {t("orders.downloadInvoice")}
              </Button>
            </div> */}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            {t("orders.errorLoadingDetails")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
