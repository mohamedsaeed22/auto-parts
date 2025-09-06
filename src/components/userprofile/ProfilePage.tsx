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
  const [selectedCommercialRegister, setSelectedCommercialRegister] =
    useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [commercialRegisterPreview, setCommercialRegisterPreview] = useState<
    string | null
  >(null);

  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    refetch,
  } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changeLanguage] = useChangeLanguageMutation();
  const { changeLocale } = useLocale();

  const profile = profileResponse?.data?.user as ProfileData | undefined;

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
    } else if (fieldName === "commercial_register") {
      setSelectedCommercialRegister(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCommercialRegisterPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setCommercialRegisterPreview(null);
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      const updateData = {
        ...formData,
        avatar: selectedAvatar || undefined,
        commercial_register: selectedCommercialRegister || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateProfile(updateData).unwrap();

      // Refresh profile data
      refetch();

      // Reset form state
      setSelectedAvatar(null);
      setSelectedCommercialRegister(null);
      setAvatarPreview(null);
      setCommercialRegisterPreview(null);
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
      setSelectedCommercialRegister(null);
      setAvatarPreview(null);
      setCommercialRegisterPreview(null);
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
              isRTL ? "sm:flex-row-reverse" : ""
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
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Picture */}
        <div className="col-span-2 flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                  loading="lazy"
                />
              ) : profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                  loading="lazy"
                />
              ) : (
                <User size={32} className="text-gray-400 sm:w-12 sm:h-12" />
              )}
            </div>
            {isEditing && (
              <label
                className={`absolute rounded-full w-8 h-8 p-0 bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 shadow-lg transition-all duration-200 ${
                  isRTL ? "bottom-0 left-0" : "bottom-0 right-0"
                }`}
              >
                <Upload size={12} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "avatar")}
                />
              </label>
            )}
          </div>
        </div>

        {/* User Code */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.userCode")}
          </label>
          <div className="px-3 py-2 bg-primary-50 text-primary-700 rounded-md font-mono text-center border border-primary-200">
            {profile.code}
          </div>
        </div>

        {/* Name */}
        <div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              dir={isRTL ? "rtl" : "ltr"}
            />
          ) : (
            <div
              className={`px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 ${
                isRTL ? "flex-row" : ""
              }`}
            >
              <User size={16} className="text-gray-400" />
              <span className={isRTL ? "text-right" : "text-left"}>
                {profile.name}
              </span>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.email")}
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter email (optional)"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              {profile.email || t("profile.noEmail")}
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.phone")} *
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              {profile.phone}
            </div>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.type")} *
          </label>
          {isEditing ? (
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              disabled
            >
              <option value="shop">{t("profile.shop")}</option>
              <option value="workshop">{t("profile.workshop")}</option>
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <Building size={16} className="text-gray-400" />
              {profile.type === "shop"
                ? t("profile.shop")
                : t("profile.workshop")}
            </div>
          )}
        </div>

        {/* Manager Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.managerName")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="manager_name"
              value={formData.manager_name || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              {profile.manager_name}
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.address")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              {profile.address}
            </div>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.city")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              {profile.city}
            </div>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.state")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              {profile.state}
            </div>
          )}
        </div>

        {/* ZIP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.zip")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="zip"
              value={formData.zip || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              {profile.zip}
            </div>
          )}
        </div>

        {/* Tax Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.taxNumber")} *
          </label>
          {isEditing ? (
            <input
              type="text"
              name="tax_number"
              value={formData.tax_number || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              {profile.tax_number}
            </div>
          )}
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.latitude")}
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-gray-600">
            <Globe size={16} className="text-gray-400" />
            {profile.latitude}
          </div>
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("profile.longitude")}
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-gray-600">
            <Globe size={16} className="text-gray-400" />
            {profile.longitude}
          </div>
        </div>
      </div>

      {/* Commercial Register Upload */}
      {isEditing && (
        <div className="mt-6 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
          <label
            className={`block text-sm font-medium text-gray-700 mb-2 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("profile.commercialRegister")}
          </label>

          {/* Current Commercial Register Display */}
          {profile.commercial_register && (
            <div className="mb-4">
              <p
                className={`text-sm text-gray-600 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("profile.currentFile")}:
              </p>
              <div className="relative inline-block">
                <Image
                  src={profile.commercial_register}
                  alt="Current Commercial Register"
                  className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                  width={200}
                  height={150}
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {profile.commercial_register.split("/").pop()}
                </div>
              </div>
            </div>
          )}

          {/* File Upload */}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, "commercial_register")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            accept="image/*,.pdf"
          />

          {/* Preview of Selected File */}
          {commercialRegisterPreview && (
            <div className="mt-4">
              <p
                className={`text-sm text-gray-600 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("profile.selectedFile")}:
              </p>
              <div className="relative inline-block">
                <Image
                  src={commercialRegisterPreview}
                  alt="Selected Commercial Register Preview"
                  className="max-w-full h-auto max-h-48 rounded-lg border border-gray-300"
                  width={200}
                  height={150}
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-primary bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {selectedCommercialRegister?.name}
                </div>
              </div>
            </div>
          )}

          {/* File Info */}
          {selectedCommercialRegister && !commercialRegisterPreview && (
            <p
              className={`text-sm text-gray-600 mt-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("profile.selectedFile")}:{" "}
              <span className="font-medium">
                {selectedCommercialRegister.name}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Account Status */}
      {/* <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-success-50 p-4 sm:p-6 rounded-lg text-center border border-success-200 shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-success-600 mb-2">
            {profile.is_registration_complete ? "✓" : "✗"}
          </div>
          <div className="text-sm text-success-700">
            {profile.is_registration_complete
              ? t("profile.registrationComplete")
              : t("profile.registrationIncomplete")}
          </div>
        </div>
        <div className="bg-primary-50 p-4 sm:p-6 rounded-lg text-center border border-primary-200 shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2">
            {profile.is_google_user ? "✓" : "✗"}
          </div>
          <div className="text-sm text-primary-700">
            {profile.is_google_user
              ? t("profile.googleUser")
              : t("profile.regularUser")}
          </div>
        </div>
      </div> */}
    </div>
  );
}
