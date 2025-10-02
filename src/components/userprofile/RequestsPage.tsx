"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Filter,
  Package,
  CheckCircle,
  XCircle,
  PlayCircle,
  Clock as ClockIcon,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { useGetRequestsQuery, useApproveRequestMutation } from "@/services/api";
import type { RequestResponse } from "@/services/api/requestsApi";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { redirectToCompleteRegistration } from "@/lib/registrationRedirect";
import AcceptRequestDialog from "./AcceptRequestDialog";
import RejectConfirmDialog from "./RejectConfirmDialog";
import type { ApproveRequestRequest } from "@/services/api/requestsApi";
import { showSuccess, showError } from "@/lib/toast";

const statusColors = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  submitted: "bg-blue-100 text-blue-800 border-blue-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const statusIcons = {
  draft: FileText,
  pending: ClockIcon,
  submitted: PlayCircle,
  accepted: CheckCircle,
  rejected: XCircle,
  completed: CheckCircle,
};

export default function RequestsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";
  const { isRegistrationComplete } = useAuthContext();
  const router = useRouter();
  const { currentLocale } = useLocale();

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
  const defaultFilters = {
    status: "all" as const,
    date_from: "",
    date_to: "",
    per_page: 10,
  };

  const [filters, setFilters] = useState<{
    status:
      | "all"
      | "draft"
      | "pending"
      | "submitted"
      | "accepted"
      | "rejected"
      | "completed";
    date_from: string;
    date_to: string;
    per_page: number;
  }>(defaultFilters);

  // Get requests data - merge filters with currentPage from URL
  const queryParams = { ...filters, page: currentPage };
  console.log("RequestsPage - Query Params:", queryParams);
  console.log("RequestsPage - currentPage:", currentPage);
  console.log("RequestsPage - filters:", filters);

  const {
    data: requestsResponse,
    isLoading,
    error,
    refetch,
  } = useGetRequestsQuery(queryParams);

  const [approveRequest, { isLoading: isApproving }] =
    useApproveRequestMutation();

  // Dialog state
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<number | null>(null);

  console.log("RequestsPage - Response:", requestsResponse);
  console.log("RequestsPage - Error:", error);
  console.log("RequestsPage - isLoading:", isLoading);

  const requests: RequestResponse[] = requestsResponse?.data?.requests || [];
  const pagination = requestsResponse?.data?.pagination;

  console.log("RequestsPage - Requests:", requests);
  console.log("RequestsPage - Pagination:", pagination);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        key === "status"
          ? (value as
              | "all"
              | "draft"
              | "pending"
              | "submitted"
              | "accepted"
              | "rejected"
              | "completed")
          : value,
    }));
    // Reset page in URL to 1 when filters change
    setCurrentPage(1);
  };

  const handlePerPageChange = (newPerPage: string) => {
    setFilters((prev) => ({
      ...prev,
      per_page: parseInt(newPerPage),
    }));
    // Reset page in URL to 1 when per_page changes
    setCurrentPage(1);
  };

  // Check if filters have changed from default
  const hasFiltersChanged = () => {
    return (
      filters.status !== defaultFilters.status ||
      filters.date_from !== defaultFilters.date_from ||
      filters.date_to !== defaultFilters.date_to ||
      filters.per_page !== defaultFilters.per_page
    );
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    // Reset page in URL to 1 when clearing filters
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      draft: t("requests.status.draft", "Draft"),
      pending: t("requests.status.pending", "Pending"),
      submitted: t("requests.status.submitted", "Submitted"),
      accepted: t("requests.status.accepted", "Accepted"),
      rejected: t("requests.status.rejected", "Rejected"),
      completed: t("requests.status.completed", "Completed"),
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const handleAcceptRequest = (requestId: number) => {
    setPendingRequestId(requestId);
    setIsAcceptDialogOpen(true);
  };

  const handleRejectRequest = (requestId: number) => {
    setPendingRequestId(requestId);
    setIsRejectDialogOpen(true);
  };

  const handleAcceptConfirm = async (data: {
    address_id?: number;
    payment_method: "cash" | "credit_card";
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    apartment?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
    notes?: string;
  }) => {
    if (!pendingRequestId) return;

    try {
      const requestData: ApproveRequestRequest = {
        status: "accepted",
        payment_method: data.payment_method,
      };

      // Add address data
      if (data.address_id) {
        requestData.address_id = data.address_id;
      } else {
        // Add all new address fields
        Object.assign(requestData, {
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          address: data.address,
          apartment: data.apartment,
          city: data.city,
          state: data.state,
          country: data.country,
          zip_code: data.zip_code,
        });
      }

      const response = await approveRequest({
        requestId: pendingRequestId,
        data: requestData,
      }).unwrap();

      // Close dialog
      setIsAcceptDialogOpen(false);
      setPendingRequestId(null);

      // If payment method is credit_card and we got a payment URL, redirect to it
      if (
        data.payment_method === "credit_card" &&
        response?.data?.payment_url
      ) {
        window.location.href = response.data.payment_url;
      } else {
        // Show success toast for cash payment
        if (response?.code === 200) {
          const successMessage = isRTL
            ? "تم قبول الطلب بنجاح"
            : t(
                "requests.acceptDialog.successMessage",
                "Request accepted successfully"
              );
          showSuccess(successMessage);
        }
      }
    } catch {
      // Show error toast
      const errorMessage = isRTL
        ? "فشل قبول الطلب. يرجى المحاولة مرة أخرى"
        : t(
            "requests.acceptDialog.errorMessage",
            "Failed to accept request. Please try again"
          );
      showError(errorMessage);
    }
  };

  const handleRejectConfirm = async () => {
    if (!pendingRequestId) return;

    try {
      const response = await approveRequest({
        requestId: pendingRequestId,
        data: { status: "rejected" },
      }).unwrap();

      // Close dialog
      setIsRejectDialogOpen(false);
      setPendingRequestId(null);

      // Show success toast based on status code
      if (response?.code === 200) {
        const successMessage = isRTL
          ? "تم رفض الطلب بنجاح"
          : t(
              "requests.rejectDialog.successMessage",
              "Request rejected successfully"
            );
        showSuccess(successMessage);
      }
    } catch {
      // Show error toast
      const errorMessage = isRTL
        ? "فشل رفض الطلب. يرجى المحاولة مرة أخرى"
        : t(
            "requests.rejectDialog.errorMessage",
            "Failed to reject request. Please try again"
          );
      showError(errorMessage);
    }
  };

  const handleCompleteRegistration = () => {
    const currentPath = window.location.pathname;
    redirectToCompleteRegistration(
      currentPath,
      "requests",
      router,
      currentLocale
    );
  };

  // Check if registration is complete, if not show informative message
  if (!isRegistrationComplete) {
    return (
      <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t(
                "requests.registrationRequired.title",
                "Complete Registration Required"
              )}
            </h2>
            <p className="text-gray-600 mb-6">
              {t(
                "requests.registrationRequired.description",
                "To access your requests, please complete your registration first."
              )}
            </p>
          </div>
          <Button onClick={handleCompleteRegistration} className="w-full">
            {t("requests.registrationRequired.button", "Complete Registration")}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">
          <XCircle size={64} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("requests.error.title", "Error Loading Requests")}
        </h3>
        <p className="text-gray-500 mb-4">
          {t(
            "requests.error.description",
            "Failed to load requests. Please try again."
          )}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          {t("requests.error.retry", "Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${
          isRTL ? "sm:flex-row" : ""
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("requests.title", "Requests")}
        </h2>
        {/* Filter Actions */}
        <div className={`flex gap-2 items-center`}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}
            variant="secondary"
            size="sm"
            disabled={!hasFiltersChanged()}
          >
            {t("requests.filters.clear", "Clear Filters")}
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
                  {t("requests.filters.title", "Filters")}
                </h3>
                {hasFiltersChanged() && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {t("requests.filters.active", "Active")}
                  </span>
                )}
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <FormSelect
                label={t("requests.filters.status", "Status")}
                value={filters.status}
                onValueChange={(value: string) =>
                  handleFilterChange("status", value)
                }
                options={[
                  {
                    value: "all",
                    label: t("requests.filters.allStatuses", "All Statuses"),
                  },
                  {
                    value: "draft",
                    label: t("requests.status.draft", "Draft"),
                  },
                  {
                    value: "pending",
                    label: t("requests.status.pending", "Pending"),
                  },
                  {
                    value: "submitted",
                    label: t("requests.status.submitted", "Submitted"),
                  },
                  {
                    value: "accepted",
                    label: t("requests.status.accepted", "Accepted"),
                  },
                  {
                    value: "rejected",
                    label: t("requests.status.rejected", "Rejected"),
                  },
                  {
                    value: "completed",
                    label: t("requests.status.completed", "Completed"),
                  },
                ]}
              />

              {/* Date From Filter */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium text-gray-700 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("requests.filters.dateFrom", "Date From")}
                </label>
                <Input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) =>
                    handleFilterChange("date_from", e.target.value)
                  }
                  className={`w-full `}
                />
              </div>

              {/* Date To Filter */}
              <div className="space-y-2">
                <label
                  className={`block text-sm font-medium text-gray-700 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("requests.filters.dateTo", "Date To")}
                </label>
                <Input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) =>
                    handleFilterChange("date_to", e.target.value)
                  }
                  className={`w-full`}
                />
              </div>

              {/* Per Page Filter */}
              <FormSelect
                label={t("requests.filters.perPage", "Per Page")}
                value={filters.per_page.toString()}
                onValueChange={handlePerPageChange}
                options={[
                  { value: "10", label: "10" },
                  { value: "25", label: "25" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                ]}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("requests.empty.title", "No Requests Found")}
          </h3>
          <p className="text-gray-500">
            {t(
              "requests.empty.description",
              "No requests match your current filters."
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request: RequestResponse) => {
            const statusInfo = (() => {
              const IconComponent =
                statusIcons[request.status as keyof typeof statusIcons];
              return {
                icon: IconComponent || FileText,
                colorClass:
                  statusColors[request.status as keyof typeof statusColors] ||
                  statusColors.draft,
              };
            })();
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={request.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                {/* Request Header - Simplified */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        size={16}
                        className={statusInfo.colorClass.split(" ")[1]}
                      />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.colorClass}`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </div>
                  </div>
                  <div className="text-sm font-mono text-gray-600">
                    #{request.id}
                  </div>
                </div>

                {/* Request Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      {t("requests.items.title", "Items")}
                    </div>
                    <div className="font-medium">
                      {request.items.length}{" "}
                      {t("requests.items.title", "Items")}
                    </div>
                  </div>

                  {request.price && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        {t("requests.totalPrice", "Total Price")}
                      </div>
                      <div className="font-medium text-md text-blue-600">
                        {request.price} {isRTL ? "ر.س" : "SAR"}
                      </div>
                    </div>
                  )}

                  {request.payment_method && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        {t("requests.paymentMethod", "Payment Method")}
                      </div>
                      <div className="font-medium capitalize">
                        {request.payment_method === "cash"
                          ? t("requests.paymentMethods.cash", "Cash")
                          : t(
                              "requests.paymentMethods.creditCard",
                              "Credit Card"
                            )}
                      </div>
                    </div>
                  )}

                  {request.payment_status && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        {t("requests.paymentStatus", "Payment Status")}
                      </div>
                      <div className="font-medium capitalize">
                        {t(
                          `requests.paymentStatuses.${request.payment_status}`,
                          request.payment_status
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Submitted Requests */}
                {request.status === "submitted" && request.can_be_submitted && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            {t(
                              "requests.adminPricing.title",
                              "Admin has priced your request"
                            )}
                          </p>
                          <p className="text-xs text-blue-700">
                            {t(
                              "requests.adminPricing.description",
                              "Please review and accept or reject the pricing"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          variant="outline"
                          size="sm"
                          disabled={isApproving}
                          className="border-red-300 text-red-700"
                        >
                          {isApproving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {t("requests.actions.reject", "Reject")}
                        </Button>
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          size="sm"
                          disabled={isApproving}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isApproving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          {t("requests.actions.accept", "Accept")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Info for Accepted Requests */}
                {request.has_address_details && request.formatted_address && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Package size={16} className="text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-1">
                          {t("requests.shippingAddress", "Shipping Address")}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {request.full_name}
                        </p>
                        <p className="text-sm text-gray-700">
                          {request.formatted_address}
                        </p>
                        {request.phone && (
                          <p className="text-sm text-gray-700">
                            {request.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Request Items Accordion */}
                {request.items && request.items.length > 0 && (
                  <div className="mt-3">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="items" className="border-0">
                        <AccordionTrigger className="py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg hover:no-underline">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-primary" />
                            <span className="text-sm font-medium text-gray-900">
                              {t("requests.items.title", "Request Items")} (
                              {request.items.length})
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 px-1">
                          <div className="space-y-3">
                            {request.items.map((item, index) => (
                              <div
                                key={item.id}
                                className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors"
                              >
                                {/* Item Header */}
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium text-gray-500">
                                        #{index + 1}
                                      </span>
                                      <h6 className="text-sm font-semibold text-gray-900">
                                        {item.part_name}
                                      </h6>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                      <span>
                                        {t("requests.items.quantity", "Qty")}:{" "}
                                        {item.quantity}
                                      </span>
                                      {item.chassis_number && (
                                        <span>
                                          {t(
                                            "requests.items.chassisNumber",
                                            "Chassis"
                                          )}
                                          : {item.chassis_number}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {item.price && (
                                    <div className="text-right">
                                      <div className="text-sm font-bold text-blue-600">
                                        {item.price} {isRTL ? "ر.س" : "SAR"}
                                      </div>
                                      {item.price_without_tax && (
                                        <div className="text-xs text-gray-500">
                                          {t("requests.items.tax", "Tax")}:{" "}
                                          {item.tax.toFixed(2)}{" "}
                                          {isRTL ? "ر.س" : "SAR"}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Item Images */}
                                {(item.part_image_url ||
                                  item.order_image_url ||
                                  item.form_image_url) && (
                                  <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
                                    {item.part_image_url && (
                                      <a
                                        href={item.part_image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        {t(
                                          "requests.items.partImage",
                                          "Part Image"
                                        )}
                                      </a>
                                    )}
                                    {item.order_image_url && (
                                      <a
                                        href={item.order_image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        {t(
                                          "requests.items.orderImage",
                                          "Order Image"
                                        )}
                                      </a>
                                    )}
                                    {item.form_image_url && (
                                      <a
                                        href={item.form_image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        {t(
                                          "requests.items.formImage",
                                          "Form Image"
                                        )}
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                )}
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
        <div className="  mt-4 text-sm text-gray-600">
          {t(
            "requests.pagination.showing",
            "Showing {{from}}-{{to}} of {{total}} results",
            {
              from: pagination.from,
              to: pagination.to,
              total: pagination.total,
            }
          )}
        </div>
      )}

      {/* Accept Request Dialog */}
      <AcceptRequestDialog
        isOpen={isAcceptDialogOpen}
        onClose={() => {
          setIsAcceptDialogOpen(false);
          setPendingRequestId(null);
        }}
        onConfirm={handleAcceptConfirm}
        isLoading={isApproving}
      />

      {/* Reject Confirmation Dialog */}
      <RejectConfirmDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setPendingRequestId(null);
        }}
        onConfirm={handleRejectConfirm}
        isLoading={isApproving}
      />
    </div>
  );
}
