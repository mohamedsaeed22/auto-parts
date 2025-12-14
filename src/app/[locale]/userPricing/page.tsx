"use client";

import { useUnifiedPricingForm } from "@/hooks/useUnifiedPricingForm";
import { HeroSection } from "@/components/userPricing/HeroSection";
import { PricingForm } from "@/components/userPricing/PricingForm";
import { SavedFormsList } from "@/components/userPricing/SavedFormsList";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "@/contexts/auth-context";

export default function UserPricingPage() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Use reactive authentication context instead of static storage checks
  const { isAuthenticated, isRegistrationComplete, user } = useAuthContext();

  const {
    form,
    savedForms,
    partImagePreview,
    requestImagePreview,
    formImagePreview,
    isSubmitting,
    isSendingToBackend,
    apiErrors,
    handleImageChange,
    removeImage,
    onSubmit,
    deleteSavedForm,
    sendAllToBackend,
  } = useUnifiedPricingForm(user?.type as "shop" | "workshop" | undefined);

  // Form is now handled by the unified PricingForm component

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
              partImagePreview={partImagePreview}
              requestImagePreview={requestImagePreview}
              formImagePreview={formImagePreview}
              isSubmitting={isSubmitting}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              onSubmit={onSubmit}
              isAuthenticated={isAuthenticated}
              isRegistrationComplete={isRegistrationComplete}
              userType={user?.type as "shop" | "workshop" | undefined}
              apiErrors={apiErrors}
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
