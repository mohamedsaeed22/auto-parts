"use client";

import { useState } from "react";
import { Lock, Bell, Globe, Shield, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState({
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
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    setSettings(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(settings);
    setIsEditing(false);
  };

  const tabs = [
    { id: "account", labelKey: "settings.tabs.account", icon: Bell },
    { id: "privacy", labelKey: "settings.tabs.privacy", icon: Shield },
    { id: "security", labelKey: "settings.tabs.security", icon: Lock },
    { id: "language", labelKey: "settings.tabs.language", icon: Globe },
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-semibold mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("settings.account.title")}
        </h3>
        <div className="space-y-4">
          {Object.entries(formData.account).map(([key, value]) => (
            <div
              key={key}
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className="font-medium">
                  {key === "emailNotifications" &&
                    t("settings.account.emailNotifications")}
                  {key === "smsNotifications" &&
                    t("settings.account.smsNotifications")}
                  {key === "marketingEmails" &&
                    t("settings.account.marketingEmails")}
                  {key === "orderUpdates" && t("settings.account.orderUpdates")}
                  {key === "newsletter" && t("settings.account.newsletter")}
                </div>
                <div className="text-sm text-gray-600">
                  {key === "emailNotifications" &&
                    t("settings.account.emailNotificationsDesc")}
                  {key === "smsNotifications" &&
                    t("settings.account.smsNotificationsDesc")}
                  {key === "marketingEmails" &&
                    t("settings.account.marketingEmailsDesc")}
                  {key === "orderUpdates" &&
                    t("settings.account.orderUpdatesDesc")}
                  {key === "newsletter" && t("settings.account.newsletterDesc")}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      account: { ...formData.account, [key]: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${
                    isRTL
                      ? "peer-checked:after:-translate-x-full"
                      : "peer-checked:after:translate-x-full"
                  } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] ${
                    isRTL ? "after:right-[2px]" : "after:left-[2px]"
                  } after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
                ></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-semibold mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("settings.privacy.title")}
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("settings.privacy.profileVisibility")}
            </label>
            <select
              value={formData.privacy.profileVisibility}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  privacy: {
                    ...formData.privacy,
                    profileVisibility: e.target.value,
                  },
                })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <option value="public">{t("settings.privacy.public")}</option>
              <option value="friends">{t("settings.privacy.friends")}</option>
              <option value="private">{t("settings.privacy.private")}</option>
            </select>
          </div>

          {Object.entries(formData.privacy)
            .slice(1)
            .map(([key, value]) => (
              <div
                key={key}
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`${isRTL ? "text-right" : "text-left"}`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <div className="font-medium">
                    {key === "showEmail" && t("settings.privacy.showEmail")}
                    {key === "showPhone" && t("settings.privacy.showPhone")}
                    {key === "allowSearch" && t("settings.privacy.allowSearch")}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacy: {
                          ...formData.privacy,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${
                      isRTL
                        ? "peer-checked:after:-translate-x-full"
                        : "peer-checked:after:translate-x-full"
                    } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] ${
                      isRTL ? "after:right-[2px]" : "after:left-[2px]"
                    } after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
                  ></div>
                </label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-semibold mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("settings.security.title")}
        </h3>
        <div className="space-y-4">
          {Object.entries(formData.security).map(([key, value]) => (
            <div
              key={key}
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`${isRTL ? "text-right" : "text-left"}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className="font-medium">
                  {key === "twoFactorAuth" &&
                    t("settings.security.twoFactorAuth")}
                  {key === "loginAlerts" && t("settings.security.loginAlerts")}
                  {key === "deviceManagement" &&
                    t("settings.security.deviceManagement")}
                </div>
                <div className="text-sm text-gray-600">
                  {key === "twoFactorAuth" &&
                    t("settings.security.twoFactorAuthDesc")}
                  {key === "loginAlerts" &&
                    t("settings.security.loginAlertsDesc")}
                  {key === "deviceManagement" &&
                    t("settings.security.deviceManagementDesc")}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      security: {
                        ...formData.security,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${
                    isRTL
                      ? "peer-checked:after:-translate-x-full"
                      : "peer-checked:after:translate-x-full"
                  } peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] ${
                    isRTL ? "after:right-[2px]" : "after:left-[2px]"
                  } after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
                ></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguageSettings = () => (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-lg font-semibold mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("settings.language.title")}
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("settings.language.language")}
            </label>
            <select
              value={formData.language.language}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: { ...formData.language, language: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <option value="ar">{t("settings.language.arabic")}</option>
              <option value="en">{t("settings.language.english")}</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("settings.language.currency")}
            </label>
            <select
              value={formData.language.currency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: { ...formData.language, currency: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <option value="SAR">{t("settings.language.sar")}</option>
              <option value="USD">{t("settings.language.usd")}</option>
              <option value="EUR">{t("settings.language.eur")}</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("settings.language.timezone")}
            </label>
            <select
              value={formData.language.timezone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: { ...formData.language, timezone: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <option value="Asia/Riyadh">
                {t("settings.language.riyadh")}
              </option>
              <option value="Asia/Dubai">{t("settings.language.dubai")}</option>
              <option value="Europe/London">
                {t("settings.language.london")}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2
          className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("settings.title")}
        </h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Save size={16} />
            {t("settings.edit")}
          </Button>
        ) : (
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              onClick={handleSave}
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Save size={16} />
              {t("settings.save")}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <X size={16} />
              {t("settings.cancel")}
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav
          className={`flex ${
            isRTL ? "space-x-reverse space-x-8" : "space-x-8"
          }`}
        >
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
                } ${isRTL ? "flex-row-reverse" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
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
        {activeTab === "account" && renderAccountSettings()}
        {activeTab === "privacy" && renderPrivacySettings()}
        {activeTab === "security" && renderSecuritySettings()}
        {activeTab === "language" && renderLanguageSettings()}
      </div>
    </div>
  );
}
