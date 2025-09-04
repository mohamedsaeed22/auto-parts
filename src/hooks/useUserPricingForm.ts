import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { storage } from "@/lib/storage";
import {
  userPricingSchema,
  type UserPricingFormData,
  defaultValues,
} from "@/lib/validations/userPricingSchema";
import { useShopPricingForm } from "./useShopPricingForm";
import { useWorkshopPricingForm } from "./useWorkshopPricingForm";

export function useUserPricingForm() {
  // Get user type from local storage
  const getUserTypeFromStorage = () => {
    const user = storage.getUser();
    return user?.type || "shop"; // Default to "shop" if no user type found
  };

  // Check if user is authenticated
  const isAuthenticated = storage.isAuthenticated();

  const form = useForm<UserPricingFormData>({
    resolver: zodResolver(userPricingSchema),
    defaultValues: {
      ...defaultValues,
      // Only set userType from storage if user is authenticated
      // Otherwise, let the UserTypeSelector handle it
      userType: isAuthenticated
        ? (getUserTypeFromStorage() as "workshop" | "shop")
        : "workshop",
    },
    mode: "onChange",
  });

  // Set user type from local storage when component mounts (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      const userType = getUserTypeFromStorage();
      form.setValue("userType", userType as "workshop" | "shop");
    }
  }, [form, isAuthenticated]);

  // Get current user type from form
  const userType = form.watch("userType");

  // Use separate hooks based on user type
  const shopForm = useShopPricingForm();
  const workshopForm = useWorkshopPricingForm();

  // Return the appropriate form data based on user type
  if (userType === "shop") {
    return {
      form: shopForm.form as UseFormReturn<UserPricingFormData>,
      savedForms: shopForm.savedForms as unknown[], // Type assertion for compatibility
      partImagePreview: shopForm.partImagePreview,
      requestImagePreview: shopForm.requestImagePreview,
      formImagePreview: shopForm.formImagePreview,
      isSubmitting: shopForm.isSubmitting,
      isSendingToBackend: shopForm.isSendingToBackend,
      handleImageChange: shopForm.handleImageChange,
      removeImage: shopForm.removeImage,
      onSubmit: shopForm.onSubmit as (data: UserPricingFormData) => void,
      deleteSavedForm: shopForm.deleteSavedForm,
      sendAllToBackend: shopForm.sendAllToBackend,
    };
  } else {
    return {
      form: workshopForm.form as UseFormReturn<UserPricingFormData>,
      savedForms: workshopForm.savedForms as unknown[], // Type assertion for compatibility
      partImagePreview: workshopForm.partImagePreview,
      requestImagePreview: workshopForm.requestImagePreview,
      formImagePreview: workshopForm.formImagePreview,
      isSubmitting: workshopForm.isSubmitting,
      isSendingToBackend: workshopForm.isSendingToBackend,
      handleImageChange: workshopForm.handleImageChange,
      removeImage: workshopForm.removeImage,
      onSubmit: workshopForm.onSubmit as (data: UserPricingFormData) => void,
      deleteSavedForm: workshopForm.deleteSavedForm,
      sendAllToBackend: workshopForm.sendAllToBackend,
    };
  }
}
