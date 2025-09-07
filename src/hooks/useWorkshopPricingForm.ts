import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { storage } from "@/lib/storage";
import { showError, showSuccess } from "@/lib/toast";
import { useTranslation } from "react-i18next";
import { useCreateRequestMutation } from "@/services/hooks";
import type { RequestItem } from "@/services/api/requestsApi";
import {
  workshopPricingSchema,
  type WorkshopPricingFormData,
  workshopDefaultValues,
} from "@/lib/validations/workshopPricingSchema";

// Helper type for saved form data
export type SavedWorkshopFormData = WorkshopPricingFormData & {
  id: string;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  submittedAt: Date;
};

export function useWorkshopPricingForm() {
  const [savedForms, setSavedForms] = useState<SavedWorkshopFormData[]>([]);
  const [partImagePreview, setPartImagePreview] = useState<string | null>(null);
  const [requestImagePreview, setRequestImagePreview] = useState<string | null>(
    null
  );
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingToBackend, setIsSendingToBackend] = useState(false);

  const router = useRouter();
  const { currentLocale } = useLocale();
  const { t } = useTranslation("userPricing");

  // API mutation for creating requests
  const [createRequest] = useCreateRequestMutation();

  const form = useForm<WorkshopPricingFormData>({
    resolver: zodResolver(workshopPricingSchema),
    defaultValues: workshopDefaultValues,
    mode: "onChange",
  });

  // Check authentication status
  const checkAuthStatus = () => {
    const isAuthenticated = storage.isAuthenticated();
    const isRegistrationComplete = storage.isRegistrationComplete();

    return { isAuthenticated, isRegistrationComplete };
  };

  // Handle authentication check for form submission
  const handleAuthCheck = () => {
    const { isAuthenticated, isRegistrationComplete } = checkAuthStatus();

    if (!isAuthenticated) {
      showError(
        t("auth.loginRequired") || "Please login to access this feature"
      );
      return false;
    }

    if (!isRegistrationComplete) {
      showError(
        t("auth.completeRegistrationRequired") ||
          "Please complete your registration to access this feature"
      );
      // Navigate to complete registration page
      router.push(`/${currentLocale}/complete-registration`);
      return false;
    }

    return true;
  };

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (
    file: File | undefined,
    field: "partImage" | "requestImage" | "formImage"
  ) => {
    if (!file) {
      // Clear image and preview
      // Note: We can't set required fields to undefined, so we'll just clear the previews
      if (field === "partImage") setPartImagePreview(null);
      if (field === "requestImage") setRequestImagePreview(null);
      if (field === "formImage") setFormImagePreview(null);
      return;
    }

    // Set the file in form
    form.setValue(field, file);

    // Create and set preview
    try {
      const preview = await createFilePreview(file);
      if (field === "partImage") setPartImagePreview(preview);
      if (field === "requestImage") setRequestImagePreview(preview);
      if (field === "formImage") setFormImagePreview(preview);
    } catch (error) {
      console.error("Error creating file preview:", error);
    }
  };

  const removeImage = (field: "partImage" | "requestImage" | "formImage") => {
    // Note: We can't set required fields to undefined, so we'll just clear the previews
    if (field === "partImage") setPartImagePreview(null);
    if (field === "requestImage") setRequestImagePreview(null);
    if (field === "formImage") setFormImagePreview(null);
  };

  const onSubmit = async (data: WorkshopPricingFormData) => {
    // Check authentication before allowing form submission
    if (!handleAuthCheck()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create saved form data
      const newSavedForm: SavedWorkshopFormData = {
        ...data,
        id: Date.now().toString(),
        partImagePreview,
        requestImagePreview,
        formImagePreview,
        submittedAt: new Date(),
      };

      setSavedForms((prev) => [...prev, newSavedForm]);

      // Reset form and previews
      form.reset(workshopDefaultValues);
      setPartImagePreview(null);
      setRequestImagePreview(null);
      setFormImagePreview(null);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSavedForm = (id: string) => {
    setSavedForms((prev) => prev.filter((form) => form.id !== id));
  };

  const sendAllToBackend = async () => {
    // Check authentication before allowing backend operation
    if (!handleAuthCheck()) {
      return;
    }

    if (savedForms.length === 0) {
      showError(t("errors.noDataToSend") || "لا توجد بيانات لإرسالها!");
      return;
    }

    setIsSendingToBackend(true);

    try {
      // Prepare items array for workshop (single item with all fields)
      const items: RequestItem[] = [];

      savedForms.forEach((form) => {
        items.push({
          part_name: form.partName,
          quantity: form.quantity,
          chassis_number: form.chassisNumber,
          part_image_path: form.partImage,
          order_image_path: form.requestImage,
          form_image_path: form.formImage,
        });
      });

      console.log("Sending workshop items to backend:", items);

      // Send to API
      const result = await createRequest({ items }).unwrap();

      // Clear saved forms after successful submission
      setSavedForms([]);
      showSuccess(t("success.requestSent") || "تم إرسال الطلب بنجاح!");

      console.log("Request created successfully:", result);
    } catch (error: unknown) {
      console.error("Error sending data:", error);
      const errorMessage =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        t("errors.sendFailed") ||
        "حدث خطأ أثناء الإرسال. حاول مرة أخرى.";
      showError(errorMessage);
    } finally {
      setIsSendingToBackend(false);
    }
  };

  return {
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
  };
}
