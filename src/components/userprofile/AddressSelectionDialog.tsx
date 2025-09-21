"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormSelect from "@/components/ui/FormSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAddressesQuery } from "@/services/api";
import { Loader2, MapPin, Plus, Check } from "lucide-react";
import type { Address } from "@/services/api/types";
import type { ApproveRequestRequest } from "@/services/api/requestsApi";

interface AddressSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (addressData: Omit<ApproveRequestRequest, "status">) => void;
  isLoading?: boolean;
}

interface NewAddressForm {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  notes: string;
}

export default function AddressSelectionDialog({
  isOpen,
  onClose,
  onSelectAddress,
  isLoading = false,
}: AddressSelectionDialogProps) {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState<NewAddressForm>({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    notes: "",
  });

  const { data: addressesResponse, isLoading: isLoadingAddresses } =
    useGetAddressesQuery();

  const addresses: Address[] = addressesResponse?.data?.addresses || [];

  const handleSelectExistingAddress = () => {
    if (selectedAddressId) {
      onSelectAddress({ address_id: selectedAddressId });
    }
  };

  const handleCreateNewAddress = () => {
    // Send the new address data directly to the request (don't save to user addresses)
    const fullAddressData = {
      address: newAddressForm.address,
      first_name: newAddressForm.first_name,
      last_name: newAddressForm.last_name,
      phone: newAddressForm.phone,
      apartment: newAddressForm.apartment,
      city: newAddressForm.city,
      state: newAddressForm.state,
      country: newAddressForm.country,
      zip_code: newAddressForm.zip_code,
      notes: newAddressForm.notes,
    };

    onSelectAddress(fullAddressData);
  };

  const handleInputChange = (field: keyof NewAddressForm, value: string) => {
    setNewAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setSelectedAddressId(null);
    setShowNewAddressForm(false);
    setNewAddressForm({
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
      notes: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = () => {
    if (showNewAddressForm) {
      return (
        newAddressForm.first_name &&
        newAddressForm.last_name &&
        newAddressForm.phone &&
        newAddressForm.address &&
        newAddressForm.city &&
        newAddressForm.country &&
        newAddressForm.zip_code
      );
    }
    return selectedAddressId !== null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin size={20} className="text-[#b3984a]" />
            {t("requests.addressSelection.title", "Select Delivery Address")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "requests.addressSelection.description",
              "Choose an existing address or add a new one for your request delivery."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Addresses */}
          {!showNewAddressForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t(
                    "requests.addressSelection.existingAddresses",
                    "Existing Addresses"
                  )}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewAddressForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  {t("requests.addressSelection.addNew", "Add New")}
                </Button>
              </div>

              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#b3984a]" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>
                    {t(
                      "requests.addressSelection.noAddresses",
                      "No addresses found"
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-[#b3984a] bg-[#b3984a]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {address.name}
                            </h4>
                            {address.is_default && (
                              <span className="bg-[#b3984a] text-white text-xs px-2 py-1 rounded">
                                {t(
                                  "requests.addressSelection.default",
                                  "Default"
                                )}
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded capitalize">
                              {address.address_type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {address.detailed_address}
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.postal_code}
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.phone}
                          </p>
                        </div>
                        {selectedAddressId === address.id && (
                          <Check
                            size={20}
                            className="text-[#b3984a] flex-shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* New Address Form */}
          {showNewAddressForm && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t("requests.addressSelection.newAddress", "New Address")}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewAddressForm(false)}
                >
                  {t("requests.addressSelection.back", "Back")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.firstName", "First Name")} *
                  </label>
                  <Input
                    value={newAddressForm.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    placeholder={t(
                      "requests.addressSelection.firstNamePlaceholder",
                      "Enter first name"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.lastName", "Last Name")} *
                  </label>
                  <Input
                    value={newAddressForm.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    placeholder={t(
                      "requests.addressSelection.lastNamePlaceholder",
                      "Enter last name"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.phone", "Phone")} *
                  </label>
                  <Input
                    value={newAddressForm.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={t(
                      "requests.addressSelection.phonePlaceholder",
                      "Enter phone number"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.zipCode", "ZIP Code")} *
                  </label>
                  <Input
                    value={newAddressForm.zip_code}
                    onChange={(e) =>
                      handleInputChange("zip_code", e.target.value)
                    }
                    placeholder={t(
                      "requests.addressSelection.zipCodePlaceholder",
                      "Enter ZIP code"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.address", "Address")} *
                  </label>
                  <Input
                    value={newAddressForm.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder={t(
                      "requests.addressSelection.addressPlaceholder",
                      "Enter street address"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.apartment", "Apartment")}
                  </label>
                  <Input
                    value={newAddressForm.apartment}
                    onChange={(e) =>
                      handleInputChange("apartment", e.target.value)
                    }
                    placeholder={t(
                      "requests.addressSelection.apartmentPlaceholder",
                      "Apartment, suite, etc."
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.city", "City")} *
                  </label>
                  <Input
                    value={newAddressForm.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder={t(
                      "requests.addressSelection.cityPlaceholder",
                      "Enter city"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.state", "State")}
                  </label>
                  <Input
                    value={newAddressForm.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder={t(
                      "requests.addressSelection.statePlaceholder",
                      "Enter state"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.country", "Country")} *
                  </label>
                  <Input
                    value={newAddressForm.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    placeholder={t(
                      "requests.addressSelection.countryPlaceholder",
                      "Enter country"
                    )}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requests.addressSelection.notes", "Notes")}
                  </label>
                  <Input
                    value={newAddressForm.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder={t(
                      "requests.addressSelection.notesPlaceholder",
                      "Additional delivery instructions"
                    )}
                    className="h-12"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t("requests.addressSelection.cancel", "Cancel")}
          </Button>
          <Button
            onClick={
              showNewAddressForm
                ? handleCreateNewAddress
                : handleSelectExistingAddress
            }
            disabled={!isFormValid() || isLoading}
            className="bg-[#b3984a] hover:bg-[#b3984a]/90"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {showNewAddressForm
              ? t(
                  "requests.addressSelection.createAndSelect",
                  "Create & Select"
                )
              : t("requests.addressSelection.selectAddress", "Select Address")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
