"use client";

import { useState } from "react";
import {
  FileText,
  Filter,
  Calendar,
  Clock,
  Package,
  Car,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  PlayCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormSelect from "@/components/ui/FormSelect";
import { useGetRequestsQuery, useApproveRequestMutation } from "@/services/api";
import { Loader2 } from "lucide-react";
import type {
  RequestResponse,
  RequestItemResponse,
} from "@/services/api/requestsApi";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { redirectToCompleteRegistration } from "@/lib/registrationRedirect";
import Image from "next/image";

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
  const { user } = useAuth();
  const { isRegistrationComplete } = useAuthContext();
  const router = useRouter();
  const { currentLocale } = useLocale();
  // Default filters for comparison
  const defaultFilters = {
    status: "all" as const,
    date_from: "",
    date_to: "",
    per_page: 10,
    page: 1,
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
    page: number;
  }>(defaultFilters);

  const {
    data: requestsResponse,
    isLoading,
    error,
    refetch,
  } = useGetRequestsQuery(filters);

  const [approveRequest, { isLoading: isApproving }] =
    useApproveRequestMutation();

  const requests: RequestResponse[] = requestsResponse?.data?.requests || [];
  const pagination = requestsResponse?.data?.pagination;

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
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePerPageChange = (newPerPage: string) => {
    setFilters((prev) => ({
      ...prev,
      per_page: parseInt(newPerPage),
      page: 1, // Reset to first page when per_page changes
    }));
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
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

  // Get user type from auth or request data
  const getUserType = (): "shop" | "workshop" => {
    if (user?.type) {
      return user.type as "shop" | "workshop";
    }
    // Fallback to first request's user type if available
    if (requests.length > 0) {
      return requests[0].user_type;
    }
    return "shop"; // Default fallback
  };

  const userType = getUserType();
  const isWorkshop = userType === "workshop";

  const handleApproveRequest = async (
    requestId: number,
    status: "accepted" | "rejected"
  ) => {
    try {
      await approveRequest({
        requestId,
        data: { status },
      }).unwrap();
      // The query will automatically refetch due to invalidatesTags
    } catch (error) {
      console.error("Failed to approve/reject request:", error);
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
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6  `}
      >
        <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t("requests.title", "Requests")}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <div
          className={`flex items-center justify-between mb-4 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">
              {t("requests.filters.title", "Filters")}
            </h3>
          </div>

          {/* Filter Actions */}
          <div className={`flex gap-2 ${isRTL ? "flex-row" : ""}`}>
            <Button
              onClick={clearFilters}
              variant="secondary"
              disabled={!hasFiltersChanged()}
            >
              {t("requests.filters.clear", "Clear Filters")}
            </Button>
          </div>
        </div>

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
              { value: "draft", label: t("requests.status.draft", "Draft") },
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
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
              className={`w-full h-12 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                isRTL ? "text-right" : "text-left"
              }`}
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
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              className={`w-full h-12 px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                isRTL ? "text-right" : "text-left"
              }`}
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
      </div>

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
          {requests.map((request: RequestResponse) => (
            <div key={request.id} className="bg-white rounded-lg border p-6">
              {/* Request Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      {t("requests.id", "ID")}:
                    </span>
                    <span className="font-mono text-gray-900">
                      #{request.id}
                    </span>
                  </div>
                  {isWorkshop && request.workshop_code && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        {t("requests.workshopCode", "Workshop Code")}:
                      </span>
                      <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {request.workshop_code}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${
                      statusColors[request.status as keyof typeof statusColors]
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent =
                          statusIcons[
                            request.status as keyof typeof statusIcons
                          ];
                        return IconComponent ? (
                          <IconComponent size={14} />
                        ) : null;
                      })()}
                      {getStatusLabel(request.status)}
                    </div>
                  </span>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {t("requests.createdAt", "Created")}:{" "}
                    {formatDate(request.created_at)}
                  </span>
                </div>

                {request.submitted_at && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t("requests.submittedAt", "Submitted")}:{" "}
                      {formatDate(request.submitted_at)}
                    </span>
                  </div>
                )}

                {request.price && (
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t("requests.totalPrice", "Total Price")}: $
                      {request.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Submitted Requests */}
              {request.status === "submitted" && request.can_be_submitted && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">
                          {t(
                            "requests.adminPricing.title",
                            "Admin has priced your request"
                          )}
                        </h4>
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
                        onClick={() =>
                          handleApproveRequest(request.id, "rejected")
                        }
                        variant="outline"
                        size="sm"
                        disabled={isApproving}
                        className="border-red-300 text-red-700  "
                      >
                        {isApproving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {t("requests.actions.reject", "Reject")}
                      </Button>
                      <Button
                        onClick={() =>
                          handleApproveRequest(request.id, "accepted")
                        }
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

              {/* Request Items */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-[#b3984a] rounded-full"></div>
                  <h4 className="text-lg font-semibold text-[#272627]">
                    {t("requests.items.title", "Request Items")}
                  </h4>
                  <span className="bg-[#b3984a] text-white text-sm font-medium px-3 py-1 rounded-full">
                    {request.items.length}
                  </span>
                </div>

                <div className="grid gap-4">
                  {request.items.map(
                    (item: RequestItemResponse, index: number) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#b3984a]/30"
                      >
                        {/* Item Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#b3984a]/10 rounded-lg flex items-center justify-center">
                              <Package size={20} className="text-[#b3984a]" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-[#272627] text-base">
                                {item.part_name}
                              </h5>
                              <p className="text-sm text-gray-500">
                                {t("requests.items.itemNumber", "Item")} #
                                {index + 1}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="bg-[#b3984a] text-white text-sm font-medium px-3 py-1 rounded-full">
                              {t("requests.items.quantity", "Qty")}:{" "}
                              {item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Item Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {isWorkshop && item.chassis_number && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Car
                                size={16}
                                className="text-[#b3984a] flex-shrink-0"
                              />
                              <div>
                                <span className="text-xs text-gray-500 block">
                                  {t(
                                    "requests.items.chassisNumber",
                                    "Chassis Number"
                                  )}
                                </span>
                                <span className="text-sm font-medium text-[#272627]">
                                  {item.chassis_number}
                                </span>
                              </div>
                            </div>
                          )}

                          {item.price && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <DollarSign
                                size={16}
                                className="text-green-600 flex-shrink-0"
                              />
                              <div>
                                <span className="text-xs text-green-600 block">
                                  {t("requests.items.unitPrice", "Unit Price")}
                                </span>
                                <span className="text-sm font-medium text-green-800">
                                  ${item.price}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar
                              size={16}
                              className="text-[#b3984a] flex-shrink-0"
                            />
                            <div>
                              <span className="text-xs text-gray-500 block">
                                {t("requests.items.created", "Created")}
                              </span>
                              <span className="text-sm font-medium text-[#272627]">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Item Images - Enhanced display for workshop users */}
                        {isWorkshop &&
                          (item.part_image_url ||
                            item.order_image_url ||
                            item.form_image_url) && (
                            <div className="border-t border-gray-200 pt-4">
                              <h6 className="text-sm font-medium text-[#272627] mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#b3984a] rounded-full"></span>
                                {t("requests.items.attachments", "Attachments")}
                              </h6>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {item.part_image_url && (
                                  <div className="group">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs font-medium text-[#b3984a] bg-[#b3984a]/10 px-2 py-1 rounded">
                                        {t("requests.items.partImage", "Part")}
                                      </span>
                                    </div>
                                    <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 group-hover:border-[#b3984a] transition-colors duration-200">
                                      <Image
                                        src={item.part_image_url}
                                        alt="Part Image"
                                        width={120}
                                        height={120}
                                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                                    </div>
                                  </div>
                                )}

                                {item.order_image_url && (
                                  <div className="group">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs font-medium text-[#b3984a] bg-[#b3984a]/10 px-2 py-1 rounded">
                                        {t(
                                          "requests.items.orderImage",
                                          "Order"
                                        )}
                                      </span>
                                    </div>
                                    <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 group-hover:border-[#b3984a] transition-colors duration-200">
                                      <Image
                                        src={item.order_image_url}
                                        alt="Order Image"
                                        width={120}
                                        height={120}
                                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                                    </div>
                                  </div>
                                )}

                                {item.form_image_url && (
                                  <div className="group">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-xs font-medium text-[#b3984a] bg-[#b3984a]/10 px-2 py-1 rounded">
                                        {t("requests.items.formImage", "Form")}
                                      </span>
                                    </div>
                                    <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 group-hover:border-[#b3984a] transition-colors duration-200">
                                      <Image
                                        src={item.form_image_url}
                                        alt="Form Image"
                                        width={120}
                                        height={120}
                                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>

                {/* Price Summary for Priced Requests */}
                {request.price && request.items.some((item) => item.price) && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign size={16} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-green-900">
                            {t("requests.priceSummary.title", "Price Summary")}
                          </h4>
                          <p className="text-xs text-green-700">
                            {t(
                              "requests.priceSummary.description",
                              "Total calculated by admin"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-800">
                          ${request.price}
                        </div>
                        <div className="text-xs text-green-600">
                          {t("requests.priceSummary.total", "Total Amount")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-500">
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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
            >
              <ChevronLeft size={16} />
              {t("requests.pagination.previous", "Previous")}
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
              disabled={pagination.current_page >= pagination.last_page}
            >
              {t("requests.pagination.next", "Next")}
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
