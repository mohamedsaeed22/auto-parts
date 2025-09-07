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
import {
  Loader2,
  User,
  Mail,
  Building,
  MapPin,
  Hash,
  FileText,
} from "lucide-react";
import { storage } from "@/lib/storage";
import FormInput from "@/components/ui/FormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    email: "",
    type: "" as "" | "shop" | "workshop", // require user to pick
    manager_name: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    tax_number: "",
    latitude: "30.0444", // Static latitude for Cairo, Egypt (valid range: -90 to 90)
    longitude: "31.2357", // Static longitude for Cairo, Egypt (valid range: -180 to 180)
  });

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
    manager_name?: string;
    address?: string;
    city?: string;
    zip?: string;
    state?: string;
    tax_number?: string;
    commercial_register?: string;
    avatar?: string;
  }>({});

  // Check if user has already completed registration
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Check if user is not authenticated at all
    if (!storage.isAuthenticated() && !hasRedirectedRef.current) {
      console.log("User not authenticated, redirecting to home...");
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
      console.log("User has already completed registration, redirecting...");
      hasRedirectedRef.current = true;

      // Only show success message if we're actually on the complete-registration page
      if (window.location.pathname.includes("/complete-registration")) {
        showSuccess(t("toasts.registrationAlreadyCompleted"));
      }

      router.push(`/${currentLocale}`);
      return;
    }
  }, [authData, currentLocale, router]);

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

    // Validate required fields
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }
    if (!formData.manager_name.trim()) {
      newErrors.manager_name = t("validation.managerRequired");
    }
    if (!formData.address.trim()) {
      newErrors.address = t("validation.addressRequired");
    }
    if (!formData.city.trim()) {
      newErrors.city = t("validation.cityRequired");
    }
    if (!formData.zip.trim()) {
      newErrors.zip = t("validation.zipRequired");
    }
    if (!formData.state.trim()) {
      newErrors.state = t("validation.stateRequired");
    }
    if (!formData.tax_number.trim()) {
      newErrors.tax_number = t("validation.taxRequired");
    }
    // require type selection
    if (!formData.type) {
      newErrors.type = t("validation.typeRequired");
    }

    // Validate file uploads
    if (!commercialRegister) {
      newErrors.commercial_register = t("validation.crRequired");
    }
    if (!avatar) {
      newErrors.avatar = t("validation.avatarRequired");
    }

    // If there are validation errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Create the request data object
      const requestData = {
        name: formData.name,
        email: formData.email.trim() || undefined, // Only send if not empty
        type: formData.type,
        manager_name: formData.manager_name,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        state: formData.state,
        tax_number: formData.tax_number,
        latitude: formData.latitude, // Static value: 30.0444 (Cairo, Egypt)
        longitude: formData.longitude, // Static value: 31.2357 (Cairo, Egypt)
        commercial_register: commercialRegister || undefined,
        avatar: avatar || undefined,
      };

      // Log the data to console
      console.log("Form Data Object:", formData);
      console.log("Commercial Register File:", commercialRegister);
      console.log("Avatar File:", avatar);
      console.log("Request Data:", requestData);

      // Send the request to the API
      const result = await completeRegistration(requestData).unwrap();

      console.log("API Response:", result);
      console.log("API Response structure:", {
        code: result.code,
        message: result.message,
        data: result.data,
        dataType: typeof result.data,
        hasUser: !!result.data?.user,
        hasToken: !!result.data?.token,
      });

      if (result.data) {
        // Update only the user data while preserving the existing token
        const updatedUser = {
          ...result.data.user,
          is_registration_complete: true,
        };

        console.log("About to update user data:", updatedUser);
        console.log("Preserving existing token");

        // Update only the user data, don't replace the entire auth structure
        storage.updateUser(updatedUser);

        // Verify the update worked
        const storedAuth = storage.getAuth();
        console.log("Stored auth data after update:", storedAuth);
        console.log(
          "Is authenticated after update:",
          storage.isAuthenticated()
        );
        console.log("Token in storage:", storage.getToken());
        console.log(
          "User registration complete:",
          storedAuth?.user?.is_registration_complete
        );

        clearRegistrationIncomplete();
        showSuccess(t("toasts.registrationCompleted"));

        // Get the previous page URL and redirect back
        const previousPage = storage.getPreviousPage();
        if (previousPage) {
          console.log("Redirecting back to:", previousPage);
          router.push(previousPage);
        } else {
          // Fallback to home page if no previous page stored
          console.log("No previous page found, redirecting to home");
          router.push(`/${currentLocale}`);
        }
      }
    } catch (error: unknown) {
      console.error("Error completing registration:", error);
      showError(t("toasts.registrationFailed"));
    }
  };

  // NOW we can have conditional rendering - after all hooks are called
  // Show loading while checking auth status
  if (!storage.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while auth data is being fetched
  if (!authData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!authData.token) {
    console.log("User not authenticated, redirecting to home...");
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
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              />

              <FormInput
                label={t("labels.email")}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("placeholders.email")}
                // helpText="Leave empty if you don't have an email"
                icon={Mail}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  {t("labels.type")} <span className="text-accent">*</span>
                </label>
                <Select
                  value={formData.type || undefined}
                  onValueChange={(value: "shop" | "workshop") =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="w-full h-12 px-3 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                    <SelectValue placeholder={t("placeholders.selectType")} />
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
              />

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
              />

              <FormInput
                label={t("labels.latitudeStatic")}
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                disabled
                placeholder={t("placeholders.latitude")}
                helpText={t("help.fixedLocation")}
                icon={MapPin}
              />

              <FormInput
                label={t("labels.longitudeStatic")}
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                disabled
                placeholder={t("placeholders.longitude")}
                helpText={t("help.fixedLocation")}
                icon={MapPin}
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Commercial Register Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-logo-black mb-2">
                  <FileText size={16} color="gray" />
                  {t("labels.commercialRegister")}
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
                  {t("labels.avatar")}
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
                      <User className="mx-auto text-logo-gold mb-2" size={24} />
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

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                variant="gold"
                size="lg"
                className="px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
