"use client";

import { useState } from "react";
import {
  Lock,
  Shield,
  Save,
  X,
  Building,
  FileText,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  useGetCompanySettingsQuery,
  useGetLegalPagesQuery,
  useGetTermsOfServiceQuery,
  useGetPrivacyPolicyQuery,
  useGetRefundPolicyQuery,
  useGetShippingPolicyQuery,
} from "@/services/api";

export default function SettingsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("company");
  const [selectedLegalPage, setSelectedLegalPage] = useState<string | null>(
    null
  );

  // User Settings State
  const [userSettings, setUserSettings] = useState({
    account: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      orderUpdates: true,
      newsletter: false,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowSearch: true,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      deviceManagement: true,
    },
    language: {
      language: "ar",
      currency: "SAR",
      timezone: "Asia/Riyadh",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userSettings);

  // API Queries
  const {
    data: companySettingsResponse,
    isLoading: isLoadingCompany,
    refetch: refetchCompany,
  } = useGetCompanySettingsQuery();
  const { data: legalPagesResponse, isLoading: isLoadingLegal } =
    useGetLegalPagesQuery();
  const { data: termsResponse, isLoading: isLoadingTerms } =
    useGetTermsOfServiceQuery();
  const { data: privacyResponse, isLoading: isLoadingPrivacy } =
    useGetPrivacyPolicyQuery();
  const { data: refundResponse, isLoading: isLoadingRefund } =
    useGetRefundPolicyQuery();
  const { data: shippingResponse, isLoading: isLoadingShipping } =
    useGetShippingPolicyQuery();

  const companySettings = companySettingsResponse?.data;
  const legalPages = legalPagesResponse?.data;

  const handleSave = () => {
    setUserSettings(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userSettings);
    setIsEditing(false);
  };

  const tabs = [
    { id: "company", labelKey: "settings.tabs.company", icon: Building },
    { id: "legal", labelKey: "settings.tabs.legal", icon: FileText },
  ];

  const renderCompanySettings = () => {
    if (isLoadingCompany) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!companySettings) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">
            Failed to load company settings
          </div>
          <p className="text-gray-600 mb-4">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
          <Button onClick={() => refetchCompany()} variant="outline">
            Retry
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Company Information */}
        <div className={`bg-white ${isRTL ? "text-right" : "text-left"}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Building size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("settings.company.name", "Company Name")}
                </p>
                <p className="font-medium">
                  {companySettings.company_info.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Mail size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("settings.company.email", "Email")}
                </p>
                <p className="font-medium">
                  {companySettings.company_info.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Phone size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("settings.company.phone", "Phone")}
                </p>
                <p className="font-medium">
                  {companySettings.company_info.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <MapPin size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("settings.company.address", "Address")}
                </p>
                <p className="font-medium">
                  {companySettings.company_info.address ||
                    t("settings.company.noAddress", "No address")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        {(companySettings.support_info.email ||
          companySettings.support_info.phone) && (
          <div className="bg-white p-6 rounded-lg border">
            <h3
              className={`text-lg font-semibold mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.support.title", "Support Information")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companySettings.support_info.email && (
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("settings.support.email", "Support Email")}
                    </p>
                    <p className="font-medium">
                      {companySettings.support_info.email}
                    </p>
                  </div>
                </div>
              )}
              {companySettings.support_info.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {t("settings.support.phone", "Support Phone")}
                    </p>
                    <p className="font-medium">
                      {companySettings.support_info.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media */}
        {(companySettings.social_media.facebook ||
          companySettings.social_media.twitter ||
          companySettings.social_media.instagram ||
          companySettings.social_media.linkedin) && (
          <div className="bg-white p-6 rounded-lg border">
            <h3
              className={`text-lg font-semibold mb-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("settings.social.title", "Social Media")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {companySettings.social_media.facebook && (
                <a
                  href={companySettings.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Facebook size={20} />
                  <span>Facebook</span>
                </a>
              )}
              {companySettings.social_media.twitter && (
                <a
                  href={companySettings.social_media.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-500"
                >
                  <Twitter size={20} />
                  <span>Twitter</span>
                </a>
              )}
              {companySettings.social_media.instagram && (
                <a
                  href={companySettings.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              )}
              {companySettings.social_media.linkedin && (
                <a
                  href={companySettings.social_media.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLegalPages = () => {
    if (isLoadingLegal) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!legalPages) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Failed to load legal pages.</p>
        </div>
      );
    }

    const legalPageItems = [
      {
        key: "terms_of_service",
        label: t("settings.legal.termsOfService", "Terms of Service"),
        icon: FileText,
      },
      {
        key: "privacy_policy",
        label: t("settings.legal.privacyPolicy", "Privacy Policy"),
        icon: Shield,
      },
      {
        key: "refund_policy",
        label: t("settings.legal.refundPolicy", "Refund Policy"),
        icon: Lock,
      },
      {
        key: "shipping_policy",
        label: t("settings.legal.shippingPolicy", "Shipping Policy"),
        icon: MapPin,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legalPageItems.map((item) => (
            <div
              key={item.key}
              className={`bg-white p-4 rounded-lg border cursor-pointer hover:border-blue-300 transition-colors ${
                selectedLegalPage === item.key
                  ? "border-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() =>
                setSelectedLegalPage(
                  selectedLegalPage === item.key ? null : item.key
                )
              }
            >
              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}
              >
                <item.icon size={20} className="text-gray-500" />
                <div className="flex-1">
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-sm text-gray-600">
                    {legalPages[item.key as keyof typeof legalPages] ||
                      t("settings.legal.noContent", "No content available")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Page Content */}
        {selectedLegalPage && (
          <div className="bg-white p-6 rounded-lg border">
            <div
              className={`flex justify-between items-center mb-4 ${
                isRTL ? "flex-row" : ""
              }`}
            >
              <h3 className="text-lg font-semibold">
                {
                  legalPageItems.find((item) => item.key === selectedLegalPage)
                    ?.label
                }
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLegalPage(null)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="prose max-w-none">
              {selectedLegalPage === "terms_of_service" && (
                <div>
                  {isLoadingTerms ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          termsResponse?.data?.content ||
                          t("settings.legal.noContent", "No content available"),
                      }}
                    />
                  )}
                </div>
              )}
              {selectedLegalPage === "privacy_policy" && (
                <div>
                  {isLoadingPrivacy ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          privacyResponse?.data?.content ||
                          t("settings.legal.noContent", "No content available"),
                      }}
                    />
                  )}
                </div>
              )}
              {selectedLegalPage === "refund_policy" && (
                <div>
                  {isLoadingRefund ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          refundResponse?.data?.content ||
                          t("settings.legal.noContent", "No content available"),
                      }}
                    />
                  )}
                </div>
              )}
              {selectedLegalPage === "shipping_policy" && (
                <div>
                  {isLoadingShipping ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          shippingResponse?.data?.content ||
                          t("settings.legal.noContent", "No content available"),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${
          isRTL ? "sm:flex-row" : ""
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("settings.title")}
        </h2>
        {activeTab === "account" && !isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
          >
            <Save size={16} />
            {t("settings.edit")}
          </Button>
        ) : activeTab === "account" && isEditing ? (
          <div className={`flex gap-2 ${isRTL ? "flex-row" : ""}`}>
            <Button
              onClick={handleSave}
              className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
            >
              <Save size={16} />
              {t("settings.save")}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
            >
              <X size={16} />
              {t("settings.cancel")}
            </Button>
          </div>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className={`flex space-x-8`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } ${isRTL ? "flex-row" : ""}`}
              >
                <Icon size={16} />
                {t(tab.labelKey)}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "company" && renderCompanySettings()}
        {activeTab === "legal" && renderLegalPages()}
      </div>
    </div>
  );
}
