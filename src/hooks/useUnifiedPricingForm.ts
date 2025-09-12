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
  userPricingSchema,
  type UserPricingFormData,
  defaultValues,
} from "@/lib/validations/userPricingSchema";

// Helper type for saved form data
export type SavedUnifiedFormData = UserPricingFormData & {
  id: string;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  submittedAt: Date;
};

export function useUnifiedPricingForm(userType?: "shop" | "workshop" | null) {
  const [savedForms, setSavedForms] = useState<SavedUnifiedFormData[]>([]);
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

  // Get user type from local storage
  const getUserTypeFromStorage = () => {
    const user = storage.getUser();
    return user?.type || "shop"; // Default to "shop" if no user type found
  };

  // Get user code from local storage
  const getUserCodeFromStorage = () => {
    const user = storage.getUser();
    return user?.code || "";
  };

  // Check if user is authenticated
  const isAuthenticated = storage.isAuthenticated();

  const form = useForm<UserPricingFormData, object, UserPricingFormData>({
    resolver: zodResolver(userPricingSchema),
    defaultValues: {
      ...defaultValues,
      // Set userType based on authentication status
      // For authenticated users with complete registration, use their profile type
      // For unauthenticated users, default to "workshop" to show the selector
      userType:
        isAuthenticated && userType
          ? userType === "shop"
            ? "store"
            : "workshop"
          : "workshop",
      // Set user code from storage if available
      userCode: getUserCodeFromStorage(),
    },
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
      form.setValue(field, undefined);
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
    form.setValue(field, undefined);
    if (field === "partImage") setPartImagePreview(null);
    if (field === "requestImage") setRequestImagePreview(null);
    if (field === "formImage") setFormImagePreview(null);
  };

  const onSubmit = async (data: UserPricingFormData) => {
    // Check authentication before allowing form submission
    if (!handleAuthCheck()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create saved form data
      const newSavedForm: SavedUnifiedFormData = {
        ...data,
        id: Date.now().toString(),
        partImagePreview,
        requestImagePreview,
        formImagePreview,
        submittedAt: new Date(),
      };

      setSavedForms((prev) => [...prev, newSavedForm]);

      // Reset form and previews
      form.reset({
        ...defaultValues,
        userType: data.userType === "store" ? "store" : "workshop", // Map to correct type
        userCode: getUserCodeFromStorage(), // Keep the user code from storage
      } as UserPricingFormData);
      setPartImagePreview(null);
      setRequestImagePreview(null);
      setFormImagePreview(null);

      showSuccess(t("success.formSaved") || "تم حفظ النموذج بنجاح!");
    } catch (error) {
      console.error("Error saving form:", error);
      showError(t("errors.saveFailed") || "حدث خطأ أثناء حفظ البيانات");
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
      // Prepare items array based on user type
      const items: RequestItem[] = [];

      savedForms.forEach((form) => {
        if (form.userType === "store") {
          // For shop: create a single item with part name and quantity
          items.push({
            part_name: form.partName,
            quantity: form.quantity,
            // Shop doesn't need chassis_number, part_image_path, order_image_path, form_image_path
          });
        } else if (form.userType === "workshop") {
          // For workshop: create a single item with all fields including images
          items.push({
            part_name: form.partName,
            quantity: form.quantity,
            chassis_number: form.chassisNumber,
            part_image_path: form.partImage,
            order_image_path: form.requestImage,
            form_image_path: form.formImage,
          });
        }
      });

      console.log(
        `Sending ${savedForms[0]?.userType} items to backend:`,
        items
      );

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
