"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingCart,
  DollarSign,
  Percent,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useGetOrdersQuery } from "@/services/api/ordersApi";
import type { Order, OrdersRequest } from "@/services/api/ordersApi";

export default function OrdersPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  // Filters state
  const [filters, setFilters] = useState<OrdersRequest>({
    status: "all",
    payment_status: "all",
    date_from: "",
    date_to: "",
    per_page: 10,
    sort_by: "created_at",
    sort_direction: "desc",
    page: 1,
  });

  // Get orders data
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetOrdersQuery(filters);

  // Handle filter changes
  const handleFilterChange = (key: keyof OrdersRequest, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "all",
      payment_status: "all",
      date_from: "",
      date_to: "",
      per_page: 10,
      sort_by: "created_at",
      sort_direction: "desc",
      page: 1,
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    const perPage = parseInt(value);
    setFilters((prev) => ({ ...prev, per_page: perPage, page: 1 }));
  };

  // Get status info for styling
  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          text: t("orders.statuses.pending"),
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          icon: Clock,
        };
      case "paid":
        return {
          text: t("orders.statuses.paid"),
          color: "text-blue-600",
          bg: "bg-blue-100",
          icon: CreditCard,
        };
      case "processing":
        return {
          text: t("orders.statuses.processing"),
          color: "text-blue-600",
          bg: "bg-blue-100",
          icon: Package,
        };
      case "shipped":
        return {
          text: t("orders.statuses.shipped"),
          color: "text-purple-600",
          bg: "bg-purple-100",
          icon: Truck,
        };
      case "completed":
        return {
          text: t("orders.statuses.completed"),
          color: "text-green-600",
          bg: "bg-green-100",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          text: t("orders.statuses.cancelled"),
          color: "text-red-600",
          bg: "bg-red-100",
          icon: X,
        };
      case "refunded":
        return {
          text: t("orders.statuses.refunded"),
          color: "text-gray-600",
          bg: "bg-gray-100",
          icon: X,
        };
      default:
        return {
          text: status,
          color: "text-gray-600",
          bg: "bg-gray-100",
          icon: Clock,
        };
    }
  };

  // Get payment status info
  const getPaymentStatusInfo = (status: Order["payment_status"]) => {
    switch (status) {
      case "pending":
        return {
          text: t("orders.paymentStatuses.pending"),
          color: "text-yellow-600",
          bg: "bg-yellow-100",
        };
      case "paid":
        return {
          text: t("orders.paymentStatuses.paid"),
          color: "text-green-600",
          bg: "bg-green-100",
        };
      case "failed":
        return {
          text: t("orders.paymentStatuses.failed"),
          color: "text-red-600",
          bg: "bg-red-100",
        };
      case "refunded":
        return {
          text: t("orders.paymentStatuses.refunded"),
          color: "text-gray-600",
          bg: "bg-gray-100",
        };
      default:
        return {
          text: status,
          color: "text-gray-600",
          bg: "bg-gray-100",
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  // Handle reorder
  const handleReorder = (order: Order) => {
    // Add to cart logic would go here
    console.log("Reorder:", order);
  };

  // Handle view order details
  const handleViewDetails = (order: Order) => {
    // View order details logic would go here
    console.log("View details:", order);
  };

  // Handle download invoice
  const handleDownloadInvoice = (order: Order) => {
    // Download invoice logic would go here
    console.log("Download invoice:", order);
  };

  const orders = ordersResponse?.data?.items || [];
  const pagination = ordersResponse?.data?.pagination;

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2
          className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("orders.title")}
        </h2>
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            {t("orders.export")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div
          className={`flex items-center gap-2 mb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-medium">{t("orders.filters.title")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("orders.filters.status")}
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("orders.filters.allStatuses")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("orders.statuses.pending")}
                </SelectItem>
                <SelectItem value="paid">
                  {t("orders.statuses.paid")}
                </SelectItem>
                <SelectItem value="processing">
                  {t("orders.statuses.processing")}
                </SelectItem>
                <SelectItem value="shipped">
                  {t("orders.statuses.shipped")}
                </SelectItem>
                <SelectItem value="completed">
                  {t("orders.statuses.completed")}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t("orders.statuses.cancelled")}
                </SelectItem>
                <SelectItem value="refunded">
                  {t("orders.statuses.refunded")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("orders.filters.paymentStatus")}
            </label>
            <Select
              value={filters.payment_status}
              onValueChange={(value) =>
                handleFilterChange("payment_status", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("orders.filters.allPaymentStatuses")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("orders.paymentStatuses.pending")}
                </SelectItem>
                <SelectItem value="paid">
                  {t("orders.paymentStatuses.paid")}
                </SelectItem>
                <SelectItem value="failed">
                  {t("orders.paymentStatuses.failed")}
                </SelectItem>
                <SelectItem value="refunded">
                  {t("orders.paymentStatuses.refunded")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("orders.filters.dateFrom")}
            </label>
            <Input
              type="date"
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Date To Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("orders.filters.dateTo")}
            </label>
            <Input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Sort and Per Page */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("orders.filters.sortBy")}
            </label>
            <Select
              value={filters.sort_by}
              onValueChange={(value) => handleFilterChange("sort_by", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">
                  {t("orders.filters.createdAt")}
                </SelectItem>
                <SelectItem value="order_number">
                  {t("orders.filters.orderNumber")}
                </SelectItem>
                <SelectItem value="total">
                  {t("orders.filters.total")}
                </SelectItem>
                <SelectItem value="status">
                  {t("orders.filters.status")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("orders.filters.sortDirection")}
            </label>
            <Select
              value={filters.sort_direction}
              onValueChange={(value) =>
                handleFilterChange("sort_direction", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  {t("orders.filters.descending")}
                </SelectItem>
                <SelectItem value="asc">
                  {t("orders.filters.ascending")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Per Page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("orders.filters.perPage")}
            </label>
            <Select
              value={filters.per_page?.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className={`flex gap-2 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button onClick={clearFilters} variant="outline">
            {t("orders.filters.clear")}
          </Button>
          <Button onClick={() => refetch()} disabled={isLoading}>
            {isLoading
              ? t("orders.filters.loading")
              : t("orders.filters.apply")}
          </Button>
        </div>
      </div>

      {/* Order Stats */}
      {pagination && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pagination.total}
            </div>
            <div className="text-sm text-gray-600">
              {t("orders.stats.totalOrders")}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">
              {t("orders.stats.completedOrders")}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {
                orders.filter(
                  (o) => o.status === "pending" || o.status === "processing"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">
              {t("orders.stats.pendingOrders")}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                orders.reduce(
                  (sum, order) => sum + order.pricing.grand_total,
                  0
                ),
                "USD"
              )}
            </div>
            <div className="text-sm text-gray-600">
              {t("orders.stats.totalSpent")}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t("orders.loading")}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">{t("orders.error.title")}</div>
          <p className="text-gray-600 mb-4">{t("orders.error.description")}</p>
          <Button onClick={() => refetch()}>{t("orders.error.retry")}</Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-600 mb-2">{t("orders.empty.title")}</div>
          <p className="text-gray-500">{t("orders.empty.description")}</p>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const paymentStatusInfo = getPaymentStatusInfo(
              order.payment_status
            );
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-6 bg-white"
              >
                {/* Order Header */}
                <div
                  className={`flex justify-between items-start mb-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center gap-2"
                    >
                      <Eye size={14} />
                      {t("orders.viewDetails")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={14} />
                      {t("orders.reorder")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadInvoice(order)}
                      className="flex items-center gap-2"
                    >
                      <Download size={14} />
                      {t("orders.downloadInvoice")}
                    </Button>
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="font-medium text-lg">
                      {t("orders.orderNumber")} {order.order_number}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("orders.date")}: {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* Status */}
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.status")}
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}
                    >
                      <StatusIcon size={14} />
                      {statusInfo.text}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.paymentStatus")}
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${paymentStatusInfo.bg} ${paymentStatusInfo.color}`}
                    >
                      {paymentStatusInfo.text}
                    </div>
                  </div>

                  {/* Total */}
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.total")}
                    </div>
                    <div className="font-medium">
                      {formatCurrency(
                        order.pricing.grand_total,
                        order.pricing.currency
                      )}
                    </div>
                  </div>

                  {/* Items Count */}
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.items")}
                    </div>
                    <div className="font-medium">
                      {order.total_items} {t("orders.item")}
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div
                    className={`flex items-center gap-2 mb-2 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <MapPin size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("orders.shippingAddress")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.address.first_name} {order.address.last_name} -{" "}
                    {order.address.phone}
                    <br />
                    {order.address.address}, {order.address.city}{" "}
                    {order.address.zip_code}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div
                    className={`flex items-center gap-2 mb-2 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <DollarSign size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {t("orders.pricingSummary")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">
                        {t("orders.subtotal")}:
                      </span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(
                          order.pricing.subtotal,
                          order.pricing.currency
                        )}
                      </span>
                    </div>
                    {order.pricing.discount_amount > 0 && (
                      <div>
                        <span className="text-gray-600">
                          {t("orders.discount")}:
                        </span>
                        <span className="ml-2 font-medium text-green-600">
                          -
                          {formatCurrency(
                            order.pricing.discount_amount,
                            order.pricing.currency
                          )}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">
                        {t("orders.shipping")}:
                      </span>
                      <span className="ml-2 font-medium">
                        {formatCurrency(
                          order.pricing.shipping_cost,
                          order.pricing.currency
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {t("orders.grandTotal")}:
                      </span>
                      <span className="ml-2 font-medium text-blue-600">
                        {formatCurrency(
                          order.pricing.grand_total,
                          order.pricing.currency
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coupon Info */}
                {order.coupon.code && (
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Percent size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {t("orders.couponApplied")}: {order.coupon.code}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("orders.saved")}:{" "}
                      {formatCurrency(
                        order.coupon.discount,
                        order.pricing.currency
                      )}
                    </div>
                  </div>
                )}

                {/* Order Products */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">
                    {t("orders.products")}
                  </h4>
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className={`flex items-center gap-4 p-3 bg-gray-50 rounded-lg ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Image
                        src={`https://brave.iseek.name/storage/${product.product_image}`}
                        alt={product.product_name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div
                        className={`flex-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        <div className="font-medium">
                          {product.product_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t("orders.quantity")}: {product.quantity} ×{" "}
                          {formatCurrency(
                            product.final_unit_price,
                            order.pricing.currency
                          )}
                        </div>
                        {product.discount_amount > 0 && (
                          <div className="text-sm text-green-600">
                            {t("orders.discount")}:{" "}
                            {formatCurrency(
                              product.discount_amount,
                              order.pricing.currency
                            )}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        {formatCurrency(product.total, order.pricing.currency)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Number */}
                {order.tracking_number && (
                  <div
                    className={`mt-4 p-3 bg-blue-50 rounded-lg ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.trackingNumber")}
                    </div>
                    <div className="font-mono text-blue-600" dir="ltr">
                      {order.tracking_number}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div
                    className={`mt-4 p-3 bg-yellow-50 rounded-lg ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {t("orders.notes")}
                    </div>
                    <div className="text-sm">{order.notes}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="mt-8 flex justify-center">
          <div
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              <ChevronLeft size={16} />
              {t("orders.pagination.previous")}
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: pagination.last_page },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={
                    page === pagination.current_page ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
            >
              {t("orders.pagination.next")}
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div
          className={`text-center mt-4 text-sm text-gray-600 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t("orders.pagination.showing", {
            from: pagination.from,
            to: pagination.to,
            total: pagination.total,
          })}
        </div>
      )}
    </div>
  );
}
