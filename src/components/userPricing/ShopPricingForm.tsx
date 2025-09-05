import { Package, Hash, Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ShopPricingFormData } from "@/lib/validations/shopPricingSchema";
import FormInput from "@/components/ui/FormInput";
import { FormSubmissionButton } from "./FormSubmissionButton";
import { InformationPanel } from "./InformationPanel";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ShopPricingFormProps {
  form: UseFormReturn<ShopPricingFormData>;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  isSubmitting: boolean;
  onImageChange: (
    file: File | undefined,
    field: "partImage" | "requestImage" | "formImage"
  ) => void;
  onRemoveImage: (field: "partImage" | "requestImage" | "formImage") => void;
  onSubmit: (data: ShopPricingFormData) => void;
}

export function ShopPricingForm({
  form,
  isSubmitting,
  onSubmit,
}: ShopPricingFormProps) {
  const { t } = useTranslation("userPricing");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
  } = form;

  // Watch all form values for debugging
  const watchedValues = watch();
  
  console.log("Form errors:", errors);
  console.log("Form isValid:", isValid);
  console.log("Watched values:", watchedValues);

  const handleFormSubmit = async (data: ShopPricingFormData) => {
    console.log("=== FORM SUBMISSION START ===");
    console.log("Form data received:", data);
    console.log("Form validation state:", { isValid, errors });
    console.log("Current form values:", getValues());
    
    try {
      await onSubmit(data);
      console.log("=== FORM SUBMISSION SUCCESS ===");
    } catch (error) {
      console.error("=== FORM SUBMISSION ERROR ===", error);
    }
  };

  // Debug button to check current form state
  const handleDebugClick = () => {
    console.log("=== DEBUG INFO ===");
    console.log("Current form values:", getValues());
    console.log("Form errors:", errors);
    console.log("Form isValid:", isValid);
    console.log("Watched values:", watchedValues);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-logo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-logo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-logo-black mb-2">
          {t("form.title")} - {t("form.userType.shop")}
        </h2>
        <p className="text-gray-600">{t("form.subtitle")}</p>
      </div>

      {/* Debug Info Panel */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm font-medium">Debug Info:</p>
        <p className="text-xs">Valid: {isValid ? "✅" : "❌"}</p>
        <p className="text-xs">Errors: {Object.keys(errors).length}</p>
        <Button 
          type="button" 
          onClick={handleDebugClick}
          size="sm"
          variant="outline"
          className="mt-2"
        >
          Log Form State
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Current Item Input Fields */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-medium text-gray-800">
            {t("form.addNewItem")}
          </h3>

          {/* Part Name Input */}
          <FormInput
            label={t("form.fields.partName.label")}
            icon={Package}
            placeholder={t("form.fields.partName.placeholder")}
            error={errors.partName?.message}
            {...register("partName", { 
              required: "Part name is required",
              minLength: { value: 1, message: "Part name cannot be empty" }
            })}
          />

          {/* Quantity Input */}
          <FormInput
            label={t("form.fields.quantity.label")}
            type="number"
            icon={Hash}
            placeholder={t("form.fields.quantity.placeholder")}
            min="1"
            error={errors.quantity?.message}
            {...register("quantity", { 
              required: "Quantity is required",
              min: { value: 1, message: "Quantity must be at least 1" },
              valueAsNumber: true
            })}
          />
          
          <FormSubmissionButton isSubmitting={isSubmitting} />
        </div>

        {/* Display current form values for debugging */}
        <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
          <strong>Current Values:</strong>
          <pre>{JSON.stringify(watchedValues, null, 2)}</pre>
        </div>
      </form>

      {/* Additional Information */}
      <InformationPanel userType="shop" />
    </div>
  );
}