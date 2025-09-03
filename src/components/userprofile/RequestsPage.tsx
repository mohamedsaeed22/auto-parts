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
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  CheckCircle,
  XCircle,
  PlayCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRequestsQuery } from "@/services/api";
import { Loader2 } from "lucide-react";

const statusColors = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  submitted: "bg-blue-100 text-blue-800 border-blue-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  draft: FileText,
  pending: ClockIcon,
  submitted: PlayCircle,
  accepted: CheckCircle,
  rejected: XCircle,
};

export default function RequestsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [filters, setFilters] = useState<{
    status: "all" | "draft" | "pending" | "submitted" | "accepted" | "rejected";
    date_from: string;
    date_to: string;
    per_page: number;
    page: number;
  }>({
    status: "all",
    date_from: "",
    date_to: "",
    per_page: 10,
    page: 1,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: requestsResponse,
    isLoading,
    error,
    refetch,
  } = useGetRequestsQuery(filters);

  const requests = requestsResponse?.data?.requests || [];
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
              | "rejected")
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

  const clearFilters = () => {
    setFilters({
      status: "all" as const,
      date_from: "",
      date_to: "",
      per_page: 10,
      page: 1,
    });
    setSearchTerm("");
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
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

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
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText size={24} className="text-primary" />
          <h2
            className={`text-2xl font-bold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("requests.title", "Requests")}
          </h2>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          {t("requests.create", "Create Request")}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-700">
            {t("requests.filters.title", "Filters")}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("requests.filters.status", "Status")}
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "requests.filters.allStatuses",
                    "All Statuses"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("requests.filters.allStatuses", "All Statuses")}
                </SelectItem>
                <SelectItem value="draft">
                  {t("requests.status.draft", "Draft")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("requests.status.pending", "Pending")}
                </SelectItem>
                <SelectItem value="submitted">
                  {t("requests.status.submitted", "Submitted")}
                </SelectItem>
                <SelectItem value="accepted">
                  {t("requests.status.accepted", "Accepted")}
                </SelectItem>
                <SelectItem value="rejected">
                  {t("requests.status.rejected", "Rejected")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("requests.filters.dateFrom", "Date From")}
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
              {t("requests.filters.dateTo", "Date To")}
            </label>
            <Input
              type="date"
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              className="w-full"
            />
          </div>

          {/* Per Page Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("requests.filters.perPage", "Per Page")}
            </label>
            <Select
              value={filters.per_page.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" onClick={clearFilters}>
            {t("requests.filters.clear", "Clear Filters")}
          </Button>
          <div className="text-sm text-gray-500">
            {t(
              "requests.filters.results",
              "Showing {{from}}-{{to}} of {{total}} results",
              {
                from: pagination?.from || 0,
                to: pagination?.to || 0,
                total: pagination?.total || 0,
              }
            )}
          </div>
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
          {requests.map((request) => (
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
                      {t("requests.price", "Price")}: ${request.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Request Items */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-3">
                  {t("requests.items.title", "Request Items")} (
                  {request.items.length})
                </h4>
                <div className="space-y-3">
                  {request.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          <span className="text-sm font-medium">
                            {item.part_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {t("requests.items.quantity", "Qty")}:
                          </span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {item.chassis_number}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {t("requests.items.created", "Created")}:
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Item Images */}
                      {(item.part_image_url ||
                        item.order_image_url ||
                        item.form_image_url) && (
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                          {item.part_image_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {t("requests.items.partImage", "Part")}:
                              </span>
                              <img
                                src={item.part_image_url}
                                alt="Part"
                                className="w-12 h-12 object-cover rounded border"
                              />
                            </div>
                          )}
                          {item.order_image_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {t("requests.items.orderImage", "Order")}:
                              </span>
                              <img
                                src={item.order_image_url}
                                alt="Order"
                                className="w-12 h-12 object-cover rounded border"
                              />
                            </div>
                          )}
                          {item.form_image_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {t("requests.items.formImage", "Form")}:
                              </span>
                              <img
                                src={item.form_image_url}
                                alt="Form"
                                className="w-12 h-12 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
