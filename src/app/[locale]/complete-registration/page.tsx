"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCompleteRegistrationMutation } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useTranslation } from "react-i18next";
import { useRegistrationStatus } from "@/hooks/useRegistrationStatus";
import { showSuccess, showError } from "@/lib/toast";
import { User, Mail, Building, MapPin, Hash, FileText } from "lucide-react";
import { storage } from "@/lib/storage";
import { CartSyncService } from "@/services/cartSyncService";
import FormInput from "@/components/ui/FormInput";
import { LoadingSpinner } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationPicker from "@/components/LocationPicker";
import type { LocationData } from "@/components/LocationPicker";
import Image from "next/image";

export default function CompleteRegistrationPage() {
  // ALL HOOKS MUST BE CALLED FIRST - before any early returns
  const [completeRegistration, { isLoading }] =
    useCompleteRegistrationMutation();
  const { authData } = useAuth();
  const router = useRouter();
  const { currentLocale } = useLocale();
  const { clearRegistrationIncomplete } = useRegistrationStatus();
  const { t } = useTranslation("registration");

  // State for form fields - these must also be called before any early returns
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Optional field
    type: "" as "" | "shop" | "workshop",
    manager_name: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    tax_number: "",
    latitude: "", // Will be set from map selection
    longitude: "", // Will be set from map selection
  });

  // Location selection state
  const [isLocationSelected, setIsLocationSelected] = useState(false);

  const [commercialRegister, setCommercialRegister] = useState<File | null>(
    null
  );
  const [avatar, setAvatar] = useState<File | null>(null);
  const [commercialRegisterPreview, setCommercialRegisterPreview] = useState<
    string | null
  >(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    manager_name?: string;
    address?: string;
    city?: string;
    zip?: string;
    state?: string;
    tax_number?: string;
    commercial_register?: string;
    avatar?: string;
    type?: string;
    location?: string;
  }>({});

  // State for API errors
  const [apiErrors, setApiErrors] = useState<Array<{ key: string; value: string[] }>>([]);

  // Check if user has already completed registration
  const hasRedirectedRef = useRef(false);

  // Handle location selection from the map
  const handleLocationSelect = (locationData: LocationData) => {
    // Store coordinates (required)
    setFormData((prev) => ({
      ...prev,
      latitude: locationData.lat.toString(),
      longitude: locationData.lng.toString(),
      // Auto-fill other fields if available, but allow user to edit
      address: locationData.address || prev.address,
      city: locationData.city || prev.city,
      state: locationData.state || prev.state,
      zip: locationData.postal_code || prev.zip,
    }));

    // Mark location as selected
    setIsLocationSelected(true);

    // Clear location-related errors
    setErrors((prev) => ({
      ...prev,
      location: undefined,
      address: undefined,
      city: undefined,
      state: undefined,
      zip: undefined,
    }));

    // Show success message
    showSuccess(
      t(
        "toasts.locationSelected",
        "Location selected successfully! You can now edit the address details if needed."
      )
    );
  };

  useEffect(() => {
    // Check if user is not authenticated at all
    if (!storage.isAuthenticated() && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.push(`/${currentLocale}`);
      return;
    }

    // Check if user has already completed registration
    if (
      authData &&
      authData.user?.is_registration_complete &&
      !hasRedirectedRef.current
    ) {
      hasRedirectedRef.current = true;

      // Only show success message if we're actually on the complete-registration page
      if (window.location.pathname.includes("/complete-registration")) {
        showSuccess(t("toasts.registrationAlreadyCompleted"));
      }

      router.push(`/${currentLocale}`);
      return;
    }
  }, [authData, currentLocale, router, t]);

  // File validation function
  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return t("validation.fileType");
    }

    if (file.size > maxSize) {
      return t("validation.fileSize");
    }

    return null;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors for the field being edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle file changes
  const handleFileChange = (
    file: File | undefined,
    fieldName: "commercial_register" | "avatar"
  ) => {
    // Clear previous errors
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));

    if (fieldName === "commercial_register") {
      setCommercialRegister(file || null);
      if (file) {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          setErrors((prev) => ({ ...prev, [fieldName]: validationError }));
          return;
        }

        // Create preview for image files
        const reader = new FileReader();
        reader.onload = (e) =>
          setCommercialRegisterPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setCommercialRegisterPreview(null);
      }
    } else if (fieldName === "avatar") {
      setAvatar(file || null);
      if (file) {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          setErrors((prev) => ({ ...prev, [fieldName]: validationError }));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setAvatarPreview(null);
      }
    }
  };

  const handleRemoveFile = (fieldName: "commercial_register" | "avatar") => {
    // Clear errors when removing file
    setErrors((prev) => ({ ...prev, [fieldName]: undefined }));

    if (fieldName === "commercial_register") {
      setCommercialRegister(null);
      setCommercialRegisterPreview(null);
    } else if (fieldName === "avatar") {
      setAvatar(null);
      setAvatarPreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Clear any previous errors
    setApiErrors([]);
    const newErrors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    // Email is optional, but if provided, should be valid
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.manager_name.trim()) {
      newErrors.manager_name = t("validation.managerRequired");
    }

    // Type selection is required
    if (!formData.type) {
      newErrors.type = t("validation.typeRequired");
    }

    // Location selection is MANDATORY (latitude and longitude required)
    if (!isLocationSelected || !formData.latitude || !formData.longitude) {
      newErrors.location = t(
        "validation.locationRequired",
        "Please select a location on the map to continue"
      );
    }

    // Address fields are required (can be auto-filled or manually entered)
    if (!formData.address.trim()) {
      newErrors.address = t("validation.addressRequired");
    }
    if (!formData.city.trim()) {
      newErrors.city = t("validation.cityRequired");
    }
    if (!formData.state.trim()) {
      newErrors.state = t("validation.stateRequired");
    }
    if (!formData.zip.trim()) {
      newErrors.zip = t("validation.zipRequired");
    }

    if (!formData.tax_number.trim()) {
      newErrors.tax_number = t("validation.taxRequired");
    }

    // File uploads are required
    if (!commercialRegister) {
      newErrors.commercial_register = t("validation.crRequired");
    }
    if (!avatar) {
      newErrors.avatar = t("validation.avatarRequired");
    }

    // If there are validation errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorElement = document.querySelector(".text-red-500");
      firstErrorElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    try {
      // Create the request data object
      const requestData = {
        name: formData.name,
        email: formData.email.trim() || undefined, // Send undefined if empty (optional)
        type: formData.type as "shop" | "workshop",
        manager_name: formData.manager_name,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        state: formData.state,
        tax_number: formData.tax_number,
        latitude: formData.latitude,
        longitude: formData.longitude,
        commercial_register: commercialRegister || undefined,
        avatar: avatar || undefined,
      };

      // Send the request to the API
      const result = await completeRegistration(requestData).unwrap();

      if (result.data) {
        // Update only the user data while preserving the existing token
        const updatedUser = {
          ...result.data.user,
          is_registration_complete: true,
          points: (result.data.user as { points?: number }).points || 0,
        };

        // Update only the user data, don't replace the entire auth structure
        storage.updateUser(updatedUser);

        // Sync local cart to API now that registration is complete
        try {
          await CartSyncService.handleRegistrationComplete();
          // Optional: let listeners refresh cart state
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("cartSyncComplete"));
          }, 100);
        } catch (syncError) {
          console.error(
            "Cart sync after registration completion failed:",
            syncError
          );
        }

        clearRegistrationIncomplete();
        showSuccess(t("toasts.registrationCompleted"));

        // Get the previous page URL and redirect back
        const previousPage = storage.getPreviousPage();
        if (previousPage) {
          router.push(previousPage);
        } else {
          // Fallback to home page if no previous page stored
          router.push(`/${currentLocale}`);
        }
      }
    } catch (error: unknown) {
      console.error("Error completing registration:", error);
      
      // Handle API validation errors
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as { errors?: Array<{ key: string; value: string[] }> };
        if (errorData.errors) {
          setApiErrors(errorData.errors);
          // Scroll to top where errors are displayed
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      
      showError(t("toasts.registrationFailed"));
    }
  };

  // NOW we can have conditional rendering - after all hooks are called
  // Show loading while checking auth status
  if (!storage.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <LoadingSpinner message={t("loading") || "Loading..."} />
        </div>
      </div>
    );
  }

  // Show loading while auth data is being fetched
  if (!authData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <LoadingSpinner message={t("loading") || "Loading..."} />
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!authData.token) {
    router.push(`/${currentLocale}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-logo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-logo-gold" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-logo-black mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("description")}</p>
          {authData.user?.code && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-logo-gold/10 text-logo-gold rounded-lg border border-logo-gold/20">
              <Hash className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                {t("userCode")}: {authData.user.code}
              </span>
            </div>
          )}
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="w-full">
            {/* API Error Messages */}
            {apiErrors.length > 0 && (
              <div className="p-4 bg-red-50 border-b border-red-100">
                <div className="flex flex-col gap-2">
                  {apiErrors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      {error.value.map((message, messageIndex) => (
                        <div key={messageIndex} className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>{message}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Selection Section - FIRST STEP */}
            <div className="bg-logo-gold/5 border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-logo-black flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-logo-gold" />
                  {t("labels.selectLocation")}{" "}
                  <span className="text-red-500 ml-1">*</span>
                </h3>
                {/* {isLocationSelected && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">
                      Location Selected
                    </span>
                  </div>
                )} */}
              </div>

              {/* <p className="text-sm text-gray-600 mb-4">
                {t(
                  "help.locationRequired",
                  "Please search and select your exact business location on the map. This will help customers find you easily."
                )}
              </p> */}

              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={
                  formData.latitude && formData.longitude
                    ? {
                        lat: parseFloat(formData.latitude),
                        lng: parseFloat(formData.longitude),
                      }
                    : {
                        lat: 24.7136, // Default to Riyadh, Saudi Arabia
                        lng: 46.6753,
                      }
                }
                className="w-full h-96"
                error={errors.location}
              />

              {errors.location && (
                <p className="text-sm text-red-500 mt-2 font-medium">
                  {errors.location}
                </p>
              )}

              {/* Show simple instruction text when no location is selected */}
              {!isLocationSelected && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {t(
                    "location.simpleInstruction",
                    "Please select a location on the map above"
                  )}
                </p>
              )}

              {/* {isLocationSelected && locationDetails && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Selected Location:</strong>{" "}
                    {locationDetails.address}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Coordinates: {locationDetails.lat.toFixed(6)},{" "}
                    {locationDetails.lng.toFixed(6)}
                  </p>
                </div>
              )} */}
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-8">
              {/* Form Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-logo-black flex items-center mb-4">
                    <User className="w-4 h-4 mr-2 text-logo-gold" />
                    {t("sections.basicInfo", "Basic Information")}
                  </h4>

                  <FormInput
                    label={t("labels.name")}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.name")}
                    required
                    icon={User}
                    error={errors.name}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={`${t("labels.email")} (${t(
                      "optional",
                      "Optional"
                    )})`}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.email")}
                    required={false}
                    icon={Mail}
                    error={errors.email}
                    translationNamespace="registration"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">
                      {t("labels.type")} <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.type || undefined}
                      onValueChange={(value: "shop" | "workshop") =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="w-full h-12 px-3 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-logo-gold focus:border-logo-gold transition-colors">
                        <SelectValue
                          placeholder={t("placeholders.selectType")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shop">
                          {t("typeOptions.shop")}
                        </SelectItem>
                        <SelectItem value="workshop">
                          {t("typeOptions.workshop")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500">{errors.type}</p>
                    )}
                  </div>

                  <FormInput
                    label={t("labels.managerName")}
                    type="text"
                    id="manager_name"
                    name="manager_name"
                    value={formData.manager_name}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.managerName")}
                    required
                    icon={User}
                    error={errors.manager_name}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.taxNumber")}
                    type="text"
                    id="tax_number"
                    name="tax_number"
                    value={formData.tax_number}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.taxNumber")}
                    required
                    icon={FileText}
                    error={errors.tax_number}
                    translationNamespace="registration"
                  />
                </div>

                <div className="space-y-6">
                  <h4 className="text-md font-semibold text-logo-black flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-logo-gold" />
                    {t("sections.addressInfo", "Address Information")}
                  </h4>

                  <FormInput
                    label={t("labels.address")}
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.address")}
                    required
                    icon={MapPin}
                    error={errors.address}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.city")}
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.city")}
                    required
                    icon={Building}
                    error={errors.city}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.state")}
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.state")}
                    required
                    icon={MapPin}
                    error={errors.state}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.zip")}
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder={t("placeholders.zip")}
                    required
                    icon={Hash}
                    error={errors.zip}
                    translationNamespace="registration"
                  />
                </div>
              </div>
            </div>

            {/* File Uploads Section */}
            <div className="border-t border-gray-200 bg-gray-50/50 p-6 md:p-8">
              <h4 className="text-md font-semibold text-logo-black mb-6 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-logo-gold" />
                {t("sections.documents", "Required Documents")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Commercial Register Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-logo-black mb-2">
                    <FileText size={16} color="gray" />
                    {t("labels.commercialRegister")}{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="file"
                    id="commercial_register"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(file, "commercial_register");
                    }}
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                  />

                  {!commercialRegister && (
                    <label
                      htmlFor="commercial_register"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-logo-gold/50 rounded-lg cursor-pointer hover:border-logo-gold hover:bg-logo-gold/5 transition-colors"
                    >
                      <div className="text-center">
                        <FileText
                          className="mx-auto text-logo-gold mb-2"
                          size={24}
                        />
                        <p className="text-sm text-logo-black">
                          {t("uploads.clickToSelectCR")}
                        </p>
                        <p className="text-xs text-logo-black/60">
                          {t("help.uploadNote")}
                        </p>
                      </div>
                    </label>
                  )}

                  {commercialRegister && (
                    <div className="relative">
                      <Image
                        src={commercialRegisterPreview!}
                        alt={t("uploads.crPreviewAlt")}
                        className="w-full h-48 object-cover rounded-lg border-2 border-logo-gold"
                        width={400}
                        height={192}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("commercial_register")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    {t("uploads.uploadCRHelp")}
                  </p>
                  {errors.commercial_register && (
                    <p className="text-sm text-red-500">
                      {errors.commercial_register}
                    </p>
                  )}
                </div>

                {/* Avatar Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-logo-black mb-2">
                    <User size={16} color="gray" />
                    {t("labels.avatar")} <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="file"
                    id="avatar"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(file, "avatar");
                    }}
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                  />

                  {!avatar && (
                    <label
                      htmlFor="avatar"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-logo-gold/50 rounded-lg cursor-pointer hover:border-logo-gold hover:bg-logo-gold/5 transition-colors"
                    >
                      <div className="text-center">
                        <User
                          className="mx-auto text-logo-gold mb-2"
                          size={24}
                        />
                        <p className="text-sm text-logo-black">
                          {t("uploads.clickToSelectAvatar")}
                        </p>
                        <p className="text-xs text-logo-black/60">
                          {t("help.uploadNote")}
                        </p>
                      </div>
                    </label>
                  )}

                  {avatar && (
                    <div className="relative">
                      <Image
                        src={avatarPreview!}
                        alt={t("uploads.avatarPreviewAlt")}
                        className="w-full h-48 object-cover rounded-lg border-2 border-logo-gold"
                        width={400}
                        height={192}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile("avatar")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove file"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    {t("uploads.uploadAvatarHelp")}
                  </p>
                  {errors.avatar && (
                    <p className="text-sm text-red-500">{errors.avatar}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 bg-white p-6 md:p-8 text-center">
              <Button
                type="submit"
                disabled={isLoading || !isLocationSelected}
                variant="gold"
                size="lg"
                className="px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("actions.submitting")}
                  </>
                ) : (
                  t("actions.submit")
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
