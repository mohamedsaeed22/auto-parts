"use client";

import { useUserPricingForm } from "@/hooks/useUserPricingForm";
import { HeroSection } from "@/components/userPricing/HeroSection";
import { PricingForm } from "@/components/userPricing/PricingForm";
import { SavedFormsList } from "@/components/userPricing/SavedFormsList";

export default function UserPricingPage() {
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
          {/* Right Side - Form */}
          <div className="order-1 lg:order-1">
            <PricingForm
              form={form}
              userType={userType}
              partImagePreview={partImagePreview}
              requestImagePreview={requestImagePreview}
              formImagePreview={formImagePreview}
              isSubmitting={isSubmitting}
              // savedFormsCount={savedForms.length}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              onSubmit={onSubmit}
            />
          </div>

          {/* Left Side - Saved Data */}
          <div className="order-2 lg:order-2">
            <SavedFormsList
              savedForms={savedForms}
              isSendingToBackend={isSendingToBackend}
              onSendAll={sendAllToBackend}
              onDeleteForm={deleteSavedForm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
