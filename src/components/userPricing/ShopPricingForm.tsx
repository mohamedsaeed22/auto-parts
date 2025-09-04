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
  partImagePreview: _,
  requestImagePreview: __,
  formImagePreview: ___,
  isSubmitting,
  onImageChange: ____,
  onRemoveImage: _____,
  onSubmit,
}: ShopPricingFormProps) {
  const { t } = useTranslation("userPricing");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = form;

  // Watch for current form values
  const currentPartName = watch("partName");
  const currentQuantity = watch("quantity");

  const handleFormSubmit = async (data: ShopPricingFormData) => {
    await onSubmit(data);
  };

  const handleAddItem = () => {
    if (currentPartName && currentQuantity) {
      // Get current items from form
      const currentItems = getValues("items") || [];

      // Add new item to the list
      const newItem = {
        partName: currentPartName,
        quantity: currentQuantity,
      };

      setValue("items", [...currentItems, newItem]);

      // Clear current form fields
      setValue("partName", "");
      setValue("quantity", "");
    }
  };

  const handleRemoveItem = (index: number) => {
    const currentItems = getValues("items") || [];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    setValue("items", updatedItems);
  };

  const currentItems = watch("items") || [];

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
            {...register("partName")}
          />

          {/* Quantity Input */}
          <FormInput
            label={t("form.fields.quantity.label")}
            type="number"
            icon={Hash}
            placeholder={t("form.fields.quantity.placeholder")}
            min="1"
            error={errors.quantity?.message}
            {...register("quantity")}
          />

          {/* Add Item Button */}
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={!currentPartName || !currentQuantity}
            className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("form.addItem")}
          </Button>
        </div>

        {/* Items List */}
        {currentItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-800">
              {t("form.itemsList")} ({currentItems.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {currentItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.partName}</p>
                    <p className="text-sm text-gray-600">
                      {t("form.fields.quantity.label")}: {item.quantity}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <FormSubmissionButton
          isSubmitting={isSubmitting}
          disabled={currentItems.length === 0}
        />
      </form>

      {/* Additional Information */}
      <InformationPanel userType="shop" />
    </div>
  );
}
