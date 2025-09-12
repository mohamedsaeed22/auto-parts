"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import FormInput from "@/components/ui/FormInput";
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
import {
  profileUpdateSchema,
  profileUpdateDefaultValues,
  type ProfileUpdateFormData,
} from "@/lib/validations/profileSchema";

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
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // React Hook Form setup
  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: profileUpdateDefaultValues,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = form;

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
      reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        manager_name: profile.manager_name || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zip: profile.zip || "",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        avatar: undefined,
      });
    }
  }, [profile, reset]);

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

  const onSubmit = async (data: ProfileUpdateFormData) => {
    if (!profile) return;

    try {
      const updatePayload = {
        name: data.name || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        manager_name: data.manager_name || undefined,
        address: data.address || undefined,
        city: data.city || undefined,
        zip: data.zip || undefined,
        state: data.state || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        avatar: selectedAvatar || undefined,
      };

      await updateProfile(updatePayload).unwrap();

      // Refresh profile data
      refetch();

      // Reset form state
      setSelectedAvatar(null);
      setAvatarPreview(null);
      setIsEditing(false);

      showSuccess(t("profile.updateSuccess", "Profile updated successfully!"));
    } catch {
      showError(
        t("profile.updateError", "Failed to update profile. Please try again.")
      );
    }
  };

  const handleEdit = () => {
    if (profile) {
      reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        manager_name: profile.manager_name || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zip: profile.zip || "",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        avatar: undefined,
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        manager_name: profile.manager_name || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        zip: profile.zip || "",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        avatar: undefined,
      });
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
            onClick={handleEdit}
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
              onClick={handleSubmit(onSubmit)}
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
          <FormInput
            label={t("profile.name")}
            type="text"
            icon={User}
            required
            disabled={!isEditing}
            value={watch("name")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("name", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.name?.message
                ? t(errors.name.message, { ns: "validation" })
                : undefined
            }
            placeholder={t("profile.name")}
          />
        </div>

        {/* Email */}
        <div className="col-span-full sm:col-span-1">
          <FormInput
            label={t("profile.email")}
            type="email"
            icon={Mail}
            disabled={!isEditing}
            value={watch("email")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("email", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.email?.message
                ? t(errors.email.message, { ns: "validation" })
                : undefined
            }
            placeholder={t(
              "profile.emailPlaceholder",
              "Enter email (optional)"
            )}
          />
        </div>

        {/* Phone */}
        <div className="col-span-full sm:col-span-1">
          <FormInput
            label={t("profile.phone")}
            type="tel"
            icon={Phone}
            required
            disabled={!isEditing}
            value={watch("phone")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("phone", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.phone?.message
                ? t(errors.phone.message, { ns: "validation" })
                : undefined
            }
            placeholder={t("profile.phone")}
          />
        </div>

        {/* Type */}
        <div className="col-span-full sm:col-span-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("profile.type")} *
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-sm sm:text-base">
              <Building size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {profile.type === "shop"
                  ? t("profile.shop")
                  : t("profile.workshop")}
              </span>
            </div>
          </div>
        </div>

        {/* Manager Name */}
        <div className="col-span-full sm:col-span-1">
          <FormInput
            label={t("profile.managerName")}
            type="text"
            icon={User}
            required
            disabled={!isEditing}
            value={watch("manager_name")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("manager_name", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.manager_name?.message
                ? t(errors.manager_name.message, { ns: "validation" })
                : undefined
            }
            placeholder={t("profile.managerName")}
          />
        </div>

        {/* Address */}
        <div className="col-span-full sm:col-span-1">
          <FormInput
            label={t("profile.address")}
            type="text"
            icon={MapPin}
            required
            disabled={!isEditing}
            value={watch("address")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("address", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.address?.message
                ? t(errors.address.message, { ns: "validation" })
                : undefined
            }
            placeholder={t("profile.address")}
          />
        </div>

        {/* City */}
        <div className="col-span-full sm:col-span-1">
          <FormInput
            label={t("profile.city")}
            type="text"
            icon={MapPin}
            required
            disabled={!isEditing}
            value={watch("city")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("city", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.city?.message
                ? t(errors.city.message, { ns: "validation" })
                : undefined
            }
            placeholder={t("profile.city")}
          />
        </div>

        {/* State */}
        <div className="col-span-full sm:col-span-1">
          <FormInput
            label={t("profile.state")}
            type="text"
            icon={MapPin}
            required
            disabled={!isEditing}
            value={watch("state")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("state", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.state?.message
                ? t(errors.state.message, { ns: "validation" })
                : undefined
            }
            placeholder={t("profile.state")}
          />
        </div>

        {/* ZIP */}
        <div className="col-span-full sm:col-span-1">
          <FormInput
            label={t("profile.zip")}
            type="text"
            icon={MapPin}
            required
            disabled={!isEditing}
            value={watch("zip")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("zip", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.zip?.message
                ? t(errors.zip.message, { ns: "validation" })
                : undefined
            }
            placeholder={t("profile.zip")}
          />
        </div>

        {/* Tax Number */}
        <div className="col-span-full sm:col-span-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("profile.taxNumber")} *
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-gray-600 text-sm sm:text-base">
              <FileText size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.tax_number}</span>
            </div>
          </div>
        </div>

        {/* Latitude */}
        <div className="col-span-full sm:col-span-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("profile.latitude")}
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-gray-600 text-sm sm:text-base">
              <Globe size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.latitude}</span>
            </div>
          </div>
        </div>

        {/* Longitude */}
        <div className="col-span-full sm:col-span-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("profile.longitude")}
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md flex items-center gap-2 text-gray-600 text-sm sm:text-base">
              <Globe size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{profile.longitude}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
