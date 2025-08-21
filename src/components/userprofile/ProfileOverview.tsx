"use client";

import { useState } from "react";
import { User, Mail, Phone, Calendar, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ProfileOverview() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "أحمد محمد علي",
    email: "ahmed.mohamed@example.com",
    phone: "+966 50 123 4567",
    birthDate: "1990-05-15",
    gender: "ذكر",
    city: "الرياض",
    joinDate: "2023-01-15",
  });

  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("profileOverview.title")}
        </h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            {t("profileOverview.edit")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} />
              {t("profileOverview.save")}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X size={16} />
              {t("profileOverview.cancel")}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Picture */}
        <div className="md:col-span-2 flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={48} className="text-gray-400" />
            </div>
            {isEditing && (
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
              >
                <Edit size={12} />
              </Button>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("profileOverview.fullName")}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            ) : (
              <div
                className={`px-3 py-2 bg-gray-50 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {profile.name}
              </div>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("profileOverview.email")}
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-right flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                {profile.email}
              </div>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("profileOverview.phone")}
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-right flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                {profile.phone}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("profileOverview.birthDate")}
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-right flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                {profile.birthDate}
              </div>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("profileOverview.gender")}
            </label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <option value="ذكر">{t("profileOverview.male")}</option>
                <option value="أنثى">{t("profileOverview.female")}</option>
              </select>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-right">
                {profile.gender}
              </div>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("profileOverview.city")}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-right">
                {profile.city}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600">
            {t("profileOverview.stats.completedOrders")}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">8</div>
          <div className="text-sm text-gray-600">
            {t("profileOverview.stats.favoriteProducts")}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">2</div>
          <div className="text-sm text-gray-600">
            {t("profileOverview.stats.savedAddresses")}
          </div>
        </div>
      </div>
    </div>
  );
}
