"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useTranslation } from "react-i18next";
import {
  addressSchema,
  addressDefaultValues,
  type AddressFormData,
} from "@/lib/validations/addressSchema";
import { useGetCitiesQuery } from "@/services/api";

interface AddressFormProps {
  // Form data
  initialData?: Partial<AddressFormData>;
  isEditing?: boolean;

  // Form behavior
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;

  // Loading states
  isSubmitting?: boolean;
  isCreating?: boolean;
  isUpdating?: boolean;

  // UI customization
  showCancelButton?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;

  // Form layout
  className?: string;
  formKey?: string | number;
}

export default function AddressForm({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isCreating = false,
  isUpdating = false,
  showCancelButton = true,
  submitButtonText,
  cancelButtonText,
  className = "",
  formKey,
}: AddressFormProps) {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  // Fetch cities from API with current locale
  const { data: citiesResponse } = useGetCitiesQuery(i18n.language);

  // Transform cities data to options format
  // Send city.key to backend, but display city.value (translated name) to user
  const cityOptions = useMemo(() => {
    if (!citiesResponse?.data?.cities) return [];
    return citiesResponse.data.cities.map((city) => ({
      value: city.key, // Send the key to backend
      label: city.value, // Display the translated name to user
      searchText: city.key, // Allow searching by English name too
    }));
  }, [citiesResponse]);

  // React Hook Form setup
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { ...addressDefaultValues, ...initialData },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = form;

  // Effect to handle form updates when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({ ...addressDefaultValues, ...initialData });
    }
  }, [initialData, reset]);

  // Handler for address type change
  const handleAddressTypeChange = (value: string) => {
    setValue("address_type", value as "home" | "office" | "other", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleFormSubmit = async (data: AddressFormData) => {
    try {
      const addressData = {
        ...data,
        is_default: data.is_default || false,
        address_type: data.address_type as "home" | "office" | "other",
      };
      await onSubmit(addressData);
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      reset(addressDefaultValues);
    }
  };

  const isLoading = isSubmitting || isCreating || isUpdating;

  return (
    <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
      <form
        key={formKey}
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`space-y-4 ${className}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address Type Select */}
          <FormSelect
            key={`address-type-${formKey}-${watch("address_type")}`}
            label={t("addresses.type")}
            placeholder={t("addresses.selectType", "Select address type")}
            value={watch("address_type")}
            onValueChange={handleAddressTypeChange}
            error={
              errors.address_type?.message
                ? t(errors.address_type.message)
                : undefined
            }
            required
            options={[
              { value: "home", label: t("addresses.home") },
              { value: "office", label: t("addresses.office") },
              { value: "other", label: t("addresses.other") },
            ]}
          />

          {/* Name Input */}
          <FormInput
            label={t("addresses.name")}
            placeholder={t("addresses.placeholders.fullName")}
            value={watch("name")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("name", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.name?.message ? t(errors.name.message) : undefined}
            required
          />

          {/* Phone Input */}
          <FormInput
            label={t("addresses.phone")}
            type="tel"
            placeholder={t("addresses.placeholders.phone")}
            value={watch("phone")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("phone", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.phone?.message ? t(errors.phone.message) : undefined}
            required
          />

          {/* City Select */}
          <SearchableSelect
            label={t("addresses.city")}
            placeholder={t("addresses.placeholders.city", "Select city")}
            searchPlaceholder={t(
              "addresses.placeholders.searchCity",
              "Search city..."
            )}
            value={watch("city")}
            onValueChange={(value) =>
              setValue("city", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            options={cityOptions}
            error={errors.city?.message ? t(errors.city.message) : undefined}
            required
          />

          {/* Detailed Address Textarea */}
          <div className="md:col-span-2">
            <FormInput
              label={t("addresses.address")}
              type="textarea"
              placeholder={t("addresses.placeholders.detailedAddress")}
              value={watch("detailed_address")}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setValue("detailed_address", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={
                errors.detailed_address?.message
                  ? t(errors.detailed_address.message)
                  : undefined
              }
              required
              rows={3}
            />
          </div>

          {/* Postal Code Input */}
          <FormInput
            label={t("addresses.postalCode")}
            placeholder={t("addresses.placeholders.postalCode")}
            value={watch("postal_code")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("postal_code", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.postal_code?.message
                ? t(errors.postal_code.message)
                : undefined
            }
            required
          />

          {/* National Address Input */}
          <FormInput
            label={t("addresses.nationalAddress")}
            placeholder={t("addresses.placeholders.nationalAddress")}
            value={watch("national_address")}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("national_address", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={
              errors.national_address?.message
                ? t(errors.national_address.message)
                : undefined
            }
            required
          />

          {/* Default Checkbox */}
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}>
            <input
              type="checkbox"
              id="is_default"
              checked={watch("is_default") || false}
              onChange={(e) =>
                setValue("is_default", e.target.checked, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="rounded"
            />
            <label htmlFor="is_default" className="text-sm text-gray-700">
              {t("addresses.default")}
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className={`flex gap-2 mt-6 ${isRTL ? "flex-row" : ""}`}>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitButtonText ||
              (isEditing ? t("addresses.update") : t("addresses.save"))}
          </Button>
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelButtonText || t("addresses.cancel")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
