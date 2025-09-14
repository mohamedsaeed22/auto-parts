"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Building,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { useTranslation } from "react-i18next";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "@/services/api";
import { showSuccess, showError } from "@/lib/toast";
import {
  addressSchema,
  addressDefaultValues,
  type AddressFormData,
} from "@/lib/validations/addressSchema";
import type { Address } from "@/services/api/types";

export default function AddressesPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [formKey, setFormKey] = useState(0);

  // React Hook Form setup
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressDefaultValues,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = form;

  // Handler for address type change
  const handleAddressTypeChange = (value: string) => {
    console.log("Address type changed to:", value); // Debug log
    setValue("address_type", value as "home" | "office" | "other", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // API hooks
  const {
    data: addressesResponse,
    isLoading,
    error,
    refetch,
  } = useGetAddressesQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const addresses = useMemo(
    () => addressesResponse?.data?.addresses || [],
    [addressesResponse?.data?.addresses]
  );

  // Effect to handle form updates when editing
  useEffect(() => {
    if (editingId && addresses.length > 0) {
      const addressToEdit = addresses.find((addr) => addr.id === editingId);
      if (addressToEdit) {
        console.log("useEffect setting values for:", addressToEdit); // Debug log
        // Use reset with the address data
        reset({
          address_type: addressToEdit.address_type,
          name: addressToEdit.name,
          phone: addressToEdit.phone,
          city: addressToEdit.city,
          detailed_address: addressToEdit.detailed_address,
          postal_code: addressToEdit.postal_code,
          is_default: addressToEdit.is_default,
        });
      }
    }
  }, [editingId, addresses, reset]);

  // Effect to track form value changes
  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      console.log("Form submitted with data:", data); // Debug log
      console.log("Editing ID:", editingId); // Debug log

      const addressData = {
        ...data,
        is_default: data.is_default || false,
        address_type: data.address_type as "home" | "office" | "other",
      };

      console.log("Address data to send:", addressData); // Debug log

      if (editingId) {
        console.log("Updating address with ID:", editingId); // Debug log
        await updateAddress({
          id: editingId,
          ...addressData,
        }).unwrap();
        showSuccess(t("addresses.success.updateSuccess"));
      } else {
        console.log("Creating new address"); // Debug log
        await createAddress(addressData).unwrap();
        showSuccess(t("addresses.success.addSuccess"));
      }
      resetForm();
      refetch();
    } catch (error) {
      console.error("Form submission error:", error); // Debug log
      showError(
        editingId
          ? t("addresses.errors.updateFailed")
          : t("addresses.errors.addFailed")
      );
    }
  };

  const handleEdit = (address: Address) => {
    console.log("Editing address:", address); // Debug log

    // Set editing state - useEffect will handle form population
    setEditingId(address.id);
    setShowAddForm(true);
    setFormKey((prev) => prev + 1); // Force form re-render
  };

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteAddress(pendingDeleteId).unwrap();
      showSuccess(t("addresses.success.deleteSuccess"));
      setShowDeleteDialog(false);
      setPendingDeleteId(null);
      refetch();
    } catch {
      showError(t("addresses.errors.deleteFailed"));
    }
  };

  const resetForm = () => {
    reset(addressDefaultValues);
    setShowAddForm(false);
    setEditingId(null);
    setFormKey((prev) => prev + 1); // Force form re-render
  };

  const handleCancel = () => {
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-2">
          {t("addresses.errors.loadFailed")}
        </div>
        <p className="text-gray-600 mb-4">
          {t(
            "addresses.errors.retryMessage",
            "Please try refreshing the page or contact support if the problem persists."
          )}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          {t("addresses.errors.retry", "Retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 ${
          isRTL ? "sm:flex-row" : ""
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("addresses.title")}
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
          disabled={isCreating || isUpdating}
        >
          <Plus size={16} />
          {t("addresses.addAddress")}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3
            className={`text-lg font-semibold mb-4 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {editingId ? t("addresses.editAddress") : t("addresses.addAddress")}
          </h3>

          <form
            key={formKey}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
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
                error={
                  errors.name?.message ? t(errors.name.message) : undefined
                }
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
                error={
                  errors.phone?.message ? t(errors.phone.message) : undefined
                }
                required
              />

              {/* City Input */}
              <FormInput
                label={t("addresses.city")}
                placeholder={t("addresses.placeholders.city")}
                value={watch("city")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue("city", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={
                  errors.city?.message ? t(errors.city.message) : undefined
                }
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

              {/* Default Checkbox */}
              <div className={`flex items-center gap-2 flex-row`}>
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
            <div className={`flex gap-2 mt-6 flex-row`}>
              <Button
                type="submit"
                disabled={isSubmitting || isCreating || isUpdating}
                className="flex items-center gap-2"
              >
                {(isSubmitting || isCreating || isUpdating) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {editingId ? t("addresses.update") : t("addresses.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting || isCreating || isUpdating}
              >
                {t("addresses.cancel")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("addresses.noAddresses")}
          </h3>
          <p className="text-gray-500">{t("addresses.addFirstAddress")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div
                className={`flex justify-between items-start mb-3 ${
                  isRTL ? "flex-row" : ""
                }`}
              >
                <div className={`flex gap-2 flex-row`}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(address)}
                    disabled={isDeleting}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                    title={t("addresses.edit", "Edit")}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(address.id)}
                    disabled={isDeleting}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                    title={t("addresses.delete", "Delete")}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row" : ""
                  }`}
                >
                  {address.address_type === "home" ? (
                    <Home size={16} />
                  ) : address.address_type === "office" ? (
                    <Building size={16} />
                  ) : (
                    <MapPin size={16} />
                  )}
                  <span className="text-sm font-medium">
                    {address.address_type === "home"
                      ? t("addresses.home")
                      : address.address_type === "office"
                      ? t("addresses.office")
                      : t("addresses.other")}
                  </span>
                  {address.is_default && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {t("addresses.default")}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                <div className="font-medium">{address.name}</div>
                <div className="text-sm text-gray-600">{address.phone}</div>
                <div className="text-sm text-gray-600">
                  {address.detailed_address}
                </div>
                <div className="text-sm text-gray-600">
                  {address.city} - {address.postal_code}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Delete Address Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t("addresses.deleteTitle")}
        description={t("addresses.deleteDescription")}
        cancelLabel={t("addresses.cancel")}
        confirmLabel={t("addresses.confirm")}
        onConfirm={confirmDelete}
        confirmDisabled={isDeleting}
        confirmVariant="destructive"
        dir={isRTL ? "rtl" : "ltr"}
      />
    </div>
  );
}
