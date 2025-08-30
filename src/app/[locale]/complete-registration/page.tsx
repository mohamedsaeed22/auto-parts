"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCompleteRegistrationMutation } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useRegistrationStatus } from "@/hooks/useRegistrationStatus";
import { showSuccess, showError } from "@/lib/toast";
import { Loader2 } from "lucide-react";
import { storage } from "@/lib/storage";

export default function CompleteRegistrationPage() {
  // Hooks
  const [completeRegistration, { isLoading }] =
    useCompleteRegistrationMutation();
  const { login } = useAuth();
  const router = useRouter();
  const { currentLocale } = useLocale();
  const { clearRegistrationIncomplete } = useRegistrationStatus();

  // State for form fields
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
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0] || null;
    if (fieldName === "commercial_register") {
      setCommercialRegister(file);
    } else if (fieldName === "avatar") {
      setAvatar(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        // Create the auth data object
        const authData = {
          user: result.data.user,
          token: result.data.token,
          is_registration_complete: true,
        };

        console.log("About to store auth data:", authData);
        console.log("Token to be stored:", result.data.token);

        // Update auth data with completed registration
        login(authData);

        // Verify the token was stored
        const storedAuth = storage.getAuth();
        console.log("Stored auth data after login:", storedAuth);
        console.log("Is authenticated after login:", storage.isAuthenticated());
        console.log("Token in storage:", storage.getToken());

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Registration
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please complete your registration data to access all features
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if you don&apos;t have an email
                </p>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="shop">Shop</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="manager_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Manager Name *
                </label>
                <input
                  type="text"
                  id="manager_name"
                  name="manager_name"
                  value={formData.manager_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter manager name"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ZIP Code *
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ZIP code"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label
                  htmlFor="tax_number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tax Number *
                </label>
                <input
                  type="text"
                  id="tax_number"
                  name="tax_number"
                  value={formData.tax_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tax number"
                />
              </div>

              <div>
                <label
                  htmlFor="latitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Latitude (Static)
                </label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  placeholder="Static latitude value"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fixed location: Cairo, Egypt
                </p>
              </div>

              <div>
                <label
                  htmlFor="longitude"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Longitude (Static)
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  placeholder="Static longitude value"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fixed location: Cairo, Egypt
                </p>
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="commercial_register"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Commercial Register
                </label>
                <input
                  type="file"
                  id="commercial_register"
                  onChange={(e) => handleFileChange(e, "commercial_register")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*,.pdf"
                />
                {commercialRegister && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {commercialRegister.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  onChange={(e) => handleFileChange(e, "avatar")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                {avatar && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {avatar.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
