"use client";

import { useState } from "react";
import { Lock, Bell, Globe, Shield, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
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
    { id: "account", label: "الحساب", icon: Bell },
    { id: "privacy", label: "الخصوصية", icon: Shield },
    { id: "security", label: "الأمان", icon: Lock },
    { id: "language", label: "اللغة والمنطقة", icon: Globe },
  ];

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-right">
          إعدادات الإشعارات
        </h3>
        <div className="space-y-4">
          {Object.entries(formData.account).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="text-right">
                <div className="font-medium">
                  {key === "emailNotifications" && "إشعارات البريد الإلكتروني"}
                  {key === "smsNotifications" && "إشعارات الرسائل النصية"}
                  {key === "marketingEmails" && "رسائل التسويق"}
                  {key === "orderUpdates" && "تحديثات الطلبات"}
                  {key === "newsletter" && "النشرة الإخبارية"}
                </div>
                <div className="text-sm text-gray-600">
                  {key === "emailNotifications" &&
                    "استلام إشعارات عبر البريد الإلكتروني"}
                  {key === "smsNotifications" &&
                    "استلام إشعارات عبر الرسائل النصية"}
                  {key === "marketingEmails" && "استلام عروض خاصة وتخفيضات"}
                  {key === "orderUpdates" && "تحديثات حالة الطلبات والشحن"}
                  {key === "newsletter" && "النشرة الإخبارية الأسبوعية"}
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
        <h3 className="text-lg font-semibold mb-4 text-right">
          إعدادات الخصوصية
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              رؤية الملف الشخصي
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            >
              <option value="public">عام</option>
              <option value="friends">الأصدقاء فقط</option>
              <option value="private">خاص</option>
            </select>
          </div>

          {Object.entries(formData.privacy)
            .slice(1)
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="text-right">
                  <div className="font-medium">
                    {key === "showEmail" && "إظهار البريد الإلكتروني"}
                    {key === "showPhone" && "إظهار رقم الهاتف"}
                    {key === "allowSearch" && "السماح بالبحث"}
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
        <h3 className="text-lg font-semibold mb-4 text-right">
          إعدادات الأمان
        </h3>
        <div className="space-y-4">
          {Object.entries(formData.security).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="text-right">
                <div className="font-medium">
                  {key === "twoFactorAuth" && "المصادقة الثنائية"}
                  {key === "loginAlerts" && "تنبيهات تسجيل الدخول"}
                  {key === "deviceManagement" && "إدارة الأجهزة"}
                </div>
                <div className="text-sm text-gray-600">
                  {key === "twoFactorAuth" && "تأمين إضافي لحسابك"}
                  {key === "loginAlerts" &&
                    "إشعار عند تسجيل الدخول من جهاز جديد"}
                  {key === "deviceManagement" && "إدارة الأجهزة المسجلة"}
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
        <h3 className="text-lg font-semibold mb-4 text-right">
          إعدادات اللغة والمنطقة
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              اللغة
            </label>
            <select
              value={formData.language.language}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: { ...formData.language, language: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              العملة
            </label>
            <select
              value={formData.language.currency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: { ...formData.language, currency: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            >
              <option value="SAR">جنيه سعودي (SAR)</option>
              <option value="USD">دولار أمريكي (USD)</option>
              <option value="EUR">يورو (EUR)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
              المنطقة الزمنية
            </label>
            <select
              value={formData.language.timezone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: { ...formData.language, timezone: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            >
              <option value="Asia/Riyadh">الرياض (GMT+3)</option>
              <option value="Asia/Dubai">دبي (GMT+4)</option>
              <option value="Europe/London">لندن (GMT+0)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-right">الإعدادات</h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            تعديل
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} />
              حفظ
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X size={16} />
              إلغاء
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 space-x-reverse">
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
                }`}
              >
                <Icon size={16} />
                {tab.label}
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
