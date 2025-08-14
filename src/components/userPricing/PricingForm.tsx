import { useRef } from "react";
import { Package, User, Hash, Car } from "lucide-react";
import { UseFormReturn, Control } from "react-hook-form";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";
import { UserTypeSelector } from "./UserTypeSelector";
import { ImageUpload } from "@/components/ui";
import FormInput from "@/components/ui/FormInput";
import { FormSubmissionButton } from "./FormSubmissionButton";
import { InformationPanel } from "./InformationPanel";

interface PricingFormProps {
  form: UseFormReturn<UserPricingFormData>;
  userType: string;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  isSubmitting: boolean;
  onImageChange: (
    file: File | undefined,
    field: "partImage" | "requestImage" | "formImage"
  ) => void;
  onRemoveImage: (field: "partImage" | "requestImage" | "formImage") => void;
  onSubmit: (data: UserPricingFormData) => void;
}

export function PricingForm({
  form,
  userType,
  partImagePreview,
  requestImagePreview,
  formImagePreview,
  isSubmitting,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: PricingFormProps) {
  const partImageInputRef = useRef<HTMLInputElement>(null);
  const requestImageInputRef = useRef<HTMLInputElement>(null);
  const formImageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const resetImageInputs = () => {
    if (partImageInputRef.current) partImageInputRef.current.value = "";
    if (requestImageInputRef.current) requestImageInputRef.current.value = "";
    if (formImageInputRef.current) formImageInputRef.current.value = "";
  };

  const handleFormSubmit = async (data: UserPricingFormData) => {
    await onSubmit(data);
    resetImageInputs();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-logo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="text-logo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-semibold text-logo-black mb-2">
          نموذج طلب التسعير
        </h2>
        <p className="text-gray-600">
          املأ النموذج أدناه وسيتم حفظ البيانات على اليسار
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* User Type Selection */}
        <UserTypeSelector control={control} />

        {/* Part Name Input */}
        <FormInput
          label="اسم القطعة"
          icon={Package}
          placeholder="أدخل اسم القطعة المطلوبة"
          error={errors.partName?.message}
          {...register("partName")}
        />

        {/* User Code Input - Only for Workshop */}
        {userType === "workshop" && (
          <>
            <FormInput
              label="كود الورشة"
              icon={User}
              placeholder="أدخل كود الورشة الخاص بك"
              helpText="يمكنك تغيير الكود للحصول على نقاط إضافية"
              error={errors.userCode?.message}
              {...register("userCode")}
            />

            {/* Part Image Upload */}
            <ImageUpload
              ref={partImageInputRef}
              id="partImage"
              label="صورة القطعة"
              preview={partImagePreview}
              onImageChange={(file) => onImageChange(file, "partImage")}
              onRemoveImage={() => onRemoveImage("partImage")}
              error={errors.partImage?.message}
            />

            {/* Request Image Upload */}
            <ImageUpload
              ref={requestImageInputRef}
              id="requestImage"
              label="صورة الطلب"
              preview={requestImagePreview}
              onImageChange={(file) => onImageChange(file, "requestImage")}
              onRemoveImage={() => onRemoveImage("requestImage")}
              error={errors.requestImage?.message}
            />

            {/* Form Image Upload */}
            <ImageUpload
              ref={formImageInputRef}
              id="formImage"
              label="صورة الاستمارة"
              preview={formImagePreview}
              onImageChange={(file) => onImageChange(file, "formImage")}
              onRemoveImage={() => onRemoveImage("formImage")}
              error={errors.formImage?.message}
            />
          </>
        )}

        {/* Quantity Input */}
        <FormInput
          label="الكمية"
          type="number"
          icon={Hash}
          placeholder="أدخل الكمية المطلوبة"
          min="1"
          error={errors.quantity?.message}
          {...register("quantity")}
        />

        {/* Chassis Number Input - Only for Workshop */}
        {userType === "workshop" && (
          <FormInput
            label="رقم الهيكل"
            icon={Car}
            placeholder="أدخل رقم الهيكل"
            helpText="رقم الهيكل يساعد في تحديد القطعة المناسبة لسيارتك"
            error={errors.chassisNumber?.message}
            {...register("chassisNumber")}
          />
        )}

        {/* Submit Button */}
        <FormSubmissionButton
          isSubmitting={isSubmitting}
        />
      </form>

      {/* Additional Information */}
      <InformationPanel userType={userType} />
    </div>
  );
}
