"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCompleteRegistrationMutation } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
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

  // State for form fields - these must also be called before any early returns
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "shop" as "shop" | "workshop", // shop or workshop
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
        showSuccess("Registration already completed!");
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
      return `File must be of type: jpeg, png, jpg, gif, svg`;
    }

    if (file.size > maxSize) {
      return `File size must be less than 5MB`;
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
      newErrors.name = "Name is required";
    }
    if (!formData.manager_name.trim()) {
      newErrors.manager_name = "Manager name is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.tax_number.trim()) {
      newErrors.tax_number = "Tax number is required";
    }

    // Validate file uploads
    if (!commercialRegister) {
      newErrors.commercial_register = "Commercial register is required";
    }
    if (!avatar) {
      newErrors.avatar = "Avatar is required";
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
        showSuccess("Registration completed successfully!");

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
      showError("Failed to complete registration. Please try again.");
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
            Complete Registration
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please complete your registration data to access all features
          </p>
          {authData.user?.code && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-logo-gold/10 text-logo-gold rounded-lg border border-logo-gold/20">
              <Hash className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                User Code: {authData.user.code}
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
                label="Name"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                icon={User}
                error={errors.name}
              />

              <FormInput
                label="Email"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email (optional)"
                // helpText="Leave empty if you don't have an email"
                icon={Mail}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Type <span className="text-accent">*</span>
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "shop" | "workshop") =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="w-full h-12 px-3 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shop">Shop</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormInput
                label="Manager Name"
                type="text"
                id="manager_name"
                name="manager_name"
                value={formData.manager_name}
                onChange={handleInputChange}
                placeholder="Enter manager name"
                required
                icon={User}
                error={errors.manager_name}
              />

              <FormInput
                label="Address"
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                required
                icon={MapPin}
                error={errors.address}
              />

              <FormInput
                label="City"
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
                icon={Building}
                error={errors.city}
              />

              <FormInput
                label="ZIP Code"
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                placeholder="Enter ZIP code"
                required
                icon={Hash}
                error={errors.zip}
              />

              <FormInput
                label="State"
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                required
                icon={MapPin}
                error={errors.state}
              />

              <FormInput
                label="Tax Number"
                type="text"
                id="tax_number"
                name="tax_number"
                value={formData.tax_number}
                onChange={handleInputChange}
                placeholder="Enter tax number"
                required
                icon={FileText}
                error={errors.tax_number}
              />

              <FormInput
                label="Latitude (Static)"
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                disabled
                placeholder="Static latitude value"
                helpText="Fixed location: Cairo, Egypt"
                icon={MapPin}
              />

              <FormInput
                label="Longitude (Static)"
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                disabled
                placeholder="Static longitude value"
                helpText="Fixed location: Cairo, Egypt"
                icon={MapPin}
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Commercial Register Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-logo-black mb-2">
                  <FileText size={16} color="gray" />
                  Commercial Register
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
                        Click to select Commercial Register
                      </p>
                      <p className="text-xs text-logo-black/60">
                        Image up to 5MB (jpeg, png, jpg, gif, svg)
                      </p>
                    </div>
                  </label>
                )}

                {commercialRegister && (
                  <div className="relative">
                    <Image
                      src={commercialRegisterPreview!}
                      alt="Commercial Register Preview"
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
                  Upload commercial register document (jpeg, png, jpg, gif, svg)
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
                  Avatar
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
                        Click to select Avatar
                      </p>
                      <p className="text-xs text-logo-black/60">
                        Image up to 5MB (jpeg, png, jpg, gif, svg)
                      </p>
                    </div>
                  </label>
                )}

                {avatar && (
                  <div className="relative">
                    <Image
                      src={avatarPreview!}
                      alt="Avatar Preview"
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
                  Upload your profile picture (jpeg, png, jpg, gif, svg)
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
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
