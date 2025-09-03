"use client";

import { useState } from "react";
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
import { useTranslation } from "react-i18next";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "@/services/api";
import { showSuccess, showError } from "@/lib/toast";
import type { Address, CreateAddressRequest } from "@/services/api/types";

export default function AddressesPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    address_type: "home",
    name: "",
    phone: "",
    city: "",
    detailed_address: "",
    postal_code: "",
    is_default: false,
  });

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

  const addresses = addressesResponse?.data?.addresses || [];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAdd = async () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.city ||
      !formData.detailed_address ||
      !formData.postal_code
    ) {
      showError("Please fill in all required fields.");
      return;
    }

    try {
      await createAddress(formData).unwrap();
      showSuccess("Address added successfully!");
      resetForm();
      refetch();
    } catch (error) {
      showError("Failed to add address. Please try again.");
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      address_type: address.address_type,
      name: address.name,
      phone: address.phone,
      city: address.city,
      detailed_address: address.detailed_address,
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setEditingId(address.id);
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    // Basic validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.city ||
      !formData.detailed_address ||
      !formData.postal_code
    ) {
      showError("Please fill in all required fields.");
      return;
    }

    try {
      await updateAddress({
        id: editingId,
        ...formData,
      }).unwrap();
      showSuccess("Address updated successfully!");
      resetForm();
      refetch();
    } catch (error) {
      showError("Failed to update address. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      await deleteAddress(id).unwrap();
      showSuccess("Address deleted successfully!");
      refetch();
    } catch (error) {
      showError("Failed to delete address. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      address_type: "home",
      name: "",
      phone: "",
      city: "",
      detailed_address: "",
      postal_code: "",
      is_default: false,
    });
    setShowAddForm(false);
    setEditingId(null);
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
        <div className="text-red-600 mb-2">Failed to load addresses</div>
        <p className="text-gray-600 mb-4">
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2
          className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}
        >
          {t("addresses.title")}
        </h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("addresses.type")}
              </label>
              <select
                name="address_type"
                value={formData.address_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                <option value="home">{t("addresses.home")}</option>
                <option value="office">{t("addresses.office")}</option>
                <option value="other">{t("addresses.other")}</option>
              </select>
            </div>
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("addresses.name")} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={isRTL ? "الاسم الكامل" : "Full Name"}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("addresses.phone")} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder="+966 50 123 4567"
                dir="ltr"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("addresses.city")} *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={isRTL ? "الرياض" : "Riyadh"}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("addresses.address")} *
              </label>
              <textarea
                name="detailed_address"
                value={formData.detailed_address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
                rows={3}
                placeholder={
                  isRTL
                    ? "الشارع، الحي، المبنى، الطابق"
                    : "Street, District, Building, Floor"
                }
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("addresses.postalCode")} *
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder="12345"
                dir="ltr"
              />
            </div>
            <div
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="rounded"
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                {t("addresses.default")}
              </label>
            </div>
          </div>
          <div className={`flex gap-2 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={isCreating || isUpdating}
              className="flex items-center gap-2"
            >
              {(isCreating || isUpdating) && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {editingId ? t("addresses.save") : t("addresses.save")}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isCreating || isUpdating}
            >
              {t("addresses.cancel")}
            </Button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("addresses.noAddresses", "No addresses yet")}
          </h3>
          <p className="text-gray-500">
            {t(
              "addresses.addFirstAddress",
              "Add your first address to get started."
            )}
          </p>
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
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(address)}
                    disabled={isDeleting}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(address.id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700"
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
                    isRTL ? "flex-row-reverse" : ""
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
    </div>
  );
}
