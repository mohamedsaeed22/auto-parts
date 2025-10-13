"use client";

import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface DeliveryAmountDisplayProps {
  isLoading: boolean;
  error: boolean;
  amount: number;
  className?: string;
}

export default function DeliveryAmountDisplay({
  isLoading,
  error,
  amount,
  className = "",
}: DeliveryAmountDisplayProps) {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  return (
    <div className={className}>
      {isLoading ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#b3984a]" />
            <p
              className={`text-sm text-gray-600 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t(
                "requests.acceptDialog.calculatingDelivery",
                "Calculating delivery amount..."
              )}
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p
            className={`text-sm text-red-800 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t(
              "requests.acceptDialog.deliveryError",
              "Failed to calculate delivery amount. Please try again."
            )}
          </p>
        </div>
      ) : amount > 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div
            className={`flex items-center justify-between ${
              isRTL ? "flex-row" : "flex-row"
            }`}
          >
            <div>
              <p
                className={`text-sm font-medium text-green-800 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t(
                  "requests.acceptDialog.deliveryAmount",
                  "Delivery Amount"
                )}
              </p>
              <p
                className={`text-xs text-green-600 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t(
                  "requests.acceptDialog.deliveryNote",
                  "This amount will be added to your total"
                )}
              </p>
            </div>
            <div
              className={`text-lg font-bold text-green-800 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {amount} {t("requests.acceptDialog.currency", "SAR")}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p
            className={`text-sm text-blue-800 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t(
              "requests.acceptDialog.freeDelivery",
              "Free delivery for this address"
            )}
          </p>
        </div>
      )}
    </div>
  );
}
