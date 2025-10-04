"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, AlertCircle, Loader2, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import OrderComplete from "@/components/checkout/OrderComplete";
import { useGetOrderDetailsQuery, type Order } from "@/services/api/ordersApi";
import {
  useGetRequestDetailsQuery,
  type RequestResponse,
} from "@/services/api/requestsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AddressDetails {
  id?: number;
  name?: string;
  phone?: string;
  address?: string | null;
  apartment?: string | null;
  city?: string;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  is_default?: boolean;
}

const PaymentStatusPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";

  const paymentMethod = searchParams.get("payment_method");
  const transactionId = searchParams.get("transaction_id");
  const orderId = searchParams.get("order_number");
  const orderType = searchParams.get("order_type") || "order"; // Default to "order" if not specified

  const [shouldFetchData, setShouldFetchData] = useState(false);
  const isRequest = orderType === "request";

  // Validate URL parameters
  useEffect(() => {
    if (paymentMethod === "success" && transactionId && orderId) {
      setShouldFetchData(true);
    }
  }, [paymentMethod, transactionId, orderId]);

  // Fetch order details only if payment is successful and type is "order"
  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useGetOrderDetailsQuery(orderId || "", {
    skip: !shouldFetchData || !orderId || isRequest,
  });

  // Fetch request details only if payment is successful and type is "request"
  const {
    data: requestData,
    isLoading: isRequestLoading,
    isError: isRequestError,
  } = useGetRequestDetailsQuery(orderId || "", {
    skip: !shouldFetchData || !orderId || !isRequest,
  });

  // Combine loading and error states
  const isLoading = isRequest ? isRequestLoading : isOrderLoading;
  const isError = isRequest ? isRequestError : isOrderError;

  const handleBackToShopping = () => {
    router.push("/");
  };
 
  // Loading state
  if (shouldFetchData && isLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-logo-gold/5 via-white to-logo-gold/10 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-16 h-16 text-logo-gold animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-logo-black mb-2">
              {t("orderComplete.loadingOrder")}
            </h2>
            <p className="text-neutral-600 text-center">
              {t("orderComplete.pleaseWait")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - Failed to fetch order
  if (shouldFetchData && isError) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-red-200">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-3 text-center">
                {t("orderComplete.errorLoadingOrder")}
              </h2>
              <p className="text-neutral-600 text-center mb-6">
                {t("orderComplete.orderNotFound")}
              </p>
              <div className="w-full space-y-3">
                <Button
                  onClick={handleBackToShopping}
                  className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white"
                >
                  {t("orderComplete.backToShopping")}
                </Button>
                <Button
                  onClick={() => router.push("/userprofile")}
                  variant="outline"
                  className="w-full border-2 border-logo-gold text-logo-gold"
                >
                  {t("orderComplete.viewMyOrders")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Payment failed state
  if (paymentMethod === "failed" || !transactionId) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-red-200">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-3 text-center">
                {t("orderComplete.paymentFailed")}
              </h2>
              <p className="text-neutral-600 text-center mb-2">
                {t("orderComplete.paymentNotCompleted")}
              </p>
              {transactionId && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 w-full">
                  <p className="text-sm text-neutral-600 text-center">
                    <span className="font-medium">
                      {t("orderComplete.transactionId")}:
                    </span>{" "}
                    {transactionId}
                  </p>
                </div>
              )}
              <div className="w-full space-y-3">
                <Button
                  onClick={handleBackToShopping}
                  variant="outline"
                  className="w-full border-2 border-neutral-300 text-neutral-700"
                >
                  {t("orderComplete.backToShopping")}
                </Button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-neutral-500">
                  {t("orderComplete.needHelp")}{" "}
                  <button
                    onClick={() => router.push("/contact")}
                    className="text-logo-gold font-medium hover:underline"
                  >
                    {t("orderComplete.contactSupport")}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Invalid URL parameters
  if (!orderId || !paymentMethod) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-orange-200">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-orange-600 mb-3 text-center">
                {t("orderComplete.invalidRequest")}
              </h2>
              <p className="text-neutral-600 text-center mb-6">
                {t("orderComplete.missingParameters")}
              </p>
              <div className="w-full space-y-3">
                <Button
                  onClick={handleBackToShopping}
                  className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white"
                >
                  {t("orderComplete.backToShopping")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Success state - Show OrderComplete or RequestComplete component
  if (isRequest && requestData?.data) {
    // Convert request to order format for display
    const request = requestData.data;
    const orderFromRequest: Order = {
      id: request.id,
      order_number: request.id.toString(),
      user_id: request.user_id,
      status: (request.status === "submitted"
        ? "pending"
        : request.status === "accepted"
        ? "processing"
        : request.status === "completed"
        ? "completed"
        : "pending") as Order["status"],
      payment_method: request.payment_method as Order["payment_method"],
      payment_status: request.payment_status,
      address: (() => {
        const addrDetails = request.address_details as AddressDetails | null;
        return {
          first_name:
            addrDetails?.name?.split(" ")[0] || request.first_name || "",
          last_name:
            addrDetails?.name?.split(" ").slice(1).join(" ") ||
            request.last_name ||
            "",
          phone: addrDetails?.phone || request.phone || "",
          address: addrDetails?.address || request.address || "",
          apartment: addrDetails?.apartment || request.apartment,
          city: addrDetails?.city || request.city || "",
          state: addrDetails?.state || request.state,
          country: addrDetails?.country || request.country,
          zip_code: addrDetails?.zip_code || request.zip_code || "",
        };
      })(),
      pricing: {
        subtotal: parseFloat(request.price || "0"),
        discount_amount: 0,
        tax_amount: request.items.reduce((sum, item) => sum + item.tax, 0),
        shipping_cost: 0,
        total: request.calculated_total,
        currency: "SAR",
      },
      coupon: {
        code: null,
        discount: 0,
        details: null,
      },
      products: request.items.map((item) => ({
        id: item.id,
        product_id: item.id,
        product_name: item.part_name,
        product_sku: item.chassis_number || "",
        product_image:
          item.part_image_url ||
          item.order_image_url ||
          item.form_image_url ||
          "",
        price: parseFloat(item.price || "0"),
        discount_percentage: 0,
        discount_amount: 0,
        final_unit_price: parseFloat(item.price || "0") / item.quantity,
        quantity: item.quantity,
        total: parseFloat(item.price || "0"),
        line_total: parseFloat(item.price || "0"),
        options: [],
        product: null,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
      notes: request.notes || null,
      tracking_number: request.tracking_number || null,
      pdf_label: request.pdf_label || null,
      total_items: request.items.reduce((sum, item) => sum + item.quantity, 0),
      paid_at: request.payment_status === "paid" ? request.submitted_at : null,
      shipped_at: request.shipped_at || null,
      delivered_at: null,
      created_at: request.created_at,
      updated_at: request.updated_at,
      can_be_cancelled: false,
      can_be_refunded: false,
    };

    return (
      <OrderComplete
        onBackToShopping={handleBackToShopping}
        order={orderFromRequest}
      />
    );
  }

  if (!isRequest && orderData?.data?.order) {
    // Cast DetailedOrder to Order type - they are compatible
    const order = orderData.data.order as unknown as Order;
    return (
      <OrderComplete onBackToShopping={handleBackToShopping} order={order} />
    );
  }

  // Fallback - should not reach here
  return null;
};

export default PaymentStatusPage;
