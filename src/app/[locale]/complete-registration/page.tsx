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
import FormSelect from "@/components/ui/FormSelect";
import LocationPicker from "@/components/LocationPicker";
import type { LocationData } from "@/components/LocationPicker";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/validations/registrationSchema";

export default function CompleteRegistrationPage() {
  // ALL HOOKS MUST BE CALLED FIRST - before any early returns
  const [completeRegistration, { isLoading }] =
    useCompleteRegistrationMutation();
  const { authData } = useAuth();
  const router = useRouter();
  const { currentLocale } = useLocale();
  const { clearRegistrationIncomplete } = useRegistrationStatus();
  const { t, i18n } = useTranslation("registration");
  const isRTL = i18n.language === "ar";

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      type: undefined, // No pre-selected value
      manager_name: "",
      address: "",
      city: "",
      zip: "",
      state: "",
      tax_number: "",
      latitude: "",
      longitude: "",
    },
  });

  // Watch latitude and longitude to determine if location is selected
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const isLocationSelected = Boolean(
    latitude &&
      longitude &&
      !isNaN(Number(latitude)) &&
      !isNaN(Number(longitude))
  );
  const hasLocationError = Boolean(errors.latitude || errors.longitude);

  // Determine if location validation should be shown
  const shouldShowLocationError = hasLocationError && !isLocationSelected;

  // Check if location is required (no lat/lng values)
  const isLocationRequired =
    !latitude ||
    !longitude ||
    latitude.trim() === "" ||
    longitude.trim() === "";

  // State for file uploads and previews
  const [commercialRegisterPreview, setCommercialRegisterPreview] = useState<
    string | null
  >(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // State for API errors
  const [apiErrors, setApiErrors] = useState<
    Array<{ key: string; value: string[] }>
  >([]);

  // Debug: Watch all form values
  const allFormValues = watch();

  // Debug function to manually check form values
  const debugFormValues = () => {
    console.log("=== MANUAL FORM DEBUG ===");
    console.log("All form values:", allFormValues);
    console.log("Form errors:", errors);
    console.log("Form is valid:", Object.keys(errors).length === 0);
    console.log("API Errors:", apiErrors);

    // Test setting API errors manually
    setApiErrors([
      {
        key: "test",
        value: ["This is a test error message"],
      },
    ]);
  };

  // Check if user has already completed registration
  const hasRedirectedRef = useRef(false);

  // Handle location selection from the map
  const handleLocationSelect = (locationData: LocationData) => {
    // Store coordinates as strings (required by schema)
    setValue("latitude", locationData.lat.toString());
    setValue("longitude", locationData.lng.toString());

    // Auto-fill other fields if available, but allow user to edit
    if (locationData.address) setValue("address", locationData.address.trim());
    if (locationData.city) setValue("city", locationData.city.trim());
    if (locationData.state) setValue("state", locationData.state.trim());
    if (locationData.postal_code)
      setValue("zip", locationData.postal_code.trim());

    // Clear location-related errors
    clearErrors(["latitude", "longitude", "address", "city", "state", "zip"]);

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

  // Handle file changes
  const handleFileChange = (
    file: File | undefined,
    fieldName: "commercial_register" | "avatar"
  ) => {
    if (fieldName === "commercial_register") {
      if (file) {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          return;
        }
        setValue("commercial_register", file);
        // Create preview for image files
        const reader = new FileReader();
        reader.onload = (e) =>
          setCommercialRegisterPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setValue(
          "commercial_register",
          undefined as unknown as RegistrationFormData["commercial_register"]
        );
        setCommercialRegisterPreview(null);
      }
    } else if (fieldName === "avatar") {
      if (file) {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          return;
        }
        setValue("avatar", file);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setValue(
          "avatar",
          undefined as unknown as RegistrationFormData["avatar"]
        );
        setAvatarPreview(null);
      }
    }
  };

  const handleRemoveFile = (fieldName: "commercial_register" | "avatar") => {
    if (fieldName === "commercial_register") {
      setValue(
        "commercial_register",
        undefined as unknown as RegistrationFormData["commercial_register"]
      );
      setCommercialRegisterPreview(null);
    } else if (fieldName === "avatar") {
      setValue(
        "avatar",
        undefined as unknown as RegistrationFormData["avatar"]
      );
      setAvatarPreview(null);
    }
  };

  // Handle form submission
  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Clear any previous errors
      setApiErrors([]);

      // Validate location only if coordinates are provided but invalid
      if (
        (data.latitude && isNaN(Number(data.latitude))) ||
        (data.longitude && isNaN(Number(data.longitude)))
      ) {
        setApiErrors([
          {
            key: "location",
            value: [
              t(
                "validation.locationInvalid",
                isRTL
                  ? "إحداثيات الموقع غير صحيحة"
                  : "Invalid location coordinates"
              ),
            ],
          },
        ]);
        return;
      }

      // Handle file uploads by getting files from the DOM inputs
      const commercialRegisterInput = document.getElementById(
        "commercial_register"
      ) as HTMLInputElement;
      const avatarInput = document.getElementById("avatar") as HTMLInputElement;

      const commercialRegisterFile = commercialRegisterInput?.files?.[0];
      const avatarFile = avatarInput?.files?.[0];

      console.log("Commercial register file:", commercialRegisterFile);
      console.log("Avatar file:", avatarFile);

      // Prepare the data object for the API service
      const registrationData = {
        ...data,
        commercial_register: commercialRegisterFile,
        avatar: avatarFile,
      };

      console.log("Registration data being sent to API:", registrationData);

      // Send the request to the API - let the API service handle FormData creation
      type RegistrationResponse = { data?: { user: unknown } };
      const mutationResult = await (
        completeRegistration as unknown as (body: unknown) => Promise<unknown>
      )(registrationData);
      const result: RegistrationResponse =
        typeof (mutationResult as { unwrap?: unknown }).unwrap === "function"
          ? await (
              mutationResult as { unwrap: () => Promise<RegistrationResponse> }
            ).unwrap()
          : (mutationResult as RegistrationResponse);

      if (result.data) {
        // Update only the user data while preserving the existing token
        const baseUser: Record<string, unknown> =
          result.data &&
          typeof result.data.user === "object" &&
          result.data.user !== null
            ? (result.data.user as Record<string, unknown>)
            : {};

        let pointsValue = 0;
        const maybePoints = baseUser["points"];
        if (typeof maybePoints === "number") {
          pointsValue = maybePoints;
        }

        const updatedUser = Object.assign({}, baseUser, {
          is_registration_complete: true,
          points: pointsValue,
        }) as Record<string, unknown>;

        // Update only the user data, don't replace the entire auth structure
        // Fall back to existing user object shape if necessary
        const currentUser = (authData?.user ?? {}) as unknown as Record<
          string,
          unknown
        >;
        const mergedUser = Object.assign({}, currentUser, updatedUser);
        storage.updateUser(mergedUser as NonNullable<typeof authData>["user"]);

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
      console.log("Full error object:", JSON.stringify(error, null, 2));
      console.log("Error type:", typeof error);
      console.log(
        "Error keys:",
        error && typeof error === "object"
          ? Object.keys(error)
          : "Not an object"
      );

      // Handle API validation errors
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as {
          code?: number;
          message?: string;
          errors?: Array<{ key: string; value: string[] }>;
        };
        console.log("Error data:", errorData);
        console.log("Error data code:", errorData.code);
        console.log("Error data errors:", errorData.errors);
        console.log("Is errors array?", Array.isArray(errorData.errors));

        // Check if it's a 422 validation error with the specific format
        if (
          errorData.code === 422 &&
          errorData.errors &&
          Array.isArray(errorData.errors)
        ) {
          console.log("Server validation errors:", errorData.errors);
          setApiErrors(errorData.errors);
          // Scroll to top where errors are displayed
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // Handle other error formats
        if (errorData.errors && Array.isArray(errorData.errors)) {
          console.log("Setting API errors:", errorData.errors);
          setApiErrors(errorData.errors);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // If we get here, show generic error
      console.log("No specific error handling matched, showing generic error");
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
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* API Error Messages */}
            {apiErrors.length > 0 && (
              <div className="p-4 bg-red-50 border-b border-red-100">
                <div className="flex flex-col gap-2">
                  {apiErrors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      {error.value.map((message, messageIndex) => (
                        <div
                          key={messageIndex}
                          className="flex items-start gap-2"
                        >
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
                  <MapPin
                    className={`w-5 h-5 mr-2 ${
                      shouldShowLocationError
                        ? "text-red-500"
                        : isLocationSelected
                        ? "text-green-500"
                        : isLocationRequired
                        ? "text-amber-500"
                        : "text-logo-gold"
                    }`}
                  />
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

              <div
                className={
                  "rounded-lg overflow-hidden " +
                  (shouldShowLocationError
                    ? "border-2 border-red-500 ring-2 ring-red-200"
                    : isLocationSelected
                    ? "border-2 border-green-500 ring-2 ring-green-200"
                    : isLocationRequired
                    ? "border-2 border-amber-500 ring-2 ring-amber-200"
                    : "border-2 border-gray-300 ring-2 ring-gray-100")
                }
                aria-invalid={shouldShowLocationError || undefined}
              >
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    isLocationSelected
                      ? {
                          lat: Number(latitude),
                          lng: Number(longitude),
                        }
                      : {
                          lat: 24.7136, // Default to Riyadh, Saudi Arabia
                          lng: 46.6753,
                        }
                  }
                  className="w-full h-96"
                  error={
                    shouldShowLocationError
                      ? t(
                          "validation.locationRequired",
                          isRTL ? "الموقع مطلوب" : "Location is required"
                        )
                      : undefined
                  }
                />
              </div>

              {/* Location Status Message */}
              {isLocationRequired ? (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-sm text-amber-700 font-medium">
                      {t(
                        "location.requiredInstruction",
                        "Please select your business location on the map above"
                      )}
                    </p>
                  </div>
                </div>
              ) : shouldShowLocationError ? (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm text-red-700 font-medium">
                      {t(
                        "validation.locationRequired",
                        isRTL ? "الموقع مطلوب" : "Location is required"
                      )}
                    </p>
                  </div>
                </div>
              ) : isLocationSelected ? (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-700 font-medium">
                      {t(
                        "location.selectedSuccess",
                        "Location selected successfully!"
                      )}
                    </p>
                  </div>
                </div>
              ) : null}

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Basic Information */}
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-logo-black flex items-center mb-3">
                    <User className="w-4 h-4 mr-2 text-logo-gold" />
                    {t("sections.basicInfo", "Basic Information")}
                  </h4>

                  <FormInput
                    label={t("labels.name")}
                    type="text"
                    id="name"
                    {...register("name")}
                    placeholder={t("placeholders.name")}
                    required
                    icon={User}
                    error={errors.name?.message}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={`${t("labels.email")} (${t(
                      "optional",
                      "Optional"
                    )})`}
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder={t("placeholders.email")}
                    required={false}
                    icon={Mail}
                    error={errors.email?.message}
                    translationNamespace="registration"
                  />

                  <div className="space-y-1">
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <FormSelect
                          id="type"
                          name="type"
                          label={t("labels.type")}
                          required
                          placeholder={t("placeholders.selectType")}
                          value={field.value}
                          onValueChange={field.onChange}
                          options={[
                            { value: "shop", label: t("typeOptions.shop") },
                            {
                              value: "workshop",
                              label: t("typeOptions.workshop"),
                            },
                          ]}
                          error={errors.type?.message}
                        />
                      )}
                    />
                  </div>

                  <FormInput
                    label={t("labels.managerName")}
                    type="text"
                    id="manager_name"
                    {...register("manager_name")}
                    placeholder={t("placeholders.managerName")}
                    required
                    icon={User}
                    error={errors.manager_name?.message}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.taxNumber")}
                    type="text"
                    id="tax_number"
                    {...register("tax_number")}
                    placeholder={t("placeholders.taxNumber")}
                    required
                    icon={FileText}
                    error={errors.tax_number?.message}
                    translationNamespace="registration"
                  />
                </div>

                {/* Address Information */}
                <div className="space-y-3">
                  <h4 className="text-md font-semibold text-logo-black flex items-center mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-logo-gold" />
                    {t("sections.addressInfo", "Address Information")}
                  </h4>

                  <FormInput
                    label={t("labels.address")}
                    type="text"
                    id="address"
                    {...register("address")}
                    placeholder={t("placeholders.address")}
                    required
                    icon={MapPin}
                    error={errors.address?.message}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.city")}
                    type="text"
                    id="city"
                    {...register("city")}
                    placeholder={t("placeholders.city")}
                    required
                    icon={Building}
                    error={errors.city?.message}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.state")}
                    type="text"
                    id="state"
                    {...register("state")}
                    placeholder={t("placeholders.state")}
                    required
                    icon={MapPin}
                    error={errors.state?.message}
                    translationNamespace="registration"
                  />

                  <FormInput
                    label={t("labels.zip")}
                    type="text"
                    id="zip"
                    {...register("zip")}
                    placeholder={t("placeholders.zip")}
                    required
                    icon={Hash}
                    error={errors.zip?.message}
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
                    name="commercial_register"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(file, "commercial_register");
                    }}
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                  />

                  {!commercialRegisterPreview && (
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

                  {commercialRegisterPreview && (
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
                      {errors.commercial_register.message ===
                      "Input not instance of File"
                        ? t(
                            "validation.crRequired",
                            "Commercial register image is required"
                          )
                        : errors.commercial_register.message
                        ? t(errors.commercial_register.message) ||
                          errors.commercial_register.message
                        : ""}
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
                    name="avatar"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleFileChange(file, "avatar");
                    }}
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                  />

                  {!avatarPreview && (
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

                  {avatarPreview && (
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
                    <p className="text-sm text-red-500">
                      {errors.avatar.message === "Input not instance of File"
                        ? t(
                            "validation.avatarRequired",
                            "Profile image is required"
                          )
                        : errors.avatar.message
                        ? t(errors.avatar.message) || errors.avatar.message
                        : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Error Messages and Submit Button */}
            <div className="border-t border-gray-200 bg-white p-6 md:p-8">
              {/* API Error Messages */}
              {apiErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-800 mb-3">
                    {t("errors.validationErrors", "Validation Errors")}
                  </h4>
                  <div className="space-y-2">
                    {apiErrors.map((error, index) => (
                      <div key={index}>
                        {error.value.map((message, messageIndex) => (
                          <div
                            key={messageIndex}
                            className="flex items-start gap-2 text-sm text-red-700 mb-1"
                          >
                            <span className="text-red-500 mt-1">•</span>
                            <span>{message}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Debug Button */}
              <div className="text-center mb-4">
                <Button
                  type="button"
                  onClick={debugFormValues}
                  variant="outline"
                  size="sm"
                  className="mr-4"
                >
                  Debug Form Values
                </Button>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isLoading}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
