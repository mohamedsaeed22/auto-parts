"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
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
}

// Zod schema for address validation
const createAddressSchema = (
  t: (key: string, fallback: string) => string,
  isRTL: boolean
) => {
  return z.object({
    first_name: z
      .string()
      .min(1, {
        message: isRTL
          ? "الاسم الأول مطلوب"
          : t(
              "addressSelection:validation.firstName.required",
              "First name is required"
            ),
      })
      .min(2, {
        message: isRTL
          ? "الاسم الأول يجب أن يكون على الأقل حرفين"
          : t(
              "addressSelection:validation.firstName.minLength",
              "First name must be at least 2 characters"
            ),
      }),
    last_name: z
      .string()
      .min(1, {
        message: isRTL
          ? "الاسم الأخير مطلوب"
          : t(
              "addressSelection:validation.lastName.required",
              "Last name is required"
            ),
      })
      .min(2, {
        message: isRTL
          ? "الاسم الأخير يجب أن يكون على الأقل حرفين"
          : t(
              "addressSelection:validation.lastName.minLength",
              "Last name must be at least 2 characters"
            ),
      }),
    phone: z
      .string()
      .min(1, {
        message: isRTL
          ? "رقم الهاتف مطلوب"
          : t(
              "addressSelection:validation.phone.required",
              "Phone number is required"
            ),
      })
      .regex(/^05\d{8}$/, {
        message: isRTL
          ? "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام (مثال: 0543777569)"
          : t(
              "addressSelection:validation.phone.invalid",
              "Phone must start with 05 and be 10 digits (e.g., 0543777569)"
            ),
      }),
    address: z
      .string()
      .min(1, {
        message: isRTL
          ? "العنوان مطلوب"
          : t(
              "addressSelection:validation.address.required",
              "Address is required"
            ),
      })
      .min(5, {
        message: isRTL
          ? "العنوان يجب أن يكون على الأقل 5 أحرف"
          : t(
              "addressSelection:validation.address.minLength",
              "Address must be at least 5 characters"
            ),
      }),
    apartment: z.string().min(1, {
      message: isRTL
        ? "الشقة مطلوبة"
        : t(
            "addressSelection:validation.apartment.required",
            "Apartment is required"
          ),
    }),
    city: z
      .string()
      .min(1, {
        message: isRTL
          ? "المدينة مطلوبة"
          : t("addressSelection:validation.city.required", "City is required"),
      })
      .min(2, {
        message: isRTL
          ? "المدينة يجب أن تكون على الأقل حرفين"
          : t(
              "addressSelection:validation.city.minLength",
              "City must be at least 2 characters"
            ),
      }),
    state: z
      .string()
      .min(1, {
        message: isRTL
          ? "المحافظة مطلوبة"
          : t(
              "addressSelection:validation.state.required",
              "State is required"
            ),
      })
      .min(2, {
        message: isRTL
          ? "المحافظة يجب أن تكون على الأقل حرفين"
          : t(
              "addressSelection:validation.state.minLength",
              "State must be at least 2 characters"
            ),
      }),
    country: z
      .string()
      .min(1, {
        message: isRTL
          ? "الدولة مطلوبة"
          : t(
              "addressSelection:validation.country.required",
              "Country is required"
            ),
      })
      .min(2, {
        message: isRTL
          ? "الدولة يجب أن تكون على الأقل حرفين"
          : t(
              "addressSelection:validation.country.minLength",
              "Country must be at least 2 characters"
            ),
      }),
    zip_code: z
      .string()
      .min(1, {
        message: isRTL
          ? "الرمز البريدي مطلوب"
          : t(
              "addressSelection:validation.zipCode.required",
              "ZIP code is required"
            ),
      })
      .regex(/^\d{5}$/, {
        message: isRTL
          ? "الرمز البريدي يجب أن يكون 5 أرقام"
          : t(
              "addressSelection:validation.zipCode.invalid",
              "ZIP code must be 5 digits"
            ),
      }),
  });
};

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
    "credit_card"
  );

  // React Hook Form with Zod validation
  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<NewAddressForm>({
    resolver: zodResolver(createAddressSchema(t, isRTL)),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      zip_code: "",
    },
  });

  // Reset form and step when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Reset everything when dialog closes
      setStep(1);
      setSelectedAddressId(null);
      setShowNewAddressForm(false);
      setPaymentMethod("credit_card");
      reset();
    }
  }, [isOpen, reset]);

  // Reset form when switching back from new address form
  useEffect(() => {
    if (!showNewAddressForm) {
      reset();
    }
  }, [showNewAddressForm, reset]);

  const { data: addressesResponse, isLoading: isLoadingAddresses } =
    useGetAddressesQuery();

  const addresses: Address[] = addressesResponse?.data?.addresses || [];

  const resetForm = () => {
    setStep(1);
    setSelectedAddressId(null);
    setShowNewAddressForm(false);
    setPaymentMethod("credit_card");
    reset();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isStep1Valid = () => {
    if (showNewAddressForm) {
      // Form is valid when there are no errors and all required fields have values
      return Object.keys(errors).length === 0;
    }
    return selectedAddressId !== null;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (showNewAddressForm) {
        // Trigger form validation
        handleSubmit(() => {
          setStep(2);
        })();
      } else if (selectedAddressId) {
        setStep(2);
      }
    }
  };

  const onFormSubmit = (formData: NewAddressForm) => {
    const data: Parameters<typeof onConfirm>[0] = {
      payment_method: paymentMethod,
      ...formData,
    };

    onConfirm(data);
  };

  const handleConfirm = () => {
    if (showNewAddressForm) {
      // Submit the form which will trigger validation and onFormSubmit if valid
      handleSubmit(onFormSubmit)();
    } else if (selectedAddressId) {
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
                    <FormInput
                      label={t("addressSelection:firstName", "First Name")}
                      placeholder={t(
                        "addressSelection:firstNamePlaceholder",
                        "Enter first name"
                      )}
                      value={watch("first_name")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("first_name", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.first_name?.message}
                      required
                      inputClassName="h-12"
                    />

                    <FormInput
                      label={t("addressSelection:lastName", "Last Name")}
                      placeholder={t(
                        "addressSelection:lastNamePlaceholder",
                        "Enter last name"
                      )}
                      value={watch("last_name")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("last_name", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.last_name?.message}
                      required
                      inputClassName="h-12"
                    />

                    <FormInput
                      label={t("addressSelection:phone", "Phone")}
                      type="tel"
                      placeholder="0543777569"
                      value={watch("phone")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("phone", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.phone?.message}
                      required
                      inputClassName="h-12"
                      dir="ltr"
                    />

                    <FormInput
                      label={t("addressSelection:zipCode", "ZIP Code")}
                      placeholder={t(
                        "addressSelection:zipCodePlaceholder",
                        "Enter ZIP code"
                      )}
                      value={watch("zip_code")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("zip_code", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.zip_code?.message}
                      required
                      inputClassName="h-12"
                    />

                    <FormInput
                      label={t("addressSelection:address", "Address")}
                      placeholder={t(
                        "addressSelection:addressPlaceholder",
                        "Enter street address"
                      )}
                      value={watch("address")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("address", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.address?.message}
                      required
                      inputClassName="h-12"
                      containerClassName="md:col-span-2"
                    />

                    <FormInput
                      label={t("addressSelection:apartment", "Apartment")}
                      placeholder={t(
                        "addressSelection:apartmentPlaceholder",
                        "Apartment, suite, etc."
                      )}
                      value={watch("apartment")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("apartment", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.apartment?.message}
                      required
                      inputClassName="h-12"
                    />

                    <FormInput
                      label={t("addressSelection:city", "City")}
                      placeholder={t(
                        "addressSelection:cityPlaceholder",
                        "Enter city"
                      )}
                      value={watch("city")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("city", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.city?.message}
                      required
                      inputClassName="h-12"
                    />

                    <FormInput
                      label={t("addressSelection:state", "State")}
                      placeholder={t(
                        "addressSelection:statePlaceholder",
                        "Enter state"
                      )}
                      value={watch("state")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("state", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.state?.message}
                      required
                      inputClassName="h-12"
                    />

                    <FormInput
                      label={t("addressSelection:country", "Country")}
                      placeholder={t(
                        "addressSelection:countryPlaceholder",
                        "Enter country"
                      )}
                      value={watch("country")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue("country", e.target.value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      error={errors.country?.message}
                      required
                      inputClassName="h-12"
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
