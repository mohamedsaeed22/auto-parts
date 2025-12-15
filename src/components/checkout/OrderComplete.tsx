import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  Hash,
  Phone,
  CheckCircle2,
  XCircle,
  Info,
  Gift,
  Eye,
  Copy,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { Order } from "@/services/api/ordersApi";
import OrderPdfViewer from "@/components/orders/OrderPdfViewer";

interface OrderCompleteProps {
  onBackToShopping: () => void;
  order: Order | null;
}

const OrderComplete: React.FC<OrderCompleteProps> = ({
  onBackToShopping,
  order,
}) => {
  const { t, i18n } = useTranslation(["orderComplete", "checkout", "common"]);
  const router = useRouter();
  const isRTL = i18n.language === "ar";
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);

  // Remove coupon from localStorage when order is complete
  useEffect(() => {
    try {
      localStorage.removeItem("auto_parts_coupon_code");
    } catch {
      // Ignore errors when removing coupon
    }
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleTrackOrder = () => {
    // Set the localStorage variable to navigate to orders page
    localStorage.setItem("userProfileActivePage", "orders");
    // Navigate to user profile
    router.push("/userprofile");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-logo-gold/5 via-white to-logo-gold/10 py-4 sm:py-8 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-logo-gold rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-logo-black mb-2 sm:mb-3">
            {t("orderComplete:title")}
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 mb-2">
            {t("orderComplete:thankYou")}
          </p>
          {order && (
            <>
              <div className="inline-flex items-center gap-2 bg-logo-gold/10 border border-logo-gold/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-3 sm:mb-4">
                <span className="text-neutral-700 font-medium text-sm sm:text-base">
                  {t("orderComplete:orderNumber")}:
                </span>
                <span className="text-logo-black font-bold text-base sm:text-lg">
                  {order.order_number}
                </span>
                <button
                  onClick={() => copyToClipboard(order.order_number)}
                  className="p-1 hover:bg-logo-gold/20 rounded transition-colors"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600" />
                </button>
              </div>
              <p className="text-neutral-600 flex items-center justify-center gap-2 text-sm sm:text-base">
                <Clock className="w-4 h-4" />
                {t("orderComplete:deliveryTime")}
              </p>
            </>
          )}
        </motion.div>

        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Order Details - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-4 sm:space-y-6"
            >
              {/* Order Information Card */}
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Hash className="w-5 h-5 text-logo-gold" />
                    {t("orderComplete:orderDetails", {
                      defaultValue: "Order Details",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("orderComplete:orderId")}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {order.id}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("orderComplete:orderDate")}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("orderComplete:totalItems")}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {order.total_items}
                      </div>
                    </div>
                    {order.tracking_number && (
                      <div className="space-y-2">
                        <div className="text-sm text-neutral-600">
                          {t("orderComplete:trackingNumber")}
                        </div>
                        <div className="font-semibold text-logo-black flex items-center gap-2">
                          {order.tracking_number}
                          <button
                            onClick={() =>
                              copyToClipboard(order.tracking_number || "")
                            }
                            className="p-1 hover:bg-logo-gold/20 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3 text-neutral-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {order.notes && (
                    <div className="space-y-2">
                      <div className="text-sm text-neutral-600">
                        {t("orderComplete:notes")}
                      </div>
                      <div className="bg-logo-gold/5 p-3 rounded-lg border border-logo-gold/10">
                        <p className="text-logo-black">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Status */}
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Package className="w-5 h-5 text-logo-gold" />
                    {t("orderComplete:orderStatus", {
                      defaultValue: "Order Status",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="text-sm opacity-75 mb-1">
                          {t("orderComplete:status", {
                            defaultValue: "Order Status",
                          })}
                        </div>
                        <div className="font-semibold capitalize">
                          {t(`orderStatus.${order.status}`, {
                            defaultValue: order.status,
                          })}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${getPaymentStatusColor(
                        order.payment_status
                      )}`}
                    >
                      {getPaymentStatusIcon(order.payment_status)}
                      <div>
                        <div className="text-sm opacity-75 mb-1">
                          {t("orderComplete:paymentStatus", {
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
                </CardContent>
              </Card>

              {/* Products List */}
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <Package className="w-5 h-5 text-logo-gold" />
                    {t("orderComplete:products")}
                    <Badge
                      variant="secondary"
                      className="bg-logo-gold/20 text-logo-black"
                    >
                      {order.total_items}{" "}
                      {t("orderComplete:items", { defaultValue: "items" })}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-logo-gold/5 rounded-xl border border-logo-gold/10"
                      >
                        <div className="w-20 h-20 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.product_image ? (
                            <Image
                              src={
                                product.product_image.startsWith("http")
                                  ? product.product_image
                                  : `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}/storage/${product.product_image}`
                              }
                              alt={product.product_name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <h3 className="font-medium text-logo-black mb-2 line-clamp-2 text-sm sm:text-base">
                            {product.product_name}
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            <div className="text-xs sm:text-sm text-neutral-600">
                              <span className="font-medium">
                                {t("orderComplete:sku", {
                                  defaultValue: "SKU",
                                })}
                                :
                              </span>{" "}
                              {product.product_sku}
                            </div>
                            <div className="text-xs sm:text-sm text-neutral-600">
                              <span className="font-medium">
                                {t("orderComplete:quantity", {
                                  defaultValue: "Qty",
                                })}
                                :
                              </span>{" "}
                              {product.quantity}
                            </div>
                          </div>

                          {/* Pricing Details */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-neutral-600">
                                {t("orderComplete:unitPrice", {
                                  defaultValue: "Unit Price",
                                })}
                              </div>
                              <div className="text-right">
                                {product.discount_amount > 0 && (
                                  <div className="text-xs text-gray-400 line-through">
                                    {product.price.toFixed(2)}{" "}
                                    {isRTL ? "ر.س" : "SAR"}
                                  </div>
                                )}
                                <div className="font-semibold text-logo-black text-sm sm:text-base">
                                  {product.final_unit_price.toFixed(2)}{" "}
                                  {isRTL ? "ر.س" : "SAR"}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-neutral-600">
                                {t("orderComplete:lineTotal", {
                                  defaultValue: "Line Total",
                                })}
                              </div>
                              <div className="font-semibold text-logo-black">
                                {product.line_total.toFixed(2)}{" "}
                                {isRTL ? "ر.س" : "SAR"}
                              </div>
                            </div>

                            {product.discount_amount > 0 && (
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-green-600">
                                  {t("orderComplete:saved", {
                                    defaultValue: "Saved",
                                  })}
                                </div>
                                <div className="font-semibold text-green-600">
                                  {product.discount_amount.toFixed(2)}{" "}
                                  {isRTL ? "ر.س" : "SAR"}
                                </div>
                              </div>
                            )}

                            {product.product?.offer && (
                              <div className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                <Gift className="w-3 h-3 inline mr-1" />
                                {product.product.offer.discount_info}
                              </div>
                            )}
                          </div>

                          {product.product?.description && (
                            <div className="mt-3 p-2 bg-white/50 rounded text-xs text-neutral-600">
                              {product.product.description}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <MapPin className="w-5 h-5 text-logo-gold" />
                    {t("orderComplete:shippingAddress")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-logo-gold/5 rounded-xl p-4 border border-logo-gold/10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-logo-gold rounded-full"></div>
                        <p className="font-semibold text-logo-black text-base sm:text-lg">
                          {order.address.first_name} {order.address.last_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2" dir="ltr">
                        <Phone className="w-4 h-4 text-logo-gold" />
                        <span className="text-neutral-700">
                          {order.address.phone}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-logo-gold mt-0.5" />
                        <div className="text-neutral-700">
                          <div>{order.address.address}</div>
                          {order.address.apartment && (
                            <div>{order.address.apartment}</div>
                          )}
                          <div>
                            {order.address.city}
                            {order.address.state && `, ${order.address.state}`}
                            {order.address.zip_code &&
                              ` - ${order.address.zip_code}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Payment & Delivery */}
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">
                    {t("orderComplete:paymentDelivery", {
                      defaultValue: "Payment & Delivery",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-logo-gold/5 rounded-xl">
                    <CreditCard className="w-5 h-5 text-logo-gold" />
                    <div>
                      <div className="text-sm text-neutral-600">
                        {t("orderComplete:paymentMethod")}
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
                        {t("orderComplete:deliveryMethod", {
                          defaultValue: "Delivery",
                        })}
                      </div>
                      <div className="font-semibold text-logo-black">
                        {t("orderComplete:standardDelivery", {
                          defaultValue: "Standard Delivery",
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">
                    {t("orderComplete:summary", {
                      defaultValue: "Order Summary",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3 text-sm">
                      {/* Subtotal Details */}
                      <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-600">
                            {t("orderComplete:subtotalWithoutTax")}
                          </span>
                          <span className="font-medium text-logo-black">
                            {(order.pricing.subtotal_without_tax || 0).toFixed(
                              2
                            )}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-600">
                            {t("orderComplete:subtotalTax")}
                          </span>
                          <span className="font-medium text-logo-black">
                            {(order.pricing.subtotal_tax || 0).toFixed(2)}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center font-semibold pt-2 border-t border-gray-200">
                          <span className="text-logo-black">
                            {t("orderComplete:subtotal")}
                          </span>
                          <span className="text-logo-black">
                            {order.pricing.subtotal.toFixed(2)}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                      </div>

                      {/* Shipping Details */}
                      <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-600">
                            {t("orderComplete:shippingCostWithoutTax")}
                          </span>
                          <span className="font-medium text-logo-black">
                            {(
                              order.pricing.shipping_cost_without_tax || 0
                            ).toFixed(2)}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-600">
                            {t("orderComplete:shippingCostTax")}
                          </span>
                          <span className="font-medium text-logo-black">
                            {(order.pricing.shipping_cost_tax || 0).toFixed(2)}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center font-semibold pt-2 border-t border-blue-200">
                          <span className="text-logo-black">
                            {t("orderComplete:shippingCost")}
                          </span>
                          <span className="text-logo-black">
                            {order.pricing.shipping_cost.toFixed(2)}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                      </div>

                      {/* Discount */}
                      {order.pricing.discount_amount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-green-600">
                            {t("orderComplete:discountAmount")}
                          </span>
                          <span className="font-medium text-green-600">
                            -{order.pricing.discount_amount.toFixed(2)}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                      )}

                      {/* Coupon */}
                      {order.coupon.code && (
                        <div className="flex justify-between items-center text-sm bg-green-50 p-2 rounded-lg">
                          <span className="text-green-700">
                            {t("orderComplete:couponCode")}: {order.coupon.code}
                          </span>
                          <span className="font-medium text-green-700">
                            -{order.coupon.discount.toFixed(2)}{" "}
                            {isRTL ? "ر.س" : "SAR"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t-2 border-logo-gold/30 my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-lg bg-logo-gold/10 p-3 rounded-lg">
                        <span className="font-bold text-logo-black">
                          {t("orderComplete:total")}
                        </span>
                        <span className="font-bold text-2xl text-logo-gold">
                          {order.pricing.total.toFixed(2)}{" "}
                          {isRTL ? "ر.س" : "SAR"}
                        </span>
                      </div>

                      {/* {order.pricing.grand_total !== order.pricing.total && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-neutral-600">
                            {t("orderComplete:grandTotal", {
                              defaultValue: "Grand Total",
                            })}
                          </span>
                          <span className="font-semibold text-logo-black">
                            {order.pricing.grand_total.toFixed(2)}{" "}
                            {order.pricing.currency}
                          </span>
                        </div>
                      )} */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card className="shadow-lg border-logo-gold/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">
                    {t("orderComplete:orderActions", {
                      defaultValue: "Order Actions",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={onBackToShopping}
                    className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t("orderComplete:backToShopping")}
                  </Button>

                  <Button
                    onClick={handleTrackOrder}
                    variant="outline"
                    className="w-full border-2 border-logo-gold text-logo-gold   py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t("orderComplete:trackOrder", {
                      defaultValue: "Track Order",
                    })}
                  </Button>

                  <Button
                    onClick={() => setIsPdfViewerOpen(true)}
                    variant="outline"
                    className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isRTL ? "عرض الفاتورة" : "View Invoice"}
                  </Button>

                  {/* <Button
                    variant="outline"
                    className="w-full border-2 border-neutral-300 text-neutral-700  py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {t("orderComplete:contactSupport", {
                      defaultValue: "Contact Support",
                    })}
                  </Button> */}
                </CardContent>
              </Card>

              {/* Order Capabilities */}
              {(order.can_be_cancelled || order.can_be_refunded) && (
                <Card className="shadow-lg border-logo-gold/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Info className="w-5 h-5 text-logo-gold" />
                      {t("orderComplete:orderCapabilities", {
                        defaultValue: "Order Capabilities",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {order.can_be_cancelled && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-neutral-700">
                          {t("orderComplete:canBeCancelled", {
                            defaultValue: "Can be cancelled",
                          })}
                        </span>
                      </div>
                    )}
                    {order.can_be_refunded && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-neutral-700">
                          {t("orderComplete:canBeRefunded", {
                            defaultValue: "Can be refunded",
                          })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* PDF Viewer Dialog */}
      {order && (
        <OrderPdfViewer
          isOpen={isPdfViewerOpen}
          onClose={() => setIsPdfViewerOpen(false)}
          orderData={
            order as unknown as Parameters<
              typeof OrderPdfViewer
            >[0]["orderData"]
          }
        />
      )}
    </div>
  );
};

export default OrderComplete;
