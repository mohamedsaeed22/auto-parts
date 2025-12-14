"use client";

import { useEffect, useState } from "react";
import {
  Wallet,
  Calendar,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useGetPointsTransactionsQuery } from "@/services/api/pointsApi";

export default function PointsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";
  const [isRefetching, setIsRefetching] = useState(false);

  // Fetch points transactions
  const {
    data: pointsResponse,
    isLoading,
    error,
    refetch,
  } = useGetPointsTransactionsQuery();

  // Refetch when language changes
  useEffect(() => {
    const refetchData = async () => {
      setIsRefetching(true);
      await refetch();
      setIsRefetching(false);
    };
    refetchData();
  }, [i18n.language, refetch]);

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

      {/* Points Summary Card */}
      <div className="bg-gradient-to-r from-[#b3984a] to-[#d4af37] p-6 rounded-lg text-white mb-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">{t("points.totalPoints")}</p>
            <p className="text-3xl font-bold">{totalPoints}</p>
            <p className="text-xs opacity-80 mt-1">
              {t("points.availableBalance", "Available Balance")}
            </p>
          </div>
          <Wallet className="w-12 h-12 opacity-80" />
        </div>
      </div>

      {/* Transactions Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("points.transactions.title")}
        </h3>
        {pagination && pagination.total > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {t("points.totalTransactions")}: {pagination.total}
          </p>
        )}
      </div>

      {/* Loading State */}
      {(isLoading || isRefetching) && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className={`${isRTL ? "mr-2" : "ml-2"} text-gray-600`}>
            {t("points.loading")}
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 text-center bg-white border border-gray-200 rounded-lg">
          <p className="text-red-600 mb-4">{t("points.error")}</p>
          <Button onClick={() => refetch()} variant="outline">
            {t("points.retry")}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && points.length === 0 && (
        <div className="p-8 text-center bg-white border border-gray-200 rounded-lg">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{t("points.noTransactions")}</p>
          <p className="text-sm text-gray-500">
            {t("points.noTransactionsDesc")}
          </p>
        </div>
      )}

      {/* Transactions List */}
      {!isLoading && !error && points.length > 0 && (
        <div className="space-y-3">
          {points.map((transaction) => {
            const pointsInfo = getPointsInfo(transaction.type);
            const PointsIcon = pointsInfo.icon;

            return (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  {/* Transaction Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${pointsInfo.bg} ${pointsInfo.color}`}
                      >
                        <PointsIcon className="w-4 h-4 mr-1" />
                        {pointsInfo.sign}
                        {transaction.points}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {transaction.formatted_date}
                      </div>
                    </div>
                    <p className="text-sm text-gray-900">
                      {transaction.reason}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Info */}
      {pagination && pagination.total > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          {t("points.pagination.showing", {
            from: pagination.from,
            to: pagination.to,
            total: pagination.total,
          })}
        </div>
      )}
    </div>
  );
}
