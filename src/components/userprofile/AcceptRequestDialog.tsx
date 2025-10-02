"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAddressesQuery } from "@/services/api";
import {
  Loader2,
  MapPin,
  Plus,
  Check,
  CreditCard,
  Wallet,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { Address } from "@/services/api/types";

interface AcceptRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    address_id?: number;
    payment_method: "cash" | "credit_card";
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    apartment?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
    notes?: string;
  }) => void;
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

export default function AcceptRequestDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: AcceptRequestDialogProps) {
  const { t, i18n } = useTranslation(["userProfile", "addressSelection"]);
  const isRTL = i18n.language === "ar";

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit_card">(
    "cash"
  );
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

  const handleInputChange = (field: keyof NewAddressForm, value: string) => {
    setNewAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setStep(1);
    setSelectedAddressId(null);
    setShowNewAddressForm(false);
    setPaymentMethod("cash");
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

  const isStep1Valid = () => {
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

  const handleNextStep = () => {
    if (step === 1 && isStep1Valid()) {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    const data: Parameters<typeof onConfirm>[0] = {
      payment_method: paymentMethod,
    };

    if (showNewAddressForm) {
      // Add all new address fields
      Object.assign(data, {
        first_name: newAddressForm.first_name,
        last_name: newAddressForm.last_name,
        phone: newAddressForm.phone,
        address: newAddressForm.address,
        apartment: newAddressForm.apartment,
        city: newAddressForm.city,
        state: newAddressForm.state,
        country: newAddressForm.country,
        zip_code: newAddressForm.zip_code,
        notes: newAddressForm.notes,
      });
    } else if (selectedAddressId) {
      data.address_id = selectedAddressId;
    }

    onConfirm(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-hidden"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {step === 1 ? (
              <>
                <MapPin size={20} className="text-[#b3984a]" />
                {t("addressSelection:title", "Select Delivery Address")}
              </>
            ) : (
              <>
                <CreditCard size={20} className="text-[#b3984a]" />
                {t(
                  "requests.acceptDialog.paymentTitle",
                  "Select Payment Method"
                )}
              </>
            )}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {step === 1
              ? t(
                  "addressSelection:description",
                  "Choose an existing address or add a new one for your request delivery."
                )
              : t(
                  "requests.acceptDialog.paymentDescription",
                  "Choose how you want to pay for this request."
                )}
          </DialogDescription>

          {/* Step Indicator */}
          <div
            className={`flex items-center gap-2 pt-4 ${
              isRTL ? "flex-row" : "flex-row"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                step === 1 ? "text-[#b3984a]" : "text-green-600"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step === 1
                    ? "bg-[#b3984a] text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {step === 1 ? "1" : <Check size={16} />}
              </div>
              <span className="text-sm font-medium">
                {t("requests.acceptDialog.step1", "Address")}
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200">
              <div
                className={`h-full transition-all duration-300 ${
                  step === 2 ? "bg-[#b3984a] w-full" : "w-0"
                } ${isRTL ? "origin-right" : "origin-left"}`}
              />
            </div>
            <div
              className={`flex items-center gap-2 ${
                step === 2 ? "text-[#b3984a]" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  step === 2
                    ? "bg-[#b3984a] text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">
                {t("requests.acceptDialog.step2", "Payment")}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
          {/* Step 1: Address Selection */}
          {step === 1 && (
            <>
              {!showNewAddressForm && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-lg font-medium text-gray-900 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {t(
                        "addressSelection:existingAddresses",
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
                      {t("addressSelection:addNew", "Add New")}
                    </Button>
                  </div>

                  {isLoadingAddresses ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#b3984a]" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin
                        size={48}
                        className="mx-auto mb-2 text-gray-300"
                      />
                      <p className={isRTL ? "text-right" : "text-left"}>
                        {t(
                          "addressSelection:noAddresses",
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
                          <div
                            className={`flex items-start justify-between ${
                              isRTL ? "flex-row" : "flex-row"
                            }`}
                          >
                            <div className="flex-1">
                              <div
                                className={`flex items-center gap-2 mb-2 ${
                                  isRTL
                                    ? "flex-row justify-end"
                                    : "flex-row"
                                }`}
                              >
                                <h4
                                  className={`font-medium text-gray-900 ${
                                    isRTL ? "text-right" : "text-left"
                                  }`}
                                >
                                  {address.name}
                                </h4>
                                {address.is_default && (
                                  <span className="bg-[#b3984a] text-white text-xs px-2 py-1 rounded">
                                    {t("addressSelection:default", "Default")}
                                  </span>
                                )}
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded capitalize">
                                  {address.address_type}
                                </span>
                              </div>
                              <p
                                className={`text-sm text-gray-600 mb-1 ${
                                  isRTL ? "text-right" : "text-left"
                                }`}
                              >
                                {address.detailed_address}
                              </p>
                              <p
                                className={`text-sm text-gray-500 ${
                                  isRTL ? "text-right" : "text-left"
                                }`}
                              >
                                {address.city}, {address.postal_code}
                              </p>
                              <p
                                className={`text-sm text-gray-500 ${
                                  isRTL ? "text-right" : "text-left"
                                }`}
                              >
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

              {showNewAddressForm && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-lg font-medium text-gray-900 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {t("addressSelection:newAddress", "New Address")}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewAddressForm(false)}
                    >
                      {t("addressSelection:back", "Back")}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:firstName", "First Name")} *
                      </label>
                      <Input
                        value={newAddressForm.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:firstNamePlaceholder",
                          "Enter first name"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:lastName", "Last Name")} *
                      </label>
                      <Input
                        value={newAddressForm.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:lastNamePlaceholder",
                          "Enter last name"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:phone", "Phone")} *
                      </label>
                      <Input
                        value={newAddressForm.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:phonePlaceholder",
                          "Enter phone number"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:zipCode", "ZIP Code")} *
                      </label>
                      <Input
                        value={newAddressForm.zip_code}
                        onChange={(e) =>
                          handleInputChange("zip_code", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:zipCodePlaceholder",
                          "Enter ZIP code"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:address", "Address")} *
                      </label>
                      <Input
                        value={newAddressForm.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:addressPlaceholder",
                          "Enter street address"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:apartment", "Apartment")}
                      </label>
                      <Input
                        value={newAddressForm.apartment}
                        onChange={(e) =>
                          handleInputChange("apartment", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:apartmentPlaceholder",
                          "Apartment, suite, etc."
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:city", "City")} *
                      </label>
                      <Input
                        value={newAddressForm.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:cityPlaceholder",
                          "Enter city"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:state", "State")}
                      </label>
                      <Input
                        value={newAddressForm.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:statePlaceholder",
                          "Enter state"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:country", "Country")} *
                      </label>
                      <Input
                        value={newAddressForm.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:countryPlaceholder",
                          "Enter country"
                        )}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label
                        className={`block text-sm font-medium text-gray-700 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t("addressSelection:notes", "Notes")}
                      </label>
                      <Input
                        value={newAddressForm.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        placeholder={t(
                          "addressSelection:notesPlaceholder",
                          "Additional delivery instructions"
                        )}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2: Payment Method Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h3
                className={`text-lg font-medium text-gray-900 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t(
                  "requests.acceptDialog.choosePayment",
                  "Choose your payment method"
                )}
              </h3>

              <div className="space-y-3">
                {/* Cash Payment */}
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cash"
                      ? "border-[#b3984a] bg-[#b3984a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <div
                    className={`flex items-start justify-between ${
                      isRTL ? "flex-row" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-4 ${
                        isRTL ? "flex-row" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === "cash"
                            ? "bg-[#b3984a] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Wallet size={24} />
                      </div>
                      <div>
                        <h4
                          className={`font-medium text-gray-900 mb-1 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t(
                            "requests.acceptDialog.cashPayment",
                            "Cash on Delivery"
                          )}
                        </h4>
                        <p
                          className={`text-sm text-gray-600 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t(
                            "requests.acceptDialog.cashDescription",
                            "Pay with cash when your order is delivered"
                          )}
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "cash" && (
                      <Check
                        size={20}
                        className="text-[#b3984a] flex-shrink-0"
                      />
                    )}
                  </div>
                </div>

                {/* Credit Card Payment */}
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "credit_card"
                      ? "border-[#b3984a] bg-[#b3984a]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPaymentMethod("credit_card")}
                >
                  <div
                    className={`flex items-start justify-between ${
                      isRTL ? "flex-row" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-4 ${
                        isRTL ? "flex-row" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          paymentMethod === "credit_card"
                            ? "bg-[#b3984a] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <h4
                          className={`font-medium text-gray-900 mb-1 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t(
                            "requests.acceptDialog.creditCardPayment",
                            "Credit Card"
                          )}
                        </h4>
                        <p
                          className={`text-sm text-gray-600 ${
                            isRTL ? "text-right" : "text-left"
                          }`}
                        >
                          {t(
                            "requests.acceptDialog.creditCardDescription",
                            "Pay securely online with your credit card"
                          )}
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "credit_card" && (
                      <Check
                        size={20}
                        className="text-[#b3984a] flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p
                    className={`text-sm text-blue-800 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t(
                      "requests.acceptDialog.creditCardNote",
                      "You will be redirected to a secure payment page to complete your transaction."
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter
          className={`flex gap-2 ${isRTL ? "flex-row" : "flex-row"}`}
        >
          {step === 1 ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                {t("addressSelection:cancel", "Cancel")}
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!isStep1Valid() || isLoading}
                className="bg-[#b3984a] hover:bg-[#b3984a]/90"
              >
                {t("requests.acceptDialog.next", "Next")}
                {isRTL ? (
                  <ChevronLeft size={16} className="ml-2" />
                ) : (
                  <ChevronRight size={16} className="ml-2" />
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                {isRTL ? (
                  <ChevronRight size={16} className="mr-2" />
                ) : (
                  <ChevronLeft size={16} className="mr-2" />
                )}
                {t("requests.acceptDialog.back", "Back")}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading && (
                  <Loader2
                    className={`h-4 w-4 animate-spin ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                )}
                {t("requests.acceptDialog.confirm", "Accept Request")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
