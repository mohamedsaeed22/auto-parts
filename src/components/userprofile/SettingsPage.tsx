"use client";

import { useEffect, useState } from "react";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Loader2,
  Image as ImageIcon,
  TrendingUp,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useGetCompanySettingsQuery } from "@/services/api";
import Image from "next/image";

export default function SettingsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";
  const [isRefetching, setIsRefetching] = useState(false);

  // Fetch company settings
  const {
    data: companySettingsResponse,
    isLoading,
    error,
    refetch,
  } = useGetCompanySettingsQuery();

  // Refetch when language changes
  useEffect(() => {
    const refetchData = async () => {
      setIsRefetching(true);
      await refetch();
      setIsRefetching(false);
    };
    refetchData();
  }, [i18n.language, refetch]);

  const companySettings = companySettingsResponse?.data;

  // Loading State
  if (isLoading || isRefetching) {
    return (
      <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {t("settings.title")}
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#b3984a]" />
          <span className={`${isRTL ? "mr-3" : "ml-3"} text-gray-600`}>
            {t("settings.loading")}
          </span>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !companySettings) {
    return (
      <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {t("settings.title")}
        </h2>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4 text-lg font-medium">
            {t("settings.error")}
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="border-[#b3984a] text-[#b3984a] hover:bg-[#b3984a] hover:text-white"
          >
            {t("settings.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("settings.title")}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Company Information Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-[#b3984a]" />
            {t("settings.company.title")}
          </h3>

          <div className="space-y-4">
            {/* Company Logo */}
            {companySettings.company_info.logo && (
              <div className="flex items-center gap-3 pb-4 border-b">
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    {t("settings.company.logo")}
                  </p>
                  <div className="relative w-32 h-16 bg-gray-50 rounded-lg overflow-hidden border">
                    <Image
                      src={companySettings.company_info.logo}
                      alt={companySettings.company_info.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Company Name */}
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {t("settings.company.name")}
                </p>
                <p className="font-medium text-gray-900">
                  {companySettings.company_info.name}
                </p>
              </div>
            </div>

            {/* Description */}
            {companySettings.company_info.description && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    {t("settings.company.description")}
                  </p>
                  <div
                    className="text-gray-900 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: companySettings.company_info.description,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {t("settings.company.email")}
                </p>
                <a
                  href={`mailto:${companySettings.company_info.email}`}
                  className="font-medium text-[#b3984a] hover:underline"
                >
                  {companySettings.company_info.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {t("settings.company.phone")}
                </p>
                <a
                  href={`tel:${companySettings.company_info.phone}`}
                  className="font-medium text-gray-900"
                  dir="ltr"
                >
                  {companySettings.company_info.phone}
                </a>
              </div>
            </div>

            {/* Address */}
            {companySettings.company_info.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {t("settings.company.address")}
                  </p>
                  <p className="font-medium text-gray-900">
                    {companySettings.company_info.address}
                  </p>
                </div>
              </div>
            )}

            {/* Website */}
            {companySettings.company_info.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {t("settings.company.website")}
                  </p>
                  <a
                    href={companySettings.company_info.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#b3984a] hover:underline"
                  >
                    {companySettings.company_info.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charge Information Card */}
        {(companySettings.charge_info.company ||
          companySettings.charge_info.city ||
          companySettings.charge_info.address ||
          companySettings.charge_info.phone) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#b3984a]" />
              {t("settings.charge.title")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companySettings.charge_info.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("settings.charge.company")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {companySettings.charge_info.company}
                    </p>
                  </div>
                </div>
              )}

              {companySettings.charge_info.city && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("settings.charge.city")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {companySettings.charge_info.city}
                    </p>
                  </div>
                </div>
              )}

              {companySettings.charge_info.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("settings.charge.address")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {companySettings.charge_info.address}
                    </p>
                  </div>
                </div>
              )}

              {companySettings.charge_info.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("settings.charge.phone")}
                    </p>
                    <p className="font-medium text-gray-900" dir="ltr">
                      {companySettings.charge_info.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Points & Delivery Settings Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#b3984a]" />
            {t("settings.points.title")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exchange Rate */}
            <div className="bg-gradient-to-r from-[#b3984a]/10 to-[#d4af37]/10 p-4 rounded-lg border border-[#b3984a]/20">
              <p className="text-sm text-gray-600 mb-1">
                {t("settings.points.exchangeRate")}
              </p>
              <p className="text-2xl font-bold text-[#b3984a]">
                {companySettings.points_settings.exchange_rate}
              </p>
            </div>

            {/* Request Order Points */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">
                {t("settings.points.requestOrderPoints")}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {companySettings.points_settings.request_order_points}
              </p>
            </div>

            {/* Points Per Currency */}
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">
                {t("settings.points.pointsPerCurrency")}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {companySettings.points_settings.points_per_currency}
              </p>
            </div>

            {/* Delivery Amount */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">
                {t("settings.delivery.amount")}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {companySettings.delivery_amount}{" "}
                <span className="text-base">{t("settings.delivery.sar")}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
