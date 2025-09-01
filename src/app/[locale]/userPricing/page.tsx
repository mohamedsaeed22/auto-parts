"use client";

import { useUserPricingForm } from "@/hooks/useUserPricingForm";
import { HeroSection } from "@/components/userPricing/HeroSection";
import { PricingForm } from "@/components/userPricing/PricingForm";
import { SavedFormsList } from "@/components/userPricing/SavedFormsList";
import { useTranslation } from "react-i18next";
import { storage } from "@/lib/storage";

export default function UserPricingPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Check authentication status
  const isAuthenticated = storage.isAuthenticated();
  const isRegistrationComplete = storage.isRegistrationComplete();

  const {
    form,
    savedForms,
    partImagePreview,
    requestImagePreview,
    formImagePreview,
    isSubmitting,
    isSendingToBackend,
    handleImageChange,
    removeImage,
    onSubmit,
    deleteSavedForm,
    sendAllToBackend,
  } = useUserPricingForm();

  const { watch } = form;
  const userType = watch("userType");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Section - Split Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Side */}
          <div className={`order-1 ${isRTL ? "lg:order-1" : "lg:order-1"}`}>
            <PricingForm
              form={form}
              userType={userType}
              partImagePreview={partImagePreview}
              requestImagePreview={requestImagePreview}
              formImagePreview={formImagePreview}
              isSubmitting={isSubmitting}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              onSubmit={onSubmit}
              isAuthenticated={isAuthenticated}
              isRegistrationComplete={isRegistrationComplete}
            />
          </div>

          {/* Saved Data Side */}
          <div className={`order-2 ${isRTL ? "lg:order-2" : "lg:order-2"}`}>
            <SavedFormsList
              savedForms={savedForms}
              isSendingToBackend={isSendingToBackend}
              onSendAll={sendAllToBackend}
              onDeleteForm={deleteSavedForm}
              isAuthenticated={isAuthenticated}
              isRegistrationComplete={isRegistrationComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
