"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useGetDeliveryAmountQuery,
} from "@/services/api";
import {
  Loader2,
  MapPin,
  Plus,
  Check,
  CreditCard,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { Address } from "@/services/api/types";
import AddressForm from "@/components/address/AddressForm";
import type { AddressFormData } from "@/lib/validations/addressSchema";
import { showSuccess, showError } from "@/lib/toast";
import DeliveryAmountDisplay from "./DeliveryAmountDisplay";

interface AcceptRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    address_id: number;
    payment_method: "cash" | "credit_card";
  }) => void;
  isLoading?: boolean;
  requestId?: number;
}

export default function AcceptRequestDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  requestId,
}: AcceptRequestDialogProps) {
  const { t, i18n } = useTranslation(["userProfile", "addressSelection"]);
  const isRTL = i18n.language === "ar";

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit_card">(
    "credit_card"
  );

  // Reset form and step when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Reset everything when dialog closes
      setStep(1);
      setSelectedAddressId(null);
      setShowNewAddressForm(false);
      setPaymentMethod("credit_card");
    }
  }, [isOpen]);

  const {
    data: addressesResponse,
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses,
  } = useGetAddressesQuery();

  const addresses: Address[] = useMemo(
    () => addressesResponse?.data?.addresses || [],
    [addressesResponse]
  );

  // Create address mutation
  const [createAddress, { isLoading: isCreatingAddress }] =
    useCreateAddressMutation();

  // Get delivery amount query - call whenever an address is selected
  const {
    data: deliveryAmountResponse,
    isLoading: isLoadingDeliveryAmount,
    error: deliveryAmountError,
  } = useGetDeliveryAmountQuery(
    {
      requestId: requestId!,
      addressId: selectedAddressId!,
    },
    {
      skip: !requestId || !selectedAddressId,
    }
  );

  const deliveryAmount = deliveryAmountResponse?.data?.delivery_amount || 0;

  // Auto-select default address if no address is selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId && !showNewAddressForm) {
      const defaultAddress = addresses.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [addresses, selectedAddressId, showNewAddressForm]);

  const resetForm = () => {
    setStep(1);
    setSelectedAddressId(null);
    setShowNewAddressForm(false);
    setPaymentMethod("credit_card");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isStep1Valid = () => {
    return selectedAddressId !== null;
  };

  const handleNextStep = () => {
    if (step === 1 && selectedAddressId) {
      setStep(2);
    }
  };

  // Handle address form submission
  const handleAddressFormSubmit = async (formData: AddressFormData) => {
    try {
      // Ensure is_default is a boolean
      const addressData = {
        ...formData,
        is_default: formData.is_default ?? false,
      };

      const result = await createAddress(addressData).unwrap();

      if (result.data) {
        const newAddressId = result.data.id;

        // Show success message
        showSuccess(
          t("addresses.successCreate", "Address created successfully")
        );

        // Manually refetch addresses to ensure the new address is in the list
        await refetchAddresses();

        // Set the newly created address as selected AFTER refetching
        setSelectedAddressId(newAddressId);

        // Hide the form to show the addresses list with the new address selected
        setShowNewAddressForm(false);
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        t("addresses.errorCreate", "Failed to create address");
      showError(errorMessage);
    }
  };

  const handleConfirm = () => {
    if (selectedAddressId) {
      const data: Parameters<typeof onConfirm>[0] = {
        payment_method: paymentMethod,
        address_id: selectedAddressId,
      };
      onConfirm(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col"
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

        <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
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
                                  isRTL ? "flex-row justify-end" : "flex-row"
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

                  {/* Delivery Amount Display for Step 1 */}
                  {selectedAddressId && !showNewAddressForm && (
                    <DeliveryAmountDisplay
                      isLoading={isLoadingDeliveryAmount}
                      error={!!deliveryAmountError}
                      amount={deliveryAmount}
                      className="mt-4"
                    />
                  )}
                </div>
              )}

              {showNewAddressForm && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
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
                      disabled={isCreatingAddress}
                    >
                      {t("addressSelection:back", "Back")}
                    </Button>
                  </div>

                  <div className="[&>div]:!max-h-none [&>div]:!overflow-visible [&>div]:!pr-0">
                    <AddressForm
                      onSubmit={handleAddressFormSubmit}
                      onCancel={() => setShowNewAddressForm(false)}
                      isSubmitting={isCreatingAddress}
                      isCreating={isCreatingAddress}
                      showCancelButton={false}
                      submitButtonText={t(
                        "addressSelection:saveAndContinue",
                        "Save & Continue"
                      )}
                    />
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
                          className={`text-sm text-gray-600 mb-3 ${
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
                <div className="space-y-4">
                  {/* Delivery Amount Section */}
                  {selectedAddressId && !showNewAddressForm && (
                    <DeliveryAmountDisplay
                      isLoading={isLoadingDeliveryAmount}
                      error={!!deliveryAmountError}
                      amount={deliveryAmount}
                      className="mt-4"
                    />
                  )}

                  {/* Payment Note */}
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
              {!showNewAddressForm && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading || isCreatingAddress}
                  >
                    {t("addressSelection:cancel", "Cancel")}
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!isStep1Valid() || isLoading || isCreatingAddress}
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
              )}
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
