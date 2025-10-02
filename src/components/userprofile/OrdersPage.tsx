"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  CreditCard,
  X,
  Loader2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormSelect from "@/components/ui/FormSelect";
import { CustomPagination } from "@/components/ui/custom-pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQueryState, parseAsInteger } from "nuqs";
import { useTranslation } from "react-i18next";
import {
  useGetOrdersQuery,
  useGetOrdersStatisticsQuery,
} from "@/services/api/ordersApi";
import type { Order, OrdersRequest } from "@/services/api/ordersApi";
import OrderDetailsDialog from "./OrderDetailsDialog";
import OrderPdfViewer from "@/components/orders/OrderPdfViewer";

export default function OrdersPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  // State for order details dialog
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // State for invoice dialog
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] =
    useState<Order | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  // Use nuqs to manage page state from URL
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );

  // Remove page query param from URL on initial mount and cleanup on unmount
  useEffect(() => {
    if (currentPage === 1) {
      setCurrentPage(null);
    }

    // Cleanup: remove page param when component unmounts
    return () => {
      setCurrentPage(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Default filters for comparison
  const defaultFilters: OrdersRequest = {
    status: "all",
    payment_status: "all",
    date_from: "",
    date_to: "",
    per_page: 10,
    sort_by: "created_at",
    sort_direction: "desc",
    page: 1,
  };

  // Filters state
  const [filters, setFilters] = useState<OrdersRequest>(defaultFilters);

  // Get orders data - merge filters with currentPage from URL
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetOrdersQuery({ ...filters, page: currentPage });

  // Get orders statistics
  const {
    data: statisticsResponse,
    isLoading: isStatisticsLoading,
    error: statisticsError,
  } = useGetOrdersStatisticsQuery();

  // Handle filter changes
  const handleFilterChange = (
    key: keyof OrdersRequest,
    value: string | number | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
    // Reset page in URL to 1 when filters change
    setCurrentPage(1);
  };

  // Check if filters have changed from default
  const hasFiltersChanged = () => {
    return (
      filters.status !== defaultFilters.status ||
      filters.payment_status !== defaultFilters.payment_status ||
      filters.date_from !== defaultFilters.date_from ||
      filters.date_to !== defaultFilters.date_to ||
      filters.per_page !== defaultFilters.per_page ||
      filters.sort_by !== defaultFilters.sort_by ||
      filters.sort_direction !== defaultFilters.sort_direction
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(defaultFilters);
    // Reset page in URL to 1 when clearing filters
    setCurrentPage(1);
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    const perPage = parseInt(value);
    setFilters((prev) => ({ ...prev, per_page: perPage, page: 1 }));
    // Reset page in URL to 1 when per_page changes
    setCurrentPage(1);
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle view order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  // Handle view invoice
  const handleViewInvoice = (order: Order) => {
    setSelectedOrderForInvoice(order);
    setIsInvoiceDialogOpen(true);
  };

  const orders = ordersResponse?.data?.items || [];
  const pagination = ordersResponse?.data?.pagination;
  const statistics = statisticsResponse?.data?.statistics;

  return (
    <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${
          isRTL ? "sm:flex-row" : ""
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("orders.title")}
        </h2>{" "}
        {/* Filter Actions */}
        <div
          className={`flex gap-2 items-center`}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}
            variant="secondary"
            size="sm"
            disabled={!hasFiltersChanged()}
          >
            {t("orders.filters.clear")}
          </Button>
        </div>
      </div>

      {/* Filters - Accordion */}
      <Accordion
        type="single"
        collapsible
        className="bg-white border border-gray-200 rounded-lg mb-6"
      >
        <AccordionItem value="filters" className="border-0">
          <AccordionTrigger className="px-4 sm:px-6 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}
              >
                <Filter size={20} className="text-gray-600" />
                <h3 className="font-medium text-gray-900">
                  {t("orders.filters.title")}
                </h3>
                {hasFiltersChanged() && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {t("orders.filters.active", "Active")}
                  </span>
                )}
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <FormSelect
                label={t("orders.filters.status")}
                value={filters.status}
                onValueChange={(value: string) =>
                  handleFilterChange("status", value)
                }
                options={[
                  { value: "all", label: t("orders.filters.allStatuses") },
                  { value: "pending", label: t("orders.statuses.pending") },
                  { value: "paid", label: t("orders.statuses.paid") },
                  {
                    value: "processing",
                    label: t("orders.statuses.processing"),
                  },
                  { value: "shipped", label: t("orders.statuses.shipped") },
                  { value: "completed", label: t("orders.statuses.completed") },
                  { value: "cancelled", label: t("orders.statuses.cancelled") },
                  { value: "refunded", label: t("orders.statuses.refunded") },
                ]}
              />

              {/* Payment Status Filter */}
              <FormSelect
                label={t("orders.filters.paymentStatus")}
                value={filters.payment_status}
                onValueChange={(value: string) =>
                  handleFilterChange("payment_status", value)
                }
                options={[
                  {
                    value: "all",
                    label: t("orders.filters.allPaymentStatuses"),
                  },
                  {
                    value: "pending",
                    label: t("orders.paymentStatuses.pending"),
                  },
                  { value: "paid", label: t("orders.paymentStatuses.paid") },
                  {
                    value: "failed",
                    label: t("orders.paymentStatuses.failed"),
                  },
                  {
                    value: "refunded",
                    label: t("orders.paymentStatuses.refunded"),
                  },
                ]}
              />

              {/* Date From Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("orders.filters.dateFrom")}
                </label>
                <Input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) =>
                    handleFilterChange("date_from", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFilterChange("date_to", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort and Per Page */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Sort By */}
              <FormSelect
                label={t("orders.filters.sortBy")}
                value={filters.sort_by}
                onValueChange={(value: string) =>
                  handleFilterChange("sort_by", value)
                }
                options={[
                  { value: "created_at", label: t("orders.filters.createdAt") },
                  {
                    value: "order_number",
                    label: t("orders.filters.orderNumber"),
                  },
                  { value: "total", label: t("orders.filters.total") },
                  { value: "status", label: t("orders.filters.status") },
                ]}
              />

              {/* Sort Direction */}
              <FormSelect
                label={t("orders.filters.sortDirection")}
                value={filters.sort_direction}
                onValueChange={(value: string) =>
                  handleFilterChange("sort_direction", value)
                }
                options={[
                  { value: "desc", label: t("orders.filters.descending") },
                  { value: "asc", label: t("orders.filters.ascending") },
                ]}
              />

              {/* Per Page */}
              <FormSelect
                label={t("orders.filters.perPage")}
                value={filters.per_page?.toString()}
                onValueChange={handlePerPageChange}
                options={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                ]}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Order Stats */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#b3984a]/10 p-4 rounded-lg text-center border border-[#b3984a]/20">
            <div className="text-2xl font-bold text-[#b3984a]">
              {statistics.total_orders}
            </div>
            <div className="text-sm text-[#272627] font-medium">
              {t("orders.stats.totalOrders")}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {statistics.completed_orders}
            </div>
            <div className="text-sm text-gray-600">
              {t("orders.stats.completedOrders")}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {statistics.pending_orders}
            </div>
            <div className="text-sm text-gray-600">
              {t("orders.stats.pendingOrders")}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {statistics.cancelled_orders}
            </div>
            <div className="text-sm text-gray-600">
              {t("orders.stats.cancelledOrders")}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Loading State */}
      {isStatisticsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg text-center animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics Error State */}
      {statisticsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-600 text-sm">
            {t(
              "orders.error.statisticsLoadFailed",
              "Failed to load statistics"
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
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

      {/* Orders List - Simplified */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  {/* Order Basic Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon size={16} className={statusInfo.color} />
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          {t("orders.orderNumber")}
                        </div>
                        <div className="font-medium font-mono">
                          {order.order_number}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          {t("orders.total")}
                        </div>
                        <div className="font-medium text-md text-blue-600">
                          {order.pricing.total} {isRTL ? "ر.س" : "SAR"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          {t("orders.items")}
                        </div>
                        <div className="font-medium">
                          {order.total_items} {t("orders.item")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className={`flex flex-col gap-2 ${isRTL ? "mr-4" : "ml-4"}`}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center gap-2 min-w-[100px]"
                    >
                      <Eye size={14} />
                      {t("orders.viewDetails")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewInvoice(order)}
                      className="flex items-center gap-2 min-w-[100px] border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FileText size={14} />
                      {isRTL ? "تحميل الفاتورة" : "Download Invoice"}
                    </Button>
                    {/* <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReorder(order)}
                      className="flex items-center gap-2 min-w-[100px]"
                    >
                      <ShoppingCart size={14} />
                      {t("orders.reorder")}
                    </Button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="mt-8">
          <CustomPagination
            totalItems={pagination.total}
            itemsPerPage={pagination.per_page}
          />
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

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedOrder(null);
        }}
        isRTL={isRTL}
      />

      {/* Invoice PDF Viewer Dialog */}
      <OrderPdfViewer
        isOpen={isInvoiceDialogOpen}
        onClose={() => {
          setIsInvoiceDialogOpen(false);
          setSelectedOrderForInvoice(null);
        }}
        orderData={selectedOrderForInvoice}
      />
    </div>
  );
}
