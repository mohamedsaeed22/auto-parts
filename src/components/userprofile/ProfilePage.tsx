"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  FileText,
  Globe,
  Edit,
  Save,
  X,
  Upload,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangeLanguageMutation,
} from "@/services/api";
import { useLocale } from "@/hooks/useLocale";
import { showSuccess, showError } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ProfileData {
  id: number;
  code: string;
  name: string;
  email: string | null;
  phone: string;
  type: "shop" | "workshop";
  manager_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  tax_number: string;
  commercial_register: string | null;
  avatar: string | null;
  latitude: string;
  longitude: string;
  is_registration_complete: boolean;
  is_google_user: boolean;
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changeLanguage] = useChangeLanguageMutation();
  const { changeLocale } = useLocale();

  type ProfileEnvelope = { user: ProfileData } | ProfileData | undefined;
  const responseData = profileResponse?.data as unknown as ProfileEnvelope;
  let profile: ProfileData | undefined;
  if (
    responseData &&
    typeof responseData === "object" &&
    "user" in (responseData as Record<string, unknown>)
  ) {
    profile = (responseData as { user: ProfileData }).user;
  } else {
    profile = responseData as ProfileData | undefined;
  }

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0] || null;
    if (fieldName === "avatar") {
      setSelectedAvatar(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setAvatarPreview(null);
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      const updatePayload = {
        name: formData.name || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        manager_name: formData.manager_name || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
        zip: formData.zip || undefined,
        state: formData.state || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        avatar: selectedAvatar || undefined,
      };

      await updateProfile(updatePayload).unwrap();

      // Refresh profile data
      refetch();

      // Reset form state
      setSelectedAvatar(null);
      setAvatarPreview(null);
      setIsEditing(false);

      showSuccess("Profile updated successfully!");
    } catch {
      showError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
      setSelectedAvatar(null);
      setAvatarPreview(null);
    }
    setIsEditing(false);
  };

  const handleLanguageChange = async (locale: "ar" | "en") => {
    try {
      // First, update the frontend language immediately (like header does)
      changeLocale(locale);

      // Then, update the user's language preference in the backend
      await changeLanguage({ locale }).unwrap();

      showSuccess("Language changed successfully!");
    } catch {
      showError("Failed to change language. Please try again.");
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-2">Failed to load profile data</div>
        <p className="text-gray-600 mb-4">
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${
          isRTL ? "sm:flex-row" : ""
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("profile.title")}
        </h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Edit size={16} />
            {t("profile.edit")}
          </Button>
        ) : (
          <div
            className={`flex flex-col sm:flex-row gap-2 w-full sm:w-auto ${
              isRTL ? "sm:flex-row" : ""
            }`}
          >
            <Button
              onClick={handleSave}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {t("profile.save")}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X size={16} />
              {t("profile.cancel")}
            </Button>
          </div>
        )}
      </div>

      {/* Language Selection */}
      <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div
          className={`flex items-center justify-between gap-4 ${
            isRTL ? "flex-row" : ""
          }`}
        >
          {/* Title */}
          <div className="flex items-center gap-2">
            <Globe2 size={20} className="text-gray-600" />
            <h3 className="font-medium text-gray-700">
              {t("profile.language")}
            </h3>
          </div>

          {/* Buttons */}
          <div className={`flex gap-2 ${isRTL ? "flex-row" : ""}`}>
            <Button
              variant={i18n.language === "ar" ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange("ar")}
              className="flex items-center gap-2"
            >
              <span className="text-lg">🇸🇦</span>
              العربية
            </Button>

            <Button
              variant={i18n.language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => handleLanguageChange("en")}
              className="flex items-center gap-2"
            >
              <span className="text-lg">🇺🇸</span>
              English
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Profile & Commercial Register Side-by-Side */}
        <div className="col-span-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 sm:border-4 border-white shadow-lg">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                    loading="lazy"
                  />
                ) : profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                    loading="lazy"
                  />
                ) : (
                  <User
                    size={24}
                    className="text-gray-400 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                  />
                )}
              </div>
              {isEditing && (
                <label
                  className={`absolute rounded-full w-6 h-6 sm:w-8 sm:h-8 p-0 bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 shadow-lg transition-all duration-200 ${
                    isRTL ? "bottom-0 left-0" : "bottom-0 right-0"
                  }`}
                >
                  <Upload size={10} className="sm:w-3 sm:h-3" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "avatar")}
                  />
                </label>
              )}
            </div>

            {/* Commercial Register Card */}
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="w-full h-24 sm:h-28 lg:h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                {(() => {
                  const src = profile.commercial_register || "";
                  const isPdf =
                    typeof src === "string" &&
                    src.toLowerCase().endsWith(".pdf");
                  if (!src) {
                    return (
                      <div className="flex flex-col items-center text-gray-400 text-center px-2">
                        <FileText size={20} className="sm:w-6 sm:h-6" />
                        <span className="text-xs mt-1 leading-tight">
                          {t("profile.commercialRegister")}
                        </span>
                      </div>
                    );
                  }
                  if (isPdf) {
                    return (
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline text-xs sm:text-sm text-center px-2"
                      >
                        {t("profile.viewFile")}
                      </a>
                    );
                  }
                  return (
                    <Image
                      src={src}
                      alt="Commercial Register"
                      className="w-full h-full object-cover"
                      width={256}
                      height={160}
                      loading="lazy"
                    />
                  );
                })()}
              </div>
              {/* Editing of commercial register disabled as requested */}
            </div>
          </div>
        </div>

        {/* User Code */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.userCode")}
          </label>
          <div className="px-3 py-2 bg-primary-50 text-primary-700 rounded-md font-mono text-center border border-primary-200 text-sm sm:text-base">
            {profile.code}
          </div>
        </div>

        {/* Name */}
        <div className="col-span-full sm:col-span-1">
          <label
            className={`block text-sm font-medium text-gray-700 mb-2 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("profile.name")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors text-sm sm:text-base"
              dir={isRTL ? "rtl" : "ltr"}
            />
          ) : (
            <div
              className={`w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base ${
                isRTL ? "flex-row" : ""
              }`}
            >
              <User size={16} className="text-gray-400 flex-shrink-0" />
              <span
                className={`${isRTL ? "text-right" : "text-left"} truncate`}
              >
                {profile.name}
              </span>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.email")}
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              placeholder="Enter email (optional)"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {profile.email || t("profile.noEmail")}
              </span>
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.phone")} *
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <Phone size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.phone}</span>
            </div>
          )}
        </div>

        {/* Type */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.type")} *
          </label>
          {isEditing ? (
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed text-sm sm:text-base"
              disabled
            >
              <option value="shop">{t("profile.shop")}</option>
              <option value="workshop">{t("profile.workshop")}</option>
            </select>
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <Building size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {profile.type === "shop"
                  ? t("profile.shop")
                  : t("profile.workshop")}
              </span>
            </div>
          )}
        </div>

        {/* Manager Name */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.managerName")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="manager_name"
              value={formData.manager_name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <User size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.manager_name}</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.address")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.address}</span>
            </div>
          )}
        </div>

        {/* City */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.city")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.city}</span>
            </div>
          )}
        </div>

        {/* State */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.state")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.state}</span>
            </div>
          )}
        </div>

        {/* ZIP */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.zip")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="zip"
              value={formData.zip || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.zip}</span>
            </div>
          )}
        </div>

        {/* Tax Number */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.taxNumber")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="tax_number"
              value={formData.tax_number || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <FileText size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.tax_number}</span>
            </div>
          )}
        </div>

        {/* Latitude */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.latitude")}
          </label>
          <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <Globe size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{profile.latitude}</span>
          </div>
        </div>

        {/* Longitude */}
        <div className="col-span-full sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.longitude")}
          </label>
          <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <Globe size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{profile.longitude}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
