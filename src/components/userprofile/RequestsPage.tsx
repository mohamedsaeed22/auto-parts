"use client";

import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RequestsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-6">
        <FileText size={24} className="text-primary" />
        <h2
          className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("requests.title", "Requests")}
        </h2>
      </div>

      <div className="text-center py-12">
        <FileText size={64} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("requests.comingSoon", "Coming Soon")}
        </h3>
        <p className="text-gray-500">
          {t(
            "requests.description",
            "The requests feature will be available soon."
          )}
        </p>
      </div>
    </div>
  );
}
