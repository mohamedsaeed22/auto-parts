"use client";

import { useState } from "react";
import {
  Wallet,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useGetPointsTransactionsQuery } from "@/services/api/pointsApi";

export default function PointsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch points transactions
  const {
    data: pointsResponse,
    isLoading,
    error,
    refetch,
  } = useGetPointsTransactionsQuery();

  type TransactionWithType = {
    id: number;
    type: "credit" | "debit";
    points: number;
    reason: string;
    formatted_date: string;
  };

  type PaginationInfo = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };

  type PointsApiResponse = {
    data?: {
      items: TransactionWithType[];
      pagination: PaginationInfo;
    };
    points?: number;
  };

  // Get points icon and color based on transaction type
  const getPointsInfo = (type: string) => {
    if (type === "credit") {
      return {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-100",
        sign: "+",
      } as const;
    }
    return {
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100",
      sign: "-",
    } as const;
  };

  const typedResponse = pointsResponse as unknown as PointsApiResponse;
  const points = typedResponse?.data?.items || [];
  const pagination = typedResponse?.data?.pagination;

  // Use total points from API response directly
  const totalPoints = typedResponse?.points ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${
          isRTL ? "sm:flex-row" : ""
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("points.title")}
        </h2>
      </div>

      {/* Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-[#b3984a] to-[#d4af37] p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">
                {t("points.totalPoints")}
              </p>
              <p className="text-2xl font-bold">{totalPoints}</p>
            </div>
            <Wallet className="w-8 h-8 opacity-80" />
          </div>
        </div>

        {/* <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {t("points.totalTransactions")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination?.total || 0}
              </p>
            </div>
            <Award className="w-8 h-8 text-gray-400" />
          </div>
        </div> */}

        {/* <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {t("points.thisMonth")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {points
                  .filter((p) => {
                    const transactionDate = new Date(p.formatted_date);
                    const now = new Date();
                    return (
                      transactionDate.getMonth() === now.getMonth() &&
                      transactionDate.getFullYear() === now.getFullYear()
                    );
                  })
                  .reduce((sum, transaction) => sum + transaction.points, 0)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
        </div> */}
      </div>

      {/* Points Transactions */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("points.transactions.title")}
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">{t("points.loading")}</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-600 mb-4">{t("points.error")}</p>
            <Button onClick={() => refetch()} variant="outline">
              {t("points.retry")}
            </Button>
          </div>
        ) : points.length === 0 ? (
          <div className="p-6 text-center">
            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{t("points.noTransactions")}</p>
            <p className="text-sm text-gray-500">
              {t("points.noTransactionsDesc")}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {t("points.transactions.date")}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {t("points.transactions.reason")}
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {t("points.transactions.points")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {points.map((transaction) => {
                    const pointsInfo = getPointsInfo(transaction.type);
                    const PointsIcon = pointsInfo.icon;

                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {transaction.formatted_date}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pointsInfo.bg} ${pointsInfo.color}`}
                            >
                              <PointsIcon className="w-3 h-3 mr-1" />
                              {pointsInfo.sign}
                              {transaction.points}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {points.map((transaction) => {
                const pointsInfo = getPointsInfo(transaction.type);
                const PointsIcon = pointsInfo.icon;

                return (
                  <div
                    key={transaction.id}
                    className="p-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {transaction.formatted_date}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pointsInfo.bg} ${pointsInfo.color}`}
                      >
                        <PointsIcon className="w-3 h-3 mr-1" />
                        {pointsInfo.sign}
                        {transaction.points}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {transaction.reason}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="text-sm text-gray-700">
                    {t("points.pagination.showing", {
                      from: pagination.from,
                      to: pagination.to,
                      total: pagination.total,
                    })}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-700">
                      {t("points.pagination.page", {
                        current: pagination.current_page,
                        total: pagination.last_page,
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.last_page}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
