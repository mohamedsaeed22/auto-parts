import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  userPricingSchema,
  type UserPricingFormData,
  type SavedFormData,
  defaultValues,
} from "@/lib/validations/userPricingSchema";

export function useUserPricingForm() {
  const [savedForms, setSavedForms] = useState<SavedFormData[]>([]);
  const [partImagePreview, setPartImagePreview] = useState<string | null>(null);
  const [requestImagePreview, setRequestImagePreview] = useState<string | null>(
    null
  );
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingToBackend, setIsSendingToBackend] = useState(false);

  const form = useForm<UserPricingFormData>({
    resolver: zodResolver(userPricingSchema),
    defaultValues,
    mode: "onChange",
  });

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
    setIsSubmitting(true);

    try {
      // Create saved form data
      const newSavedForm: SavedFormData = {
        ...data,
        id: Date.now().toString(),
        partImagePreview,
        requestImagePreview,
        formImagePreview,
        submittedAt: new Date(),
      };

      setSavedForms((prev) => [...prev, newSavedForm]);

      // Reset form and previews
      form.reset(defaultValues);
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
    if (savedForms.length === 0) {
      alert("لا توجد بيانات لإرسالها!");
      return;
    }

    setIsSendingToBackend(true);

    try {
      // Prepare data for backend
      const dataToSend = savedForms.map((form) => ({
        id: form.id,
        userType: form.userType,
        userCode: form.userCode,
        partName: form.partName,
        hasPartImage: form.partImage !== undefined,
        partImageName: form.partImage?.name || null,
        hasRequestImage: form.requestImage !== undefined,
        requestImageName: form.requestImage?.name || null,
        hasFormImage: form.formImage !== undefined,
        formImageName: form.formImage?.name || null,
        quantity: form.quantity,
        chassisNumber: form.chassisNumber,
        submittedAt: form.submittedAt.toISOString(),
      }));

      console.log("Sending data to backend:", dataToSend);
      console.log("Full saved forms with images:", savedForms);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear saved forms after successful submission
      setSavedForms([]);
      alert("تم إرسال جميع البيانات بنجاح!");
    } catch (error) {
      console.error("Error sending data:", error);
      alert("حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
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
